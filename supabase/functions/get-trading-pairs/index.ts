import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Get user's API credentials
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('luno_api_key, luno_api_secret')
      .eq('id', user.id)
      .single()

    if (profileError || !profile.luno_api_key || !profile.luno_api_secret) {
      throw new Error('API credentials not found')
    }

    // Call Luno API
    const credentials = btoa(`${profile.luno_api_key}:${profile.luno_api_secret}`)
    const response = await fetch('https://api.luno.com/api/1/tickers', {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Luno API')
    }

    const data = await response.json()
    const pairs = data.tickers.map((ticker: any) => ({
      value: ticker.pair,
      label: `${ticker.pair.slice(0, 3)}/${ticker.pair.slice(3)}`
    }))

    return new Response(
      JSON.stringify(pairs),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})