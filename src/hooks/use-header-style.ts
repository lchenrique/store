import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeaderLayoutType } from '@/config/layouts';

interface HeaderStyleState {
  style: HeaderLayoutType;
  setStyle: (style: HeaderLayoutType) => void;
}

export const useHeaderStyle = create<HeaderStyleState>()(
  persist(
    (set) => ({
      style: 'classic',
      setStyle: (style) => set({ style }),
    }),
    {
      name: 'header-style',
    }
  )
);
