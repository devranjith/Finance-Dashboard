import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Sparkles, TrendingUp, DollarSign, Target, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const STOCK_OF_THE_DAY = {
  ticker: 'NVDA',
  name: 'NVIDIA Corporation',
  currentPrice: 850.50,
  targetPrice: 1050.00,
  financials: {
    peRatio: 75.2,
    debtToEquity: 0.12,
    revenueGrowth: '+125%',
  },
  thesis: [
    'Undisputed leader in AI infrastructure and data center GPUs.',
    'Consistently crushing earnings expectations due to massive enterprise demand.',
    'Low debt-to-equity ratio indicates strong financial health and minimal leverage risk.'
  ]
};

export function StockNewsPage() {
  const { transactions } = useFinanceStore();
  const { monthlySalary } = useSettingsStore();
  
  // Calculate user's total leftover cash (Fixed Salary + Income - Expenses)
  const availableBalance = useMemo(() => {
    const expenses = transactions.reduce((acc, curr) => {
      if (curr.type === 'expense') return acc + curr.amount;
      return acc;
    }, 0);
    const income = transactions.reduce((acc, curr) => {
      if (curr.type === 'income') return acc + curr.amount;
      return acc;
    }, 0);
    return monthlySalary + income - expenses;
  }, [transactions, monthlySalary]);

  const [budgetPercent, setBudgetPercent] = useState<number>(10);
  
  // Calculations
  const budgetAmount = Math.max(0, (availableBalance * budgetPercent) / 100);
  const sharesCanBuy = Math.floor(budgetAmount / STOCK_OF_THE_DAY.currentPrice);
  const totalCost = sharesCanBuy * STOCK_OF_THE_DAY.currentPrice;
  const potentialProfitPerShare = STOCK_OF_THE_DAY.targetPrice - STOCK_OF_THE_DAY.currentPrice;
  const totalPotentialProfit = sharesCanBuy * potentialProfitPerShare;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2 text-sm tracking-widest uppercase">
            <Sparkles className="w-4 h-4" /> Zorvyn AI Pick of the Day
          </div>
          <h1 className="text-3xl font-bold text-white">Investment Assistant</h1>
          <p className="text-[#A1A1AA] mt-1 text-lg">Actionable insights tailored to your budget.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stock Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#27272A] border border-[#3f3f46] rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <TrendingUp className="w-32 h-32 text-blue-500" />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h2 className="text-4xl font-bold text-white tracking-tight">{STOCK_OF_THE_DAY.ticker}</h2>
                <p className="text-[#A1A1AA] text-lg">{STOCK_OF_THE_DAY.name}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">${STOCK_OF_THE_DAY.currentPrice.toFixed(2)}</div>
                <div className="text-green-400 font-medium flex items-center justify-end gap-1 mt-1">
                  Target: ${STOCK_OF_THE_DAY.targetPrice.toFixed(2)} <Target className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Financials Grid */}
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Financial Health</h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#18181A] rounded-xl p-4 border border-[#3f3f46]">
                <div className="text-[#A1A1AA] text-xs mb-1 uppercase tracking-wider">P/E Ratio</div>
                <div className="text-white font-semibold text-xl">{STOCK_OF_THE_DAY.financials.peRatio}</div>
              </div>
              <div className="bg-[#18181A] rounded-xl p-4 border border-[#3f3f46]">
                <div className="text-[#A1A1AA] text-xs mb-1 uppercase tracking-wider">Debt/Equity</div>
                <div className="text-white font-semibold text-xl">{STOCK_OF_THE_DAY.financials.debtToEquity}</div>
              </div>
              <div className="bg-[#18181A] rounded-xl p-4 border border-[#3f3f46]">
                <div className="text-[#A1A1AA] text-xs mb-1 uppercase tracking-wider">Rev Growth</div>
                <div className="text-green-400 font-semibold text-xl">{STOCK_OF_THE_DAY.financials.revenueGrowth}</div>
              </div>
            </div>

            {/* Thesis */}
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-400" /> Why buy?</h3>
            <ul className="space-y-3">
              {STOCK_OF_THE_DAY.thesis.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[#A1A1AA]">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Column: Position Sizer */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-b from-[#27272A] to-[#18181A] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-400" />
              Smart Position Sizer
            </h3>

            {/* Available Balance */}
            <div className="mb-8">
              <div className="text-[#A1A1AA] text-sm mb-1">Your Available Cash</div>
              <div className={`text-3xl font-bold ${availableBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${availableBalance.toFixed(2)}
              </div>
              {availableBalance <= 0 && (
                <div className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> You need a positive balance to invest. Add income transactions in the dashboard!
                </div>
              )}
            </div>

            {/* Slider */}
            <div className={`space-y-4 mb-8 ${availableBalance <= 0 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1AA]">Investment Budget</span>
                <span className="text-white font-semibold">{budgetPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={budgetPercent}
                onChange={(e) => setBudgetPercent(Number(e.target.value))}
                className="w-full h-2 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="text-right text-purple-400 font-bold text-lg">
                ${budgetAmount.toFixed(2)}
              </div>
            </div>

            {/* Results */}
            <div className="bg-[#18181A] rounded-xl p-5 border border-[#3f3f46] space-y-4">
              <div className="flex justify-between items-center border-b border-[#3f3f46] pb-3">
                <span className="text-[#A1A1AA]">Shares you can buy</span>
                <span className="text-2xl font-bold text-white">{sharesCanBuy}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#3f3f46] pb-3">
                <span className="text-[#A1A1AA]">Actual Cost</span>
                <span className="text-white font-medium">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A1A1AA]">Potential Profit</span>
                <span className="text-green-400 font-bold">+${totalPotentialProfit.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 h-12 text-lg">
              Log Trade
            </Button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
