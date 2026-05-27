/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Printer, ShieldAlert, Volume2 } from 'lucide-react';
import { AuthProvider, useAuth, RolePermissions } from "@/src/context/AuthContext";
import { LoginPage } from "@/src/components/LoginPage";
import { SaaSSuperAdminPage } from "@/src/components/SaaSSuperAdminPage";
import { SubscriptionExpiredPage } from "@/src/components/SubscriptionExpiredPage";
import { SyncProvider } from "@/src/context/SyncContext";
import { ActivityLogProvider } from "@/src/context/ActivityLogContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { SettingsProvider, useSettings } from "@/src/context/SettingsContext";
import { useCurrency } from "@/src/hooks/useCurrency";
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
import { AiAssistant } from "@/src/components/AiAssistant";
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
import { GenericPage } from "@/src/components/GenericPage";
import { MedicinesPage } from "@/src/components/MedicinesPage";
import { DataTablePage } from "@/src/components/DataTablePage";
import { SalesModulePage } from "@/src/components/SalesModulePage";
import { SubscriptionPage } from "@/src/components/SubscriptionPage";
import { StaffManagementPage } from "@/src/components/StaffManagementPage";
import { NotificationsPage } from "@/src/components/NotificationsPage";
import { InventoryPage } from "@/src/components/InventoryPage";
import { PurchaseManagementPage } from "@/src/components/PurchaseManagementPage";
import { ExpenseManagementPage } from "@/src/components/ExpenseManagementPage";
import { CustomerManagementPage } from "@/src/components/CustomerManagementPage";
import { BatchTrackingPage } from "@/src/components/BatchTrackingPage";
import { ReportsPage } from "@/src/components/ReportsPage";
import { DatabaseSyncPage } from "@/src/components/DatabaseSyncPage";
import EnterpriseHub from "@/src/components/EnterpriseHub";
import { kpiCards } from "@/src/data";

const MOCK_MEDICINES = [
  {
    id: '1',
    name: 'Panadol Extra 500mg',
    genericName: 'Paracetamol & Caffeine',
    category: 'Analgesics / Pain Relief',
    batchNumber: 'B-PAN-201',
    expiryDate: '2027-08-15',
    stock: 50,
    price: 5.50,
    purchasePrice: 2.80,
    barcode: '4005800222045',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: '2',
    name: 'Amoxil Forte 250mg',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics',
    batchNumber: 'B-AMX-409',
    expiryDate: '2026-11-20',
    stock: 30,
    price: 12.00,
    purchasePrice: 6.50,
    barcode: '8901030733857',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: '3',
    name: 'Zyrtec Allergy 10mg',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamines',
    batchNumber: 'B-ZYR-045',
    expiryDate: '2028-02-10',
    stock: 100,
    price: 4.50,
    purchasePrice: 1.90,
    barcode: '7611355001556',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=60'
  },
];

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

