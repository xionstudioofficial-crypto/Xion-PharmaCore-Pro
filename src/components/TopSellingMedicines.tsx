import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: 'Paracetamol 500mg', value: 400 },
  { name: 'Amoxicillin 250mg', value: 300 },
  { name: 'Cetirizine 10mg', value: 300 },
  { name: 'Ibuprofen 400mg', value: 200 },
  { name: 'Others', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function TopSellingMedicines() {
  return (
    <Card className="col-span-4 h-full rounded-2xl shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle>Top Selling Medicines</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
