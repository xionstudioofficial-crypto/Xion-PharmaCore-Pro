import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orders as DEFAULT_ORDERS } from "@/src/data";
import { motion } from "motion/react";
import { Download, Printer } from "lucide-react";
import { useState } from "react";
import { PrintPreviewModal } from "./PrintPreviewModal";
import { useCurrency } from "@/src/hooks/useCurrency";

interface OrdersTableProps {
  orders?: any[];
}

export function OrdersTable({ orders: propOrders }: OrdersTableProps) {
  const [printingOrder, setPrintingOrder] = useState<any>(null);
  const displayOrders = propOrders || DEFAULT_ORDERS;
  const { formatCurrency } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <PrintPreviewModal 
        isOpen={!!printingOrder} 
        onClose={() => setPrintingOrder(null)} 
        order={printingOrder}
      />

      <Card className="col-span-3 rounded-2xl shadow-sm border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <button className="flex items-center gap-2 text-sm text-emerald-700 font-semibold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition">
            <Download className="w-4 h-4" /> Export
          </button>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Order ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {displayOrders.slice(0, 10).map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="border-b transition-colors hover:bg-gray-50"
                  >
                    <td className="p-4 align-middle font-mono text-xs font-bold text-[#0c443c]">{order.id}</td>
                    <td className="p-4 align-middle font-semibold text-slate-700">{order.customer}</td>
                    <td className="p-4 align-middle font-bold text-slate-800 font-mono">{formatCurrency(order.amount)}</td>
                    <td className="p-4 align-middle">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                        order.status === 'Refunded' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                        <button onClick={() => setPrintingOrder(order)} className="p-2 text-gray-400 hover:text-emerald-70	 transition">
                           <Printer className="w-4 h-4" />
                        </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
