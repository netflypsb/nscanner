import { MarketSummary } from "@/components/MarketSummary";
import { PerformanceChart } from "@/components/PerformanceChart";
import { TradingForm } from "@/components/TradingForm";
import { TradeHistory } from "@/components/TradeHistory";
import { Sidebar } from "@/components/Sidebar";
import { useStrategyEvaluation } from "@/hooks/useStrategyEvaluation";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

const tradingPairs = ["BTC/USDT", "ETH/USDT", "BNB/USDT"];

export function Index() {
  const { evaluateStrategies, isEvaluating } = useStrategyEvaluation();

  const handleEvaluateStrategies = async () => {
    try {
      await evaluateStrategies(tradingPairs);
    } catch (error) {
      console.error("Strategy evaluation failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Trading Dashboard</h1>
            <Button
              onClick={handleEvaluateStrategies}
              disabled={isEvaluating}
              className="gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {isEvaluating ? "Evaluating Strategies..." : "Run Strategy Evaluation"}
            </Button>
          </div>
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