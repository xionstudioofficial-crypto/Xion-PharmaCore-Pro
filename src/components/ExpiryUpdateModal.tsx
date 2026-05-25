import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, AlertTriangle } from 'lucide-react';
import { expiringSoon } from '@/src/data';

export const ExpiryUpdateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [items, setItems] = useState(expiringSoon);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div className="bg-white p-6 rounded-2xl w-full max-w-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Expiry Bulk Update</h2>
                            <button onClick={onClose}><X /></button>
                        </div>
                        <table className="w-full text-sm mb-6">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Days Left</th>
                                    <th className="p-2">New Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className={`border-b ${item.daysLeft < 7 ? 'bg-red-50' : ''}`}>
                                        <td className="p-2 flex items-center gap-2">
                                            {item.daysLeft < 7 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                            {item.name}
                                        </td>
                                        <td className={`p-2 ${item.daysLeft < 7 ? 'text-red-600 font-bold' : ''}`}>{item.daysLeft}</td>
                                        <td className="p-2"><input type="date" className="p-1 border rounded" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="w-full bg-emerald-700 text-white rounded-lg py-2 font-semibold">Save Changes</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
