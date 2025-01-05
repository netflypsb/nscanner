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

export function TradingForm() {
  const { tradingPairs, isLoading: isPairsLoading } = useTradingPairs();
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("trade_logs").insert({
        pair: values.pair,
        amount: parseFloat(values.amount),
        trade_type: values.tradeType,
        price: 0, // This would come from the actual exchange rate
        status: "PENDING", // Initial status
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Trade submitted",
        description: `${values.tradeType} order for ${values.amount} ${values.pair} has been submitted.`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit trade. Please try again.",
        variant: "destructive",
      });
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
              disabled={isPairsLoading}
            >
              {isPairsLoading ? "Loading..." : "Submit Trade"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}