function AppContent() {
  const { user, currentRolePermissions, announcements } = useAuth();
  const { themeSettings } = useSettings();
  const { formatCurrency, symbol } = useCurrency();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isExpiryOpen, setIsExpiryOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('ai-switch-tab', handleSwitchTab);
    return () => window.removeEventListener('ai-switch-tab', handleSwitchTab);
  }, []);

  useEffect(() => {
    // Apply Dark Mode
    if (themeSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply layout density
    document.documentElement.classList.remove('density-compact', 'density-comfortable');
    document.documentElement.classList.add(`density-${themeSettings.layoutDensity}`);
    
    // Apply primary color as a CSS variable
    document.documentElement.style.setProperty('--primary-color', themeSettings.primaryColor);
  }, [themeSettings]);

  // Tenant-isolated dynamic states
  const [inventory, setInventory] = useState<any[]>([]);
  const [ordersState, setOrdersState] = useState<any[]>([]);

  // 1. Initial Load when switching tenant / client pharmacy workspace
  useEffect(() => {
    if (user?.client?.id) {
      const clientKey = user.client.id;
      
      // Load Inventory
      const savedInv = localStorage.getItem(`pharma_inventory_${clientKey}`);
      if (savedInv) {
        setInventory(JSON.parse(savedInv));
      } else {
        setInventory(MOCK_MEDICINES);
      }

      // Load Orders (Sales history logs)
      const savedOrders = localStorage.getItem(`pharma_orders_${clientKey}`);
      if (savedOrders) {
        setOrdersState(JSON.parse(savedOrders));
      } else {
        // Feed initial rich orders containing items mapped to default medicines (enabling refunds back to stocks)
        const initialDefaultOrders = [
          { 
            id: "INV-2026-9041", 
            customer: "John Doe", 
            date: "25 May 2026", 
            amount: "$16.50", 
            status: "Completed",
            items: [{ id: "1", name: "Panadol Extra 500mg", price: 5.50, purchasePrice: 2.80, quantity: 3 }]
          },
          { 
            id: "INV-2026-9042", 
            customer: "Jane Smith", 
            date: "24 May 2026", 
            amount: "$36.00", 
            status: "Completed",
            items: [{ id: "2", name: "Amoxil Forte 250mg", price: 12.00, purchasePrice: 6.50, quantity: 3 }]
          },
          { 
            id: "INV-2026-9043", 
            customer: "Robert Brown", 
            date: "23 May 2026", 
            amount: "$13.50", 
            status: "Completed",
            items: [{ id: "3", name: "Zyrtec Allergy 10mg", price: 4.50, purchasePrice: 1.90, quantity: 3 }]
          },
          { 
            id: "INV-2026-9044", 
            customer: "Emily Davis", 
            date: "22 May 2026", 
            amount: "$65.75", 
            status: "Pending",
            items: [{ id: "1", name: "Panadol Extra 500mg", price: 5.50, purchasePrice: 2.80, quantity: 2 }]
          },
        ];
        setOrdersState(initialDefaultOrders);
      }
    } else {
      setInventory([]);
      setOrdersState([]);
    }
  }, [user?.client?.id]);

  // 2. Automatically save state edits to storage
  useEffect(() => {
    if (user?.client?.id && inventory.length > 0) {
      localStorage.setItem(`pharma_inventory_${user.client.id}`, JSON.stringify(inventory));
    }
  }, [inventory, user?.client?.id]);

  useEffect(() => {
    if (user?.client?.id && ordersState.length > 0) {
      localStorage.setItem(`pharma_orders_${user.client.id}`, JSON.stringify(ordersState));
    }
  }, [ordersState, user?.client?.id]);

  // Dynamic KPI Metric Card calculations of live checkout databases
  const dynamicKpiCards = React.useMemo(() => {
    if (!user) return [];

    // Sales Sum
    const salesTotal = ordersState.reduce((sum, ord) => {
      if (ord.status !== "Completed") return sum;
      const num = typeof ord.amount === "number"
        ? ord.amount
        : parseFloat(ord.amount.replace(/[^0-9.-]+/g, "")) || 0;
      return sum + num;
    }, 0);

    // Meds count
    const totalMeds = inventory.length;

    // Low stock count (<= 15)
    const lowStockCount = inventory.filter(m => m.stock <= 15).length;

    // Expiring soon in 6 months
    const expiringCount = inventory.filter(m => {
      if (!m.expiryDate) return false;
      const daysLeft = Math.ceil((new Date(m.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysLeft > 0 && daysLeft <= 180;
    }).length;

    // Profits Math
    const profitTotal = ordersState.reduce((sum, ord) => {
      if (ord.status !== "Completed") return sum;
      if (ord.items && ord.items.length > 0) {
        return sum + ord.items.reduce((pSum: number, item: any) => {
          const cost = item.purchasePrice || (item.price * 0.5);
          return pSum + (item.price - cost) * (item.quantity || 1);
        }, 0);
      }
      const amt = typeof ord.amount === "number" ? ord.amount : parseFloat(ord.amount.replace(/[^0-9.-]+/g, "")) || 0;
      return sum + (amt * 0.40);
    }, 0);

    const marginPct = salesTotal > 0 ? ((profitTotal / salesTotal) * 100).toFixed(1) : "38.5";

    return [
      { title: "Total Sales", value: formatCurrency(salesTotal), change: "+14.6%", type: "sales", icon: "ShoppingBag", color: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
      { title: "Total Medicines", value: totalMeds.toString(), change: "+5.2%", type: "medicines", icon: "Pill", color: "bg-indigo-50 text-indigo-700 border border-indigo-100" },
      { title: "Low Stock Items", value: lowStockCount.toString(), change: lowStockCount > 3 ? "Alert" : "-2.0%", type: "low-stock", icon: "AlertTriangle", color: lowStockCount > 2 ? "bg-rose-50 text-rose-700 font-extrabold border border-rose-200 animate-pulse" : "bg-amber-50 text-amber-700 border border-amber-100" },
      { title: "Expiring Soon", value: expiringCount.toString(), change: "-1.5%", type: "expiring", icon: "Calendar", color: expiringCount > 1 ? "bg-red-50 text-red-750 font-bold border border-red-200" : "bg-rose-50 text-rose-700 border border-rose-100" },
      { title: "Total Profit", value: formatCurrency(profitTotal), change: "+16.8%", type: "profit", icon: "DollarSign", color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
      { title: "Net Profit Margin", value: `${marginPct}%`, change: "+1.5%", type: "profit-margin", icon: "Percent", color: "bg-purple-50 text-purple-700 border border-purple-100" },
    ];
  }, [inventory, ordersState, user, formatCurrency]);

  useEffect(() => {
    if (user?.role === 'SaaS Super Admin') {
      setActiveTab('SaaS Super Admin');
    } else {
      setActiveTab('Dashboard');
    }
  }, [user?.role]);

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

  if (!user) {
    return <LoginPage />;
  }

  if (user.client?.isExpired) {
    return <SubscriptionExpiredPage />;
  }

  const checkPermission = (permKey: keyof RolePermissions, tabName: string, children: React.ReactNode) => {
    if (currentRolePermissions[permKey]) {
      return children;
    }
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-gray-150 shadow-xs max-w-xl mx-auto space-y-4 animate-slide-up">
        <div className="mx-auto bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl w-14 h-14 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-amber-600 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h2 className="text-md font-black text-slate-800">SaaS Authorization Locker</h2>
          <p className="text-xs text-gray-500 mt-1">
            Your current active session role (<strong>{user?.role}</strong>) does not hold the <code>{permKey}</code> privilege key for <strong>{tabName}</strong>.
          </p>
        </div>
        <p className="text-[11px] text-gray-450 leading-relaxed bg-[#09352F]/5 p-4 rounded-xl border border-dashed text-left">
          <strong>How to unlock:</strong> Ask an Owner/Admin to go to the <strong>Staff Management › Custom Role Permissions Matrix</strong> page and toggle the <code>{permKey}</code> switch for the <strong>{user?.role}</strong> column.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-bg-main text-text-main pb-16 md:pb-0 flex flex-col">
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
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => {
                  console.log("Toggling sidebar, current state:", isSidebarOpen);
                  setIsSidebarOpen(!isSidebarOpen);
                }}
                orders={ordersState}
                inventory={inventory}
                setInventory={setInventory}
                setOrders={setOrdersState}
              />
            ) : (
              <>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenSettings={() => setIsSettingsOpen(true)} />
                <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                <TopHeader onOpenSettings={() => setIsSettingsOpen(true)} activeTab={activeTab} />
                
                <main className="ml-0 md:ml-64 pt-28 p-4 md:p-8 md:h-screen md:overflow-y-auto pb-24">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-[#0c443c]">{activeTab}</h1>
                    <p className="text-gray-500 text-xs font-semibold mt-1">
                      Session Identity: <span className="text-[#0c443c] font-black">{user?.name}</span> ({user?.role}) | Subscriber Client: <span className="text-emerald-800 font-bold">{user?.client.name}</span>
                    </p>
                  </div>
                  <FloatingActionButton onAddMedicine={() => setIsBulkOpen(true)} onNewSale={() => setIsPurchaseOpen(true)} onScanSale={() => setIsScannerOpen(true)} />

                  {activeTab === 'Dashboard' && (
                <>
                  {announcements && announcements.length > 0 && (
                    <div className="mb-6 space-y-2 animate-slide-up">
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-800 block mb-1">📢 SaaS Network Global Operator Broadcasts</span>
                      {announcements.map((ann) => (
                        <div key={ann.id} className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition ${
                          ann.severity === 'critical' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                          ann.severity === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-850' :
                          'bg-emerald-50 border-emerald-100 text-emerald-850'
                        }`}>
                          <div className={`p-2 rounded-xl shrink-0 ${
                            ann.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                            ann.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <Volume2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-[#09352F] text-xs font-sans">{ann.title}</span>
                              <span className="text-[9.5px] text-gray-400 font-mono font-bold">{ann.date}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-black ${
                                ann.severity === 'critical' ? 'bg-rose-600 text-white' :
                                ann.severity === 'warning' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                              }`}>
                                {ann.severity} Priority
                              </span>
                            </div>
                            <p className="text-[11.5px] mt-1 text-slate-600 leading-relaxed font-semibold">{ann.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-6 mb-8">
                    {dynamicKpiCards.map((card, idx) => (
                      <motion.div key={idx} variants={itemVariants}>
                        <KpiCard {...card} />
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <motion.div variants={itemVariants} className="md:col-span-8">
                      <ErrorBoundary>
                        <SalesChart orders={ordersState} />
                      </ErrorBoundary>
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:col-span-4">
                      <LowStockAlerts inventory={inventory} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:contents">
                      <TopSellingMedicines />
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:contents">
                      <SalesOverview />
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:contents">
                      <ExpiringSoon inventory={inventory} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-8">
                      <ErrorBoundary>
                        <OrdersTable orders={ordersState} />
                      </ErrorBoundary>
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:col-span-4">
                      <SuppliersTable compact={true} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-8 flex flex-col gap-6">
                      <QuickActions 
                        onExpiryUpdate={() => setIsExpiryOpen(true)} 
                        onNewPurchaseInvoiceOpen={() => setIsPurchaseOpen(true)}
                      />
                      <ActivityLogs />
                    </motion.div>
                  </motion.div>
                </>
              )}

              {activeTab === 'Reports' && checkPermission('viewFinanceReports', 'Reports', <ReportsPage inventory={inventory} orders={ordersState} />)}

              {activeTab === 'Medicines' && checkPermission('viewInventory', 'Medicines', <MedicinesPage inventory={inventory} setInventory={setInventory} />)}
              {activeTab === 'Inventory' && checkPermission('viewInventory', 'Inventory', (
                <InventoryPage inventory={inventory} setInventory={setInventory} />
              ))}
              {activeTab === 'Sales / Billing / Returns' && checkPermission('posCheckout', 'Sales / Billing / Returns', (
                <SalesModulePage inventory={inventory} setInventory={setInventory} orders={ordersState} setOrders={setOrdersState} />
              ))}
              {activeTab === 'Purchases' && checkPermission('viewInventory', 'Purchases', (
                <PurchaseManagementPage inventory={inventory} setInventory={setInventory} />
              ))}
              {activeTab === 'Suppliers' && checkPermission('viewInventory', 'Suppliers', <SuppliersTable />)}
              {activeTab === 'Customers' && <CustomerManagementPage />}
              {activeTab === 'Expenses' && checkPermission('viewFinanceReports', 'Expenses', <ExpenseManagementPage />)}
              {activeTab === 'Analytics' && checkPermission('viewFinanceReports', 'Analytics', <ReportsPage inventory={inventory} orders={ordersState} />)}
              {activeTab === 'Database Sync' && checkPermission('dbSyncAdmin', 'Database Sync', <DatabaseSyncPage />)}
              {activeTab === 'Batch Tracking' && checkPermission('viewInventory', 'Batch Tracking', <BatchTrackingPage />)}
              {activeTab === 'Staff Management' && checkPermission('manageStaff', 'Staff Management', <StaffManagementPage />)}
              {activeTab === 'Subscription' && checkPermission('manageSubscription', 'Subscription', <SubscriptionPage />)}
              {activeTab === 'Notifications' && <NotificationsPage />}
              {activeTab === 'SaaS Super Admin' && <SaaSSuperAdminPage />}
              {activeTab === 'Enterprise Core Hub' && <EnterpriseHub />}
              
              {activeTab !== 'Dashboard' && activeTab !== 'Enterprise Core Hub' && activeTab !== 'Reports' && activeTab !== 'Medicines' && activeTab !== 'Inventory' && activeTab !== 'Sales / Billing / Returns' && activeTab !== 'Purchases' && activeTab !== 'Suppliers' && activeTab !== 'Customers' && activeTab !== 'Expenses' && activeTab !== 'Analytics' && activeTab !== 'Database Sync' && activeTab !== 'Batch Tracking' && activeTab !== 'Staff Management' && activeTab !== 'Subscription' && activeTab !== 'Notifications' && activeTab !== 'Settings' && activeTab !== 'SaaS Super Admin' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{activeTab} Section</h2>
                  <p className="text-sm text-gray-500 mb-6">This section is under construction.</p>
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
            <AiAssistant />
          </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <ActivityLogProvider>
          <BranchProvider>
            <ThemeProvider>
              <SettingsProvider>
                <AppContent />
              </SettingsProvider>
            </ThemeProvider>
          </BranchProvider>
        </ActivityLogProvider>
      </SyncProvider>
    </AuthProvider>
  );
}
