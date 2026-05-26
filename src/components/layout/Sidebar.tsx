import { navItems } from "@/src/config/nav";
import { LogOut, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/src/context/AuthContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onOpenSettings, isOpen = true, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();

  // If we are a Super Admin, add the SaaS tab to list
  const displayItems = [...navItems];
  if (user?.role === 'SaaS Super Admin') {
    // Avoid double adding
    if (!displayItems.find(i => i.name === 'SaaS Super Admin')) {
      displayItems.unshift({
        name: 'SaaS Super Admin',
        icon: ShieldCheck
      });
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`w-64 bg-[#09352F] text-white flex-col h-screen fixed left-0 top-0 z-50 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">PharmaPlus</h1>
          <p className="text-[#A7D129] text-sm">Pharmacy Management</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {displayItems.map((item) => (
            <a
              key={item.name}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (item.name === 'Settings') {
                  onOpenSettings();
                } else {
                  setActiveTab(item.name);
                }
                if (onClose) onClose();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  item.name === activeTab ? "bg-[#165a4e] text-white font-semibold" : "text-emerald-100 hover:bg-[#165a4e] hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[#165a4e]">
          <div className="bg-[#0b4d45] p-4 rounded-xl">
            <p className="font-semibold text-white">Upgrade to Pro</p>
            <p className="text-xs text-emerald-100 mb-4 opacity-80">Unlock powerful features and grow your business.</p>
            <button
              onClick={() => setActiveTab('Subscription')}
              className="w-full bg-[#A7D129] text-[#09352F] font-bold py-2 rounded-lg text-sm cursor-pointer"
            >
              Upgrade Now
            </button>
          </div>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
            className="flex items-center gap-3 px-4 py-4 mt-2 text-emerald-100 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" /> Logout
          </a>
        </div>
      </div>
    </>
  );
}
