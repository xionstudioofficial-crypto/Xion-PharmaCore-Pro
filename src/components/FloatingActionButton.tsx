import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ShoppingCart, Pill } from 'lucide-react';

export const FloatingActionButton: React.FC<{ 
    onAddMedicine: () => void; 
    onNewSale: () => void;
    onScanSale: () => void;
}> = ({ onAddMedicine, onNewSale, onScanSale }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="fixed bottom-[112px] right-8 z-[9990] flex flex-col-reverse items-end gap-3"
      onHoverStart={() => setIsOpen(true)}
      onHoverEnd={() => setIsOpen(false)}
      animate={{
        y: [0, -6, 0]
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1F7A5A] to-[#14523C] text-white p-4 h-14 w-14 rounded-full shadow-xl hover:shadow-emerald-950/20 transition-all border border-emerald-500/10 cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 10 }}
             className="flex flex-col gap-2"
          >
            <ActionButton icon={Pill} label="Add Medicine" onClick={onAddMedicine} />
            <ActionButton icon={ShoppingCart} label="New Sale" onClick={onNewSale} />
            <ActionButton icon={Pill} label="Scan Medicine" onClick={onScanSale} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ActionButton: React.FC<{ icon: any, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <motion.button
        className="flex items-center gap-2 bg-white text-gray-800 px-4 py-3 rounded-full shadow-md hover:bg-emerald-50 transition"
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
    >
        <Icon className="w-5 h-5 text-emerald-700" />
        <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
    </motion.button>
);
