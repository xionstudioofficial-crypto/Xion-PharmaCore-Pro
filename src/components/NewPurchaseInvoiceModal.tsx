import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Mic, QrCode, Sparkles, Trash, Plus } from 'lucide-react';
import { useActivityLogs } from '@/src/context/ActivityLogContext';
import { InteractiveQRScannerModal } from '@/src/components/InteractiveQRScannerModal';
import { saveToIDB, getFromIDB } from '@/src/lib/idb';

const PRESETS_SUPPLIERS = [
  "PharmaCorp Inc.",
  "MediSupply Ltd.",
  "GlaxoSmithKline Wholesale",
  "PharmaDist Corp",
  "BioPharma Solutions",
  "MedSource Logistics"
];

const SUPPLIER_MEDS_MAPPING: Record<string, { name: string; costPrice: number; barcode: string }[]> = {
  "PharmaCorp Inc.": [
    { name: "Panadol Extra 500mg", costPrice: 2.80, barcode: "QR-PANADOL-500" },
    { name: "Amoxil Forte 250mg", costPrice: 6.50, barcode: "QR-AMOXIL-250" },
    { name: "Surbex Z Multivitamins", costPrice: 4.20, barcode: "QR-SURBEX-Z" }
  ],
  "MediSupply Ltd.": [
    { name: "Zyrtec Allergy 10mg", costPrice: 1.90, barcode: "QR-ZYRTEC-10" },
    { name: "Lipitor Lipids 20mg", costPrice: 8.50, barcode: "QR-LIPITOR-20" },
    { name: "Crestor Cholesterol 10mg", costPrice: 9.10, barcode: "QR-CRESTOR-10" }
  ],
  "GlaxoSmithKline Wholesale": [
    { name: "Ventolin Inhaler 100mcg", costPrice: 12.00, barcode: "QR-VENTOLIN-100" },
    { name: "Augmentin Tablets 625mg", costPrice: 14.50, barcode: "QR-AUGMENTIN-625" },
    { name: "Panadol Extra 500mg", costPrice: 2.80, barcode: "QR-PANADOL-500" }
  ],
  "PharmaDist Corp": [
    { name: "Nexium Acid Block 40mg", costPrice: 5.20, barcode: "QR-NEXIUM-40" },
    { name: "Disprin Tablets 300mg", costPrice: 0.90, barcode: "QR-DISPRIN-300" },
    { name: "Brufen Cream 400mg", costPrice: 3.50, barcode: "QR-BRUFEN-400" }
  ],
  "BioPharma Solutions": [
    { name: "Insulin Humalog Injection", costPrice: 45.00, barcode: "QR-INSULIN-HUMA" },
    { name: "Rocephin IV Injection 1g", costPrice: 22.00, barcode: "QR-ROCEPHIN-1G" },
    { name: "SoluMedrol 2ml", costPrice: 18.00, barcode: "QR-SOLUMED-2ML" }
  ],
  "MedSource Logistics": [
    { name: "Arinac Forte Flu Relief", costPrice: 3.80, barcode: "QR-ARINAC-FTE" },
    { name: "Flagyl Tablets 400mg", costPrice: 2.10, barcode: "QR-FLAGYL-400" },
    { name: "Loprin 75mg Cardioprev", costPrice: 1.50, barcode: "QR-LOPRIN-75" }
  ]
};

export interface InvoiceItem {
    name: string;
    quantity: number;
    costPrice: number;
}

