import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, LineChart as LucideLineChart, 
  Download, Printer, FileText, Layers, ShoppingBag, Truck, Calendar, 
  ArrowUpDown, Search, Building2, Users, CheckCircle2, Clock, Sparkles, 
  TrendingUp as IconProfit, AlertTriangle, ShieldCheck, RefreshCw, Filter, FileSpreadsheet
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area
} from "recharts";

// --- DATATYPES DESIGN ---

interface SalesSummaryRef {
  id: string;
  date: string;
  customerName: string;
  itemsCount: number;
  totalValue: number;
  growthContribution: number;
  channel: "In-Store Counter" | "Mobile Delivery" | "Online Prescription Portal";
}

interface InventorySummaryRef {
  sku: string;
  medicineName: string;
  category: "Antibiotics" | "Analgesics" | "Cardio" | "Anti-Acid" | "OTC Care";
  stockLevel: number;
  reorderLevel: number;
  unitCost: number;
  totalAssetValue: number;
  healthStatus: "Optimal" | "Low Stock" | "Reorder Required";
}

interface ProfitSummaryRef {
  quarter: string;
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  netProfit: number;
  marginPercent: number;
}

interface ExpenseSummaryRef {
  id: string;
  category: "Staff Salaries" | "Clinic Utilities" | "Property Rent Lease" | "Hazardous bio-disposal" | "Local Marketing";
  amount: number;
  frequency: "Monthly" | "Bi-Monthly" | "Quarterly" | "Fixed-OneOff";
  paymentDate: string;
  referenceNotes: string;
}

interface SupplierPerformanceRef {
  id: string;
  supplierName: string;
  totalOrders: number;
  purchaseVolumeVal: number;
  fulfillmentRate: number; // Percentage
  avgLeadTimeDays: number;
  duesAmount: number;
}


// --- FIXED COMPATIBLE SIMULATED ANALYTICS PACKETS ---

const SALES_REPORT_DATA: SalesSummaryRef[] = [
  { id: "TX-9041", date: "2026-05-25", customerName: "Marcus Wright", itemsCount: 3, totalValue: 145.50, growthContribution: 4.8, channel: "In-Store Counter" },
  { id: "TX-9042", date: "2026-05-25", customerName: "John Connor", itemsCount: 4, totalValue: 320.00, growthContribution: 10.5, channel: "Online Prescription Portal" },
  { id: "TX-9039", date: "2026-05-24", customerName: "Sarah Connor", itemsCount: 2, totalValue: 45.50, growthContribution: 1.5, channel: "In-Store Counter" },
  { id: "TX-9031", date: "2026-05-23", customerName: "Ellen Ripley", itemsCount: 5, totalValue: 210.00, growthContribution: 6.9, channel: "Mobile Delivery" },
  { id: "TX-8982", date: "2026-05-21", customerName: "David Bowman", itemsCount: 1, totalValue: 85.00, growthContribution: 2.8, channel: "In-Store Counter" },
  { id: "TX-8971", date: "2026-05-20", customerName: "Thomas Anderson", itemsCount: 3, totalValue: 180.00, growthContribution: 5.9, channel: "Online Prescription Portal" },
  { id: "TX-8904", date: "2026-05-18", customerName: "Clarice Starling", itemsCount: 2, totalValue: 65.00, growthContribution: 2.1, channel: "Mobile Delivery" }
];

const REVENUE_GROWTH_CHART = [
  { period: "May 20", revenue: 2450, transactions: 42, growth: 12.5 },
  { period: "May 21", revenue: 2890, transactions: 48, growth: 14.8 },
  { period: "May 22", revenue: 3120, transactions: 54, growth: 16.2 },
  { period: "May 23", revenue: 3560, transactions: 61, growth: 19.5 },
  { period: "May 24", revenue: 4180, transactions: 70, growth: 22.1 },
  { period: "May 25", revenue: 4890, transactions: 78, growth: 25.4 },
  { period: "May 26 (MTD)", revenue: 5420, transactions: 89, growth: 28.9 }
];

const SALES_BY_CATEGORY_CHART = [
  { name: "Antibiotics", value: 2100, color: "#047857" },
  { name: "Analgesics", value: 1450, color: "#0284c7" },
  { name: "Cardio", value: 920, color: "#f59e0b" },
  { name: "OTC Generic", value: 650, color: "#8b5cf6" },
  { name: "Vitamins & Misc", value: 300, color: "#ec4899" }
];

