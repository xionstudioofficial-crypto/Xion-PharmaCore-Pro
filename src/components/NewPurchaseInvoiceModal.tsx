import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Mic } from 'lucide-react';
import { useActivityLogs } from '@/src/context/ActivityLogContext';

export const NewPurchaseInvoiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ supplier: '', item: '', quantity: '', amount: '', note: '' });
    const [isListening, setIsListening] = useState(false);
    const { addLog } = useActivityLogs();

    useEffect(() => {
        if(isOpen) {
            import('@/src/lib/idb').then(idb => idb.getFromIDB('purchase_draft').then((data: any) => data && setFormData(data)));
        }
    }, [isOpen]);

    useEffect(() => {
        if(isOpen) {
            import('@/src/lib/idb').then(idb => idb.saveToIDB('purchase_draft', formData));
        }
    }, [formData, isOpen]);

    const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            updateField('note', event.results[0][0].transcript);
        };
        recognition.start();
    };

    const handleSave = () => {
        addLog('Purchase Recorded', 'Admin');
        import('@/src/lib/idb').then(idb => idb.saveToIDB('purchase_draft', { supplier: '', item: '', quantity: '', amount: '', note: '' }));
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div className="bg-white p-6 rounded-2xl w-full max-w-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">New Purchase Invoice</h2>
                            <button onClick={onClose}><X /></button>
                        </div>
                        <div className="space-y-4">
                            <input value={formData.supplier} onChange={e => updateField('supplier', e.target.value)} type="text" placeholder="Supplier Name" className="w-full p-3 border rounded-xl" />
                            <input value={formData.item} onChange={e => updateField('item', e.target.value)} type="text" placeholder="Item Name" className="w-full p-3 border rounded-xl" />
                            <input value={formData.quantity} onChange={e => updateField('quantity', e.target.value)} type="number" placeholder="Quantity" className="w-full p-3 border rounded-xl" />
                            <input value={formData.amount} onChange={e => updateField('amount', e.target.value)} type="number" placeholder="Total Amount" className="w-full p-3 border rounded-xl" />
                            <div className="relative">
                                <textarea value={formData.note} onChange={e => updateField('note', e.target.value)} placeholder="Purchase Notes (voice enabled)" className="w-full p-3 border rounded-xl" />
                                <button onClick={startListening} className={`absolute right-2 top-2 p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-gray-200'}`}><Mic className={`w-4 h-4 ${isListening ? 'text-white' : ''}`} /></button>
                            </div>
                            <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white rounded-xl py-3 font-semibold"><Save className="w-4 h-4"/> Record Purchase</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
