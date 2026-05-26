import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SyncQueueItem {
  id: string;
  timestamp: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SYNC_STATUS';
  table: string;
  payload: any;
  sqliteQuery: string;
}

export interface SyncLogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'sqlite' | 'postgres';
  message: string;
}

interface SyncContextType {
  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  toggleOnline: () => void;
  syncQueue: SyncQueueItem[];
  addToSyncQueue: (action: 'INSERT' | 'UPDATE' | 'DELETE', table: string, payload: any, sqliteQuery?: string) => void;
  removeQueueItem: (id: string) => void;
  clearSyncQueue: () => void;
  triggerPostgresSync: () => Promise<void>;
  syncLogs: SyncLogEntry[];
  addSyncLog: (type: SyncLogEntry['type'], message: string) => void;
  clearSyncLogs: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    const saved = localStorage.getItem('pharma_online_state');
    return saved !== null ? saved === 'true' : navigator.onLine;
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    const saved = localStorage.getItem('pharma_sync_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>(() => {
    const saved = localStorage.getItem('pharma_db_sync_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'System loaded. SQLite Local Engine (offline mode default ready) initialized.'
      },
      {
        timestamp: new Date().toISOString(),
        type: 'postgres',
        message: 'Established keep-alive handshakes with AWS PostgreSQL Master database cluster.'
      }
    ];
  });

  // Save sync status changes to localStorage
  useEffect(() => {
    localStorage.setItem('pharma_online_state', String(isOnline));
  }, [isOnline]);

  useEffect(() => {
    localStorage.setItem('pharma_sync_queue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  useEffect(() => {
    localStorage.setItem('pharma_db_sync_logs', JSON.stringify(syncLogs));
  }, [syncLogs]);

  // Handle native window network events (only if standard bypass isn't manual)
  useEffect(() => {
    const handleOnline = () => {
      // Auto-sync when standard internet returns
      setOnline(true);
      addSyncLog('info', 'Windows OS triggered online event. Internet connection active.');
    };
    const handleOffline = () => {
      setOnline(false);
      addSyncLog('warn', 'Windows OS triggered offline event. Entering localized SQLite safety mode.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setOnline = (online: boolean) => {
    setIsOnline(online);
    addSyncLog(online ? 'success' : 'warn', `ERP Network mode manually toggled to: ${online ? 'ONLINE (PostgreSQL)' : 'OFFLINE (SQLite Only)'}`);
    
    // Auto-sync trigger
    if (online && syncQueue.length > 0) {
      addSyncLog('info', 'Autosync triggered: Found pending offline transactions in SQlite queue.');
      // Auto trigger sync after briefly allowing state commit
      setTimeout(() => {
        triggerPostgresSync();
      }, 800);
    }
  };

  const toggleOnline = () => {
    setOnline(!isOnline);
  };

  const addSyncLog = (type: SyncLogEntry['type'], message: string) => {
    const newEntry: SyncLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message
    };
    setSyncLogs(prev => [newEntry, ...prev].slice(0, 100)); // limit logs to last 100 entries
  };

  const clearSyncLogs = () => {
    setSyncLogs([
      {
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Database sync journal logs reset.'
      }
    ]);
  };

  // Build simulated query representation
  const generateSqlStatement = (action: string, table: string, payload: any): string => {
    const safeTable = table.toLowerCase();
    const id = payload.id || 'N/A';
    
    if (action === 'INSERT') {
      const keys = Object.keys(payload).join(', ');
      const values = Object.values(payload).map(val => {
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === 'number') return val;
        if (val === null || val === undefined) return 'NULL';
        return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
      }).join(', ');
      return `INSERT INTO sqlite_${safeTable} (${keys}) VALUES (${values});`;
    }
    
    if (action === 'UPDATE') {
      const sets = Object.entries(payload)
        .filter(([key]) => key !== 'id')
        .map(([key, val]) => {
          const formattedVal = typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : typeof val === 'number' ? val : `'${JSON.stringify(val)}'`;
          return `${key} = ${formattedVal}`;
        }).join(', ');
      return `UPDATE sqlite_${safeTable} SET ${sets} WHERE id = '${id}';`;
    }

    if (action === 'DELETE') {
      return `DELETE FROM sqlite_${safeTable} WHERE id = '${id}';`;
    }

    return `-- Simulated operation on ${safeTable}`;
  };

  const addToSyncQueue = (action: 'INSERT' | 'UPDATE' | 'DELETE', table: string, payload: any, customSql?: string) => {
    const id = `Q-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const sql = customSql || generateSqlStatement(action, table, payload);
    
    // Log write to local SQLite statement
    addSyncLog('sqlite', `[SQLite Write Local SUCCESS] Executed SQL on SQLite file-DB: ${sql}`);

    const newQueueItem: SyncQueueItem = {
      id,
      timestamp: new Date().toISOString(),
      action,
      table,
      payload,
      sqliteQuery: sql
    };

    setSyncQueue(prev => [...prev, newQueueItem]);
    
    if (!isOnline) {
      addSyncLog('warn', `Offline active: Operation queued locally. SQLite transaction pending #${id}.`);
    } else {
      // If we are online, automatically simulate syncing it immediately!
      addSyncLog('info', `Online active: Streaming instant local SQLite change to PostgreSQL master...`);
      setTimeout(() => {
        setSyncQueue(prev => prev.filter(item => item.id !== id));
        addSyncLog('postgres', `[PostgreSQL Live Write OK] Executed sync transaction to PostgreSQL: ${sql}`);
      }, 500);
    }
  };

  const removeQueueItem = (id: string) => {
    setSyncQueue(prev => prev.filter(item => item.id !== id));
    addSyncLog('info', `Removed transaction item #${id} from sync queue stack.`);
  };

  const clearSyncQueue = () => {
    setSyncQueue([]);
    addSyncLog('warn', `Local offline SQLite outbox cleared successfully. Outstanding edits lost.`);
  };

  const triggerPostgresSync = async () => {
    if (syncQueue.length === 0) {
      addSyncLog('info', 'PostgreSQL Sync: SQLite queue is already empty. No transactions pending.');
      return;
    }

    setIsSyncing(true);
    addSyncLog('info', `PostgreSQL Sync: Initiating background transactions push (${syncQueue.length} records in pipeline).`);

    // Stepping process simulations
    await new Promise(r => setTimeout(r, 600));
    addSyncLog('postgres', `[Postgres Handshake] Handshake verified with cloud DB: postgresql://admin:******@aws-rds-cloud.com:5432/pharmadb`);
    
    await new Promise(r => setTimeout(r, 500));
    addSyncLog('postgres', `[TRANSACTION START] sqlite3_file_descriptor locked; START PostgreSQL global master pipeline.`);

    // Loop and sync each
    for (const item of syncQueue) {
      await new Promise(r => setTimeout(r, 450));
      addSyncLog('postgres', `[SYNCING #${item.id}] Processing client edit for table '${item.table}' (${item.action}). Executing: ${item.sqliteQuery}`);
      addSyncLog('success', `[PG CONCURRENCY MET] Applied sync patch #${item.id} to PostgreSQL master tables!`);
    }

    await new Promise(r => setTimeout(r, 600));
    addSyncLog('success', `[COMMIT COMPLETE] Transaction committed. Sync completed! Cleared ${syncQueue.length} items from offline SQLite queue.`);
    
    setSyncQueue([]);
    setIsSyncing(false);
  };

  return (
    <SyncContext.Provider 
      value={{ 
        isSyncing, 
        setIsSyncing, 
        isOnline, 
        setOnline, 
        toggleOnline,
        syncQueue, 
        addToSyncQueue, 
        removeQueueItem, 
        clearSyncQueue, 
        triggerPostgresSync,
        syncLogs,
        addSyncLog,
        clearSyncLogs
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
