import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { env } from "process"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
   env.NEXT_PUBLIC_SUPABASE_URL!,
   env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return [...cookieStore.getAll()].map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: (cookies) => {
          cookies.forEach((cookie) => {
            cookieStore.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            })
          })
        },
      },
    }
  )
}