import { ArrowRight } from "lucide-react";

const steps = [
  {
    name: "Connect Your Luno Account",
    description: "Securely link your Luno account using API keys for automated trading.",
  },
  {
    name: "Create and Activate Trading Rules",
    description: "Set up your custom trading strategies with our intuitive rule builder.",
  },
  {
    name: "Let LunoRule Trade for You",
    description: "Sit back and watch as your strategies execute trades automatically.",
  },
];

export function HowItWorks() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Get started with LunoRule in three simple steps
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3">
            {steps.map((step, stepIdx) => (
              <div key={step.name} className="text-center">
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                      {stepIdx + 1}
                    </span>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-4 left-full hidden h-0.5 w-full -translate-x-1/2 bg-gray-300 sm:block" />
                  )}
                </div>
                <h3 className="mt-6 text-base font-semibold leading-7">
                  {step.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}