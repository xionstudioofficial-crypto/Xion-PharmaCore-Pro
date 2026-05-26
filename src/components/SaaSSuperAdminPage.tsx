import React, { useState } from 'react';
import { useAuth, PharmacyTenant, SaaSAnnouncement, SaaSTransaction, UserRole } from '@/src/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, DatabaseZap, CheckCircle, Radio, Calendar, Plus, Edit2, 
  Trash2, ShieldAlert, BadgeInfo, CreditCard, HelpCircle, Save, Info, AlertOctagon, 
  ArrowRight, Search, Activity, Volume2, Landmark, RefreshCcw, DollarSign, ListFilter, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function SaaSSuperAdminPage() {
  const { 
    tenants, addTenant, updateTenant, deleteTenant, 
    announcements, addAnnouncement, deleteAnnouncement, 
    transactions, addTransaction 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'pharmacies' | 'revenue' | 'broadcast'>('pharmacies');

  // Tenant Form States
  const [showAddProp, setShowAddProp] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState('');
  const [tenantDomain, setTenantDomain] = useState('');
  const [tenantPlan, setTenantPlan] = useState('Starter Plan (Trial)');
  const [tenantExpiry, setTenantExpiry] = useState('2026-06-25');
  const [tenantIsExpired, setTenantIsExpired] = useState(false);

  // Search filter
  const [pharmaciesSearch, setPharmaciesSearch] = useState('');

  // Announcement Form States
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annSeverity, setAnnSeverity] = useState<'info' | 'warning' | 'critical'>('info');

  // New Transaction Form States
  const [showTxForm, setShowTxForm] = useState(false);
  const [txTenantName, setTxTenantName] = useState('');
  const [txAmount, setTxAmount] = useState(49);
  const [txPlan, setTxPlan] = useState('Starter Plan');
  const [txMethod, setTxMethod] = useState<'PayPal' | 'JazzCash' | 'Easypaisa' | 'Pakistani Bank Transfer'>('JazzCash');

  // Package Management values
  const [starterPrice, setStarterPrice] = useState(49);
  const [proPrice, setProPrice] = useState(149);
  const [entPrice, setEntPrice] = useState(299);

  const [toast, setToast] = useState('');
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCreateTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !tenantDomain) return;

    addTenant({
      name: tenantName,
      domain: tenantDomain.toLowerCase().includes('.pharmacloud.co') ? tenantDomain.toLowerCase() : `${tenantDomain.toLowerCase().replace(/\s+/g, '')}.pharmacloud.co`,
      plan: tenantPlan,
      expiryDate: tenantExpiry,
      isExpired: tenantIsExpired
    });

    triggerToast(`SaaS Account created: Registered ${tenantName} to ${tenantPlan}`);
    // Reset
    setShowAddProp(false);
    setTenantName('');
    setTenantDomain('');
  };

  const handleUpdateTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenantId) return;

    updateTenant(editingTenantId, {
      name: tenantName,
      domain: tenantDomain,
      plan: tenantPlan,
      expiryDate: tenantExpiry,
      isExpired: tenantIsExpired
    });

    triggerToast(`Updated database records for ${tenantName}`);
    setEditingTenantId(null);
    setTenantName('');
    setTenantDomain('');
  };

  const handleStartEdit = (t: PharmacyTenant) => {
    setEditingTenantId(t.id);
    setTenantName(t.name);
    setTenantDomain(t.domain);
    setTenantPlan(t.plan);
    setTenantExpiry(t.expiryDate);
    setTenantIsExpired(t.isExpired);
  };

  const handleCancelEdit = () => {
    setEditingTenantId(null);
    setTenantName('');
    setTenantDomain('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Severe Safeguard Warning: Deleting the client tenant "${name}" will fully purge all localized branch schemas, sales receipts, and credentials. Proceed?`)) {
      deleteTenant(id);
      triggerToast(`Account suspended & deleted: ${name}`);
    }
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) return;

    addAnnouncement(annTitle, annMessage, annSeverity);
    triggerToast(`Broadcast notification dispatched: "${annTitle}" is now live.`);
    setAnnTitle('');
    setAnnMessage('');
  };

  const handleCreateTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTenantName) return;

    addTransaction({
      tenantName: txTenantName,
      date: new Date().toISOString().split('T')[0],
      amount: Number(txAmount),
      plan: txPlan,
      paymentMethod: txMethod,
      status: 'Completed'
    });

    triggerToast(`Payment tracked: Logged $${txAmount} via ${txMethod}`);
    setTxTenantName('');
    setShowTxForm(false);
  };

  // Compute metric numbers for visual graph cards
  const totalPharmacies = tenants.length;
  const activeSubs = tenants.filter(t => !t.isExpired && !t.plan.toLowerCase().includes('trial')).length;
  const expiredAccounts = tenants.filter(t => t.isExpired).length;
  const trialPlayers = tenants.filter(t => t.plan.toLowerCase().includes('trial')).length;
  
  // Custom Earnings Calc
  const monthlyEarnings = transactions
    .filter(tx => tx.status === 'Completed' && tx.date.startsWith('2026-05'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const aggregateSalesAcrossPlatform = totalPharmacies * 1450 + 2420; // Simulated backend sum of client databases

  // Recharts Chart Formats
  const billingStatsData = [
    { name: 'Starter Plan', Count: tenants.filter(t => t.plan.includes('Starter')).length, Revenue: tenants.filter(t => t.plan.includes('Starter')).length * starterPrice },
    { name: 'Professional Plan', Count: tenants.filter(t => t.plan.includes('Professional') || t.plan.includes('Premium')).length, Revenue: tenants.filter(t => t.plan.includes('Professional') || t.plan.includes('Premium')).length * proPrice },
    { name: 'Enterprise Plan', Count: tenants.filter(t => t.plan.includes('Enterprise')).length, Revenue: tenants.filter(t => t.plan.includes('Enterprise')).length * entPrice },
  ];

  const transactionChartData = [
    { date: '05-20', JazzCash: 98, EasyPaisa: 120, PayPal: 199, Bank: 240 },
    { date: '05-21', JazzCash: 147, EasyPaisa: 190, PayPal: 149, Bank: 450 },
    { date: '05-22', JazzCash: 192, EasyPaisa: 320, PayPal: 299, Bank: 500 },
    { date: '05-23', JazzCash: 245, EasyPaisa: 410, PayPal: 349, Bank: 790 },
    { date: '05-24', JazzCash: 310, EasyPaisa: 440, PayPal: 498, Bank: 980 },
    { date: '05-25', JazzCash: 350, EasyPaisa: 512, PayPal: 590, Bank: 1250 },
    { date: '05-26', JazzCash: 539, EasyPaisa: 641, PayPal: 799, Bank: 1540 },
  ];

  // Visual filters
  const filteredPharmacies = tenants.filter(t => 
    t.name.toLowerCase().includes(pharmaciesSearch.toLowerCase()) || 
    t.domain.toLowerCase().includes(pharmaciesSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Toast popup */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-[#09352F] border border-[#A7D129]/30 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50 font-bold"
          >
            <CheckCircle className="w-4 h-4 text-[#A7D129]" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main SaaS Banner */}
      <div className="bg-[#09352F] text-white p-6 rounded-3xl border border-emerald-800/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-[#A7D129]/15 text-[#A7D129] font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-[#A7D129]/20">
            System Console: Master SaaS Admin Control Center
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white mt-2">
            PharmaScript SaaS Gateway (Super Admin)
          </h1>
          <p className="text-xs text-emerald-100 opacity-85 mt-1">
            Global network performance tracker. Deploy client branch databases, oversee active platform recurring revenues, check Pakistani payment gateways and issue broadcast announcements.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('pharmacies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'pharmacies' ? 'bg-[#A7D129] text-[#09352F]' : 'bg-emerald-800/20 text-white hover:bg-emerald-800/40'
            }`}
          >
            Branch Tenants ({tenants.length})
          </button>
          <button 
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'revenue' ? 'bg-[#A7D129] text-[#09352F]' : 'bg-emerald-800/20 text-white hover:bg-emerald-800/40'
            }`}
          >
            Revenue & Billing
          </button>
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'broadcast' ? 'bg-[#A7D129] text-[#09352F]' : 'bg-emerald-800/20 text-white hover:bg-emerald-800/40'
            }`}
          >
            Live Announcements & Feeds
          </button>
        </div>
      </div>

      {/* SaaS Analytical Dashboard Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Total Pharmacies</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-gray-800">{totalPharmacies}</span>
            <span className="text-[9px] text-emerald-600 font-extrabold font-mono">100% On-Grid</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">Isolated VM namespaces</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Active Subs</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-gray-800">{activeSubs}</span>
            <span className="text-[9px] text-emerald-600 font-extrabold font-mono">Paid Clusters</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">Billed monthly recurring</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs">
          <span className="text-[10px] font-bold text-rose-500 uppercase block tracking-wider">Expired / Suspended</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-rose-600">{expiredAccounts}</span>
            <span className="text-[9px] text-rose-500 font-extrabold font-mono">Action Needed</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">Suspended user roles</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs">
          <span className="text-[10px] font-bold text-indigo-500 uppercase block tracking-wider">Trial Users</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-indigo-600">{trialPlayers}</span>
            <span className="text-[9px] text-indigo-400 font-extrabold font-mono">30-Day Active</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">Automatic trial expiration</p>
        </div>

        <div className="bg-[#09352F]/5 p-4 rounded-2xl border border-[#09352F]/10 shadow-xs">
          <span className="text-[10px] font-bold text-[#09352F] uppercase block tracking-wider">Monthly Income</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-emerald-800">${monthlyEarnings}</span>
            <span className="text-[9px] text-emerald-700 font-extrabold font-mono">Live Recv</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">Via local banks & apps</p>
        </div>

        <div className="bg-[#09352F]/5 p-4 rounded-2xl border border-[#09352F]/10 shadow-xs">
          <span className="text-[10px] font-bold text-[#09352F] uppercase block tracking-wider">Platform Rx Sales</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-gray-800">${aggregateSalesAcrossPlatform}</span>
            <span className="text-[9px] text-emerald-600 font-extrabold font-mono">+12.4%</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">Aggregated chemist database</p>
        </div>

      </div>

      {/* Main interactive Tab content switch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ======================= TAB 1: PHARMACIES TENANT CONTROL ROOM ======================= */}
        {activeTab === 'pharmacies' && (
          <>
            {/* Left table view: Manage pharmacies */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
                
                {/* Header operations for table */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Pharmacy SaaS Account Directory</h3>
                    <p className="text-[11px] text-gray-400">View and update localized SaaS instances isolated dynamically by tenant key hashes.</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search domain or tenant..." 
                        value={pharmaciesSearch}
                        onChange={e => setPharmaciesSearch(e.target.value)}
                        className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl outline-none focus:border-emerald-600 w-full font-medium"
                      />
                    </div>

                    <button
                      onClick={() => setShowAddProp(true)}
                      className="flex items-center gap-1 bg-[#09352F] hover:bg-[#11574d] text-white px-3 py-2 text-xs font-bold rounded-xl cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#A7D129]" /> Register Pharmacy
                    </button>
                  </div>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-3.5 text-left">Internal ID</th>
                        <th className="px-5 py-3.5 text-left">Pharmacy Name</th>
                        <th className="px-5 py-3.5 text-left">Isolated Subdomain</th>
                        <th className="px-5 py-3.5 text-left">Current Plan</th>
                        <th className="px-5 py-3.5 text-left">Expires At</th>
                        <th className="px-5 py-3.5 text-center">Security Switcher / Status</th>
                        <th className="px-5 py-3.5 text-right font-semibold">Workspace Provision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                      {filteredPharmacies.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-5 py-4 font-mono font-bold text-gray-400">{t.id}</td>
                          <td className="px-5 py-4">
                            <span className="font-extrabold text-gray-800 block">{t.name}</span>
                            <span className="text-[10px] text-gray-400">Database Connection: SQLite Isolated</span>
                          </td>
                          <td className="px-5 py-4 font-mono text-[#09352F] font-bold">
                            <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{t.domain}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-black uppercase tracking-wider ${
                              t.plan.includes('Enterprise') ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                              t.plan.includes('Professional') || t.plan.includes('Premium') ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {t.plan}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500 font-mono text-[11px]">{t.expiryDate}</td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => {
                                updateTenant(t.id, { isExpired: !t.isExpired });
                                triggerToast(`Toggled activation status for ${t.name}`);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase cursor-pointer border transition ${
                                t.isExpired 
                                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                                  : 'bg-emerald-50 border-emerald-150 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {t.isExpired ? '● SUSPENDED (Block)' : '● ACTIVE (Ready)'}
                            </button>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleStartEdit(t)}
                                className="text-gray-400 hover:text-emerald-700 p-1 cursor-pointer transition"
                                title="Edit Tenant configurations"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(t.id, t.name)}
                                className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer transition"
                                title="De-provision Workspace"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredPharmacies.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-xs">
                            No match found for "{pharmaciesSearch}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Right column Form panel: Create / Edit account */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Form container */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#09352F]" />
                    <span>{editingTenantId ? 'Update ERP Account' : 'Provision New ERP Branch'}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {editingTenantId ? 'Apply subscription, domain isolation, and billing criteria updates.' : 'Deploy a new completely isolated database tenant directly from the master panel.'}
                  </p>
                </div>

                <form onSubmit={editingTenantId ? handleUpdateTenantSubmit : handleCreateTenantSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pharmacy Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Shalimar Pharmacy Inc."
                      value={tenantName}
                      onChange={e => setTenantName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Client Domain Prefix</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        disabled={!!editingTenantId}
                        placeholder="e.g. shalimar"
                        value={tenantDomain.replace('.pharmacloud.co', '')}
                        onChange={e => setTenantDomain(e.target.value.toLowerCase())}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold outline-none pr-32 disabled:opacity-60"
                      />
                      <span className="absolute right-3 top-3 text-[10px] text-gray-400 font-mono font-bold select-none">.pharmacloud.co</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Select Plan Level</label>
                      <select
                        value={tenantPlan}
                        onChange={e => setTenantPlan(e.target.value)}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none cursor-pointer"
                      >
                        <option value="Starter Plan (Trial)">Starter (30d Trial)</option>
                        <option value="Professional Plan">Professional Plan</option>
                        <option value="Enterprise Plan">Enterprise SaaS</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Expiry Date</label>
                      <input 
                        type="date" 
                        required
                        value={tenantExpiry}
                        onChange={e => setTenantExpiry(e.target.value)}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none font-mono cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <input 
                      type="checkbox"
                      id="suspendCheck"
                      checked={tenantIsExpired}
                      onChange={e => setTenantIsExpired(e.target.checked)}
                      className="w-4 h-4 text-emerald-700 accent-emerald-500 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="suspendCheck" className="text-[10.5px] font-bold text-gray-600 cursor-pointer select-none">
                      Suspend Account Immediately and Block User Access
                    </label>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    {editingTenantId && (
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-650 font-bold py-3 rounded-xl text-xs transition cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="flex-1 bg-[#09352F] hover:bg-[#11574d] text-white font-black py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Save className="w-4 h-4 text-[#A7D129]" />
                      <span>{editingTenantId ? 'Save Configuration' : 'Deploy Tenant'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Safe storage spec indicator */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2">
                <span className="text-[9.5px] text-[#A7D129] font-black uppercase tracking-widest block">Local Storage Persistence Loop</span>
                <p className="text-[10.5px] leading-relaxed">
                  The SaaS multi-tenancy directory utilizes automatic localized browser serialization to replicate standard corporate database behaviors. This enables robust simulated live deployments.
                </p>
              </div>

            </div>
          </>
        )}

        {/* ======================= TAB 2: REVENUE, PACKAGES & PAYMENT TRACKING ======================= */}
        {activeTab === 'revenue' && (
          <>
            {/* Left section: Visual Earnings graph and payment tracking ledger */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Responsive Container BarChart */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-gray-800">SaaS Earnings Breakdown</h3>
                  <p className="text-[11px] text-gray-400">Monthly subscription income projections based on tier allocation indexes ($ USD equivalents).</p>
                </div>

                <div className="p-2 border rounded-2xl bg-gray-50/50">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={billingStatsData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={10} fontStyle="bold" />
                        <YAxis fontSize={10} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                        <Bar dataKey="Revenue" fill="#09352F" radius={[8, 8, 0, 0]} name="Expected Monthly USD" />
                        <Bar dataKey="Count" fill="#A7D129" radius={[8, 8, 0, 0]} name="Allocated Clients" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Transactions Tabular Ledger */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">Payment Gateways Log</h3>
                    <p className="text-[10.5px] text-gray-450">Realtime subscription ledger tracking Pakistani and International clearings.</p>
                  </div>
                  
                  <button
                    onClick={() => setShowTxForm(true)}
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 px-3 py-2 rounded-xl text-xs text-emerald-800 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Track Manual Payment
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#09352F]/5 text-slate-600 font-extrabold uppercase tracking-wider text-[9px]">
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Transaction ID</th>
                        <th className="px-4 py-3 text-left">Client Tenant Name</th>
                        <th className="px-4 py-3 text-left">SaaS Plan level</th>
                        <th className="px-4 py-3 text-right">Cleared Amount</th>
                        <th className="px-4 py-3 text-center">Payment Channel</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3.5 font-mono text-gray-400 font-bold">{tx.id}</td>
                          <td className="px-4 py-3.5 text-gray-850 font-extrabold">{tx.tenantName}</td>
                          <td className="px-4 py-3.5 text-gray-500 font-sans">{tx.plan}</td>
                          <td className="px-4 py-3.5 text-right font-mono font-black text-gray-800">${tx.amount}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] text-zinc-700 font-bold">
                              {tx.paymentMethod === 'PayPal' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                              {tx.paymentMethod === 'JazzCash' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                              {tx.paymentMethod === 'Easypaisa' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                              {tx.paymentMethod === 'Pakistani Bank Transfer' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                              <span>{tx.paymentMethod}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black tracking-wide uppercase ${
                              tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

            {/* Right section: Price package customizer & Live Pakistani Banks overview */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Simulated Price Manager */}
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#09352F] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" /> Package Price Index Manager
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Update current licensing fees. Prompts to renew within other tenants adapt immediately to these fee structures.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">Starter Plan (30d Trial)</span>
                      <span className="text-xs font-black text-gray-800">Basic single-branch dispensing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-xs font-mono">$</span>
                      <input 
                        type="number" 
                        value={starterPrice}
                        onChange={e => setStarterPrice(Number(e.target.value))}
                        className="w-14 bg-white p-1 rounded font-mono font-bold text-xs border text-right"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">Professional Plan</span>
                      <span className="text-xs font-black text-gray-800">Advanced inventory + drug lookups</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-xs font-mono">$</span>
                      <input 
                        type="number" 
                        value={proPrice}
                        onChange={e => setProPrice(Number(e.target.value))}
                        className="w-14 bg-white p-1 rounded font-mono font-bold text-xs border text-right"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">Enterprise Plan</span>
                      <span className="text-xs font-black text-gray-800">Offline failover & Postgres replication</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-xs font-mono">$</span>
                      <input 
                        type="number" 
                        value={entPrice}
                        onChange={e => setEntPrice(Number(e.target.value))}
                        className="w-14 bg-white p-1 rounded font-mono font-bold text-xs border text-right"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => triggerToast("Pricing matrices updated. Automated SaaS invoicing rules saved.")}
                    className="w-full bg-[#09352F] text-white font-black text-xs py-2.5 rounded-xl block cursor-pointer text-center"
                  >
                    Save Tier Settings
                  </button>
                </div>
              </div>

              {/* Pakistani micro-payment integration showcase */}
              <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3 text-xs leading-relaxed">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#A7D129]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A7D129]">Local Integrations Matrix</span>
                </div>
                <p className="text-slate-300 font-medium">
                  We support Pakistan currency gateways automatically processing transaction parameters for:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="bg-slate-950 p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="font-extrabold text-[#A7D129]">Easypaisa Api</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Instant OTC & Telenor billing API v3.4</span>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="font-extrabold text-[#A7D129]">JazzCash API</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Mobilink Direct USSD & wallet push logs</span>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-white/5 flex flex-col justify-between col-span-2">
                    <span className="font-extrabold text-white">All Pakistani Commercial Banks</span>
                    <span className="text-[9px] text-slate-400">HBL Bank Alfalah, Allied Bank, Allied Pay APIs mapped</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Transaction modal tracker */}
            {showTxForm && (
              <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-xs font-sans">
                <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-slate-800 shadow-2xl space-y-5 border border-slate-200">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-md">Add Manual Transaction</h3>
                    <p className="text-xs text-gray-500">Track peer-to-peer bank transfers, cash clearings or PayPal manually.</p>
                  </div>

                  <form onSubmit={handleCreateTxSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Client Branch Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. CareFirst Dispensary" 
                        value={txTenantName}
                        onChange={e => setTxTenantName(e.target.value)}
                        className="w-full text-xs p-2 bg-gray-50 border rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Amount ($)</label>
                        <input 
                          type="number" 
                          required
                          value={txAmount}
                          onChange={e => setTxAmount(Number(e.target.value))}
                          className="w-full text-xs p-2 bg-gray-50 border rounded-xl font-mono text-right"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Allocated Plan</label>
                        <input 
                          type="text" 
                          required
                          value={txPlan}
                          onChange={e => setTxPlan(e.target.value)}
                          className="w-full text-xs p-2 bg-gray-50 border rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Payment clearing gateway</label>
                      <select
                        value={txMethod}
                        onChange={e => setTxMethod(e.target.value as any)}
                        className="w-full text-xs p-2 bg-gray-50 border rounded-xl"
                      >
                        <option value="JazzCash">JazzCash (Pakistan)</option>
                        <option value="Easypaisa">Easypaisa (Pakistan)</option>
                        <option value="PayPal">PayPal Commerce</option>
                        <option value="Pakistani Bank Transfer">Pakistani Bank Transfer</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowTxForm(false)}
                        className="flex-1 bg-gray-150 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Discard
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold"
                      >
                        Approve Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================= TAB 3: ANNOUNCEMENT BROADCASTER & LIVE OPERATIONS ======================= */}
        {activeTab === 'broadcast' && (
          <>
            {/* Left section: Dispatcher form and current broadcasts list */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-gray-800">Global System Broadcaster</h3>
                  <p className="text-[11px] text-gray-400">Broadcast immediate banners, alerts, or status notices. Broadcaster is hooked dynamically; tenants view notifications immediately upon receipt.</p>
                </div>

                <form onSubmit={handleAnnouncementSubmit} className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Notice Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Mandatory Security System Upgrades"
                      value={annTitle}
                      onChange={e => setAnnTitle(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">System Message</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Specify background details, required actions, or platform notes..."
                      value={annMessage}
                      onChange={e => setAnnMessage(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl font-medium outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#09352F]">Severity Level:</span>
                      <div className="flex gap-1.5">
                        {(['info', 'warning', 'critical'] as const).map(sev => (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => setAnnSeverity(sev)}
                            className={`px-3 py-1 text-[10px] font-bold capitalize rounded-lg border transition ${
                              annSeverity === sev 
                                ? 'bg-[#09352F] border-[#A7D129] text-[#A7D129]' 
                                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#A7D129]" /> Dispatch Broadcast
                    </button>
                  </div>
                </form>

                {/* List of active broadcasts */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Live Active Broadcast Feed</span>
                  
                  {announcements.map(ann => (
                    <div 
                      key={ann.id}
                      className={`p-4 rounded-2xl border flex justify-between items-start gap-3 transition ${
                        ann.severity === 'critical' ? 'bg-rose-50 border-rose-150 text-rose-800' :
                        ann.severity === 'warning' ? 'bg-amber-50 border-amber-150 text-amber-850' :
                        'bg-sky-50 border-sky-150 text-sky-850'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            ann.severity === 'critical' ? 'bg-rose-600 text-white' :
                            ann.severity === 'warning' ? 'bg-amber-600 text-white' : 'bg-sky-600 text-white'
                          }`}>
                            {ann.severity}
                          </span>
                          <span className="font-extrabold text-xs">{ann.title}</span>
                          <span className="text-[10px] font-mono text-gray-400 font-bold">{ann.date}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed max-w-2xl">{ann.message}</p>
                      </div>

                      <button 
                        onClick={() => {
                          deleteAnnouncement(ann.id);
                          triggerToast("Announcement deleted from globally broadcasted list.");
                        }}
                        className="text-gray-400 hover:text-rose-600 transition p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {announcements.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs border border-dashed rounded-2xl">
                      No active broadcast announcements live.
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Right section: Simulated active platform sessions globally */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#09352F] flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-700 animate-pulse" /> Active Session Monitors
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Live telemetry tracking active concurrently authenticated worker node shells securely linked back to our Cloud Run containers.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-[10px] pt-2">
                  
                  <div className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                    <div>
                      <span className="font-extrabold text-gray-700 block text-[10.5px]">Apex Global Pharmacy</span>
                      <span className="text-gray-400 text-[9.5px]">User: MARCUS CHEN (Pharmacist)</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-extrabold animate-pulse">● TLS ACTIVE</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                    <div>
                      <span className="font-extrabold text-gray-700 block text-[10.5px]">CareFirst Dispensary</span>
                      <span className="text-gray-400 text-[9.5px]">User: JORDAN HAYES (Sales/Cashier)</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-extrabold animate-pulse">● TLS ACTIVE</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                    <div>
                      <span className="font-extrabold text-slate-400 block text-[10.5px]">GreenCross Medicare</span>
                      <span className="text-gray-400 text-[9.5px] line-through">User: NONE (Plan Switched Off)</span>
                    </div>
                    <span className="bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded text-[8px] font-extrabold">● SUSPENDED</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                    <div>
                      <span className="font-extrabold text-gray-700 block text-[10.5px]">Zia-Ul-Haq Medicare Center</span>
                      <span className="text-gray-400 text-[9.5px]">User: DR. REHMAN (Owner)</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-extrabold animate-pulse">● TLS ACTIVE</span>
                  </div>

                </div>

                <div className="p-3 bg-zinc-900 text-[#A7D129] rounded-2xl border font-mono text-[9px] leading-relaxed">
                  {`CONTAINER_INGRESS: PORT 3000\nWEBSOCKET_TUNNEL: OK\nACTIVE_CONCURRENCY: 3 NODES LIVE\nSSL_CERT: EXPIRY 2027`}
                </div>
              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
}
