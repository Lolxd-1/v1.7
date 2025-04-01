import { supabase } from '../supabase';
import { UserData } from './types';

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function updateUserData(
  userId: string,
  updates: Partial<UserData>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_data')
      .update(updates)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}