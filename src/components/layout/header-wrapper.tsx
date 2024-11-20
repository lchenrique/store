"use client";

import { User } from "@supabase/supabase-js";
import { DynamicHeader } from "./header-variants";
import { useHeaderStyle } from "@/hooks/use-header-style";

interface HeaderWrapperProps {
  store: any;
  user: User | null;
}

export function HeaderWrapper({ store, user }: HeaderWrapperProps) {
  const style = useHeaderStyle((state) => state.style);
  
  return <DynamicHeader variant={style} store={store} user={user} />;
}
