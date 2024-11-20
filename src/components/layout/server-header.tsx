import { getStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/server";
import { HeaderWrapper } from "@/components/layout/header-wrapper";

export async function Header() {
  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();
  const store = await getStore();
  
  return <HeaderWrapper store={store} user={user} />;
}
