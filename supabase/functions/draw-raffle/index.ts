import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface DrawRaffleBody {
  raffleId: string;
}

Deno.serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the user is authenticated and is an admin
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Only admins can draw raffles" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { raffleId } = await req.json() as DrawRaffleBody;

    if (!raffleId) {
      return new Response(
        JSON.stringify({ error: "Missing raffleId parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch the raffle
    const { data: raffle, error: raffleError } = await supabaseClient
      .from("lotteries")
      .select("*")
      .eq("id", raffleId)
      .single();

    if (raffleError) {
      return new Response(
        JSON.stringify({ error: "Raffle not found", details: raffleError }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the raffle is active
    if (raffle.status !== "active") {
      return new Response(
        JSON.stringify({ 
          error: "Cannot draw raffle", 
          details: `Raffle status is ${raffle.status}, but should be 'active'` 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch all participants for this raffle
    const { data: participants, error: participantsError } = await supabaseClient
      .from("lottery_participants")
      .select("user_id, numbers")
      .eq("lottery_id", raffleId);

    if (participantsError) {
      return new Response(
        JSON.stringify({ error: "Error fetching participants", details: participantsError }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // If no participants, return an error
    if (!participants || participants.length === 0) {
      return new Response(
        JSON.stringify({ error: "No participants in this raffle" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a random number within the raffle's range
    const min = raffle.number_range?.min || 1;
    const max = raffle.number_range?.max || raffle.numbers_total;
    const winningNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // Find the winner (the participant who has the winning number)
    let winnerId: string | null = null;
    for (const participant of participants) {
      if (participant.numbers.includes(winningNumber)) {
        winnerId = participant.user_id;
        break;
      }
    }

    // Update the raffle with the winner info
    const { error: updateError } = await supabaseClient
      .from("lotteries")
      .update({
        status: "completed",
        winning_number: winningNumber,
        winner: winnerId ? { id: winnerId } : null,
        updated_at: new Date().toISOString()
      })
      .eq("id", raffleId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Error updating raffle", details: updateError }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // If a winner was found, create a winner record
    if (winnerId) {
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
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Return the result
    return new Response(
      JSON.stringify({
        success: true,
        winning_number: winningNumber,
        winner_id: winnerId,
        message: winnerId 
          ? "Raffle successfully drawn with a winner!" 
          : "Raffle successfully drawn, but no winner was found for the winning number."
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}); 