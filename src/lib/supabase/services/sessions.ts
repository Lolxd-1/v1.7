import { supabase } from '../client';
import { handleSupabaseOperation } from '../operations';

export async function getOrCreateSession(): Promise<string> {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('No user ID found');
  }

  return handleSupabaseOperation(
    async () => {
      // Check for existing valid session
      const { data: existingSessions, error: fetchError } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      // Return existing session if found
      if (existingSessions && existingSessions.length > 0) {
        return existingSessions[0].id;
      }

      // Create new session
      const { data: newSession, error: createError } = await supabase
        .from('sessions')
        .insert({
          user_id: userId,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        })
        .select('id')
        .single();

      if (createError) throw createError;
      return newSession.id;
    },
    '',
    `session_${userId}`
  );
}