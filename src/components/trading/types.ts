export type TradingFormValues = {
  pair: string;
  amount: string;
  tradeType: "BUY" | "SELL";
};

export type TradingPair = {
  value: string;
  label: string;
};