import React, { useState } from 'react';
import { useAuth, UserRole } from '@/src/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Mail, Lock, ShieldAlert, Key, ClipboardCheck, ArrowRight,
  Sparkles, CheckCircle, DatabaseZap, Globe, ShieldCheck, Play, Radio, Calendar
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
  const { tenants, signIn, signInWithGoogle } = useAuth();
  
  const [selectedTenantId, setSelectedTenantId] = useState('tenant-apex');
  const [emailInput, setEmailInput] = useState('owner@apexpharma.com');
  const [passwordInput, setPasswordInput] = useState('************');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Owner/Admin');
  const [customName, setCustomName] = useState('Dr. Evelyn Harris');
  const [activeTab, setActiveTab] = useState<'email' | 'google'>('email');
  
  // Custom Google loader visual action
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleConsent, setShowGoogleConsent] = useState(false);

  // Parse details of selected tenant
  const activeTenantObj = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const handleRolePresetClick = (preset: typeof TEAM_PRESETS[0]) => {
    setSelectedRole(preset.role);
    setEmailInput(preset.email);
    setCustomName(preset.name);
    setPasswordInput('admin1234');
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(emailInput, selectedRole, selectedTenantId, customName);
  };

  const handleGoogleSubmit = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setShowGoogleConsent(true);
    }, 1000);
  };

  const confirmGoogleOAuthScope = () => {
    setShowGoogleConsent(false);
    setIsGoogleLoading(false);
    signInWithGoogle(selectedTenantId);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Decorative ambient background mesh */}
      <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>
      </div>

      {/* Left Column: Sales/Banner pitch of the SaaS Platform */}
      <div className="w-full md:w-5/12 p-8 md:p-16 flex flex-col justify-between text-white relative z-10 bg-gradient-to-br from-teal-950 to-emerald-950/80 border-b md:border-b-0 md:border-r border-teal-800/20">
        
        {/* Brand Headline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
              <DatabaseZap className="w-6 h-6 text-emerald-400 animate-pulse" />
            </span>
            <div>
              <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#A7D129]">PHARMASCRIPT CLOUD</span>
              <h2 className="text-md font-black tracking-tight leading-none text-white">SaaS Client Portal</h2>
            </div>
          </div>
        </div>

        {/* Feature pitch bento summary */}
        <div className="my-10 space-y-6">
          <h2 className="text-xl md:text-3xl font-black tracking-tight text-white leading-tight">
            Integrated Pharmacy ERP SaaS Engine
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Welcome to the SaaS administration workspace client entry point. Log in to configure your dispensary branches, roles, permissions, and localized offline SQLite buffers.
          </p>

          <div className="space-y-4 pt-4 border-t border-teal-800/30">
            <div className="flex gap-3 text-xs">
              <span className="bg-emerald-500/15 p-2 rounded-xl text-emerald-400 font-bold shrink-0">1</span>
              <div>
                <p className="font-bold text-white">Multi-Pharmacy Client Tenant Isolation</p>
                <p className="text-[11px] text-slate-400">Isolated dataspaces and branch configurations per client domain.</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="bg-[#A7D129]/15 p-2 rounded-xl text-[#A7D129] font-bold shrink-0">2</span>
              <div>
                <p className="font-bold text-white">Advanced RBAC Permission Customizer</p>
                <p className="text-[11px] text-slate-400">Dynamically restrict modules for Owners, Cashiers, Accountants or Pharmacists.</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="bg-cyan-500/15 p-2 rounded-xl text-cyan-400 font-bold shrink-0">3</span>
              <div>
                <p className="font-bold text-white">SQLite To RDS Postgres Safe Replication</p>
                <p className="text-[11px] text-slate-400">Zero database collisions during network downtime outages.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meta details footer with Local State specs */}
        <div className="pt-6 border-t border-teal-950 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-400 font-mono font-bold">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-ping" /> Connection State: TLS Live
          </span>
          <span>© 2026 Pharmacloud SaaS Platform</span>
        </div>
      </div>

      {/* Right Column: Interactive Login Core */}
      <div className="w-full md:w-7/12 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 overflow-y-auto">
        
        <div className="max-w-xl mx-auto w-full space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">Access Your Pharmacy ERP</h2>
            <p className="text-xs text-slate-400">Select your pharmacy tenant client below to demonstrate SaaS multi-access.</p>
          </div>

          {/* SaaS Client Selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#A7D129] flex items-center justify-between">
              <span>Choose Pharmacy Client Tenant</span>
              <span className="bg-[#A7D129]/10 text-[#A7D129] px-2 py-0.5 rounded-full text-[8.5px]">ISOLATED SAAS DOMAIN</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tenants.map((ten) => (
                <button
                  key={ten.id}
                  type="button"
                  onClick={() => setSelectedTenantId(ten.id)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition relative cursor-pointer ${
                    selectedTenantId === ten.id 
                      ? 'bg-slate-900 border-teal-500 text-white shadow-lg' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Building2 className={`w-3.5 h-3.5 ${selectedTenantId === ten.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="font-extrabold text-[11px] line-clamp-1">{ten.name}</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">{ten.domain}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/55 flex justify-between items-center text-[9px] font-bold">
                    <span className={`px-1.5 py-0.5 rounded ${
                      ten.plan === 'Enterprise SaaS' ? 'bg-emerald-500/10 text-emerald-400' :
                      ten.plan === 'Premium Pro' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {ten.plan}
                    </span>
                    {ten.isExpired ? (
                      <span className="text-rose-500">EXPIRED</span>
                    ) : (
                      <span className="text-emerald-500">ACTIVE</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form tab logins */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6">
            
            <div className="flex border-b border-slate-800 pb-3 gap-4">
              <button 
                onClick={() => setActiveTab('email')}
                className={`pb-2 text-xs font-bold transition relative cursor-pointer ${
                  activeTab === 'email' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Email/Password Login
                {activeTab === 'email' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('google')}
                className={`pb-2 text-xs font-bold transition relative cursor-pointer ${
                  activeTab === 'google' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Gmail Google Sign-In
                {activeTab === 'google' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A7D129]"></span>}
              </button>
            </div>

            {/* TAB 1: EMAIL & PASSWORD ACCESS WITH QUICK ROLE INJECTORS */}
            {activeTab === 'email' && (
              <form onSubmit={handleStandardSubmit} className="space-y-4">
                
                {/* Role testing fast-injector section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      ERP Tester Account Credentials Toggles
                    </label>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold font-mono">
                      CLICK TO TRIGGER CREDENTIALS
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {TEAM_PRESETS.map((preset) => (
                      <button
                        key={preset.role}
                        type="button"
                        onClick={() => handleRolePresetClick(preset)}
                        className={`px-3 py-1.5 text-[10px] font-medium rounded-xl transition cursor-pointer border ${
                          selectedRole === preset.role 
                            ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {preset.role} ({preset.name.split(' ')[0]})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        required
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        placeholder="e.g. owner@apexpharma.com" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secret Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="password" 
                        required
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Display role state to inject */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-[10.5px]">
                  <div>
                    <span className="text-slate-500 block">Logging in as:</span>
                    <span className="font-extrabold text-white">{customName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RBAC Session Role:</span>
                    <span className="font-extrabold text-[#A7D129]">{selectedRole}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl transition cursor-pointer shadow-lg shadow-emerald-950/50"
                  >
                    <span>Authenticate JWT Login</span>
                    <ArrowRight className="w-4 h-4 text-[#A7D129]" />
                  </button>
                </div>

              </form>
            )}

            {/* TAB 2: GMAIL / GOOGLE OAUTH FLOW */}
            {activeTab === 'google' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/35 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-2 leading-relaxed">
                  <p className="font-extrabold text-white">Gmail Google OAuth Gateway</p>
                  <p>
                    By proceeding, the systems logs you into your unified Google Workspace. This utilizes verified Google federated security parameters mapping directly to your account roles.
                  </p>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleSubmit}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-white text-slate-900 font-extrabold text-xs py-4 rounded-2xl transition cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent"></span>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95c2.31-2.13 3.635-5.26 3.635-8.64z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.51 1.18-3.98 1.18-3.06 0-5.65-2.07-6.57-4.86H1.54v3.19A11.98 11.98 0 0 0 12 24z"/>
                      <path fill="#FBBC05" d="M5.43 14.33a7.19 7.19 0 0 1 0-4.66V6.48H1.54a11.98 11.98 0 0 0 0 11.04l3.89-3.19z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.93 1.19 15.24 0 12 0 7.3 0 3.25 2.69 1.54 6.48l3.89 3.19c.92-2.79 3.51-4.92 6.57-4.92z"/>
                    </svg>
                  )}
                  <span>Sign In with Gmail Authorized Google ID</span>
                </button>
              </div>
            )}

          </div>

          {/* Real-time crypt JWT inspection console */}
          <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl space-y-2 text-xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" /> Web JWT Cryptographic Spec Inspector
            </span>
            <p className="text-[10px] text-slate-500">
              The platform generates authenticated, digitally signed JSON Web Tokens (JWT) mapped directly to your pharmacy tenant. Click the role buttons above to see the token change.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl font-mono text-[9px] text-emerald-300 overflow-x-auto whitespace-pre leading-normal border border-slate-900">
              {`HEADER: {"alg":"HS256","typ":"JWT"}\nPAYLOAD: {"sub":"${emailInput}","role":"${selectedRole}","tenant":"${selectedTenantId}","iss":"pharmascript-saas","exp":1779774571}\nSIGNATURE: [SHA256 HMAC Encrypted Verify Security Status Checked Live]`}
            </div>
          </div>

        </div>

      </div>

      {/* Gmail Consent Form Modal Overlay */}
      <AnimatePresence>
        {showGoogleConsent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-xs font-sans"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-slate-800 shadow-2xl space-y-5 border border-slate-200"
            >
              <div className="flex justify-center">
                <div className="bg-indigo-50 p-4 rounded-full border border-indigo-100">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95c2.31-2.13 3.635-5.26 3.635-8.64z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.51 1.18-3.98 1.18-3.06 0-5.65-2.07-6.57-4.86H1.54v3.19A11.98 11.98 0 0 0 12 24z"/>
                    <path fill="#FBBC05" d="M5.43 14.33a7.19 7.19 0 0 1 0-4.66V6.48H1.54a11.98 11.98 0 0 0 0 11.04l3.89-3.19z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.93 1.19 15.24 0 12 0 7.3 0 3.25 2.69 1.54 6.48l3.89 3.19c.92-2.79 3.51-4.92 6.57-4.92z"/>
                  </svg>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-lg text-slate-900">Sign in with Google</h3>
                <p className="text-xs text-slate-400">Choose your Google account to authorize access to Pharmacy Cloud ERP</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  X
                </div>
                <div>
                  <span className="font-extrabold text-[11px] block text-slate-800">xionstudio.official@gmail.com</span>
                  <span className="text-[10px] text-slate-400 font-medium">Google Account Owner</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                By selecting "Approve Consent Scope", you agree to share your email, name, profile photo, and security roles mapping with the SaaS portal instance <code>{activeTenantObj.domain}</code>.
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowGoogleConsent(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Decline
                </button>
                <button 
                  onClick={confirmGoogleOAuthScope}
                  className="flex-1 bg-[#09352F] hover:bg-[#11574d] text-white py-3 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Approve Consent Scope
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
