  "use client";
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react';


  interface QueryProviderProps {
    children: ReactNode
  }

  export function QueryProvider({ children }: QueryProviderProps) {
    const  [queryClient] = useState(() => new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
          staleTime: 1000 * 60 * 5, // 5 minutes
        },
      },
    }))

    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="left"
          buttonPosition="bottom-left"
          toggleButtonProps={{
            style: {
              marginBottom: '10px',
              marginLeft: '10px'
            }
          }}
        />
      </QueryClientProvider>
    )
  }
