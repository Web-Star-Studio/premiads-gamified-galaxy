import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const JSON_HEADER = {
  "Content-Type": "application/json"
};

const CORS = {
  ...JSON_HEADER,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const map = (t: string) => !t ? 'all' : 
  t.toLowerCase().startsWith('anun') || t.startsWith('advert') ? 'anunciante' : 
  t.toLowerCase().startsWith('part') ? 'participante' : 'all';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('bad json', { status: 400, headers: CORS });
  }

  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (token) {
    await sb.auth.setSession({
      access_token: token,
      refresh_token: ''
    });
  }

  switch (body.action) {
    case 'send_notification': {
      const target = map(body.target_type);
      const { data, error } = await sb.rpc('send_notification_to_users', {
        p_title: body.title,
        p_message: body.message,
        p_target_type: target
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: CORS
        });
      }

      return new Response(JSON.stringify({
        success: true,
        target,
        recipients_count: data?.[0]?.recipients_count ?? 0
      }), { headers: CORS });
    }

    case 'get_settings': {
      const { data, error } = await sb
        .from('admin_notification_settings')
        .select('setting_key,setting_value,description');

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: CORS
        });
      }

      const settings = data.reduce((a: any, r: any) => {
        a[r.setting_key] = r.setting_value;
        return a;
      }, {});

      return new Response(JSON.stringify(settings), { headers: CORS });
    }

    case 'update_settings': {
      const { settings } = body;
      if (!settings || typeof settings !== 'object') {
        return new Response(JSON.stringify({ error: 'Settings object required' }), {
          status: 400,
          headers: CORS
        });
      }

      try {
        for (const [key, value] of Object.entries(settings)) {
          const { error } = await sb
            .from('admin_notification_settings')
            .update({ setting_value: value, updated_at: new Date().toISOString() })
            .eq('setting_key', key);

          if (error) throw error;
        }

        return new Response(JSON.stringify({ success: true }), { headers: CORS });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: CORS
        });
      }
    }

    case 'get_notifications_history': {
      const { page = 1, limit = 20 } = body;
      const offset = (page - 1) * limit;

      try {
        // Buscar notificações com informações do usuário que criou
        const { data: notifications, error: notificationsError } = await sb
          .from('notifications')
          .select(`
            id,
            title,
            message,
            type,
            category,
            data,
            created_at,
            profiles:user_id (
              full_name,
              user_type
            )
          `)
          .eq('category', 'system')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (notificationsError) throw notificationsError;

        // Contar total de notificações para paginação
        const { count, error: countError } = await sb
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'system');

        if (countError) throw countError;

        const totalPages = Math.ceil((count || 0) / limit);

        return new Response(JSON.stringify({
          notifications: notifications || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: totalPages
          }
        }), { headers: CORS });

      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: CORS
        });
      }
    }

    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: CORS
      });
  }
}); 