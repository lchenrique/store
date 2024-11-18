import { getStore } from "@/lib/store";
import { ClientHeader } from "./client-header";
import { getUserSSR } from "@/services/get-user-ssr";
import { createClient } from "@/lib/supabase/server";


export async function Header() {
  const supabase = createClient();
  const {data: { user }} = await supabase.auth.getUser();
  const store = await getStore();
  
  return <ClientHeader store={store} user={user}/>;
}
