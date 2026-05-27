import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer } from 'lucide-react';
import { useCurrency } from '@/src/hooks/useCurrency';

export const PrintPreviewModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    order: any 
}> = ({ isOpen, onClose, order }) => {
    const [style, setStyle] = useState<'receipt' | 'invoice'>('receipt');
    const { formatCurrency } = useCurrency();
    const [autoPrint, setAutoPrint] = useState(() => {
        return localStorage.getItem('autoPrintOnSale') === 'true';
    });

    const handleToggleAutoPrint = (checked: boolean) => {
        setAutoPrint(checked);
        localStorage.setItem('autoPrintOnSale', checked ? 'true' : 'false');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div className="bg-white p-6 rounded-2xl w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Print Preview</h2>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setStyle('receipt')} className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${style === 'receipt' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Receipt</button>
                            <button onClick={() => setStyle('invoice')} className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${style === 'invoice' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Invoice</button>
                        </div>
                        <div id="receipt-area" className="border p-4 h-64 overflow-auto bg-gray-50 mb-4 text-sm font-mono">
                           <h3 className="font-bold text-center mb-2">PHARMACORE PRO {style === 'invoice' ? 'INVOICE' : 'RECEIPT'}</h3>
                           {order && (
                               <>
                                   <p>Order ID: {order.id}</p>
                                   <p>Customer: {order.customer}</p>
                                   <p>Amount: {formatCurrency(order.amount)}</p>
                               </>
                           )}
                           {style === 'invoice' && <p className="mt-4 text-xs italic">Thank you for your business!</p>}
                        </div>

                        {/* Auto Print Setting Toggle Checkbox */}
                        <div className="flex items-center gap-2.5 mb-5 p-3 rounded-xl bg-gray-50 border border-gray-100 select-none cursor-pointer hover:bg-gray-100 transition duration-200">
                            <input 
                                id="auto-print-checkbox"
                                type="checkbox" 
                                checked={autoPrint} 
                                onChange={(e) => handleToggleAutoPrint(e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 border-gray-300 focus:ring-emerald-500 cursor-pointer"
                            />
                            <label htmlFor="auto-print-checkbox" className="text-xs font-bold text-gray-700 cursor-pointer flex-1">
                                Triggers printer dialog automatically upon confirming a new sale
                            </label>
                        </div>

                        <button onClick={handlePrint} className="flex w-full justify-center items-center gap-2 bg-emerald-700 hover:bg-emerald-800 transition text-white py-3 rounded-lg font-semibold"><Printer className="w-4 h-4" /> Print</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
