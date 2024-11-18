import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: true,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}))
