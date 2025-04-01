import { supabase } from './client';

export async function handleSupabaseOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  storageKey?: string
): Promise<T> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    const result = await operation();
    if (storageKey && result) {
      localStorage.setItem(storageKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error('Supabase operation failed:', error);
    if (storageKey) {
      const localData = localStorage.getItem(storageKey);
      if (localData) {
        try {
          return JSON.parse(localData);
        } catch (parseError) {
          console.error('Failed to parse local data:', parseError);
        }
      }
    }
    return fallback;
  }
}