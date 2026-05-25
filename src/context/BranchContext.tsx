import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BranchContextProps {
  branchId: string;
  setBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextProps | undefined>(undefined);

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branchId, setBranchId] = useState('main_branch');
  return (
    <BranchContext.Provider value={{ branchId, setBranchId }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranch must be used within BranchProvider');
  return context;
};
