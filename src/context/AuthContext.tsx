import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  user: UserAccount | null;
  firebaseUser: FirebaseUser | null;
  isLoadingAuth: boolean;
  isAdmin: boolean;
  loginWithGoogleReal: () => Promise<UserAccount>;
  loginWithGoogleEmail: (customEmail: string, customName?: string) => Promise<UserAccount>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'mfia_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Check for redirect result on initialization (useful on Vercel / mobile where popup is blocked)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user && result.user.email) {
          const fbUser = result.user;
          const cleanEmail = fbUser.email.trim().toLowerCase();
          const isAdm = cleanEmail === 'jomamilionarios@gmail.com';
          const defaultName = fbUser.displayName || (isAdm ? 'Administrador Joma' : cleanEmail.split('@')[0]);
          
          setUser({
            id: fbUser.uid,
            name: defaultName,
            email: cleanEmail,
            avatar: fbUser.photoURL || (isAdm ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : undefined),
            isAdmin: isAdm,
            role: isAdm ? 'ADMIN' : 'LEAD_USER',
            provider: 'google',
            createdAt: new Date().toISOString(),
          });
        }
      })
      .catch((err) => {
        console.warn('Redirect auth check notice:', err);
      });
  }, []);

  // Realtime Firebase Google Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && fbUser.email) {
        const cleanEmail = fbUser.email.trim().toLowerCase();
        const isAdm = cleanEmail === 'jomamilionarios@gmail.com';
        
        try {
          const idToken = await fbUser.getIdToken();
          const response = await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              email: cleanEmail,
              name: fbUser.displayName || (isAdm ? 'Administrador Joma' : cleanEmail.split('@')[0]),
              avatar: fbUser.photoURL || (isAdm ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : undefined),
            }),
          });
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser({
              id: fbUser.uid,
              name: fbUser.displayName || (isAdm ? 'Administrador Joma' : cleanEmail.split('@')[0]),
              email: cleanEmail,
              avatar: fbUser.photoURL || undefined,
              isAdmin: isAdm,
              role: isAdm ? 'ADMIN' : 'LEAD_USER',
              provider: 'google',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Realtime auth backend sync error:', e);
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || (isAdm ? 'Administrador Joma' : cleanEmail.split('@')[0]),
            email: cleanEmail,
            avatar: fbUser.photoURL || undefined,
            isAdmin: isAdm,
            role: isAdm ? 'ADMIN' : 'LEAD_USER',
            provider: 'google',
            createdAt: new Date().toISOString(),
          });
        }
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Native Google Popup Authentication
  const loginWithGoogleReal = async (): Promise<UserAccount> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      if (!fbUser || !fbUser.email) {
        throw new Error('Não foi possível obter os dados da conta Google.');
      }

      const cleanEmail = (fbUser.email || '').trim().toLowerCase();
      const isAdm = cleanEmail === 'jomamilionarios@gmail.com';
      const defaultName = fbUser.displayName || (isAdm ? 'Administrador Joma' : cleanEmail.split('@')[0]);
      const idToken = await fbUser.getIdToken().catch(() => '');

      try {
        const response = await fetch('/api/auth/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
          body: JSON.stringify({
            email: cleanEmail,
            name: defaultName,
            avatar: fbUser.photoURL || undefined,
          }),
        });

        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          return data.user;
        }
      } catch (backendErr) {
        console.warn('Backend sync notice (using client Firebase auth):', backendErr);
      }

      const finalUser: UserAccount = {
        id: fbUser.uid,
        name: defaultName,
        email: cleanEmail,
        avatar: fbUser.photoURL || undefined,
        isAdmin: isAdm,
        role: isAdm ? 'ADMIN' : 'LEAD_USER',
        provider: 'google',
        createdAt: new Date().toISOString(),
      };

      setUser(finalUser);
      return finalUser;
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  };

  // Direct Email Fallback
  const loginWithGoogleEmail = async (customEmail: string, customName?: string): Promise<UserAccount> => {
    const cleanEmail = (customEmail || '').trim().toLowerCase();
    if (!cleanEmail) throw new Error('E-mail do Google (@gmail.com) obrigatório.');

    const isAdm = cleanEmail === 'jomamilionarios@gmail.com';
    let defaultName = isAdm ? 'Administrador Joma' : cleanEmail.split('@')[0];
    if (customName && customName.trim()) {
      defaultName = customName.trim();
    } else if (!isAdm) {
      defaultName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    }

    try {
      const response = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: defaultName,
        }),
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (e) {
      console.warn('Backend login notice, setting client user:', e);
    }

    const fallbackUser: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: defaultName,
      email: cleanEmail,
      isAdmin: isAdm,
      role: isAdm ? 'ADMIN' : 'LEAD_USER',
      provider: 'google',
      avatar: isAdm ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : undefined,
      createdAt: new Date().toISOString(),
    };
    setUser(fallbackUser);
    return fallbackUser;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('SignOut error', e);
    }
    setUser(null);
    setFirebaseUser(null);
    setIsAdminPanelOpen(false);
  };

  const isAdmin = Boolean(
    user?.isAdmin || (user?.email && user.email.toLowerCase() === 'jomamilionarios@gmail.com')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoadingAuth,
        isAdmin,
        loginWithGoogleReal,
        loginWithGoogleEmail,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
