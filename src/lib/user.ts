import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types';

export function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    user_metadata: {
      name: supabaseUser.user_metadata.name ?? '',
      role: supabaseUser.user_metadata.role ?? 'CUSTOMER'
    }
  };
}
