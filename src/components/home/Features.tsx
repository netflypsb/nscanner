import { Bot, Cloud, FileText, Lock, Scan, Share2 } from "lucide-react";

const features = [
  {
    name: "Smart Scanning",
    description: "Advanced AI-powered scanning with automatic edge detection and enhancement.",
    icon: Scan,
  },
  {
    name: "OCR Technology",
    description: "Extract text from scanned documents with high accuracy.",
    icon: FileText,
  },
  {
    name: "Cloud Storage",
    description: "Securely store and access your documents from anywhere.",
    icon: Cloud,
  },
  {
    name: "Easy Sharing",
    description: "Share documents with teammates or clients in just a few clicks.",
    icon: Share2,
  },
  {
    name: "AI-Powered",
    description: "Smart features like automatic categorization and data extraction.",
    icon: Bot,
  },
  {
    name: "Secure",
    description: "Enterprise-grade security with end-to-end encryption.",
    icon: Lock,
  },
];

export const Features = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything you need to manage documents
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Powerful features to help you scan, organize, and collaborate on your documents.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="flex items-center space-x-4 p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow duration-300">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};