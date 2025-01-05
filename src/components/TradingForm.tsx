import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TradingPairSelect } from "./trading/TradingPairSelect";
import { AmountInput } from "./trading/AmountInput";
import { TradeTypeSelect } from "./trading/TradeTypeSelect";
import { TradingFormValues } from "./trading/types";
import { useTradingPairs } from "./trading/useTradingPairs";
import { useBinanceTrading } from "@/hooks/useBinanceTrading";

export function TradingForm() {
  const { tradingPairs, isLoading: isPairsLoading } = useTradingPairs();
  const { executeTrade, isLoading: isTrading } = useBinanceTrading();
  const { toast } = useToast();
  const form = useForm<TradingFormValues>({
    defaultValues: {
      pair: "",
      amount: "",
      tradeType: "BUY",
    },
  });

  const onSubmit = async (values: TradingFormValues) => {
    try {
      await executeTrade({
        pair: values.pair,
        amount: values.amount,
        tradeType: values.tradeType,
      });

      form.reset();
    } catch (error) {
      console.error("Trade execution error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Trade</CardTitle>
        <CardDescription>
          Submit a new trade order for your selected trading pair
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TradingPairSelect form={form} tradingPairs={tradingPairs} />
            <AmountInput form={form} />
            <TradeTypeSelect form={form} />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isPairsLoading || isTrading}
            >
              {isTrading ? "Executing Trade..." : "Submit Trade"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}