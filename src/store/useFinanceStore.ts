import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  categoryColor: string;
  type: TransactionType;
  description: string;
}

export type Role = 'Viewer' | 'Admin';

interface FinanceState {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-12',
    amount: 500,
    category: 'Salary',
    categoryColor: '#3b82f6', // blue
    type: 'income',
    description: 'Tech Corp Inc.',
  },
  {
    id: '2',
    date: '2024-03-12',
    amount: 120,
    category: 'Groceries',
    categoryColor: '#a855f7', // purple
    type: 'expense',
    description: 'Whole Foods Market',
  },
  {
    id: '3',
    date: '2024-03-11',
    amount: 60,
    category: 'Utilities',
    categoryColor: '#06b6d4', // cyan
    type: 'expense',
    description: 'Electric Bill',
  },
  {
    id: '4',
    date: '2024-03-10',
    amount: 1500,
    category: 'Freelance',
    categoryColor: '#3b82f6', // blue
    type: 'income',
    description: 'Web Design Project',
  },
  {
    id: '5',
    date: '2024-03-09',
    amount: 35,
    category: 'Entertainment',
    categoryColor: '#ec4899', // pink
    type: 'expense',
    description: 'Movie Tickets',
  },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'Admin', // Default to Admin for demonstration
      setRole: (role) => set({ role }),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: Math.random().toString(36).substring(7) },
            ...state.transactions,
          ],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'finance-storage',
    }
  )
);
