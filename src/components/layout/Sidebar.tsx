import { navItems } from "@/src/config/nav";
import { LogOut } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="hidden md:flex w-64 bg-[#09352F] text-white flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">PharmaPlus</h1>
        <p className="text-[#A7D129] text-sm">Pharmacy Management</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.name);
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
            className="w-full bg-[#A7D129] text-[#09352F] font-bold py-2 rounded-lg text-sm"
          >
            Upgrade Now
          </button>
        </div>
        <a href="#" className="flex items-center gap-3 px-4 py-4 mt-2 text-emerald-100 hover:text-white transition">
          <LogOut className="w-5 h-5" /> Logout
        </a>
      </div>
    </div>
  );
}
