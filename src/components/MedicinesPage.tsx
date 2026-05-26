import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Edit2, Trash2, Filter, QrCode, Tag, ClipboardList, 
  Calendar, Layers, DollarSign, Package, Eye, RefreshCw, Sparkles, Check, AlertCircle
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

interface MedicinesPageProps {
  inventory: Medicine[];
  setInventory: (inv: Medicine[]) => void;
}

// Predefined hot categories for medical database
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

// Predefined beautiful stock illustrations/medical images from Unsplash
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1607619056574-7b8d304b3b86?w=400&auto=format&fit=crop&q=60"
];

// Component to dynamically draw a realistic looking mock Barcode!
function BarcodeVisual({ code }: { code?: string }) {
  if (!code) return <p className="text-xs text-gray-400 italic font-mono">No barcode</p>;
  
  // Transform barcode numeric representation into styled line stripes
  const barcodeHash = code.split("").map(n => parseInt(n) || 1);
  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50/50 p-2 rounded-lg border border-gray-100">
      <div className="flex items-end h-7 gap-[1px]">
        {barcodeHash.map((val, idx) => (
          <div 
            key={idx} 
            className="bg-gray-800" 
            style={{ 
              width: `${(val % 3) + 1}px`, 
              height: idx % 4 === 0 ? "100%" : "85%" 
            }} 
          />
        ))}
      </div>
      <span className="text-[10px] font-mono mt-1 text-gray-500 tracking-widest">{code}</span>
    </div>
  );
}

