import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface SettingsState {
  monthlySalary: number;
  payday: number;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (salary: number, day: number) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  monthlySalary: 0,
  payday: 1,
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore "no rows returned"
        console.error('Error fetching settings:', error);
      }
      
      if (data) {
        set({ monthlySalary: Number(data.monthly_salary), payday: data.payday });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (salary, day) => {
    set({ monthlySalary: salary, payday: day }); // Optimistic update
    try {
      const { data: existingData } = await supabase.from('user_settings').select('id').limit(1).single();
      
      if (existingData) {
        await supabase
          .from('user_settings')
          .update({ monthly_salary: salary, payday: day })
          .eq('id', existingData.id);
      } else {
        await supabase
          .from('user_settings')
          .insert([{ monthly_salary: salary, payday: day }]);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }
}));
