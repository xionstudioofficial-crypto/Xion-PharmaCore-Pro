import { 
  LayoutGrid, Pill, Package, ReceiptText, ShoppingCart, Users, User, Receipt, 
  BarChart, Settings, Bell, LineChart, ShieldCheck, CreditCard, ClipboardList,
  Database, Cpu
} from "lucide-react";

export const navItems = [
  { name: 'Dashboard', icon: LayoutGrid },
  { name: 'Enterprise Core Hub', icon: Cpu },
  { name: 'Medicines', icon: Pill },
  { name: 'Inventory', icon: Package },
  { name: 'Sales / Billing / Returns', icon: ReceiptText },
  { name: 'Purchases', icon: ShoppingCart },
  { name: 'Suppliers', icon: Users },
  { name: 'Customers', icon: User },
  { name: 'Expenses', icon: Receipt },
  { name: 'Reports', icon: BarChart },
  { name: 'Analytics', icon: LineChart },
  { name: 'Database Sync', icon: Database },
  { name: 'Batch Tracking', icon: Package },
  { name: 'Staff Management', icon: ShieldCheck },
  { name: 'Subscription', icon: CreditCard },
  { name: 'Notifications', icon: Bell },
  { name: 'Settings', icon: Settings },
];
