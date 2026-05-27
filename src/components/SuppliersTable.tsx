import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Phone, Mail, MapPin, DollarSign, Calendar, Eye, 
  ArrowUpDown, CheckCircle2, AlertCircle, ShoppingCart, CreditCard, 
  Trash2, User, Send, FileText, X, ArrowUpRight, ArrowDownLeft, ShieldCheck
} from "lucide-react";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: "Purchase" | "Payment";
  debit: number; // Increase in due amount (Supplier files invoice)
  credit: number; // Decrease in due amount (We make a payment)
  balance: number; // Remaining due balance
}

interface SupplierPurchaseOrder {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: "Completed" | "Pending" | "Void";
}

interface Supplier {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  dueAmount: number;
  lastPurchaseDate: string;
  lastPurchaseRef: string;
  purchaseOrders: SupplierPurchaseOrder[];
  ledger: LedgerEntry[];
}

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-01",
    companyName: "PharmaCorp Inc.",
    contactName: "Jonathan Vance",
    phone: "+1 555-0192",
    email: "orders@pharmacorp.com",
    address: "West Medical Corporate Plaza, Building C, NY",
    dueAmount: 1250.00,
    lastPurchaseDate: "2026-05-18",
    lastPurchaseRef: "PO-2026-001",
    purchaseOrders: [
      { id: "PO-2026-001", date: "2026-05-18", itemsCount: 3, totalAmount: 1250.00, status: "Completed" },
      { id: "PO-2026-014", date: "2026-04-12", itemsCount: 2, totalAmount: 850.00, status: "Completed" }
    ],
    ledger: [
      { id: "L-01", date: "2026-04-12", description: "Batch purchase inv #88094", type: "Purchase", debit: 850.00, credit: 0, balance: 850.00 },
      { id: "L-02", date: "2026-04-15", description: "Paid via bank wire - Txn #9000", type: "Payment", debit: 0, credit: 850.00, balance: 0.00 },
      { id: "L-03", date: "2026-05-18", description: "New stock delivery inv #91104", type: "Purchase", debit: 1250.00, credit: 0, balance: 1250.00 }
    ]
  },
  {
    id: "SUP-02",
    companyName: "MediSupply Ltd.",
    contactName: "Claire Abbott",
    phone: "+1 555-0331",
    email: "claire@medisupply.org",
    address: "77 Sterling Wholesales Way, Austin, TX",
    dueAmount: 450.00,
    lastPurchaseDate: "2026-05-22",
    lastPurchaseRef: "PO-2026-002",
    purchaseOrders: [
      { id: "PO-2026-002", date: "2026-05-22", itemsCount: 1, totalAmount: 650.00, status: "Completed" }
    ],
    ledger: [
      { id: "L-04", date: "2026-05-22", description: "Direct buy immunities stock", type: "Purchase", debit: 650.00, credit: 0, balance: 650.00 },
      { id: "L-05", date: "2026-05-23", description: "Cheque installment payment #401", type: "Payment", debit: 0, credit: 200.00, balance: 450.00 }
    ]
  },
  {
    id: "SUP-03",
    companyName: "GlaxoSmithKline Wholesale",
    contactName: "Robert Miller",
    phone: "+1 555-1044",
    email: "robert.miller@gsk-wholesale.com",
    address: "Global Distribution Depot 4, Philadelphia PA",
    dueAmount: 0.00,
    lastPurchaseDate: "2026-05-02",
    lastPurchaseRef: "PO-2026-009",
    purchaseOrders: [
      { id: "PO-2026-009", date: "2026-05-02", itemsCount: 4, totalAmount: 1800.00, status: "Completed" }
    ],
    ledger: [
      { id: "L-06", date: "2026-05-02", description: "Bulk Vaccines delivery", type: "Purchase", debit: 1800.00, credit: 0, balance: 1800.00 },
      { id: "L-07", date: "2026-05-03", description: "ACH cleared settlement in full", type: "Payment", debit: 0, credit: 1800.00, balance: 0.00 }
    ]
  }
];

interface SuppliersTableProps {
  compact?: boolean;
}

