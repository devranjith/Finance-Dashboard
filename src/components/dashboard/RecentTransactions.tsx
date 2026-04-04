import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, Trash2, X, ChevronDown, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { TransactionType } from '@/store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';

type FilterType = 'all' | 'income' | 'expense';
type SortField = 'date' | 'amount' | 'description';
type SortDir = 'asc' | 'desc';

const CATEGORIES = ['All', 'Salary', 'Freelance', 'Groceries', 'Utilities', 'Entertainment', 'Transport', 'General'];

export function RecentTransactions() {
  const { transactions, role, addTransaction, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ description: '', amount: '', category: 'General', type: 'expense' as TransactionType });
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredTransactions = transactions
    .filter(t => {
      const matchSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCategory = filterCategory === 'All' || t.category.toLowerCase() === filterCategory.toLowerCase();
      return matchSearch && matchType && matchCategory;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortField === 'amount') cmp = a.amount - b.amount;
      if (sortField === 'description') cmp = a.description.localeCompare(b.description);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const activeFilterCount = [
    filterType !== 'all',
    filterCategory !== 'All',
  ].filter(Boolean).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;
    
    addTransaction({
      description: newTx.description,
      amount: Number(newTx.amount),
      category: newTx.category,
      type: newTx.type,
      date: new Date().toISOString().split('T')[0],
      categoryColor: newTx.type === 'income' ? '#3b82f6' : '#ec4899'
    });
    
    setIsModalOpen(false);
    setNewTx({ description: '', amount: '', category: 'General', type: 'expense' });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIndicator = ({ field }: { field: SortField }) =>
    sortField === field ? (
      <span className="ml-1 text-purple-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
    ) : null;

  return (
    <Card className="bg-[#27272A] border-transparent p-5 rounded-xl text-white col-span-1 lg:col-span-2 flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] w-4 h-4" />
            <Input 
              className="bg-[#18181A] border-[#3f3f46] text-sm text-white pl-9 h-9 placeholder:text-[#A1A1AA] rounded-lg focus-visible:ring-1 focus-visible:ring-purple-500"
              placeholder="Search here..."
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
              className={`bg-[#18181A] border-[#3f3f46] text-[#A1A1AA] hover:text-white h-9 px-3 rounded-lg relative ${filterOpen ? 'border-purple-500/50 text-white' : ''}`}
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
                  className="absolute right-0 mt-2 w-56 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl shadow-2xl z-50 p-3 space-y-3"
                >
                  {/* Type Filter */}
                  <div>
                    <p className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Type</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {(['all', 'income', 'expense'] as FilterType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setFilterType(t)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            filterType === t
                              ? 'bg-purple-600 text-white'
                              : 'bg-[#27272A] text-[#A1A1AA] hover:text-white'
                          }`}
                        >
                          {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <p className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Category</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            filterCategory === cat
                              ? 'bg-purple-600 text-white'
                              : 'bg-[#27272A] text-[#A1A1AA] hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Sort By</p>
                    <div className="flex gap-1.5">
                      {(['date', 'amount', 'description'] as SortField[]).map(f => (
                        <button
                          key={f}
                          onClick={() => handleSort(f)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            sortField === f
                              ? 'bg-purple-600 text-white'
                              : 'bg-[#27272A] text-[#A1A1AA] hover:text-white'
                          }`}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                          {sortField === f && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { setFilterType('all'); setFilterCategory('All'); }}
                      className="w-full text-xs text-red-400 hover:text-red-300 text-center py-1 border-t border-[#3f3f46] mt-1 pt-2"
                    >
                      Reset Filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {role === 'Admin' && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white h-9 px-3 rounded-lg flex-shrink-0 hidden sm:flex transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <div className="min-w-[500px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-[#A1A1AA] border-b border-[#3f3f46]/50 pb-3 mb-3 px-2">
            <button onClick={() => handleSort('description')} className="col-span-5 text-left hover:text-white flex items-center">
              Description <SortIndicator field="description" />
            </button>
            <div className="col-span-3">Category</div>
            <button onClick={() => handleSort('date')} className="col-span-3 text-left hover:text-white flex items-center">
              Date <SortIndicator field="date" />
            </button>
            <button onClick={() => handleSort('amount')} className="col-span-1 text-right hover:text-white flex items-center justify-end">
              Amount <SortIndicator field="amount" />
            </button>
          </div>

          {/* Scrollable Table Body */}
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 thin-scroll">
            <AnimatePresence>
              {filteredTransactions.map((tx) => (
                <motion.div 
                  key={tx.id} 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="grid grid-cols-12 gap-4 items-center text-sm px-2 py-2.5 rounded-md hover:bg-[#3f3f46]/30 transition-colors group"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center bg-[#18181A]">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tx.categoryColor }} />
                    </div>
                    <span className="truncate">{tx.description}</span>
                    {role === 'Admin' && (
                      <button 
                        onClick={() => deleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-[11px] font-medium bg-[#18181A]" style={{ color: tx.categoryColor }}>
                      {tx.category}
                    </span>
                  </div>
                  <div className="col-span-3 text-[#A1A1AA] text-xs">
                    {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className={`col-span-1 text-right font-medium ${tx.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-[#A1A1AA] text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No transactions found.
              </div>
            )}
          </div>

          {/* Footer row count */}
          <div className="mt-3 pt-3 border-t border-[#3f3f46]/50 flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Showing <span className="text-white font-medium">{filteredTransactions.length}</span> of <span className="text-white font-medium">{transactions.length}</span> transactions</span>
            {(searchTerm || activeFilterCount > 0) && (
              <button
                onClick={() => { setSearchTerm(''); setFilterType('all'); setFilterCategory('All'); }}
                className="text-purple-400 hover:text-purple-300"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#27272A] border border-[#3f3f46] p-6 rounded-xl w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">New Transaction</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#A1A1AA] hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs text-[#A1A1AA] mb-1 block">Description</label>
                  <Input required placeholder="Netflix Subscription" className="bg-[#18181A] border-[#3f3f46] text-white" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-[#A1A1AA] mb-1 block">Amount</label>
                  <Input required type="number" placeholder="15.99" className="bg-[#18181A] border-[#3f3f46] text-white" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#A1A1AA] mb-1 block">Type</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-[#3f3f46] bg-[#18181A] py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as TransactionType})}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A1AA] mb-1 block">Category</label>
                    <Input required placeholder="Entertainment" className="bg-[#18181A] border-[#3f3f46] text-white" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2">Add Transaction</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
