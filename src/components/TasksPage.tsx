import React, { useState } from 'react';
import { useTaskStore, type Priority } from '@/store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle.trim(), completed: false, priority: newTaskPriority });
    setNewTaskTitle('');
  };

  const priorityColors = {
    High: 'text-red-400 bg-red-400/10 border-red-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Low: 'text-green-400 bg-green-400/10 border-green-400/20',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#27272A] p-6 rounded-2xl border border-[#3f3f46]">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple-400" />
          Add New Task
        </h2>
        <form onSubmit={handleAddTask} className="flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-[#18181A] border border-[#3f3f46] rounded-xl px-4 py-2.5 text-white placeholder:text-[#A1A1AA] focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
            className="bg-[#18181A] border border-[#3f3f46] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-auto py-2.5">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </form>
      </div>

      <div className="bg-[#27272A] p-6 rounded-2xl border border-[#3f3f46]">
        <h2 className="text-xl font-semibold mb-4 text-white">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-[#A1A1AA] text-center py-8">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.li
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all",
                    task.completed ? "bg-[#18181A]/50 border-transparent opacity-60" : "bg-[#18181A] border-[#3f3f46] hover:border-purple-500/30"
                  )}
                >
                  <button onClick={() => toggleTask(task.id)} className="text-[#A1A1AA] hover:text-purple-400 transition-colors shrink-0">
                    {task.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <span className={cn("flex-1 text-white", task.completed && "line-through text-[#A1A1AA]")}>
                    {task.title}
                  </span>
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", priorityColors[task.priority])}>
                    {task.priority}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="text-[#A1A1AA] hover:text-red-400 transition-colors shrink-0 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
