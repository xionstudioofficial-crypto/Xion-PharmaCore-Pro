import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: '01', profit: 4000 },
  { day: '05', profit: 3000 },
  { day: '10', profit: 5000 },
  { day: '15', profit: 4500 },
  { day: '20', profit: 6000 },
  { day: '25', profit: 5500 },
  { day: '30', profit: 7000 },
];

export function SalesOverview() {
  return (
    <Card className="col-span-4 h-full rounded-2xl shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle>Daily Revenue</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <XAxis dataKey="day" hide />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="var(--primary-green)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