export function SuppliersTable({ compact = false }: SuppliersTableProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal toggle state managers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Active sub-tab inside ledger modal: "Ledger" | "POs" | "Pay"
  const [ledgerModalTab, setLedgerModalTab] = useState<"Ledger" | "POs" | "Pay">("Ledger");

  // New Supplier Form Fields state
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newInitialBalance, setNewInitialBalance] = useState("");

  // Payment capture form fields under ledger modal
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Bank Transfer");
  const [payNotes, setPayNotes] = useState("");

  // Add a brand new supplier handler
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const parsedDue = parseFloat(newInitialBalance) || 0;
    const generatedId = `SUP-${Math.floor(Math.random() * 90) + 10}`;

    const newSupplierEntry: Supplier = {
      id: generatedId,
      companyName: newCompanyName,
      contactName: newContactName || "N/A",
      phone: newPhone || "N/A",
      email: newEmail || "N/A",
      address: newAddress || "N/A",
      dueAmount: parsedDue,
      lastPurchaseDate: parsedDue > 0 ? new Date().toISOString().split("T")[0] : "N/A",
      lastPurchaseRef: parsedDue > 0 ? "Initial Balance Setup" : "None",
      purchaseOrders: [],
      ledger: parsedDue > 0 ? [
        {
          id: `L-INIT-${generatedId}`,
          date: new Date().toISOString().split("T")[0],
          description: "Carry Over Initial Setup Balance",
          type: "Purchase",
          debit: parsedDue,
          credit: 0,
          balance: parsedDue
        }
      ] : []
    };

    setSuppliers([...suppliers, newSupplierEntry]);
    setIsAddModalOpen(false);

    // Reset fields
    setNewCompanyName("");
    setNewContactName("");
    setNewPhone("");
    setNewEmail("");
    setNewAddress("");
    setNewInitialBalance("");
  };

  // Log a new payment installment towards supplier dues balance
  const handleRecordLedgerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !payAmount) return;

    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return;

    const payDate = new Date().toISOString().split("T")[0];
    const updatedSuppliers = suppliers.map(sup => {
      if (sup.id === selectedSupplier.id) {
        const remainingDue = Math.max(0, sup.dueAmount - amt);
        const lastLedgerId = sup.ledger.length + 1;

        const newEntry: LedgerEntry = {
          id: `L-PAY-${lastLedgerId}`,
          date: payDate,
          description: `Payment via ${payMethod} ${payNotes ? `- ${payNotes}` : ""}`,
          type: "Payment",
          debit: 0,
          credit: amt,
          balance: remainingDue
        };

        const nextSupplierState: Supplier = {
          ...sup,
          dueAmount: remainingDue,
          ledger: [...sup.ledger, newEntry]
        };

        // Instantly push to modal drawer visual state
        setSelectedSupplier(nextSupplierState);
        return nextSupplierState;
      }
      return sup;
    });

    setSuppliers(updatedSuppliers);
    setPayAmount("");
    setPayNotes("");
    alert(`Payment of $${amt.toFixed(2)} recorded successfully.`);
  };

  // Quick delete supplier function helper
  const handleDeleteSupplier = (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to remove ${name} from key suppliers directory?`)) {
      setSuppliers(suppliers.filter(s => s.id !== id));
      if (selectedSupplier?.id === id) {
        setSelectedSupplier(null);
        setIsLedgerOpen(false);
      }
    }
  };

  // General products matches filters
  const filteredSuppliers = suppliers.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.companyName.toLowerCase().includes(q) ||
      s.contactName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={compact ? "space-y-4" : "space-y-6"}
    >
      {/* 1. Suppliers Header Actions layout */}
      {!compact ? (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-700" />
              <span>Integrated Suppliers Ledger & Directory</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Regulate pharmaceutical wholesalers contact sheets, inspect rolling liability balances, and audit live transactional debits.</p>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition active:scale-95 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register New Supplier
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-sm font-extrabold text-[#0c443c] flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-700" />
              <span>Key Suppliers</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Rolling liability balances & contacts</p>
          </div>
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-850 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Register
          </button>
        </div>
      )}

      {/* 2. Compact Search Tools Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={compact ? "Filter suppliers..." : "Filter suppliers by brand name, primary contact, key account managers, or emails..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none transition font-medium text-gray-800"
          />
        </div>
      </div>

      {/* 3. Bento Layout Grid of Supplier Cards */}
      <div className={compact 
        ? "space-y-2" 
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }>
        {filteredSuppliers.map(sup => (
          <motion.div 
            key={sup.id}
            layoutId={sup.id}
            className={compact 
              ? "bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-700/30 transition-all font-bold text-xs text-gray-800"
              : "bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-700/30 transition-all hover:shadow-md relative group overflow-hidden"
            }
          >
            {compact ? (
              <>
                <span className="truncate">{sup.companyName}</span>
                <span className={`text-[10px] ${sup.dueAmount > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                  ${sup.dueAmount.toFixed(2)}
                </span>
              </>
            ) : (
              <>
                {/* Header section card */}
                <div className="space-y-1.5 pb-2.5 border-b border-gray-50 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest shrink-0">{sup.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md truncate max-w-[140px] ${
                      sup.dueAmount > 0 ? "bg-rose-50 text-rose-700 border border-rose-100/50" : "bg-emerald-50 text-emerald-800 border border-emerald-100/30"
                    }`}>
                      {sup.dueAmount > 0 ? "Outstanding Dues" : "Paid Settled"}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-gray-900 group-hover:text-emerald-800 transition text-sm leading-tight truncate" title={sup.companyName}>{sup.companyName}</h4>
                  <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1 truncate">
                    <User className="w-3 h-3 text-emerald-700 shrink-0" /> <span className="truncate">Accounts rep: {sup.contactName}</span>
                  </p>
                </div>

                {/* Middle contact details listed */}
                <div className="space-y-2 text-xs text-gray-600 font-medium min-w-0">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-mono text-gray-700 truncate">{sup.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate text-gray-700" title={sup.email}>{sup.email}</span>
                  </div>
                  <div className="flex items-start gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 text-gray-700" title={sup.address}>{sup.address}</span>
                  </div>
                </div>

                {/* Calculations and Dues metrics boxes */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100/30 grid grid-cols-2 gap-2 text-xs font-mono min-w-0">
                  <div className="min-w-0">
                    <p className="text-gray-450 font-sans text-[9px] uppercase font-bold tracking-wider">Due Balance</p>
                    <p className={`font-black text-xs sm:text-sm mt-0.5 truncate ${sup.dueAmount > 0 ? "text-rose-600" : "text-emerald-800"}`}>
                      ${sup.dueAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="min-w-0 border-l border-gray-200/50 pl-2.5">
                    <p className="text-gray-455 font-sans text-[9px] uppercase font-bold tracking-wider">Last Purchase</p>
                    <p className="font-semibold text-gray-750 mt-0.5 truncate" title={sup.lastPurchaseRef}>
                      {sup.lastPurchaseDate !== "N/A" ? sup.lastPurchaseDate : "No Record"}
                    </p>
                  </div>
                </div>

                {/* Control buttons inside card */}
                <div className="flex gap-2 pt-2 text-xs">
                  <button 
                    onClick={() => {
                      setSelectedSupplier(sup);
                      setLedgerModalTab("Ledger");
                      setIsLedgerOpen(true);
                    }}
                    className="flex-1 text-center font-bold bg-slate-900 hover:bg-slate-800 text-slate-100 py-2 rounded-xl transition cursor-pointer text-[10px] sm:text-xs"
                  >
                    Open Ledger
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedSupplier(sup);
                      setLedgerModalTab("Pay");
                      setIsLedgerOpen(true);
                    }}
                    className="flex-1 text-center font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 py-2 rounded-xl transition cursor-pointer text-[10px] sm:text-xs"
                  >
                    Pay Dues
                  </button>

                  <button 
                    onClick={() => handleDeleteSupplier(sup.id, sup.companyName)}
                    className="p-2 text-gray-400 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100/50 cursor-pointer"
                    title="Remove Wholesaler"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}


        {filteredSuppliers.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white border border-gray-100 shadow-sm rounded-3xl text-gray-400">
            <p className="font-bold text-sm">No wholesale supplier matches found in index directories.</p>
            <p className="text-xs text-gray-400 mt-1">Clean search filters or register a brand-new supplier to start tracking.</p>
          </div>
        )}
      </div>

      {/* 4. DIALOG MODAL TYPE: DETAIL SUPPLIER LEDGER + PURCHASE ORDERS */}
      <AnimatePresence>
        {isLedgerOpen && selectedSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsLedgerOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-105 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10 space-y-4"
            >
              {/* Header metadata */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded">{selectedSupplier.id}</span>
                  <h3 className="font-black text-gray-800 text-lg mt-2 leading-none">{selectedSupplier.companyName}</h3>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-700" /> {selectedSupplier.address}
                  </p>
                </div>
                <button 
                  onClick={() => setIsLedgerOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 font-bold text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Sub-Tabs segment filters */}
              <div className="flex border-b border-gray-100/80 text-xs font-bold gap-4">
                <button 
                  onClick={() => setLedgerModalTab("Ledger")}
                  className={`pb-2.5 transition-all text-xs border-b-2 px-1 ${
                    ledgerModalTab === "Ledger" 
                    ? "border-emerald-700 text-emerald-800 font-black" 
                    : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Supplier Ledger Account
                </button>
                <button 
                  onClick={() => setLedgerModalTab("POs")}
                  className={`pb-2.5 transition-all text-xs border-b-2 px-1 ${
                    ledgerModalTab === "POs" 
                    ? "border-emerald-700 text-emerald-800 font-black" 
                    : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Purchase Orders history ({selectedSupplier.purchaseOrders.length})
                </button>
                <button 
                  onClick={() => setLedgerModalTab("Pay")}
                  className={`pb-2.5 transition-all text-xs border-b-2 px-1 ${
                    ledgerModalTab === "Pay" 
                    ? "border-emerald-700 text-emerald-800 font-black" 
                    : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Record Installment Payment
                </button>
              </div>

              {/* Content Panel depending on Ledger Tab */}
              <div className="min-h-[220px]">
                
                {/* A. LEDGER ENTRIES LIST TABLE */}
                {ledgerModalTab === "Ledger" && (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500">Dual-Entry Book Ledger History</span>
                      <span className="font-bold font-mono text-rose-600 bg-rose-50 text-[11px] px-2.5 py-1 rounded-xl">
                        Total Outstanding: ${selectedSupplier.dueAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left border-collapse font-sans">
                        <thead>
                          <tr className="bg-gray-100 font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="p-3">Txn Date</th>
                            <th className="p-3">Reference / Dec description</th>
                            <th className="p-3 text-right">Debit (Dues +)</th>
                            <th className="p-3 text-right">Credit (Dues -)</th>
                            <th className="p-3 text-right">Due Bal</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-[11px] text-gray-700 font-bold">
                          {selectedSupplier.ledger.map(lg => (
                            <tr key={lg.id} className="border-b border-gray-200/55 hover:bg-gray-50 transition-colors">
                              <td className="p-3">{lg.date}</td>
                              <td className="p-3 text-gray-900 font-sans">{lg.description}</td>
                              <td className="p-3 text-right text-rose-600">
                                {lg.debit > 0 ? `+$${lg.debit.toFixed(2)}` : "-"}
                              </td>
                              <td className="p-3 text-right text-emerald-700">
                                {lg.credit > 0 ? `-$${lg.credit.toFixed(2)}` : "-"}
                              </td>
                              <td className="p-3 text-right text-slate-800">
                                ${lg.balance.toFixed(2)}
                              </td>
                            </tr>
                          ))}

                          {selectedSupplier.ledger.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-6 text-center text-gray-400 font-bold font-sans">
                                No general book ledger entries found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* B. RELATED PURCHASE ORDERS TAB */}
                {ledgerModalTab === "POs" && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-gray-500 uppercase tracking-widest">Linked Warehouse Purchase Orders</h4>
                    
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                      {selectedSupplier.purchaseOrders.map(po => (
                        <div key={po.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-gray-400">{po.id}</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 pb-0.5 rounded font-bold">{po.status}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 font-medium">Date logged: {po.date} | {po.itemsCount} medicines included</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400">Total Purchase Amount</p>
                            <p className="font-mono font-black text-emerald-800 text-sm">${po.totalAmount.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}

                      {selectedSupplier.purchaseOrders.length === 0 && (
                        <div className="p-8 text-center bg-gray-50 rounded-2xl text-gray-400 text-xs font-bold border border-dashed border-gray-200">
                          No historic raw bulk inventory purchase orders linked to this wholesaler.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* C. RECORD PAYMENT OUTSTANDING DUES TRANS ACTION */}
                {ledgerModalTab === "Pay" && (
                  <form onSubmit={handleRecordLedgerPayment} className="space-y-4 max-w-md mx-auto py-2">
                    <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-800 border border-amber-100/50 flex gap-2 w-full font-sans font-medium">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">Recording Wholesaler Settlement</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">Payments directly reduce outstanding liabilities owed to {selectedSupplier.companyName}. Accounts list will record this as Credits in the Ledger log.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-450 uppercase">Payment Amount ($) *</label>
                        <input 
                          type="number" 
                          required
                          step="0.01"
                          min="0.10"
                          max={selectedSupplier.dueAmount > 0 ? selectedSupplier.dueAmount : undefined}
                          placeholder="e.g. 500.00" 
                          value={payAmount}
                          onChange={e => setPayAmount(e.target.value)}
                          className="w-full text-xs p-3 border border-gray-250 bg-gray-50/50 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-450 uppercase">Payment Channel *</label>
                        <select
                          value={payMethod}
                          onChange={e => setPayMethod(e.target.value)}
                          className="w-full text-xs p-3 border border-gray-250 bg-white rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 font-bold cursor-pointer"
                        >
                          <option value="Bank Transfer">Bank Wire ACH</option>
                          <option value="Cheque Clearance">Cheque Direct</option>
                          <option value="Cashier Drawer">Hand Cash Drawer</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-450 uppercase">Internal Reference / Transaction Notes</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Cleared via CEO authorization voucher #8839" 
                        value={payNotes}
                        onChange={e => setPayNotes(e.target.value)}
                        className="w-full text-xs p-3 border border-gray-250 bg-gray-50/50 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition active:scale-95 shadow-xs"
                    >
                      Process Dues Settlement Payment
                    </button>
                  </form>
                )}

              </div>

              {/* Close Button footer wrapper */}
              <div className="flex justify-end pt-3 border-t border-gray-100">
                <button 
                  onClick={() => setIsLedgerOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 px-5 rounded-xl transition"
                >
                  Close Record Drawer
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. DIALOG MODAL TYPE: ADD NEW WHOLESALER */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-105 max-w-md w-full relative z-10"
            >
              <form onSubmit={handleAddSupplier} className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-black text-gray-800">Register Supplier Wholesaler</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Map corporate accounts, billing addresses, and current balances into SaaS directories.</p>
                  </div>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 text-xl leading-none">&times;</button>
                </div>

                {/* Form fields */}
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Corporate Brand/Company Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Pfizer Pharmaceuticals Co." 
                      value={newCompanyName}
                      onChange={e => setNewCompanyName(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Accounts Manager Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Sandra Bullock" 
                      value={newContactName}
                      onChange={e => setNewContactName(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-450 uppercase">Contact Phone</label>
                      <input 
                        type="tel" 
                        placeholder="+1 555-..." 
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-450 uppercase">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="sales@company.com" 
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Physical Office / Depot Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Unit 4, Biotech Innovation Hub, SF CA" 
                      value={newAddress}
                      onChange={e => setNewAddress(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Initial Carry-over Outstanding Balance ($)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={newInitialBalance}
                      onChange={e => setNewInitialBalance(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50/50 border border-gray-250 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-2.5 pt-3.5 border-t border-gray-100">
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
                    Save Supplier Account
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
