import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSupabase, getAccount, restoreCrossDomainSession } from './appwrite';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase();
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        await restoreCrossDomainSession();
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          if (data.session?.user) {
            setUser(data.session.user);
            await loadProfile();
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (!mounted) return;
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile();
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const loadProfile = async () => {
    try {
      const acc = getAccount();
      const awUser = await acc.get();
      // Load from fl_profiles (freelance-specific)
      const { data } = await supabase.from('fl_profiles').select('*').eq('user_id', awUser.$id).maybeSingle();
      if (data) {
        setProfile({
          id: data.id,
          email: awUser.email,
          full_name: data.name || awUser.name,
          avatar_url: data.avatar || '',
          role: data.role || 'client',
          created_at: data.$createdAt || '',
          updated_at: data.$updatedAt || '',
        });
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user') };
    try {
      const acc = getAccount();
      const awUser = await acc.get();
      const { data: existing } = await supabase.from('fl_profiles').select('*').eq('user_id', awUser.$id).maybeSingle();
      if (existing) {
        await supabase.from('fl_profiles').update(updates).eq('id', existing.id);
        await loadProfile();
      }
      return { error: null };
    } catch (error) { return { error: error as Error }; }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    const noop = async () => ({ error: null }) as any;
    return {
      user: null, profile: null, loading: false,
      signUp: noop, signIn: noop, signInWithGoogle: noop,
      signOut: async () => {}, updateProfile: noop,
    };
  }
  return context;
}
