import {
  useQuery as useReactQuery,
  useMutation as useReactMutation,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

export function useQuery<T>(
  key: QueryKey,
  fetcher: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useReactQuery({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  });
}

export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'> & {
    invalidateQueries?: QueryKey;
  }
) {
  const queryClient = useQueryClient();

  return useReactMutation({
    mutationFn,
    ...options,
    onSuccess: async (data, variables, context) => {
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context);
      }
      // Optionally invalidate queries
      if (options?.invalidateQueries) {
        await queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
      }
    },  });
}