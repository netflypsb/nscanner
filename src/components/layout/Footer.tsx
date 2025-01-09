import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">PDFScanPro</h3>
            <p className="text-sm text-gray-600">
              Effortless document scanning, anytime, anywhere.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-gray-600 hover:text-primary">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-primary">Pricing</Link></li>
              <li><Link to="/templates" className="text-sm text-gray-600 hover:text-primary">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} PDFScanPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};