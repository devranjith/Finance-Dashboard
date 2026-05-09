import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Filter, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';
import { format } from 'date-fns';

type InsightStatus = 'All' | 'On Track' | 'In Progress' | 'Warning';

const insightsData = [
  {
    category: 'Housing',
    color: '#3b82f6',
    status: 'In Progress' as const,
    statusIcon: Clock,
    statusColor: '#3b82f6',
    progress: 70,
    spending: '$1400 / $2000',
    lastUpdate: '12 Mar 2024',
    trend: 'Michael M',
    avatarId: 10,
  },
  {
    category: 'Food & Dining',
    color: '#a855f7',
    status: 'On Track' as const,
    statusIcon: CheckCircle2,
    statusColor: '#22c55e',
    progress: 100,
    spending: '$500 / $500',
    lastUpdate: '16 Mar 2024',
    trend: 'Jhon Cena',
    avatarId: 11,
  },
  {
    category: 'Transportation',
    color: '#06b6d4',
    status: 'Warning' as const,
    statusIcon: AlertTriangle,
    statusColor: '#f59e0b',
    progress: 85,
    spending: '$170 / $200',
    lastUpdate: '18 May 2024',
    trend: 'Dawne Jay',
    avatarId: 12,
  },
  {
    category: 'Entertainment',
    color: '#ec4899',
    status: 'On Track' as const,
    statusIcon: CheckCircle2,
    statusColor: '#22c55e',
    progress: 45,
    spending: '$225 / $500',
    lastUpdate: '20 Mar 2024',
    trend: 'Sara K',
    avatarId: 13,
  },
  {
    category: 'Healthcare',
    color: '#10b981',
    status: 'Warning' as const,
    statusIcon: AlertTriangle,
    statusColor: '#f59e0b',
    progress: 92,
    spending: '$460 / $500',
    lastUpdate: '1 Apr 2024',
    trend: 'James L',
    avatarId: 14,
  },
  {
    category: 'Savings',
    color: '#f59e0b',
    status: 'In Progress' as const,
    statusIcon: Clock,
    statusColor: '#3b82f6',
    progress: 55,
    spending: '$1100 / $2000',
    lastUpdate: '28 Mar 2024',
    trend: 'Anna P',
    avatarId: 15,
  },
];

