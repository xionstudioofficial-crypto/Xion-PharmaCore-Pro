import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { expiringSoon } from "@/src/data";

export function ExpiringSoon() {
  return (
    <Card className="col-span-4 h-full rounded-2xl shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expiring Soon</CardTitle>
        <button className="text-sm text-emerald-700">View All</button>
      </CardHeader>
      <CardContent>
          {expiringSoon.map(item => (
              <div key={item.name} className="flex justify-between py-2 border-b last:border-0">
                  <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">{item.daysLeft} days</span>
              </div>
          ))}
      </CardContent>
    </Card>
  );
}
