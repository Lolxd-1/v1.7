import { supabase } from '../client';

export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export async function signIn(username: string, password: string): Promise<AuthResponse> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, password')
      .eq('username', username)
      .single();

    if (error) throw error;
    if (!users) return { user: null, error: 'User not found' };
    if (users.password !== password) return { user: null, error: 'Invalid password' };

    localStorage.setItem('userId', users.id);
    localStorage.setItem('username', users.username);

    return { 
      user: { id: users.id, username: users.username },
      error: null 
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: 'Failed to sign in' };
  }
}

export async function signOut(): Promise<void> {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
}

export function getCurrentUser(): User | null {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  if (!userId || !username) {
    return null;
  }

  return { id: userId, username };
}