import { create } from 'zustand';

interface EMIState {
  emis: any[];
  setEmis: (emis: any[]) => void;
}

export const useEMIStore = create<EMIState>((set) => ({
  emis: [],
  setEmis: (emis) => set({ emis }),
}));
