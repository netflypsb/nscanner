import { createWorker, Worker, WorkerOptions } from 'tesseract.js';

export type OCRProgressCallback = (progress: number) => void;

// Extend the Worker type to include the missing methods
interface TesseractWorker extends Worker {
  load: () => Promise<void>;
  loadLanguage: (lang: string) => Promise<void>;
  initialize: (lang: string) => Promise<void>;
}

export async function performOCR(
  imageUrl: string, 
  onProgress?: OCRProgressCallback
): Promise<string> {
  const worker = await createWorker() as TesseractWorker;

  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const result = await worker.recognize(imageUrl);
    
    if (onProgress) {
      onProgress(1); // Signal completion
    }
    
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to perform OCR');
  } finally {
    await worker.terminate();
  }
}