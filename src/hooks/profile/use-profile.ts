import { useQuery } from '@tanstack/react-query'
import type { UserProfile } from './types'
import apiClient from '@/services/api'
import { useUser } from '@/hooks/use-user'

interface UseProfileReturn {
  profile: UserProfile | undefined
  isLoading: boolean
}

export interface UseProfileOptions {
  enabled?: boolean
}

export function useProfile({ enabled = true }: UseProfileOptions = {}): UseProfileReturn {

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.getProfile()
      return response
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: false,
    refetchOnWindowFocus: false,
  })
 
  return { profile: data as UserProfile | undefined, isLoading: isLoading}
}
