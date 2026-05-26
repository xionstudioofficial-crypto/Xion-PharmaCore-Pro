import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Phone, Mail, Award, DollarSign, Calendar, Eye, 
  Trash2, User, CheckCircle2, AlertCircle, ShoppingBag, CreditCard, 
  X, ShieldCheck, ArrowUpRight, ArrowDownLeft, ChevronRight, UserCheck
} from "lucide-react";

interface CustomerPurchase {
  id: string;
  date: string;
  items: string;
  amount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number; // Total spent dollar value
  purchaseCount: number; // Total count of order receipts
  balance: number; // Credit outstanding balance (Negative means they owe the store, positive means credit)
  loyaltyPoints: number;
  lastVisit: string;
  joinedDate: string;
  history: CustomerPurchase[];
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST-101",
    name: "Sarah Connor",
    phone: "+1 555-0199",
    email: "sconnor@skynetmail.org",
    totalPurchases: 1450.50,
    purchaseCount: 12,
    balance: -80.00, // owes $80
    loyaltyPoints: 280,
    lastVisit: "2026-05-24",
    joinedDate: "2025-01-15",
    history: [
      { id: "INV-2026-8804", date: "2026-05-24", items: "Panadol Extra, Zyrtec Allergy", amount: 45.50 },
      { id: "INV-2026-7241", date: "2026-05-10", items: "Amoxil Forte 250mg", amount: 130.00 },
      { id: "INV-2026-6110", date: "2026-04-18", items: "Lipitor Lipids 20mg", amount: 210.00 }
    ]
  },
  {
    id: "CUST-102",
    name: "Marcus Wright",
    phone: "+1 555-0120",
    email: "mwright@cyberdyne.io",
    totalPurchases: 620.00,
    purchaseCount: 6,
    balance: 0.00,
    loyaltyPoints: 150,
    lastVisit: "2026-05-20",
    joinedDate: "2025-03-10",
    history: [
      { id: "INV-2026-8140", date: "2026-05-20", items: "Ventolin Inhaler 100mcg", amount: 80.00 },
      { id: "INV-2026-6709", date: "2026-04-05", items: "Nexium Acid Block 40mg", amount: 110.00 }
    ]
  },
  {
    id: "CUST-103",
    name: "John Connor",
    phone: "+1 555-0145",
    email: "jconnor@resistance.net",
    totalPurchases: 2540.00,
    purchaseCount: 18,
    balance: -150.00, // owes $150
    loyaltyPoints: 420,
    lastVisit: "2026-05-25",
    joinedDate: "2024-11-02",
    history: [
      { id: "INV-2026-9042", date: "2026-05-25", items: "Insulin syringes, Humalog vial", amount: 320.00 },
      { id: "INV-2026-8094", date: "2026-05-02", items: "Multivitamins, Omega-3 softgels", amount: 95.00 },
      { id: "INV-2026-6992", date: "2026-03-24", items: "Ventolin Inhaler, Panadol Extra", amount: 125.00 }
    ]
  },
  {
    id: "CUST-104",
    name: "Ellen Ripley",
    phone: "+1 555-4260",
    email: "ripley@nostromo.com",
    totalPurchases: 890.00,
    purchaseCount: 8,
    balance: 15.00, // pre-paid positive credit
    loyaltyPoints: 180,
    lastVisit: "2026-05-15",
    joinedDate: "2025-08-12",
    history: [
      { id: "INV-2026-8012", date: "2026-05-15", items: "First Aid supplies, Antiseptic cream", amount: 150.00 },
      { id: "INV-2026-5201", date: "2026-03-10", items: "Antibiotic ointment, Bandages roll", amount: 45.00 }
    ]
  }
];

