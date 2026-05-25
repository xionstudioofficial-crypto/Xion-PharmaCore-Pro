import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lowStockAlerts } from "@/src/data";

export function LowStockAlerts() {
  return (
    <Card className="rounded-2xl shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Low Stock Alerts</CardTitle>
        <button className="text-sm text-emerald-700">View All</button>
      </CardHeader>
      <CardContent>
          {lowStockAlerts.map(item => (
              <div key={item.name} className="flex justify-between py-2 border-b last:border-0 text-sm">
                  <span>{item.name}</span>
                  <span className="font-semibold text-red-500">Stock: {item.stock}</span>
              </div>
          ))}
      </CardContent>
    </Card>
  );
}
