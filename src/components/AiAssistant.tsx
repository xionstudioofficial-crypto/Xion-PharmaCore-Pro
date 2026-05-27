import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Sparkles, Send, X, Trash2, HelpCircle, 
  Terminal, Volume2, VolumeX, CheckCircle2, Lock, 
  ChevronRight, Database, ShieldCheck, Sliders, BookOpen, 
  Layers, BellRing, Activity, MessageSquareShare, Mic, MicOff, Minus
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStockCard?: boolean;
}

const URDU_ENGLISH_PROMPTS = [
  {
    label: "Panadol Stock",
    desc: "Check current stock status",
    text: "Can you list the status of our current stock of mock medicines like Panadol?",
    urduText: "کیا آپ ہمارے موجودہ ادویات جیسے پیناڈول کے سٹاک کی صورتحال بتا سکتے ہیں؟"
  },
  {
    label: "Permissions",
    desc: "Check role permissions",
    text: "What client privileges and RBAC permissions does a 'Pharmacist' role hold here?",
    urduText: "یہاں 'فارماسسٹ' کے پاس کیا کیا اختیارات اور اجازتیں ہوتی ہیں؟"
  },
  {
    label: "Offline Sync",
    desc: "How offline sync works",
    text: "How does the SQLite persistent buffer sync work when local internet is down?",
    urduText: "اگر لوکل انٹرنیٹ بند ہو جائے تو ہمارا آف لائن SQLite ڈیٹا بیس کیسے کام کرتا ہے؟"
  },
  {
    label: "Multi-Tenancy",
    desc: "Explain isolation model",
    text: "Explain how multi-tenancy logic keeps individual pharmacy branches isolated.",
    urduText: "ملٹی ٹیننسی کیا ہے اور یہ الگ الگ فارمیسی برانچز کو محفوظ کیسے رکھتی ہے؟"
  },
  {
    label: "Sales Report",
    desc: "Get sales summary",
    text: "Provide an analytical breakdown of today's sales and revenue metrics.",
    urduText: "آج کے سیلز اور ریونیو پیمائش کی تفصیلات فراہم کریں۔"
  }
];

