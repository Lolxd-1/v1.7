import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { UserData } from '../lib/storage/types';

export function useUserData(userId: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_data')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const updateUserData = async (updates: Partial<UserData>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_data')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      setUserData(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError('Failed to update user data');
      console.error('Error updating user data:', err);
    }
  };

  return {
    userData,
    loading,
    error,
    updateUserData
  };
}