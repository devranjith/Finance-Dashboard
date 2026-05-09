import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginPage } from '@/components/LoginPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCards } from '@/components/dashboard/StatCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { DetailedInsights } from '@/components/dashboard/DetailedInsights';
import { ZorvynAI } from '@/components/ZorvynAI';
import { EmptyPage } from '@/components/EmptyPage';
import { TasksPage } from '@/components/TasksPage';
import { StockNewsPage } from '@/components/StockNewsPage';
import { motion, AnimatePresence } from 'framer-motion';
import type { PageName } from '@/components/layout/Sidebar';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const dashboardContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const dashboardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

function DashboardPage() {
  return (
    <motion.div variants={dashboardContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={dashboardItem}>
        <StatCards />
      </motion.div>
      
      <motion.div variants={dashboardItem} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions />
        <PerformanceChart />
      </motion.div>

      <motion.div variants={dashboardItem}>
        <DetailedInsights />
      </motion.div>
    </motion.div>
  );
}

function App() {
  const { user, loading, initializeAuth } = useAuthStore();
  const [activePage, setActivePage] = useState<PageName>('Dashboard');
  const { fetchTransactions } = useFinanceStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [fetchTransactions, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage key="dashboard" />;
      case 'ZorvynAI':
        return (
          <motion.div key="zorvyn" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ZorvynAI />
          </motion.div>
        );
      case 'Tasks':
        return (
          <motion.div key="tasks" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <TasksPage />
          </motion.div>
        );
      case 'Stock News':
        return (
          <motion.div key="stock-news" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <StockNewsPage />
          </motion.div>
        );
      default:
        return (
          <motion.div key={activePage} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <EmptyPage page={activePage} />
          </motion.div>
        );
    }
  };

  return (
    <DashboardLayout activePage={activePage} onNavigate={setActivePage}>
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default App;
