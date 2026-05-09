import React from 'react';
import { Share, Bell, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PageName } from './Sidebar';

interface HeaderProps {
  activePage: PageName;
}

const PAGE_TITLES: Record<PageName, { title: string; subtitle: string }> = {
  Dashboard: {
    title: 'Welcome Back, John Cornor! 👋',
    subtitle: '4 Income Sources, 2 Significant Expenses, 8 Transactions (This Week)',
  },
  Search: {
    title: 'Search',
    subtitle: 'Find transactions, reports and more',
  },
  Transactions: {
    title: 'Transactions',
    subtitle: 'View and manage all your transactions',
  },
  Insights: {
    title: 'Insights',
    subtitle: 'Deep financial analytics and trends',
  },
  ZorvynAI: {
    title: 'Zorvyn AI',
    subtitle: 'Your intelligent financial assistant',
  },
  Accounts: {
    title: 'Accounts',
    subtitle: 'Manage your connected bank accounts',
  },
  Calendar: {
    title: 'Calendar',
    subtitle: 'Schedule and track financial events',
  },
  Reports: {
    title: 'Reports',
    subtitle: 'Generate and download detailed reports',
  },
  'Help & Center': {
    title: 'Help & Support',
    subtitle: 'Get help and answers to your questions',
  },
  Settings: {
    title: 'Settings',
    subtitle: 'Manage your account and preferences',
  },
  Tasks: {
    title: 'Tasks & Productivity',
    subtitle: 'Manage your daily to-dos and priorities',
  },
  'Stock News': {
    title: 'Market Insights',
    subtitle: 'Latest financial news and stock market updates',
  },
};

export function Header({ activePage }: HeaderProps) {
  const { role, setRole } = useFinanceStore();
  const { user, signOut } = useAuthStore();
  const pageInfo = PAGE_TITLES[activePage];

  const downloadCSV = () => {
    const { transactions } = useFinanceStore.getState();
    const headers = ['ID', 'Date', 'Amount', 'Category', 'Type', 'Description'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.id,
        t.date,
        t.amount,
        t.category,
        t.type,
        `"${t.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1 text-sm text-[#A1A1AA]">
          <span>{activePage === 'Dashboard' ? 'Dashboard' : `Dashboard / ${activePage}`}</span>
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
          {pageInfo.title}
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          {activePage === 'Dashboard' ? (
            <>
              <span className="text-white font-medium">4</span> Income Sources,{' '}
              <span className="text-white font-medium">2</span> Significant Expenses,{' '}
              <span className="text-white font-medium">8</span> Transactions (This Week)
            </>
          ) : (
            pageInfo.subtitle
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 self-start">
        <div className="text-xs text-[#A1A1AA] hidden lg:flex items-center gap-2 mr-2">
          Last Updated 2 April 2026
          <div className="flex -space-x-2">
            <img src="https://i.pravatar.cc/150?img=11" className="w-6 h-6 rounded-full border-2 border-[#18181A]" alt="User" />
            <img src="https://i.pravatar.cc/150?img=32" className="w-6 h-6 rounded-full border-2 border-[#18181A]" alt="User" />
            <img src="https://i.pravatar.cc/150?img=12" className="w-6 h-6 rounded-full border-2 border-[#18181A]" alt="User" />
          </div>
        </div>

        {/* Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-[#27272A] border-[#3f3f46] text-[#A1A1AA] hover:text-white h-9 px-3 text-xs">
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#27272A] border-[#3f3f46] text-white">
            <DropdownMenuLabel>{user?.email || 'Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3f3f46]" />
            <DropdownMenuLabel className="text-xs text-[#A1A1AA] font-normal">Role Switcher (Demo)</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setRole('Admin')} className="cursor-pointer hover:bg-[#3f3f46] focus:bg-[#3f3f46]">
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('Viewer')} className="cursor-pointer hover:bg-[#3f3f46] focus:bg-[#3f3f46]">
              Viewer
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3f3f46]" />
            <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:bg-red-400/10">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={downloadCSV} variant="outline" className="bg-[#27272A] border-[#3f3f46] text-white hover:bg-[#3f3f46] hover:text-white h-9 px-3">
          <Download size={14} className="mr-2" />
          Export
        </Button>
        <Button size="icon" className="bg-purple-600 hover:bg-purple-700 text-white h-9 w-9 rounded-md hidden md:flex">
          <Share size={14} />
        </Button>
      </div>
    </header>
  );
}
