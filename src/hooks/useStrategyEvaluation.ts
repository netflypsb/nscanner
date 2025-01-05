import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useStrategyEvaluation() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();

  const evaluateStrategies = async (pairs: string[]) => {
    try {
      setIsEvaluating(true);
      
      const response = await supabase.functions.invoke("evaluate-strategies", {
        body: { pairs },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const results = response.data;
      
      // Show results in toast
      results.forEach((result: any) => {
        if (result.status === 'executed') {
          toast({
            title: "Trade Executed",
            description: `${result.action} ${result.pair} for strategy "${result.strategy}"`,
          });
        } else {
          toast({
            title: "Trade Failed",
            description: `Failed to ${result.action} ${result.pair}: ${result.error}`,
            variant: "destructive",
          });
        }
      });

      return results;
    } catch (error) {
      toast({
        title: "Evaluation Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    evaluateStrategies,
    isEvaluating,
  };
}