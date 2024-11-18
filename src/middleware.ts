import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Log para debug
  console.log('[Main Middleware] Rota:', request.nextUrl.pathname)
  return await updateSession(request)
}

// Protege apenas rotas específicas
export const config = {
  matcher: [
    '/admin/:path*',
    '/minha-conta/:path*',
    '/api/admin/:path*',
  ]
}