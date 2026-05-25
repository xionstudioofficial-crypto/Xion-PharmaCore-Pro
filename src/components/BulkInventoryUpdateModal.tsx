import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { useActivityLogs } from '@/src/context/ActivityLogContext';

const defaultItems = [
    { id: 1, name: 'Paracetamol', stock: 100 },
    { id: 2, name: 'Amoxicillin', stock: 50 },
];

export const BulkInventoryUpdateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [items, setItems] = useState(defaultItems);
    const { addLog } = useActivityLogs();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedItems = results.data.map((row: any, index: number) => ({
                        id: index + defaultItems.length + 1,
                        name: row.name || 'Unknown',
                        stock: parseInt(row.stock) || 0,
                    }));
                    setItems([...defaultItems, ...parsedItems]);
                }
            });
        }
    };

    const handleSave = () => {
        addLog('Inventory Updated', 'Admin');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div className="bg-white p-6 rounded-2xl w-full max-w-xl">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-bold">Bulk Inventory Update</h2>
                            <button onClick={onClose}><X /></button>
                        </div>
                        
                        <div className="mb-6 p-4 border-2 border-dashed rounded-xl flex items-center gap-4 text-sm text-gray-500">
                            <Upload className="w-8 h-8 text-emerald-700" />
                            <div>
                                <p className="font-semibold text-gray-900">Upload CSV</p>
                                <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-1" />
                            </div>
                        </div>

                        <table className="w-full text-sm mb-6">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Select</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2">
                                            <input type="checkbox" onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} />
                                        </td>
                                        <td className="p-2">{item.name}</td>
                                        <td className="p-2">{item.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold w-full justify-center">
                            <Save /> Update {selected.length} items
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
