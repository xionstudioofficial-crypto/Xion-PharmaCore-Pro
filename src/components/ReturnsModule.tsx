import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, ScanLine, DollarSign, CornerDownLeft, 
  Receipt, Printer, FileText, CheckCircle2, AlertCircle, X, RotateCcw 
} from "lucide-react";
import { useCurrency } from "@/src/hooks/useCurrency";
import { useAuth } from "@/src/context/AuthContext";
import { useSync } from "@/src/context/SyncContext";

interface ReturnItem {
  id: string; // medicine id
  name: string;
  quantityRef: number; // how many were bought initially
  returnQuantity: number; // how many are being returned now
  unitPrice: number;
}

interface ReturnRecord {
  id: string; // RM-xxxx
  invoice_id: string;
  customer_id?: string;
  cashier_id: string;
  refund_amount: number;
  return_type: string;
  reason: string;
  reference_invoice?: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  created_at: string;
  items: any[];
}

export function ReturnsModule({ inventory, setInventory, orders = [], setOrders }: any) {
  const { formatCurrency, symbol } = useCurrency();
  const { user } = useAuth();
  const syncCtx = useSync();
  const addToSyncQueue = syncCtx?.addToSyncQueue;
  
  // Local state for fetching invoice
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  // Return workflow state
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnType, setReturnType] = useState("Customer Return");
  const [returnReason, setReturnReason] = useState("Incorrect Item");
  const [customReason, setCustomReason] = useState("");
  const [refundTaxToggle, setRefundTaxToggle] = useState(true);
  const [referenceInvoice, setReferenceInvoice] = useState("");
  
  // History of returns
  const [returnsHistory, setReturnsHistory] = useState<ReturnRecord[]>([]);

  // Restock Log list state
  const [restockLogs, setRestockLogs] = useState<any[]>([]);

  // Load returns history
  useEffect(() => {
    if (user?.client?.id) {
      const savedReturns = localStorage.getItem(`pharma_returns_${user.client.id}`);
      if (savedReturns) {
        const parsed = JSON.parse(savedReturns);
        setReturnsHistory(Array.isArray(parsed) ? parsed : []);
      }
    }
  }, [user?.client?.id]);

  // Load restock log
  useEffect(() => {
    if (user?.client?.id) {
      const savedLogs = localStorage.getItem(`pharma_restock_logs_${user.client.id}`);
      if (savedLogs) {
        try {
          setRestockLogs(JSON.parse(savedLogs));
        } catch (e) {
          setRestockLogs([]);
        }
      } else {
        // If no explicit restock logs exist but returns history contains approved customer returns,
        // we populate the log on first load for consistency.
        const savedReturns = localStorage.getItem(`pharma_returns_${user.client.id}`);
        if (savedReturns) {
          try {
            const parsedReturns = JSON.parse(savedReturns);
            if (Array.isArray(parsedReturns)) {
              const generatedLogs: any[] = [];
              parsedReturns.forEach((ret: any) => {
                if (ret.status === "Approved" && ret.return_type === "Customer Return") {
                  ret.items.forEach((item: any) => {
                    if (item.returnQuantity > 0) {
                      generatedLogs.push({
                        id: `RSL-${Math.floor(Math.random() * 90000) + 10000}`,
                        returnId: ret.id,
                        itemName: item.name,
                        quantity: item.returnQuantity,
                        cashier: ret.cashier_id || "System",
                        timestamp: ret.created_at || "Recent"
                      });
                    }
                  });
                }
              });
              if (generatedLogs.length > 0) {
                localStorage.setItem(`pharma_restock_logs_${user.client.id}`, JSON.stringify(generatedLogs));
                setRestockLogs(generatedLogs);
              }
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }, [user?.client?.id]);

  const saveReturnToHistory = (newReturn: ReturnRecord) => {
    const updated = [newReturn, ...returnsHistory];
    setReturnsHistory(updated);
    if (user?.client?.id) {
      localStorage.setItem(`pharma_returns_${user.client.id}`, JSON.stringify(updated));
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // We look for invoice. Or phone number on invoice.
    const foundInvoice = orders.find((o: any) => 
      o.id.toLowerCase() === searchQuery.toLowerCase() ||
      (o.customerPhone && o.customerPhone.includes(searchQuery))
    );

    if (foundInvoice) {
      setSelectedInvoice(foundInvoice);
      // Initialize return items to 0 by default
      const initialItems = (foundInvoice.items || []).map((it: any) => ({
        id: it.id,
        name: it.name,
        quantityRef: it.quantity,
        returnQuantity: 0,
        unitPrice: it.price
      }));
      setReturnItems(initialItems);
    } else {
      alert("Invoice not found or no matching customer phone.");
    }
  };

  const calculateRefund = () => {
    // Basic calculation for subtotal
    const refundSubtotal = returnItems.reduce((acc, it) => acc + (it.returnQuantity * it.unitPrice), 0);
    // Rough estimate logic: If they paid tax in the original, we should refund proportional tax.
    // For simplicity, we assume strict 5% tax if toggle is on
    const taxAmount = refundTaxToggle ? refundSubtotal * 0.05 : 0;
    
    // Also consider discounts from original? We will keep it simple.
    const totalRefund = refundSubtotal + taxAmount;
    
    return {
      subtotal: refundSubtotal,
      tax: taxAmount,
      total: totalRefund
    };
  };

  const handleConfirmReturn = () => {
    if (returnItems.every(it => it.returnQuantity === 0)) {
      alert("Please specify return quantities for at least one item.");
      return;
    }

    if (returnType === "Supplier Return" && !referenceInvoice.trim()) {
      alert("Supplier Return requires an associated invoice or reference number.");
      return;
    }

    const refundCalc = calculateRefund();
    const returnId = `RET-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;

    const newReturn: ReturnRecord = {
      id: returnId,
      invoice_id: selectedInvoice.id,
      customer_id: selectedInvoice.customer || "Walk-in",
      cashier_id: user?.name || "System",
      refund_amount: refundCalc.total,
      return_type: returnType,
      reason: returnReason === "Custom" ? customReason : returnReason,
      reference_invoice: referenceInvoice || undefined,
      status: "Pending Approval",
      created_at: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: returnItems.filter(it => it.returnQuantity > 0)
    };

    saveReturnToHistory(newReturn);
    
    // Trigger notification alerting Owner/Admin role
    if (user?.client?.id) {
      const savedNotifs = localStorage.getItem(`pharma_notifications_${user.client.id}`);
      let currentNotifs: any[] = [];
      if (savedNotifs) {
        try {
          currentNotifs = JSON.parse(savedNotifs);
        } catch (e) {
          currentNotifs = [];
        }
      }
      const newNotif = {
        type: "warning",
        title: "Return Awaiting Approval",
        message: `New Return request ${returnId} of amount ${formatCurrency(refundCalc.total)} for Invoice ${selectedInvoice.id} is pending Manager Approval.`,
        time: "Just now",
        timestamp: new Date().toISOString(),
        roleRestrict: "Owner/Admin"
      };
      
      localStorage.setItem(`pharma_notifications_${user.client.id}`, JSON.stringify([newNotif, ...currentNotifs]));
    }
    
    // Offline-first sync logic placeholder for Returns tracking
    if (addToSyncQueue) {
      addToSyncQueue("INSERT", "RETURNS", {
        id: returnId,
        invoice_id: selectedInvoice.id,
        customer_id: selectedInvoice.customer || "Walk-in",
        refund_amount: refundCalc.total,
        return_type: returnType,
        reason: returnReason === "Custom" ? customReason : returnReason,
        status: "Pending Approval",
        created_at: new Date().toISOString(),
      });
      addToSyncQueue("INSERT", "RETURN_ITEMS", returnItems.filter(it => it.returnQuantity > 0));
    }

    alert(`SUCCESS: Return request submitted and is pending Manager Approval.`);
    
    // Clear
    setSelectedInvoice(null);
    setSearchQuery("");
    setReturnItems([]);
  };

  const handleManagerApprove = (ret: ReturnRecord) => {
    if (user?.role !== "Owner/Admin") {
      alert("Only an Owner/Admin can approve returns.");
      return;
    }
    
    const updatedHistory = returnsHistory.map(r => r.id === ret.id ? { ...r, status: "Approved" as const } : r);
    setReturnsHistory(updatedHistory);
    if (user?.client?.id) {
      localStorage.setItem(`pharma_returns_${user.client.id}`, JSON.stringify(updatedHistory));
    }

    const updatedInventory = [...inventory];
    const newRestocks: any[] = [];
    for (const returnedItem of ret.items) {
      if (returnedItem.returnQuantity > 0) {
        const idx = updatedInventory.findIndex(med => med.id === returnedItem.id);
        if (idx !== -1) {
          if (ret.return_type === "Customer Return") {
             updatedInventory[idx].stock += returnedItem.returnQuantity;
             newRestocks.push({
               id: `RSL-${Math.floor(Math.random() * 90000) + 10000}`,
               returnId: ret.id,
               itemName: returnedItem.name,
               quantity: returnedItem.returnQuantity,
               cashier: ret.cashier_id || user?.name || "System",
               timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + " " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
             });
          }
        }
      }
    }
    setInventory(updatedInventory);

    if (newRestocks.length > 0) {
      const updatedLogs = [...newRestocks, ...restockLogs];
      setRestockLogs(updatedLogs);
      if (user?.client?.id) {
        localStorage.setItem(`pharma_restock_logs_${user.client.id}`, JSON.stringify(updatedLogs));
      }
    }

    const updatedOrders = orders.map((o: any) => {
      if (o.id === ret.invoice_id) {
        return { ...o, status: "Partially Refunded" };
      }
      return o;
    });
    setOrders(updatedOrders);
    
    if (addToSyncQueue) {
       addToSyncQueue("UPDATE", "RETURNS", { id: ret.id, status: "Approved" });
    }
    
    alert(`Return ${ret.id} has been approved. Effects applied.`);
  };

  const handleManagerReject = (ret: ReturnRecord) => {
    if (user?.role !== "Owner/Admin") {
      alert("Only an Owner/Admin can reject returns.");
      return;
    }
    const updatedHistory = returnsHistory.map(r => r.id === ret.id ? { ...r, status: "Rejected" as const } : r);
    setReturnsHistory(updatedHistory);
    if (user?.client?.id) {
      localStorage.setItem(`pharma_returns_${user.client.id}`, JSON.stringify(updatedHistory));
    }
    if (addToSyncQueue) {
       addToSyncQueue("UPDATE", "RETURNS", { id: ret.id, status: "Rejected" });
    }
    alert(`Return ${ret.id} was rejected.`);
  };

  const { subtotal, tax, total } = calculateRefund();

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-800">Process Return / Refund</h2>
          <p className="text-xs text-slate-500 font-medium">Search the original invoice to initiate a medicine return and automatic inventory rollback.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Scan Barcode or Enter Invoice # / Phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm whitespace-nowrap"
          >
            Lookup Invoice
          </button>
        </div>
      </div>

      {selectedInvoice ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    Invoice: <span className="font-mono text-emerald-800">{selectedInvoice.id}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Date: {selectedInvoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{selectedInvoice.customer}</p>
                  <span className={`px-2 py-0.5 mt-1 inline-block rounded-md text-[10px] uppercase font-black ${
                    selectedInvoice.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 bg-gray-50/50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Medicine Name</th>
                      <th className="px-6 py-3 font-semibold text-center">Unit Price</th>
                      <th className="px-6 py-3 font-semibold text-center">Sold Qty</th>
                      <th className="px-6 py-3 font-semibold text-center">Return Qty</th>
                      <th className="px-6 py-3 font-semibold text-right">Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnItems.map((item, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                        <td className="px-6 py-4 font-mono text-center text-gray-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-6 py-4 font-mono text-center text-gray-600">{item.quantityRef}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 font-bold hover:bg-gray-200"
                              onClick={() => {
                                const newItems = [...returnItems];
                                newItems[index].returnQuantity = Math.max(0, newItems[index].returnQuantity - 1);
                                setReturnItems(newItems);
                              }}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono font-bold">{item.returnQuantity}</span>
                            <button 
                              className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 font-bold hover:bg-emerald-100 hover:text-emerald-700"
                              onClick={() => {
                                const newItems = [...returnItems];
                                newItems[index].returnQuantity = Math.min(newItems[index].quantityRef, newItems[index].returnQuantity + 1);
                                setReturnItems(newItems);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-700 text-right">
                          {formatCurrency(item.returnQuantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-800">Return Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Return Type</label>
                  <select 
                    value={returnType}
                    onChange={e => setReturnType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Customer Return">Customer Return (Restock)</option>
                    <option value="Supplier Return">Supplier Return</option>
                    <option value="Expired Medicine Return">Expired Medicine Return (Dispose)</option>
                    <option value="Damaged Medicine Return">Damaged Medicine Return (Dispose)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Associated Invoice # {returnType === 'Supplier Return' && <span className="text-rose-500">*</span>}
                  </label>
                  <input 
                    type="text"
                    value={referenceInvoice}
                    onChange={e => setReferenceInvoice(e.target.value)}
                    placeholder="Optional Invoice/Reference"
                    className={`w-full border rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none ${returnType === 'Supplier Return' && !referenceInvoice ? 'border-rose-300 bg-rose-50' : 'border-gray-200'}`}
                  />
                </div>
                <div className={returnReason === "Custom" ? "col-span-1 md:col-span-3" : ""}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Reason</label>
                  <select 
                    value={returnReason}
                    onChange={e => setReturnReason(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Incorrect Item">Incorrect Item</option>
                    <option value="Short Expiry">Short Expiry</option>
                    <option value="Damaged Package">Damaged Package</option>
                    <option value="Adverse Reaction">Adverse Reaction</option>
                    <option value="Customer Changed Mind">Customer Changed Mind</option>
                    <option value="Custom">Custom Reason...</option>
                  </select>
                  
                  {returnReason === "Custom" && (
                    <input 
                      type="text"
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none mt-3"
                      placeholder="Enter custom return reason..."
                      value={customReason}
                      onChange={e => setCustomReason(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>
            
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Refund Calculation
              </h3>

              <div className="space-y-3 font-mono text-sm border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Refund Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    Tax Reversal (5%)
                    <input 
                      type="checkbox" 
                      checked={refundTaxToggle} 
                      onChange={e => setRefundTaxToggle(e.target.checked)} 
                      className="accent-emerald-600"
                    />
                  </span>
                  <span className="font-bold">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-800">Total Refund</span>
                <span className="text-xl font-black text-rose-600 font-mono">{formatCurrency(total)}</span>
              </div>

              <button 
                onClick={handleConfirmReturn}
                disabled={total <= 0}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                  total > 0 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CornerDownLeft className="w-4 h-4" />
                Confirm Return
              </button>

              <button 
                onClick={() => {
                  setSelectedInvoice(null);
                  setSearchQuery("");
                }}
                className="w-full mt-3 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition border border-gray-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Returns History Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <FileText className="w-4 h-4 text-emerald-600" />
               Recent Returns
             </h3>

             {returnsHistory.length > 0 ? (
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-3">Return ID</th>
                        <th className="px-4 py-3">Invoice Ref</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right">Refund</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnsHistory.map((ret, i) => (
                        <tr key={ret.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono font-bold text-slate-700">{ret.id}</td>
                          <td className="px-4 py-3 font-mono text-emerald-700">
                            {ret.invoice_id}
                            {ret.reference_invoice && (
                              <span className="block text-[9px] text-gray-400 mt-0.5">Ref: {ret.reference_invoice}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-600">{ret.customer_id}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                              {ret.return_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-3xs ${
                              ret.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              ret.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-200" :
                              "bg-amber-50 text-amber-750 border-amber-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                ret.status === "Approved" ? "bg-emerald-500" :
                                ret.status === "Rejected" ? "bg-rose-500" :
                                "bg-amber-500 animate-pulse"
                              }`} />
                              {ret.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-rose-600 text-right">
                            {formatCurrency(ret.refund_amount)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {ret.status === "Pending Approval" ? (
                              user?.role === "Owner/Admin" ? (
                               <div className="flex items-center justify-center gap-1.5">
                                 <button 
                                   onClick={() => handleManagerApprove(ret)}
                                   className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold rounded-lg shadow-sm flex items-center gap-1 transition active:scale-95 cursor-pointer font-sans"
                                 >
                                   <CheckCircle2 className="w-3.5 h-3.5" />
                                   Manager Approval
                                 </button>
                                 <button 
                                   onClick={() => handleManagerReject(ret)}
                                   className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold rounded-lg shadow-sm transition active:scale-95 cursor-pointer font-sans"
                                 >
                                   Reject
                                 </button>
                               </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-full select-none">
                                  🔒 Awaiting Manager Approval
                                </span>
                              )
                            ) : (
                              <button 
                                className="p-1.5 text-gray-400 hover:text-emerald-700 transition cursor-pointer"
                                onClick={() => window.print()}
                                title="Print approval receipt"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             ) : (
               <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                 <CornerDownLeft className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                 <p className="text-sm font-bold text-gray-500">No return records found</p>
                 <p className="text-xs text-gray-400 mt-1">Returned invoices will be logged here.</p>
               </div>
             )}
          </div>

          {/* Restock Log Panel */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                Restock Log
              </h3>
              
              {restockLogs.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {restockLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-gray-200 transition">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">{log.itemName}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-medium">
                          <span className="font-mono bg-gray-100 px-1 rounded text-gray-600 border border-gray-200">{log.returnId}</span>
                          <span>•</span>
                          <span className="truncate">By {log.cashier}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-mono font-extrabold text-[11px] uppercase tracking-wide">
                          +{log.quantity}
                        </span>
                        <p className="text-[9px] font-mono text-gray-400 mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl my-auto">
                  <RotateCcw className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-gray-500">No restock logs yet</p>
                  <p className="text-[10px] text-gray-400 mt-1">Approved customer returns restock log items here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
