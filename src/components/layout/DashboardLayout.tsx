import React from 'react';
import { Sidebar } from './Sidebar';
import type { PageName } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: PageName;
  onNavigate: (page: PageName) => void;
}

export function DashboardLayout({ children, activePage, onNavigate }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#18181A] text-white font-sans flex">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen h-full max-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#18181A]">
          <div className="max-w-[1400px] mx-auto">
             <Header activePage={activePage} />
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
