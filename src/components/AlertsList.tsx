import { Card, CardContent } from "@/components/ui/card";
import { lowStockAlerts, expiringSoon } from "@/src/data";
import { motion } from "motion/react";

export function AlertsList() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="space-y-4"
    >
      <Card className="rounded-2xl shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Low Stock Alerts</h3>
            <a href="#" className="text-sm text-emerald-700 hover:underline">View All</a>
          </div>
          {lowStockAlerts.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-2 group">
              <span className="group-hover:text-emerald-700 transition">{item.name}</span>
              <span className="text-red-500 font-bold">Stock: {item.stock}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="rounded-2xl shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Expiring Soon</h3>
            <a href="#" className="text-sm text-emerald-700 hover:underline">View All</a>
          </div>
          {expiringSoon.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-2 group">
              <span className="group-hover:text-emerald-700 transition">{item.name}</span>
              <span className="text-emerald-700 font-bold">{item.daysLeft} days</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
