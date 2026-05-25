import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { salesData } from "@/src/data";
import { motion } from "motion/react";
import { Download } from "lucide-react";

export function SalesChart() {
  const [data, setData] = useState(salesData);

  // Memoize the data passed to Recharts to prevent unnecessary re-renders
  const chartData = useMemo(() => data, [data]);

  // Simulation of debounced data updates
  useEffect(() => {
    const timer = setTimeout(() => {
        // Logic to update data if needed (currently static)
        setData(salesData);
    }, 500);
    return () => clearTimeout(timer);
  }, [salesData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="col-span-2 rounded-2xl shadow-sm border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Analytics</CardTitle>
          <button className="flex items-center gap-2 text-sm text-emerald-700 font-semibold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition">
            <Download className="w-4 h-4" /> Export
          </button>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" name="Sales" fill="#4B9C7A" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#f59e0b" strokeWidth={3} dot={false} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
