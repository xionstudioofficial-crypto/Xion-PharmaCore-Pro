import { motion } from "motion/react";
import { Bell, AlertTriangle, Package, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";

interface AppNotification {
  type: string;
  title: string;
  message: string;
  time: string;
  roleRestrict?: string;
  timestamp?: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  { type: "alert", title: "Low Stock Alert", message: "Paracetamol 500mg stock is below 10 units.", time: "2 hours ago" },
  { type: "warning", title: "Expiry Warning", message: "5 items are expiring soon.", time: "5 hours ago" },
  { type: "info", title: "Subscription", message: "Your trial expires in 12 days.", time: "1 day ago" },
];

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user?.client?.id) {
      const saved = localStorage.getItem(`pharma_notifications_${user.client.id}`);
      let dynamicNotifs: any[] = [];
      if (saved) {
        try {
          dynamicNotifs = JSON.parse(saved);
        } catch (e) {
          dynamicNotifs = [];
        }
      }
      
      const combined = [...dynamicNotifs, ...DEFAULT_NOTIFICATIONS].filter(n => {
        if (n.roleRestrict && n.roleRestrict !== user?.role) {
          return false;
        }
        return true;
      });
      setNotifications(combined);
    } else {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, [user]);

  const handleClearNotifications = () => {
    if (user?.client?.id) {
      localStorage.setItem(`pharma_notifications_${user.client.id}`, JSON.stringify([]));
      const combined = DEFAULT_NOTIFICATIONS.filter(n => {
        if (n.roleRestrict && n.roleRestrict !== user?.role) {
          return false;
        }
        return true;
      });
      setNotifications(combined);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          <p className="text-sm text-gray-500">Stay updated on your pharmacy operations.</p>
        </div>
        {notifications.some(n => n.roleRestrict) && (
          <button
            onClick={handleClearNotifications}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-xl transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Dynamic Alerts
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500 font-medium">
            No active notification alerts. All clear!
          </div>
        ) : (
          notifications.map((n, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-gray-200 transition">
              <div className={`p-3 rounded-full shrink-0 ${
                n.type === 'alert' ? 'bg-red-100 text-red-600' : 
                n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {n.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : 
                 n.type === 'warning' ? <Bell className="w-5 h-5" /> : 
                 <Package className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 leading-none">{n.title}</h3>
                  {n.roleRestrict && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {n.roleRestrict} Only
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
              <span className="text-xs text-gray-400 font-mono whitespace-nowrap">{n.time}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
