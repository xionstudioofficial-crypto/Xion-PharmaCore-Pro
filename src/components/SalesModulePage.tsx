import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SalesInterface } from './SalesInterface';
import { OrdersTable } from './OrdersTable';
import { ReturnsModule } from './ReturnsModule';
import { ReceiptText, History, CornerDownLeft } from 'lucide-react';

interface SalesModulePageProps {
  inventory: any[];
  setInventory: (inv: any[]) => void;
  orders: any[];
  setOrders: (ord: any[]) => void;
}

export function SalesModulePage({ inventory, setInventory, orders = [], setOrders }: SalesModulePageProps) {
  const [activeTab, setActiveTab] = useState<'Billing' | 'Sales History' | 'Returns'>('Billing');

  return (
    <div className="space-y-6">
      {/* Module Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sales & Returns</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage POS billing, review transaction history, and process returns.</p>
        </div>
        
        <div className="flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-bold w-fit">
          <button 
            onClick={() => setActiveTab('Billing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'Billing' 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            Billing
          </button>
          <button 
            onClick={() => setActiveTab('Sales History')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'Sales History' 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <History className="w-4 h-4" />
            Sales History
          </button>
          <button 
            onClick={() => setActiveTab('Returns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'Returns' 
              ? 'bg-rose-50 text-rose-700 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CornerDownLeft className="w-4 h-4" />
            Returns
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'Billing' && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <SalesInterface inventory={inventory} setInventory={setInventory} orders={orders} setOrders={setOrders} />
          </motion.div>
        )}

        {activeTab === 'Sales History' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* Orders table component */}
            <OrdersTable orders={orders} />
          </motion.div>
        )}

        {activeTab === 'Returns' && (
          <motion.div
            key="returns"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* We will build the Returns Module next */}
            <ReturnsModule inventory={inventory} setInventory={setInventory} orders={orders} setOrders={setOrders} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
