import React from 'react';
import { motion } from 'framer-motion';
import { WalletCards, PieChart, Box, Calendar, FileBarChart, HelpCircle, Settings, Search, Construction } from 'lucide-react';
import type { PageName } from './layout/Sidebar';

interface EmptyPageConfig {
  icon: React.ElementType;
  color: string;
  gradient: string;
  title: string;
  description: string;
  badge: string;
}

const PAGE_CONFIG: Partial<Record<PageName, EmptyPageConfig>> = {
  Search: {
    icon: Search,
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    title: 'Global Search',
    description: 'Search across all your transactions, reports, accounts, and insights from one place. Full-text search with smart filters is coming soon.',
    badge: 'Coming Soon',
  },
  Transactions: {
    icon: WalletCards,
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-pink-500/10',
    title: 'All Transactions',
    description: 'View and manage your complete transaction history with advanced filtering, bulk actions, and export capabilities. This full view is coming soon.',
    badge: 'In Development',
  },
  Insights: {
    icon: PieChart,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-indigo-500/10',
    title: 'Financial Insights',
    description: 'Deep analytics including spending forecasts, trend analysis, category breakdowns, and AI-powered recommendations.',
    badge: 'Coming Soon',
  },
  Accounts: {
    icon: Box,
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    title: 'Connected Accounts',
    description: 'Link and manage your bank accounts, credit cards, and investment portfolios for a complete financial overview.',
    badge: 'Coming Soon',
  },
  Calendar: {
    icon: Calendar,
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-orange-500/10',
    title: 'Financial Calendar',
    description: 'Visualize upcoming bills, scheduled payments, subscription renewals, and financial goals on a calendar view.',
    badge: 'Planned',
  },
  Reports: {
    icon: FileBarChart,
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-500/10',
    title: 'Reports & Analytics',
    description: 'Generate monthly, quarterly, and yearly financial reports. Export as PDF or CSV with customizable templates.',
    badge: 'In Development',
  },
  'Help & Center': {
    icon: HelpCircle,
    color: '#6366f1',
    gradient: 'from-indigo-500/20 to-purple-500/10',
    title: 'Help & Support Center',
    description: 'Browse our documentation, FAQs, video tutorials, and contact our support team for assistance.',
    badge: 'Coming Soon',
  },
  Settings: {
    icon: Settings,
    color: '#A1A1AA',
    gradient: 'from-zinc-500/20 to-slate-500/10',
    title: 'Settings & Preferences',
    description: 'Customize your dashboard, manage notification preferences, connected integrations, security settings, and billing.',
    badge: 'Coming Soon',
  },
};

const FEATURES: Partial<Record<PageName, string[]>> = {
  Search: ['Full-text transaction search', 'Smart auto-complete', 'Filter by date, type, amount', 'Search across all pages'],
  Transactions: ['Complete transaction history', 'Bulk edit & delete', 'Advanced multi-column filters', 'CSV/PDF export'],
  Insights: ['Spending forecasts', 'Month-over-month trends', 'Category heat maps', 'AI-powered suggestions'],
  Accounts: ['Bank account linking', 'Real-time balance sync', 'Credit card tracking', 'Investment portfolios'],
  Calendar: ['Bill due dates', 'Subscription tracker', 'Budget milestones', 'Custom reminders'],
  Reports: ['Monthly summaries', 'Tax-ready reports', 'Custom date ranges', 'Multiple export formats'],
  'Help & Center': ['Searchable knowledge base', 'Video tutorials', 'Live chat support', 'Community forum'],
  Settings: ['Profile & security', 'Notification settings', 'Theme & appearance', 'API integrations'],
};

interface EmptyPageProps {
  page: PageName;
}

export function EmptyPage({ page }: EmptyPageProps) {
  const config = PAGE_CONFIG[page];
  if (!config) return null;

  const IconComp = config.icon;
  const features = FEATURES[page] || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="max-w-md w-full"
      >
        {/* Icon */}
        <div className="relative mx-auto mb-6 w-24 h-24">
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.gradient} blur-xl`} />
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl"
            style={{ backgroundColor: `${config.color}18` }}
          >
            <IconComp size={40} style={{ color: config.color }} />
          </div>
        </div>

        {/* Badge */}
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border mb-4"
          style={{ color: config.color, borderColor: `${config.color}40`, backgroundColor: `${config.color}10` }}
        >
          <Construction size={10} />
          {config.badge}
        </span>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">{config.title}</h2>
        <p className="text-[#A1A1AA] text-sm leading-relaxed mb-8">{config.description}</p>

        {/* Feature List */}
        {features.length > 0 && (
          <div className="bg-[#27272A] border border-[#3f3f46]/50 rounded-2xl p-5 text-left">
            <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">What's included</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: `${config.color}20` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                  </div>
                  <span className="text-xs text-[#D4D4D8]">{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] text-[#52525b] mt-6">
          This feature is actively being developed. Stay tuned for updates!
        </p>
      </motion.div>
    </div>
  );
}
