import { create } from 'zustand';
import { supabase } from '@/lib/auth';

interface AuthState {
  user: any;
  isLoading: boolean;
  setUser: (user: any) => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      set({ user: data.user });
    }
    return { error };
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));