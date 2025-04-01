import { StorageConfig, RetryConfig } from './types';

export const storageConfig: StorageConfig = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  bucketName: 'menu-images'
};

export const retryConfig: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000
};