import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Edit2, Trash2, Check, AlertCircle, ShoppingCart, 
  User, Calendar, DollarSign, UploadCloud, FileText, CheckCircle2, 
  Trash, ArrowUpDown, RefreshCw, Layers, ShieldCheck, ChevronRight, Play, Eye
} from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  category?: string;
  batchNumber?: string;
  expiryDate?: string;
  stock: number;
  price: number;
  purchasePrice?: number;
  barcode?: string;
}

interface PurchaseItem {
  medicineId?: string;
  name: string;
  quantity: number;
  costPrice: number;
}

interface PaymentTransaction {
  date: string;
  amount: number;
  method: string;
  reference?: string;
}

interface PurchaseOrder {
  id: string;
  supplierName: string;
  orderDate: string;
  deliveryDate?: string;
  paymentStatus: "Unpaid" | "Partially Paid" | "Paid";
  paymentHistory: PaymentTransaction[];
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  status: "Draft" | "Pending" | "Completed";
  invoiceFileName?: string;
  invoiceFileSize?: string;
  invoiceFilePreview?: string;
}

interface PurchaseManagementPageProps {
  inventory: Medicine[];
  setInventory: (inv: Medicine[]) => void;
}

const PRESETS_SUPPLIERS = [
  "PharmaCorp Inc.",
  "MediSupply Ltd.",
  "GlaxoSmithKline Wholesale",
  "PharmaDist Corp",
  "BioPharma Solutions",
  "MedSource Logistics"
];

const PRESETS_MEDS = [
  "Panadol Extra 500mg",
  "Amoxil Forte 250mg",
  "Zyrtec Allergy 10mg",
  "Lipitor Lipids 20mg",
  "Ventolin Inhaler 100mcg",
  "Nexium Acid Block 40mg"
];

