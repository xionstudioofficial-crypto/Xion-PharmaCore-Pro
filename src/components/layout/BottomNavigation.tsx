import { LayoutDashboard, ShoppingCart, Package, BarChart } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", tabName: "Dashboard" },
    { icon: Package, label: "Inventory", tabName: "Inventory" },
    { icon: BarChart, label: "Reports", tabName: "Reports" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 p-2">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => setActiveTab(item.tabName)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors min-h-[44px] min-w-[44px] ${
            activeTab === item.tabName ? "text-[#09352F] font-semibold" : "text-gray-500 hover:text-[#09352F]"
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
