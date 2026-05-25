export interface KpiCardItem {
  title: string;
  value: string;
  change: string;
  type: string;
  icon: string;
  color: string;
}

export const kpiCards: KpiCardItem[] = [
  { title: "Total Sales", value: "$12,500.00", change: "+18.6%", type: "sales", icon: "ShoppingBag", color: "bg-emerald-100 text-emerald-600" },
  { title: "Total Medicines", value: "1,250", change: "+8.2%", type: "medicines", icon: "Pill", color: "bg-blue-100 text-blue-600" },
  { title: "Low Stock Items", value: "35", change: "-4.3%", type: "low-stock", icon: "AlertTriangle", color: "bg-orange-100 text-orange-600" },
  { title: "Expiring Soon", value: "18", change: "-2.1%", type: "expiring", icon: "Calendar", color: "bg-red-100 text-red-600" },
  { title: "Total Profit", value: "$4,320.00", change: "+22.5%", type: "profit", icon: "DollarSign", color: "bg-green-100 text-green-600" },
  { title: "Net Profit Margin", value: "34.5%", change: "+1.2%", type: "profit-margin", icon: "Percent", color: "bg-purple-100 text-purple-600" },
];

export const lowStockAlerts = [
  { name: "Paracetamol 500mg", stock: 8 },
  { name: "Amoxicillin 250mg", stock: 12 },
  { name: "Cetirizine 10mg", stock: 15 },
  { name: "Ibuprofen 400mg", stock: 10 },
];

export const expiringSoon = [
  { name: "Augmentin 625mg", date: "10 Jun 2024", daysLeft: 19 },
  { name: "Azithromycin 500mg", date: "15 Jun 2024", daysLeft: 24 },
  { name: "Metronidazole 400mg", date: "20 Jun 2024", daysLeft: 29 },
  { name: "Pantoprazole 40mg", date: "25 Jun 2024", daysLeft: 34 },
];

export const salesData = [
  { day: '01', sales: 4000 },
  { day: '02', sales: 6500 },
  { day: '03', sales: 4500 },
  { day: '04', sales: 5000 },
  { day: '05', sales: 3000 },
  { day: '06', sales: 5500 },
  { day: '07', sales: 5000 },
  { day: '08', sales: 6000 },
  { day: '09', sales: 9000 },
  { day: '10', sales: 4000 },
  { day: '11', sales: 5500 },
  { day: '12', sales: 4500 },
  { day: '13', sales: 6000 },
  { day: '14', sales: 8500 },
  { day: '15', sales: 5000 },
];

export const orders = [
  { id: "#ORD-001", customer: "John Doe", date: "20 May 2024", amount: "$125.00", status: "Completed" },
  { id: "#ORD-002", customer: "Jane Smith", date: "20 May 2024", amount: "$85.50", status: "Completed" },
  { id: "#ORD-003", customer: "Robert Brown", date: "20 May 2024", amount: "$210.00", status: "Completed" },
  { id: "#ORD-004", customer: "Emily Davis", date: "20 May 2024", amount: "$65.75", status: "Pending" },
];
