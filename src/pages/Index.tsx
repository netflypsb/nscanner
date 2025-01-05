import { Sidebar } from "@/components/Sidebar";
import { AccountOverview } from "@/components/AccountOverview";
import { PerformanceChart } from "@/components/PerformanceChart";
import { MarketSummary } from "@/components/MarketSummary";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AccountOverview />
              <MarketSummary />
            </div>
            <PerformanceChart />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;