import { supabase } from './supabase';

export interface UploadedImage {
  id: string;
  fileName: string;
  url: string;
  extractedText?: string;
  createdAt: string;
}

// Simplified mock functions for storage
export async function getImages(): Promise<UploadedImage[]> {
  return [];
}

export async function uploadImage(): Promise<UploadedImage> {
  throw new Error('Image upload not implemented');
}

export async function deleteImage(): Promise<void> {
  throw new Error('Image deletion not implemented');
}

export async function updateImageText(): Promise<void> {
  throw new Error('Image text update not implemented');
}