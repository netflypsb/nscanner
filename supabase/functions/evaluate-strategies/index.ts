import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Binance } from 'https://esm.sh/binance-api-node'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Strategy {
  id: string;
  user_id: string;
  name: string;
  short_ma_type: string;
  short_ma_length: number;
  medium_ma_type: string;
  medium_ma_length: number;
  long_ma_type: string;
  long_ma_length: number;
  is_active: boolean;
}

function calculateMA(prices: number[], length: number, type: string): number {
  if (prices.length < length) return 0;
  
  switch (type) {
    case 'SMA':
      return prices.slice(-length).reduce((a, b) => a + b, 0) / length;
    case 'EMA': {
      const k = 2 / (length + 1);
      return prices.reduce((ema, price, i) => 
        i === 0 ? price : price * k + ema * (1 - k)
      );
    }
    case 'WMA': {
      let sum = 0;
      let weightSum = 0;
      prices.slice(-length).forEach((price, i) => {
        const weight = i + 1;
        sum += price * weight;
        weightSum += weight;
      });
      return sum / weightSum;
    }
    default:
      return 0;
  }
}

async function evaluateStrategy(
  client: any,
  strategy: Strategy,
  symbol: string
): Promise<{ shouldBuy: boolean; shouldSell: boolean }> {
  try {
    // Get historical candles
    const candles = await client.candles({
      symbol: symbol.replace('/', ''),
      interval: '1h',
      limit: Math.max(strategy.short_ma_length, strategy.medium_ma_length, strategy.long_ma_length) + 10
    });

    const prices = candles.map(candle => parseFloat(candle.close));

    // Calculate MAs
    const shortMA = calculateMA(prices, strategy.short_ma_length, strategy.short_ma_type);
    const mediumMA = calculateMA(prices, strategy.medium_ma_length, strategy.medium_ma_type);
    const longMA = calculateMA(prices, strategy.long_ma_length, strategy.long_ma_type);

    // Strategy logic: Buy when short MA crosses above medium MA and long MA is trending up
    const shouldBuy = shortMA > mediumMA && mediumMA > longMA;
    
    // Sell when short MA crosses below medium MA
    const shouldSell = shortMA < mediumMA;

    return { shouldBuy, shouldSell };
  } catch (error) {
    console.error('Error evaluating strategy:', error);
    return { shouldBuy: false, shouldSell: false };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.split(' ')[1]);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's active strategies and Binance credentials
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('binance_api_key, binance_api_secret')
      .eq('id', user.id)
      .single();

    if (profileError || !profile.binance_api_key || !profile.binance_api_secret) {
      throw new Error('Binance credentials not found');
    }

    const { data: strategies, error: strategiesError } = await supabase
      .from('strategies')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (strategiesError) {
      throw new Error('Failed to fetch strategies');
    }

    // Initialize Binance client
    const client = Binance({
      apiKey: profile.binance_api_key,
      apiSecret: profile.binance_api_secret,
    });

    // Get trading pairs from request body
    const { pairs } = await req.json();
    
    const results = [];
    
    // Evaluate each strategy for each pair
    for (const strategy of strategies) {
      for (const pair of pairs) {
        const evaluation = await evaluateStrategy(client, strategy, pair);
        
        if (evaluation.shouldBuy || evaluation.shouldSell) {
          try {
            // Execute trade based on evaluation
            const order = await client.order({
              symbol: pair.replace('/', ''),
              side: evaluation.shouldBuy ? 'BUY' : 'SELL',
              type: 'MARKET',
              quoteOrderQty: 10, // Fixed amount for testing, adjust as needed
            });

            // Log the trade
            const { error: logError } = await supabase
              .from('trade_logs')
              .insert({
                user_id: user.id,
                strategy_id: strategy.id,
                trade_type: evaluation.shouldBuy ? 'BUY' : 'SELL',
                pair,
                price: parseFloat(order.fills[0].price),
                amount: parseFloat(order.fills[0].qty),
                status: order.status,
              });

            if (logError) throw logError;

            results.push({
              strategy: strategy.name,
              pair,
              action: evaluation.shouldBuy ? 'BUY' : 'SELL',
              status: 'executed',
            });
          } catch (error) {
            console.error('Trade execution error:', error);
            results.push({
              strategy: strategy.name,
              pair,
              action: evaluation.shouldBuy ? 'BUY' : 'SELL',
              status: 'failed',
              error: error.message,
            });
          }
        }
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in strategy evaluation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});