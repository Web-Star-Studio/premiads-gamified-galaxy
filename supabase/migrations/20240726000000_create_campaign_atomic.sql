-- atomic function to create a campaign and debit credits

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
returns uuid as $$
declare
  advertiser_id uuid := auth.uid();
  total_debit_amount int := p_rifas * p_max_participants;
  current_rifas int;
  new_campaign_id uuid;
begin
  -- 1. check if advertiser has enough rifas
  select rifas into current_rifas from public.profiles
  where id = advertiser_id;

  if current_rifas is null or current_rifas < total_debit_amount then
    raise exception 'insufficient rifas balance';
  end if;

  -- 2. debit the rifas from the advertiser's profile
  update public.profiles
  set rifas = rifas - total_debit_amount
  where id = advertiser_id;

  -- 3. insert the new campaign
  insert into public.campaigns (
    user_id, title, description, type, target_audience, requirements,
    start_date, end_date, has_badges, has_lootbox,
    streak_bonus, streak_multiplier, random_points, points_range,
    rifas_per_participant, tickets_reward, cashback_reward, max_participants,
    cashback_per_raffle, target_filter, badge_image_url,
    min_purchase, lootbox_rewards, form_schema
  )
  values (
    advertiser_id, p_title, p_description, p_type, p_audience, p_requirements,
    p_start_date, p_end_date, p_has_badges, p_has_lootbox,
    p_streak_bonus, p_streak_multiplier, p_random_points, p_points_range,
    p_rifas, p_tickets_reward, p_cashback_reward, p_max_participants,
    p_cashback_amount_per_raffle, p_target_filter, p_badge_image_url,
    p_min_purchase, p_selected_loot_box_rewards, p_form_schema
  ) returning id into new_campaign_id;

  return new_campaign_id;
end;
$$ language plpgsql security definer set search_path = public; 