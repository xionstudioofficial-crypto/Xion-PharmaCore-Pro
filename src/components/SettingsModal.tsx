import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database } from 'lucide-react';

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const handleBackup = () => {
        // Mocking database export
        const data = { inventory: [], sales: [], timestamp: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${new Date().toISOString()}.json`;
        a.click();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div className="bg-white p-6 rounded-2xl w-full max-w-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Settings</h2>
                            <button onClick={onClose}><X /></button>
                        </div>
                        <button onClick={handleBackup} className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white rounded-xl py-3 font-semibold">
                            <Database className="w-4 h-4"/> Backup Database
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
