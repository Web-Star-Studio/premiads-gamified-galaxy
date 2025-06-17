-- Security improvements migration
-- This addresses common security advisors findings

-- 1. Ensure RLS is enabled on all public tables
alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_missions enable row level security;
alter table public.user_missions enable row level security;
alter table public.user_badges enable row level security;
alter table public.mission_submissions enable row level security;

-- 2. Create comprehensive RLS policies for profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 3. Create RLS policies for campaigns
drop policy if exists "Advertisers can view own campaigns" on public.campaigns;
create policy "Advertisers can view own campaigns" on public.campaigns
  for select using (auth.uid() = user_id);

drop policy if exists "Users can view active campaigns" on public.campaigns;
create policy "Users can view active campaigns" on public.campaigns
  for select using (
    status = 'active' 
    and start_date <= now() 
    and end_date > now()
  );

drop policy if exists "Advertisers can create campaigns" on public.campaigns;
create policy "Advertisers can create campaigns" on public.campaigns
  for insert with check (auth.uid() = user_id);

drop policy if exists "Advertisers can update own campaigns" on public.campaigns;
create policy "Advertisers can update own campaigns" on public.campaigns
  for update using (auth.uid() = user_id);

-- 4. Create RLS policies for campaign_missions
drop policy if exists "Everyone can view campaign missions" on public.campaign_missions;
create policy "Everyone can view campaign missions" on public.campaign_missions
  for select using (true);

drop policy if exists "Campaign owners can manage missions" on public.campaign_missions;
create policy "Campaign owners can manage missions" on public.campaign_missions
  for all using (
    exists (
      select 1 from public.campaigns 
      where id = campaign_id 
      and user_id = auth.uid()
    )
  );

-- 5. Create RLS policies for user_missions
drop policy if exists "Users can view own missions" on public.user_missions;
create policy "Users can view own missions" on public.user_missions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can update own missions" on public.user_missions;
create policy "Users can update own missions" on public.user_missions
  for update using (auth.uid() = user_id);

drop policy if exists "System can create user missions" on public.user_missions;
create policy "System can create user missions" on public.user_missions
  for insert with check (true);

-- 6. Create RLS policies for user_badges
drop policy if exists "Users can view own badges" on public.user_badges;
create policy "Users can view own badges" on public.user_badges
  for select using (auth.uid() = user_id);

drop policy if exists "System can create user badges" on public.user_badges;
create policy "System can create user badges" on public.user_badges
  for insert with check (true);

-- 7. Create RLS policies for mission_submissions
drop policy if exists "Users can view own submissions" on public.mission_submissions;
create policy "Users can view own submissions" on public.mission_submissions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can create submissions" on public.mission_submissions;
create policy "Users can create submissions" on public.mission_submissions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Campaign owners can view submissions" on public.mission_submissions;
create policy "Campaign owners can view submissions" on public.mission_submissions
  for select using (
    exists (
      select 1 from public.campaigns c
      join public.campaign_missions cm on c.id = cm.campaign_id
      where cm.id = mission_id
      and c.user_id = auth.uid()
    )
  );

-- 8. Update the atomic function with better security
create or replace function create_campaign_and_debit_credits(
  p_title text,
  p_description text,
  p_type text,
  p_audience text,
  p_requirements jsonb,
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_has_badges boolean,
  p_has_lootbox boolean,
  p_streak_bonus boolean,
  p_streak_multiplier numeric,
  p_random_points boolean,
  p_points_range int[],
  p_rifas int,
  p_tickets_reward int,
  p_cashback_reward numeric,
  p_max_participants int,
  p_cashback_amount_per_raffle numeric,
  p_target_filter jsonb,
  p_badge_image_url text,
  p_min_purchase numeric,
  p_selected_loot_box_rewards text[],
  p_form_schema jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  advertiser_id uuid := auth.uid();
  total_debit_amount int := p_rifas * p_max_participants;
  current_rifas int;
  new_campaign_id uuid;
begin
  -- Input validation
  if advertiser_id is null then
    raise exception 'Authentication required';
  end if;
  
  if p_title is null or trim(p_title) = '' then
    raise exception 'Campaign title is required';
  end if;
  
  if p_rifas <= 0 or p_max_participants <= 0 then
    raise exception 'Invalid rifas or participants count';
  end if;

  -- 1. check if advertiser has enough rifas
  select rifas into current_rifas from public.profiles
  where id = advertiser_id;

  if current_rifas is null or current_rifas < total_debit_amount then
    raise exception 'Insufficient rifas balance. Required: %, Available: %', 
      total_debit_amount, coalesce(current_rifas, 0);
  end if;

  -- 2. debit the rifas from the advertiser's profile
  update public.profiles
  set rifas = rifas - total_debit_amount,
      updated_at = now()
  where id = advertiser_id;

  -- 3. insert the new campaign
  insert into public.campaigns (
    user_id, title, description, type, target_audience, requirements,
    start_date, end_date, has_badges, has_lootbox,
    streak_bonus, streak_multiplier, random_points, points_range,
    rifas_per_participant, tickets_reward, cashback_reward, max_participants,
    cashback_per_raffle, target_filter, badge_image_url,
    min_purchase, lootbox_rewards, form_schema,
    status, created_at, updated_at
  )
  values (
    advertiser_id, p_title, p_description, p_type, p_audience, p_requirements,
    p_start_date, p_end_date, p_has_badges, p_has_lootbox,
    p_streak_bonus, p_streak_multiplier, p_random_points, p_points_range,
    p_rifas, p_tickets_reward, p_cashback_reward, p_max_participants,
    p_cashback_amount_per_raffle, p_target_filter, p_badge_image_url,
    p_min_purchase, p_selected_loot_box_rewards, p_form_schema,
    'draft', now(), now()
  ) returning id into new_campaign_id;

  return new_campaign_id;
end;
$$;

-- 9. Grant necessary permissions
grant execute on function create_campaign_and_debit_credits to authenticated;

-- 10. Create a function to safely get user profile
create or replace function get_user_profile(user_id uuid default auth.uid())
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if user_id is null then
    raise exception 'Authentication required';
  end if;
  
  return (
    select json_build_object(
      'id', id,
      'username', username,
      'email', email,
      'rifas', rifas,
      'tickets', tickets,
      'points', points,
      'level', level,
      'role', role,
      'created_at', created_at,
      'updated_at', updated_at
    )
    from public.profiles 
    where id = user_id
  );
end;
$$;

grant execute on function get_user_profile to authenticated; 