export function PurchaseManagementPage({ inventory, setInventory }: PurchaseManagementPageProps) {
  // Initial demo purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "PO-2026-001",
      supplierName: "PharmaCorp Inc.",
      orderDate: "2026-05-10",
      deliveryDate: "2026-05-18",
      paymentStatus: "Paid",
      paymentHistory: [
        { date: "2026-05-10", amount: 650.00, method: "Bank Transfer", reference: "REF-99401" }
      ],
      items: [
        { name: "Panadol Extra 500mg", quantity: 100, costPrice: 2.80 },
        { name: "Amoxil Forte 250mg", quantity: 50, costPrice: 6.50 }
      ],
      subtotal: 605.00,
      tax: 30.25,
      total: 635.25,
      status: "Completed",
      notes: "Routine quarterly replenishment.",
      invoiceFileName: "invoice_99401_compiled.pdf",
      invoiceFileSize: "142 KB"
    },
    {
      id: "PO-2026-002",
      supplierName: "MediSupply Ltd.",
      orderDate: "2026-05-22",
      deliveryDate: "2026-05-28",
      paymentStatus: "Partially Paid",
      paymentHistory: [
        { date: "2026-05-22", amount: 200.00, method: "Credit Card" }
      ],
      items: [
        { name: "Zyrtec Allergy 10mg", quantity: 200, costPrice: 1.90 }
      ],
      subtotal: 380.00,
      tax: 19.00,
      total: 399.00,
      status: "Pending",
      notes: "Awaiting pending clinical clearances.",
      invoiceFileName: "medisupply_bill_draft.pdf",
      invoiceFileSize: "88 KB"
    }
  ]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // Selected purchase order for detail inspect / invoice upload / payment tracking
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(purchaseOrders[0] || null);

  // Modal for creating custom purchase order
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);

  // Form Field State for creating new purchase orders
  const [supplierName, setSupplierName] = useState(PRESETS_SUPPLIERS[0]);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [poItems, setPoItems] = useState<PurchaseItem[]>([
    { name: PRESETS_MEDS[0], quantity: 50, costPrice: 2.50 }
  ]);

  // Invoice file upload simulator states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{name: string, size: string, preview?: string} | null>(null);

  // Record Payment states
  const [trialPaymentAmount, setTrialPaymentAmount] = useState("");
  const [trialPaymentMethod, setTrialPaymentMethod] = useState("Bank Transfer");
  const [trialPaymentRef, setTrialPaymentRef] = useState("");

  // Calculate sum totals of PO creation form
  const formSubtotal = poItems.reduce((acc, it) => acc + (it.quantity * it.costPrice), 0);
  const formTax = formSubtotal * 0.05; // 5% Healthcare invoice levy VAT
  const formTotal = formSubtotal + formTax;

  // Add line to PO items form
  const addFormLineItem = () => {
    setPoItems([...poItems, { name: PRESETS_MEDS[Math.floor(Math.random() * PRESETS_MEDS.length)], quantity: 50, costPrice: 2.00 }]);
  };

  // Remove line from PO items form
  const removeFormLineItem = (index: number) => {
    if (poItems.length === 1) return;
    setPoItems(poItems.filter((_, idx) => idx !== index));
  };

  // Modify individual form item fields
  const updateFormLineField = (index: number, field: keyof PurchaseItem, value: any) => {
    setPoItems(poItems.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Submit and create purchase order
  const handleCreatePurchaseOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (poItems.length === 0) return;

    const newPO: PurchaseOrder = {
      id: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
      supplierName,
      orderDate,
      deliveryDate: deliveryDate || undefined,
      paymentStatus: "Unpaid",
      paymentHistory: [],
      items: poItems,
      subtotal: formSubtotal,
      tax: formTax,
      total: formTotal,
      notes: notes || undefined,
      status: "Pending",
      invoiceFileName: uploadedFile?.name,
      invoiceFileSize: uploadedFile?.size,
      invoiceFilePreview: uploadedFile?.preview
    };

    const newOrders = [newPO, ...purchaseOrders];
    setPurchaseOrders(newOrders);
    setSelectedPO(newPO);
    setIsNewPOOpen(false);

    // Reset create PO forms
    setSupplierName(PRESETS_SUPPLIERS[0]);
    setOrderDate(new Date().toISOString().split("T")[0]);
    setDeliveryDate("");
    setNotes("");
    setPoItems([{ name: PRESETS_MEDS[0], quantity: 100, costPrice: 2.50 }]);
    setUploadedFile(null);
  };

  // Record an installment/payment towards selected PO
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO || !trialPaymentAmount) return;

    const payAmt = parseFloat(trialPaymentAmount);
    if (isNaN(payAmt) || payAmt <= 0) return;

    const updatedOrders = purchaseOrders.map(order => {
      if (order.id === selectedPO.id) {
        const nextHistory = [
          ...order.paymentHistory,
          {
            date: new Date().toISOString().split("T")[0],
            amount: payAmt,
            method: trialPaymentMethod,
            reference: trialPaymentRef || undefined
          }
        ];

        // Recalculate overall payment sum
        const totalPaid = nextHistory.reduce((s, h) => s + h.amount, 0);
        let nextStatus: "Unpaid" | "Partially Paid" | "Paid" = "Unpaid";
        if (totalPaid >= order.total) {
          nextStatus = "Paid";
        } else if (totalPaid > 0) {
          nextStatus = "Partially Paid";
        }

        const updatedOrder: PurchaseOrder = {
          ...order,
          paymentHistory: nextHistory,
          paymentStatus: nextStatus
        };

        // Instantly synchronise highlighted details pane state
        setSelectedPO(updatedOrder);
        return updatedOrder;
      }
      return order;
    });

    setPurchaseOrders(updatedOrders);
    setTrialPaymentAmount("");
    setTrialPaymentRef("");
  };

  // Simulated Drag-and-drop file upload events
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
      processMockUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processMockUpload(file);
    }
  };

  const processMockUpload = (file: File) => {
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    // Simulated scanner preview if image url is available or file signature matches
    let preview: string | undefined = undefined;
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }

    setUploadedFile({
      name: file.name,
      size: formattedSize,
      preview
    });
  };

  // Append invoice file directly to selected PO in detail view
  const triggerInvoiceUploadOnSelected = (fileName: string, fileSize: string) => {
    if(!selectedPO) return;
    const updated = purchaseOrders.map(po => {
      if (po.id === selectedPO.id) {
        const next = { ...po, invoiceFileName: fileName, invoiceFileSize: fileSize };
        setSelectedPO(next);
        return next;
      }
      return po;
    });
    setPurchaseOrders(updated);
  };

  // Mark pending order received & update physical inventory quantities in main state!
  const markAsReceived = (po: PurchaseOrder) => {
    if (po.status === "Completed") return;

    // Double check inventory matching and update stock levels
    const updatedInventory = [...inventory];
    po.items.forEach(orderedItem => {
      const existingMatch = updatedInventory.find(invProduct => 
        invProduct.name.toLowerCase().includes(orderedItem.name.toLowerCase()) ||
        orderedItem.name.toLowerCase().includes(invProduct.name.toLowerCase())
      );

      if (existingMatch) {
        // Increment medicine stock quantity with parsed values
        existingMatch.stock += orderedItem.quantity;
      } else {
        // Register a completely new active medicine listing in catalog for cohesive ecosystem!
        const generatedId = (updatedInventory.length + 1).toString();
        updatedInventory.push({
          id: generatedId,
          name: orderedItem.name,
          category: "Others",
          expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0],
          stock: orderedItem.quantity,
          price: parseFloat((orderedItem.costPrice * 1.8).toFixed(2)), // Suggest reasonable POS margin price markup markup Markup
          purchasePrice: orderedItem.costPrice,
          batchNumber: `B-PUR-${Math.floor(Math.random() * 90) + 10}`,
          barcode: (Math.floor(Math.random() * 9000000000000) + 100000000000).toString()
        });
      }
    });

    setInventory(updatedInventory);

    // Update PO status to Completed
    const updatedOrders = purchaseOrders.map(order => {
      if (order.id === po.id) {
        const finished: PurchaseOrder = { ...order, status: "Completed" };
        setSelectedPO(finished);
        return finished;
      }
      return order;
    });

    setPurchaseOrders(updatedOrders);
    alert(`Success: PO ${po.id} marked as Completed. Registered order items have been synced directly into your live medicine inventory levels!`);
  };

  // Filter purchase orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === "All" || po.supplierName === supplierFilter;
    const matchesPayment = paymentFilter === "All" || po.paymentStatus === paymentFilter;

    return matchesSearch && matchesSupplier && matchesPayment;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      
      {/* 1. Header Banner Actions bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-700 font-bold" />
            <span>Purchase Management & Orders Ledger</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Configure complex suppliers purchase lists, log real-time installment balances, process bill uploads, and auto-sync stock levels.</p>
        </div>

        <button 
          onClick={() => {
            setUploadedFile(null);
            setIsNewPOOpen(true);
          }}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-2xl active:scale-95 transition shadow-sm self-stretch md:self-auto text-center justify-center"
        >
          <Plus className="w-4 h-4" /> Create Purchase Order
        </button>
      </div>

      {/* 2. Search Toolbar Controls */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Wholesaler name..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none transition font-medium"
          />
        </div>

        {/* Supplier Selector drop */}
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-xl text-xs font-bold border border-transparent text-gray-600">
          <span>Supplier:</span>
          <select 
            value={supplierFilter} 
            onChange={e => setSupplierFilter(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="All">All Suppliers</option>
            {PRESETS_SUPPLIERS.map(sup => (
              <option key={sup} value={sup}>{sup}</option>
            ))}
          </select>
        </div>

        {/* Payment state selector Drop */}
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-xl text-xs font-bold border border-transparent text-gray-600 font-sans">
          <span>Settlement:</span>
          <select 
            value={paymentFilter} 
            onChange={e => setPaymentFilter(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Fully Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* 3. Split Screen: List vs Detailed Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Orders list (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-500">Document registry</h3>
            
            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredPOs.map(po => {
                const totalPaid = po.paymentHistory.reduce((sum, h) => sum + h.amount, 0);
                const isSelected = selectedPO?.id === po.id;

                return (
                  <div 
                    key={po.id}
                    onClick={() => setSelectedPO(po)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between space-y-3 relative overflow-hidden ${
                      isSelected 
                      ? "border-emerald-700 bg-emerald-50/10 shadow-xs" 
                      : "border-gray-100 hover:border-emerald-100 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-400">
                        <span>{po.id}</span>
                        <span>{po.orderDate}</span>
                      </div>
                      
                      <h4 className="font-extrabold text-gray-800 text-sm mt-1">{po.supplierName}</h4>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          po.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {po.status}
                        </span>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          po.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : po.paymentStatus === 'Partially Paid' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {po.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-50 pt-3 text-xs font-mono">
                      <div>
                        <p className="text-gray-400 font-sans text-[10px]">Settled Balance</p>
                        <p className="font-semibold text-gray-600">${totalPaid.toFixed(2)} / ${po.total.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 font-sans text-[10px]">Due Balance</p>
                        <p className="font-black text-rose-600">${Math.max(0, po.total - totalPaid).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Completion sync green band check */}
                    {po.status === "Completed" && (
                      <div className="absolute top-0 right-0 h-1 bg-emerald-600 w-full" />
                    )}
                  </div>
                );
              })}

              {filteredPOs.length === 0 && (
                <div className="text-center py-12 text-gray-400 font-bold text-xs bg-gray-50/50 rounded-2xl border border-dashed border-gray-150">
                  No purchase orders found matching criteria.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Inspect, invoice file upload, and installments payment trackers (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedPO ? (
              <motion.div 
                key={selectedPO.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6"
              >
                {/* Upper banner section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded w-fit">{selectedPO.id}</span>
                    <h3 className="font-black text-gray-900 text-lg mt-2">{selectedPO.supplierName}</h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">Logged on: {selectedPO.orderDate} | Delivery target: {selectedPO.deliveryDate || "As soon as possible"}</p>
                  </div>

                  {/* Status update switcher */}
                  {selectedPO.status !== "Completed" && (
                    <button 
                      onClick={() => markAsReceived(selectedPO)}
                      className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition tracking-widest uppercase flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Received & Stock Sync
                    </button>
                  )}
                </div>

                {/* Ordered Formulation item rows table */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">Ordered pharmaceutical items</h4>
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-12 gap-2 text-gray-400 font-bold border-b border-gray-200 pb-1 text-[10px]">
                      <span className="col-span-6">ITEM SPEC INDEX</span>
                      <span className="col-span-3 text-center">QTY</span>
                      <span className="col-span-3 text-right">COST/UNIT</span>
                    </div>

                    {selectedPO.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 text-gray-700 font-bold">
                        <span className="col-span-6 text-gray-900 truncate">{item.name}</span>
                        <span className="col-span-3 text-center font-mono">{item.quantity} Units</span>
                        <span className="col-span-3 text-right font-mono">${item.costPrice.toFixed(2)}</span>
                      </div>
                    ))}

                    <div className="border-t border-gray-200 pt-3 space-y-1 text-right text-gray-500 font-bold">
                      <p>Subtotal: ${selectedPO.subtotal.toFixed(2)}</p>
                      <p>Regulatory Tax (5%): ${selectedPO.tax.toFixed(2)}</p>
                      <p className="text-xs font-black text-emerald-800 border-t border-dashed border-gray-200 pt-1.5 mt-1">Invoice Grand Total: ${selectedPO.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Split segment: Upload Invoice File vs Installments Ledger */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left segment: Invoice drag-and-drop / upload preview drawer */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">Associated Invoice document</h4>
                    
                    {selectedPO.invoiceFileName ? (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3.5 flex flex-col justify-between text-xs font-mono font-medium">
                        <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-100/50">
                          <FileText className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-gray-800">{selectedPO.invoiceFileName}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Size: {selectedPO.invoiceFileSize || "N/A"}</p>
                          </div>
                        </div>

                        {/* Simulate clicking invoice bill preview */}
                        <button 
                          onClick={() => alert(`Opening secure sandbox PDF viewer stream for ${selectedPO.invoiceFileName}...`)}
                          className="w-full flex justify-center items-center gap-1.5 py-2.5 bg-white border hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 text-gray-700 rounded-xl font-sans font-bold text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700" /> Preview Invoice
                        </button>
                      </div>
                    ) : (
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            const file = e.dataTransfer.files[0];
                            const fmtSize = file.size > 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
                            triggerInvoiceUploadOnSelected(file.name, fmtSize);
                          }
                        }}
                        className={`p-6 border-2 border-dashed rounded-2xl text-center space-y-2.5 transition-all text-xs flex flex-col items-center justify-center cursor-pointer ${
                          dragActive 
                          ? "border-emerald-700 bg-emerald-50/10" 
                          : "border-gray-200 hover:border-emerald-500/50 hover:bg-gray-50/30"
                        }`}
                        onClick={() => {
                          // Allow quick simulated upload directly
                          const testNum = Math.floor(Math.random() * 800) + 100;
                          triggerInvoiceUploadOnSelected(`pharma_invoice_${testNum}.pdf`, "120 KB");
                        }}
                      >
                        <UploadCloud className="w-6 h-6 text-gray-400 shrink-0" />
                        <div>
                          <p className="font-bold text-gray-700">Click to upload invoice PDF</p>
                          <p className="text-[10px] text-gray-400 mt-1">Or drag and drop files here (Simulated)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right segment: Record payment / Installments ledger tracking */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">Settlement payments history</h4>
                    
                    <div className="space-y-3 font-mono text-xs">
                      {selectedPO.paymentHistory.length > 0 ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 space-y-2 max-h-[140px] overflow-y-auto">
                          {selectedPO.paymentHistory.map((trStatus, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] text-gray-600 border-b border-gray-200/50 pb-1 mt-1 font-bold">
                              <div>
                                <p className="text-gray-800">{trStatus.method}</p>
                                <p className="text-[9px] text-gray-400 mt-0.5">Date: {trStatus.date}</p>
                              </div>
                              <span className="text-emerald-800 font-mono">+${trStatus.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 border border-transparent rounded-2xl text-center text-gray-400 font-bold">
                          No registered payments logged.
                        </div>
                      )}

                      {/* Cash installment form entry drawer */}
                      {selectedPO.paymentStatus !== "Paid" && (
                        <form onSubmit={handleRecordPayment} className="space-y-2 font-sans">
                          <div className="flex gap-2.5">
                            <input 
                              type="number" 
                              required
                              step="0.01"
                              placeholder="Amount ($)..."
                              value={trialPaymentAmount}
                              onChange={e => setTrialPaymentAmount(e.target.value)}
                              className="w-1/2 p-2 px-2.5 text-xs border border-gray-200 bg-white rounded-xl focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                            />
                            <select
                              value={trialPaymentMethod}
                              onChange={e => setTrialPaymentMethod(e.target.value)}
                              className="w-1/2 p-2 border border-gray-200 bg-white rounded-xl text-xs font-bold outline-none cursor-pointer"
                            >
                              <option value="Bank Transfer">Bank Wire</option>
                              <option value="Credit Card">Credit Card</option>
                              <option value="Cash Drawer">Cash Drawer</option>
                            </select>
                          </div>
                          <button 
                            type="submit"
                            className="w-full text-xs font-bold bg-slate-900 text-slate-100 hover:bg-slate-800 py-2.5 rounded-xl transition active:scale-95 text-center"
                          >
                            Add Settlement Payment
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            ) : (
              <div className="bg-white p-12 text-center rounded-3xl text-gray-400 border border-gray-100">
                <p className="font-bold">Please select or register a purchase order from directory listings.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 4. MODAL DRAWER FOR RECORDING NEW PURCHASE ORDER */}
      <AnimatePresence>
        {isNewPOOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsNewPOOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10"
            >
              <form onSubmit={handleCreatePurchaseOrder} className="space-y-5">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-3.5 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-black text-gray-800">Draft Purchase Requisition Order</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Define pharmaceutical bulk order specifications for dispatching to wholesale manufacturers.</p>
                  </div>
                  <button type="button" onClick={() => setIsNewPOOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 text-xl leading-none">&times;</button>
                </div>

                {/* Form Elements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Supplier Drops */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Supplier Manufacturer *</label>
                    <select
                      value={supplierName}
                      onChange={e => setSupplierName(e.target.value)}
                      className="w-full text-xs p-3 border border-gray-250 bg-white rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer font-bold"
                    >
                      {PRESETS_SUPPLIERS.map(sup => (
                        <option key={sup} value={sup}>{sup}</option>
                      ))}
                    </select>
                  </div>

                  {/* Order Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Order Date *</label>
                    <input 
                      type="date" 
                      required
                      value={orderDate}
                      onChange={e => setOrderDate(e.target.value)}
                      className="w-full text-xs p-3 border border-gray-250 rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 font-bold"
                    />
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Target Date of Delivery</label>
                    <input 
                      type="date" 
                      value={deliveryDate}
                      onChange={e => setDeliveryDate(e.target.value)}
                      className="w-full text-xs p-3 border border-gray-250 rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 font-bold"
                    />
                  </div>

                  {/* Comments / Notes */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Purchase Requisition Notes</label>
                    <textarea 
                      placeholder="e.g. Replenishment stocks for upcoming autumn flu trends..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full text-xs p-3 border border-gray-250 rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 min-h-[52px]"
                    />
                  </div>
                </div>

                {/* Dynamic Item Adders Section */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-[11px] text-gray-500 uppercase tracking-widest">Requisition formulation items</h4>
                    <button 
                      type="button" 
                      onClick={addFormLineItem}
                      className="text-[10px] text-emerald-800 font-black hover:underline flex items-center gap-1.5 uppercase"
                    >
                      <Plus className="w-3.5 h-3.5" /> Append item row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                    {poItems.map((item, index) => (
                      <div key={index} className="flex gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 items-center justify-between">
                        
                        {/* Medicine selector */}
                        <div className="flex-1">
                          <input 
                            type="text"
                            required
                            placeholder="Medicine formulation name..."
                            value={item.name}
                            onChange={e => updateFormLineField(index, "name", e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold select-all"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="w-1/4">
                          <input 
                            type="number"
                            required
                            min="1"
                            placeholder="Qty..."
                            value={item.quantity}
                            onChange={e => updateFormLineField(index, "quantity", parseInt(e.target.value) || 0)}
                            className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg outline-none text-center font-bold"
                          />
                        </div>

                        {/* Cost Price */}
                        <div className="w-1/4">
                          <input 
                            type="number"
                            required
                            step="0.01"
                            min="0.1"
                            placeholder="Cost ($)..."
                            value={item.costPrice}
                            onChange={e => updateFormLineField(index, "costPrice", parseFloat(e.target.value) || 0)}
                            className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg outline-none text-right font-bold"
                          />
                        </div>

                        {/* Delete row */}
                        <button 
                          type="button" 
                          disabled={poItems.length === 1}
                          onClick={() => removeFormLineItem(index)}
                          className="text-gray-405 hover:text-red-500 transition-colors p-1 disabled:opacity-30"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Multi-upload invoice simulator area inside purchase creation form */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-gray-450 uppercase">Pre-Upload Manufacturer's Invoice bill attachment</label>
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
                      
                      {uploadedFile ? (
                        <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100">
                          <FileText className="w-4 h-4 text-emerald-750" />
                          <span className="font-bold truncate max-w-[190px]">{uploadedFile.name} ({uploadedFile.size})</span>
                          <Check className="w-4 h-4 text-emerald-750" />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud className="w-5 h-5 text-gray-400 mx-auto" />
                          <p className="text-[11px] font-bold text-gray-700">Click to attach invoice document or drag here</p>
                          <p className="text-[9px] text-gray-400">Supports PDF, PNG, JPG (Simulated)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* running total summaries */}
                  <div className="flex justify-between items-center text-xs font-bold pt-3 border-t border-gray-105 border-dashed font-mono">
                    <span className="text-gray-400 uppercase font-sans text-[10px]">Estimated Invoice totals</span>
                    <div className="text-right">
                      <p className="text-gray-500">Subtotal: ${formSubtotal.toFixed(2)}</p>
                      <p className="text-gray-500">VAT (5%): ${formTax.toFixed(2)}</p>
                      <p className="text-emerald-800 text-sm font-black mt-0.5 border-t border-gray-100 pt-1">Estimated Grand Total: ${formTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Footer buttons actions */}
                <div className="flex justify-end gap-3.5 pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => setIsNewPOOpen(false)}
                    className="text-xs font-bold text-gray-500 hover:bg-gray-100 py-3 px-5 rounded-xl transition"
                  >
                    Discard draft
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-slate-100 py-3 px-6 rounded-xl shadow-xs transition active:scale-95"
                  >
                    Authorize Requisition Order
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
