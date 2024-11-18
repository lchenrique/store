import { env } from '@/env'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Pegar o ID da URL do Supabase (127 no caso de localhost)
const getProjectId = () => {
  try {
    const url = new URL(env.NEXT_PUBLIC_SUPABASE_URL!);
    return url.hostname.split('.')[0];
  } catch (error) {
    return '127';
  }
};

const projectId = getProjectId();
const storageKey = `sb-${projectId}-auth-token`;

export async function updateSession(request: NextRequest) {
  // Criar uma nova resposta com os headers da requisição
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })


  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          console.log(`[Middleware] Getting cookie ${name}:`, cookie?.value ? 'Found' : 'Not found')
          return cookie?.value
        },
        set(name: string, value: string, options: any) {
          console.log(`[Middleware] Setting cookie ${name}`)
          response.cookies.set({
            name,
            value,
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: true
          })
        },
        remove(name: string, options: any) {
          console.log(`[Middleware] Removing cookie ${name}`)
          response.cookies.delete({
            name,
            ...options,
            path: '/',
          })
        },
      },
    }
  )

  console.log({isProtectedRoute:request.nextUrl.pathname})

  try {
    // Primeiro tentar obter a sessão
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('[Middleware] Erro ao obter sessão:', sessionError)
      return response
    }
    if (!session) {
      // Lista explícita de rotas protegidas
      const protectedPaths = ['/admin', '/minha-conta', '/api/admin'];
      
      // Verifica se a rota atual começa com alguma das rotas protegidas
      const isProtectedRoute = protectedPaths.some(path => 
        request.nextUrl.pathname.startsWith(path)
      );

      console.log('[Middleware] Rota atual:', request.nextUrl.pathname);
      console.log('[Middleware] É rota protegida?', isProtectedRoute);
      
      if (isProtectedRoute) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/auth/login'
        return NextResponse.redirect(redirectUrl)
      }

      // Se não for rota protegida, permite acesso
      return response
    }

    console.log('[Middleware] Sessão encontrada:', {
      user: session.user.email,
      id: session.user.id,
      role: session.user.user_metadata.role
    })

    // Atualizar o cookie com os dados da sessão
    response.cookies.set({
      name: storageKey,
      value: JSON.stringify({
        ...session,
        user: {
          ...session.user,
          id: session.user.id
        }
      }),
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
      secure: true
    })

    const isAdmin = session.user.user_metadata.role === 'ADMIN'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isUserRoute = request.nextUrl.pathname.startsWith('/minha-conta')

    // Se for admin tentando acessar área de usuário
    if (isAdmin && isUserRoute) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Se for usuário tentando acessar área admin
    if (!isAdmin && isAdminRoute) {
      return NextResponse.redirect(new URL('/minha-conta', request.url))
    }

    return response
  } catch (error) {
    console.error('[Middleware] Erro inesperado:', error)
    return response
  }
}