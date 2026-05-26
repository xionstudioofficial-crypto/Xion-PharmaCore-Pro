import React, { useState } from 'react';
import { useSync, SyncQueueItem } from '@/src/context/SyncContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, Wifi, WifiOff, RefreshCw, Play, Trash2, Terminal, Code,
  PlusCircle, ArrowRightLeft, CheckCircle2, AlertTriangle, Cpu, Server, 
  HelpCircle, CheckCircle, DatabaseZap, TableProperties, Sparkles, FileCode, SquareTerminal
} from "lucide-react";

// Initial mock data templates for database preview
const INITIAL_SQLITE_ROWS = [
  { id: "MED-001", name: "Amoxicillin Par", qty: 450, table: "medicines" },
  { id: "MED-002", name: "Lipitor Atorvastatin", qty: 310, table: "medicines" },
  { id: "CUST-901", name: "Sarah Connor", phone: "+1 555-0199", table: "customers" },
  { id: "EXP-101", name: "Property Lease Lease", amount: 2200, table: "expenses" }
];

export function DatabaseSyncPage() {
  const { 
    isOnline, 
    toggleOnline, 
    isSyncing, 
    syncQueue, 
    addToSyncQueue, 
    removeQueueItem, 
    clearSyncQueue, 
    triggerPostgresSync,
    syncLogs,
    clearSyncLogs
  } = useSync();

  const [activeSubTab, setActiveSubTab] = useState<'console' | 'schemas' | 'instructions'>('console');
  
  // States to drive mock offline simulation entries
  const [mockType, setMockType] = useState<'sale' | 'customer' | 'medicine'>('sale');
  const [mockValue, setMockValue] = useState('145.50');
  const [mockName, setMockName] = useState('Sarah Connor');
  const [mockMedicineName, setMockMedicineName] = useState('Amoxicillin Forte');
  const [mockQuantity, setMockQuantity] = useState('250');

  // Simulated live synced rows state (combines starting state + synced records)
  const [localSqliteRows, setLocalSqliteRows] = useState(INITIAL_SQLITE_ROWS);
  const [pgCloudRows, setPgCloudRows] = useState(INITIAL_SQLITE_ROWS);

  // Quick simulated transaction generator
  const triggerSimulatedAction = () => {
    if (mockType === 'sale') {
      const saleId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = { id: saleId, amount: parseFloat(mockValue), customer: mockName, channel: 'In-Store POS' };
      const sql = `INSERT INTO sqlite_sales (id, amount, customer, channel) VALUES ('${saleId}', ${mockValue}, '${mockName}', 'In-Store POS');`;
      
      // Update local SQLite table state immediately
      setLocalSqliteRows(prev => [...prev, { id: saleId, name: `Sale: ${mockName} ($${mockValue})`, qty: 1, table: 'sales' }]);
      
      // Push to sync queue
      addToSyncQueue('INSERT', 'sales', payload, sql);
      
      // If we are online, it automatically syncs to PG, so update PG table too
      if (isOnline) {
        setTimeout(() => {
          setPgCloudRows(prev => [...prev, { id: saleId, name: `Sale: ${mockName} ($${mockValue})`, qty: 1, table: 'sales' }]);
        }, 550);
      }
    } else if (mockType === 'customer') {
      const custId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
      const payload = { id: custId, name: mockName, phone: '+1-555-POS-OUT' };
      const sql = `INSERT INTO sqlite_customers (id, name, phone) VALUES ('${custId}', '${mockName}', '+1-555-POS-OUT');`;
      
      setLocalSqliteRows(prev => [...prev, { id: custId, name: mockName, qty: 0, table: 'customers' }]);
      addToSyncQueue('INSERT', 'customers', payload, sql);
      
      if (isOnline) {
        setTimeout(() => {
          setPgCloudRows(prev => [...prev, { id: custId, name: mockName, qty: 0, table: 'customers' }]);
        }, 550);
      }
    } else if (mockType === 'medicine') {
      const medId = `MED-${Math.floor(100 + Math.random() * 900)}`;
      const payload = { id: medId, name: mockMedicineName, qty: parseInt(mockQuantity) };
      const sql = `INSERT INTO sqlite_medicines (id, name, stock_qty) VALUES ('${medId}', '${mockMedicineName}', ${mockQuantity});`;
      
      setLocalSqliteRows(prev => [...prev, { id: medId, name: mockMedicineName, qty: parseInt(mockQuantity), table: 'medicines' }]);
      addToSyncQueue('INSERT', 'medicines', payload, sql);
      
      if (isOnline) {
        setTimeout(() => {
          setPgCloudRows(prev => [...prev, { id: medId, name: mockMedicineName, qty: parseInt(mockQuantity), table: 'medicines' }]);
        }, 550);
      }
    }
  };

  // Perform a full transactional replication sync
  const handleFullReplicationSync = async () => {
    // Copy any items from local sync queue over to PG rows state
    const pendingItems = [...syncQueue];
    
    await triggerPostgresSync();
    
    // Apply simulated changes to PostgreSQL master
    setPgCloudRows(prev => {
      let updated = [...prev];
      pendingItems.forEach(item => {
        const found = updated.some(r => r.id === item.payload.id);
        if (!found) {
          updated.push({
            id: item.payload.id,
            name: item.table === 'sales' ? `Sale: ${item.payload.customer} ($${item.payload.amount})` : item.payload.name || 'New Record',
            qty: item.payload.qty || 1,
            table: item.table
          });
        }
      });
      return updated;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-teal-950 to-[#0e4b41] p-6 rounded-3xl text-white shadow-xl relative border border-teal-800 overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-8 select-none">
          <DatabaseZap className="w-96 h-96 text-emerald-400" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="bg-emerald-500/10 text-emerald-300 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 w-fit">
              <Cpu className="w-3.5 h-3.5" /> High-Concurring Engine Active
            </span>
            <h1 className="text-2xl font-black tracking-tight">PostgreSQL & SQLite Dual-Database Sync Panel</h1>
            <p className="text-xs text-teal-100 max-w-3xl leading-relaxed">
              This panel demonstrates the offline storage database stack. When internet goes down, transactions queue locally into the <strong>SQLite database</strong>. Once connection resumes, a queue processor pushes transactional changes up to the <strong>PostgreSQL cloud master database</strong> without data collisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-stretch md:self-auto shrink-0">
            {/* Toggle Switch */}
            <button 
              onClick={toggleOnline}
              className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md ${
                isOnline 
                  ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 animate-pulse text-white" />
                  <span>SYSTEM ONLINE (Postgres RDS Enabled)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 animate-bounce text-white" />
                  <span>SYSTEM OFFLINE (Local SQLite Mode)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Simulated Input Action & Active Outbox Queue (Cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Action Simulator box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Simulate Offline Pharmacy Activity</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Simulate POS sales or pharmacy edits while offline to watch how SQLite records queue them.</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl flex gap-1 border border-gray-100">
              <button 
                onClick={() => setMockType('sale')}
                className={`flex-1 text-[11px] font-bold py-2 rounded-xl transition cursor-pointer ${
                  mockType === 'sale' ? "bg-white text-[#09352F] shadow-xs" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                POS Checkout
              </button>
              <button 
                onClick={() => setMockType('customer')}
                className={`flex-1 text-[11px] font-bold py-2 rounded-xl transition cursor-pointer ${
                  mockType === 'customer' ? "bg-white text-[#09352F] shadow-xs" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                Register Customer
              </button>
              <button 
                onClick={() => setMockType('medicine')}
                className={`flex-1 text-[11px] font-bold py-2 rounded-xl transition cursor-pointer ${
                  mockType === 'medicine' ? "bg-white text-[#09352F] shadow-xs" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                Register Stock Item
              </button>
            </div>

            {/* Dynamic Inputs depending on type */}
            <div className="space-y-3 pt-2">
              {mockType === 'sale' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Price ($)</label>
                    <input 
                      type="number" 
                      value={mockValue} 
                      onChange={e => setMockValue(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold font-mono outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer</label>
                    <input 
                      type="text" 
                      value={mockName} 
                      onChange={e => setMockName(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none" 
                    />
                  </div>
                </div>
              )}

              {mockType === 'customer' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer Name</label>
                  <input 
                    type="text" 
                    value={mockName} 
                    onChange={e => setMockName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none" 
                  />
                </div>
              )}

              {mockType === 'medicine' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Medicine Name</label>
                    <input 
                      type="text" 
                      value={mockMedicineName} 
                      onChange={e => setMockMedicineName(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Stock Qty</label>
                    <input 
                      type="number" 
                      value={mockQuantity} 
                      onChange={e => setMockQuantity(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold font-mono outline-none" 
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={triggerSimulatedAction}
                className="w-full flex items-center justify-center gap-2 bg-[#09352F] hover:bg-[#11574d] text-white py-3 rounded-xl text-xs font-black transition cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-[#A7D129]" />
                Commit to SQLite ({isOnline ? 'Direct Online Stream' : 'Queue Locally offline'})
              </button>
            </div>
          </div>

          {/* SQLite Queue Buffer Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                  <span>SQLite Queue Outbox ({syncQueue.length} Pending)</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">Pending queries scheduled for transactional PostgreSQL execution.</p>
              </div>

              {syncQueue.length > 0 && (
                <button 
                  onClick={clearSyncQueue} 
                  className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Force Wipe
                </button>
              )}
            </div>

            {/* List queue card entries */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {syncQueue.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-450 space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500/80 mx-auto" />
                    <p className="text-xs font-bold">Queue Empty & Synced</p>
                    <p className="text-[10px] text-gray-400">Local SQLite is completely synchronized with PostgreSQL!</p>
                  </div>
                ) : (
                  syncQueue.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="p-3 bg-amber-50/30 border border-amber-200/50 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center bg-amber-100/40 p-1 rounded font-mono text-[9px] text-amber-800 font-bold">
                        <span>ID: #{item.id}</span>
                        <span>TBL: {item.table.toUpperCase()}</span>
                        <span>{item.action === 'INSERT' ? '+ ADD' : '~ UPD'}</span>
                      </div>

                      <div className="text-[10px] text-slate-700 font-mono bg-slate-900 text-slate-200 p-2 rounded overflow-x-auto whitespace-pre leading-normal border border-slate-950">
                        {item.sqliteQuery}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                        <span>Queued: {new Date(item.timestamp).toLocaleTimeString()}</span>
                        <button 
                          onClick={() => removeQueueItem(item.id)}
                          className="text-gray-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Sync action bottom banner */}
            {syncQueue.length > 0 && (
              <div className="pt-2">
                {isOnline ? (
                  <button 
                    onClick={handleFullReplicationSync}
                    disabled={isSyncing}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-850 text-white py-3.5 rounded-xl text-xs font-black transition cursor-pointer shadow-md active:scale-95 duration-100"
                  >
                    <Play className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Replicating transactions...' : `Push ${syncQueue.length} queries to PostgreSQL`}
                  </button>
                ) : (
                  <div className="bg-orange-50 border border-orange-200/50 p-3 rounded-2xl text-[11px] text-orange-850 font-bold flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Postgres is currently Offline. Go "Online" to trigger replication queue.</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right column: DB Console terminal, schema table previewing (Cols 7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between min-h-[500px]">
          
          <div className="space-y-4">
            
            {/* Top selection Tabs */}
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl border">
                <button 
                  onClick={() => setActiveSubTab('console')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition duration-205 cursor-pointer ${
                    activeSubTab === 'console' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <SquareTerminal className="w-3.5 h-3.5 inline mr-1" /> SQL Log Monitor
                </button>
                <button 
                  onClick={() => setActiveSubTab('schemas')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition duration-205 cursor-pointer ${
                    activeSubTab === 'schemas' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <TableProperties className="w-3.5 h-3.5 inline mr-1" /> SQLite vs Postgres Tables
                </button>
                <button 
                  onClick={() => setActiveSubTab('instructions')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition duration-205 cursor-pointer ${
                    activeSubTab === 'instructions' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 inline mr-1" /> Tech Spec Arch
                </button>
              </div>

              {activeSubTab === 'console' && (
                <button 
                  onClick={clearSyncLogs}
                  className="text-[10px] font-semibold text-gray-400 hover:text-gray-700"
                >
                  Clear Console
                </button>
              )}
            </div>

            {/* TAB CONTENT A: SQL TERMINAL CONSOLE */}
            {activeSubTab === 'console' && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Postgres/SQLite Live Database Replication Console</span>
                </div>

                <div className="bg-slate-950 text-slate-300 p-5 rounded-3xl font-mono text-[11px] h-96 overflow-y-auto space-y-2 border border-slate-900 shadow-inner">
                  {syncLogs.map((log, index) => {
                    let color = 'text-slate-400';
                    let label = 'SYS';
                    if (log.type === 'success') { color = 'text-emerald-400'; label = 'SUCCESS'; }
                    if (log.type === 'warn') { color = 'text-amber-400'; label = 'WARNING'; }
                    if (log.type === 'error') { color = 'text-rose-500'; label = 'CRITICAL'; }
                    if (log.type === 'sqlite') { color = 'text-cyan-400'; label = 'SQLITE-DB'; }
                    if (log.type === 'postgres') { color = 'text-indigo-400'; label = 'POSTGRES'; }

                    return (
                      <div key={index} className="border-b border-white/5 pb-1.5 last:border-0">
                        <span className="text-white/30 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`font-black mr-2 [text-shadow:0_0_12px_rgba(255,255,255,0.15)] ${color}`}>{label} ›</span>
                        <span className="text-white/90 break-words">{log.message}</span>
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-[10px] text-gray-400 font-medium">
                  * Live SQLite writes execute against HTML5 IndexedDB storage keys acting as SQLite mock system targets, persistent across tab sessions.
                </p>
              </div>
            )}

            {/* TAB CONTENT B: SCHEMAS & SYNC VERIFICATION TABLES */}
            {activeSubTab === 'schemas' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <TableProperties className="w-4 h-4 text-emerald-600" />
                    <span>Real-time DB Replication Visualizer</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-normal mt-1">
                    Compare both databases. When offline, edits go to SQLite only. Once synced, they replicate to the cloud PostgreSQL database.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* LOCAL DATABASE: SQLITE */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-250/50">
                    <div className="flex justify-between items-center border-b pb-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Database className="w-4 h-4 text-[#09352F]" />
                        <span className="text-xs font-extrabold text-[#09352F]">Local DB: SQLite</span>
                      </div>
                      <span className="bg-emerald-100 text-[#09352F] font-mono text-[9px] px-1.5 py-0.5 rounded font-black">ACTIVE LOCAL</span>
                    </div>

                    <div className="space-y-2 h-64 overflow-y-auto">
                      {localSqliteRows.map((row, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-gray-150 flex justify-between items-center text-[10.5px]">
                          <div>
                            <span className="font-mono text-gray-400 font-bold block text-[9px]">ID: {row.id}</span>
                            <span className="font-extrabold text-slate-800">{row.name}</span>
                          </div>
                          <span className="font-mono text-[9px] bg-slate-100 px-1 py-0.5 rounded text-gray-500 uppercase">{row.table}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MASTER DATABASE: POSTGRESQL */}
                  <div className="p-4 bg-teal-950/5 rounded-2xl border border-teal-800/10">
                    <div className="flex justify-between items-center border-b pb-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Server className="w-4 h-4 text-[#09352F]" />
                        <span className="text-xs font-extrabold text-[#09352F]">Master Cloud: PostgreSQL</span>
                      </div>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-black ${
                        isOnline ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isOnline ? 'ON-SHIELD' : 'DISCONNECTED'}
                      </span>
                    </div>

                    <div className="space-y-2 h-64 overflow-y-auto">
                      {pgCloudRows.map((row, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-gray-150 flex justify-between items-center text-[10.5px]">
                          <div>
                            <span className="font-mono text-gray-400 font-bold block text-[9px]">ID: {row.id}</span>
                            <span className="font-extrabold text-slate-800">{row.name}</span>
                          </div>
                          <span className="font-mono text-[9px] bg-indigo-50 px-1 py-0.5 rounded text-indigo-800 uppercase">{row.table}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT C: ARCHITECTURAL FLOWSHEETS */}
            {activeSubTab === 'instructions' && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Enterprise Sync Code & System Specs</span>
                </div>

                <div className="p-4 bg-slate-50 border border-gray-200 rounded-3xl space-y-3 font-sans text-xs">
                  <p className="font-bold text-[#09352F]">How the local SQLite queue replicates to PostgreSQL</p>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    1. <strong>Local Writes (SQLite File)</strong>: The offline desktop/app client writes all operations to an on-device SQLite database. Every local insert generates a tracking log hash.
                  </p>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    2. <strong>Transaction Journaling (Queue Buffer)</strong>: Concurrently, a journal entry is written into a <code>pending_sync</code> table containing the SQL statement and timestamp parameters.
                  </p>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    3. <strong>Connection Auto-Detection</strong>: A background heartbeat loop monitors online connectivity status. Once restored:
                  </p>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[10.5px] overflow-x-auto">
                    {`// Trigger sync outbox
async function syncLocalSQLiteWithPostgres() {
  const pending = await db.all("SELECT * FROM pending_sync ORDER BY timestamp ASC");
  
  if (pending.length === 0) return;
  
  // Begin central cloud transaction
  const pgClient = await pgPool.connect();
  try {
    await pgClient.query("BEGIN WORK");
    
    for (const action of pending) {
      // Stream raw SQLite query safely inside safe transaction parameters
      await pgClient.query(action.postgres_adapted_sql, action.payload_values);
    }
    
    await pgClient.query("COMMIT");
    
    // Clear local SQLite outbox once committed
    await db.run("DELETE FROM pending_sync");
  } catch (err) {
    await pgClient.query("ROLLBACK");
    throw err;
  } finally {
    pgClient.release();
  }
}`}
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-gray-50 text-[11px] text-gray-400 font-bold flex flex-wrap gap-x-6 gap-y-2">
            <span>● Micro-DB Version: SQlite 3.45.1</span>
            <span>● Cloud Engine: PostgreSQL v16.2 on RDS</span>
            <span>● Queue Sync Protocol: TCP TLS Core</span>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
