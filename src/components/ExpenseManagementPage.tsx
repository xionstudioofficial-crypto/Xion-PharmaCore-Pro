import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "@/src/hooks/useCurrency";
import { 
  Plus, Search, Calendar, DollarSign, UploadCloud, FileText, 
  TrendingUp, Activity, Briefcase, Lightbulb, Home, Trash2, 
  CheckCircle2, AlertCircle, Eye, RefreshCw, BarChart3, Filter, 
  ArrowUpDown, X, Sparkles, Layers, Landmark, Download
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";

interface Expense {
  id: string;
  category: "Salaries" | "Utilities" | "Rent" | "Marketing" | "Operations" | "Taxes" | "Others";
  amount: number;
  date: string;
  notes: string;
  receiptName?: string;
  receiptSize?: string;
  receiptPreview?: string;
}

const COLORS = ["#047857", "#0284c7", "#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#64748b"];

export function ExpenseManagementPage() {
  const { formatCurrency, symbol } = useCurrency();
  // Initial pre-populated expenses database for pharmacy operations
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "EXP-2026-101",
      category: "Salaries",
      amount: 4800.00,
      date: "2026-05-01",
      notes: "Monthly staff payroll - Pharmacists and administrative support",
      receiptName: "payroll_summary_may2026.pdf",
      receiptSize: "310 KB"
    },
    {
      id: "EXP-2026-102",
      category: "Rent",
      amount: 2200.00,
      date: "2026-05-01",
      notes: "Commercial property lease - Main clinic plaza branch",
      receiptName: "lease_payment_receipt.pdf",
      receiptSize: "185 KB"
    },
    {
      id: "EXP-2026-103",
      category: "Utilities",
      amount: 450.00,
      date: "2026-05-08",
      notes: "Energy & Water supply bills - cold storage cooling systems",
      receiptName: "city_utility_bill_may2026.pdf",
      receiptSize: "92 KB"
    },
    {
      id: "EXP-2026-104",
      category: "Utilities",
      amount: 120.00,
      date: "2026-05-10",
      notes: "SaaS Broadband internet and VoIP lines installment",
      receiptName: "telecom_invoice_may.pdf",
      receiptSize: "45 KB"
    },
    {
      id: "EXP-2026-105",
      category: "Marketing",
      amount: 650.00,
      date: "2026-05-12",
      notes: "Local medical awareness flyers and digital catalog advertisements",
      receiptName: "marketing_agency_invoice_66.png",
      receiptSize: "1.2 MB"
    },
    {
      id: "EXP-2026-106",
      category: "Operations",
      amount: 320.00,
      date: "2026-05-15",
      notes: "Safe hazard containment bins & biohazard disposal clearance fees",
      receiptName: "biohazard_clearance_cert.pdf",
      receiptSize: "215 KB"
    },
    {
      id: "EXP-2026-107",
      category: "Taxes",
      amount: 1100.00,
      date: "2026-05-15",
      notes: "Quarterly local healthcare professional workspace levies",
      receiptName: "quarterly_levy_form.pdf",
      receiptSize: "510 KB"
    },
    {
      id: "EXP-2026-108",
      category: "Others",
      amount: 150.00,
      date: "2026-05-18",
      notes: "Staff hydration and cooling refreshments for clinical lunchrooms"
    }
  ]);

  // View States
  const [activeTab, setActiveTab] = useState<"list" | "analytics">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Create Form modal control
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Fields State
  const [category, setCategory] = useState<Expense["category"]>("Utilities");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  // Receipt upload simulator states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedReceipt, setUploadedReceipt] = useState<{name: string, size: string, preview?: string} | null>(null);

  // Selected expense detail view receipt modal
  const [selectedReceipt, setSelectedReceipt] = useState<{name: string; size: string; category: string} | null>(null);

  // KPI calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const salariesTotal = expenses
    .filter(e => e.category === "Salaries")
    .reduce((sum, e) => sum + e.amount, 0);

  const utilitiesTotal = expenses
    .filter(e => e.category === "Utilities")
    .reduce((sum, e) => sum + e.amount, 0);

  const rentTotal = expenses
    .filter(e => e.category === "Rent")
    .reduce((sum, e) => sum + e.amount, 0);

  const othersTotal = expenses
    .filter(e => !["Salaries", "Utilities", "Rent"].includes(e.category))
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate percentage ratios
  const salariesPercent = totalExpenses > 0 ? (salariesTotal / totalExpenses) * 100 : 0;
  const utilitiesPercent = totalExpenses > 0 ? (utilitiesTotal / totalExpenses) * 100 : 0;
  const rentPercent = totalExpenses > 0 ? (rentTotal / totalExpenses) * 100 : 0;
  const othersPercent = totalExpenses > 0 ? (othersTotal / totalExpenses) * 100 : 0;

  // Pie Chart Data Prep
  const pieData = [
    { name: "Salaries", value: salariesTotal },
    { name: "Utilities", value: utilitiesTotal },
    { name: "Rent", value: rentTotal },
    { name: "Others / Misc", value: othersTotal }
  ].filter(item => item.value > 0);

  // Bar Chart / Monthly Breakdown Data mock-up mapping
  // Let's bundle items to show chronological distribution
  const chartData = [
    { name: "May 01-05", Salaries: 4800, Rent: 2200, Utilities: 0, Others: 0 },
    { name: "May 06-10", Salaries: 0, Rent: 0, Utilities: 570, Others: 0 },
    { name: "May 11-15", Salaries: 0, Rent: 0, Utilities: 0, Others: 2070 }, // accumulated Marketing + biohazard + taxes
    { name: "May 16-20", Salaries: 0, Rent: 0, Utilities: 0, Others: 150 }
  ];

  // Drag simulation upload events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processMockReceipt(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processMockReceipt(file);
    }
  };

  const processMockReceipt = (file: File) => {
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setUploadedReceipt({
      name: file.name,
      size: formattedSize
    });
  };

  // Add standard new expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(amount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    const generatedId = `EXP-2026-${Math.floor(Math.random() * 900) + 100}`;

    const newExpense: Expense = {
      id: generatedId,
      category,
      amount: parsedAmt,
      date,
      notes: notes.trim() || `Operational billing for ${category}`,
      receiptName: uploadedReceipt?.name,
      receiptSize: uploadedReceipt?.size
    };

    setExpenses([newExpense, ...expenses]);
    setIsAddModalOpen(false);

    // Reset Form Fields
    setCategory("Utilities");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setUploadedReceipt(null);
  };

  // Switch column sorting
  const toggleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Delete transaction handler
  const handleDeleteExpense = (id: string, notes: string) => {
    if (confirm(`Void expense transaction: "${notes}"?`)) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  // Search matches & category filter
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.notes.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort matched entries
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let comp = 0;
    if (sortField === "date") {
      comp = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      comp = a.amount - b.amount;
    }
    return sortDirection === "asc" ? comp : -comp;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      
      {/* 1. Header Hero Actions panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-700" />
            <span>Operational Expenses Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Audit pharmacy overhead liabilities, archive digital payment receipts, and evaluate interactive category statistics panels.</p>
        </div>

        <div className="flex items-center gap-3.5 self-stretch md:self-auto">
          {/* View Toggler */}
          <div className="flex bg-gray-150 p-1 rounded-xl text-xs font-bold font-sans">
            <button 
              onClick={() => setActiveTab("list")}
              className={`px-4.5 py-2.5 rounded-lg transition-all ${
                activeTab === "list" 
                ? "bg-white text-emerald-800 shadow-xs" 
                : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Document Registry
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`px-4.5 py-2.5 rounded-lg transition-all ${
                activeTab === "analytics" 
                ? "bg-white text-emerald-800 shadow-xs" 
                : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Analytics Graph
            </button>
          </div>

          <button 
            onClick={() => {
              setUploadedReceipt(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl transition active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Log Expense
          </button>
        </div>
      </div>

      {/* 2. DASHBOARD KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Monthly Expenses KPI Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 text-slate-700 rounded-2xl border border-slate-100/50">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 font-mono">MAY 2026</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Expenses</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalExpenses)}</h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Includes lease, salaries & general tax</span>
            </div>
          </div>
        </div>

        {/* Salaries (Payroll) KPI Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100/40">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-2 py-0.5 rounded-md font-mono">{salariesPercent.toFixed(1)}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Salary Payroll</p>
            <h3 className="text-2xl font-black text-emerald-850 mt-1">{formatCurrency(salariesTotal)}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full payout completed</span>
            </div>
          </div>
        </div>

        {/* Utilities KPI Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100/40">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-805 font-black px-2 py-0.5 rounded-md font-mono">{utilitiesPercent.toFixed(1)}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Utilities Overhead</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{formatCurrency(utilitiesTotal)}</h3>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium mt-1">
              <span>Energy, cool storages & broadband</span>
            </div>
          </div>
        </div>

        {/* Corporate Rent Lease Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100/40">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-rose-50 text-rose-800 font-black px-2 py-0.5 rounded-md font-mono">{rentPercent.toFixed(1)}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Property Rent lease</p>
            <h3 className="text-2xl font-black text-rose-950 mt-1">{formatCurrency(rentTotal)}</h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
              <span>Main hub + clinical facilities</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. CONDITIONAL TAB CONTENTS: LIST TABLE OR ANALYTICS GRAPHS */}
      <AnimatePresence mode="wait">
        
        {/* TAB A: THE INTERACTIVE EXPENSE DATATABLE */}
        {activeTab === "list" && (
          <motion.div 
            key="list-tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-4"
          >
            {/* Table Filters toolbars */}
            <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search expense notes, descriptions, transaction identifiers..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none transition font-medium text-xs text-gray-700" 
                />
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 border border-transparent">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span>Category:</span>
                <select 
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-emerald-800"
                >
                  <option value="All">All Categories</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Taxes">Taxes</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Table layout container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 pl-6">ID Code</th>
                      <th className="p-4 cursor-pointer hover:bg-gray-50 transition" onClick={() => toggleSort("date")}>
                        <div className="flex items-center gap-1.5">
                          <span>Expense Date</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="p-4">Expense Type (Category)</th>
                      <th className="p-4 flex-1">Detailed Description Notes</th>
                      <th className="p-4 text-center">Receipt File</th>
                      <th className="p-4 text-right cursor-pointer hover:bg-gray-50 transition pr-6" onClick={() => toggleSort("amount")}>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span>Amount Paid</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="p-4 text-center">Void Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 font-semibold font-sans">
                    {sortedExpenses.map(exp => (
                      <tr 
                        key={exp.id} 
                        className="border-b border-gray-200/50 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* ID Code */}
                        <td className="p-4 pl-6 font-mono font-bold text-gray-400">{exp.id}</td>
                        
                        {/* Expense Date */}
                        <td className="p-4 font-mono">{exp.date}</td>
                        
                        {/* Category badge */}
                        <td className="p-4">
                          <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-md ${
                            exp.category === "Salaries" ? "bg-emerald-50 text-emerald-800" :
                            exp.category === "Rent" ? "bg-rose-50 text-rose-800" :
                            exp.category === "Utilities" ? "bg-amber-50 text-amber-800" :
                            exp.category === "Marketing" ? "bg-sky-50 text-sky-800" :
                            exp.category === "Taxes" ? "bg-purple-50 text-purple-800" :
                            "bg-slate-100 text-slate-800"
                          }`}>
                            {exp.category}
                          </span>
                        </td>

                        {/* Notes */}
                        <td className="p-4 text-xs font-semibold text-slate-800 break-words max-w-sm">
                          {exp.notes}
                        </td>

                        {/* Receipt indicator */}
                        <td className="p-4 text-center">
                          {exp.receiptName ? (
                            <button 
                              onClick={() => setSelectedReceipt({
                                name: exp.receiptName!,
                                size: exp.receiptSize || "N/A",
                                category: exp.category
                              })}
                              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono text-[10px] px-2 py-1 rounded-md border border-emerald-100/50 transition shrink-0"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="truncate max-w-[100px]">{exp.receiptName}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-300">None attached</span>
                          )}
                        </td>

                        {/* Amount Due */}
                        <td className="p-4 text-right pr-6 font-mono font-black text-gray-900 text-sm">
                          {formatCurrency(exp.amount)}
                        </td>

                        {/* Action buttons */}
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDeleteExpense(exp.id, exp.notes)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 rounded transition-colors"
                            title="Void Transaction invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {sortedExpenses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-400 font-bold font-sans">
                          No matching expense transactions found inside archives.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB B: INTERACTIVE RECHARTS ANALYTICS GRAPHS */}
        {activeTab === "analytics" && (
          <motion.div 
            key="analytics-tab"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left: Pie/Donut Distribution (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-gray-500 uppercase tracking-wider">Breakdown by Cost Centers</h4>
                <p className="text-xs text-gray-400 mt-0.5">Ratio and total allocation per major operational category</p>
              </div>

              {/* Piechart frame */}
              <div className="h-64 mt-4 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [`$${val.toFixed(2)}`, "Total Amount"]}
                      contentStyle={{ fontFamily: "monospace", borderRadius: "12px", border: "1px solid #e5e7eb" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center absolute indicator */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cumulated</span>
                  <span className="text-xl font-black text-slate-800 font-mono">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>

              {/* custom list of legends with direct math metrics */}
              <div className="grid grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-gray-50 font-sans text-xs font-semibold text-gray-600">
                {pieData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                    />
                    <span className="truncate">{entry.name}:</span>
                    <span className="font-bold text-gray-900 font-mono ml-auto">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chronological Trend charts (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-extrabold text-sm text-gray-500 uppercase tracking-wider">Overhead Outlays Chronological Trend</h4>
                <p className="text-xs text-gray-400 mt-0.5">Periodic accumulated operational bills stacked comparison</p>
              </div>

              <div className="h-64 mt-4 font-mono text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} strokeLinecap="round" />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ fontFamily: "monospace", borderRadius: "12px" }}
                      formatter={(val: number) => [`$${val}`, "Amount"]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Bar dataKey="Salaries" stackId="a" fill="#047857" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Rent" stackId="a" fill="#ec4899" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Utilities" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Others" stackId="a" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Extra advisory diagnostic notification */}
              <div className="p-4 bg-lime-50 rounded-2xl border border-lime-100/40 text-xs text-lime-805 font-medium flex gap-2 w-full mt-2 font-sans">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p><strong>Treasury Alert:</strong> Salaries payroll accounts for the absolute maximum volume of operational liability ({salariesPercent.toFixed(1)}%). Utilities cooling storage remains steady in normal baseline parameters.</p>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* 4. MODAL DRAWER POPUP: CREATING NEW EXPENSE TRANSACTION */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-md w-full relative z-10"
            >
              <form onSubmit={handleAddExpense} className="space-y-4">
                
                {/* Title */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-black text-gray-800">Log Overhead Expense Invoice</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Register staff salaries, rental leases, general utility liabilities, or biohazard clearances.</p>
                  </div>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 text-xl leading-none">&times;</button>
                </div>

                {/* Form fields */}
                <div className="space-y-3.5 font-sans">
                  
                  {/* Category select dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Expense Category *</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full text-xs p-3 border border-gray-250 bg-white rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer font-bold"
                    >
                      <option value="Salaries">Staff Salaries & Payroll</option>
                      <option value="Utilities">Energy & Utility Bills</option>
                      <option value="Rent">Commercial Property Rent</option>
                      <option value="Marketing">Marketing & Advertisements</option>
                      <option value="Operations">Hazardous & Ops Clearance</option>
                      <option value="Taxes">Professional workspace taxes</option>
                      <option value="Others">Others / Miscellaneous</option>
                    </select>
                  </div>

                  {/* amount of billing */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Expense Amount Paid ({symbol}) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input 
                        type="number" 
                        required
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-xs bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                      />
                    </div>
                  </div>

                  {/* Date of checkout */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Billing Invoice Date *</label>
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full text-xs p-3 border border-gray-250 rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 font-bold"
                    />
                  </div>

                  {/* Comments / notes text fields */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Description / Accounting Notes</label>
                    <textarea 
                      placeholder="e.g. Cleared via bank payment wire - confirmation receipt #88019"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full text-xs p-3 border border-gray-250 rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 min-h-[50px]"
                    />
                  </div>

                  {/* upload receipt section! */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Archive Receipt Document Attachment</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-5 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragActive 
                        ? "border-emerald-700 bg-emerald-50/10" 
                        : "border-gray-200 hover:border-emerald-500/50 hover:bg-gray-50/20"
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept="application/pdf,image/*" 
                      />

                      {uploadedReceipt ? (
                        <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                          <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="font-bold truncate max-w-[150px]">{uploadedReceipt.name} ({uploadedReceipt.size})</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-705 shrink-0" />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud className="w-5 h-5 text-gray-400 mx-auto" />
                          <p className="text-[11px] font-bold text-gray-700">Click to attach file or drag here</p>
                          <p className="text-[9px] text-gray-400">PDF, PNG, JPG (Simulated)</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Submit footer elements */}
                <div className="flex justify-end gap-2.5 pt-3.5 border-t border-gray-100 font-sans">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-xs font-bold text-gray-500 hover:bg-gray-100 py-3 px-5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-6 rounded-xl shadow-xs transition active:scale-95"
                  >
                    Save Overhead Expense
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. INDIVIDUAL RECEIPT PREVIEWER MODAL */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" 
            />

            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white p-6 rounded-3xl max-w-sm w-full relative z-10 shadow-xl border border-gray-105 flex flex-col items-center space-y-4"
            >
              {/* Document icon layout */}
              <div className="w-full text-center border-b border-gray-100 pb-3">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-full w-fit mx-auto mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-widest">{selectedReceipt.category} RECEIPT</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Verified pharmacy overhead digital file</p>
              </div>

              {/* Digital receipt representation */}
              <div className="bg-gray-50 p-4 rounded-2xl w-full border border-gray-100 font-mono text-[10.5px] text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>FILE NAME:</span>
                  <span className="font-bold text-gray-800 truncate max-w-[160px]">{selectedReceipt.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>FILE SIZE:</span>
                  <span>{selectedReceipt.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>STATUS:</span>
                  <span className="text-emerald-800 font-bold font-sans">● SECURELY ARCHIVED</span>
                </div>
              </div>

              <div className="bg-zinc-100 border border-zinc-200 p-8 rounded-xl w-full flex flex-col items-center justify-center text-center space-y-2">
                <p className="font-extrabold text-xs text-zinc-500 font-sans uppercase tracking-widest">Document preview frame</p>
                <div className="flex items-center gap-1.5 opacity-65 font-mono text-[10px] text-zinc-650 font-bold bg-white px-3.5 py-1.5 rounded-lg border border-zinc-300 shadow-3xs cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> File Download package
                </div>
              </div>

              <div className="w-full flex gap-2 font-semibold pt-1">
                <button 
                  onClick={() => {
                    alert(`Initiated local secure download packet for ${selectedReceipt.name}...`);
                  }}
                  className="flex-grow flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl text-xs font-bold transition active:scale-95"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button 
                  onClick={() => setSelectedReceipt(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl text-xs font-bold text-center"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
