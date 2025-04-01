import { supabase } from './supabase';

export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export async function signUp(username: string, password: string): Promise<AuthResponse> {
  try {
    // Check if username already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username);

    if (checkError) {
      throw checkError;
    }

    if (existingUsers && existingUsers.length > 0) {
      return { user: null, error: 'Username already exists' };
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ username, password }])
      .select('id, username')
      .single();

    if (createError) {
      throw createError;
    }

    return { user: newUser as User, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: 'Failed to create account' };
  }
}

export async function signIn(username: string, password: string): Promise<AuthResponse> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, password')
      .eq('username', username)
      .single();

    if (error) {
      throw error;
    }

    if (!users) {
      return { user: null, error: 'User not found' };
    }

    if (users.password !== password) {
      return { user: null, error: 'Invalid password' };
    }

    // Create new session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([{ 
        user_id: users.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }])
      .select('id')
      .single();

    if (sessionError) {
      throw sessionError;
    }

    // Store session and user info
    localStorage.setItem('sessionId', session.id);
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
  const sessionId = localStorage.getItem('sessionId');
  
  if (sessionId) {
    try {
      await supabase
        .from('sessions')
        .update({ expires_at: new Date().toISOString() })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  localStorage.removeItem('sessionId');
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

export async function isSessionValid(): Promise<boolean> {
  const sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    return false;
  }

  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .single();

    if (error || !sessions) {
      return false;
    }

    return new Date(sessions.expires_at) > new Date();
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}