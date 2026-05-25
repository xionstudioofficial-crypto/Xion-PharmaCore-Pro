import React from 'react';
import { useSync } from '@/src/context/SyncContext';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw } from 'lucide-react';

export const SyncIndicator: React.FC = () => {
  const { isSyncing } = useSync();

  return (
    <AnimatePresence>
      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border"
        >
          <RotateCw className="w-4 h-4 animate-spin text-emerald-700" />
          <span className="text-sm font-medium text-emerald-800">Syncing...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
