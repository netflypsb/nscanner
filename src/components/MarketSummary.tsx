import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const markets = [
  { pair: "BTC/USD", price: "43,567.89", change: 2.34 },
  { pair: "ETH/USD", price: "2,345.67", change: -1.23 },
  { pair: "BNB/USD", price: "312.45", change: 0.45 },
];

export function MarketSummary() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Market Summary</h2>
      <div className="space-y-4">
        {markets.map((market) => (
          <div key={market.pair} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-medium">{market.pair}</p>
              <p className="text-sm text-muted-foreground">${market.price}</p>
            </div>
            <div className={cn(
              "flex items-center gap-1",
              market.change > 0 ? "text-success" : "text-destructive"
            )}>
              {market.change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span className="font-medium">{Math.abs(market.change)}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}