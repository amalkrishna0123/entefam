import { create } from 'zustand';

interface EventState {
  events: any[];
  setEvents: (events: any[]) => void;
  addEvent: (event: any) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
}));
