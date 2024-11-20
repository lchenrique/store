import { NextRequest } from "next/server";

// Função auxiliar para extrair o token
export function getAccessToken(request: NextRequest): string | null {
    try {
        // Primeiro tenta pegar do header Authorization
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            console.log('[getAccessToken] Found token in Authorization header');
            return authHeader.split(' ')[1];
        }
    
        // Se não encontrar no header, tenta pegar do cookie do Supabase
        const cookies = request.cookies.getAll();
        const supabaseCookie = cookies.find(cookie => 
            cookie.name.startsWith('sb-') && 
            cookie.name.endsWith('-auth-token')
        );
        
        if (!supabaseCookie) {
            console.log('[getAccessToken] No Supabase cookie found');
            return null;
        }

        try {
            const sessionStr = decodeURIComponent(supabaseCookie.value);
            if (!sessionStr) {
                console.log('[getAccessToken] Empty session string');
                return null;
            }

            const session = JSON.parse(sessionStr);
            if (!session?.access_token) {
                console.log('[getAccessToken] No access_token in session');
                return null;
            }

            return session.access_token;
        } catch (error) {
            console.error('[getAccessToken] Error parsing session:', error);
            return null;
        }
    } catch (error) {
        console.error('[getAccessToken] Unexpected error:', error);
        return null;
    }
}