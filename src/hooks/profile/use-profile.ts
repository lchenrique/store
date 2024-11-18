import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { UserProfile } from './types'

async function getProfile() {
  // Primeiro verifica se tem sessão
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null
  }

  const response = await fetch('/api/user/profile', {
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch profile')
  }

  return response.json() as Promise<UserProfile>
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: false,
    refetchOnWindowFocus: false,
  })
}
