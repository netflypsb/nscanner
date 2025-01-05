import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExecuteTradeParams {
  pair: string;
  amount: string;
  tradeType: "BUY" | "SELL";
}

export function useBinanceTrading() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const executeTrade = async ({ pair, amount, tradeType }: ExecuteTradeParams) => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const response = await supabase.functions.invoke("execute-binance-trade", {
        body: { pair, amount, tradeType },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Trade Executed",
        description: `Successfully executed ${tradeType} order for ${amount} ${pair}`,
      });

      return response.data;
    } catch (error) {
      toast({
        title: "Trade Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeTrade,
    isLoading,
  };
}