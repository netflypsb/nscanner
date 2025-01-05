import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

type TradingFormValues = {
  pair: string;
  amount: string;
  tradeType: "BUY" | "SELL";
};

const tradingPairs = [
  { value: "XBTZAR", label: "BTC/ZAR" },
  { value: "ETHZAR", label: "ETH/ZAR" },
];

export function TradingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<TradingFormValues>({
    defaultValues: {
      pair: "",
      amount: "",
      tradeType: "BUY",
    },
  });

  const onSubmit = async (values: TradingFormValues) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
            <FormField
              control={form.control}
              name="pair"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading Pair</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trading pair" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tradingPairs.map((pair) => (
                        <SelectItem key={pair.value} value={pair.value}>
                          {pair.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.00000001"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tradeType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Trade Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="BUY" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Buy
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="SELL" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Sell
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Trade"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}