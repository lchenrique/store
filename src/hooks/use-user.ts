"use client";

import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "./profile";
import { useRouter } from "next/navigation";

interface UserWithRole extends User {
  role?: "ADMIN" | "CUSTOMER";
}

export function useUser() {
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
   enabled: !!profile,
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
