import React, { useState } from "react";
import { 
  Menu, Bell, ChevronDown, ChevronRight, Plus, ShoppingCart, 
  Package, Receipt, Printer, Home, Pill, MoreHorizontal, Scan,
  Wallet, CalendarDays, AlertTriangle, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LowStockAlerts } from "@/src/components/LowStockAlerts";
import { ExpiringSoon } from "@/src/components/ExpiringSoon";
import { SalesOverview } from "@/src/components/SalesOverview";
import { OrdersTable } from "@/src/components/OrdersTable";
import { ActivityLogs } from "@/src/components/ActivityLogs";
import { SuppliersTable } from "@/src/components/SuppliersTable";
import { generatePharmacyReport } from "@/src/lib/pdfGenerator";

// Beautiful custom medicine package mockup rendered in responsive vectors
const MedicineBox = ({ color }: { color: string }) => {
  return (
    <div className="w-12 h-9 rounded-md border border-gray-100 flex items-center bg-white shadow-sm overflow-hidden p-1 gap-1">
      <div className={`w-3.5 h-full rounded ${color} opacity-90 flex-shrink-0 flex items-center justify-center`}>
        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
      </div>
      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div className="space-y-0.5">
          <div className="w-6 h-1 bg-gray-300 rounded-sm"></div>
          <div className="w-4 h-[2px] bg-gray-200 rounded-sm"></div>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[5px] text-gray-400 font-bold scale-75 origin-left leading-none uppercase">Rx</span>
          <div className="w-4 h-[2px] bg-gray-100 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

// High fidelity custom interactive sales analytics bar chart
export function MobileSalesChart() {
  const points = [
    { day: "01", val: 40 },
    { day: "02", val: 58 },
    { day: "03", val: 32 },
    { day: "04", val: 45 },
    { day: "05", val: 24 },
    { day: "06", val: 50 },
    { day: "07", val: 42 },
    { day: "08", val: 30 },
    { day: "09", val: 48 },
    { day: "10", val: 56 },
    { day: "11", val: 68 }, 
    { day: "12", val: 78, active: true }, // Highlighted active bar with tooltip 
    { day: "13", val: 52 },
    { day: "14", val: 48 },
    { day: "15", val: 64 },
    { day: "16", val: 36 },
    { day: "17", val: 55 },
    { day: "18", val: 60 },
    { day: "19", val: 44 },
    { day: "20", val: 28 },
    { day: "21", val: 36 },
    { day: "22", val: 62 },
    { day: "23", val: 35 },
    { day: "24", val: 42 },
    { day: "25", val: 52 },
    { day: "26", val: 48 },
    { day: "27", val: 30 }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-extrabold text-gray-800 text-sm">Sales Analytics</h3>
        <div className="flex items-center gap-1 border border-gray-100 bg-gray-50/50 rounded-xl px-2.5 py-1 text-xs text-gray-500 font-medium">
          <span>This Month</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
      
      {/* Chart Canvas Area */}
      <div className="relative h-44 flex items-end gap-1 px-1">
        {/* Y Axis Gridlines */}
        <div className="absolute inset-x-0 top-0 bottom-5 flex flex-col justify-between text-[9px] text-gray-400 pointer-events-none">
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between"><span>10K</span></div>
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between"><span>8K</span></div>
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between"><span>6K</span></div>
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between"><span>4K</span></div>
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between"><span>2K</span></div>
          <div className="w-full flex justify-between"><span className="opacity-0">0</span></div>
        </div>

        {/* Bars Container */}
        <div className="flex-1 h-full flex items-end justify-between pl-8 pb-5 z-10 relative">
          {points.map((pt, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative">
              {/* Highlighted Tooltip */}
              {pt.active && (
                <div className="absolute bottom-full mb-1 flex flex-col items-center z-30 transition-transform duration-200">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-2 px-2.5 flex flex-col items-center text-center -translate-y-1 select-none min-w-[70px]">
                    <span className="text-[8px] text-gray-400 font-semibold leading-none mb-0.5">12 May</span>
                    <span className="text-xs font-black text-emerald-600 leading-none">$8,450</span>
                  </div>
                  {/* Arrow pin */}
                  <div className="w-2 h-2 bg-white border-r border-b border-gray-100 rotate-45 -mt-1 shadow-sm"></div>
                  {/* Vertical dashed line */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1.5px] h-32 border-l border-dashed border-[#10b981] -z-10 mt-1"></div>
                </div>
              )}
              
              {/* Bar */}
              <div 
                style={{ height: `${pt.val}%` }} 
                className={`w-1.5 sm:w-2 rounded-t-full transition-all duration-300 ${
                  pt.active 
                    ? "bg-[#09352F] ring-4 ring-[#09352F]/10 scale-105" 
                    : "bg-emerald-500 hover:bg-[#09352F] opacity-75 hover:opacity-100"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between text-[10px] text-gray-400 pl-[38px] pr-2 mt-1 select-none">
        <span>01</span>
        <span>06</span>
        <span>11</span>
        <span>16</span>
        <span>21</span>
        <span>26</span>
        <span>30</span>
      </div>
    </div>
  );
}

// Quick Overview Circular actions
interface OverviewItemProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
}

const OverviewItem = ({ icon: Icon, label, onClick }: OverviewItemProps) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-gray-50 active:scale-95 transition-all text-center flex-1 min-w-[76px] px-1 touch-manipulation"
    >
      <div className="w-12 h-12 rounded-full bg-[#f2faf7] hover:bg-[#e4f5ee] flex items-center justify-center text-emerald-700 shadow-sm transition border border-emerald-100/30">
        <Icon className="w-5 h-5 stroke-[2.2]" />
      </div>
      <span className="text-[11px] font-bold text-gray-700 leading-tight whitespace-nowrap">{label}</span>
    </button>
  );
};

// Alerts box list matching Unsplash pill-box mockups beautifully
const AlertsSection = ({ onOpenScan, onOpenExpiry }: { onOpenScan: () => void; onOpenExpiry: () => void }) => {
  const alerts = [
    {
      name: "Paracetamol 500mg",
      status: "Low Stock (8 left)",
      statusColor: "text-red-500 bg-red-50",
      pillColor: "bg-sky-500",
      action: onOpenScan
    },
    {
      name: "Augmentin 625mg",
      status: "Expiring in 19 days",
      statusColor: "text-amber-500 bg-amber-50",
      pillColor: "bg-amber-500",
      action: onOpenExpiry
    },
    {
      name: "Amoxicillin 250mg",
      status: "Low Stock (12 left)",
      statusColor: "text-red-500 bg-red-50",
      pillColor: "bg-emerald-600",
      action: onOpenScan
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-extrabold text-gray-800 text-sm">Alerts</h3>
        <button onClick={onOpenExpiry} className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700">
          View All
        </button>
      </div>

      <div className="divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/10">
        {alerts.map((alert, idx) => (
          <button
            key={idx}
            onClick={alert.action}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 active:bg-gray-100/50 transition-colors text-left active:scale-[0.99] touch-manipulation"
          >
            <MedicineBox color={alert.pillColor} />
            <div className="flex-1 min-w-0 pl-1">
              <p className="text-sm font-bold text-gray-800 truncate">{alert.name}</p>
              <span className={`inline-block text-[10px] font-bold mt-0.5 ${alert.statusColor.split(' ')[0]}`}>
                {alert.status}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

interface MobileViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  setIsBulkOpen: (open: boolean) => void;
  setIsPurchaseOpen: (open: boolean) => void;
  setIsScannerOpen: (open: boolean) => void;
  setIsExpiryOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  orders: any[];
  inventory: any[];
  setInventory: (inv: any[]) => void;
  setOrders: (ords: any[]) => void;
}

import { Sidebar } from "@/src/components/layout/Sidebar";

export function MobileView({
  activeTab,
  setActiveTab,
  onOpenSettings,
  setIsBulkOpen,
  setIsPurchaseOpen,
  setIsScannerOpen,
  setIsExpiryOpen,
  isSidebarOpen,
  toggleSidebar,
  orders,
  inventory,
  setInventory,
  setOrders
}: MobileViewProps) {
  return (
    <div className="md:hidden flex flex-col min-h-screen bg-[#F6FAF8] text-slate-800 pb-28">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={onOpenSettings} 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar} 
      />
      {/* 1. Brand/Header bar */}
      <header className="sticky top-0 bg-white border-b border-gray-100/80 px-4 py-3 flex items-center justify-between z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg active:scale-95 transition-all">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#09352F] flex items-center justify-center font-extrabold text-[#A7D129] text-sm select-none shadow-sm">
              P
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-black text-[#09352F] leading-tight select-none">PharmaPlus</span>
              <span className="text-[9px] font-bold text-gray-400 tracking-wider leading-none select-none uppercase">Pharmacy Management</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Diagnostic status bell */}
          <div className="relative p-1 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#A7D129] text-[#09352F] text-[9px] font-extrabold rounded-full flex items-center justify-center select-none shadow-sm scale-95 border border-white">
              3
            </span>
          </div>

          <div className="flex items-center gap-1 active:bg-gray-50 p-1 rounded-xl transition cursor-pointer" onClick={onOpenSettings}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
              alt="Admin Profile" 
              className="w-8 h-8 rounded-full border border-gray-200 shadow-inner select-none pointer-events-none" 
            />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </header>

      {/* 2. Main Content viewport */}
      <main className="p-4 flex-1">
        
        {/* Dynamic Screen Toggling rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'Dashboard' && (
            <motion.div 
              key="mobile-dash"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Dynamic Greeting panel */}
              <div className="flex justify-between items-center bg-transparent mt-2">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">Welcome back, Admin 👋</h1>
                  <span className="text-xs text-gray-500 mt-1 block">Here's what's happening today.</span>
                </div>
                <button 
                  onClick={() => setIsBulkOpen(true)}
                  className="bg-[#09352F] hover:bg-emerald-950 text-white font-bold text-xs p-3 px-4 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all select-none touch-manipulation"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Medicine
                </button>
              </div>

              {/* 2x2 grid KPIs cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sale KPI CARD */}
                <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#09352F] flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Sales</span>
                    <p className="text-base font-black text-slate-800 mt-0.5 truncate">$12,500.00</p>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1 leading-none select-none">
                      ↑ 18.6% <span className="text-gray-400 font-normal ml-0.5">last month</span>
                    </span>
                  </div>
                </div>

                {/* Medicines KPI CARD */}
                <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#09352F] flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Medicines</span>
                    <p className="text-base font-black text-slate-800 mt-0.5 truncate">1,250</p>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1 leading-none select-none">
                      ↑ 8.2% <span className="text-gray-400 font-normal ml-0.5">last month</span>
                    </span>
                  </div>
                </div>

                {/* Low Stock KPI CARD */}
                <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Low Stock</span>
                    <p className="text-base font-black text-slate-800 mt-0.5 truncate">35</p>
                    <span className="text-[10px] font-bold text-red-500 flex items-center mt-1 leading-none select-none">
                      ↓ 4.3% <span className="text-gray-400 font-normal ml-0.5">last month</span>
                    </span>
                  </div>
                </div>

                {/* Expiring KPI CARD */}
                <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Expiring</span>
                    <p className="text-base font-black text-slate-800 mt-0.5 truncate">18</p>
                    <span className="text-[10px] font-bold text-red-500 flex items-center mt-1 leading-none select-none">
                      ↓ 2.1% <span className="text-gray-400 font-normal ml-0.5">last month</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytics high fidelity section */}
              <MobileSalesChart />

              {/* Recent Orders Section */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-3">Recent Orders</h3>
                <div className="overflow-x-auto select-none rounded-xl">
                    <OrdersTable orders={orders} />
                </div>
              </div>

              {/* Suppliers Section (Compact) */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-3">Suppliers</h3>
                <SuppliersTable compact={true} />
              </div>

              {/* Quick Overview Section */}
              <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-extrabold text-gray-800 text-sm">Quick Overview</h3>
                  <button onClick={() => setActiveTab('Sales / Billing / Returns')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <OverviewItem icon={Plus} label="Add Medicine" onClick={() => setIsBulkOpen(true)} />
                  <OverviewItem icon={ShoppingCart} label="New Sale" onClick={() => setIsPurchaseOpen(true)} />
                  <OverviewItem icon={Package} label="Purchase" onClick={() => setIsPurchaseOpen(true)} />
                  <OverviewItem icon={Receipt} label="Expense" onClick={() => setIsPurchaseOpen(true)} />
                </div>
              </div>

              {/* Custom Alerts Section */}
              <AlertsSection 
                onOpenScan={() => setIsScannerOpen(true)} 
                onOpenExpiry={() => setIsExpiryOpen(true)} 
              />
            </motion.div>
          )}

          {activeTab === 'Medicines' && (
            <motion.div 
              key="mobile-meds"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Medicines Screen banner */}
              <div className="bg-[#09352F] text-white p-5 rounded-3xl shadow-sm flex justify-between items-center overflow-hidden relative">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-center p-2">
                  <Pill className="w-32 h-32 rotate-12" />
                </div>
                <div className="z-10 min-w-0">
                  <h2 className="text-lg font-extrabold leading-tight">Medicines Library</h2>
                  <p className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase mt-1">1,250 Registered formulas</p>
                </div>
                <button 
                  onClick={() => setIsBulkOpen(true)}
                  className="bg-[#A7D129] text-[#09352F] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 hover:bg-[#bceb3b] z-10 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" /> Add Stock
                </button>
              </div>

              {/* Expiring Soon listing */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">Critical Expirations</h3>
                  <button onClick={() => setIsExpiryOpen(true)} className="text-xs font-bold text-emerald-600">Update Dates</button>
                </div>
                <ExpiringSoon />
              </div>

              {/* Low stock indicators lists */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-3">Low Stock Warnings</h3>
                <LowStockAlerts />
              </div>
            </motion.div>
          )}

          {activeTab === 'Sales / Billing / Returns' && (
            <motion.div 
              key="mobile-sales"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Sales Invoice header */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-slate-800">Sales Transactions</h2>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5 block">Online and synchronized</span>
                </div>
                <button
                  onClick={() => setIsPurchaseOpen(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs p-3 px-4 rounded-xl active:scale-95 transition-all"
                >
                  + New Bill
                </button>
              </div>

              {/* Sales Trends Chart */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-4">Performance graph</h3>
                <SalesOverview />
              </div>

              {/* High touch responsive Table containing Orders */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-3">Recent Sales Ledger</h3>
                <div className="overflow-x-auto select-none rounded-xl">
                  <OrdersTable />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Reports' && (
            <motion.div 
              key="mobile-reports"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-800">Report Center</h2>
                <p className="text-xs text-gray-500 mt-1">Acquire physical records of pharmacy activities instantly.</p>
                
                <button 
                  onClick={() => generatePharmacyReport()}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                >
                  <Printer className="w-4 h-4" /> Print PDF Inventory Report
                </button>
              </div>

              {/* Live stream of system actions and changes */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-4">Security & Activity Audit</h3>
                <ActivityLogs />
              </div>
            </motion.div>
          )}

          {/* Any other layout redirects to dashboard fallback */}
          {activeTab !== 'Dashboard' && activeTab !== 'Medicines' && activeTab !== 'Sales / Billing / Returns' && activeTab !== 'Reports' && (
            <motion.div 
              key="mobile-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm mt-12"
            >
              <h2 className="text-base font-extrabold text-gray-800 mb-1">Tab {activeTab} Selected</h2>
              <p className="text-xs text-gray-400 mb-6">Fully integrated under background synchronizer core.</p>
              <button 
                onClick={() => setActiveTab('Dashboard')}
                className="bg-[#09352F] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Back to Mobile Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 3. Embedded Mobile Navigation Bar with 5 key items and center scan */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center h-20 px-2 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-50">
        
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('Dashboard')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'Dashboard' ? "text-[#09352F] font-black scale-105" : "text-gray-400 hover:text-gray-500"
          }`}
        >
          <Home className="w-5.5 h-5.5 stroke-[2.2]" />
          <span className="text-[10px] mt-1 font-extrabold">Dashboard</span>
        </button>

        {/* Tab 2: Medicines */}
        <button
          onClick={() => setActiveTab('Medicines')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'Medicines' ? "text-[#09352F] font-black scale-105" : "text-gray-400 hover:text-gray-500"
          }`}
        >
          <Pill className="w-5.5 h-5.5 stroke-[2.2]" />
          <span className="text-[10px] mt-1 font-extrabold">Medicines</span>
        </button>

        {/* Center Tab: Barcode Scanner action */}
        <div className="relative -top-4 flex flex-col items-center justify-center select-none">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-14 h-14 bg-[#09352F] active:bg-emerald-950 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-900/20 border-4 border-white transition-all transform active:scale-90 hover:scale-105"
          >
            <Scan className="w-6 h-6 stroke-[2.5] text-[#A7D129] animate-pulse" />
          </button>
          <span className="text-[10px] mt-1 font-black text-gray-400 select-none">Scan</span>
        </div>

        {/* Tab 4: Sales */}
        <button
          onClick={() => setActiveTab('Sales / Billing')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'Sales / Billing' ? "text-[#09352F] font-black scale-105" : "text-gray-400 hover:text-gray-500"
          }`}
        >
          <ShoppingCart className="w-5.5 h-5.5 stroke-[2.2]" />
          <span className="text-[10px] mt-1 font-extrabold">Sales</span>
        </button>

        {/* Tab 5: More (linked to consolidated report center & settings) */}
        <button
          onClick={() => setActiveTab('Reports')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'Reports' ? "text-[#09352F] font-black scale-105" : "text-gray-400 hover:text-gray-500"
          }`}
        >
          <MoreHorizontal className="w-5.5 h-5.5 stroke-[2.2]" />
          <span className="text-[10px] mt-1 font-extrabold">More</span>
        </button>

      </nav>
    </div>
  );
}
