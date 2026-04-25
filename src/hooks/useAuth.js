// useAuth hook — manages Firebase auth state with demo mode fallback

import { useState, useEffect, useCallback } from 'react';
import { signInWithGoogle, logOut, onAuthChange, isFirebaseConfigured } from '../utils/firebase';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for persisted demo session
    const savedUser = sessionStorage.getItem('optichain_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        };
        setUser(userData);
        sessionStorage.setItem('optichain_user', JSON.stringify(userData));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithGoogle();
      const userData = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL
      };
      setUser(userData);
      sessionStorage.setItem('optichain_user', JSON.stringify(userData));
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logOut();
      setUser(null);
      sessionStorage.removeItem('optichain_user');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  return { user, loading, error, login, logout, isFirebaseConfigured };
}
