import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">PDFScanPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-primary">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary">Pricing</Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary">Contact</Link>
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
            <Link to="/features" className="block px-3 py-2 text-gray-600 hover:text-primary">Features</Link>
            <Link to="/pricing" className="block px-3 py-2 text-gray-600 hover:text-primary">Pricing</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-600 hover:text-primary">Contact</Link>
            <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-primary">Login</Link>
            <Link to="/signup" className="block px-3 py-2 text-primary font-medium">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};