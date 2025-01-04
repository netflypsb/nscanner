import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AccountOverview() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Account Overview</h2>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-semibold">$24,500.00</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-success" />
              <span className="text-success font-medium">Profit</span>
            </div>
            <p className="text-xl font-semibold mt-1">+$1,234.56</p>
          </div>
          <div className="p-4 bg-destructive/10 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingDown className="text-destructive" />
              <span className="text-destructive font-medium">Loss</span>
            </div>
            <p className="text-xl font-semibold mt-1">-$234.56</p>
          </div>
        </div>
      </div>
    </Card>
  );
}