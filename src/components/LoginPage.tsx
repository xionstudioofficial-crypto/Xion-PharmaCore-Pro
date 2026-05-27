import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/src/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Mail, Lock, Shield, Key, ClipboardCheck, ArrowRight,
  Sparkles, Database, Globe, ShieldCheck, HelpCircle,
  Grid, ChevronRight, Info, Eye, EyeOff, Check, Users, Cloud
} from 'lucide-react';

const TEAM_PRESETS = [
  { role: 'SaaS Super Admin' as UserRole, email: 'owner@pharmascript-saas.com', name: 'Software Owner (Super Admin)' },
  { role: 'Owner/Admin' as UserRole, email: 'owner@apexpharma.com', name: 'Dr. Evelyn Harris' },
  { role: 'Pharmacist' as UserRole, email: 'lead.pharmacist@apexpharma.com', name: 'Marcus Chen, PharmD' },
  { role: 'Salesman/Cashier' as UserRole, email: 'cashier.billing@apexpharma.com', name: 'Jordan Hayes' },
  { role: 'Accountant' as UserRole, email: 'finance@apexpharma.com', name: 'Sarah Finch, CPA' },
  { role: 'Staff' as UserRole, email: 'assistant.staff@apexpharma.com', name: 'Alex Rivera' }
];

