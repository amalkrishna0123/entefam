import { create } from 'zustand';

interface ExpenseState {
  expenses: any[];
  setExpenses: (expenses: any[]) => void;
  addExpense: (expense: any) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
}));
