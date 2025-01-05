import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Rule Your Trades with Automation
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            The ultimate automated rules-based trading platform exclusively for Luno exchange.
            Take control of your trading with customizable strategies and real-time market analysis.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="rounded-full">
              Get Started
            </Button>
            <Button variant="ghost" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}