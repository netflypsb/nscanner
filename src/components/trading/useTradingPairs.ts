import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TradingPair } from "./types";

export function useTradingPairs() {
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTradingPairs = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-trading-pairs`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch trading pairs');
        }

        const pairs = await response.json();
        setTradingPairs(pairs);
      } catch (error) {
        console.error('Error fetching trading pairs:', error);
        toast({
          title: "Error",
          description: "Failed to load trading pairs. Please check your API credentials in settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradingPairs();
  }, [toast]);

  return { tradingPairs, isLoading };
}