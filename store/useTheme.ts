import { create } from "zustand"

interface ThemeStore {
  isDark: boolean
  toggle: () => void
  setTheme: (isDark: boolean) => void
}

export const useTheme = create<ThemeStore>((set) => ({
  isDark: false,
  toggle: () => set((state) => ({ isDark: !state.isDark })),
  setTheme: (isDark: boolean) => set({ isDark }),
}))
