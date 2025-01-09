import { createWorker } from 'tesseract.js';

export type OCRProgressCallback = (progress: number) => void;

export async function performOCR(
  imageUrl: string, 
  onProgress?: OCRProgressCallback
): Promise<string> {
  const worker = await createWorker();

  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data } = await worker.recognize(imageUrl, {
      logger: m => {
        if (m.status === 'recognizing text') {
          onProgress?.(m.progress);
        }
      }
    });
    
    return data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to perform OCR');
  } finally {
    await worker.terminate();
  }
}