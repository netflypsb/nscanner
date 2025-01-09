import { createWorker, Worker, RecognizeResult } from 'tesseract.js';

export type OCRProgressCallback = (progress: number) => void;

export async function performOCR(
  imageUrl: string, 
  onProgress?: OCRProgressCallback
): Promise<string> {
  const worker = await createWorker() as Worker;

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