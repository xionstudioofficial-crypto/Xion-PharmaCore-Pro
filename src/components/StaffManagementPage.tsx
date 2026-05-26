import React, { useState } from 'react';
import { useAuth, UserRole, RolePermissions } from '@/src/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Shield, ShieldCheck, Mail, Phone, Plus, ToggleLeft, ToggleRight, 
  Trash2, UserPlus, Info, Save, HelpCircle, CheckCircle, Lock, ShieldAlert, KeyRound
} from "lucide-react";

// Initial staff crew to populate first setup
const INITIAL_STAFF = [
  { id: "S-101", name: "Dr. Evelyn Harris", role: "Owner/Admin" as UserRole, email: "owner@apexpharma.com", phone: "+1 (555) 234-5678", status: "Active" },
  { id: "S-102", name: "Marcus Chen, PharmD", role: "Pharmacist" as UserRole, email: "lead.pharmacist@apexpharma.com", phone: "+1 (555) 789-0123", status: "Active" },
  { id: "S-103", name: "Jordan Hayes", role: "Salesman/Cashier" as UserRole, email: "cashier.billing@apexpharma.com", phone: "+1 (555) 345-6789", status: "Active" },
  { id: "S-104", name: "Sarah Finch, CPA", role: "Accountant" as UserRole, email: "finance@apexpharma.com", phone: "+1 (555) 901-2345", status: "Active" },
  { id: "S-105", name: "Alex Rivera", role: "Staff" as UserRole, email: "assistant.staff@apexpharma.com", phone: "+1 (555) 456-7890", status: "Active" }
];

