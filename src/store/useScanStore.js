import { create } from 'zustand'

export const useScanStore = create((set) => ({
  activeClassId: '',
  scanning: false,
  logs: [],
  setActiveClassId: (activeClassId) => set({ activeClassId }),
  setScanning: (scanning) => set({ scanning }),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 50) })), // Keep last 50 logs
  clearLogs: () => set({ logs: [] }),
}))
