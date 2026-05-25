import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Receipt } from 'lucide-react';

interface LedgerEntry {
    date: string;
    description: string;
    debit: number;
    credit: number;
}

export const SupplierLedgerModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    supplierName: string;
    history: LedgerEntry[] 
}> = ({ isOpen, onClose, supplierName, history }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Receipt className="text-emerald-700" />
                                {supplierName} - Ledger History
                            </h2>
                            <button onClick={onClose}><X /></button>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">Description</th>
                                    <th className="p-3 text-right">Debit</th>
                                    <th className="p-3 text-right">Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((entry, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-3">{entry.date}</td>
                                        <td className="p-3">{entry.description}</td>
                                        <td className="p-3 text-right text-red-600">{entry.debit ? `$${entry.debit.toFixed(2)}` : '-'}</td>
                                        <td className="p-3 text-right text-emerald-600">{entry.credit ? `$${entry.credit.toFixed(2)}` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
