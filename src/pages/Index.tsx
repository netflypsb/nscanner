import { MarketSummary } from "@/components/MarketSummary";
import { PerformanceChart } from "@/components/PerformanceChart";
import { TradingForm } from "@/components/TradingForm";
import { TradeHistory } from "@/components/TradeHistory";
import { Sidebar } from "@/components/Sidebar";

export function Index() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MarketSummary />
            <PerformanceChart />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TradingForm />
            <TradeHistory />
          </div>
        </div>
      </main>
    </div>
  );
}