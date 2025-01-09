import { createWorker, Worker, WorkerOptions } from 'tesseract.js';

export type OCRProgressCallback = (progress: number) => void;

export async function performOCR(
  imageUrl: string, 
  onProgress?: OCRProgressCallback
): Promise<string> {
  const worker = await createWorker({
    logger: m => {
      if (m.status === 'recognizing text') {
        onProgress?.(m.progress);
      }
    },
  } as WorkerOptions);

  try {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(imageUrl);
    
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    await worker.terminate();
    throw new Error('OCR processing failed');
  }
}