export function DetailedInsights() {
  const { transactions } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InsightStatus>('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dynamicInsightsData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { amount: 0, color: t.categoryColor, latestDate: t.date };
      }
      acc[t.category].amount += Number(t.amount);
      if (new Date(t.date) > new Date(acc[t.category].latestDate)) {
        acc[t.category].latestDate = t.date;
      }
      return acc;
    }, {} as Record<string, { amount: number, color: string, latestDate: string }>);

    return Object.entries(grouped).map(([category, data], i) => {
      const budget = Math.max(500, Math.ceil(data.amount / 100) * 100 + 100); 
      const progress = Math.min(100, Math.round((data.amount / budget) * 100));
      
      let status: InsightStatus = 'In Progress';
      let statusIcon = Clock;
      let statusColor = '#3b82f6';
      
      if (progress >= 85) {
        status = 'Warning';
        statusIcon = AlertTriangle;
        statusColor = '#f59e0b';
      } else if (progress <= 50) {
        status = 'On Track';
        statusIcon = CheckCircle2;
        statusColor = '#22c55e';
      }

      return {
        category,
        color: data.color || '#3b82f6',
        status,
        statusIcon,
        statusColor,
        progress,
        spending: `$${data.amount} / $${budget}`,
        lastUpdate: format(new Date(data.latestDate), 'dd MMM yyyy'),
        trend: 'You',
        avatarId: 10 + i,
      };
    });
  }, [transactions]);

  const filteredInsights = dynamicInsightsData.filter((item) => {
    const matchSearch =
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trend.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeFilterCount = filterStatus !== 'All' ? 1 : 0;

  const statusOptions: InsightStatus[] = ['All', 'On Track', 'In Progress', 'Warning'];
  const statusColors: Record<string, string> = {
    'On Track': '#22c55e',
    'In Progress': '#3b82f6',
    'Warning': '#f59e0b',
  };

  return (
    <Card className="bg-[#27272A] border-transparent p-5 rounded-xl text-white mt-6 overflow-visible">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-medium">Spending Breakdown</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] w-4 h-4" />
            <Input 
              className="bg-[#18181A] border-[#3f3f46] text-sm text-white pl-9 h-9 placeholder:text-[#A1A1AA] rounded-lg focus-visible:ring-1 focus-visible:ring-purple-500"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex-shrink-0" ref={filterRef}>
            <Button
              variant="outline"
              onClick={() => setFilterOpen(o => !o)}
              className={`bg-[#18181A] border-[#3f3f46] text-[#A1A1AA] hover:text-white h-9 px-3 rounded-lg ${filterOpen ? 'border-purple-500/50 text-white' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1.5 bg-purple-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl shadow-2xl z-50 p-3 space-y-3"
                >
                  <div>
                    <p className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Status</p>
                    <div className="flex flex-wrap gap-1.5">
                      {statusOptions.map(s => (
                        <button
                          key={s}
                          onClick={() => setFilterStatus(s)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                            filterStatus === s
                              ? 'bg-purple-600 text-white'
                              : 'bg-[#27272A] text-[#A1A1AA] hover:text-white'
                          }`}
                        >
                          {s !== 'All' && (
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[s] }} />
                          )}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => setFilterStatus('All')}
                      className="w-full text-xs text-red-400 hover:text-red-300 text-center py-1 border-t border-[#3f3f46] pt-2"
                    >
                      Reset Filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 text-xs font-medium text-[#A1A1AA] border-b border-[#3f3f46]/50 pb-3 mb-3 px-4">
            <div className="col-span-1">Category</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Progress</div>
            <div className="col-span-1">Spending</div>
            <div className="col-span-1">Last Update</div>
            <div className="col-span-1 text-right">Owner</div>
          </div>

          {/* Scrollable Table Body */}
          <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 thin-scroll">
            <AnimatePresence>
              {filteredInsights.map((item, i) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-6 gap-4 items-center text-sm px-4 py-3 rounded-lg hover:bg-[#3f3f46]/30 transition-colors"
                >
                  {/* Category Column */}
                  <div className="col-span-1 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium whitespace-nowrap">{item.category}</span>
                  </div>
                  
                  {/* Status Column */}
                  <div className="col-span-1 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#3f3f46]" style={{ color: item.statusColor }}>
                      <item.statusIcon size={12} />
                      {item.status}
                    </div>
                  </div>

                  {/* Progress Column */}
                  <div className="col-span-1 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[#18181A] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{item.progress}%</span>
                  </div>

                  {/* Spending Column */}
                  <div className="col-span-1 text-[#A1A1AA] text-xs">
                    {item.spending}
                  </div>

                  {/* Last Update */}
                  <div className="col-span-1 text-[#A1A1AA] text-xs">
                    {item.lastUpdate}
                  </div>

                  {/* Owner Column */}
                  <div className="col-span-1 flex justify-end items-center gap-2">
                     <div className="flex items-center gap-2">
                        <img src={`https://i.pravatar.cc/150?img=${item.avatarId}`} className="w-5 h-5 rounded-full object-cover" alt="User" />
                        <span className="text-xs text-[#A1A1AA]">{item.trend}</span>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredInsights.length === 0 && (
              <div className="text-center py-8 text-[#A1A1AA] text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No categories found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-[#3f3f46]/50 flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Showing <span className="text-white font-medium">{filteredInsights.length}</span> of <span className="text-white font-medium">{dynamicInsightsData.length}</span> categories</span>
            {(searchTerm || activeFilterCount > 0) && (
              <button
                onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
                className="text-purple-400 hover:text-purple-300"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
