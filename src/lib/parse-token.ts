export const parsedToken = () => {
    const cookies = document.cookie.split('; ');
    const supabaseCookie = cookies.find(c => c.startsWith('sb-') && c.endsWith('-auth-token'));
    if (!supabaseCookie) return null;
    
    try {
        const sessionStr = decodeURIComponent(supabaseCookie.split('=')[1]);
        const session = JSON.parse(sessionStr);
        return session.access_token;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}