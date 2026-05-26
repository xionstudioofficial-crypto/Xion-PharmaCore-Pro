import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Edit2, Filter, ChevronDown, Check, AlertTriangle, 
  Package, Calendar, HelpCircle, ArrowUpDown, User, RefreshCw, Layers, Sparkles
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
  supplier?: string; // Optional supplier field
}

interface InventoryPageProps {
  inventory: Medicine[];
  setInventory: (inv: Medicine[]) => void;
}

// Predefined list of mock pharmaceutical wholesale suppliers for SaaS demonstration
const PRESETS_SUPPLIERS = [
  "GlaxoSmithKline Wholesale",
  "PharmaDist Corp",
  "BioPharma Solutions",
  "MedSource Logistics",
  "GenericMed Distributors"
];

const CATEGORIES = [
  "Analgesics / Pain Relief",
  "Antibiotics",
  "Antihistamines",
  "Cardiovascular",
  "Respiratory",
  "Vitamins / Supplements",
  "Gastrointestinal",
  "Others"
];

export function InventoryPage({ inventory, setInventory }: InventoryPageProps) {
  // Advanced filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSupplier, setSelectedSupplier] = useState("All");
  const [stockStatusFilter, setStockStatusFilter] = useState("All"); // All, Healthy, Low, Critical
  
  // Sort state
  const [sortBy, setSortBy] = useState<"name" | "stock" | "expiry">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Inline Quick Stock Adjustment state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);

  // Assign suppliers dynamically if none is set, to keep data pristine
  const getSupplierForItem = (med: Medicine) => {
    if (med.supplier) return med.supplier;
    // Stable pseudo-random assignment based on ID for visual consistency
    const idx = parseInt(med.id) % PRESETS_SUPPLIERS.length;
    return PRESETS_SUPPLIERS[idx] || PRESETS_SUPPLIERS[0];
  };

  // KPI Calculations
  const totalStockUnits = inventory.reduce((total, med) => total + med.stock, 0);
  
  const lowStockItems = inventory.filter(med => med.stock > 0 && med.stock <= 10).length;
  const outOfStockItems = inventory.filter(med => med.stock === 0).length;

  // Let's count items expiring soon (e.g., within 2026/2027 or within next 180 days)
  const expiringSoonCount = inventory.filter(med => {
    if (!med.expiryDate) return false;
    const expDate = new Date(med.expiryDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 180; // Expiring in next ~6 months
  }).length;

  // Stock status helper
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Critical", color: "text-red-600 bg-red-100/80 border-red-200" };
    if (stock <= 10) return { label: "Low", color: "text-amber-600 bg-amber-100/80 border-amber-200" };
    return { label: "Healthy", color: "text-emerald-700 bg-emerald-100/80 border-emerald-200" };
  };

  // Toggle sort order
  const handleSort = (field: "name" | "stock" | "expiry") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Modify stock directly from index line item
  const handleUpdateStock = (id: string) => {
    setInventory(
      inventory.map(med => {
        if (med.id === id) {
          const updatedStock = Math.max(0, med.stock + adjustmentValue);
          return { ...med, stock: updatedStock };
        }
        return med;
      })
    );
    setEditingStockId(null);
    setAdjustmentValue(0);
  };

  // Filter application
  const filteredInventory = inventory.filter(med => {
    const medSupplier = getSupplierForItem(med);
    
    // Text search matching Name, Generic Name, Batch, Supplier or Barcode
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.genericName && med.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.batchNumber && med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      medSupplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    const matchesSupplier = selectedSupplier === "All" || medSupplier === selectedSupplier;

    let matchesStock = true;
    if (stockStatusFilter === "Healthy") {
      matchesStock = med.stock > 10;
    } else if (stockStatusFilter === "Low") {
      matchesStock = med.stock > 0 && med.stock <= 10;
    } else if (stockStatusFilter === "Critical") {
      matchesStock = med.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesSupplier && matchesStock;
  });

  // Sorting application
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let result = 0;
    if (sortBy === "name") {
      result = a.name.localeCompare(b.name);
    } else if (sortBy === "stock") {
      result = a.stock - b.stock;
    } else if (sortBy === "expiry") {
      const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : 0;
      const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : 0;
      result = dateA - dateB;
    }
    return sortOrder === "asc" ? result : -result;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 max-w-7xl mx-auto px-1"
    >
      {/* 1. Dashboard KPI Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock Units */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform premium-card">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">Total Stock Units</span>
            <p className="text-3xl font-black text-gray-800">{totalStockUnits}</p>
            <p className="text-xs text-emerald-700 font-semibold">{inventory.length} active formulations</p>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform premium-card">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">Low Stock Items</span>
            <p className="text-3xl font-black text-amber-600">{lowStockItems}</p>
            <p className="text-xs text-gray-500 font-medium">Stock levels &le; 10 units</p>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Out of Stock (Critical) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform premium-card">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">Out of Stock</span>
            <p className="text-3xl font-black text-rose-600">{outOfStockItems}</p>
            <p className="text-xs text-rose-700 font-semibold">Immediate action needed</p>
          </div>
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Expiring Soon Items */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform premium-card">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">Expiring Soon</span>
            <p className="text-3xl font-black text-sky-700">{expiringSoonCount}</p>
            <p className="text-xs text-gray-500 font-medium">Expiring within 6 months</p>
          </div>
          <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Advanced Search & Double-Filtering Ribbon */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          
          {/* Main search input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by name, generic description, batch registration, or wholesale distributor..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-700 focus:bg-white outline-none text-sm transition font-medium" 
            />
          </div>

          {/* Quick-select filter dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Category selection */}
            <div className="flex items-center gap-2 border border-gray-100 bg-gray-50 rounded-2xl px-3 py-2.5">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Tags:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs text-gray-700 font-bold focus:outline-none w-full cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Supplier filtering preset */}
            <div className="flex items-center gap-2 border border-gray-100 bg-gray-50 rounded-2xl px-3 py-2.5">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Supplier:</span>
              <select
                value={selectedSupplier}
                onChange={e => setSelectedSupplier(e.target.value)}
                className="bg-transparent text-xs text-gray-700 font-bold focus:outline-none w-full cursor-pointer"
              >
                <option value="All">All Suppliers</option>
                {PRESETS_SUPPLIERS.map(sup => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </div>

            {/* Stock Level selection */}
            <div className="flex items-center gap-2 border border-gray-100 bg-gray-50 rounded-2xl px-3 py-2.5">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Status:</span>
              <select
                value={stockStatusFilter}
                onChange={e => setStockStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-gray-700 font-bold focus:outline-none w-full cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Healthy">Healthy (&gt;10)</option>
                <option value="Low">Low (&le;10)</option>
                <option value="Critical">Critical (0)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Clear active filters label indicators */}
        {(selectedCategory !== "All" || selectedSupplier !== "All" || stockStatusFilter !== "All" || searchTerm) && (
          <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-500 font-extrabold uppercase tracking-wider">Active Filters:</span>
            {selectedCategory !== "All" && (
              <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl border border-emerald-100/50 flex items-center gap-2">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="hover:text-red-500 font-bold">×</button>
              </span>
            )}
            {selectedSupplier !== "All" && (
              <span className="bg-indigo-50 text-indigo-800 font-bold px-3 py-1 rounded-xl border border-indigo-100/50 flex items-center gap-2">
                Wholesaler: {selectedSupplier}
                <button onClick={() => setSelectedSupplier("All")} className="hover:text-red-500 font-bold">×</button>
              </span>
            )}
            {stockStatusFilter !== "All" && (
              <span className="bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-xl border border-amber-100 flex items-center gap-2">
                Stock: {stockStatusFilter}
                <button onClick={() => setStockStatusFilter("All")} className="hover:text-red-500 font-bold">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-xl border border-slate-200 flex items-center gap-2">
                Keyword: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="hover:text-red-500 font-bold">×</button>
              </span>
            )}
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedSupplier("All");
                setStockStatusFilter("All");
              }}
              className="text-emerald-700 font-black hover:underline ml-auto"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* 3. Real Inventory Table with Stock indicators & Batch Tracking columns */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden whitespace-nowrap">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100/50 transition-colors" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    Medicine/Formulation <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Wholesale Supplier</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100/50 transition-colors" onClick={() => handleSort("expiry")}>
                  <div className="flex items-center gap-1">
                    Batch & Expiry <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100/50 transition-colors text-center" onClick={() => handleSort("stock")}>
                  <div className="flex items-center gap-1 justify-center">
                    Stock Quantity <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center">Stock Indicator</th>
                <th className="px-6 py-4 text-right">Quick Stock action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              <AnimatePresence mode="popLayout">
                {sortedInventory.map(med => {
                  const supplier = getSupplierForItem(med);
                  const statusInfo = getStockStatus(med.stock);
                  const isEditingNow = editingStockId === med.id;

                  return (
                    <motion.tr 
                      layout 
                      key={med.id} 
                      className="hover:bg-gray-50/50 transition-colors font-medium text-gray-700"
                    >
                      {/* Medicine Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {med.image ? (
                            <img 
                              src={med.image} 
                              alt={med.name} 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-xl border border-gray-100" 
                            />
                          ) : (
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                              {med.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900">{med.name}</p>
                            <p className="text-xs text-gray-400 font-mono italic mt-0.5">{med.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Supplier Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-xl w-fit border border-gray-100">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{supplier}</span>
                        </div>
                      </td>

                      {/* Expiration date + Batch tracking Column */}
                      <td className="px-6 py-4 text-xs font-mono">
                        <div>
                          <p className="font-bold text-gray-800">Batch Code: {med.batchNumber || "UNASSIGNED"}</p>
                          <p className="text-gray-400 mt-1">Exp: {med.expiryDate || "N/A"}</p>
                        </div>
                      </td>

                      {/* Stock Quantity level Column */}
                      <td className="px-6 py-4 text-center font-bold">
                        {isEditingNow ? (
                          <div className="flex items-center gap-2 justify-center">
                            <input 
                              type="number"
                              placeholder="+-"
                              value={adjustmentValue} 
                              onChange={e => setAdjustmentValue(parseInt(e.target.value) || 0)}
                              className="w-16 p-1 bg-white border border-emerald-500 rounded text-center font-bold text-sm"
                            />
                            <button 
                              onClick={() => handleUpdateStock(med.id)}
                              className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-700 shadow-sm"
                              title="Update stock value"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setEditingStockId(med.id);
                              setAdjustmentValue(0);
                            }}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-100 hover:border-emerald-300 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5 mx-auto text-xs"
                            title="Click to modify stock inline"
                          >
                            <span>{med.stock} Units</span>
                            <Edit2 className="w-3 h-3 text-emerald-600" />
                          </button>
                        )}
                      </td>

                      {/* Stock safety Indicators */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-xs font-bold leading-none ${statusInfo.color}`}>
                          {/* Colored light signal mark */}
                          <span className={`h-2 w-2 rounded-full ${
                            statusInfo.label === 'Healthy' ? 'bg-emerald-500' : statusInfo.label === 'Low' ? 'bg-amber-400' : 'bg-red-500'
                          }`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Quick addition button actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => {
                              const promptQty = prompt(`Enter exact addition quantity units for ${med.name}:`, "20");
                              const parsed = parseInt(promptQty || "");
                              if (!isNaN(parsed) && parsed !== 0) {
                                setInventory(inventory.map(m => m.id === med.id ? { ...m, stock: Math.max(0, m.stock + parsed) } : m));
                              }
                            }}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl shadow-xs transition active:scale-95"
                          >
                            + Stock
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state indicators if no results exist */}
        {sortedInventory.length === 0 && (
          <div className="bg-white p-16 text-center">
            <div className="w-12 h-12 bg-gray-50 border border-dashed rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-700">No active stock matches selected search/filters</p>
            <p className="text-xs text-gray-400 mt-1">Try resetting the wholesale supplier, category index tag, or state selectors.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
