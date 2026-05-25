/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Printer } from 'lucide-react';
import { SyncProvider } from "@/src/context/SyncContext";
import { ActivityLogProvider } from "@/src/context/ActivityLogContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { BranchProvider } from "@/src/context/BranchContext";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { BottomNavigation } from "@/src/components/layout/BottomNavigation";
import { TopHeader } from "@/src/components/layout/TopHeader";
import { MobileView } from "@/src/components/layout/MobileView";
import { KpiCard } from "@/src/components/KpiCard";
import { SalesChart } from "@/src/components/SalesChart";
import { OrdersTable } from "@/src/components/OrdersTable";
import { SyncIndicator } from "@/src/components/SyncIndicator";
import { TopSellingMedicines } from "@/src/components/TopSellingMedicines";
import { SalesOverview } from "@/src/components/SalesOverview";
import { ExpiringSoon } from "@/src/components/ExpiringSoon";
import { QuickActions } from "@/src/components/QuickActions";
import { LowStockAlerts } from "@/src/components/LowStockAlerts";
import { SuppliersTable } from "@/src/components/SuppliersTable";
import { FloatingActionButton } from "@/src/components/FloatingActionButton";
import { BarcodeScannerModal } from "@/src/components/BarcodeScannerModal";
import { BulkInventoryUpdateModal } from "@/src/components/BulkInventoryUpdateModal";
import { ExpiryUpdateModal } from "@/src/components/ExpiryUpdateModal";
import { NewPurchaseInvoiceModal } from "@/src/components/NewPurchaseInvoiceModal";
import { ActivityLogs } from "@/src/components/ActivityLogs";
import { SettingsModal } from "@/src/components/SettingsModal";
import { kpiCards } from "@/src/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isExpiryOpen, setIsExpiryOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsPurchaseOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) (searchInput as HTMLInputElement).focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SyncProvider>
      <ActivityLogProvider>
        <BranchProvider>
          <ThemeProvider>
          <div className="min-h-screen bg-bg-main text-text-main pb-16 md:pb-0">
            <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={console.log} />
            <BulkInventoryUpdateModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} />
            <ExpiryUpdateModal isOpen={isExpiryOpen} onClose={() => setIsExpiryOpen(false)} />
            <NewPurchaseInvoiceModal isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            
            {isMobile ? (
              <MobileView 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onOpenSettings={() => setIsSettingsOpen(true)}
                setIsBulkOpen={setIsBulkOpen}
                setIsPurchaseOpen={setIsPurchaseOpen}
                setIsScannerOpen={setIsScannerOpen}
                setIsExpiryOpen={setIsExpiryOpen}
              />
            ) : (
              <>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                <TopHeader onOpenSettings={() => setIsSettingsOpen(true)} activeTab={activeTab} />
                
                <main className="ml-0 md:ml-64 pt-32 p-4 md:p-8">
                  <FloatingActionButton onAddMedicine={() => setIsBulkOpen(true)} onNewSale={() => setIsPurchaseOpen(true)} onScanSale={() => setIsScannerOpen(true)} />

                  {activeTab === 'Dashboard' && (
                <>
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                    {kpiCards.map((card, idx) => (
                      <motion.div key={idx} variants={itemVariants}>
                        <KpiCard {...card} />
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <motion.div variants={itemVariants} className="md:col-span-8">
                      <ErrorBoundary>
                        <SalesChart />
                      </ErrorBoundary>
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:col-span-4">
                      <LowStockAlerts />
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:contents">
                      <TopSellingMedicines />
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:contents">
                      <SalesOverview />
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:contents">
                      <ExpiringSoon />
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-8">
                      <ErrorBoundary>
                        <OrdersTable />
                      </ErrorBoundary>
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:col-span-4">
                      <SuppliersTable />
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:col-span-12">
                      <ActivityLogs />
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:contents">
                      <QuickActions onExpiryUpdate={() => setIsExpiryOpen(true)} />
                    </motion.div>
                  </motion.div>
                </>
              )}

              {activeTab === 'Reports' && (
                <div id="reports-section" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">System Report Center</h2>
                      <p className="text-sm text-gray-500">Aggregate and print professional records of Sales, Stock status, and Profit margins.</p>
                    </div>
                    <button 
                      onClick={() => import('@/src/lib/pdfGenerator').then(m => m.generatePharmacyReport())}
                      className="flex w-full sm:w-auto items-center justify-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-800 transition shadow-sm cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Print Consolidated PDF
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4">I. Sales Overview Graph</h3>
                      <SalesOverview />
                    </div>
                    <div className="md:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4">II. Stock Alert Summary</h3>
                      <LowStockAlerts />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
                    <h3 className="font-bold text-gray-800 mb-2">III. Profit Performance Margins</h3>
                    <p className="text-sm text-gray-500 mb-4">Overview of pharmacy financial metrics as compiled in the system report.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                        <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">Today's margin</p>
                        <p className="text-2xl font-black text-emerald-950 mt-1">$159.00</p>
                        <span className="text-xs text-emerald-700 font-medium">59.1% net profit margin</span>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Yesterday's margin</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">$190.00</p>
                        <span className="text-xs text-slate-600 font-medium">57.5% net profit margin</span>
                      </div>
                      <div className="p-4 bg-lime-50/50 rounded-xl border border-lime-100/50">
                        <p className="text-xs text-lime-800 font-semibold uppercase tracking-wider">Month-to-date</p>
                        <p className="text-2xl font-black text-lime-950 mt-1">$3,320.00</p>
                        <span className="text-xs text-lime-700 font-medium">61.3% net profit margin</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== 'Dashboard' && activeTab !== 'Reports' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Viewing {activeTab}</h2>
                  <p className="text-sm text-gray-500 mb-6">This section is fully mock-navigated. For functional consolidated reports, please click "Reports" on your sidebar.</p>
                  <button 
                    onClick={() => setActiveTab('Dashboard')}
                    className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-800 transition"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
                </main>
              </>
            )}
            <SyncIndicator />
          </div>
        </ThemeProvider>
      </BranchProvider>
      </ActivityLogProvider>
    </SyncProvider>
  );
}
