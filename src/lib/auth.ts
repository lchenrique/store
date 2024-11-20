import { createBrowserClient } from '@supabase/ssr'
import { type Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Pegar o ID da URL do Supabase (127 no caso de localhost)
const getProjectId = () => {
  try {
    const url = new URL(supabaseUrl);
    return url.hostname.split('.')[0];
  } catch (error) {
    return '127';
  }
};

const projectId = getProjectId();
const storageKey = `sb-${projectId}-auth-token`;

export const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      },
    },
  },
});

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data.session) {
    // Salvar os dados da sessão no localStorage com a chave correta
    localStorage.setItem(storageKey, JSON.stringify(data.session));
  }

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  // Limpar todos os tokens e dados da sessão
  localStorage.removeItem(storageKey);
  
  // Limpar todos os cookies relacionados ao Supabase
  const cookies = document.cookie.split(';');
  const projectId = getProjectId();
  
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    if (cookieName.startsWith(`sb-${projectId}`)) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
  
  return { error };
}

interface TokenUser {
  id: string
  aud: string
  role: string
  email: string
}

export async function getUserFromToken(): Promise<TokenUser | null> {
  try {
    const session = await getSession()
    if (!session?.user) {
      return null
    }

    return {
      id: session.user.id,
      aud: session.user.aud,
      role: session.user.user_metadata.role,
      email: session.user.email!,
    }
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}