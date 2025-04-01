import { supabase } from '../supabase';
import { getOrCreateSession } from '../supabase/services/sessions';
import { UploadedImage } from './types';
import { retry } from './utils';
import { storageConfig, retryConfig } from './config';
import { ensureBucketExists } from './bucket';
import { validateFile } from './utils';

// ... rest of the file content stays the same