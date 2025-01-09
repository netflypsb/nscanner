import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import DocumentViewer from './components/document/DocumentViewer';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import ScanPage from './pages/ScanPage';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/document/:id" element={<DocumentViewer />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scan" element={<ScanPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;