import {
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
import { UseFormReturn } from "react-hook-form";
import { TradingFormValues } from "./types";

type TradingPair = {
  value: string;
  label: string;
};

interface TradingPairSelectProps {
  form: UseFormReturn<TradingFormValues>;
  tradingPairs: TradingPair[];
}

export function TradingPairSelect({ form, tradingPairs }: TradingPairSelectProps) {
  return (
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
  );
}