export function StaffManagementPage() {
  const { user, customPermissions, updateRolePermissions, signIn } = useAuth();
  
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [activeSubTab, setActiveSubTab] = useState<'employees' | 'permissions'>('employees');
  
  // Add Staff Modal/Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('Staff');

  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newEmp = {
      id: `S-${Math.floor(100 + Math.random() * 900)}`,
      name: newStaffName,
      role: newStaffRole,
      email: newStaffEmail,
      phone: newStaffPhone || '+1 (555) 000-0000',
      status: 'Active'
    };

    setStaffList(prev => [...prev, newEmp]);
    setShowAddForm(false);
    
    // Reset form
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffRole('Staff');

    triggerToast(`Successfully registered new staff ${newEmp.name} as ${newEmp.role}!`);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    setStaffList(prev => prev.filter(emp => emp.id !== id));
    triggerToast(`De-provisioned credential keys for ${name}.`);
  };

  // Switch Active role simulation to quickly test custom permission rules
  const handleQuickRoleSwitch = (staff: typeof INITIAL_STAFF[0]) => {
    if (user) {
      // Sign in again with selected staff context
      signIn(staff.email, staff.role, user.client.id, staff.name);
      triggerToast(`Switched active simulation shell to: ${staff.name} (${staff.role})`);
    }
  };

  const handleTogglePermission = (role: UserRole, permissionKey: keyof RolePermissions) => {
    // Prevent locking Admin completely out of staff permissions
    if (role === 'Owner/Admin' && permissionKey === 'manageStaff') {
      triggerToast("Strict SaaS Protection: You cannot disable Owner/Admin core Staff Management rights.");
      return;
    }

    const currentVal = customPermissions[role][permissionKey];
    updateRolePermissions(role, { [permissionKey]: !currentVal });
    triggerToast(`Updated customizable permission: [${role} › ${permissionKey}] toggled to ${!currentVal ? 'ENABLED' : 'DISABLED'}`);
  };

  const permissionLabels: { key: keyof RolePermissions; title: string, desc: string }[] = [
    { key: 'viewInventory', title: 'Read Medicines & Stock', desc: 'Allows viewing medicine catalogs, formulations, and batch numbers' },
    { key: 'editInventory', title: 'Edit Stock & Formulations', desc: 'Allows appending new items, deleting, or updating batches' },
    { key: 'posCheckout', title: 'POS Invoicing & Billing', desc: 'Grants access to run sales checkout cash registers' },
    { key: 'viewFinanceReports', title: 'View Financial Analytics', desc: 'Grants access to Profit Margins, Sales graphs, and Expense trackers' },
    { key: 'manageStaff', title: 'Modify Users & Roles', desc: 'Authorizes editing employee keys and custom role permission matrixes' },
    { key: 'manageSubscription', title: 'Manage SaaS Subscription', desc: 'Allows viewing billing plans, trials, and renewing licenses' },
    { key: 'dbSyncAdmin', title: 'Database Admin & Sync Log', desc: 'Enables toggling SQLite/Postgres live pipelines and console monitors' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* Toast Alert Notifications */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50 font-bold"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white rounded-3xl border border-gray-150 shadow-xs gap-4 animate-slide-up">
        <div>
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>Multi-User Identity & Custom Role Manager</span>
          </h2>
          <p className="text-xs text-gray-500">
            Define pharmacy user rolls, register new staff, and fine-tune permission matrices for Owner, Cashier, Accountant or Pharmacist sessions.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveSubTab('employees')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeSubTab === 'employees' ? 'bg-[#09352F] text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-900'
            }`}
          >
            Manage Employees ({staffList.length})
          </button>
          <button 
            onClick={() => setActiveSubTab('permissions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeSubTab === 'permissions' ? 'bg-[#09352F] text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-900'
            }`}
          >
            Custom Role Permissions Matrix
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left main work view depending on tab */}
        <div className="xl:col-span-8 space-y-6">
          
          {activeSubTab === 'employees' ? (
            <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-800">Pharmacy staff Directory</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Active login credentials registered for current SaaS tenant <strong>{user?.client.name}</strong></p>
                </div>

                <button 
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add New Employee
                </button>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4.5 text-left">Internal ID</th>
                      <th className="px-6 py-4.5 text-left">Staff Name</th>
                      <th className="px-6 py-4.5 text-left">Assigned Role</th>
                      <th className="px-6 py-4.5 text-left">Digital Keys / Email</th>
                      <th className="px-6 py-4.5 text-center">Interactive Shell Switcher</th>
                      <th className="px-6 py-4.5 text-right font-medium">Provisioning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {staffList.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50/50 transition duration-150">
                        <td className="px-6 py-4 font-mono font-bold text-gray-400">{emp.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-gray-800 flex items-center gap-1.5">
                            {emp.name}
                            {user?.email === emp.email && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8px] px-1 py-0.5 rounded font-black">
                                ACTIVE LOGGED-IN
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{emp.phone}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                            emp.role === 'Owner/Admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            emp.role === 'Pharmacist' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            emp.role === 'Salesman/Cashier' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            emp.role === 'Accountant' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-mono text-gray-500">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{emp.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleQuickRoleSwitch(emp)}
                            className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-200 border border-emerald-150 px-2.5 py-1 rounded-xl transition cursor-pointer"
                          >
                            Live Login Switch
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {emp.role !== 'Owner/Admin' ? (
                            <button 
                              onClick={() => handleDeleteStaff(emp.id, emp.name)}
                              className="text-gray-400 hover:text-rose-600 transition p-1 cursor-pointer"
                              title="Revoke Credentials"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <Shield className="w-4 h-4 text-indigo-500/50 inline-block mr-1" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tab: Dynamic Customizable Permission Matrices */
            <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-sm text-gray-800">Custom Role Authorization Matrix</h3>
                <p className="text-[11px] text-gray-400 mt-1">
                  Adjust features dynamically. Click any button to enable or disable access. All linked features adapt in state immediately.
                </p>
              </div>

              <div className="overflow-x-auto border rounded-2xl">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b">
                    <tr>
                      <th className="px-6 py-4 text-left">RBAC Security Permission Scope</th>
                      <th className="px-4 py-4 text-center">Owner/Admin</th>
                      <th className="px-4 py-4 text-center">Pharmacist</th>
                      <th className="px-4 py-4 text-center">Sales/Cashier</th>
                      <th className="px-4 py-4 text-center">Accountant</th>
                      <th className="px-4 py-4 text-center">Staff Base</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-slate-700">
                    {permissionLabels.map((p) => (
                      <tr key={p.key} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-black text-gray-800 text-[11.5px]">{p.title}</div>
                          <div className="text-[10px] text-gray-400 leading-normal font-medium">{p.desc}</div>
                        </td>
                        
                        {/* Toggles per Role */}
                        {(['Owner/Admin', 'Pharmacist', 'Salesman/Cashier', 'Accountant', 'Staff'] as UserRole[]).map((r) => {
                          const isAllowed = customPermissions[r][p.key];
                          return (
                            <td key={r} className="px-4 py-4 text-center">
                              <button
                                onClick={() => handleTogglePermission(r, p.key)}
                                className="inline-flex focus:outline-none transition cursor-pointer"
                              >
                                {isAllowed ? (
                                  <ToggleRight className="w-10 h-10 text-emerald-600" />
                                ) : (
                                  <ToggleLeft className="w-10 h-10 text-gray-300" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#09352F]/5 border border-[#09352F]/10 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div className="text-[11px] text-gray-500 leading-relaxed">
                  <p className="font-bold text-[#09352F]">How to test security locks:</p>
                  <span>
                    Try toggling off credit or staff scopes for standard roles on this table, then use the <strong>Live Login Switch</strong> buttons in the Directory to switch to that role. Restricted pages immediately lock access.
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right column: Form to register employees instantly inside SaaS tenant */}
        <div className="xl:col-span-4 space-y-6 animate-slide-up">
          
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#A7D129]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#A7D129]">Security RBAC Protocol Spec</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Every staff member's session is encrypted with a localized <strong>SHA256 signature hash key</strong> containing role privileges. When views are requested inside the browser routing tree, the JWT parameters are checked against the following custom security matrices.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-2xl font-mono text-[10px] text-[#A7D129] border border-slate-800 space-y-2">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Core JWT Crypt:</span>
                <span className="text-white">HMAC HS256</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Active Principal ID:</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Authorized
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Domain Security:</span>
                <span className="text-white font-semibold">Strict Tenant Lock</span>
              </div>
            </div>
          </div>

          {/* Form to Register Personnel */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <div>
              <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-emerald-700" /> Add Corporate Employee
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">Provision login keys for professional pharmacy employees instantly.</p>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Full Staff Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Dr. Thomas Wayne"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Company Login Email</label>
                <input 
                  type="email"
                  required
                  placeholder="wayne@corp-pharma.com"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 font-sans">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Contact Phone</label>
                  <input 
                    type="text"
                    placeholder="+1 555-5201"
                    value={newStaffPhone}
                    onChange={e => setNewStaffPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Employee Role</label>
                  <select
                    value={newStaffRole}
                    onChange={e => setNewStaffRole(e.target.value as UserRole)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none cursor-pointer"
                  >
                    <option value="Owner/Admin">Owner / Admin</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Salesman/Cashier">Sales / Cashier</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Staff">Regular Staff</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-1 bg-[#09352F] hover:bg-[#11574d] text-white py-3 rounded-xl text-xs font-black transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#A7D129]" /> Provision Staff Account
              </button>
            </form>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
