import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarNav } from './Sidebar';
import type { PageName } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: PageName;
  onNavigate: (page: PageName) => void;
}

/** Animated hamburger — 3 bars morph into X */
function HamburgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#27272A] border border-[#3f3f46] hover:border-purple-500/40 hover:bg-[#3f3f46] transition-all duration-200 active:scale-95"
    >
      <div className="w-5 h-4 flex flex-col justify-between">
        {/* Top bar */}
        <motion.span
          animate={open ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="block h-[2px] w-full rounded-full bg-white origin-center"
        />
        {/* Middle bar */}
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2 }}
          className="block h-[2px] w-full rounded-full bg-white origin-center"
        />
        {/* Bottom bar */}
        <motion.span
          animate={open ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="block h-[2px] w-full rounded-full bg-white origin-center"
        />
      </div>
    </button>
  );
}

export function DashboardLayout({ children, activePage, onNavigate }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [activePage]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleMobileNavigate = (page: PageName) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#18181A] text-white font-sans flex">
      {/* ── Desktop Sidebar ── */}
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {/* ── Mobile: top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between px-4 py-3 bg-[#18181A]/90 backdrop-blur-md border-b border-[#27272A]">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center">
            <PieChart size={13} />
          </div>
          FinanceDash
        </div>

        {/* Active page label — centered */}
        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-[#A1A1AA] tracking-wide">
          {activePage === 'VioletAI' ? 'Violet AI' : activePage}
        </span>

        {/* Avatar + hamburger */}
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover border border-[#3f3f46]"
          />
          <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen(o => !o)} />
        </div>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 z-50 bg-[#18181A] border-r border-[#27272A] flex flex-col md:hidden overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A] flex-shrink-0">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center">
                    <PieChart size={13} />
                  </div>
                  FinanceDash
                </div>
                <HamburgerButton open={true} onClick={() => setMobileOpen(false)} />
              </div>

              {/* Nav items with stagger animation */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                }}
                className="flex-1 flex flex-col"
              >
                {/* Wrap SidebarNav items with stagger — we render inline here for stagger control */}
                <motion.div
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                  className="flex-1"
                >
                  <SidebarNav activePage={activePage} onNavigate={handleMobileNavigate} />
                </motion.div>
              </motion.div>

              {/* Bottom glow accent */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen max-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 pt-20 md:pt-8 md:p-8 bg-[#18181A]">
          <div className="max-w-[1400px] mx-auto">
            <Header activePage={activePage} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
