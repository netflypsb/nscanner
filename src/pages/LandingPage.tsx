import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scan, FolderOpen, Share2 } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 text-white py-24 px-4">
        <div className="container mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Document Workflow with Ease
          </h1>
          <p className="text-xl mb-8 max-w-2xl text-white/90">
            Scan, organize, annotate, and share documents effortlessly—all in one intuitive platform.
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              variant="default"
              className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 hover:text-gray-900"
            >
              Get Started for Free
            </Button>
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              variant="secondary"
              className="bg-gray-200 text-indigo-800 border-indigo-600 hover:bg-gray-300 hover:text-indigo-900"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <Scan className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Scan Your Documents</h3>
              <p className="text-gray-600">Quickly digitize paper documents using your camera or uploaded files.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Organize and Annotate</h3>
              <p className="text-gray-600">Effortlessly sort documents into folders and add highlights or notes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <Share2 className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Share and Export</h3>
              <p className="text-gray-600">Share documents securely or export them to your preferred format.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Choose the Perfect Plan for You</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border rounded-lg p-8 shadow-sm bg-white">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Free</h3>
              <p className="text-3xl font-bold mb-6 text-indigo-600">$0</p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Scan and organize documents
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> OCR processing
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Export documents (PDF, JPG)
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Annotation tools
                </li>
              </ul>
              <Button onClick={() => navigate("/register")} className="w-full" size="lg">
                Get Started
              </Button>
            </div>
            <div className="border rounded-lg p-8 shadow-sm bg-gray-50">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Pro</h3>
              <p className="text-3xl font-bold mb-2 text-indigo-600">$9.99</p>
              <p className="text-sm text-gray-500 mb-6">per month</p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> All features in Free
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Real-time collaboration
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Advanced export formats
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Priority support
                </li>
              </ul>
              <Button disabled className="w-full" size="lg" variant="secondary">
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
