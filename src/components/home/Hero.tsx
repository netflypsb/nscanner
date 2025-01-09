import { Button } from "@/components/ui/button";
import { FileText, Scan, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Effortless Document</span>
                <span className="block text-primary">Scanning, Anytime, Anywhere</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Scan, edit, and collaborate on your documents from any device. Powered by AI for perfect results every time.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button asChild size="lg" className="w-full">
                    <Link to="/signup">Get Started for Free</Link>
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/features">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-secondary p-8 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <Scan className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Smart Scanning</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">OCR Technology</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <Share2 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Easy Sharing</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};