import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Log {
  action: string;
  user: string;
  time: string;
}

interface ActivityLogContextProps {
  logs: Log[];
  addLog: (action: string, user: string) => void;
}

const ActivityLogContext = createContext<ActivityLogContextProps | undefined>(undefined);

export const ActivityLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<Log[]>([
    { action: 'Medicine Added', user: 'Admin', time: '5m ago' },
    { action: 'Sale Completed', user: 'Staff_A', time: '12m ago' },
    { action: 'Inventory Updated', user: 'Admin', time: '1h ago' },
  ]);

  const addLog = (action: string, user: string) => {
    setLogs(prev => [{ action, user, time: 'Just now' }, ...prev]);
  };

  return (
    <ActivityLogContext.Provider value={{ logs, addLog }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLogs = () => {
  const context = useContext(ActivityLogContext);
  if (!context) throw new Error('useActivityLogs must be used within ActivityLogProvider');
  return context;
};
