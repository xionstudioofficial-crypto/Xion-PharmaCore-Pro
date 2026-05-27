import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart2, DollarSign, Layers } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  category?: string;
  batchNumber?: string;
  expiryDate?: string;
  stock: number;
  price: number;
  purchasePrice?: number;
  barcode?: string;
  image?: string;
  supplier?: string;
}

interface StockCategoryChartProps {
  inventory: Medicine[];
}

export function StockCategoryChart({ inventory }: StockCategoryChartProps) {
  const [metric, setMetric] = useState<"stock" | "value" | "count">("stock");

  const chartData = useMemo(() => {
    const categoriesList = [
      "Analgesics / Pain Relief",
      "Antibiotics",
      "Antihistamines",
      "Cardiovascular",
      "Respiratory",
      "Vitamins / Supplements",
      "Gastrointestinal",
      "Others"
    ];

    const dataMap: { [key: string]: { stock: number; value: number; count: number } } = {};
    
    // Initialize
    categoriesList.forEach(cat => {
      dataMap[cat] = { stock: 0, value: 0, count: 0 };
    });

    inventory.forEach(item => {
      const cat = item.category || "Others";
      const stockVal = item.stock || 0;
      const priceVal = item.price || 0;
      
      if (dataMap[cat] === undefined) {
        if (!dataMap["Others"]) {
          dataMap["Others"] = { stock: 0, value: 0, count: 0 };
        }
        dataMap["Others"].stock += stockVal;
        dataMap["Others"].value += stockVal * priceVal;
        dataMap["Others"].count += 1;
      } else {
        dataMap[cat].stock += stockVal;
        dataMap[cat].value += stockVal * priceVal;
        dataMap[cat].count += 1;
      }
    });

    return categoriesList.map(cat => {
      // Shorten category names to fit nicely on the X axis
      const displayName = cat
        .replace("Analgesics / Pain Relief", "Analgesics")
        .replace("Vitamins / Supplements", "Vitamins")
        .replace("Gastrointestinal", "Gastro");

      return {
        category: displayName,
        fullName: cat,
        stock: dataMap[cat].stock,
        value: parseFloat(dataMap[cat].value.toFixed(2)),
        count: dataMap[cat].count
      };
    });
  }, [inventory]);

  // Metric-specific config
  const metricConfig = {
    stock: {
      name: "Stock Quantity (Units)",
      color: "#047857",
      hoverColor: "#065f46"
    },
    value: {
      name: "Estimated Stock Value ($)",
      color: "#2563eb",
      hoverColor: "#1d4ed8"
    },
    count: {
      name: "Formulation Count",
      color: "#d97706",
      hoverColor: "#b45309"
    }
  };

  const activeConfig = metricConfig[metric];

  // Custom Tooltip component for beautiful visual tracking
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-850 shadow-xl text-xs space-y-1.5 font-sans">
          <p className="font-extrabold text-sm border-b border-slate-800 pb-1.5 text-white">{data.fullName}</p>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Total Stock Qty:</span>
            <span className="font-bold text-emerald-400">{data.stock} units</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Estimated Value:</span>
            <span className="font-bold text-blue-400">${data.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Total Formulations:</span>
            <span className="font-bold text-amber-450 text-amber-500">{data.count} items</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-3xl shadow-xs border border-gray-100 bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-4">
        <div>
          <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-700" />
            <span>Inventory Assets Analytics</span>
          </CardTitle>
          <p className="text-xs text-gray-400 font-medium mt-1">Breakdown of stock volumes and financial value by pharmaceutical classification</p>
        </div>
        
        {/* Modern multi-state segment selector */}
        <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 select-none w-fit">
          <button
            type="button"
            onClick={() => setMetric("stock")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
              metric === "stock"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stock Levels</span>
          </button>
          <button
            type="button"
            onClick={() => setMetric("value")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
              metric === "value"
                ? "bg-white text-blue-800 shadow-xs"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Asset Value</span>
          </button>
          <button
            type="button"
            onClick={() => setMetric("count")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
              metric === "count"
                ? "bg-white text-amber-805 text-amber-800 shadow-xs"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Formulations</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
            <XAxis 
              dataKey="category" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 240, 0.4)' }} />
            <Bar 
              dataKey={metric}
              name={activeConfig.name}
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activeConfig.color}
                  className="transition-colors duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
