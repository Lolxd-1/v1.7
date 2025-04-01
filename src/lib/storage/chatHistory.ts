import { supabase } from '../supabase';
import { ChatMessage } from './types';

export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

export async function saveChatMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert([message]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
}