"use client";

import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "./profile";
import { supabase } from "@/lib/supabase/client";
interface UserWithRole extends User {
  role?: "ADMIN" | "CUSTOMER";
}

export function useUser() {
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },

  });
  console.log("[useUser] Session:", session); 

  const { profile, isLoading: isProfileLoading } = useProfile({
    enabled: !!session
  });



  const isLoading = isProfileLoading || isSessionLoading;

  if (isLoading) {
    return { user: null, isLoading: true };
  }

  if (!session || !profile) {
    return { user: null, isLoading: false };
  }

  const user = {
    ...session.user,
    role: profile.role,
    name: profile.name || session.user.email?.split("@")[0],
  };

  return { user, isLoading: false };
}
