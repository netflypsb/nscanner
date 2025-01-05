import { MarketSummary } from "@/components/MarketSummary";
import { PerformanceChart } from "@/components/PerformanceChart";
import { TradingForm } from "@/components/TradingForm";
import { TradeHistory } from "@/components/TradeHistory";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketSummary />
        <PerformanceChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TradingForm />
        <TradeHistory />
      </div>
    </div>
  );
};

export default Index;