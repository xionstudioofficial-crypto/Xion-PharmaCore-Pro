import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lowStockAlerts as DEFAULT_ALERTS } from "@/src/data";

interface LowStockAlertsProps {
  inventory?: any[];
}

export function LowStockAlerts({ inventory }: LowStockAlertsProps) {
  const displayAlerts = inventory
    ? inventory
        .filter(med => med.stock <= 15)
        .map(med => ({ name: med.name, stock: med.stock }))
    : DEFAULT_ALERTS;

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-150 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-gray-800">Low Stock Alerts</CardTitle>
        <span className="text-[10px] font-bold text-rose-650 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 animate-pulse">
          {displayAlerts.length} items
        </span>
      </CardHeader>
      <CardContent>
          {displayAlerts.length === 0 ? (
            <div className="text-center py-6 text-emerald-600 font-bold text-xs">
              ✓ All medicine stocks healthy!
            </div>
          ) : (
            displayAlerts.slice(0, 5).map(item => (
              <div key={item.name} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs text-slate-700 font-semibold">
                  <span>{item.name}</span>
                  <span className="font-bold text-rose-600">Stock: {item.stock}</span>
              </div>
            ))
          )}
      </CardContent>
    </Card>
  );
}
