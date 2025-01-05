import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { TradingFormValues } from "./types";

interface TradeTypeSelectProps {
  form: UseFormReturn<TradingFormValues>;
}

export function TradeTypeSelect({ form }: TradeTypeSelectProps) {
  return (
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
  );
}