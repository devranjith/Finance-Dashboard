import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { motion } from 'framer-motion';
import { Settings, DollarSign, Calendar, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AccountsPage() {
  const { monthlySalary, payday, updateSettings, loading } = useSettingsStore();
  const [salaryInput, setSalaryInput] = useState(monthlySalary.toString());
  const [paydayInput, setPaydayInput] = useState(payday.toString());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSalaryInput(monthlySalary.toString());
    setPaydayInput(payday.toString());
  }, [monthlySalary, payday]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings(Number(salaryInput), Number(paydayInput));
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2 text-sm tracking-widest uppercase">
        <Settings className="w-4 h-4" /> Account Settings
      </div>
      <h1 className="text-3xl font-bold text-white">Salary & Cash Flow</h1>
      <p className="text-[#A1A1AA] mt-1 text-lg">Define your baseline income to power the dashboard analytics.</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-[#27272A] border-[#3f3f46] p-8 rounded-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-[#A1A1AA] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Fixed Monthly Salary
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium">$</span>
                <Input 
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="bg-[#18181A] border-[#3f3f46] text-white pl-8 h-12 text-lg rounded-xl focus-visible:ring-purple-500"
                />
              </div>
              <p className="text-xs text-[#A1A1AA]">This will be used as your baseline Income for all cash flow calculations.</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-[#A1A1AA] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Payday (Day of Month)
              </label>
              <Input 
                type="number"
                min="1"
                max="31"
                value={paydayInput}
                onChange={(e) => setPaydayInput(e.target.value)}
                className="bg-[#18181A] border-[#3f3f46] text-white px-4 h-12 text-lg rounded-xl focus-visible:ring-purple-500"
              />
              <p className="text-xs text-[#A1A1AA]">We will use this to reset your monthly spendings cycle.</p>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-[#3f3f46] flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || loading}
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8 rounded-xl font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
