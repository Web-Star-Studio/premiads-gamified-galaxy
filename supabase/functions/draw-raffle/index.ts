// @ts-nocheck

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Adiciona cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, apikey, Content-Type, X-Client-Info',
};

interface DrawRaffleBody {
  raffleId: string;
}

Deno.serve(async (req: Request) => {
  // Responde preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Cria cliente com contexto de auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Only admins can draw raffles" }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { raffleId } = await req.json() as DrawRaffleBody;
    if (!raffleId) {
      return new Response(
        JSON.stringify({ error: "Missing raffleId parameter" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: raffle, error: raffleError } = await supabaseClient
      .from("lotteries")
      .select("*")
      .eq("id", raffleId)
      .single();

    if (raffleError) {
      return new Response(
        JSON.stringify({ error: "Raffle not found", details: raffleError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (raffle.status !== "active") {
      return new Response(
        JSON.stringify({ error: "Cannot draw raffle", details: `Raffle status is ${raffle.status}, but should be 'active'` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: participants, error: participantsError } = await supabaseClient
      .from("lottery_participants")
      .select("user_id, numbers")
      .eq("lottery_id", raffleId);

    if (participantsError) {
      return new Response(
        JSON.stringify({ error: "Error fetching participants", details: participantsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!participants || participants.length === 0) {
      const { error: updateError } = await supabaseClient
        .from("lotteries")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", raffleId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Error updating raffle with no participants", details: updateError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Sorteio finalizado. Não havia participantes.",
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } }
      );
    }

    // Create a flat list of all numbers from all participants, keeping track of the owner
    const allNumbers: { number: number, userId: string }[] = [];
    for (const participant of participants) {
      if (participant.numbers && Array.isArray(participant.numbers)) {
        for (const num of participant.numbers) {
          const parsedNum = typeof num === 'string' ? parseInt(num, 10) : num;
          if (!isNaN(parsedNum)) {
            allNumbers.push({ number: parsedNum, userId: participant.user_id });
          }
        }
      }
    }
    
    // If no participants have any valid numbers, we can't draw a winner.
    if (allNumbers.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Nenhum participante com números válidos para o sorteio.",
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } }
      );
    }

    // Select a random winning entry from the aggregated list
    const randomIndex = Math.floor(Math.random() * allNumbers.length);
    const winningEntry = allNumbers[randomIndex];
    const winningNumber = winningEntry.number;
    const winnerId = winningEntry.userId;

    // Update raffle with winner info
    const { error: updateError } = await supabaseClient
      .from("lotteries")
      .update({ 
        status: "completed", 
        winning_number: winningNumber, 
        winner: { id: winnerId }, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", raffleId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Error updating raffle", details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create winner record
    const { error: winnerError } = await supabaseClient
      .from("lottery_winners")
      .insert({ 
        lottery_id: raffleId, 
        user_id: winnerId, 
        winning_number: winningNumber, 
        prize_name: raffle.name, 
        prize_value: raffle.prize_value 
      });
      
    if (winnerError) {
      return new Response(
        JSON.stringify({ error: "Error creating winner record", details: winnerError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch winner profile data
    const { data: winnerProfile, error: winnerProfileError } = await supabaseClient
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .eq("id", winnerId)
      .single();

    if (winnerProfileError) {
      console.error("Error fetching winner profile:", winnerProfileError);
      // Continue without winner profile data - not critical
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        winning_number: winningNumber, 
        winner_id: winnerId,
        winner: {
          id: winnerId,
          name: winnerProfile?.full_name || "Participante",
          email: winnerProfile?.email || "",
          avatar_url: winnerProfile?.avatar_url || null
        },
        message: `Sorteio realizado com sucesso! Parabéns a ${winnerProfile?.full_name || "Participante"} por ganhar com o número ${winningNumber}!` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 