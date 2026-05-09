import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

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
  loading: boolean;
  error: string | null;
  setRole: (role: Role) => void;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  role: 'Admin',
  loading: false,
  error: null,
  setRole: (role) => set({ role }),
  
  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      set({ transactions: data as Transaction[], loading: false });
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      set({ error: error.message, loading: false });
    }
  },

  addTransaction: async (transaction) => {
    try {
      // Optimistic update
      const tempId = crypto.randomUUID();
      const optimisticTx = { ...transaction, id: tempId };
      set((state) => ({ transactions: [optimisticTx, ...state.transactions] }));

      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic ID with real database ID
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === tempId ? data : t)),
      }));
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      // Revert on failure by refetching
      get().fetchTransactions();
    }
  },

  deleteTransaction: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      // Revert on failure
      get().fetchTransactions();
    }
  },
}));
