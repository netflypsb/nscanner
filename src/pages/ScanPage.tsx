import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import WebcamScanner from '@/components/scanning/WebcamScanner';
import FileUpload from '@/components/scanning/FileUpload';

const ScanPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [scanMode, setScanMode] = useState<'webcam' | 'upload'>('webcam');

  const handleCapture = (data: string) => {
    console.log('Captured:', data);
    setStep(2);
  };

  const handleSave = () => {
    console.log('Saving document...');
    setStep(3);
    // Add save logic here
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Scan Document</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* Mode Selection */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={scanMode === 'webcam' ? 'default' : 'outline'}
            onClick={() => setScanMode('webcam')}
          >
            <Camera className="mr-2" />
            Webcam Scan
          </Button>
          <Button
            variant={scanMode === 'upload' ? 'default' : 'outline'}
            onClick={() => setScanMode('upload')}
          >
            <Upload className="mr-2" />
            File Upload
          </Button>
        </div>

        {/* Scanning Area */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          {scanMode === 'webcam' ? (
            <WebcamScanner onCapture={handleCapture} />
          ) : (
            <FileUpload onUpload={handleCapture} />
          )}
        </div>

        {/* Footer Progress */}
        <footer className="mt-8">
          <div className="flex justify-between mb-2 text-sm text-muted-foreground">
            <span>1. Capture</span>
            <span>2. Crop</span>
            <span>3. Save</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </footer>
      </main>
    </div>
  );
};

export default ScanPage;