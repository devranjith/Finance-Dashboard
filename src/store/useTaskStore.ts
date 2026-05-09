import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  created_at: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  toggleTask: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data as Task[] });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    try {
      // Optimistic update
      const tempId = crypto.randomUUID();
      const optimisticTask = { 
        ...task, 
        id: tempId, 
        created_at: new Date().toISOString() 
      };
      set((state) => ({ tasks: [optimisticTask, ...state.tasks] }));

      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;

      // Update with real DB record
      set((state) => ({
        tasks: state.tasks.map(t => t.id === tempId ? data : t)
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      get().fetchTasks(); // revert on error
    }
  },

  toggleTask: async (id, currentStatus) => {
    try {
      // Optimistic
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !currentStatus } : t),
      }));

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling task:', error);
      get().fetchTasks();
    }
  },

  deleteTask: async (id) => {
    try {
      // Optimistic
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      get().fetchTasks();
    }
  },
}));
