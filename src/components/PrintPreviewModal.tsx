import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer } from 'lucide-react';

export const PrintPreviewModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    order: any 
}> = ({ isOpen, onClose, order }) => {
    const [style, setStyle] = useState<'receipt' | 'invoice'>('receipt');

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
                            <button onClick={onClose}><X /></button>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setStyle('receipt')} className={`flex-1 py-2 rounded-lg ${style === 'receipt' ? 'bg-emerald-700 text-white' : 'bg-gray-100'}`}>Receipt</button>
                            <button onClick={() => setStyle('invoice')} className={`flex-1 py-2 rounded-lg ${style === 'invoice' ? 'bg-emerald-700 text-white' : 'bg-gray-100'}`}>Invoice</button>
                        </div>
                        <div id="receipt-area" className="border p-4 h-64 overflow-auto bg-gray-50 mb-6 text-sm font-mono">
                           <h3 className="font-bold text-center mb-2">PHARMACORE PRO {style === 'invoice' ? 'INVOICE' : 'RECEIPT'}</h3>
                           <p>Order ID: {order.id}</p>
                           <p>Customer: {order.customer}</p>
                           <p>Amount: {order.amount}</p>
                           {style === 'invoice' && <p className="mt-4 text-xs italic">Thank you for your business!</p>}
                        </div>
                        <button onClick={handlePrint} className="flex w-full justify-center items-center gap-2 bg-emerald-700 text-white py-3 rounded-lg font-semibold"><Printer /> Print</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
