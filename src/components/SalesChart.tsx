import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { salesData as DEFAULT_SALES } from "@/src/data";
import { motion } from "motion/react";
import { Download } from "lucide-react";

interface SalesChartProps {
  orders?: any[];
}

export function SalesChart({ orders = [] }: SalesChartProps) {
  // Map orders of local storage dynamically to chart points
  const computedData = useMemo(() => {
    if (!orders || orders.length === 0) return DEFAULT_SALES;

    const groups: { [day: string]: { sales: number; profit: number } } = {};
    
    // Initialize with default historical trendlines
    DEFAULT_SALES.forEach(pt => {
      groups[pt.day] = { sales: pt.sales, profit: pt.sales * 0.35 };
    });

    orders.forEach(ord => {
      if (ord.status !== "Completed") return;
      const amount = typeof ord.amount === "number"
        ? ord.amount
        : parseFloat(ord.amount.replace(/[^0-9.-]+/g, "")) || 0;
      
      const parts = ord.date ? ord.date.split(" ") : [];
      let dayKey = parts[0] || "26";
      
      // Clean leading zeroes for consistent key matching
      if (dayKey.startsWith("0") && dayKey.length > 1) {
        dayKey = dayKey.substring(1);
      }

      const profit = ord.items ? ord.items.reduce((sum: number, item: any) => {
        const cost = item.purchasePrice || (item.price * 0.5);
        return sum + (item.price - cost) * (item.quantity || 1);
      }, 0) : amount * 0.40;

      if (groups[dayKey]) {
        groups[dayKey].sales += amount;
        groups[dayKey].profit += profit;
      } else {
        groups[dayKey] = { sales: amount, profit };
      }
    });

    return Object.keys(groups)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => ({
        day: key.padStart(2, "0"),
        sales: Math.round(groups[key].sales),
        profit: Math.round(groups[key].profit)
      }))
      .slice(-15);
  }, [orders]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="col-span-2 rounded-2xl shadow-sm border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-1">
          <CardTitle className="text-sm font-bold text-gray-805">Sales Analytics</CardTitle>
          <button className="flex items-center gap-2 text-xs text-emerald-700 font-semibold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={computedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
              <Bar 
                dataKey="sales" 
                name="Gross Sales ($)" 
                fill="#047857" 
                radius={[4, 4, 0, 0]} 
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={100}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="profit" 
                name="Net Profits ($)" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]} 
                isAnimationActive={true}
                animationDuration={1500}
                animationBegin={300}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
