import React from 'react';
import { Card } from '@/components/ui/card';
import { useTaskStore } from '@/store/useTaskStore';
import { AlertCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HighPriorityTasks() {
  const { tasks } = useTaskStore();

  const highPriorityTasks = tasks.filter(t => t.priority === 'High' && !t.completed);

  return (
    <Card className="bg-[#27272A] border-transparent p-5 rounded-xl text-white col-span-1 flex flex-col min-h-[300px] h-[400px]">
      <div className="flex justify-between items-start mb-4 shrink-0">
        <h2 className="text-sm font-medium text-[#A1A1AA] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          High Priority Tasks
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 thin-scroll space-y-3">
        <AnimatePresence>
          {highPriorityTasks.length === 0 ? (
            <div className="text-[#A1A1AA] text-xs text-center mt-10">No high priority tasks! 🎉</div>
          ) : (
            highPriorityTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#18181A] p-3 rounded-lg border border-[#3f3f46] flex gap-3 items-start group hover:border-red-500/30 transition-colors cursor-default"
              >
                <Circle className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white line-clamp-2">{task.title}</p>
                  <p className="text-[10px] text-red-400 mt-1 uppercase tracking-wider font-semibold">High Priority</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
