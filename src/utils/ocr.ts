import { createWorker } from 'tesseract.js';

export type OCRProgressCallback = (progress: number) => void;

export async function performOCR(
  imageUrl: string, 
  onProgress?: OCRProgressCallback
): Promise<string> {
  const worker = await createWorker({
    logger: info => {
      if (info.status === 'recognizing text') {
        onProgress?.(info.progress);
      }
    },
  });

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