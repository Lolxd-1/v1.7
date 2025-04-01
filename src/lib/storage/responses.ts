import { supabase } from '../supabase';
import { QuestionResponse } from './types';

export async function getResponses(sessionId: string): Promise<QuestionResponse[]> {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching responses:', error);
    return [];
  }
}

export async function saveResponse(
  response: Omit<QuestionResponse, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('responses')
      .insert([response]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
}