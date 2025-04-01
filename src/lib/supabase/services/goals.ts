import { supabase } from '../client';
import { handleSupabaseOperation } from '../operations';

export async function saveGoal(userId: string, text: string): Promise<void> {
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

export async function updateGoalStatus(goalId: string, completed: boolean): Promise<void> {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  const storageKey = `goals_${userId}`;

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

export async function deleteGoal(goalId: string): Promise<void> {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  const storageKey = `goals_${userId}`;

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

export async function fetchGoals(userId: string): Promise<any[]> {
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