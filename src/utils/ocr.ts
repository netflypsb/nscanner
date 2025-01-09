import { createWorker } from 'tesseract.js';

export type OCRProgressCallback = (progress: number) => void;

export async function performOCR(
  imageUrl: string, 
  onProgress?: OCRProgressCallback
): Promise<string> {
  const worker = createWorker();

  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(imageUrl, {
      logger: m => {
        if (m.status === 'recognizing text') {
          onProgress?.(m.progress);
        }
      },
    });
    
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    await worker.terminate();
    throw new Error('OCR processing failed');
  }
}