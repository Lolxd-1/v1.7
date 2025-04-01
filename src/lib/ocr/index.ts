import Tesseract from 'tesseract.js';
import { processImage } from './imageProcessor';
import { processExtractedText, formatTextHierarchy } from './textProcessor';

export interface OCRResult {
  text: string;
  formatted: string;
}

export async function performOCR(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement
): Promise<OCRResult> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Process image for better text recognition
  await processImage(canvas, ctx, image);

  // Perform OCR with enhanced settings
  const result = await Tesseract.recognize(canvas, 'eng', {
    logger: m => console.log(m),
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%&*()-+=:;"\'',
  });

  // Process and format the extracted text
  const processedText = processExtractedText(result.data.text);
  const formattedText = formatTextHierarchy(processedText);

  return {
    text: processedText,
    formatted: formattedText
  };
}