export function MedicinesPage({ inventory, setInventory }: MedicinesPageProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All"); // All, Low, Out, Healthy
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Active scanning / search indicator states
  const [showScannerMock, setShowScannerMock] = useState(false);
  const [scannedMessage, setScannedMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);

  // Form Field State
  const [formFields, setFormFields] = useState<Omit<Medicine, "id">>({
    name: "",
    genericName: "",
    category: CATEGORIES[0],
    batchNumber: "",
    expiryDate: new Date().toISOString().split("T")[0],
    stock: 20,
    price: 4.99,
    purchasePrice: 2.20,
    barcode: "",
    image: DEFAULT_IMAGES[0]
  });

  // Open modal for adding
  const handleOpenAdd = () => {
    setModalMode("add");
    setFormFields({
      name: "",
      genericName: "",
      category: CATEGORIES[0],
      batchNumber: `B-${Math.floor(Math.random() * 900) + 100}`,
      expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0],
      stock: 50,
      price: 9.99,
      purchasePrice: 4.50,
      barcode: generateRandomBarcode(),
      image: DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)]
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (medicine: Medicine) => {
    setModalMode("edit");
    setSelectedMedicineId(medicine.id);
    setFormFields({
      name: medicine.name,
      genericName: medicine.genericName || "",
      category: medicine.category || CATEGORIES[0],
      batchNumber: medicine.batchNumber || "",
      expiryDate: medicine.expiryDate || new Date().toISOString().split("T")[0],
      stock: medicine.stock,
      price: medicine.price,
      purchasePrice: medicine.purchasePrice || 0,
      barcode: medicine.barcode || "",
      image: medicine.image || DEFAULT_IMAGES[0]
    });
    setIsModalOpen(true);
  };

  // Generate random UPC-A standard barcode value
  const generateRandomBarcode = () => {
    const min = 100000000000;
    const max = 999999999999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name.trim()) return;

    if (modalMode === "add") {
      const newMed: Medicine = {
        id: (inventory.length + 1).toString(),
        ...formFields
      };
      setInventory([...inventory, newMed]);
    } else if (modalMode === "edit" && selectedMedicineId) {
      setInventory(
        inventory.map(med => 
          med.id === selectedMedicineId ? { ...med, ...formFields } : med
        )
      );
    }
    setIsModalOpen(false);
  };

  // Delete Medicine
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this medicine? This will instantly remove it from stock and POS.")) {
      setInventory(inventory.filter(med => med.id !== id));
    }
  };

  // Scanning mockup simulation
  const triggerMockScan = () => {
    setShowScannerMock(true);
    setScannedMessage("Searching barcode frequency...");
    setTimeout(() => {
      // Pick a random product from inventory and "scan" it
      if (inventory.length > 0) {
        const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
        setSearchTerm(randomItem.barcode || randomItem.name);
        setScannedMessage(`Match found: ${randomItem.name}! (Code: ${randomItem.barcode})`);
      } else {
        setScannedMessage("No medicines in database to simulate scan.");
      }
      setTimeout(() => {
        setShowScannerMock(false);
      }, 1500);
    }, 1200);
  };

  // Categorize medicine stocks
  const filteredInventory = inventory.filter(med => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.genericName && med.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.barcode && med.barcode.includes(searchTerm));
    
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    
    let matchesStock = true;
    if (stockFilter === "Low") {
      matchesStock = med.stock > 0 && med.stock <= 10;
    } else if (stockFilter === "Out") {
      matchesStock = med.stock === 0;
    } else if (stockFilter === "Healthy") {
      matchesStock = med.stock > 10;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-7xl mx-auto px-1"
    >
      {/* Dynamic Header Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium font-sans uppercase tracking-wider">Total Listings</p>
            <p className="text-2xl font-black text-gray-800 mt-0.5">{inventory.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium font-sans uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">
              {inventory.filter(med => med.stock === 0).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium font-sans uppercase tracking-wider">Low Stock</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">
              {inventory.filter(med => med.stock > 0 && med.stock <= 10).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium font-sans uppercase tracking-wider">Active Categories</p>
            <p className="text-2xl font-black text-sky-700 mt-0.5">
              {new Set(inventory.map(med => med.category).filter(Boolean)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Directory Management Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Medicines Directory</h2>
          <p className="text-sm text-gray-500 mt-1">Add, update, search, scan, and manage your core pharmaceutical catalog list.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={triggerMockScan}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-700 to-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:brightness-110 active:scale-95 transition shadow-sm"
          >
            <QrCode className="w-4 h-4" /> Scanner Simulation
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-800 active:scale-95 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Medicine
          </button>
        </div>
      </div>

      {/* Scanning status notifier */}
      <AnimatePresence>
        {showScannerMock && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 flex items-center gap-3 text-sm font-medium"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-700 border-t-transparent" />
            <span>{scannedMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Controls: Search, filters, grid/table view toggle */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by medicine name, generic chemical name, or barcode..." 
              className="w-full pl-11 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white outline-none text-sm transition" 
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3.5 text-xs font-semibold text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown Filter */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50">
              <Tag className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Stock status filter */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50">
              <Package className="w-4 h-4 text-gray-400" />
              <select 
                value={stockFilter} 
                onChange={e => setStockFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Stock Levels</option>
                <option value="Low">Low Stock (≤ 10)</option>
                <option value="Out">Out Of Stock (0)</option>
                <option value="Healthy">Healthy Stock (&gt; 10)</option>
              </select>
            </div>

            {/* Layout Toggle switcher */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden self-stretch ml-auto lg:ml-0 bg-gray-50/50">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-3 flex items-center text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-emerald-700 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode("table")}
                className={`px-3 flex items-center text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-emerald-700 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Selected category/stock filters summary tags */}
        {(selectedCategory !== "All" || stockFilter !== "All" || searchTerm) && (
          <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Applied Filters:</span>
            {selectedCategory !== "All" && (
              <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="font-sans hover:text-red-500">×</button>
              </span>
            )}
            {stockFilter !== "All" && (
              <span className="bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-lg border border-amber-100 flex items-center gap-1.5">
                Stock: {stockFilter}
                <button onClick={() => setStockFilter("All")} className="font-sans hover:text-red-500">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                Query: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="font-sans hover:text-red-500">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main content display Area */}
      {filteredInventory.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl shadow-sm text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">No medicines matched your criteria</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">Try adjusting your search query, selecting different filter categories, or add an entirely new formulation to the index.</p>
          <button 
            onClick={handleOpenAdd}
            className="mt-6 inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-800 transition"
          >
            <Plus className="w-4 h-4" /> Add New Medicine
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            /* Card view */
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredInventory.map((med) => {
                const isLowStock = med.stock > 0 && med.stock <= 10;
                const isOutStock = med.stock === 0;
                
                return (
                  <motion.div 
                    layout
                    key={med.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-emerald-500/20 transition group"
                  >
                    {/* Image / Header strip info */}
                    <div className="relative h-44 w-full bg-slate-900/5 overflow-hidden">
                      <img 
                        src={med.image || DEFAULT_IMAGES[0]} 
                        alt={med.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-95" 
                      />
                      {/* Floating stock category badge status */}
                      <span className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm ${
                        isOutStock ? "bg-red-600 text-white" : isLowStock ? "bg-amber-500 text-white" : "bg-emerald-700 text-white"
                      }`}>
                        {isOutStock ? "Out of stock" : isLowStock ? `${med.stock} left (Low)` : "Healthy"}
                      </span>

                      {/* Floating cost price indicator */}
                      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-800 text-xs font-extrabold px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                        ${med.price.toFixed(2)} /unit
                      </span>
                    </div>

                    {/* Content information body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs text-emerald-800 font-extrabold uppercase tracking-wide">{med.category}</p>
                        <h3 className="text-lg font-black text-gray-800 leading-tight group-hover:text-emerald-800 transition">{med.name}</h3>
                        {med.genericName && (
                          <p className="text-xs text-gray-500 font-mono italic">{med.genericName}</p>
                        )}
                      </div>

                      {/* Stock metrics dashboard */}
                      <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-xs">
                        <div>
                          <p className="text-gray-400 font-medium">Batch No</p>
                          <p className="font-extrabold text-gray-700 mt-0.5">{med.batchNumber || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Expiry</p>
                          <p className="font-extrabold text-gray-700 mt-0.5">{med.expiryDate || "N/A"}</p>
                        </div>
                      </div>

                      {/* Dynamic Barcode element */}
                      <BarcodeVisual code={med.barcode} />

                      {/* Quick-action buttons bar */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => handleOpenEdit(med)}
                          className="flex-1 flex justify-center items-center gap-1.5 py-2.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 font-semibold text-gray-700 rounded-xl text-xs transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(med.id)}
                          className="p-2.5 bg-gray-50 hover:bg-rose-50 hover:text-red-600 text-gray-500 rounded-xl transition"
                          title="Delete Medicine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Table view mode */
            <motion.div 
              layout
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Medicine</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Batch Info</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Cost/Selling Price</th>
                      <th className="px-6 py-4">Barcode</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredInventory.map((med) => {
                      const isLowStock = med.stock > 0 && med.stock <= 10;
                      const isOutStock = med.stock === 0;
                      
                      return (
                        <tr key={med.id} className="hover:bg-gray-50/50 transition duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={med.image || DEFAULT_IMAGES[0]} 
                                alt={med.name} 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded-lg border border-gray-200" 
                              />
                              <div>
                                <h4 className="font-bold text-gray-800">{med.name}</h4>
                                {med.genericName && (
                                  <p className="text-[11px] font-mono text-gray-400 mt-0.5">{med.genericName}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                              {med.category || "Others"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs">
                              <p className="font-semibold text-gray-700">Batch: {med.batchNumber || "N/A"}</p>
                              <p className="text-gray-400 mt-0.5">Expires: {med.expiryDate || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                              isOutStock ? 'bg-red-50 text-red-700' : isLowStock ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {med.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-semibold">
                              <p className="text-emerald-700">Retail: ${med.price.toFixed(2)}</p>
                              {med.purchasePrice && (
                                <p className="text-gray-400 mt-0.5">Cost: ${med?.purchasePrice?.toFixed(2)}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-[120px]">
                              <BarcodeVisual code={med.barcode} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEdit(med)}
                                className="p-2 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-gray-500 rounded-xl transition"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(med.id)}
                                className="p-2 bg-gray-50 hover:bg-rose-50 hover:text-red-600 text-gray-500 rounded-xl transition"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Dynamic Modal Drawer for Add / Edit Actions */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Card content wrapper */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
            >
              <form onSubmit={handleSave} className="p-8 space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-black text-gray-800">
                      {modalMode === "add" ? "Add New Formulation" : "Edit Formulation Details"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Please ensure all required inventory specifications are logged.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold p-2 text-xl"
                  >
                    &times;
                  </button>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Medicine Name */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Medicine / Brand Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Panadol Extra 500mg" 
                      value={formFields.name}
                      onChange={e => setFormFields({ ...formFields, name: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  {/* Generic Name */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Generic Chemical Composition</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Paracetamol / Acetaminophen & Caffeine" 
                      value={formFields.genericName}
                      onChange={e => setFormFields({ ...formFields, genericName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Therapeutic Category</label>
                    <select 
                      value={formFields.category}
                      onChange={e => setFormFields({ ...formFields, category: e.target.value })}
                      className="w-full p-3 border border-gray-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none cursor-pointer"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Batch Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Batch Registration No.</label>
                    <input 
                      type="text" 
                      placeholder="e.g. B-PAN-201" 
                      value={formFields.batchNumber}
                      onChange={e => setFormFields({ ...formFields, batchNumber: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Batch Expiration Date</label>
                    <input 
                      type="date" 
                      value={formFields.expiryDate}
                      onChange={e => setFormFields({ ...formFields, expiryDate: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  {/* Stock Level in Units */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Starting Stock (Units)</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={formFields.stock}
                      onChange={e => setFormFields({ ...formFields, stock: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  {/* Purchase Cost Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Purchase Cost / Unit ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 font-bold text-sm">$</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        value={formFields.purchasePrice}
                        onChange={e => setFormFields({ ...formFields, purchasePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-3 p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Retail Selling Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Retail Selling Price / Unit ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 font-bold text-sm">$</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        value={formFields.price}
                        onChange={e => setFormFields({ ...formFields, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-3 p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Barcode UPC/EAN code */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex justify-between items-center">
                      <span>Barcode Number (UPC/EAN)</span>
                      <button 
                        type="button" 
                        onClick={() => setFormFields({ ...formFields, barcode: generateRandomBarcode() })}
                        className="text-[10px] text-emerald-700 font-bold uppercase underline hover:text-emerald-900 transition flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Re-Generate
                      </button>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 8901030733857" 
                      value={formFields.barcode}
                      onChange={e => setFormFields({ ...formFields, barcode: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none font-mono"
                    />
                  </div>

                  {/* Image Stock URL select list */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Formulation Package image Thumbnail</label>
                    <div className="grid grid-cols-4 gap-2">
                      {DEFAULT_IMAGES.map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setFormFields({ ...formFields, image: img })}
                          className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                            formFields.image === img ? "border-emerald-700 scale-95 shadow-md" : "border-transparent opacity-65 hover:opacity-100"
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="medicine placeholder" referrerPolicy="no-referrer" />
                          {formFields.image === img && (
                            <div className="absolute inset-0 bg-emerald-700/10 flex items-center justify-center">
                              <span className="bg-emerald-700 text-white rounded-full p-1"><Check className="w-3.5 h-3.5" /></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer and confirm buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 hover:bg-gray-100 font-semibold text-gray-600 text-sm rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl tracking-wide shadow-sm active:scale-95 transition"
                  >
                    {modalMode === "add" ? "Register Formulation" : "Save Specifications"}
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
