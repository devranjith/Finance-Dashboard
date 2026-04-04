import React from 'react';
import {
  LayoutDashboard,
  WalletCards,
  PieChart,
  Calendar,
  FileBarChart,
  HelpCircle,
  Settings,
  Box,
  Sparkles,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type PageName =
  | 'Dashboard'
  | 'Search'
  | 'Transactions'
  | 'Insights'
  | 'ZorvynAI'
  | 'Accounts'
  | 'Calendar'
  | 'Reports'
  | 'Help & Center'
  | 'Settings';

interface NavProps {
  activePage: PageName;
  onNavigate: (page: PageName) => void;
}

interface SidebarProps extends NavProps {}

/** Shared nav content — used by both desktop sidebar and mobile drawer */
export function SidebarNav({ activePage, onNavigate }: NavProps) {
  const topNav: { name: PageName; icon: React.ElementType }[] = [
    { name: 'Search', icon: Search },
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Transactions', icon: WalletCards },
    { name: 'Insights', icon: PieChart },
  ];

  const middleNav: { name: PageName; icon: React.ElementType }[] = [
    { name: 'Accounts', icon: Box },
    { name: 'Calendar', icon: Calendar },
    { name: 'Reports', icon: FileBarChart },
    { name: 'Help & Center', icon: HelpCircle },
    { name: 'Settings', icon: Settings },
  ];

  const NavButton = ({ name, icon: Icon }: { name: PageName; icon: React.ElementType }) => (
    <button
      key={name}
      onClick={() => onNavigate(name)}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
        activePage === name
          ? 'bg-[#27272A] text-white'
          : 'hover:bg-[#27272A]/50 hover:text-white text-[#A1A1AA]'
      )}
    >
      <Icon size={16} className={activePage === name ? 'text-white' : 'text-[#A1A1AA]'} />
      {name}
    </button>
  );

  return (
    <div className="px-3 py-2 flex-grow flex flex-col">
      {/* Section 1 */}
      <div className="space-y-0.5 mb-5">
        {topNav.map((item) => (
          <NavButton key={item.name} name={item.name} icon={item.icon} />
        ))}
      </div>

      {/* Zorvyn AI */}
      <div className="mb-5">
        <button
          onClick={() => onNavigate('ZorvynAI')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
            activePage === 'ZorvynAI'
              ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-white border border-purple-500/30'
              : 'hover:bg-[#27272A]/50 hover:text-white text-[#A1A1AA]'
          )}
        >
          <Sparkles size={16} className={activePage === 'ZorvynAI' ? 'text-purple-400' : 'text-[#A1A1AA]'} />
          <span className={activePage === 'ZorvynAI' ? 'text-white' : ''}>Zorvyn AI</span>
          {activePage !== 'ZorvynAI' && (
            <span className="ml-auto text-[9px] font-semibold bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full border border-purple-500/30">
              NEW
            </span>
          )}
        </button>
      </div>

      {/* Section 2 */}
      <div className="space-y-0.5">
        {middleNav.map((item) => (
          <NavButton key={item.name} name={item.name} icon={item.icon} />
        ))}
      </div>

      {/* Upgrade Card */}
      <div className="p-1 mt-auto pt-6">
        <div className="bg-[#27272A] rounded-xl p-4 text-center relative overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Box size={20} className="text-white" />
          </div>
          <h4 className="text-white font-medium text-sm mb-1">Upgrade to Pro!</h4>
          <p className="text-xs text-[#A1A1AA] mb-4">Unlock Premium Features and Manage Unlimited transactions</p>
          <Button
            variant="secondary"
            className="w-full bg-[#18181A] hover:bg-[#3f3f46] text-[#A1A1AA] hover:text-white transition-colors h-8 text-xs"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Desktop sidebar — hidden on mobile */
export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-[#27272A] bg-[#18181A] text-[#A1A1AA] flex-col h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-white font-medium text-lg">
          <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center">
            <PieChart size={14} />
          </div>
          FinanceDash
        </div>
        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-7 h-7 rounded-full object-cover" />
      </div>

      <SidebarNav activePage={activePage} onNavigate={onNavigate} />
    </aside>
  );
}
