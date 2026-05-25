import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import * as Icons from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  type: string;
  icon: string;
  color: string;
}

export function KpiCard({ title, value, change, type, icon, color }: KpiCardProps) {
  const IconComponent = (Icons as any)[icon];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-2xl shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${color}`}>
                  {IconComponent && <IconComponent className="w-5 h-5" />}
              </div>
          </div>
          <div className="text-sm font-medium text-gray-500 mb-2">{title}</div>
          <div className="text-2xl font-bold mb-1">{value}</div>
          <p className={`text-xs font-semibold ${change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
            {change} from last month
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
