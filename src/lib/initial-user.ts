'use client';

import { UserStore } from "@/types";
import { create } from "zustand";

interface InitialUserStore {
  user: UserStore | null;
  setUser: (user: UserStore | null) => void;
}

export const useInitialUser = create<InitialUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
