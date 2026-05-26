import React, { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { motion } from 'motion/react';
import { 
  Lock, Calendar, AlertTriangle, CreditCard, RefreshCw, LogOut,
  Sparkles, CheckCircle2, ShieldAlert, BadgeInfo, Zap, PhoneCall
} from 'lucide-react';

export function SubscriptionExpiredPage() {
  const { user, signOut, activeClient, tenants, updateTenant } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSimulatedUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      setIsUpgrading(false);
      // Mutate the tenant's expiry status in memory / localStorage
      if (activeClient) {
        updateTenant(activeClient.id, {
          isExpired: false,
          plan: 'Enterprise Plan',
          expiryDate: '2028-12-31'
        });
      }
      setSuccessMsg('Thank you for your payment! SaaS Subscription has been successfully renewed.');
      // Reload page state after briefly showing success
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden text-white">
      {/* Absolute decorative mesh */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 text-center space-y-6 relative z-10 shadow-2xl"
      >
        <div className="mx-auto bg-rose-500/10 border border-rose-500/35 p-4 rounded-3xl w-16 h-16 flex items-center justify-center">
          <Lock className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="bg-rose-500/15 text-rose-400 font-extrabold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-rose-500/20">
            Subscription Plan Suspended
          </span>
          <h2 className="text-xl md:text-3xl font-black tracking-tight text-white pt-2">
            Access Locked: {activeClient?.name}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            This account's <strong>{activeClient?.plan || 'Basic Trial'}</strong> SaaS plan expired on <strong className="text-white">{activeClient?.expiryDate ? new Date(activeClient.expiryDate).toLocaleDateString() : 'N/A'}</strong>. Please contact your administrator or renew options below to restore ERP cluster services.
          </p>
        </div>

        {/* Diagnostic info block */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-left text-xs space-y-3">
          <div className="flex justify-between border-b border-slate-900 pb-2">
            <span className="text-slate-500 font-bold">Client Domain:</span>
            <span className="font-mono text-slate-300 font-semibold">{activeClient?.domain}</span>
          </div>
          <div className="flex justify-between border-b border-slate-900 pb-2">
            <span className="text-slate-500 font-bold">Active Principal:</span>
            <span className="text-slate-300 font-semibold">{user?.email} ({user?.role})</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-500 font-bold">Platform Status:</span>
            <span className="text-rose-500 font-extrabold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Blocked (Exp-Delta-30d)
            </span>
          </div>
        </div>

        {/* Pricing tier promo box */}
        <div className="bg-gradient-to-br from-indigo-950 to-purple-950/80 p-5 rounded-2xl border border-indigo-500/20 text-left space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">Recommended Upgrade</span>
              <span className="font-black text-sm text-white">Full-Suite Infinite Pro Plan</span>
            </div>
            <span className="font-black text-lg text-white">$149<span className="text-xs text-slate-400 font-bold">/mo</span></span>
          </div>

          <p className="text-[11px] text-slate-300 leading-normal">
            Includes multi-user role customizable matrices, advanced automated SQLite-to-Postgres offline pipelines, custom medicine catalog builders, and dedicated cloud-failover priority.
          </p>

          {successMsg ? (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-center text-xs">
              {successMsg}
            </div>
          ) : (
            <button
              onClick={handleSimulatedUpgrade}
              disabled={isUpgrading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer shadow-md"
            >
              {isUpgrading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing Payment Stripe Hook...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#A7D129] animate-bounce" />
                  <span>Renew Subscription Instant Active</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Double backup logout buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={signOut}
            className="text-slate-500 hover:text-white transition text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Switch SaaS Tenant / Logout
          </button>
          <span className="text-slate-600 font-mono text-[9px] font-bold">SaaS Gateway ID: IP-3000-INGRESS</span>
        </div>
      </motion.div>
    </div>
  );
}
