import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { action, data } = await req.json()

    console.log(`Admin lottery operation: ${action}`, data)

    switch (action) {
      case 'create':
        return await createLottery(supabaseClient, data)
      case 'update':
        return await updateLottery(supabaseClient, data)
      case 'updateStatus':
        return await updateLotteryStatus(supabaseClient, data)
      case 'delete':
        return await deleteLottery(supabaseClient, data)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error('Error in admin lottery operations:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function createLottery(supabaseClient: any, data: any) {
  try {
    // Prepare lottery data with proper structure
    const lotteryData = {
      name: data.name,
      title: data.name, // Mirror name to title
      description: data.description,
      detailed_description: data.detailedDescription,
      prize_type: data.prizeType,
      prize_value: data.prizeValue,
      image_url: data.imageUrl || '',
      start_date: data.startDate,
      end_date: data.endDate,
      draw_date: data.endDate, // Set draw date same as end date by default
      status: data.status,
      numbers_total: data.numbersTotal,
      points_per_number: data.pointsPerNumber,
      min_points: data.minPoints,
      number_range: data.numberRange,
      is_auto_scheduled: true,
      progress: 0,
      numbers_sold: 0,
      winner: null,
      winning_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert lottery with auto-generated UUID
    const { data: lottery, error } = await supabaseClient
      .from('lotteries')
      .insert(lotteryData)
      .select()
      .single()

    if (error) {
      console.error('Database error creating lottery:', error)
      throw error
    }

    console.log('Lottery created successfully:', lottery.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        lottery: lottery 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error creating lottery:', error)
    throw error
  }
}

async function updateLottery(supabaseClient: any, data: any) {
  try {
    const { id, ...updateData } = data
    
    const { data: lottery, error } = await supabaseClient
      .from('lotteries')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        lottery: lottery 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error updating lottery:', error)
    throw error
  }
}

async function updateLotteryStatus(supabaseClient: any, data: any) {
  try {
    const { id, status } = data
    
    const { data: lottery, error } = await supabaseClient
      .from('lotteries')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        lottery: lottery 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error updating lottery status:', error)
    throw error
  }
}

async function deleteLottery(supabaseClient: any, data: any) {
  try {
    const { id } = data

    // Validate ID
    if (!id || id === 'null' || id === 'undefined') {
      throw new Error('Invalid lottery ID provided')
    }

    // First check if lottery exists
    const { data: existing, error: checkError } = await supabaseClient
      .from('lotteries')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existing) {
      throw new Error('Lottery not found')
    }

    // Delete related records first
    await supabaseClient
      .from('lottery_participants')
      .delete()
      .eq('lottery_id', id)

    await supabaseClient
      .from('lottery_winners')
      .delete()
      .eq('lottery_id', id)

    // Delete the lottery
    const { error: deleteError } = await supabaseClient
      .from('lotteries')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return new Response(
      JSON.stringify({ 
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error deleting lottery:', error)
    throw error
  }
} 