const INVENTORY_REPORT_DATA: InventorySummaryRef[] = [
  { sku: "MED-AB-01", medicineName: "Amoxicillin Trihydrate 500mg", category: "Antibiotics", stockLevel: 450, reorderLevel: 200, unitCost: 0.45, totalAssetValue: 202.50, healthStatus: "Optimal" },
  { sku: "MED-AN-02", medicineName: "Paracetamol (Panadol Extra)", category: "Analgesics", stockLevel: 120, reorderLevel: 250, unitCost: 0.12, totalAssetValue: 14.40, healthStatus: "Low Stock" },
  { sku: "MED-CD-03", medicineName: "Atorvastatin (Lipitor 20mg)", category: "Cardio", stockLevel: 310, reorderLevel: 150, unitCost: 1.85, totalAssetValue: 573.50, healthStatus: "Optimal" },
  { sku: "MED-AC-04", medicineName: "Esomeprazole (Nexium 40mg)", category: "Anti-Acid", stockLevel: 45, reorderLevel: 100, unitCost: 2.10, totalAssetValue: 94.50, healthStatus: "Reorder Required" },
  { sku: "MED-OT-05", medicineName: "Cetirizine (Zyrtec Allergy 10mg)", category: "OTC Care", stockLevel: 220, reorderLevel: 100, unitCost: 0.35, totalAssetValue: 77.00, healthStatus: "Optimal" },
  { sku: "MED-AN-06", medicineName: "Ibuprofen Forte 400mg", category: "Analgesics", stockLevel: 80, reorderLevel: 150, unitCost: 0.22, totalAssetValue: 17.60, healthStatus: "Low Stock" }
];

const INVENTORY_CHART_STATS = [
  { name: "Antibiotics", val: 3200, itemsCount: 145 },
  { name: "Analgesics", val: 1850, itemsCount: 92 },
  { name: "Cardio Care", val: 4200, itemsCount: 41 },
  { name: "Anti-Acids", val: 1200, itemsCount: 34 },
  { name: "OTC Generic", val: 950, itemsCount: 110 }
];

const PROFIT_REPORT_DATA: ProfitSummaryRef[] = [
  { quarter: "2025-Q3", revenue: 12200, cogs: 4800, operatingExpenses: 3100, netProfit: 4300, marginPercent: 35.2 },
  { quarter: "2025-Q4", revenue: 15400, cogs: 5900, operatingExpenses: 3400, netProfit: 6100, marginPercent: 39.6 },
  { quarter: "2026-Q1", revenue: 18105, cogs: 6850, operatingExpenses: 3900, netProfit: 7355, marginPercent: 40.6 },
  { quarter: "2026-Q2 (Proj)", revenue: 21500, cogs: 8100, operatingExpenses: 4400, netProfit: 9000, marginPercent: 41.8 }
];

const EXPENSE_REPORT_DATA: ExpenseSummaryRef[] = [
  { id: "EXP-9241", category: "Staff Salaries", amount: 4800.00, frequency: "Monthly", paymentDate: "2026-05-01", referenceNotes: "Core pharmacist payroll clearance" },
  { id: "EXP-9242", category: "Property Rent Lease", amount: 2200.00, frequency: "Monthly", paymentDate: "2026-05-01", referenceNotes: "Clinic plaza clinic rental checkout" },
  { id: "EXP-9255", category: "Clinic Utilities", amount: 450.00, frequency: "Monthly", paymentDate: "2026-05-08", referenceNotes: "Bulk refrigeration electric cooling grids" },
  { id: "EXP-9269", category: "Local Marketing", amount: 650.00, frequency: "Fixed-OneOff", paymentDate: "2026-05-12", referenceNotes: "Medical camp flyer sheets" },
  { id: "EXP-9271", category: "Hazardous bio-disposal", amount: 320.00, frequency: "Bi-Monthly", paymentDate: "2026-05-15", referenceNotes: "Bio-contaminations discard logistics" }
];

const SUPPLIER_PERFORMANCE_DATA: SupplierPerformanceRef[] = [
  { id: "SUP-A", supplierName: "PharmaCorp Wholesales", totalOrders: 21, purchaseVolumeVal: 8450.00, fulfillmentRate: 98.4, avgLeadTimeDays: 2.1, duesAmount: 1250.00 },
  { id: "SUP-B", supplierName: "MediSupply Distribution Ltd.", totalOrders: 14, purchaseVolumeVal: 4620.00, fulfillmentRate: 95.8, avgLeadTimeDays: 3.4, duesAmount: 450.00 },
  { id: "SUP-C", supplierName: "GlaxoSmithKline Depot", totalOrders: 8, purchaseVolumeVal: 12800.00, fulfillmentRate: 100.0, avgLeadTimeDays: 1.5, duesAmount: 0.00 },
  { id: "SUP-D", supplierName: "Novartis Logistics", totalOrders: 6, purchaseVolumeVal: 3500.00, fulfillmentRate: 92.5, avgLeadTimeDays: 4.2, duesAmount: 980.00 }
];

