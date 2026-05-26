import { motion } from "motion/react";
import { Bell, AlertTriangle, Package } from "lucide-react";

const NOTIFICATIONS = [
  { type: "alert", title: "Low Stock Alert", message: "Paracetamol 500mg stock is below 10 units.", time: "2 hours ago" },
  { type: "warning", title: "Expiry Warning", message: "5 items are expiring soon.", time: "5 hours ago" },
  { type: "info", title: "Subscription", message: "Your trial expires in 12 days.", time: "1 day ago" },
];

export function NotificationsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
        <p className="text-sm text-gray-500">Stay updated on your pharmacy operations.</p>
      </div>

      <div className="space-y-4">
        {NOTIFICATIONS.map((n, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`p-3 rounded-full ${n.type === 'alert' ? 'bg-red-100 text-red-600' : n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {n.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : n.type === 'warning' ? <Bell className="w-5 h-5" /> : <Package className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{n.title}</h3>
              <p className="text-sm text-gray-600">{n.message}</p>
            </div>
            <span className="text-xs text-gray-400">{n.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
