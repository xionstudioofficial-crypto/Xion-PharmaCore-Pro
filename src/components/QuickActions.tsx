import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, ShoppingCart, Receipt, BarChart, Users, Calendar } from "lucide-react";

export function QuickActions({ onExpiryUpdate }: { onExpiryUpdate: () => void }) {
    const actions = [
        { name: "Add Medicine", icon: Pill },
        { name: "New Sale", icon: ShoppingCart },
        { name: "Expiry Update", icon: Calendar, onClick: onExpiryUpdate },
        { name: "Add Expense", icon: Receipt },
        { name: "View Reports", icon: BarChart },
        { name: "Add Supplier", icon: Users },
    ];
  return (
    <Card className="col-span-4 h-full rounded-2xl shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        {actions.map(action => (
            <button key={action.name} onClick={action.onClick} className="flex flex-col items-center justify-center gap-2 p-4 border rounded-xl hover:bg-emerald-50 transition">
                <action.icon className="w-6 h-6 text-emerald-700" />
                <span className="text-xs font-semibold">{action.name}</span>
            </button>
        ))}
      </CardContent>
    </Card>
  );
}
