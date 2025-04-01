import { RetryConfig } from './types';

export async function retry<T>(
  operation: () => Promise<T>,
  config: RetryConfig,
  cleanup?: () => Promise<void>
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === config.maxAttempts) break;
      await new Promise(resolve => setTimeout(resolve, config.delayMs));
    }
  }

  if (cleanup) {
    try {
      await cleanup();
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }
  }

  throw lastError;
}

export function validateFile(
  file: File,
  maxSize: number,
  allowedTypes: string[]
): void {
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
}