import { motion } from "motion/react";
import { AlertTriangle, Clock } from "lucide-react";

const EXPIRING_ITEMS = [
  { name: 'Paracetamol 500mg', batchNumber: 'B001', expiryDate: '2026-06-01', stock: 8 },
  { name: 'Amoxicillin 250mg', batchNumber: 'B002', expiryDate: '2026-07-15', stock: 12 },
];

export function BatchTrackingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Batch Tracking - Expiring Soon</h2>
        <p className="text-sm text-gray-500">Monitor batch numbers and expiry dates to avoid stock waste.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPIRING_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 border-l-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-xs text-gray-500">Batch: {item.batchNumber}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><Clock className="w-4 h-4" /> Expires on: {item.expiryDate}</span>
                    <span className="font-bold text-gray-800">{item.stock} in stock</span>
                </div>
            </div>
        ))}
      </div>
    </motion.div>
  );
}
