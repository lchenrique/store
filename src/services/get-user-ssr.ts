import { NextRequest } from "next/server";
import { getAccessToken } from "./get-acess-token";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

export const getUserSSR = async (req: NextRequest) => {
    try {
        const token = getAccessToken(req);
        if (!token) {
            return null;
        }

        const supabase = createClient(
            env.NEXT_PUBLIC_SUPABASE_URL!,
            env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error) {
            console.error("[getUserSSR] Error:", error);
            return null;
        }

        return user;
    } catch (error) {
        console.error("[getUserSSR] Error:", error);
        return null;
    }
}