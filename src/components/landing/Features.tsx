import { Zap, Lock, BarChart3, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    name: "Customizable Trading Strategies",
    description: "Create and customize your own trading strategies using our intuitive interface.",
    icon: BarChart3,
  },
  {
    name: "Real-Time Market Analysis",
    description: "Stay ahead with real-time market data and advanced analytics.",
    icon: Zap,
  },
  {
    name: "Secure API Integration",
    description: "Connect securely to your Luno account with encrypted API integration.",
    icon: Lock,
  },
  {
    name: "24/7 Automated Trading",
    description: "Let your strategies work for you around the clock without manual intervention.",
    icon: Clock,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to automate your trading
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <Card key={feature.name} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-x-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}