export function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("All");

  // Selection detail modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Creation modal states
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Customer Form Fields
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [newLoyaltyPoints, setNewLoyaltyPoints] = useState("");

  // Quick Adjustment field
  const [trialAdjustmentAmount, setTrialAdjustmentAmount] = useState("");
  const [trialAdjustmentType, setTrialAdjustmentType] = useState<"Credit" | "Payment">("Payment");

  // Quick Loyalty adjustment field
  const [trialLoyaltyDelta, setTrialLoyaltyDelta] = useState("");

  // Filter matched lists
  const filteredCustomers = customers.filter(cust => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = cust.name.toLowerCase().includes(q) || 
                          cust.phone.includes(q) || 
                          cust.email.toLowerCase().includes(q) ||
                          cust.id.toLowerCase().includes(q);
    
    const matchesBalance = balanceFilter === "All" ||
                           (balanceFilter === "Owed" && cust.balance < 0) ||
                           (balanceFilter === "Prepaid" && cust.balance > 0) ||
                           (balanceFilter === "Zero" && cust.balance === 0);

    return matchesSearch && matchesBalance;
  });

  // Calculations for KPIs
  const totalCustomersCount = customers.length;
  const totalOwedAmount = Math.abs(customers.filter(c => c.balance < 0).reduce((s, c) => s + c.balance, 0));
  const totalPrepaidAmount = customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0);
  const totalLoyaltyPointsSum = customers.reduce((s, c) => s + c.loyaltyPoints, 0);

  // Register a brand new customer
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const parsedBalance = parseFloat(newBalance) || 0;
    const parsedPoints = parseInt(newLoyaltyPoints) || 0;
    const generatedId = `CUST-${Math.floor(Math.random() * 900) + 200}`;

    const newCust: Customer = {
      id: generatedId,
      name: newName,
      phone: newPhone || "N/A",
      email: newEmail || "N/A",
      totalPurchases: 0,
      purchaseCount: 0,
      balance: parsedBalance,
      loyaltyPoints: parsedPoints,
      lastVisit: new Date().toISOString().split("T")[0],
      joinedDate: new Date().toISOString().split("T")[0],
      history: []
    };

    setCustomers([newCust, ...customers]);
    setIsAddOpen(false);

    // Reset Fields
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewBalance("");
    setNewLoyaltyPoints("");
  };

  // Adjust balance values (Receive payment OR issue credit)
  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const amt = parseFloat(trialAdjustmentAmount);
    if (isNaN(amt) || amt <= 0) return;

    const updated = customers.map(cust => {
      if (cust.id === selectedCustomer.id) {
        // Payment -> reduces negative balance towards zero
        // Credit -> issues positive balance or increases credit
        const delta = trialAdjustmentType === "Payment" ? amt : -amt;
        const nextBalance = cust.balance + delta;

        const nextHistEntry: CustomerPurchase = {
          id: `TR-${Math.floor(Math.random() * 9000) + 1000}`,
          date: new Date().toISOString().split("T")[0],
          items: trialAdjustmentType === "Payment" ? "Balance Settlement Payment" : "Store Credit Allocated",
          amount: trialAdjustmentType === "Payment" ? -amt : amt
        };

        const updatedCust: Customer = {
          ...cust,
          balance: nextBalance,
          history: [nextHistEntry, ...cust.history]
        };

        setSelectedCustomer(updatedCust);
        return updatedCust;
      }
      return cust;
    });

    setCustomers(updated);
    setTrialAdjustmentAmount("");
  };

  // Adjust loyalty points direct values
  const handleAdjustLoyalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const delta = parseInt(trialLoyaltyDelta);
    if (isNaN(delta) || delta === 0) return;

    const updated = customers.map(cust => {
      if (cust.id === selectedCustomer.id) {
        const nextPoints = Math.max(0, cust.loyaltyPoints + delta);
        const updatedCust: Customer = { ...cust, loyaltyPoints: nextPoints };
        setSelectedCustomer(updatedCust);
        return updatedCust;
      }
      return cust;
    });

    setCustomers(updated);
    setTrialLoyaltyDelta("");
  };

  // Void a customer profiles entirely
  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`Remove custom profile: "${name}" from indexed customer directories?`)) {
      setCustomers(customers.filter(c => c.id !== id));
      if (selectedCustomer?.id === id) {
        setIsDetailOpen(false);
        setSelectedCustomer(null);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      
      {/* 1. Dedicated Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700 font-bold" />
            <span>Customer Profiles & Loyalty Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Audit customer purchase logs, reconcile unpaid credit balances, issue rewards, and monitor active membership metrics.</p>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-3 rounded-2xl active:scale-95 transition shadow-xs"
        >
          <Plus className="w-4 h-4" /> Enrol New Customer
        </button>
      </div>

      {/* 2. KPIs / STATS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Enrolled Customers */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 text-slate-700 rounded-2xl border border-slate-100/30">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 font-mono">MEMBERS</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCustomersCount} Accounts</h3>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <span>● Active patient enrollment index</span>
            </p>
          </div>
        </div>

        {/* Total Outstanding Credit Dues (Negative balance values) */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-rose-50 text-rose-800 rounded-2xl border border-rose-100/40">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-black px-2 py-0.5 rounded-md font-mono">Dues</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Outstanding Accounts Receivable</p>
            <h3 className="text-2xl font-black text-rose-950 mt-1">${totalOwedAmount.toFixed(2)}</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-1">Outstanding patient credit balances</p>
          </div>
        </div>

        {/* Total Prepaid Store Credit (Positive balance values) */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100/40">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md font-mono">Prepaid</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prepaid Customer Advances</p>
            <h3 className="text-2xl font-black text-emerald-850 mt-1">${totalPrepaidAmount.toFixed(2)}</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-1">Unspent positive patient credits</p>
          </div>
        </div>

        {/* Distributed Loyalty Points */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100/40">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-800 font-black px-2 py-0.5 rounded-md font-mono">VIP</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loyalty Points Distributed</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{totalLoyaltyPointsSum} Points</h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Available for prescription discounts</p>
          </div>
        </div>

      </div>

      {/* 3. SEARCH & CONTROLS TOOLBAR */}
      <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search customers by profile name, account code, primary phone number, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none text-xs font-medium text-gray-800 transition shadow-3xs" 
          />
        </div>

        {/* Outstanding credit balance selector */}
        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 border border-transparent">
          <span>Balance Type:</span>
          <select 
            value={balanceFilter}
            onChange={e => setBalanceFilter(e.target.value)}
            className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-emerald-800"
          >
            <option value="All">All Balance Levels</option>
            <option value="Owed">Outstanding Receivable (Owe State)</option>
            <option value="Prepaid">Positive Store Credits</option>
            <option value="Zero">Zero Balanced Accounts</option>
          </select>
        </div>
      </div>

      {/* 4. MAIN CUSTOMERS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                <th className="p-4 pl-6">ID CODE</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4 text-center">Total Purchases</th>
                <th className="p-4 text-center">Loyalty Tier</th>
                <th className="p-4 text-right">Credit Balance</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 font-semibold font-sans">
              {filteredCustomers.map(cust => (
                <tr 
                  key={cust.id} 
                  className="border-b border-gray-250/20 hover:bg-slate-50/50 transition-colors"
                >
                  {/* ID */}
                  <td className="p-4 pl-6 font-mono font-bold text-gray-400">{cust.id}</td>

                  {/* Name with email */}
                  <td className="p-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900">{cust.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium font-mono lowercase mt-0.5">{cust.email}</p>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="p-4 font-mono font-bold text-gray-600">{cust.phone}</td>

                  {/* Total Purchases amount and count count */}
                  <td className="p-4 text-center">
                    <div>
                      <span className="font-extrabold text-gray-800 font-mono">${cust.totalPurchases.toFixed(2)}</span>
                      <p className="text-[10px] text-gray-400 font-medium">{cust.purchaseCount} bills</p>
                    </div>
                  </td>

                  {/* Loyalty VIP points */}
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-100/50 px-2.5 py-1 rounded-lg">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-mono font-extrabold">{cust.loyaltyPoints} pts</span>
                    </div>
                  </td>

                  {/* Balance ledger */}
                  <td className="p-4 text-right font-mono font-black text-sm">
                    {cust.balance < 0 ? (
                      <span className="text-rose-600" title="Outstanding customer dues">
                        -${Math.abs(cust.balance).toFixed(2)}
                      </span>
                    ) : cust.balance > 0 ? (
                      <span className="text-emerald-700" title="Positive store credit balance">
                        +${cust.balance.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400">$0.00</span>
                    )}
                  </td>

                  {/* Last Visit */}
                  <td className="p-4 font-mono text-gray-500">{cust.lastVisit}</td>

                  {/* Actions buttons */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setIsDetailOpen(true);
                        }}
                        className="bg-slate-900 border border-slate-900 text-slate-100 hover:bg-slate-800 text-[10.5px] font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 active:scale-95 shadow-3xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Open Profile
                      </button>

                      <button 
                        onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                        className="text-gray-300 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Void customer account profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-16 text-center text-gray-400 font-bold font-sans">
                    No registered patient customer files match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DIALOG MODAL DETAILS INSPECTOR DRAWER */}
      <AnimatePresence>
        {isDetailOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDetailOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" 
            />

            {/* Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10 space-y-6"
            >
              
              {/* Header profile cards layout */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-5">
                <div className="flex gap-3.5 items-start">
                  <div className="bg-slate-100 text-slate-800 p-4 rounded-full font-black text-lg w-fit shrink-0 font-mono">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded-md">{selectedCustomer.id}</span>
                    <h3 className="font-black text-gray-900 text-lg mt-1.5 leading-none">{selectedCustomer.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-2 font-mono flex items-center gap-1 flex-wrap">
                      <Phone className="w-3 h-3 text-emerald-700" /> {selectedCustomer.phone} | <Mail className="w-3 h-3 text-emerald-700" /> {selectedCustomer.email}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-sans font-medium">Joined date: {selectedCustomer.joinedDate}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-slate-50/50 border border-slate-100 p-3 rounded-2xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Total Enrolled Spent</p>
                  <p className="font-mono font-black text-emerald-800 text-base mt-1">${selectedCustomer.totalPurchases.toFixed(2)}</p>
                  <span className="text-[10px] text-gray-400">{selectedCustomer.purchaseCount} invoice events</span>
                </div>
              </div>

              {/* Purchase History files listed */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" /> Purchase history & Settlements timeline
                </h4>
                
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {selectedCustomer.history.map((h, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono border-b border-gray-205/10 pb-2 mt-1 font-bold text-gray-600">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-900 font-sans">{h.items}</span>
                          <span className="text-[9px] bg-gray-200 text-gray-600 px-1 py-0.5 rounded font-mono font-bold">{h.id}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-medium mt-1">Date: {h.date}</p>
                      </div>
                      <span className={`font-mono font-extrabold ${h.amount < 0 ? "text-emerald-700" : "text-gray-800"}`}>
                        {h.amount < 0 ? `Paid $${Math.abs(h.amount).toFixed(2)}` : `$${h.amount.toFixed(2)}`}
                      </span>
                    </div>
                  ))}

                  {selectedCustomer.history.length === 0 && (
                    <div className="py-6 text-center text-gray-400 font-bold">
                      No matching purchase transactions logged.
                    </div>
                  )}
                </div>
              </div>

              {/* Two side actions columns: ADJUST BALANCES (Credit controller) & VIP SYSTEM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
                
                {/* Segment columns 1: Adjust balance (Add prepaid OR log settlement payment) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">Adjust credit balance</h4>
                    <span className={`text-[11px] font-mono font-black ${selectedCustomer.balance < 0 ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}`}>
                      Bal: {selectedCustomer.balance < 0 ? `-${Math.abs(selectedCustomer.balance).toFixed(2)}` : `+${selectedCustomer.balance.toFixed(2)}`}
                    </span>
                  </div>

                  <form onSubmit={handleAdjustBalance} className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setTrialAdjustmentType("Payment")}
                        className={`text-xs py-2 rounded-xl font-bold border transition ${
                          trialAdjustmentType === "Payment" 
                          ? "bg-slate-900 border-slate-900 text-white" 
                          : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        Payment (Dues -)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTrialAdjustmentType("Credit")}
                        className={`text-xs py-2 rounded-xl font-bold border transition ${
                          trialAdjustmentType === "Credit" 
                          ? "bg-slate-900 border-slate-900 text-white" 
                          : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        Issue Credit (Bal +)
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 font-bold" />
                        <input 
                          type="number" 
                          required
                          step="0.01"
                          min="0.10"
                          placeholder="Amount ($)..." 
                          value={trialAdjustmentAmount}
                          onChange={e => setTrialAdjustmentAmount(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4.5 rounded-xl transition active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>

                {/* Segment columns 2: VIP points adjuster */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">Enroll Loyalty Points</h4>
                    <span className="text-[11px] font-mono font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl">
                      Points: {selectedCustomer.loyaltyPoints}
                    </span>
                  </div>

                  <form onSubmit={handleAdjustLoyalty} className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <p className="text-[10px] text-gray-400 font-medium">To deduct points, enter a negative number (e.g. -50 to redeem points against invoice checkout bills). To award, enter positive integers.</p>
                    
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        required
                        placeholder="Points delta (e.g. -50 or 100)..." 
                        value={trialLoyaltyDelta}
                        onChange={e => setTrialLoyaltyDelta(e.target.value)}
                        className="flex-1 text-xs p-3 bg-white border border-gray-200 rounded-xl outline-none font-bold"
                      />
                      <button 
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4.5 rounded-xl transition active:scale-95"
                      >
                        Adjust Points
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              {/* Close profile button wrapper */}
              <div className="flex justify-end pt-3 border-t border-gray-100 font-sans">
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold text-xs py-3 px-6 rounded-xl transition"
                >
                  Close Profile Drawer
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. DIALOG MODAL POPUP: ADD NEW CUSTOMER PROFILE */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-md w-full relative z-10"
            >
              <form onSubmit={handleAddCustomer} className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-black text-gray-800">Enrol New Patient profile</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Define patient membership numbers, contact lines, and opening outstanding store dues parameters.</p>
                  </div>
                  <button type="button" onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 text-xl leading-none">&times;</button>
                </div>

                {/* Form Elements */}
                <div className="space-y-3.5 font-sans">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Customer / Patient Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Dr. Miles Bennett Dyson"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                    />
                  </div>

                  {/* Contact phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Primary Phone contact Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 555-0312"
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-mono"
                    />
                  </div>

                  {/* Email address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="patient@cyberdyne.com"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-mono"
                    />
                  </div>

                  {/* Split parameters: Opening credit balance vs loyalty VIP points initialization */}
                  <div className="grid grid-cols-2 gap-3.5">
                    
                    {/* Balance */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-450 uppercase">Opening Balance ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="e.g. -50.00 for dues"
                        value={newBalance}
                        onChange={e => setNewBalance(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-mono font-bold"
                      />
                    </div>

                    {/* Loyalty points */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-450 uppercase">Opening VIP Points</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={newLoyaltyPoints}
                        onChange={e => setNewLoyaltyPoints(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-mono"
                      />
                    </div>

                  </div>

                </div>

                {/* Footer Buttons Actions */}
                <div className="flex justify-end gap-2.5 pt-3.5 border-t border-gray-100 font-sans">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="text-xs font-bold text-gray-500 hover:bg-gray-100 py-3 px-5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-6 rounded-xl shadow-xs transition active:scale-95"
                  >
                    Enrol Customer Account
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
