import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCards } from '@/components/dashboard/StatCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { DetailedInsights } from '@/components/dashboard/DetailedInsights';
import { ZorvynAI } from '@/components/ZorvynAI';
import { EmptyPage } from '@/components/EmptyPage';
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
  const [activePage, setActivePage] = useState<PageName>('Dashboard');

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
