import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ApiCredentialsForm } from "@/components/ApiCredentialsForm";
import { TradingStrategyForm } from "@/components/TradingStrategyForm";
import { StrategiesList } from "@/components/StrategiesList";

const Settings = () => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <ApiCredentialsForm />
            <TradingStrategyForm />
            <StrategiesList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;