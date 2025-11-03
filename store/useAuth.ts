import { create } from "zustand"

interface AuthStore {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAuth = create<AuthStore>((set) => ({
  token: null,
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: null }),
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}))
