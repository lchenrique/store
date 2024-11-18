import { env } from "@/env";
import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

function getSupabaseBrowserClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

function getSupabaseAdminClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function useSupabaseBrowser() {
  return useMemo(getSupabaseBrowserClient, []);
}

const supabase = getSupabaseBrowserClient();
const supabaseAdmin = getSupabaseAdminClient();

export { supabase, supabaseAdmin, useSupabaseBrowser };
