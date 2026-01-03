import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  apiKey: string
  setApiKey: (key: string) => void
  clearApiKey: () => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key: string) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: '' }),
    }),
    {
      name: 'chem-lab-settings',
    }
  )
)
