import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Plus, Minus, Trash2, QrCode, Receipt, CreditCard, DollarSign, 
  Smartphone, Printer, Save, RotateCcw, Wifi, WifiOff, RefreshCw, Sparkles, 
  User, Phone, ShoppingCart, HelpCircle, AlertCircle, CheckCircle2, X
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
  image?: string;
}

interface CartItem extends Medicine {
  quantity: number;
  itemDiscount: number; // Percentage discount for this item
}

interface SalesInterfaceProps {
  inventory: Medicine[];
  setInventory: (inv: Medicine[]) => void;
  orders?: any[];
  setOrders?: (orders: any[]) => void;
}

// Predefined loyalty customer database for easy selection
const VIP_CUSTOMERS = [
  { name: "Sarah Connor", phone: "+1 555-0199", points: 280 },
  { name: "Marcus Wright", phone: "+1 555-0120", points: 150 },
  { name: "John Connor", phone: "+1 555-0145", points: 420 }
];

export function SalesInterface({ inventory, setInventory, orders = [], setOrders }: SalesInterfaceProps) {
  // POS Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', points: 0 });
  const [globalDiscount, setGlobalDiscount] = useState<number>(0); // Global percent discount
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Digital">("Cash");
  const [cashAmountPaid, setCashAmountPaid] = useState<string>("");
  
  // Searching & Filter inputs
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Status simulation fields
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState("");

  // Modals state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [invoiceForReceipt, setInvoiceForReceipt] = useState<any>(null);

  // Refund workflow state
  const [refundInvoiceId, setRefundInvoiceId] = useState("");
  const [refundMessage, setRefundMessage] = useState("");

  // Shortcut key listener setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser defaults for functional shortcuts
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F2") {
        e.preventDefault();
        triggerMockBarcodeScan();
      } else if (e.key === "F4") {
        e.preventDefault();
        // Switch payment methods
        setPaymentMethod(prev => prev === "Cash" ? "Card" : prev === "Card" ? "Digital" : "Cash");
      } else if (e.key === "F8") {
        e.preventDefault();
        handleSaveSale();
      } else if (e.key === "Escape") {
        e.preventDefault();
        clearCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, customer, globalDiscount, paymentMethod, inventory]);

  // Quick simulate direct UPC barcode scan matching
  const triggerMockBarcodeScan = () => {
    if (inventory.length === 0) return;
    const itemWithBarcode = inventory.find(i => i.barcode) || inventory[0];
    if (itemWithBarcode) {
      setCheckoutNotice(`Barcode Scanned: "${itemWithBarcode.barcode}"`);
      addToCart(itemWithBarcode);
      setTimeout(() => setCheckoutNotice(""), 3000);
    }
  };

  // Add item to cart
  const addToCart = (med: Medicine) => {
    // Expiry check - Auto block expired medicines from sales
    if (med.expiryDate) {
      const isExpired = new Date(med.expiryDate).getTime() < Date.now();
      if (isExpired) {
        alert(`REGULATORY EXPERT SYSTEM BLOCK: "${med.name}" expired on ${med.expiryDate}. Expired medicines are auto-blocked from POS sales under strict safety regulations.`);
        return;
      }
    }

    if (med.stock <= 0) {
      alert(`Warning: ${med.name} is currently out of stock. Cannot sell!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        if (existing.quantity >= med.stock) {
          alert(`Warning: Only ${med.stock} units are in stock. Cannot add more.`);
          return prev;
        }
        return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...med, quantity: 1, itemDiscount: 0 }];
    });
  };

  // Change specific cart quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        const currentStock = inventory.find(i => i.id === id)?.stock || 100;
        if (nextQty > currentStock) {
          alert(`Insufficient inventory. Max stock is ${currentStock}.`);
          return item;
        }
        if (nextQty <= 0) return null; // Trigger automatic removal
        return { ...item, quantity: nextQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  // Set line item discount
  const updateItemDiscount = (id: string, discount: number) => {
    const val = Math.min(100, Math.max(0, discount));
    setCart(prev => prev.map(item => item.id === id ? { ...item, itemDiscount: val } : item));
  };

  // Remove single line item
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Clear entire cart configuration
  const clearCart = () => {
    setCart([]);
    setCustomer({ name: '', phone: '', points: 0 });
    setGlobalDiscount(0);
    setCashAmountPaid("");
  };

  // Math totals calculation
  const subtotal = cart.reduce((sum, item) => {
    // apply line item discounts first
    const linePrice = item.price * (1 - item.itemDiscount / 100);
    return sum + (linePrice * item.quantity);
  }, 0);

  // Global medicine VAT/tax is typically 5% for prescription SaaS systems
  const taxRate = 0.05; 
  const taxAmount = subtotal * taxRate;
  
  // Deduct global discount
  const discountAmount = subtotal * (globalDiscount / 100);
  const totalAmountDue = Math.max(0, subtotal + taxAmount - discountAmount);

  // Fast offline status sync generator simulation
  const handleOfflineSync = () => {
    if (pendingSyncCount === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setPendingSyncCount(0);
      setIsSyncing(false);
      setCheckoutNotice("All pending offline transactions synchronized with cloud cloud ERP successfully!");
      setTimeout(() => setCheckoutNotice(""), 3000);
    }, 1800);
  };

  // Save Sale Logic
  const handleSaveSale = () => {
    if (cart.length === 0) {
      alert("Billing warning: Cart is currently empty. Please select medicines first.");
      return;
    }

    // Capture receipt details prior to inventory decrement
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
    const timestamp = new Date().toLocaleString();
    
    // Auto-decrement inventory stock elements
    const updatedInventory = inventory.map(item => {
      const sold = cart.find(c => c.id === item.id);
      if (sold) {
        return { ...item, stock: Math.max(0, item.stock - sold.quantity) };
      }
      return item;
    });

    setInventory(updatedInventory);

    // If POS is simulated as offline, store transaction in sync queue
    if (isOffline) {
      setPendingSyncCount(prev => prev + 1);
    }

    const payloadReceipt = {
      invoiceId: invoiceNumber,
      time: timestamp,
      items: [...cart],
      discount: globalDiscount,
      total: totalAmountDue,
      tax: taxAmount,
      subtotal: subtotal,
      paymentMethod: paymentMethod,
      customerName: customer.name || "Walk-in Customer",
      customerPhone: customer.phone || "N/A"
    };

    setInvoiceForReceipt(payloadReceipt);
    setShowInvoiceModal(true);

    // Create a real orders log, tracking profit margins dynamically
    const newSalesRecord = {
      id: invoiceNumber,
      customer: customer.name || "Walk-in Customer",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: `$${totalAmountDue.toFixed(2)}`,
      status: "Completed" as const,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        purchasePrice: item.purchasePrice,
        quantity: item.quantity
      }))
    };

    if (setOrders) {
      setOrders([newSalesRecord, ...orders]);
    }
    
    // Clear checkouts
    setCart([]);
    setCustomer({ name: '', phone: '', points: 0 });
    setGlobalDiscount(0);
    setCashAmountPaid("");
  };

  // Handle process simulated Refund operations
  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundInvoiceId.trim()) return;

    // Simulate looking up invoice & performing refund back to stock
    setRefundMessage("Searching system archives...");
    setTimeout(() => {
      const targetOrder = orders.find(o => o.id === refundInvoiceId);
      if (!targetOrder) {
        setRefundMessage(`ERROR: Invoice ID "${refundInvoiceId}" not found in this tenant's billing registry.`);
        return;
      }

      if (targetOrder.status === 'Refunded') {
        setRefundMessage(`INFO: Invoice "${refundInvoiceId}" has already been refunded.`);
        return;
      }

      // Restock returned items back into stock
      let restockedNotes = "";
      const updatedInventory = inventory.map(med => {
        const soldItem = targetOrder.items?.find((item: any) => item.id === med.id);
        if (soldItem) {
          const qty = soldItem.quantity || 1;
          restockedNotes += `[${qty}x ${med.name}] `;
          return { ...med, stock: med.stock + qty };
        }
        return med;
      });

      setInventory(updatedInventory);

      // Mutate order state to Refunded
      if (setOrders) {
        setOrders(orders.map(o => o.id === refundInvoiceId ? { ...o, status: "Refunded" as const } : o));
      }

      setRefundMessage(`SUCCESS! Void invoice "${refundInvoiceId}" completed. Restored returned medicines back to stock: ${restockedNotes || "items"}`);
    }, 1200);
  };

  // Select customer from loyalty list
  const selectLoyaltyCustomer = (cust: any) => {
    setCustomer({ name: cust.name, phone: cust.phone, points: cust.points });
  };

  // Standard filter medicines by statequery
  const filteredProducts = inventory.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.genericName && item.genericName.toLowerCase().includes(query)) ||
      (item.barcode && item.barcode.includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 max-w-7xl mx-auto px-1"
    >
      
      {/* 1. Sync & Shortcut Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 px-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-md font-extrabold text-gray-800">Fast POS Checkout Interface</h2>
            <p className="text-xs text-gray-400">Perform super-fast medicine scans, invoices, and direct cash drawers.</p>
          </div>
        </div>

        {/* Offline Toggle status + Manual synchronizer */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {isOffline ? (
            <span className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-800 border border-amber-100 font-bold px-3 py-1.5 rounded-xl">
              <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-600" /> Offline Checkout mode
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-3 py-1.5 rounded-xl">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" /> Cloud Sync Active
            </span>
          )}

          {pendingSyncCount > 0 && (
            <button 
              onClick={handleOfflineSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-indigo-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl hover:bg-indigo-800 transition active:scale-95 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : `Sync ${pendingSyncCount} Sales`}</span>
            </button>
          )}

          <button 
            onClick={() => setIsOffline(!isOffline)}
            className="text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 py-1.5 px-3 rounded-xl border border-gray-100"
          >
            Toggle Network
          </button>
        </div>
      </div>

      {checkoutNotice && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{checkoutNotice}</span>
        </div>
      )}

      {/* 2. Main POS Columns Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDE: Catalog, scanner simulate & fast search (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider">Search & Select Catalog</h3>
              <p className="text-xs text-gray-400 font-medium">Click on any formulation to append to standard checkout</p>
            </div>

            {/* Product search + quick barcode simulator triggers */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  ref={searchInputRef}
                  placeholder="Type name, generic structure, or scan (F1)..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-none text-sm transition font-medium" 
                />
              </div>

              {/* Barcode scanner action button */}
              <button 
                onClick={triggerMockBarcodeScan}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-2xl hover:brightness-110 transition shadow-xs"
                title="Simulate rapid barcode hardware scanner swipe (F2)"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulate Swipe (F2)</span>
              </button>
            </div>

            {/* List of active matches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {filteredProducts.map(med => {
                const isInCart = cart.find(c => c.id === med.id);
                const isLowStock = med.stock <= 10;
                
                return (
                  <div 
                    key={med.id}
                    onClick={() => addToCart(med)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between space-y-3 relative group overflow-hidden ${
                      med.stock === 0 
                      ? 'bg-gray-50 opacity-60 border-gray-100 cursor-not-allowed'
                      : isInCart
                      ? 'border-emerald-600 bg-emerald-50/20'
                      : 'border-gray-100 bg-white hover:border-emerald-700/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">CODE: {med.barcode || "N/A"}</span>
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          med.stock === 0 ? "bg-rose-500" : isLowStock ? "bg-amber-400 animate-pulse" : "bg-emerald-500"
                        }`} />
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm mt-1 leading-tight group-hover:text-emerald-800 transition">{med.name}</h4>
                      {med.genericName && (
                        <p className="text-[11px] text-gray-400 italic font-mono mt-0.5 line-clamp-1">{med.genericName}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-50 pt-2 text-xs">
                      <div>
                        <p className="text-gray-400">Stock Qty</p>
                        <p className={`font-mono font-bold ${med.stock === 0 ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-gray-700'}`}>
                          {med.stock <= 0 ? "Out of Stock" : `${med.stock} Units`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400">Retail Unit</p>
                        <p className="font-extrabold text-emerald-800">${med.price.toFixed(2)}</p>
                      </div>
                    </div>

                    {isInCart && (
                      <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-bl-xl">
                        {isInCart.quantity} in cart
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-10">
                  <p className="text-xs text-gray-400 font-bold">No registered formulation matches found in indexed database.</p>
                </div>
              )}
            </div>

            {/* Quick Membership Picker */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-2.5">
              <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Quick Loyalty Rewards Selection
              </p>
              <div className="flex flex-wrap gap-2">
                {VIP_CUSTOMERS.map(cust => (
                  <button
                    key={cust.name}
                    onClick={() => selectLoyaltyCustomer(cust)}
                    className={`text-xs font-semibold px-3 py-2 rounded-xl border transition ${
                      customer.phone === cust.phone 
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200"
                    }`}
                  >
                    {cust.name} ({cust.points} pts)
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE: Cart, discounts, tax & Checkout (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 min-h-[580px]">
            
            {/* Customer Information inputs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider">Active Cart Details</h3>
                <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-bold font-mono">
                  {cart.length} unique lines
                </span>
              </div>

              {/* Patient Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Customer Name</label>
                  <input 
                    type="text" 
                    placeholder="Regular Walk-in"
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Phone</label>
                  <input 
                    type="text" 
                    placeholder="None"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Cart list items */}
            <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[280px] pr-1 scrollbar">
              {cart.map(item => {
                const lineTotal = (item.price * (1 - item.itemDiscount / 100)) * item.quantity;
                
                return (
                  <div key={item.id} className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">${item.price.toFixed(2)}/unit</p>
                    </div>

                    {/* Quantity Selector buttons */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Inline line-item discount inputs */}
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={item.itemDiscount || ""}
                        onChange={e => updateItemDiscount(item.id, parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-10 text-center p-1 bg-white border border-gray-200 rounded text-[11px] font-bold focus:ring-1 focus:ring-emerald-700 select-all outline-none"
                      />
                      <span className="text-[10px] font-bold text-gray-400">% off</span>
                    </div>

                    {/* Line total result */}
                    <div className="text-right min-w-[62px]">
                      <span className="font-extrabold text-gray-800 font-mono">${lineTotal.toFixed(2)}</span>
                    </div>

                    {/* Delete Line */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete line item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {cart.length === 0 && (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <div className="w-10 h-10 bg-gray-50 border rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-600">Basket is empty</p>
                  <p className="text-[10px] text-gray-400">Add medicines from the directory to start checkout processing</p>
                </div>
              )}
            </div>

            {/* Calculations & payment panel */}
            <div className="border-t border-gray-100 pt-4 space-y-4">
              
              {/* Grand discount adjustments Input */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-gray-500">Global Campaign Discount</span>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-xl border border-gray-100">
                  <input 
                    type="number"
                    min="0"
                    placeholder="0"
                    value={globalDiscount || ""}
                    onChange={e => setGlobalDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-12 text-center bg-transparent border-none font-black text-emerald-800 text-xs outline-none select-all" 
                  />
                  <span className="text-xs font-bold text-gray-400">%</span>
                </div>
              </div>

              {/* Exact invoice values split summary */}
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100/30 text-xs font-semibold space-y-2 font-mono text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Healthcare Tax (5%):</span>
                  <span>+${taxAmount.toFixed(2)}</span>
                </div>
                {globalDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Global Discount ({globalDiscount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-800 border-t border-gray-100 pt-2 font-bold text-sm">
                  <span>Grand Total Due:</span>
                  <span className="text-emerald-800">${totalAmountDue.toFixed(2)}</span>
                </div>
              </div>

              {/* Quick Select payment method fields */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Invoice Settlement Method</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPaymentMethod("Cash")}
                    className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === "Cash"
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200"
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" /> Cash
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("Card")}
                    className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === "Card"
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> POS Card
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("Digital")}
                    className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === "Digital"
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile UPI
                  </button>
                </div>
              </div>

              {/* Cash Paid input drawer to calculate return tender balance change */}
              {paymentMethod === "Cash" && (
                <div className="flex gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800">Cash Received ($) :</span>
                  <input 
                    type="text" 
                    placeholder="Enter amount..."
                    value={cashAmountPaid}
                    onChange={e => setCashAmountPaid(e.target.value)}
                    className="w-28 p-1 px-2 border border-emerald-300 bg-white rounded-lg text-right font-mono font-bold text-sm outline-none" 
                  />
                  {parseFloat(cashAmountPaid) >= totalAmountDue && (
                    <span className="font-bold text-[10px] bg-emerald-100 p-1 rounded font-mono text-emerald-800">
                      Change: ${(parseFloat(cashAmountPaid) - totalAmountDue).toFixed(2)}
                    </span>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* 3. Operational Footer with Printer, Refund triggers */}
      <div className="bg-slate-900 text-slate-300 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 shadow-md">
        
        {/* Keyboard legend list */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Active Cashier Keyboard Shortcuts Legend
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-300 font-mono">
            <span className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50"><kbd className="font-bold text-emerald-400 font-sans">[F1]</kbd> Search box</span>
            <span className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50"><kbd className="font-bold text-emerald-400 font-sans">[F2]</kbd> Mock Scan</span>
            <span className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50"><kbd className="font-bold text-emerald-400 font-sans">[F4]</kbd> Payment Method</span>
            <span className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50"><kbd className="font-bold text-emerald-400 font-sans">[F8]</kbd> Checkout Invoice</span>
            <span className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50"><kbd className="font-bold text-emerald-400 font-sans">[ESC]</kbd> Void cart</span>
          </div>
        </div>

        {/* Major execution action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Refund drawer opener */}
          <button 
            onClick={() => {
              setRefundInvoiceId("");
              setRefundMessage("");
              setShowRefundModal(true);
            }}
            className="flex items-center justify-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-3.5 rounded-2xl transition border border-slate-700 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Process Refund Receipt</span>
          </button>

          {/* Quick Clear Basket */}
          <button 
            onClick={clearCart}
            className="flex items-center justify-center gap-2 text-xs bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-400 font-bold px-4 py-3.5 rounded-2xl transition active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Void Order</span>
          </button>

          {/* Finalize sales and register print queue */}
          <button 
            onClick={handleSaveSale}
            className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs px-8 py-3.5 rounded-2xl shadow-md transition active:scale-95 tracking-wide"
          >
            <Save className="w-4 h-4" />
            <span>Print & Checkout (F8)</span>
          </button>

        </div>
      </div>

      {/* 4. MOCK THERMAL INVOICE MODAL */}
      <AnimatePresence>
        {showInvoiceModal && invoiceForReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowInvoiceModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" 
            />

            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white p-6 rounded-3xl max-w-sm w-full relative z-10 shadow-xl border border-gray-100 flex flex-col items-center"
            >
              {/* Thermal Printer narrow layout mockup style! */}
              <div className="w-full text-center border-b-2 border-dashed border-gray-200 pb-4">
                <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-full w-fit mx-auto mb-2">
                  <Receipt className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-gray-800 tracking-wider font-mono">ENTERPRISE SAAS PHARMA</h4>
                <p className="text-[10px] text-gray-500 font-mono">100 Oracle Plaza Medical Wing, NY 10001</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">Phone: +1 555-9000-01</p>
              </div>

              {/* Invoice identifier metadata fields */}
              <div className="w-full py-4 text-[10px] font-mono text-gray-600 space-y-1 border-b border-dashed border-gray-100">
                <div className="flex justify-between">
                  <span>INVOICE:</span>
                  <span className="font-bold text-gray-800">{invoiceForReceipt.invoiceId}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE/TIME:</span>
                  <span>{invoiceForReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUST:</span>
                  <span className="font-bold">{invoiceForReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>METHOD:</span>
                  <span className="font-bold">{invoiceForReceipt.paymentMethod}</span>
                </div>
              </div>

              {/* Receipt products lines list (thermal width representation) */}
              <div className="w-full py-4 border-b border-dashed border-gray-100 text-[11px] font-mono text-gray-700 space-y-2">
                <div className="flex justify-between font-bold border-b border-gray-50 pb-1 text-gray-400 text-[10px]">
                  <span>ITEM DESCRIPTION</span>
                  <span className="text-right">QTY * PRICE</span>
                </div>
                {invoiceForReceipt.items.map((it: any) => (
                  <div key={it.id} className="flex justify-between">
                    <span className="font-bold truncate max-w-[190px]">{it.name}</span>
                    <span className="text-right">{it.quantity} x ${it.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals table elements */}
              <div className="w-full py-3 text-xs font-mono text-gray-800 space-y-1 pb-4">
                <div className="flex justify-between text-[11px]">
                  <span>Subtotal:</span>
                  <span>${invoiceForReceipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Taxes (5%):</span>
                  <span>+${invoiceForReceipt.tax.toFixed(2)}</span>
                </div>
                {invoiceForReceipt.discount > 0 && (
                  <div className="flex justify-between text-rose-600 text-[11px] font-bold">
                    <span>Campaign Discount:</span>
                    <span>-${(invoiceForReceipt.subtotal * invoiceForReceipt.discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-gray-900 text-sm border-t border-dashed border-gray-200 pt-2 font-mono">
                  <span>PAID GRAND TOTAL:</span>
                  <span className="text-emerald-800">${invoiceForReceipt.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Thermal narrow stylized mockup barcode bar at bottom */}
              <div className="flex flex-col items-center justify-center pt-2 space-y-1.5 w-full">
                <div className="flex items-end h-8 gap-[1px] justify-center opacity-70 w-full bg-slate-50 rounded p-1.5 border border-slate-100">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-gray-800 w-[2px]" 
                      style={{ height: i % 3 === 0 ? "100%" : i % 5 === 0 ? "80%" : "90%" }} 
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-gray-400 tracking-widest">{invoiceForReceipt.invoiceId}</span>
              </div>

              <div className="w-full flex gap-2.5 mt-6 font-semibold">
                <button 
                  onClick={() => {
                    alert("Simulation trigger: Thermal printer spool packet successfully transmitted via standard hardware port 9100! (ESC/POS command sent)");
                    setShowInvoiceModal(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl text-xs"
                >
                  <Printer className="w-4 h-4" /> Spool Print
                </button>
                <button 
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs text-center"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PROCESS REFUND MODAL DRAWER */}
      <AnimatePresence>
        {showRefundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowRefundModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" 
            />

            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="bg-white p-6 rounded-3xl max-w-md w-full relative z-10 shadow-xl border border-gray-100 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-800" />
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Process Receipt Refund</h4>
                </div>
                <button onClick={() => setShowRefundModal(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1">&times;</button>
              </div>

              <form onSubmit={handleProcessRefund} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Enter Original Invoice Number *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. INV-2026-8804" 
                    value={refundInvoiceId}
                    onChange={e => setRefundInvoiceId(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-250 bg-gray-50/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none uppercase font-mono"
                  />
                </div>

                {refundMessage && (
                  <div className="p-3.5 rounded-xl text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium">
                    {refundMessage}
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowRefundModal(false)}
                    className="text-xs font-bold text-gray-500 hover:bg-gray-100 p-2.5 px-4 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white p-2.5 px-5 rounded-xl shadow-xs transition"
                  >
                    Verify & Refund Invoice
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
