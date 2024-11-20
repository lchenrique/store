"use client";

import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  const redirectToLogin = (callbackUrl?: string) => {
    const baseLoginUrl = "/auth/login";
    const url = callbackUrl 
      ? `${baseLoginUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : baseLoginUrl;
    
    router.push(url);
  };

  return {
    redirectToLogin
  };
}
