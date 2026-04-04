import React from 'react';
import { Card } from '@/components/ui/card';
import { Wallet, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';

export function StatCards() {
  const stats = [
    {
      title: 'Total Balance',
      value: '$24,500',
      change: '+15% vs last month',
      icon: Wallet,
      positive: true,
    },
    {
      title: 'Income',
      value: '$8,200',
      change: '+5% vs last month',
      icon: ArrowUpRight,
      positive: true,
    },
    {
      title: 'Expenses',
      value: '$3,150',
      change: '-2% vs last month',
      icon: ArrowDownRight,
      positive: false,
    },
    {
      title: 'Savings',
      value: '$5,050',
      change: '+12% vs last month',
      icon: PiggyBank,
      positive: true,
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