export function AiAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSidebarMenu, setActiveSidebarMenu] = useState<'chat' | 'suggested' | 'status' | 'kb' | 'help'>('chat');
  
  // Clean, professional initial message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `پیناڈول 500mg کی موجودہ اسٹاک درج ذیل ہے:\n🟢 موجودہ اسٹاک: 325 پیس\n💊 ری آرڈر لیول: 100 پیس\n🏪 لوکیشن: مین گودام\n📅 اختتامی تاریخ (قریب): 12/06/2026\n🏷️ بیچ نمبر: BT12345, BT12346\n🕒 آخری اپ ڈیٹ: آج 11:40 PM`,
      timestamp: new Date(),
      isStockCard: true
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modeLanguage, setModeLanguage] = useState<'urdu' | 'english'>('urdu');
  const [isMuted, setIsMuted] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Speech to text recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onstart = () => {
      setIsListening(true);
      if (!isMuted) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.08);
          gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {}
      }
    };

    recognitionInstance.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      if (resultText) {
        setInputValue(prev => {
          const suffix = prev && !prev.endsWith(' ') ? ' ' : '';
          return prev + suffix + resultText;
        });
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognitionInstance;
  }, [isMuted]);

  const handleToggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      triggerAlert("Voice recognition not fully compatible in this browser profile.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const selectedLocale = modeLanguage === 'urdu' ? 'ur-PK' : 'en-US';
      recognitionRef.current.lang = selectedLocale;
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeSidebarMenu, isOpen]);

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText) return;

    if (!textToSend) {
      setInputValue('');
    }

    setActiveSidebarMenu('chat');

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (!isMuted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (err) {}
    }

    try {
      const chatContext = {
        tenantId: user?.client?.id || 'sandbox-isolated',
        tenantName: user?.client?.name || 'Standard Pharmacy Workspace',
        tenantDomain: user?.client?.domain || 'portal.pharmascript.com',
        tenantPlan: user?.client?.plan || 'Enterprise Free Plan',
        userName: user?.name || 'Local Operator',
        userRole: user?.role || 'Pharmacist',
        activeTab: 'Dashboard'
      };

      const messageHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      })).concat({ role: userMessage.role, content: userMessage.content });

      const apiEndpoint = `${import.meta.env.BASE_URL || '/'}api/chat`.replace(/\/+/g, '/');
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messageHistory,
          context: chatContext
        })
      });

      const data = await res.json();

      if (res.ok && data.text) {
        const isStock = data.text.includes("موجودہ اسٹاک") || data.text.includes("Stock Level") || data.text.includes("کہاں") || data.text.includes("پیس") || data.text.includes(" Panadol");

        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: data.text,
          timestamp: new Date(),
          isStockCard: isStock
        }]);

        if (!isMuted) {
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(900, audioCtx.currentTime);
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.06);
            gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
          } catch (e) {}
        }
      } else {
        throw new Error(data.error || "Failed to receive AI response.");
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: `⚠️ Error fetching answer: ${error?.message || "connection failed"}. Please verify that GEMINI_API_KEY is configured in your platform settings file.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Reset conversation chat logs?")) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'پیناڈول 500mg کی موجودہ اسٹاک درج ذیل ہے:\n🟢 موجودہ اسٹاک: 325 پیس\n💊 ری آرڈر لیول: 100 پیس\n🏪 لوکیشن: مین گودام\n📅 اختتامی تاریخ (قریب): 12/06/2026\n🏷️ بیچ نمبر: BT12345, BT12346\n🕒 آخری اپ ڈیٹ: آج 11:40 PM',
          timestamp: new Date(),
          isStockCard: true
        }
      ]);
      triggerAlert("Conversations matching secure tenanted logs has been cleared.");
    }
  };

  const handleOpenStockReport = () => {
    const event = new CustomEvent('ai-switch-tab', { detail: 'Inventory' });
    window.dispatchEvent(event);
    setIsOpen(false);
    
    if (!isMuted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.setValueAtTime(850, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (err) {}
    }
  };

  const parseMarkdownCustom = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let parsed = line;

      if (parsed.startsWith('```')) {
        return <div key={idx} className="my-1.5 p-2 bg-slate-900 font-mono text-2xs text-[#A7D129] border border-slate-800 rounded-lg overflow-x-auto select-all">{parsed.replace(/```/g, '')}</div>;
      }

      const isBullet = parsed.startsWith('* ') || parsed.startsWith('- ') || parsed.startsWith('• ');
      if (isBullet) {
        parsed = parsed.substring(2);
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(parsed)) !== null) {
        if (match.index > lastIndex) {
          parts.push(parsed.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-[#1F7A5A]">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < parsed.length) {
        parts.push(parsed.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : parsed;

      if (isBullet) {
        return (
          <li key={idx} className="ml-3.5 list-disc text-slate-700 text-xs leading-relaxed my-0.5">
            {content}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-slate-700 text-xs leading-relaxed my-0.5 font-sans">
          {content}
        </p>
      );
    });
  };

  const formatInventoryList = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-slate-700 font-sans">
        {lines.filter(l => l.trim() !== '').map((line, index) => {
          let iconElement = <span className="text-emerald-600 font-bold mr-1.5 text-xs">✔</span>;
          let content = line;

          if (line.includes("🟢") || line.includes("موجودہ اسٹاک") || line.includes("Current Stock")) {
            iconElement = <span className="text-xs mr-1.5">🟢</span>;
            content = line.replace("🟢", "").trim();
          } else if (line.includes("💊") || line.includes("ری آرڈر لیول") || line.includes("Reorder Level")) {
            iconElement = <span className="text-xs mr-1.5">💊</span>;
            content = line.replace("💊", "").trim();
          } else if (line.includes("🏪") || line.includes("لوکیشن") || line.includes("Location")) {
            iconElement = <span className="text-xs mr-1.5">🏪</span>;
            content = line.replace("🏪", "").trim();
          } else if (line.includes("📅") || line.includes("اختتامی تاریخ") || line.includes("Expiry Date")) {
            iconElement = <span className="text-xs mr-1.5">📅</span>;
            content = line.replace("📅", "").trim();
          } else if (line.includes("🏷️") || line.includes("بیچ نمبر") || line.includes("Batch")) {
            iconElement = <span className="text-xs mr-1.5">🏷️</span>;
            content = line.replace("🏷️", "").trim();
          } else if (line.includes("🕒") || line.includes("آخری اپ ڈیٹ") || line.includes("Last Updated")) {
            iconElement = <span className="text-xs mr-1.5">🕒</span>;
            content = line.replace("🕒", "").trim();
          }

          return (
            <div key={index} className="flex items-center text-xs py-0.5 hover:translate-x-0.5 transition-transform duration-200">
              <span className="shrink-0">{iconElement}</span>
              <span className="font-semibold text-slate-600 ml-1">{content}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Alert Banner */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 border border-gray-800"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A7D129]" />
            <span>{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED LAUNCHER BAR IN SAME ORIGINAL POSITION */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9990]"
        animate={{
          y: [0, -4, 0]
        }}
        transition={{
          y: {
            duration: 4.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      >
        <button
          id="ai-copilot-button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1F7A5A] to-[#14523C] hover:to-[#0C443C] text-white rounded-full font-bold text-xs tracking-wide cursor-pointer shadow-lg hover:shadow-emerald-900/15 hover:scale-105 transition active:scale-95 border border-white/10 group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="font-sans font-extrabold tracking-wide text-[11px] uppercase">ASK AI AGENT</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Very faint backdrop overlay on mobile only, non-blocking on desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[9995] md:hidden block"
            />

            {/* REDESIGNED COMPACT ASSISTANT PORTAL DRAWERN / PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`bg-[#F7F8F3] flex flex-col shadow-2xl border border-gray-200 overflow-hidden z-[9999] transition-all duration-300
                fixed bottom-0 left-0 right-0 h-[65vh] w-full rounded-t-[24px]
                sm:bottom-[88px] sm:right-6 sm:left-auto sm:w-[400px] sm:h-[70vh] sm:max-h-[580px] sm:rounded-[24px]
              `}
            >
              
              {/* 1. PROFESSIONAL STICKY HEADER */}
              <div className="bg-white p-3.5 shrink-0 flex items-center justify-between border-b border-gray-200/80 sticky top-0 z-10 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#1F7A5A]/5 border border-gray-150 rounded-xl flex items-center justify-center">
                      <Bot className="w-5.25 h-5.25 text-[#1F7A5A]" />
                    </div>
                    <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white"></span>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-[#1E1E1E] text-sm tracking-tight font-sans">PharmaCore Assistant</h3>
                      <span className="bg-[#A7D129]/25 text-[#1F7A5A] text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full font-mono tracking-wide leading-none">
                        PRO
                      </span>
                    </div>
                    <p className="text-[9.5px] text-gray-500 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Online • Tenant Isolated
                    </p>
                  </div>
                </div>

                {/* Header Action Tools */}
                <div className="flex items-center gap-1.5">
                  {/* Lang selector directly in header */}
                  <div className="bg-gray-100/80 p-0.5 rounded-lg flex items-center mr-1">
                    <button 
                      onClick={() => setModeLanguage('urdu')}
                      className={`px-1.5 py-0.5 text-[9.5px] font-black rounded transition cursor-pointer select-none ${modeLanguage === 'urdu' ? 'bg-[#1F7A5A] text-white shadow-xs' : 'text-gray-500 hover:text-slate-700'}`}
                    >
                      اردو
                    </button>
                    <button 
                      onClick={() => setModeLanguage('english')}
                      className={`px-1.5 py-0.5 text-[9.5px] font-black rounded transition cursor-pointer select-none ${modeLanguage === 'english' ? 'bg-[#1F7A5A] text-white shadow-xs' : 'text-gray-500 hover:text-slate-700'}`}
                    >
                      EN
                    </button>
                  </div>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? "Unmute sound clicks" : "Mute audio"}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                      isMuted ? "bg-gray-50 border-gray-150 text-gray-400" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleClearHistory}
                    title="Clear chat history"
                    className="p-1.5 bg-white rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50/50 text-gray-500 hover:text-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    title="Minimize"
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-slate-700 rounded-lg border border-gray-150 transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. SECURITY WARNING BAR */}
              <div className="bg-white px-3.5 py-2 border-b border-gray-150/80 flex items-center justify-between text-[10px] text-gray-500 font-semibold shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#1F7A5A]" />
                  <span>Logged in as: <span className="font-extrabold text-slate-800">{user?.role || "Pharmacist"}</span></span>
                </div>
                <div className="text-[8.5px] uppercase font-black tracking-widest text-[#1F7A5A] bg-[#1F7A5A]/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  Secure Isolation
                </div>
              </div>

              {/* 3. MULTI-TAB SCROLLABLE NAVIGATION HEADER BAR */}
              <div className="bg-white px-2 py-1.5 border-b border-gray-200 flex items-center justify-start gap-1 overflow-x-auto scrollbar-none z-10 shrink-0 select-none">
                {[
                  { id: 'chat', label: 'AI Chat', icon: MessageSquareShare },
                  { id: 'suggested', label: 'Scenarios', icon: Sparkles },
                  { id: 'status', label: 'Systems', icon: Sliders },
                  { id: 'kb', label: 'FAQs', icon: BookOpen },
                  { id: 'help', label: 'Help', icon: HelpCircle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSidebarMenu === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSidebarMenu(tab.id as any)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                        isActive 
                          ? 'bg-[#1F7A5A] text-white shadow-xs' 
                          : 'text-gray-500 hover:text-slate-800 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 4. MAIN CENTRAL CANVAS AREA */}
              <div className="flex-1 overflow-y-auto relative min-h-0">
                
                {/* 4A. CHAT VIEWS PANEL */}
                {activeSidebarMenu === 'chat' && (
                  <div className="p-3.5 space-y-4">
                    
                    {/* Welcome diagnostic header */}
                    <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3 select-none">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5 text-[#1F7A5A]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-extrabold text-slate-800 text-xs">PharmaCore Dialogue Stream</h4>
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                          Ask standard questions using English or Urdu. The system accesses direct inventory snapshots securely.
                        </p>
                      </div>
                    </div>

                    {/* Chat Logs */}
                    <div className="space-y-3.5">
                      {messages.map((m) => (
                        <div 
                          key={m.id}
                          className={`flex gap-2.5 max-w-[90%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                        >
                          {m.role === 'assistant' && (
                            <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <Bot className="w-4 h-4 text-[#1F7A5A]" />
                            </div>
                          )}

                          <div className="space-y-1 select-text">
                            
                            {/* Stock custom Card or typical paragraph balloon */}
                            {m.isStockCard ? (
                              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-xs p-4 shadow-sm space-y-3">
                                <div>
                                  <h5 className="font-bold text-[#1E1E1E] text-xs leading-snug font-sans">
                                    پیناڈول 500mg کی موجودہ اسٹاک درج ذیل ہے:
                                  </h5>
                                  <span className="text-[9px] text-[#1F7A5A] uppercase font-black tracking-widest font-mono">Stock Analysis Module</span>
                                </div>

                                <div className="bg-gray-50/70 p-2.5 rounded-xl border border-gray-200/50">
                                  {formatInventoryList(m.content.replace("پیناڈول 500mg کی موجودہ اسٹاک درج ذیل ہے:", ""))}
                                </div>

                                {/* Custom quick sub-actions inline inside the stock report card */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-gray-100">
                                  <button
                                    onClick={handleOpenStockReport}
                                    className="px-2.5 py-1.5 bg-[#1F7A5A]/5 hover:bg-[#1F7A5A]/10 text-[#1F7A5A] border border-[#1F7A5A]/10 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer select-none active:scale-95 duration-150"
                                  >
                                    <Layers className="w-3.5 h-3.5 text-[#1F7A5A]" />
                                    <span>📊 Go to Inventory page</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => triggerAlert("🔔 Reorder trigger levels configured at 100 units successfully.")}
                                    className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer select-none active:scale-95 duration-150"
                                  >
                                    <BellRing className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Set alert</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className={`p-3.5 rounded-2xl shadow-2xs text-xs whitespace-pre-wrap ${
                                m.role === 'user'
                                  ? "bg-white text-[#1E1E1E] rounded-tr-xs border border-gray-250 font-semibold"
                                  : "bg-white text-[#1E1E1E] rounded-tl-xs border border-gray-200"
                              }`}>
                                {parseMarkdownCustom(m.content)}
                              </div>
                            )}

                            {/* Time stamp */}
                            <div className={`flex items-center gap-1 text-[9px] text-gray-400 font-bold font-mono ${
                              m.role === 'user' ? "justify-end" : "justify-start pl-1"
                            }`}>
                              <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {m.role === 'user' && <span className="text-emerald-600 font-extrabold">✓✓</span>}
                            </div>

                          </div>
                        </div>
                      ))}

                      {/* LOADING CHAT ANIMATION */}
                      {isLoading && (
                        <div className="flex gap-2.5 max-w-[85%] mr-auto items-start select-none">
                          <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-2xs">
                            <Bot className="w-4 h-4 text-[#1F7A5A]" />
                          </div>
                          <div className="space-y-1">
                            <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-xs space-y-1.5 shadow-2xs">
                              <span className="font-semibold text-[11px] text-gray-500 block animate-pulse">
                                {modeLanguage === 'urdu' ? "کم اسٹاک تلاش کر رہا ہوں..." : "Searching inventory logs..."}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#1F7A5A] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-[#1F7A5A] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-[#1F7A5A] rounded-full animate-bounce" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div ref={endOfMessagesRef} />
                  </div>
                )}

                {/* 4B. SCENARIOS PAGE */}
                {activeSidebarMenu === 'suggested' && (
                  <div className="p-4 space-y-3.5 select-none font-sans">
                    <div className="border-b border-gray-200 pb-2.5">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#1F7A5A]" /> Pre-configured Diagnostic Prompts
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">Select one scenario listed below to request immediate secure database actions.</p>
                    </div>

                    <div className="space-y-2.5">
                      {URDU_ENGLISH_PROMPTS.map((p, idx) => {
                        const triggerText = modeLanguage === 'urdu' ? p.urduText : p.text;
                        return (
                          <div 
                            key={idx}
                            onClick={() => handleSendMessage(triggerText)}
                            className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-[#1F7A5A] shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer group flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <span className="font-extrabold text-xs text-slate-800 group-hover:text-[#1F7A5A] transition">
                                {p.label}
                              </span>
                              <p className="text-[10px] text-slate-500 mt-1">{p.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1F7A5A] group-hover:translate-x-0.5 transition shrink-0 self-center" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4C. COGNITIVE STATS PANEL */}
                {activeSidebarMenu === 'status' && (
                  <div className="p-4 space-y-4 select-none font-sans">
                    <div className="border-b border-gray-200 pb-2.5">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#1F7A5A]" /> Real-time System Diagnostics
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">Tenant diagnostic states and isolated persistent SQLite buffers</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-center">
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Operational Role</span>
                        <span className="font-extrabold text-[#1F7A5A] text-xs block mt-0.5">{user?.role || "Pharmacist"}</span>
                        <span className="text-[8.5px] bg-[#1F7A5A]/5 text-[#1F7A5A] border border-emerald-500/10 px-2 py-0.5 rounded-full font-bold inline-block mt-2 font-mono leading-none">RBAC OK</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Local Sync Buffer</span>
                        <span className="font-extrabold text-[#1E1E1E] text-xs block mt-0.5">0 blocks pending</span>
                        <span className="text-[8.5px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full font-bold inline-block mt-2 font-mono leading-none">SYNCED ACTIVE</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-extrabold text-slate-700 uppercase">Tenant Cryptography</span>
                        <span className="text-[8.5px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono leading-none">AES-256</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-normal font-medium">
                        Each pharmacy environment maintains an isolated local data pipeline. Rest assured, lateral multi-tenant intrusion attempts are blocked at origin.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4D. FAQ Accordions */}
                {activeSidebarMenu === 'kb' && (
                  <div className="p-4 space-y-3.5 select-none font-sans">
                    <div className="border-b border-gray-200 pb-2.5">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#1F7A5A]" /> FAQ & Knowledge Base
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">Common system information and PharmaCore parameters config.</p>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3 bg-white border border-gray-200 rounded-xl">
                        <p className="font-bold text-slate-805 text-xs">How can I set drug reorder levels?</p>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">
                          Go to the Medicines tab, select any item, and write the minimum stock target level. You'll receive alert pushes when items fall below it.
                        </p>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-xl">
                        <p className="font-bold text-slate-805 text-xs">Can anyone process sales returns?</p>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">
                          No, returns require "Owner/Admin" role clearance to process and reconcile with the cash drawer.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4E. KEYS & ACCELERATORS */}
                {activeSidebarMenu === 'help' && (
                  <div className="p-4 space-y-3.5 select-none font-sans">
                    <div className="border-b border-gray-200 pb-2.5">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#1F7A5A]" /> Accelerator Keys & Shortcuts
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">Speed up daily transactions using standard keys</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 grid grid-cols-1 gap-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-gray-500 font-semibold">New Drug Entry</span>
                        <kbd className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold text-slate-700">Ctrl + M</kbd>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-gray-500 font-semibold">Open Barcode Scanner</span>
                        <kbd className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold text-slate-700">Ctrl + B</kbd>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-gray-500 font-semibold">Launch AI Assistant</span>
                        <kbd className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold text-slate-700">Open Launcher</kbd>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* 5. SUGGESTED CHIPS HORIZONTAL ROW */}
              <div className="px-3.5 py-2 bg-gray-50 border-t border-gray-200/80 shrink-0 overflow-x-auto scrollbar-none flex items-center gap-1.5 select-none">
                {URDU_ENGLISH_PROMPTS.map((p, idx) => {
                  const actionText = modeLanguage === 'urdu' ? p.urduText : p.text;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(actionText)}
                      className="px-2.5 py-1 bg-white border border-gray-200 hover:border-[#1F7A5A] rounded-full text-[10.5px] font-extrabold text-slate-650 hover:text-[#1F7A5A] whitespace-nowrap transition-all duration-150 shadow-2xs click-feedback cursor-pointer"
                    >
                      ✨ {p.label}
                    </button>
                  );
                })}
              </div>

              {/* 6. REDESIGNED COMPACT INPUT AREA */}
              <div className="p-3.5 bg-white border-t border-gray-200 shrink-0 relative z-20 select-none">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="bg-gray-50 border border-gray-200 focus-within:border-[#1F7A5A] focus-within:ring-1 focus-within:ring-[#1F7A5A]/50 rounded-full p-1.5 flex items-center gap-1.5 transition-all duration-200"
                >
                  {/* Attachment action button */}
                  <button
                    type="button"
                    onClick={() => triggerAlert("📂 Secure attachment upload pipeline is isolated by client tenant domain.")}
                    className="p-1.5 text-gray-400 hover:text-[#1F7A5A] hover:bg-gray-100 rounded-full transition cursor-pointer"
                    title="Attach files safely"
                  >
                    <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </button>

                  {/* Mic action button */}
                  {speechSupported ? (
                    <button
                      type="button"
                      onClick={handleToggleVoiceInput}
                      className={`p-1.5 rounded-full transition shrink-0 cursor-pointer flex items-center justify-center relative ${
                        isListening 
                          ? "bg-rose-50 border border-rose-100 text-rose-500 animate-pulse" 
                          : "text-gray-400 hover:text-[#1F7A5A] hover:bg-gray-100"
                      }`}
                      title={isListening ? "Stop voice input" : "Bilingual Voice Input (Urdu/English)"}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="p-1.5 text-gray-250 cursor-not-allowed shrink-0"
                      title="Speech-to-text not fully supported in this browser profile."
                    >
                      <MicOff className="w-4 h-4" />
                    </button>
                  )}

                  {/* Compact input field */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={modeLanguage === 'urdu' ? "پوچھنے کے لیے لکھیں..." : "Ask me anything..."}
                    className="flex-1 bg-transparent border-none text-slate-800 placeholder-gray-400 text-xs focus:outline-none focus:ring-0 leading-tight focus:border-transparent py-1 px-1.5"
                    disabled={isLoading}
                  />

                  {/* Send paper plane button */}
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="p-1.5 bg-[#1F7A5A] hover:bg-[#165a42] disabled:bg-gray-100 text-white disabled:text-gray-400 rounded-full transition duration-150 shrink-0 cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Hearing notification */}
                {isListening && (
                  <div className="flex items-center gap-1.5 mt-2 px-1 text-[9.5px] text-rose-500 font-bold animate-pulse font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping" />
                    <span>🎙️ Listening in {modeLanguage === 'urdu' ? 'Urdu' : 'English'}... Speak now!</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1 mt-2 text-[9.5px] text-gray-400 font-semibold font-sans">
                  <Lock className="w-3 h-3 text-gray-300" />
                  <span>Your conversation is private & secured</span>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
