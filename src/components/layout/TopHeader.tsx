import { Bell, Search, Settings, Wifi, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { BranchSelector } from "@/src/components/BranchSelector";
import { useSync } from "@/src/context/SyncContext";

export function TopHeader({ onOpenSettings, activeTab }: { onOpenSettings: () => void; activeTab: string }) {
  const { isOnline } = useSync();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 md:left-64 right-0 h-24 bg-white border-b px-4 md:px-8 flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{activeTab}</h1>
        <p className="text-gray-500 text-sm">Welcome back, Admin 👋</p>
      </div>
      <div className="flex items-center gap-6">
        <div className={`flex items-center gap-2 ${isOnline ? 'text-emerald-500' : 'text-orange-500'}`}>
           {isOnline ? <Wifi className="w-5 h-5 animate-pulse" /> : <WifiOff className="w-5 h-5" />}
           <span className="text-xs font-medium">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <BranchSelector />
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search medicines, invoices, customers..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-1 focus:ring-emerald-700 outline-none" />
          <span className="absolute right-3 top-2 text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border">Ctrl + K</span>
        </div>
        <button onClick={onOpenSettings}><Settings className="text-gray-500 hover:text-emerald-700" /></button>
        <div className="relative">
            <Bell className="w-6 h-6 text-gray-500 hover:text-emerald-700 transition cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></span>
        </div>
        <div className="flex items-center gap-3 border-l pl-6">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">AU</div>
            <div>
                <p className="font-bold text-sm">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button className="text-gray-400">▼</button>
        </div>
      </div>
    </motion.header>
  );
}
