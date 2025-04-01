import { createClient } from '@supabase/supabase-js';
import type { BusinessReport } from './report';

const supabaseUrl = 'https://splnejcmpdmltvlalnvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbG5lamNtcGRtbHR2bGFsbnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTQ5MTgsImV4cCI6MjA1MDM5MDkxOH0.0dWRxAJbNou0orc6E_x_1v7dQwVzywVnklUgVRRYXhU';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export async function getOrCreateSession(): Promise<string> {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('No user ID found');
  }

  try {
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
  } catch (error) {
    console.error('Session creation failed:', error);
    throw error;
  }
}

const handleSupabaseOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  storageKey?: string
): Promise<T> => {
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
};

export async function saveResponse(
  userId: string,
  sectionId: string,
  questionId: string,
  answer: any
): Promise<void> {
  const storageKey = `response_${userId}_${sectionId}_${questionId}`;
  const data = { answer: JSON.stringify(answer) };

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('responses')
        .delete()
        .match({
          user_id: userId,
          section_id: sectionId,
          question_id: questionId
        });

      await supabase
        .from('responses')
        .insert({
          user_id: userId,
          section_id: sectionId,
          question_id: questionId,
          answer: JSON.stringify(answer)
        });
    },
    undefined,
    storageKey
  );
}

export async function saveBusinessReport(
  userId: string,
  report: BusinessReport
): Promise<void> {
  const storageKey = `report_${userId}`;

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('business_reports')
        .upsert({
          user_id: userId,
          report: JSON.stringify(report),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    },
    undefined,
    storageKey
  );
}

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

export async function saveGoal(
  userId: string,
  text: string
): Promise<void> {
  const storageKey = `goals_${userId}`;
  const goal = {
    user_id: userId,
    text,
    completed: false,
    created_at: new Date().toISOString()
  };

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('goals')
        .insert(goal);
    },
    undefined,
    storageKey
  );
}

export async function updateGoalStatus(
  goalId: string,
  completed: boolean
): Promise<void> {
  const userId = localStorage.getItem('userId');
  const storageKey = userId ? `goals_${userId}` : null;

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('goals')
        .update({ completed })
        .eq('id', goalId)
        .eq('user_id', userId);
    },
    undefined,
    storageKey
  );
}

export async function deleteGoal(
  goalId: string
): Promise<void> {
  const userId = localStorage.getItem('userId');
  const storageKey = userId ? `goals_${userId}` : null;

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', userId);
    },
    undefined,
    storageKey
  );
}

export async function fetchChatHistory(
  userId: string
): Promise<any[]> {
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

export async function fetchGoals(
  userId: string
): Promise<any[]> {
  const storageKey = `goals_${userId}`;

  return handleSupabaseOperation(
    async () => {
      const { data, error } = await supabase
        .from('goals')
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