import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Wallet, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export function StatCards() {
  const { transactions } = useFinanceStore();
  const { monthlySalary } = useSettingsStore();

  const { income, expenses } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += Number(t.amount);
      if (t.type === 'expense') exp += Number(t.amount);
    });
    return { income: inc, expenses: exp };
  }, [transactions]);

  const totalIncome = monthlySalary + income;
  const balance = totalIncome - expenses;
  const savings = totalIncome - expenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      change: 'Available Funds',
      icon: Wallet,
      positive: balance >= 0,
    },
    {
      title: 'Fixed Salary',
      value: formatCurrency(monthlySalary),
      change: 'Baseline Income',
      icon: ArrowUpRight,
      positive: true,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(expenses),
      change: 'Spendings',
      icon: ArrowDownRight,
      positive: false,
    },
    {
      title: 'Leftover Money',
      value: formatCurrency(savings),
      change: 'Cash Flow',
      icon: PiggyBank,
      positive: savings >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-[#27272A] border-transparent p-5 rounded-xl shadow-sm text-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm text-[#A1A1AA] font-medium">{stat.title}</h3>
            <div className="w-8 h-8 rounded-lg bg-[#3f3f46]/50 flex items-center justify-center text-[#A1A1AA]">
              <stat.icon size={16} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-semibold">{stat.value}</span>
            <span className="text-xs text-[#A1A1AA] font-medium flex items-center gap-1">
               <span className="text-white font-medium">{stat.change.split(' ')[0]}</span>
               {' '}{stat.change.split(' ').slice(1).join(' ')}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
