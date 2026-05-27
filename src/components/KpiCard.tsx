import React from "react";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  type: string;
  icon: string;
  color: string;
}

interface StyleConfig {
  iconColor: string;
  iconBg: string;
  gradientId: string;
  gradientFrom: string;
  gradientTo: string;
  sparklinePath: string;
  trendColor: string;
  pillColor: string;
}

const TYPE_CONFIGS: Record<string, StyleConfig> = {
  sales: {
    iconColor: "text-[#1F7A5A]",
    iconBg: "bg-emerald-50/80 border border-emerald-100/50 shadow-[0_2px_10px_rgba(31,122,90,0.05)]",
    gradientId: "sales-grad",
    gradientFrom: "#1F7A5A",
    gradientTo: "#A7D129",
    sparklinePath: "M 0 32 T 30 22 T 60 28 T 100 12 T 140 18 T 180 8 T 200 6",
    trendColor: "#1F7A5A",
    pillColor: "bg-emerald-50 text-[#1F7A5A] border border-emerald-100/30"
  },
  medicines: {
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50/80 border border-blue-100/50 shadow-[0_2px_10px_rgba(59,130,246,0.05)]",
    gradientId: "meds-grad",
    gradientFrom: "#2563EB",
    gradientTo: "#60A5FA",
    sparklinePath: "M 0 28 T 40 18 T 80 22 T 120 10 T 160 14 T 200 8",
    trendColor: "#2563EB",
    pillColor: "bg-blue-50 text-blue-700 border border-blue-100/30"
  },
  "low-stock": {
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50/80 border border-amber-100/50 shadow-[0_2px_10px_rgba(217,119,6,0.05)]",
    gradientId: "stock-grad",
    gradientFrom: "#D97706",
    gradientTo: "#F59E0B",
    sparklinePath: "M 0 6 T 40 12 T 80 18 T 120 28 T 160 32 T 200 36",
    trendColor: "#D97706",
    pillColor: "bg-amber-50 text-amber-700 border border-amber-100/30"
  },
  expiring: {
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50/80 border border-rose-100/50 shadow-[0_2px_10px_rgba(225,29,72,0.05)]",
    gradientId: "expiry-grad",
    gradientFrom: "#E11D48",
    gradientTo: "#FB7185",
    sparklinePath: "M 0 8 T 40 14 T 80 20 T 120 26 T 160 30 T 200 34",
    trendColor: "#E11D48",
    pillColor: "bg-rose-50 text-rose-750 border border-rose-100/30"
  },
  profit: {
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50/80 border border-emerald-100/50 shadow-[0_2px_10px_rgba(16,185,129,0.05)]",
    gradientId: "profit-grad",
    gradientFrom: "#059669",
    gradientTo: "#34D399",
    sparklinePath: "M 0 35 T 30 30 T 65 20 T 100 15 T 140 6 T 180 8 T 200 2",
    trendColor: "#059669",
    pillColor: "bg-emerald-50 text-emerald-700 border border-emerald-100/30"
  },
  "profit-margin": {
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50/80 border border-purple-100/50 shadow-[0_2px_10px_rgba(139,92,246,0.05)]",
    gradientId: "margin-grad",
    gradientFrom: "#7C3AED",
    gradientTo: "#A78BFA",
    sparklinePath: "M 0 24 T 40 20 T 80 18 T 120 12 T 160 10 T 200 6",
    trendColor: "#7C3AED",
    pillColor: "bg-purple-50 text-purple-700 border border-purple-100/30"
  }
};

export function KpiCard({ title, value, change, type, icon }: KpiCardProps) {
  // Safe Icon Lookup with fallback
  const IconComponent = (Icons as any)[icon] || AlertCircle;
  
  // Style config fallback
  const config = TYPE_CONFIGS[type] || TYPE_CONFIGS["sales"];
  
  // Check trend pattern
  const isNegative = change.startsWith("-") || change === "Alert";
  const isAlert = change === "Alert" || change === "Warning";
  const trendLabel = isAlert ? "Require Focus" : (isNegative ? "vs prev month" : "vs last month");

  const fillPath = `${config.sparklinePath} L 200 40 L 0 40 Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-[22px] p-4 border border-gray-150 shadow-[0_1px_3px_rgba(0,0,0,0.01),0_8px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(31,122,90,0.06)] hover:border-[#1F7A5A]/15 transition-all duration-300 relative overflow-hidden flex flex-col min-h-[148px] select-none group"
    >
      {/* Top Row: Icon Container + Small Growth Badge */}
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl flex items-center justify-center ${config.iconBg} transition-transform duration-300 group-hover:scale-105`}>
          <IconComponent className={`w-4.5 h-4.5 ${config.iconColor}`} />
        </div>

        {/* Change Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${config.pillColor}`}>
          {isAlert ? (
            <span className="animate-pulse flex items-center gap-1">⚠️ Alert</span>
          ) : (
            <>
              {isNegative ? (
                <TrendingDown className="w-3 h-3 text-rose-500" />
              ) : (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              )}
              <span>{change}</span>
            </>
          )}
        </div>
      </div>

      {/* Center Row: Key Stats & Labels */}
      <div className="mt-4 flex-1 flex flex-col justify-end">
        <div className="text-[22px] sm:text-2xl font-extrabold text-slate-800 tracking-tight font-sans leading-none select-text">
          {value}
        </div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
          {title}
        </div>
      </div>

      {/* Bottom Area: Trend Muted comparison + Gorgeous Inline SVG Sparkline */}
      <div className="flex items-end justify-between mt-3 pt-2.5 border-t border-slate-50">
        <span className="text-[10px] font-bold text-gray-450 tracking-wide font-sans shrink-0">
          {trendLabel}
        </span>

        {/* Clinical Neon Gradient Sparkline */}
        <div className="w-20 h-7 text-right shrink-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={config.gradientFrom} />
                <stop offset="100%" stopColor={config.gradientTo} />
              </linearGradient>
              <linearGradient id={`${config.gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.gradientFrom} stopOpacity={0.16} />
                <stop offset="100%" stopColor={config.gradientTo} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Glowing path backgrounds */}
            <path
              d={fillPath}
              fill={`url(#${config.gradientId}-fill)`}
              className="transition-all duration-500"
            />
            <motion.path
              d={config.sparklinePath}
              fill="none"
              stroke={`url(#${config.gradientId})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
