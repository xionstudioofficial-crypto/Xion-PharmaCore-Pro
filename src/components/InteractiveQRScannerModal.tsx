import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Check, QrCode, Volume2, Sparkles, ShoppingCart, HelpCircle } from 'lucide-react';

interface ScanTarget {
  name: string;
  barcode: string;
  costPrice?: number;
}

interface InteractiveQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (scanned: ScanTarget) => void;
  supplierName: string;
  availableMeds: ScanTarget[];
  title?: string;
  description?: string;
}

export const InteractiveQRScannerModal: React.FC<InteractiveQRScannerProps> = ({
  isOpen,
  onClose,
  onScan,
  supplierName,
  availableMeds,
  title = "QR Code & Barcode Scanner Desk",
  description = "Scan medicine QR codes to automatically record items down into the active purchase."
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [scanHistory, setScanHistory] = useState<{ name: string; barcode: string; time: string }[]>([]);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  // Play electronic medical barcode scanner beep using Web Audio API
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime); // High-pitched, clean beep
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  };

  // Handle triggered medicine scan
  const triggerScan = (med: ScanTarget) => {
    playBeep();
    setScanFeedback(med.name);
    
    const now = new Date().toLocaleTimeString();
    setScanHistory(prev => [{ name: med.name, barcode: med.barcode, time: now }, ...prev]);
    
    // Bubble the scanned target to parent state immediately
    onScan(med);

    // Reset feedback text after a moment
    setTimeout(() => {
      setScanFeedback(null);
    }, 1200);
  };

  // Handle camera activation stream
  useEffect(() => {
    if (isOpen && useCamera) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Camera access failed", err);
          alert("Could not access camera. Reverting to interactive simulator scan layout.");
          setUseCamera(false);
        });
    } else {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, useCamera]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop glassmorphism overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm"
          />

          {/* Dialog Frame */}
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-2xl w-full relative z-10 flex flex-col md:flex-row h-[550px]"
          >
            {/* Left section: Scanner Viewfinder screen */}
            <div className="md:w-3/5 bg-slate-950 p-5 flex flex-col justify-between relative text-slate-100 border-r border-slate-900">
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-300">Live Viewfinder</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setUseCamera(!useCamera)}
                  className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {useCamera ? "Use Simulator" : "Activate Webcam"}
                </button>
              </div>

              {/* Central Viewfinder Graphic Box */}
              <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center my-4 group">
                {useCamera ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-radial-gradient from-slate-900 to-slate-950 flex flex-col justify-center items-center text-center p-4">
                    <QrCode className="w-16 h-16 text-slate-700 mb-2 animate-pulse" />
                    <p className="text-xs text-slate-400 font-bold">Simulator Viewfinder Ready</p>
                    <p className="text-[10px] text-slate-500 max-w-[180px] mt-1">Tap any medicine in the list to trigger instant simulation scan</p>
                  </div>
                )}

                {/* Laser scan animation line */}
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10B981] animate-[bounce_3s_infinite]" />

                {/* 4 Corner brackets representing camera reticle */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br" />

                {/* Feedback overlay on success scan */}
                <AnimatePresence>
                  {scanFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center p-6 z-20"
                    >
                      <div className="p-3 bg-emerald-500 rounded-full text-slate-950 shadow-lg mb-2">
                        <Check className="w-6 h-6 stroke-[3px]" />
                      </div>
                      <p className="font-extrabold text-[13px] text-emerald-300">Scanned Successfully!</p>
                      <p className="text-[11px] font-black text-white mt-1 uppercase tracking-wider">{scanFeedback}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Lower info status banner */}
              <div className="text-[10px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/50">
                <span className="font-extrabold text-emerald-400 flex items-center gap-1 mb-1">
                  <Volume2 className="w-3.5 h-3.5" /> Scan Feedback Sound Engine:
                </span>
                Plays pitch beep confirmation on each successful target scan.
              </div>
            </div>

            {/* Right section: Available Drugs / Scan History list Desk */}
            <div className="md:w-2/5 p-5 flex flex-col justify-between overflow-hidden bg-slate-50">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div className="min-w-0">
                  <h3 className="font-black text-slate-800 text-sm truncate">{title}</h3>
                  <p className="text-[10px] text-[#1F7A5A] font-bold mt-0.5 uppercase tracking-wider">Manufacturer: {supplierName}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Middle Scrolling Segment containing Supplier-provided Medicines list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
                <div>
                  <h4 className="text-[9px] font-black text-gray-450 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Click to Simulate QR/Barcode scan
                  </h4>
                  
                  {availableMeds.length > 0 ? (
                    <div className="space-y-1.5">
                      {availableMeds.map((med, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => triggerScan(med)}
                          className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 rounded-xl border border-gray-150 hover:border-emerald-300 transition-all shadow-2xs flex justify-between items-center group/item"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-800 truncate group-hover/item:text-emerald-800">{med.name}</p>
                            <p className="text-[8px] font-mono font-bold text-gray-400 mt-0.5 bg-gray-100 rounded px-1.5 py-0.5 w-fit">QR: {med.barcode}</p>
                          </div>
                          
                          <div className="px-2.5 py-1 text-[9px] font-black uppercase text-[#1F7A5A] bg-[#1F7A5A]/5 rounded-lg border border-[#1F7A5A]/10 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all shrink-0">
                            Scan
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 text-gray-400 font-bold text-[10px]">
                      No mapped medicines listed for {supplierName}.
                    </div>
                  )}
                </div>

                {/* Scan list session history */}
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-[9px] font-black text-gray-450 uppercase tracking-widest mb-2">
                    Scanned Session Ledger ({scanHistory.length})
                  </h4>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                    {scanHistory.map((sh, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-gray-150 flex justify-between items-center text-[10px] font-mono">
                        <div className="truncate pr-2">
                          <p className="font-bold text-slate-700 truncate">{sh.name}</p>
                          <p className="text-[8px] text-gray-400">{sh.barcode}</p>
                        </div>
                        <span className="text-gray-400 text-[8px] shrink-0">{sh.time}</span>
                      </div>
                    ))}
                    {scanHistory.length === 0 && (
                      <p className="text-[10px] font-bold text-gray-400 text-center py-4">No logged scans in this session yet.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Lower helper instructions */}
              <div className="text-[10px] text-gray-500 bg-white border border-gray-200 p-2.5 rounded-xl flex items-start gap-1.5 mt-2">
                <HelpCircle className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5" />
                <p className="leading-tight font-medium">Scanned items automatically increment quantity by 100 units or appends them down to your requisition invoice draft.</p>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
