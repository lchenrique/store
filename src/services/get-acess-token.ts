import { NextRequest } from "next/server";

// Função auxiliar para extrair o token
export function getAccessToken(request: NextRequest): string | null {
    // Primeiro tenta pegar do header Authorization
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      console.log('[getAccessToken] Found token in Authorization header');
      return authHeader.split(' ')[1];
    }
  
    // Se não encontrar no header, tenta pegar do cookie do Supabase
    const cookies = request.cookies.getAll();
    console.log('[getAccessToken] All cookies:', cookies.map(c => c.name));
    
    const supabaseCookie = cookies.find(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));
    
    if (supabaseCookie) {
      try {
        console.log('[getAccessToken] Found Supabase cookie:', supabaseCookie.name);
        const sessionStr = decodeURIComponent(supabaseCookie.value);
        console.log('[getAccessToken] Decoded session:', sessionStr.substring(0, 100) + '...');
        
        const session = JSON.parse(sessionStr);
        console.log('[getAccessToken] Access token:', session.access_token.substring(0, 50) + '...');
        
        return session.access_token;
      } catch (error) {
        console.error('[getAccessToken] Error parsing session:', error);
        return null;
      }
    }
  
    console.log('[getAccessToken] No token found');
    return null;
  }