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

interface SidebarProps {
  activePage: PageName;
  onNavigate: (page: PageName) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
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

  return (
    <aside className="w-64 border-r border-[#27272A] bg-[#18181A] text-[#A1A1AA] flex flex-col h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-medium text-lg">
          <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center">
            <PieChart size={14} />
          </div>
          FinanceDash
        </div>
        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-7 h-7 rounded-full object-cover" />
      </div>

      {/* Nav Section 1 */}
      <div className="px-3 py-2 flex-grow">
        <div className="space-y-1 mb-6">
          {topNav.map((item) => (
            <button
              key={item.name}
              onClick={() => onNavigate(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activePage === item.name
                  ? "bg-[#27272A] text-white"
                  : "hover:bg-[#27272A]/50 hover:text-white"
              )}
            >
              <item.icon size={16} className={activePage === item.name ? "text-white" : "text-[#A1A1AA]"} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Zorvyn AI — special item */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('ZorvynAI')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
              activePage === 'ZorvynAI'
                ? "bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-white border border-purple-500/30"
                : "hover:bg-[#27272A]/50 hover:text-white"
            )}
          >
            <Sparkles size={16} className={activePage === 'ZorvynAI' ? "text-purple-400" : "text-[#A1A1AA]"} />
            <span className={activePage === 'ZorvynAI' ? 'text-white' : ''}>Zorvyn AI</span>
            {activePage !== 'ZorvynAI' && (
              <span className="ml-auto text-[9px] font-semibold bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full border border-purple-500/30">
                NEW
              </span>
            )}
          </button>
        </div>

        {/* Nav Section 2 */}
        <div className="space-y-1">
          {middleNav.map((item) => (
            <button
              key={item.name}
              onClick={() => onNavigate(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activePage === item.name
                  ? "bg-[#27272A] text-white"
                  : "hover:bg-[#27272A]/50 hover:text-white"
              )}
            >
              <item.icon size={16} className={activePage === item.name ? "text-white" : "text-[#A1A1AA]"} />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Upgrade Card */}
      <div className="p-4 mt-auto">
        <div className="bg-[#27272A] rounded-xl p-4 text-center relative overflow-hidden group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
             <Box size={20} className="text-white" />
          </div>
          <h4 className="text-white font-medium text-sm mb-1">Upgrade to Pro!</h4>
          <p className="text-xs text-[#A1A1AA] mb-4">Unlock Premium Features and Manage Unlimited transactions</p>
          <Button variant="secondary" className="w-full bg-[#18181A] hover:bg-[#3f3f46] text-[#A1A1AA] hover:text-white transition-colors h-8 text-xs">
            Upgrade Now
          </Button>
        </div>
      </div>
    </aside>
  );
}
