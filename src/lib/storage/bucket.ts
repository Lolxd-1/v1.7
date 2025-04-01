import { supabase } from '../supabase';
import { StorageConfig } from './types';

export async function ensureBucketExists(config: StorageConfig): Promise<void> {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucket = buckets?.find(b => b.name === config.bucketName);
    
    if (!bucket) {
      const { error: bucketError } = await supabase.storage.createBucket(
        config.bucketName,
        {
          public: true,
          fileSizeLimit: config.maxSizeBytes,
          allowedMimeTypes: config.allowedMimeTypes
        }
      );
      
      if (bucketError) {
        throw new Error(`Failed to create bucket: ${bucketError.message}`);
      }
    }
  } catch (error) {
    throw new Error(`Bucket setup failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}