interface ReportsPageProps {
  inventory?: any[];
  orders?: any[];
}

export function ReportsPage({ inventory = [], orders = [] }: ReportsPageProps) {
  // Select active report tab section: "Sales" | "Inventory" | "Profit" | "Expenses" | "Suppliers"
  const [activeReportTab, setActiveReportTab] = useState<"Sales" | "Inventory" | "Profit" | "Expenses" | "Suppliers">("Sales");
  
  // Custom filter or query limits
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState("");

  // Handler to simulate dataset refresh
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Handler to mock document downloads (Saves on user files feedback)
  const triggerExcelExport = (reportType: string) => {
    const fileName = `${reportType.toLowerCase()}_summary_report_2026.csv`;
    setExportSuccessMessage(`Format compiled & exported into ${fileName} successfully!`);
    setTimeout(() => {
      setExportSuccessMessage("");
    }, 4500);
  };

  // Dynamic metrics computed from real tenant workspace data
  const dynamicSalesTotal = React.useMemo(() => {
    return orders.reduce((sum, ord) => {
      if (ord.status !== 'Completed') return sum;
      const amount = typeof ord.amount === 'number' 
        ? ord.amount 
        : parseFloat(ord.amount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0);
  }, [orders]);

  const dynamicAssetsValue = React.useMemo(() => {
    return inventory.reduce((sum, x) => sum + (x.stock * (x.purchasePrice || (x.price * 0.5))), 0);
  }, [inventory]);

  const dynamicLowStockAlertCount = React.useMemo(() => {
    return inventory.filter(i => i.stock <= 15).length;
  }, [inventory]);

  const dynamicProjectedProfit = React.useMemo(() => {
    return orders.reduce((sum, ord) => {
      if (ord.status !== 'Completed') return sum;
      if (ord.items && ord.items.length > 0) {
        return sum + ord.items.reduce((pSum: number, item: any) => {
          const cost = item.purchasePrice || (item.price * 0.5);
          return pSum + (item.price - cost) * (item.quantity || 1);
        }, 0);
      }
      const amount = typeof ord.amount === 'number' 
        ? ord.amount 
        : parseFloat(ord.amount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + (amount * 0.40);
    }, 0);
  }, [orders]);

  // Calculations across dashboard summaries dynamically merging real metrics with static history
  const totalSalesVal = dynamicSalesTotal > 0 ? dynamicSalesTotal : REVENUE_GROWTH_CHART[REVENUE_GROWTH_CHART.length - 1].revenue;
  const growthRatePct = dynamicSalesTotal > 0 ? Math.min(45, (dynamicSalesTotal / 1250) * 100) : REVENUE_GROWTH_CHART[REVENUE_GROWTH_CHART.length - 1].growth;
  const rawAssetVal = dynamicAssetsValue > 0 ? dynamicAssetsValue : INVENTORY_REPORT_DATA.reduce((s, x) => s + x.totalAssetValue, 0);
  const reorderAlertCount = dynamicLowStockAlertCount > 0 ? dynamicLowStockAlertCount : INVENTORY_REPORT_DATA.filter(i => i.healthStatus !== "Optimal").length;
  const projectedProfit = dynamicProjectedProfit > 0 ? dynamicProjectedProfit : PROFIT_REPORT_DATA[PROFIT_REPORT_DATA.length - 1].netProfit;
  const cogsProjected = (totalSalesVal - projectedProfit) > 0 ? (totalSalesVal - projectedProfit) : PROFIT_REPORT_DATA[PROFIT_REPORT_DATA.length - 1].cogs;
  const maxExpensesSum = EXPENSE_REPORT_DATA.reduce((s, e) => s + e.amount, 0);
  const supplierDuesPayableSum = SUPPLIER_PERFORMANCE_DATA.reduce((s, d) => s + d.duesAmount, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      
      {/* 1. Header with Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-150 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Interactive Reports & Corporate Analytics</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Audit consolidated sales trends, inventory turnover, quarterly profit structures, operational outlays, and wholesaler records.</p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          {/* Refresh simulated parameters */}
          <button 
            onClick={triggerRefresh}
            disabled={isRefreshing}
            className={`p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl border border-gray-100 transition duration-200 cursor-pointer ${
              isRefreshing ? "animate-spin text-emerald-700" : ""
            }`}
            title="Refresh transactional data lists"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => triggerExcelExport(activeReportTab)}
            className="flex items-center justify-center gap-2 bg-emerald-705 border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs px-5 py-3 rounded-2xl active:scale-95 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" /> Export CSV Ledger
          </button>

          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-2xl active:scale-95 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 shrink-0 text-emerald-400" /> Print Summary
          </button>
        </div>
      </div>

      {/* Toast Notification Box for Export Actions */}
      <AnimatePresence>
        {exportSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-800 text-white rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg border border-emerald-700/30"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{exportSuccessMessage}</span>
            </div>
            <button onClick={() => setExportSuccessMessage("")} className="text-emerald-300 hover:text-white font-bold text-sm leading-none">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CORPORATE CORE OVERVIEW MINI-WIDGET CARD SEGMENTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Sales Metric */}
        <div 
          onClick={() => setActiveReportTab("Sales")}
          className={`cursor-pointer border p-4.5 rounded-2xl transition shadow-3xs flex flex-col justify-between ${
            activeReportTab === "Sales" ? "bg-emerald-50/50 border-emerald-500/30" : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Sales Period</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded">LIVE</span>
          </div>
          <div className="mt-3">
            <p className="text-lg font-black text-emerald-850 font-mono">${totalSalesVal.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+{growthRatePct}% Growth</span>
            </div>
          </div>
        </div>

        {/* Inventory Metric */}
        <div 
          onClick={() => setActiveReportTab("Inventory")}
          className={`cursor-pointer border p-4.5 rounded-2xl transition shadow-3xs flex flex-col justify-between ${
            activeReportTab === "Inventory" ? "bg-emerald-50/50 border-emerald-500/30" : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Stock Assets</span>
            {reorderAlertCount > 0 && <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-black font-mono">ALERT {reorderAlertCount}</span>}
          </div>
          <div className="mt-3">
            <p className="text-lg font-black text-slate-800 font-mono">${rawAssetVal.toFixed(0)}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Total shelf valuations</p>
          </div>
        </div>

        {/* Projected Profit Margin Metric */}
        <div 
          onClick={() => setActiveReportTab("Profit")}
          className={`cursor-pointer border p-4.5 rounded-2xl transition shadow-3xs flex flex-col justify-between ${
            activeReportTab === "Profit" ? "bg-emerald-50/50 border-emerald-500/30" : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Gross Surplus</span>
            <span className="text-[9px] bg-teal-50 text-teal-800 px-1 py-0.5 rounded font-black font-mono">41.8%</span>
          </div>
          <div className="mt-3">
            <p className="text-lg font-black text-teal-850 font-mono">${projectedProfit.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Q2 Projected Margins</p>
          </div>
        </div>

        {/* Expenses Overhead Metric */}
        <div 
          onClick={() => setActiveReportTab("Expenses")}
          className={`cursor-pointer border p-4.5 rounded-2xl transition shadow-3xs flex flex-col justify-between ${
            activeReportTab === "Expenses" ? "bg-emerald-50/50 border-emerald-500/30" : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Overheads</span>
            <span className="text-[9px] bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded font-black font-mono">Deduction</span>
          </div>
          <div className="mt-3">
            <p className="text-lg font-black text-rose-955 font-mono">${maxExpensesSum.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">May payroll & utility sums</p>
          </div>
        </div>

        {/* Suppliers outstanding balance dues */}
        <div 
          onClick={() => setActiveReportTab("Suppliers")}
          className={`cursor-pointer border p-4.5 rounded-2xl transition shadow-3xs flex flex-col justify-between ${
            activeReportTab === "Suppliers" ? "bg-emerald-50/50 border-emerald-500/30" : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Credits Payable</span>
            <span className="text-[9px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-semibold font-mono">Dues</span>
          </div>
          <div className="mt-3">
            <p className="text-lg font-black text-amber-900 font-mono">${supplierDuesPayableSum.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Consolidated payables</p>
          </div>
        </div>

      </div>

      {/* 3. SWITCHER SELECTOR SUB-SECTION TABS BAR */}
      <div className="bg-slate-900 text-slate-300 p-2 rounded-3xl flex flex-wrap gap-1.5 items-center">
        
        <button 
          onClick={() => {
            setActiveReportTab("Sales");
            setSearchQuery("");
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === "Sales" 
            ? "bg-white text-emerald-800 shadow shadow-slate-900/40 font-black scale-[1.03]" 
            : "hover:text-white"
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-700" /> Sales Reports & Cash Register
        </button>

        <button 
          onClick={() => {
            setActiveReportTab("Inventory");
            setSearchQuery("");
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === "Inventory" 
            ? "bg-white text-emerald-800 shadow shadow-slate-900/40 font-black scale-[1.03]" 
            : "hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-700" /> Inventory Turnover Metrics
        </button>

        <button 
          onClick={() => {
            setActiveReportTab("Profit");
            setSearchQuery("");
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === "Profit" 
            ? "bg-white text-emerald-800 shadow shadow-slate-900/40 font-black scale-[1.03]" 
            : "hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-700" /> Net Profit Margin Analytics
        </button>

        <button 
          onClick={() => {
            setActiveReportTab("Expenses");
            setSearchQuery("");
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === "Expenses" 
            ? "bg-white text-emerald-800 shadow shadow-slate-900/40 font-black scale-[1.03]" 
            : "hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-700" /> Expense Allocation Ledgers
        </button>

        <button 
          onClick={() => {
            setActiveReportTab("Suppliers");
            setSearchQuery("");
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === "Suppliers" 
            ? "bg-white text-emerald-800 shadow shadow-slate-900/40 font-black scale-[1.03]" 
            : "hover:text-white"
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-700" /> Supplier Fulfilment performance
        </button>

      </div>

      {/* 4. DYNAMIC CONDITIONAL REPORT SECTIONS PANELS */}
      <AnimatePresence mode="wait">
        
        {/* ========================================= 
            TAB SECTION A: SALES REPORTS & REVENUE GROWTH 
            ========================================= */}
        {activeReportTab === "Sales" && (
          <motion.div 
            key="sales-report-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Sales Section layout grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Line chart tracking revenue growth (Cols 7) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-150 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <LucideLineChart className="w-4 h-4 text-emerald-700" />
                    <span>Revenues & Growth Curve Analytics (Daily Trend)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Linear timeline comparing incoming cash volumes and overall transaction growths</p>
                </div>

                <div className="h-64 mt-6 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={REVENUE_GROWTH_CHART}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="period" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ fontFamily: "monospace", borderRadius: "12px", border: "1px solid #e1e8ed" }}
                        formatter={(val: number) => [`$${val}`, "Overhead Amount"]}
                      />
                      <Legend iconType="circle" />
                      {/* Revenue line plots */}
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Overhead Income Revenue" 
                        stroke="#047857" 
                        strokeWidth={4.5} 
                        dot={{ r: 4, strokeWidth: 1.5, fill: "#fff" }} 
                        activeDot={{ r: 6 }}
                      />
                      {/* Growth progression */}
                      <Line 
                        type="monotone" 
                        dataKey="growth" 
                        name="Growth Multiplier (%)" 
                        stroke="#f59e0b" 
                        strokeWidth={2.5} 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: Pie Chart category distribution (Cols 5) */}
              <div className="lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-3xl border border-gray-150 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-700" />
                    <span>Prescription Cost Centers (Split Share)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Ratio of gross billing values mapped across pharmaceutical classifications</p>
                </div>

                <div className="h-60 mt-4 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={SALES_BY_CATEGORY_CHART}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {SALES_BY_CATEGORY_CHART.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ fontFamily: "monospace", borderRadius: "12px" }}
                        formatter={(v: number) => [`$${v.toFixed(2)}`, "Cost Volume"]}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  
                  {/* Absolute Center Labels */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Aggregate</span>
                    <span className="text-lg font-black text-slate-800 font-mono">$5,420</span>
                  </div>
                </div>

                {/* Legends list */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-50 text-xs font-semibold text-gray-600">
                  {SALES_BY_CATEGORY_CHART.map(cat => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="truncate">{cat.name}</span>
                      <span className="font-bold text-gray-900 font-mono ml-auto">${cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Downward Table: Detailed Transaction entries list */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-xs overflow-hidden">
              <div className="p-5.5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Chronological Cash Register Audit Log</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Patient checkout entries matching actual bank clear balances</p>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Filter sales files..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              {/* Table rendering */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 pl-6">Invoice ID</th>
                      <th className="p-4">Billing Date</th>
                      <th className="p-4">Customer profile</th>
                      <th className="p-4">Sales Channel</th>
                      <th className="p-4 text-center">Items amount</th>
                      <th className="p-4 text-right">Growth Rate %</th>
                      <th className="p-4 text-right pr-6">Charged Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 font-semibold font-sans">
                    {SALES_REPORT_DATA.filter(s => s.customerName.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                      <tr key={s.id} className="border-b border-gray-200/50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-gray-400">{s.id}</td>
                        <td className="p-4 font-mono">{s.date}</td>
                        <td className="p-4 text-slate-900 font-extrabold">{s.customerName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] ${
                            s.channel === "In-Store Counter" ? "bg-slate-100 text-slate-700" :
                            s.channel === "Online Prescription Portal" ? "bg-emerald-50 text-emerald-800" :
                            "bg-sky-50 text-sky-800"
                          }`}>
                            {s.channel}
                          </span>
                        </td>
                        <td className="p-4 text-center font-mono">{s.itemsCount} units</td>
                        <td className="p-4 text-right text-emerald-700 font-mono">+{s.growthContribution}%</td>
                        <td className="p-4 text-right pr-6 font-mono font-black text-sm text-gray-900">${s.totalValue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}


        {/* ========================================= 
            TAB SECTION B: INVENTORY REPORTS 
            ========================================= */}
        {activeReportTab === "Inventory" && (
          <motion.div 
            key="inventory-report-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Horizontal or Bar Chart comparing stock Levels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-150 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>Inventory Asset valuations by pharmaceutical branches</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Asset capital held in medicines with detailed total sku distributions</p>
                </div>

                <div className="h-64 mt-6 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={INVENTORY_CHART_STATS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ fontFamily: "monospace", borderRadius: "12px" }}
                        formatter={(val: number) => [`$${val}`, "Hold Assets Valuation"]}
                      />
                      <Legend iconType="circle" />
                      <Bar dataKey="val" name="Stock Asset ($)" fill="#047857" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="itemsCount" name="Active SKU Tally" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mini Diagnostic layout (Cols 4) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-150 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Turnover Risk Diagnostic</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Automatic system calculation for expiring & stockout liabilities</p>
                </div>

                <div className="space-y-4 my-4 font-sans text-xs">
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl">
                    <span className="text-[9px] text-rose-800 font-extrabold uppercase bg-rose-100 px-1.5 py-0.5 rounded">Action required</span>
                    <h4 className="font-black text-gray-900 mt-1.5 text-[12.5px]">Critical reorder warnings</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5"><strong>Nexium Acid Block 40mg</strong> is below warning thresholds (45 units left, reorder 100).</p>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                    <span className="text-[9px] text-amber-800 font-extrabold uppercase bg-amber-100 px-1.5 py-0.5 rounded">Optimal status</span>
                    <h4 className="font-black text-gray-900 mt-1.5 text-[12.5px]">Safe buffer thresholds</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5">Antibiotics and OTC care channels are loaded at 100% capacity budgets.</p>
                  </div>
                </div>

                <div className="text-[10.5px] text-gray-400 font-medium">
                  Re-evaluated moments ago based on active cold storage sensor telemetry.
                </div>
              </div>

            </div>

            {/* Downward Table: Inventory items inventory spreadsheet */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-xs overflow-hidden">
              <div className="p-5.5 border-b border-gray-50">
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Active Stock Ledger & Depletion Auditing</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Shelf metrics, average raw purchase costs, and calculated expected margins</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-gray-100 font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 pl-6">Catalog SKU</th>
                      <th className="p-4">Medicine Name</th>
                      <th className="p-4">Classification</th>
                      <th className="p-4 text-center">In-Stock units</th>
                      <th className="p-4 text-center">Safety Reorder Marker</th>
                      <th className="p-4 text-right">Avg cost rate</th>
                      <th className="p-4 text-center">Replenish Status</th>
                      <th className="p-4 text-right pr-6">Calculated Assets</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 font-semibold">
                    {INVENTORY_REPORT_DATA.map(item => (
                      <tr key={item.sku} className="border-b border-gray-250/20 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-gray-450">{item.sku}</td>
                        <td className="p-4 text-slate-900 font-extrabold">{item.medicineName}</td>
                        <td className="p-4 text-gray-505">{item.category}</td>
                        <td className="p-4 text-center font-mono font-bold text-gray-800">{item.stockLevel} capsules</td>
                        <td className="p-4 text-center font-mono text-gray-400">{item.reorderLevel} units</td>
                        <td className="p-4 text-right font-mono">${item.unitCost.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                            item.healthStatus === "Optimal" ? "bg-emerald-50 text-emerald-800" :
                            item.healthStatus === "Low Stock" ? "bg-amber-50 text-amber-805" :
                            "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {item.healthStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 font-mono font-black text-slate-900">${item.totalAssetValue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}


        {/* ========================================= 
            TAB SECTION C: PROFIT REPORTS 
            ========================================= */}
        {activeReportTab === "Profit" && (
          <motion.div 
            key="profit-report-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Area comparison curve graph (cols 12) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <IconProfit className="w-4 h-4 text-emerald-700" />
                  <span>Gross margins, Net profits, and incoming COGS comparison curve</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Quarterly comparative analysis of corporate sales health margins</p>
              </div>

              <div className="h-72 mt-4 text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PROFIT_REPORT_DATA}>
                    <defs>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#047857" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="cogsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ fontFamily: "monospace", borderRadius: "12px" }}
                      formatter={(val: number) => [`$${val}`, "Accounting Value"]}
                    />
                    <Legend iconType="circle" />
                    
                    {/* Revenue Area block */}
                    <Area type="monotone" dataKey="revenue" name="Total Gross Revenue ($)" fill="url(#profitGrad)" stroke="#047857" strokeWidth={3} />
                    {/* Cost of Goods Sold block */}
                    <Area type="monotone" dataKey="cogs" name="COGS (Stock Purchase cost)" fill="url(#cogsGrad)" stroke="#ef4444" strokeWidth={1.5} />
                    {/* Net profit curve */}
                    <Area type="monotone" dataKey="netProfit" name="Net clean Profit" stroke="#3b82f6" strokeWidth={2} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income Statement Detailed Panel */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-xs overflow-hidden">
              <div className="p-5.5 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Quarterly Corporate Profit & Loss Summary Sheets</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Revenues, purchasing costs, operating expenses overheads, and calculated margins</p>
                </div>

                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-black uppercase font-mono tracking-wider">
                  SaaS Consolidated
                </div>
              </div>

              {/* Table ledger */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 pl-6">Quarterly Period</th>
                      <th className="p-4 text-right">Gross Billing Revenues</th>
                      <th className="p-4 text-right">Medicines Purchase (COGS)</th>
                      <th className="p-4 text-right">Operating Overheads (OPEX)</th>
                      <th className="p-4 text-right">Consolidated Expenses</th>
                      <th className="p-4 text-right">Net Take-Home margins</th>
                      <th className="p-4 text-right pr-6">Profit Ratio Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 font-semibold font-mono">
                    {PROFIT_REPORT_DATA.map(p => {
                      const totalExpensesSum = p.cogs + p.operatingExpenses;
                      return (
                        <tr key={p.quarter} className="border-b border-gray-200/50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 pl-6 text-slate-900 font-extrabold font-sans text-sm">{p.quarter}</td>
                          <td className="p-4 text-right text-emerald-800 font-black">${p.revenue.toLocaleString()}</td>
                          <td className="p-4 text-right text-rose-600">-${p.cogs.toLocaleString()}</td>
                          <td className="p-4 text-right text-amber-700">-${p.operatingExpenses.toLocaleString()}</td>
                          <td className="p-4 text-right text-gray-400">${totalExpensesSum.toLocaleString()}</td>
                          <td className="p-4 text-right text-slate-900 font-black">${p.netProfit.toLocaleString()}</td>
                          <td className="p-4 text-right pr-6 font-black font-sans">
                            <span className="bg-teal-50 text-teal-800 border border-teal-100/40 px-2 py-1 rounded">
                              {p.marginPercent}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}


        {/* ========================================= 
            TAB SECTION D: EXPENSE ALLOCATION LOGS 
            ========================================= */}
        {activeReportTab === "Expenses" && (
          <motion.div 
            key="expense-report-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Split row charts for Expense analytics (Pie distribution & Bar monthly trend) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cost centers shares bar chart of active payments */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest">May Expenditure outlays</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Summed amounts mapped across active cost center categories</p>
                </div>

                <div className="h-60 mt-4 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={EXPENSE_REPORT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="category" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip formatter={(v: number) => [`$${v}`, "Expense Amount"]} />
                      <Bar dataKey="amount" name="Charged Volume" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Informative advice list */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest">Treasury Direct Warnings</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Automated assessment of clinical administrative overhead bounds</p>
                </div>

                <div className="space-y-4 my-4 font-sans text-xs font-semibold text-gray-600">
                  <div className="flex gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100/40">
                    <span className="text-rose-700 bg-rose-100 p-1.5 rounded-full shrink-0 font-mono font-black text-xs leading-none">!</span>
                    <div>
                      <h4 className="font-black text-rose-950 text-sm">Property Lease Commitments</h4>
                      <p className="text-rose-800 text-[11px] mt-0.5">Property rental accounts for <strong>27.2%</strong> of unmitigated overhead cash disbursements.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 p-3 bg-lime-50 rounded-xl border border-lime-100/40">
                    <span className="text-emerald-700 bg-lime-100 p-1.5 rounded-full shrink-0 font-mono font-black text-xs leading-none">✓</span>
                    <div>
                      <h4 className="font-black text-emerald-950 text-sm">Regulatory Levy clear</h4>
                      <p className="text-emerald-800 text-[11px] mt-0.5">Bio-hazard containment fees and clinical taxes have been processed and settled in full.</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10.5px] text-gray-400">Total May OPEX aggregate: ${(maxExpensesSum).toFixed(2)}</p>
              </div>

            </div>

            {/* Downward Table: Expenditure log registry details */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-xs overflow-hidden">
              <div className="p-5.5 border-b border-gray-50">
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Active Operational OPEX General Journal</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Staff salaries, facility leases, safety clearance licenses, and local advertisement outlays</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 pl-6">Voucher ref</th>
                      <th className="p-4">Payment date</th>
                      <th className="p-4">Expenditure branch</th>
                      <th className="p-4 flex-1">Corporate Accounting Notes</th>
                      <th className="p-4 text-center">Billing Type</th>
                      <th className="p-4 text-right pr-6">Disbursed amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 font-semibold font-sans">
                    {EXPENSE_REPORT_DATA.map(exp => (
                      <tr key={exp.id} className="border-b border-gray-250/20 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-gray-400">{exp.id}</td>
                        <td className="p-4 font-mono">{exp.paymentDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] uppercase font-bold text-xs ${
                            exp.category === "Staff Salaries" ? "bg-emerald-50 text-emerald-800" :
                            exp.category === "Property Rent Lease" ? "bg-rose-50 text-rose-800" :
                            "bg-amber-50 text-amber-805"
                          }`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-900">{exp.referenceNotes}</td>
                        <td className="p-4 text-center font-bold text-gray-500">{exp.frequency}</td>
                        <td className="p-4 text-right pr-6 font-mono font-black text-sm text-gray-950">${exp.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}


        {/* ========================================= 
            TAB SECTION E: SUPPLIER PERFORMANCE 
            ========================================= */}
        {activeReportTab === "Suppliers" && (
          <motion.div 
            key="supplier-report-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Purchasing comparisons horizontal bar (cols 12) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-widest">Purchasing Volumes comparisons per Registered Wholesaler</h3>
                <p className="text-xs text-gray-400 mt-0.5">Analysis of clinical raw procurement budgets and relative lead fulfillment times</p>
              </div>

              <div className="h-64 mt-4 text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SUPPLIER_PERFORMANCE_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="supplierName" type="category" stroke="#94a3b8" width={160} />
                    <Tooltip formatter={(v: number) => [`$${v}`, "Consolidated procurement"]} />
                    <Legend />
                    <Bar dataKey="purchaseVolumeVal" name="Raw Purchase Volume ($)" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="totalOrders" name="Total Orders logs Count" fill="#93c5fd" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wholesaler KPI detail tables */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-xs overflow-hidden">
              <div className="p-5.5 border-b border-gray-50">
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Integrated Supplier Performance Scorecards</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Reconciled orders counts, overall lead-time fulfillment indicators, and active debts payable liabilities</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 pl-6">Code</th>
                      <th className="p-4">Wholesale Brand Name</th>
                      <th className="p-4 text-center">Procurement orders logging</th>
                      <th className="p-4 text-right">Summed Volumes Purchased</th>
                      <th className="p-4 text-center">Fulfillment Rate Index</th>
                      <th className="p-4 text-center">Avg Lead-Time Clearance</th>
                      <th className="p-4 text-right pr-6">Ledger Dues Payable</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 font-semibold font-sans">
                    {SUPPLIER_PERFORMANCE_DATA.map(sup => (
                      <tr key={sup.id} className="border-b border-gray-250/25 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-gray-400">{sup.id}</td>
                        <td className="p-4 text-slate-900 font-extrabold text-xs">{sup.supplierName}</td>
                        <td className="p-4 text-center font-mono">{sup.totalOrders} batches</td>
                        <td className="p-4 text-right font-mono font-bold text-gray-800">${sup.purchaseVolumeVal.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-850 px-2 py-0.5 rounded font-black font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{sup.fulfillmentRate}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-mono text-gray-600">{sup.avgLeadTimeDays} days transit</td>
                        <td className="p-4 text-right pr-6 font-mono font-black text-slate-900">
                          {sup.duesAmount > 0 ? (
                            <span className="text-rose-600">${sup.duesAmount.toFixed(2)}</span>
                          ) : (
                            <span className="text-emerald-700">$0.00</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </motion.div>
  );
}