export const NewPurchaseInvoiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ 
        supplier: PRESETS_SUPPLIERS[0], 
        item: '', 
        quantity: '100', 
        amount: '', 
        note: '' 
    });
    
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const { addLog } = useActivityLogs();

    // Cache pre-filled state inside IndexedDB index
    useEffect(() => {
        if(isOpen) {
            getFromIDB('purchase_draft').then((data: any) => {
                if (data) {
                    if (data.supplier) {
                        setFormData({
                            supplier: data.supplier || PRESETS_SUPPLIERS[0],
                            item: data.item || '',
                            quantity: data.quantity || '100',
                            amount: data.amount || '',
                            note: data.note || ''
                        });
                    }
                    if (data.invoiceItems) {
                        setInvoiceItems(data.invoiceItems);
                    } else if (data.item) {
                        setInvoiceItems([{
                            name: data.item,
                            quantity: parseInt(data.quantity) || 100,
                            costPrice: (parseFloat(data.amount) / (parseInt(data.quantity) || 100)) || 3.50
                        }]);
                    }
                }
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if(isOpen && formData.supplier) {
            saveToIDB('purchase_draft', {
                ...formData,
                invoiceItems
            });
        }
    }, [formData, invoiceItems, isOpen]);

    // Recalculate total amount and fallback item fields automatically
    useEffect(() => {
        if (invoiceItems.length > 0) {
            const totalAmount = invoiceItems.reduce((acc, it) => acc + (it.quantity * it.costPrice), 0);
            const totalQty = invoiceItems.reduce((acc, it) => acc + it.quantity, 0);
            const lastItem = invoiceItems[invoiceItems.length - 1]?.name || '';
            setFormData(prev => ({
                ...prev,
                amount: totalAmount > 0 ? totalAmount.toFixed(2) : prev.amount,
                quantity: totalQty > 0 ? totalQty.toString() : prev.quantity,
                item: lastItem || prev.item
            }));
        }
    }, [invoiceItems]);

    const updateField = (field: string, value: string) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value };
            
            // Auto recalculate estimated total cost if specific medication matches
            if (field === 'quantity' || field === 'item' || field === 'supplier') {
                const medsForSupplier = SUPPLIER_MEDS_MAPPING[next.supplier] || [];
                const matchedMed = medsForSupplier.find(m => m.name.toLowerCase() === next.item.toLowerCase());
                if (matchedMed) {
                    const qtyVal = parseInt(next.quantity) || 0;
                    next.amount = (matchedMed.costPrice * qtyVal).toFixed(2);
                }
            }
            return next;
        });
    };

    const handleSelectMedicine = (name: string) => {
        if (!name) return;
        const medsForSupplier = SUPPLIER_MEDS_MAPPING[formData.supplier] || [];
        const matchedMed = medsForSupplier.find(m => m.name === name);
        if (matchedMed) {
            setInvoiceItems(prev => {
                const exists = prev.find(item => item.name.toLowerCase() === name.toLowerCase());
                if (exists) {
                    return prev.map(item => item.name.toLowerCase() === name.toLowerCase() 
                        ? { ...item, quantity: item.quantity + 100 } 
                        : item
                    );
                } else {
                    return [...prev, { name: matchedMed.name, quantity: 100, costPrice: matchedMed.costPrice }];
                }
            });
        }
    };

    const handleScanResult = (scanned: { name: string; barcode: string; costPrice?: number }) => {
        const cost = scanned.costPrice || 3.50;
        setInvoiceItems(prev => {
            const exists = prev.find(item => item.name.toLowerCase() === scanned.name.toLowerCase());
            if (exists) {
                return prev.map(item => item.name.toLowerCase() === scanned.name.toLowerCase() 
                    ? { ...item, quantity: item.quantity + 100 } 
                    : item
                );
            } else {
                return [...prev, { name: scanned.name, quantity: 100, costPrice: cost }];
            }
        });
        
        setFormData(prev => ({
            ...prev,
            item: scanned.name,
            note: prev.note 
                ? prev.note.includes(scanned.barcode) ? prev.note : `${prev.note} (Scanned QR: ${scanned.barcode})` 
                : `Attached by scanning QR: ${scanned.barcode}`
        }));
    };

    const handleAddManualItem = () => {
        const availableMeds = SUPPLIER_MEDS_MAPPING[formData.supplier] || [];
        const nextMed = availableMeds[Math.floor(Math.random() * availableMeds.length)] || { name: 'New Formulation Item', costPrice: 3.50 };
        setInvoiceItems(prev => [
            ...prev,
            { name: nextMed.name, quantity: 100, costPrice: nextMed.costPrice }
        ]);
    };

    const updateInvoiceItemField = (index: number, field: keyof InvoiceItem, value: any) => {
        setInvoiceItems(prev => prev.map((item, idx) => {
            if (idx === index) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleRemoveInvoiceItem = (index: number) => {
        setInvoiceItems(prev => prev.filter((_, idx) => idx !== index));
    };

    const startListening = () => {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRec) {
            alert("Speech recognition is not supported in this browser version.");
            return;
        }
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            updateField('note', event.results[0][0].transcript);
        };
        recognition.start();
    };

    const handleSave = () => {
        if (invoiceItems.length === 0 && !formData.item) {
            alert("Please specify a pharmaceutical item name or scan a package details QR label.");
            return;
        }

        const itemsSummary = invoiceItems.length > 0 
            ? invoiceItems.map(it => `${it.quantity}x ${it.name}`).join(", ")
            : `${formData.quantity}x ${formData.item}`;

        addLog(`Recorded Purchase Requisition Invoice: [${itemsSummary}] from supplier ${formData.supplier} (Est. Total: $${parseFloat(formData.amount || "0").toFixed(2)})`, 'Manager');
        
        // Reset IndexedDB
        saveToIDB('purchase_draft', { 
            supplier: PRESETS_SUPPLIERS[0], 
            item: '', 
            quantity: '100', 
            amount: '', 
            note: '' 
        });

        // Clear local state
        setInvoiceItems([]);
        setFormData({
            supplier: PRESETS_SUPPLIERS[0],
            item: '',
            quantity: '100',
            amount: '',
            note: ''
        });

        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.95, y: 15 }} 
                        animate={{ scale: 1, y: 0 }} 
                        exit={{ scale: 0.95, y: 15 }} 
                        className="bg-white p-6 rounded-3xl w-full max-w-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header banner */}
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-black text-gray-800">New Purchase Invoice</h2>
                                <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider text-[#1F7A5A]">Quick purchase invoice capture with voice notes, dynamic drug dropdowns, and live QR code support.</p>
                            </div>
                            <button type="button" onClick={onClose} className="text-gray-450 hover:text-gray-600 font-extrabold p-1 text-xl leading-none transition-colors">&times;</button>
                        </div>

                        {/* Invoice Form fields */}
                        <div className="space-y-4">
                            
                            {/* Supplier manufacturer */}
                            <div className="space-y-1">
                                <label className="text-[9px] font-extrabold text-[#1F7A5A] uppercase tracking-wider">Manufacturer / wholesales Supplier *</label>
                                <select 
                                    value={formData.supplier} 
                                    onChange={e => {
                                        updateField('supplier', e.target.value);
                                        // Reset items for new supplier to prevent mismatched products
                                        setInvoiceItems([]);
                                    }} 
                                    className="w-full text-xs p-3 border border-gray-250 bg-white rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer font-bold"
                                >
                                    {PRESETS_SUPPLIERS.map(sup => (
                                        <option key={sup} value={sup}>{sup}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Mapped Drug dropdown and QR trigger side-by-side */}
                            <div className="bg-[#1F7A5A]/5 border border-[#1F7A5A]/15 p-3.5 rounded-2xl space-y-2.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[9px] font-black text-[#1F7A5A] uppercase tracking-wider">Company Provided Medicines & QR Desk</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsScannerOpen(true)}
                                        className="text-[9px] bg-[#1F7A5A]/10 text-[#1F7A5A] rounded-lg px-2.5 py-1 font-extrabold flex items-center gap-1 hover:bg-[#1F7A5A]/20 transition uppercase tracking-wider border border-[#1F7A5A]/10"
                                    >
                                        <QrCode className="w-3 h-3 text-[#1F7A5A] animate-pulse" /> Launch QR Lens
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="space-y-0.5 col-span-2">
                                        <span className="text-[8px] uppercase tracking-widest font-bold text-gray-455 block mb-1">Smart Selector — Clicking adds to the invoice list with 100 units</span>
                                        <select
                                            value=""
                                            onChange={e => handleSelectMedicine(e.target.value)}
                                            className="w-full text-xs p-2.5 border border-gray-300 bg-white rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 font-semibold cursor-pointer"
                                        >
                                            <option value="">-- Click to Append Medicine of {formData.supplier} --</option>
                                            {(SUPPLIER_MEDS_MAPPING[formData.supplier] || []).map(m => (
                                                <option key={m.name} value={m.name}>
                                                    {m.name} (${m.costPrice.toFixed(2)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* DRAFT ITEMS TABLE SECTION */}
                            <div className="border border-gray-200 rounded-2xl p-3.5 space-y-3 bg-white">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Active Invoice Draft Items ({invoiceItems.length})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAddManualItem}
                                        className="text-[9px] bg-slate-100 hover:bg-slate-255 text-slate-850 font-extrabold px-3 py-1.5 rounded-lg border border-slate-200/60 flex items-center gap-1 transition-all uppercase"
                                    >
                                        <Plus className="w-3 h-3 text-slate-600" /> Append row
                                    </button>
                                </div>

                                {/* Items list or empty state */}
                                {invoiceItems.length > 0 ? (
                                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-1.5">
                                        {invoiceItems.map((item, index) => (
                                            <div key={index} className="flex gap-2 bg-gray-50/60 p-2.5 rounded-xl border border-gray-150 items-center justify-between">
                                                {/* Edit item name */}
                                                <div className="flex-1 min-w-0">
                                                    <input 
                                                        type="text"
                                                        required
                                                        placeholder="Formulation name..."
                                                        value={item.name}
                                                        onChange={e => updateInvoiceItemField(index, "name", e.target.value)}
                                                        className="w-full text-xs p-1.5 bg-white border border-gray-200 rounded-lg outline-none font-bold text-slate-850"
                                                    />
                                                </div>

                                                {/* Edit item quantity */}
                                                <div className="w-20 shrink-0">
                                                    <input 
                                                        type="number"
                                                        required
                                                        min="1"
                                                        placeholder="Qty"
                                                        value={item.quantity}
                                                        onChange={e => updateInvoiceItemField(index, "quantity", parseInt(e.target.value) || 0)}
                                                        className="w-full text-xs p-1.5 bg-white border border-gray-200 rounded-lg outline-none text-center font-bold"
                                                    />
                                                </div>

                                                {/* Edit cost price */}
                                                <div className="w-20 shrink-0">
                                                    <input 
                                                        type="number"
                                                        required
                                                        step="0.01"
                                                        min="0.01"
                                                        placeholder="Price"
                                                        value={item.costPrice}
                                                        onChange={e => updateInvoiceItemField(index, "costPrice", parseFloat(e.target.value) || 0)}
                                                        className="w-full text-xs p-1.5 bg-white border border-gray-250 rounded-lg outline-none text-right font-bold"
                                                    />
                                                </div>

                                                {/* Delete row */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInvoiceItem(index)}
                                                    className="p-1 rounded bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                                    title="Remove item"
                                                >
                                                    <Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-8 bg-slate-50 border border-dashed border-gray-200 rounded-xl">
                                        <QrCode className="w-8 h-8 text-gray-350 mx-auto mb-1 animate-pulse" />
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">No Items Drafted Yet</p>
                                        <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">Scan physical QR package codes or click selected medicines above to batch load items down.</p>
                                    </div>
                                )}
                            </div>

                            {/* Estimated total sum price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900 text-white rounded-2xl p-4">
                                <div className="space-y-1">
                                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-400">Draft Status Tracker</span>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">Batch Adding Active</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 max-w-[200px] mt-1 font-medium">Quantities instantly auto-increment upon duplicate scans.</p>
                                </div>
                                <div className="flex flex-col justify-center items-end text-right border-l md:border-l border-slate-800 pl-4">
                                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-400">Total Invoice Valuation</span>
                                    <span className="text-xl font-extrabold text-[#1F7A5A]">${parseFloat(formData.amount || "0.00").toFixed(2)}</span>
                                    <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">Automatic Sum Recalculated</span>
                                </div>
                            </div>

                            {/* Note field with voice listener */}
                            <div className="space-y-1">
                                <label className="text-[9px] font-extrabold text-gray-450 uppercase">Purchase Requisition Notes</label>
                                <div className="relative">
                                    <textarea 
                                        value={formData.note} 
                                        onChange={e => updateField('note', e.target.value)} 
                                        placeholder="Specify specific order notes (or click mic for voice recognition)..." 
                                        className="w-full text-xs p-3 border border-gray-250 rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 min-h-[50px] pr-10 font-bold" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={startListening} 
                                        className={`absolute right-2.5 top-2.5 p-1.5 rounded-xl transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        <Mic className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Submit and Save action button */}
                            <button 
                                type="button"
                                onClick={handleSave} 
                                className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-750 text-white rounded-xl py-3 text-xs font-bold transition shadow-md active:scale-95"
                            >
                                <Save className="w-4 h-4"/> Record Invoice details
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Sub Scanner Overlay */}
            <InteractiveQRScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScanResult}
                supplierName={formData.supplier}
                availableMeds={
                    (SUPPLIER_MEDS_MAPPING[formData.supplier] || []).map(m => ({
                        name: m.name,
                        barcode: m.barcode,
                        costPrice: m.costPrice
                    }))
                }
                title="Record Purchase QR Scanner"
                description="Scan drug product package labels to instantly fill in formulation names and estimated invoice items."
            />
        </AnimatePresence>
    );
};
