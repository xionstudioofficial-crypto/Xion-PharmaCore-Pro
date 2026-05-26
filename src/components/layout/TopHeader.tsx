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
      className="fixed top-0 left-0 md:left-64 right-0 h-20 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-end z-40 shadow-sm"
    >
      <div className="flex items-center gap-3 lg:gap-6 shrink-0">
        <div className={`flex items-center gap-2 ${isOnline ? 'text-emerald-500' : 'text-orange-500'} shrink-0`}>
           {isOnline ? <Wifi className="w-5 h-5 animate-pulse" /> : <WifiOff className="w-5 h-5" />}
           <span className="text-xs font-medium hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <div className="shrink-0">
          <BranchSelector />
        </div>
        <div className="relative w-40 lg:w-60 xl:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search medicines..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs lg:text-sm focus:ring-1 focus:ring-emerald-700 outline-none" />
          <span className="absolute right-3 top-2 text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border hidden xl:block">Ctrl + K</span>
        </div>
        <button onClick={onOpenSettings} className="shrink-0"><Settings className="text-gray-500 hover:text-emerald-700 cursor-pointer" /></button>
        <div className="relative shrink-0">
            <Bell className="w-6 h-6 text-gray-500 hover:text-emerald-700 transition cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></span>
        </div>
        <div className="flex items-center gap-3 border-l pl-4 lg:pl-6 shrink-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 shrink-0">AU</div>
            <div className="hidden lg:block text-left">
                <p className="font-bold text-sm leading-tight text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button className="text-gray-400 hidden lg:block">▼</button>
        </div>
      </div>
    </motion.header>
  );
}
