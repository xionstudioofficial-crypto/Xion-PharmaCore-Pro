import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Check } from 'lucide-react';

export const BarcodeScannerModal: React.FC<{ isOpen: boolean; onClose: () => void; onScan: (code: string) => void }> = ({ isOpen, onClose, onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scannedItems, setScannedItems] = useState<string[]>([]);
    
    // Simulate scanner (for demo)
    useEffect(() => {
        if(isOpen) {
            const interval = setInterval(() => {
                if(Math.random() > 0.8) {
                    const code = `ITEM-${Math.floor(Math.random()*1000)}`;
                    setScannedItems(prev => [...prev, code]);
                    onScan(code);
                }
            }, 2000);
            return () => clearInterval(interval);
        } else {
            setScannedItems([]);
        }
    }, [isOpen, onScan]);

    useEffect(() => {
        if (isOpen) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            }).catch(err => console.error("Error accessing camera:", err));
        } else {
            videoRef.current?.srcObject && (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <motion.div className="bg-white p-6 rounded-2xl w-full max-w-lg relative flex flex-col gap-4">
                        <button onClick={onClose} className="absolute right-4 top-4"><X /></button>
                        <h2 className="text-xl font-bold flex items-center gap-2"><Camera /> Barcode Scanner</h2>
                        <video ref={videoRef} autoPlay className="w-full h-48 bg-gray-200 rounded-lg" />
                        <div className="h-48 overflow-auto border rounded-lg p-2 text-sm">
                            <h3 className="font-semibold mb-2">Scan Session History</h3>
                            {scannedItems.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-1 border-b">
                                    <Check className="w-4 h-4 text-emerald-600" /> {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
