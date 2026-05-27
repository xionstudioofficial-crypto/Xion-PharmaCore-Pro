import React, { useState } from "react";
import { useAuth, PharmacyTenant } from "@/src/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, CreditCard, Clock, Zap, Landmark, ShieldCheck, CheckCircle, 
  ArrowRight, Ticket, Sparkles, HelpCircle, PhoneCall, Smartphone
} from "lucide-react";

export function SubscriptionPage() {
  const { activeClient, trialDaysRemaining, updateTenant, addTransaction, saasPlans, paymentAccounts } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [toast, setToast] = useState('');
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (!activeClient) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-150 text-center text-xs">
        No active pharmacy operator session found. Log in to configure subscriptions.
      </div>
    );
  }

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsProcessing(true);

    // Simulate gateway verification (2 seconds)
    setTimeout(() => {
      // 1. Update the pharmacy client metadata live
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // auto-add 30 days
      const formattedExpiry = futureDate.toISOString().split('T')[0];

      updateTenant(activeClient.id, {
        plan: selectedPlan.name,
        expiryDate: formattedExpiry,
        isExpired: false
      });

      // 2. Add dynamic checkout transaction to superadmin log ledger for visibility
      addTransaction({
        tenantName: activeClient.name,
        date: new Date().toISOString().split('T')[0],
        amount: selectedPlan.price,
        plan: selectedPlan.name,
        paymentMethod: paymentMethod,
        status: 'Completed'
      });

      setIsProcessing(false);
      setIsSuccess(true);
      triggerToast(`Account upgraded: Activated ${selectedPlan.name}!`);
    }, 2000);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setIsSuccess(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 animate-slide-up font-sans">
      
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

      {/* Dynamic Account status card indicating trial time info */}
      <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-xs">
        <h3 className="font-extrabold text-[#09352F] text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>Active Client Billing Status</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-slate-800">Subscriber Domain: </span>
              <span className="font-mono bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-lg text-xs font-bold">{activeClient.domain}</span>
              
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeClient.isExpired ? 'bg-rose-50 border border-rose-200 text-rose-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              }`}>
                {activeClient.isExpired ? 'Suspended/Expired' : 'Active Account'}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Your pharmacy is currently operating on the <strong>{activeClient.plan}</strong> tier. Below you can check remaining days and review higher SaaS tiers.
            </p>
          </div>

          <div className="md:col-span-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl text-[#09352F]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-black text-rose-600 text-[10px] uppercase tracking-wider font-mono">
                {activeClient.plan.toLowerCase().includes('trial') ? '30-Day Free Trial Timer' : 'Subscription Status'}
              </p>
              <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                {trialDaysRemaining > 0 ? `${trialDaysRemaining} days remaining` : 'Subscription expired / Action custom active'}
              </h4>
              <p className="text-[10.5px] text-gray-400 font-mono">Expires on: {activeClient.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-md font-bold text-gray-800">SaaS Dynamic Plan Catalog</h2>
          <p className="text-xs text-gray-500">Pick an upgrade tier. Selecting a plan opens the local checkout wizard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {saasPlans.map(plan => {
            const isActive = activeClient.plan === plan.name;
            return (
              <div 
                key={plan.id} 
                className={`p-6 md:p-8 rounded-3xl border flex flex-col justify-between relative transition ${
                  isActive 
                    ? 'bg-[#09352F]/5 border-emerald-600 shadow-md ring-1 ring-emerald-600' 
                    : 'bg-white border-gray-150 hover:border-gray-200'
                }`}
              >
                {isActive && (
                  <span className="absolute top-4 right-4 bg-[#09352F] text-[#A7D129] text-[8px] font-black uppercase px-2.5 py-1 rounded-full border border-[#A7D129]/20">
                    Active Plan
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{plan.name}</h3>
                    <p className="text-3xl font-black text-[#09352F] mt-2">${plan.price}<span className="text-xs font-semibold text-gray-400 font-mono"> / mo</span></p>
                    {plan.description && (
                      <p className="text-[10px] text-gray-500 font-medium mt-1.5 leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100">{plan.description}</p>
                    )}
                  </div>

                  <ul className="space-y-3 pt-3 border-t border-gray-100">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-[11.5px] text-gray-650 font-semibold leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> 
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button 
                    disabled={isActive}
                    onClick={() => {
                      setSelectedPlan({ name: plan.name, price: plan.price });
                      if (paymentAccounts.length > 0) {
                        setPaymentMethod(paymentAccounts[0].bankName);
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition uppercase tracking-wider cursor-pointer select-none ${
                      isActive 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border' 
                        : 'bg-[#09352F] hover:bg-[#11574d] text-white'
                    }`}
                  >
                    {isActive ? 'Current Plan Level' : 'Purchase & Upgrade'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dedicated Payments Integration explanation badge */}
      <div className="p-6 bg-[#09352F] text-white rounded-3xl border flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <span className="bg-[#A7D129]/15 text-[#A7D129] text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full border border-[#A7D129]/30">Payment Accounts Sync</span>
          <h4 className="text-sm font-black text-white">Directly Pay to Admin Accounts</h4>
          <p className="text-xs text-emerald-100 opacity-80 max-w-2xl leading-relaxed">
            The platform super admin has securely attached payment accounts. You can select one, send the funds manually, and record your approval logic below.
          </p>
        </div>
      </div>

      {/* Checkout Payment Flow Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-xs font-sans">
          
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-slate-800 shadow-2xl relative border border-slate-200 overflow-y-auto max-h-[90vh]">
            
            {/* Modal Closer */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 text-md font-bold cursor-pointer"
            >
              ✕
            </button>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="bg-[#09352F]/15 text-[#09352F] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Secure Secure Checkout</span>
                    <h3 className="text-md font-black text-[#09352F] mt-1">Upgrade Client Subscription</h3>
                    <p className="text-xs text-gray-500 font-medium">Configure mock payment options to deploy {selectedPlan.name} (${selectedPlan.price}/mo) to active tenant domain.</p>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    
                    {/* Payment Mode switcher */}
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">Select Payment Account to Send Funds</label>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                        {paymentAccounts.length === 0 && (
                          <div className="col-span-2 text-xs text-rose-500 p-3 bg-rose-50 rounded-xl border border-rose-100">
                            No payment accounts have been configured by the admin yet!
                          </div>
                        )}
                        {paymentAccounts.map(acc => (
                         <button
                           key={acc.id}
                           type="button"
                           onClick={() => setPaymentMethod(acc.bankName)}
                           className={`p-3 rounded-2xl border flex flex-col items-start gap-1 transition cursor-pointer text-left ${
                             paymentMethod === acc.bankName ? 'bg-[#09352F]/5 border-[#09352F] text-[#09352F]' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                           }`}
                         >
                           <span className="font-extrabold">{acc.bankName}</span>
                           <span className="text-[9px] font-mono opacity-70 line-clamp-1">{acc.accountName} - {acc.accountNumber}</span>
                         </button>
                        ))}
                      </div>
                    </div>

                    {paymentMethod && paymentAccounts.length > 0 && (
                      <div className="p-4 bg-slate-50 border rounded-2xl space-y-3 animate-slide-up">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transaction / Sender ID</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. TID-9812481 or your account"
                            className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl font-bold font-mono outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          Please send exactly <strong>${selectedPlan.price}</strong> to the selected account ({paymentMethod}) and enter your sender details or TID to inform the admin.
                        </p>
                      </div>
                    )}

                    {/* Pricing summary */}
                    <div className="p-4 rounded-2xl border border-dashed border-gray-200 text-slate-700 text-xs font-bold flex justify-between items-center bg-gray-50/50">
                      <div>
                        <span>Upgraded Tier:</span>
                        <p className="font-extrabold text-[#09352F]">{selectedPlan.name}</p>
                      </div>
                      <div className="text-right">
                        <span>Cleared Total:</span>
                        <p className="text-emerald-700 font-mono text-[16px] font-black">${selectedPlan.price}.00 USD</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={handleCloseModal}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 font-bold py-3 rounded-xl text-xs transition uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                      
                      <button 
                        type="submit"
                        disabled={isProcessing || paymentAccounts.length === 0}
                        className={`flex-1 font-black py-3 rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5 ${isProcessing || paymentAccounts.length === 0 ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-[#09352F] hover:bg-[#11574d] text-white cursor-pointer'}`}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Clearing...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-[#A7D129]" />
                            <span>Confirm Upgrade</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 text-center py-6"
                >
                  <div className="mx-auto bg-emerald-100 text-emerald-800 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-emerald-200">
                    <CheckCircle className="w-8 h-8 animate-bounce text-emerald-700" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-md font-black text-slate-800">Payment Gateway Cleared!</h3>
                    <p className="text-xs text-gray-500">Your SaaS subscription upgrade has been approved by the network.</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl text-left border text-xs font-mono space-y-1 mx-auto max-w-xs text-slate-600">
                    <div><span className="text-gray-400">Merchant:</span> PharmaScript Platform</div>
                    <div><span className="text-gray-400">Plan:</span> {selectedPlan.name}</div>
                    <div><span className="text-gray-400">Total Charged:</span> ${selectedPlan.price}.00 USD</div>
                    <div><span className="text-gray-400">Clearing Method:</span> {paymentMethod}</div>
                    <div><span className="text-gray-400">Renewal Cycle:</span> 30 Days Auto</div>
                  </div>

                  <button 
                    onClick={handleCloseModal}
                    className="w-full bg-[#09352F] hover:bg-[#11574d] text-white font-bold py-3 rounded-xl text-xs transition uppercase tracking-wider cursor-pointer mt-4"
                  >
                    Go back to workspace
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}

    </motion.div>
  );
}
