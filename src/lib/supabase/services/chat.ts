import { supabase } from '../client';
import { handleSupabaseOperation } from '../operations';

export async function saveChatMessage(
  userId: string,
  profile: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const storageKey = `chat_${userId}`;
  const message = {
    user_id: userId,
    profile,
    role,
    content,
    created_at: new Date().toISOString()
  };

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('chat_messages')
        .insert(message);
    },
    undefined,
    storageKey
  );
}

export async function fetchChatHistory(userId: string): Promise<any[]> {
  const storageKey = `chat_${userId}`;

  return handleSupabaseOperation(
    async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error || !data) return [];
      return data;
    },
    [],
    storageKey
  );
}