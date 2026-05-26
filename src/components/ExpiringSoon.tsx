import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { expiringSoon as DEFAULT_EXPIRING } from "@/src/data";

interface ExpiringSoonProps {
  inventory?: any[];
}

export function ExpiringSoon({ inventory }: ExpiringSoonProps) {
  const displayExpiring = inventory
    ? inventory
        .filter(med => {
          if (!med.expiryDate) return false;
          const daysLeft = Math.ceil((new Date(med.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return daysLeft > 0 && daysLeft <= 180;
        })
        .map(med => {
          const daysLeft = Math.ceil((new Date(med.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return {
            name: med.name,
            date: new Date(med.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            daysLeft
          };
        })
        .sort((a,b) => a.daysLeft - b.daysLeft)
    : DEFAULT_EXPIRING;

  return (
    <Card className="col-span-4 h-full rounded-2xl shadow-sm border border-gray-150 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-gray-800">Expiring Soon</CardTitle>
        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
          {displayExpiring.length} items
        </span>
      </CardHeader>
      <CardContent className="space-y-1">
          {displayExpiring.length === 0 ? (
            <div className="text-center py-6 text-emerald-605 font-bold text-xs">
              ✓ No near-expiry items!
            </div>
          ) : (
            displayExpiring.slice(0, 4).map(item => (
              <div key={item.name} className="flex justify-between py-2 border-b border-gray-50 last:border-0 items-center">
                  <div>
                      <p className="font-extrabold text-xs text-slate-700 leading-tight">{item.name}</p>
                      <p className="text-[10px] font-mono font-bold text-gray-400 mt-0.5">Expires: {item.date}</p>
                  </div>
                  <span className="text-[10px] font-black text-rose-650 bg-rose-50 px-2 py-1 rounded border border-rose-105">{item.daysLeft} days</span>
              </div>
            ))
          )}
      </CardContent>
    </Card>
  );
}