export function LoginPage() {
  const { tenants, signIn } = useAuth();
  
  const [selectedTenantId, setSelectedTenantId] = useState('tenant-apex');
  const [emailInput, setEmailInput] = useState('owner@apexpharma.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Owner/Admin');
  const [customName, setCustomName] = useState('Dr. Evelyn Harris');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auto-fill values when selection changes to make interactive testing elegant
  const activeTenantObj = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replaces placeholder with fake clean password string if user didn't modify it
    const finalPassword = passwordInput.includes('•') ? 'admin1234' : passwordInput;
    signIn(emailInput, selectedRole, selectedTenantId, customName);
  };

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    
    // Choose appropriate testing role preset matched to the selected tenant
    if (tenantId === 'tenant-apex') {
      setEmailInput('owner@apexpharma.com');
      setPasswordInput('••••••••••••');
      setSelectedRole('Owner/Admin');
      setCustomName('Dr. Evelyn Harris');
    } else if (tenantId === 'tenant-carefirst') {
      setEmailInput('lead.pharmacist@apexpharma.com');
      setPasswordInput('••••••••••••');
      setSelectedRole('Pharmacist');
      setCustomName('Marcus Chen, PharmD');
    } else if (tenantId === 'tenant-greencross') {
      setEmailInput('cashier.billing@apexpharma.com');
      setPasswordInput('••••••••••••');
      setSelectedRole('Salesman/Cashier');
      setCustomName('Jordan Hayes');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-between relative overflow-x-hidden font-sans select-none selection:bg-emerald-500 selection:text-white pb-6">
      
      {/* Decorative light ambient soft backdrops meshes */}
      <div className="absolute inset-0 opacity-40 pointer-events-none select-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-15"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-slate-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
        
        {/* Fine grid pattern for software engineering look */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-35"></div>
      </div>

      {/* Floating Top-Right Language Dropdown Selector */}
      <div className="absolute top-6 right-8 z-20">
        <div 
          onClick={() => alert("Language selection localized profiles are available in Pro plan branches.")}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl font-bold text-xs text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer select-none active:scale-95"
        >
          <Globe className="w-4 h-4 text-slate-500" />
          <span>English</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </div>
      </div>

      {/* MAIN CONTAINER FRAME */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12 lg:pt-0 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* LEFT COLUMN: Logo header, pitches, and custom CSS PC render */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-center py-6">
          
          {/* Logo Heading container */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              {/* Rounded hexagon styled green logo */}
              <div id="saas-logo-icon" className="w-13 h-13 bg-gradient-to-br from-[#00703C] to-[#01522d] rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-lg border border-emerald-600/20 active:scale-95 transition-transform duration-200">
                P
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-905 tracking-tight uppercase leading-tight">SaaS Client Portal</h1>
                <p className="text-[11px] font-bold text-slate-405 tracking-wide uppercase">Pharmacy ERP Platform</p>
              </div>
            </div>

            {/* Custom green-tinted bullet badge capsule */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[#00703C] rounded-full text-xs font-bold w-fit">
              <span className="w-4 h-4 bg-[#00703C] hover:scale-105 transition rounded-full flex items-center justify-center text-white text-[10px]">✔</span>
              <span>Multi-Tenant • Secure • Scalable</span>
            </div>
          </div>

          {/* Slogan with precise spacing highlighted with green */}
          <div className="space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Integrated Pharmacy <br />
              <span className="text-[#00703C]">ERP SaaS</span> Engine
            </h2>
            <div className="w-14 h-1 bg-[#00703C] rounded-full mt-3" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md pt-1.5">
              Access your pharmacy system securely. Manage your branches, users, roles, inventory and much more in one powerful platform.
            </p>
          </div>

          {/* Bullet cards features with green circular icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md lg:max-w-none">
            
            {/* Feature 1 */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xs">
              <span className="bg-emerald-50 text-[#00703C] w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 shrink-0 border border-emerald-100/30">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
               </span>
              <div>
                <p className="font-extrabold text-slate-800 text-xs">Multi-Tenant Isolation</p>
                <p className="text-[10.5px] text-slate-450 mt-0.5 leading-normal">Each pharmacy data is completely isolated and secure.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xs">
              <span className="bg-emerald-50 text-[#00703C] w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 shrink-0 border border-emerald-100/30">
                <Users className="w-5 h-5 stroke-[2.2]" />
               </span>
              <div>
                <p className="font-extrabold text-slate-800 text-xs">Advanced RBAC Security</p>
                <p className="text-[10.5px] text-slate-455 mt-0.5 leading-normal">Role-based access with advanced permissions.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xs">
              <span className="bg-emerald-50 text-[#00703C] w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 shrink-0 border border-emerald-100/30">
                <Database className="w-5 h-5 stroke-[2.2]" />
               </span>
              <div>
                <p className="font-extrabold text-slate-800 text-xs">High Performance</p>
                <p className="text-[10.5px] text-slate-450 mt-0.5 leading-normal">Optimized PostgreSQL with safe replication.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xs">
              <span className="bg-emerald-50 text-[#00703C] w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 shrink-0 border border-emerald-100/30">
                <Cloud className="w-5 h-5 stroke-[2.2]" />
               </span>
              <div>
                <p className="font-extrabold text-slate-800 text-xs">99.9% Uptime</p>
                <p className="text-[10.5px] text-slate-450 mt-0.5 leading-normal">Enterprise-grade reliability and performance.</p>
              </div>
            </div>

          </div>

          {/* COMPUTER ILLUSTRATION CONTAINER WITH 3D PILL JAR OVERLAP */}
          <div className="relative mt-4 max-w-sm mx-auto hidden lg:block select-none pointer-events-none">
            <div className="bg-slate-705 p-3 rounded-2xl shadow-xl border border-slate-201 shadow-slate-300 aspect-video relative overflow-hidden bg-slate-800">
              
              {/* Internal Monitor Screen */}
              <div className="bg-slate-50 w-full h-full rounded-lg overflow-hidden border border-slate-200 flex flex-col p-2.5 text-slate-800">
                
                {/* Header elements inside screen */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[8px] font-mono font-black text-slate-400 ml-1">pharmscript_workspace</span>
                  </div>
                  <div className="h-2.5 w-16 bg-slate-200 rounded-full" />
                </div>
                
                {/* Graphic layout elements representing the Admin Dashboard */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="col-span-1 border border-slate-100 bg-white p-1 rounded-md space-y-1.5 h-20">
                    <div className="h-1.5 w-full bg-[#00703C]/30 rounded-full" />
                    <div className="h-1 w-4/5 bg-gray-100 rounded-full" />
                    <div className="h-1 w-3/5 bg-gray-100 rounded-full" />
                  </div>
                  <div className="col-span-3 bg-white border border-slate-100 p-2 rounded-md flex flex-col justify-between h-20">
                    <div className="flex justify-between items-center">
                      <div className="h-1.5 w-1/3 bg-gray-300 rounded-full" />
                      <div className="h-1.5 w-1/4 bg-[#00703C]/20 rounded-full" />
                    </div>
                    {/* Tiny simulated bar chart */}
                    <div className="flex items-end gap-1.5 justify-between h-8 pt-1.5 border-b border-slate-100 pb-0.5">
                      <div className="h-4/5 w-2 bg-[#00703C] rounded-t-xs" />
                      <div className="h-2/3 w-2 bg-[#00703C]/70 rounded-t-xs" />
                      <div className="h-5/6 w-2 bg-emerald-500 rounded-t-xs" />
                      <div className="h-1/2 w-2 bg-gray-200 rounded-t-xs" />
                      <div className="h-3/4 w-2 bg-[#00703C]/80 rounded-t-xs" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Monitor neck stand */}
            <div className="w-16 h-8 bg-slate-305 mx-auto rounded-b border-x border-slate-400 bg-slate-300" />
            <div className="w-28 h-2 bg-slate-404 mx-auto rounded-full bg-slate-400" />
            
            {/* Prescription Pill Jar overlapping in front of the Monitor */}
            <div className="absolute -left-6 -bottom-6 w-22 p-2 bg-white rounded-3xl shadow-[0_12px_24px_rgba(0,0,0,0.1)] border border-gray-150 flex flex-col items-center">
              
              {/* Cap cover container */}
              <div className="w-14 h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-t-md relative border-b border-gray-300 shadow-xs">
                {/* Cap groove indicators */}
                <div className="absolute inset-x-1.5 inset-y-1 bg-gray-200/50 [background-image:linear-gradient(to_right,rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:3px_100%]" />
              </div>

              {/* Main bottle shape */}
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl relative flex flex-col items-center justify-end pb-1.5 overflow-hidden shadow-xs">
                {/* Security seal thread label */}
                <div className="w-15 h-1 bg-gray-100 border-b border-gray-150" />
                
                {/* Dynamic solid green pharmaceutical label with medical cross */}
                <div className="w-full bg-[#00703C] py-2.5 flex items-center justify-center my-auto">
                  <div className="relative">
                    <div className="w-4.5 h-1.5 bg-white rounded-sm animate-pulse" />
                    <div className="h-4.5 w-1.5 bg-white rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
                
                {/* Bottom detail pill indicators labels */}
                <div className="flex gap-1 mt-1">
                  <div className="w-4 h-1 bg-amber-400 rounded-xs" />
                  <div className="w-6 h-1 bg-[#00703C]/30 rounded-xs" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive High-Contrast Card */}
        <div className="lg:col-span-7 flex justify-center items-center py-6">
          
          {/* Main Select Card Wrapper */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-150 shadow-[0_16px_40px_rgba(15,23,42,0.06)] max-w-xl w-full space-y-6 relative">
            
            {/* Header Padlock block */}
            <div className="text-center space-y-2">
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-[#00703C] rounded-2xl w-fit mx-auto shadow-xs flex items-center justify-center transition hover:rotate-6 duration-300">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Access Your Pharmacy ERP</h3>
              <p className="text-xs text-slate-500 font-medium">Select your pharmacy tenant and sign in to continue</p>
            </div>

            {/* Select Pharmacy tenant header */}
            <div className="space-y-3.5">
              
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-slate-400" />
                  Select Pharmacy Tenant
                </span>
                <button 
                  type="button" 
                  onClick={() => alert("Demonstration mode: select from the available branches below.")} 
                  className="text-xs font-bold text-[#00703C] hover:text-[#00522d] flex items-center gap-1 cursor-pointer transition select-none hover:underline"
                >
                  <Grid className="w-3.5 h-3.5" />
                  View All
                </button>
              </div>

              {/* Horizontal sliding list layout */}
              <div className="relative">
                
                <div className="grid grid-cols-3 gap-3 overflow-hidden">
                  {tenants.map((ten) => {
                    const isSelected = selectedTenantId === ten.id;
                    
                    let badgeBg = "bg-emerald-50 text-[#00703C] border-emerald-100";
                    let badgeText = "Professional Plan";
                    let cardTitle = ten.name;
                    let cardDomain = ten.domain;

                    if (ten.id === 'tenant-apex') {
                      badgeBg = "bg-emerald-500/10 text-[#00703C] border border-[#00703C]/20";
                      badgeText = "Professional Plan";
                      cardTitle = "Apex Global Pharmacy";
                      cardDomain = "apex.pharmacy.com";
                    } else if (ten.id === 'tenant-carefirst') {
                      badgeBg = "bg-orange-500/10 text-orange-600 border border-orange-500/20";
                      badgeText = "Starter Plan";
                      cardTitle = "CareFirst Dispensary";
                      cardDomain = "carefirst.pharmacy.com";
                    } else if (ten.id === 'tenant-greencross') {
                      badgeBg = "bg-rose-500/10 text-rose-605 text-rose-600 border border-rose-500/20";
                      badgeText = "Expired";
                      cardTitle = "GreenCross Medicare";
                      cardDomain = "greencross.pharmacy.com";
                    }

                    return (
                      <button
                        key={ten.id}
                        type="button"
                        onClick={() => handleTenantSelect(ten.id)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-34 transition-all duration-300 relative cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-500/[0.02] border-[#00703C] border-2 shadow-xs' 
                            : 'bg-white border-gray-200 text-slate-800 hover:bg-slate-50 hover:border-gray-300'
                        }`}
                      >
                        {/* Selected overlay indicator badge */}
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 w-4.5 h-4.5 bg-[#00703C] text-white rounded-full flex items-center justify-center shadow-md scale-100 animate-scaleIn">
                            <Check className="w-3 h-3 stroke-[3.5]" />
                          </span>
                        )}

                        {/* Top Micro logo placeholder depending on ID */}
                        <div className="w-full">
                          
                          {/* Top custom mini icons */}
                          <div className="mb-2.5">
                            {ten.id === 'tenant-apex' && (
                              <div className="font-extrabold text-[#00703C] tracking-tight leading-none text-[10.5px] uppercase">
                                APEX
                              </div>
                            )}
                            {ten.id === 'tenant-carefirst' && (
                              <div className="flex items-center gap-1 text-[10.5px] font-black text-indigo-900">
                                <span className="w-4 h-4 bg-indigo-950 text-white rounded-md flex items-center justify-center text-[7.5px] font-extrabold">CG</span>
                              </div>
                            )}
                            {ten.id === 'tenant-greencross' && (
                              <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-0.5 leading-none">
                                <span className="text-[11px] leading-none">➕</span>
                              </div>
                            )}
                          </div>

                          <p className="font-bold text-[11px] text-slate-800 leading-tight line-clamp-1">{cardTitle}</p>
                          <p className="font-mono text-[8.5px] text-slate-400 mt-0.5 truncate">{cardDomain}</p>
                        </div>

                        {/* Plan Indicator Pill Capsule */}
                        <div className="w-full mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-tight inline-block ${badgeBg}`}>
                            {badgeText}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Left/Right navigation slider controls mockup override icon */}
                <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 z-10">
                  <button 
                    type="button" 
                    title="Slide next pharmacy client"
                    className="w-8 h-8 rounded-full bg-white text-slate-700 shadow-md border border-gray-150 flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-95 transition shrink-0"
                    onClick={() => {
                      setSelectedTenantId(prev => prev === 'tenant-apex' ? 'tenant-carefirst' : prev === 'tenant-carefirst' ? 'tenant-greencross' : 'tenant-apex');
                    }}
                  >
                    <ChevronRight className="w-4.5 h-4.5 text-slate-500" />
                  </button>
                </div>

              </div>

              {/* Dynamic ERP test testing presets panel (Subtle, custom feature for testing!) */}
              <div className="py-2.5 px-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap items-center justify-between gap-1.5 text-xs font-semibold text-slate-600 mt-1">
                <span className="font-mono text-[9px] text-emerald-800 font-bold uppercase tracking-wider">Test Role preset:</span>
                <div className="flex gap-1 flex-wrap">
                  {TEAM_PRESETS.filter(p => p.role !== 'SaaS Super Admin').map((preset) => (
                    <button
                      key={preset.role}
                      type="button"
                      onClick={() => {
                        setEmailInput(preset.email);
                        setSelectedRole(preset.role);
                        setCustomName(preset.name);
                        setPasswordInput('••••••••••••');
                        if (preset.role === 'Pharmacist') {
                          setSelectedTenantId('tenant-carefirst');
                        } else if (preset.role === 'Salesman/Cashier') {
                          setSelectedTenantId('tenant-greencross');
                        } else {
                          setSelectedTenantId('tenant-apex');
                        }
                      }}
                      className={`px-2.5 py-0.5 rounded-lg text-[9px] font-mono border font-extrabold transition cursor-pointer ${
                        selectedRole === preset.role 
                          ? 'bg-[#00703C] text-white border-[#00703C]' 
                          : 'bg-white border-gray-200 text-slate-400 hover:text-slate-700 hover:border-gray-300'
                      }`}
                    >
                      {preset.role.replace('Salesman/', '').replace('/Admin', '')}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* or continue with login separator lines */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] bg-gray-100 flex-1" />
              <span className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">or continue with login</span>
              <div className="h-[1px] bg-gray-100 flex-1" />
            </div>

            {/* Standard authentication fields */}
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              
              {/* Username/Email Input grouping */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Email / Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400">
                    <Mail className="w-4 h-4 text-slate-350" />
                  </span>
                  <input 
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-white pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#00703C] focus:shadow-[0_0_8px_rgba(0,112,60,0.12)] font-bold transition-all duration-200"
                    placeholder="e.g., owner@apexpharms.com"
                  />
                </div>
              </div>

              {/* Password input grouping */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-600">Password</label>
                  <button 
                    type="button" 
                    onClick={() => alert("Simulated: Forgot password flow has initiated, password token was sent directly to this tenant's operator inbox.")}
                    className="text-[11px] font-bold text-[#00703C] hover:text-[#005e32] transition hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400">
                    <Lock className="w-4 h-4 text-slate-350" />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-white pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#00703C] focus:shadow-[0_0_8px_rgba(0,112,60,0.12)] font-bold transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Remember me select checkbox section */}
              <div className="flex items-center justify-between pt-1 select-none text-xs text-slate-500 font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#00703C] border-gray-300 rounded text-[#00703C] focus:ring-emerald-550 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <div className="flex items-center gap-1 cursor-help hover:text-slate-705 transition group relative">
                  <span>Keep me signed in</span>
                  <span className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-0.5 rounded-full inline-block">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                  {/* Subtle tooltip help hover */}
                  <div className="absolute bottom-full right-0 bg-slate-900 text-white text-[10px] p-2 rounded-xl border border-slate-700 w-44 shadow-lg scale-0 group-hover:scale-100 transition-all origin-bottom-right duration-200 translate-y-[-6px] pointer-events-none z-30 font-medium">
                    Keeps your JWT cryptographic active session stored securely in client storage buffers.
                  </div>
                </div>
              </div>

              {/* Main Submit action in dark green color #00703C exactly matching */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-between bg-[#00703C] hover:bg-[#005e2d] text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.01] active:scale-[0.99] border border-emerald-700/20 shadow-emerald-700/10 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4.5 h-4.5 text-emerald-200 shrink-0" />
                    Sign In to Pharmacy ERP
                  </span>
                  <ArrowRight className="w-4.5 h-4.5 text-white stroke-[2.5]" />
                </button>
              </div>

            </form>

            {/* Secure connection light-green pill alert badge */}
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl text-[10.5px] text-[#00703C] font-semibold tracking-wide">
              <span className="text-[11.5px] leading-none shrink-0">🛡️</span>
              <span>Secure connection • Your data is protected with enterprise-grade security</span>
            </div>

          </div>

        </div>

      </div>

      {/* FOOTER COPYRIGHT AT BOTTOM OF COMPLETE PAGE */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 mt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-slate-400 text-xs relative z-10 select-none pointer-events-none">
        
        <div className="flex items-center gap-1 font-semibold">
          <span>© 2025 SaaS Client Portal. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/5 border border-emerald-550/15 px-3 py-1 rounded-full font-mono text-[10.5px] font-black shrink-0 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
          <span>Active SSL: AES_256</span>
          <span className="text-slate-300">|</span>
          <span>Version 2.0.0</span>
        </div>

      </div>

    </div>
  );
}
