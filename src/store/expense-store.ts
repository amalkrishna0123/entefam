import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ExpenseState {
  expenses: any[];
  setExpenses: (expenses: any[]) => void;
  addExpense: (expense: any) => void;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: [],
      setExpenses: (expenses) => set({ expenses }),
      addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
    }),
    {
      name: 'familyos-expenses-storage', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
