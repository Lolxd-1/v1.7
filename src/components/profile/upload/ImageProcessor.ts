// Image processing utilities
export async function processImage(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement): Promise<ImageData> {
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw and convert to grayscale
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Enhanced image processing for better text recognition
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale using luminance formula
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Increase contrast
    const contrast = 1.2;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const color = factor * (gray - 128) + 128;
    
    // Apply threshold for better text definition
    const threshold = 128;
    const final = color < threshold ? 0 : 255;

    data[i] = final;
    data[i + 1] = final;
    data[i + 2] = final;
  }

  ctx.putImageData(imageData, 0, 0);
  return imageData;
}