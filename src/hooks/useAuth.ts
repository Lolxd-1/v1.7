import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, isSessionValid, User } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateSession = async () => {
      const valid = await isSessionValid();
      if (!valid) {
        setUser(null);
        signOut();
      }
      setLoading(false);
    };

    validateSession();
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      const { user, error } = await signIn(username, password);
      if (error) {
        setError(error);
        return false;
      }
      setUser(user);
      return true;
    } catch (err) {
      setError('Failed to sign in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (username: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      const { user, error } = await signUp(username, password);
      if (error) {
        setError(error);
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to create account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut
  };
}