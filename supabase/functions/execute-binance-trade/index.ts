import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Binance } from 'https://esm.sh/binance-api-node'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.split(' ')[1])
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Get user's Binance credentials
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('binance_api_key, binance_api_secret')
      .eq('id', user.id)
      .single()

    if (profileError || !profile.binance_api_key || !profile.binance_api_secret) {
      throw new Error('Binance credentials not found')
    }

    // Get request body
    const { pair, amount, tradeType } = await req.json()

    // Initialize Binance client
    const client = Binance({
      apiKey: profile.binance_api_key,
      apiSecret: profile.binance_api_secret,
    })

    // Execute trade
    let result
    if (tradeType === 'BUY') {
      result = await client.order({
        symbol: pair.replace('/', ''),
        side: 'BUY',
        quantity: amount,
        type: 'MARKET',
      })
    } else {
      result = await client.order({
        symbol: pair.replace('/', ''),
        side: 'SELL',
        quantity: amount,
        type: 'MARKET',
      })
    }

    // Log the trade
    const { error: logError } = await supabase
      .from('trade_logs')
      .insert({
        user_id: user.id,
        pair,
        trade_type: tradeType,
        amount: parseFloat(amount),
        price: result.fills[0].price,
        status: result.status,
      })

    if (logError) {
      console.error('Error logging trade:', logError)
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error executing trade:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})