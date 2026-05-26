import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the role structure
export type UserRole = 'SaaS Super Admin' | 'Owner/Admin' | 'Pharmacist' | 'Salesman/Cashier' | 'Accountant' | 'Staff';

// Permissions matrix tags
export interface RolePermissions {
  viewInventory: boolean;
  editInventory: boolean;
  posCheckout: boolean;
  viewFinanceReports: boolean;
  manageStaff: boolean;
  manageSubscription: boolean;
  dbSyncAdmin: boolean;
}

// Default permissions assigned to each role (can be customized by owner/admin)
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'SaaS Super Admin': {
    viewInventory: true,
    editInventory: true,
    posCheckout: true,
    viewFinanceReports: true,
    manageStaff: true,
    manageSubscription: true,
    dbSyncAdmin: true,
  },
  'Owner/Admin': {
    viewInventory: true,
    editInventory: true,
    posCheckout: true,
    viewFinanceReports: true,
    manageStaff: true,
    manageSubscription: true,
    dbSyncAdmin: true,
  },
  'Pharmacist': {
    viewInventory: true,
    editInventory: true,
    posCheckout: true,
    viewFinanceReports: false,
    manageStaff: false,
    manageSubscription: false,
    dbSyncAdmin: false,
  },
  'Salesman/Cashier': {
    viewInventory: true,
    editInventory: false,
    posCheckout: true,
    viewFinanceReports: false,
    manageStaff: false,
    manageSubscription: false,
    dbSyncAdmin: false,
  },
  'Accountant': {
    viewInventory: true,
    editInventory: false,
    posCheckout: false,
    viewFinanceReports: true,
    manageStaff: false,
    manageSubscription: true,
    dbSyncAdmin: false,
  },
  'Staff': {
    viewInventory: true,
    editInventory: false,
    posCheckout: false,
    viewFinanceReports: false,
    manageStaff: false,
    manageSubscription: false,
    dbSyncAdmin: false,
  }
};

export interface PharmacyTenant {
  id: string;
  name: string;
  plan: string; // e.g. 'Starter Plan', 'Professional Plan', 'Enterprise Plan', etc.
  expiryDate: string; // ISO date string e.g., '2026-05-30'
  isExpired: boolean;
  domain: string;
}

export interface SaaSAnnouncement {
  id: string;
  title: string;
  message: string;
  date: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SaaSTransaction {
  id: string;
  tenantName: string;
  date: string;
  amount: number;
  plan: string;
  paymentMethod: 'PayPal' | 'JazzCash' | 'Easypaisa' | 'Pakistani Bank Transfer';
  status: 'Completed' | 'Refunded' | 'Pending';
}

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
  client: PharmacyTenant;
  jwtToken: string;
}

interface AuthContextType {
  user: UserSession | null;
  tenants: PharmacyTenant[];
  currentRolePermissions: RolePermissions;
  customPermissions: Record<UserRole, RolePermissions>;
  updateRolePermissions: (role: UserRole, permissions: Partial<RolePermissions>) => void;
  signIn: (email: string, role: UserRole, tenantId: string, customName?: string) => void;
  signInWithGoogle: (tenantId: string) => void;
  signOut: () => void;
  activeClient: PharmacyTenant | null;
  switchClient: (tenantId: string) => void;
  trialDaysRemaining: number;
  
  // SaaS Master Owner Features
  addTenant: (tenant: Omit<PharmacyTenant, 'id'>) => void;
  updateTenant: (id: string, tenant: Partial<PharmacyTenant>) => void;
  deleteTenant: (id: string) => void;
  announcements: SaaSAnnouncement[];
  addAnnouncement: (title: string, message: string, severity: 'info' | 'warning' | 'critical') => void;
  deleteAnnouncement: (id: string) => void;
  transactions: SaaSTransaction[];
  addTransaction: (tx: Omit<SaaSTransaction, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// System static defaults
const DEFAULT_PHARMACIES: PharmacyTenant[] = [
  {
    id: "tenant-apex",
    name: "Apex Global Pharmacy Central",
    plan: "Professional Plan",
    expiryDate: "2027-12-31",
    isExpired: false,
    domain: "apex.pharmacloud.co"
  },
  {
    id: "tenant-carefirst",
    name: "CareFirst Dispensary & Wellness",
    plan: "Starter Plan (Trial)",
    expiryDate: "2026-06-15", // active
    isExpired: false,
    domain: "carefirst.pharmacloud.co"
  },
  {
    id: "tenant-greencross",
    name: "GreenCross Medicare Inc (Expired Demo)",
    plan: "Starter Plan (Trial)",
    expiryDate: "2026-05-01", // expired compared to system time (May 26, 2026)
    isExpired: true,
    domain: "greencross.pharmacloud.co"
  }
];

const DEFAULT_ANNOUNCEMENTS: SaaSAnnouncement[] = [
  {
    id: "ann-1",
    title: "Postgres Storage Upgrades Planned",
    message: "A SaaS-wide backend performance tune-up is scheduled for UTC 04:00. Local SQLite failover caches will automatically handle any brief database replication delays.",
    date: "2026-05-25",
    severity: "info"
  },
  {
    id: "ann-2",
    title: "SaaS Subscription Payment Gateway Support",
    message: "We have fully added online integration endpoints for EasyPaisa, JazzCash, PayPal, and all major Pakistani Bank accounts for local micro-billing.",
    date: "2026-05-26",
    severity: "info"
  }
];

const DEFAULT_TRANSACTIONS: SaaSTransaction[] = [
  {
    id: "tx-101",
    tenantName: "Apex Global Pharmacy Central",
    date: "2026-05-24",
    amount: 149,
    plan: "Professional Plan",
    paymentMethod: "PayPal",
    status: "Completed"
  },
  {
    id: "tx-102",
    tenantName: "CareFirst Dispensary & Wellness",
    date: "2026-05-25",
    amount: 49,
    plan: "Starter Plan",
    paymentMethod: "JazzCash",
    status: "Completed"
  },
  {
    id: "tx-103",
    tenantName: "GreenCross Medicare Inc",
    date: "2026-05-10",
    amount: 199,
    plan: "Enterprise Plan",
    paymentMethod: "Easypaisa",
    status: "Pending"
  },
  {
    id: "tx-104",
    tenantName: "Khyber Medicare Branch",
    date: "2026-05-26",
    amount: 149,
    plan: "Professional Plan",
    paymentMethod: "Pakistani Bank Transfer",
    status: "Completed"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<PharmacyTenant[]>(() => {
    const saved = localStorage.getItem('pharma_saas_tenants');
    return saved ? JSON.parse(saved) : DEFAULT_PHARMACIES;
  });

  const [announcements, setAnnouncements] = useState<SaaSAnnouncement[]>(() => {
    const saved = localStorage.getItem('pharma_saas_announcements');
    return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
  });

  const [transactions, setTransactions] = useState<SaaSTransaction[]>(() => {
    const saved = localStorage.getItem('pharma_saas_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  // Custom permissions that Owner/Admin can toggle in-app
  const [customPermissions, setCustomPermissions] = useState<Record<UserRole, RolePermissions>>(() => {
    const saved = localStorage.getItem('pharma_custom_permissions');
    return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
  });

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('pharma_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('pharma_saas_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('pharma_saas_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('pharma_saas_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pharma_custom_permissions', JSON.stringify(customPermissions));
  }, [customPermissions]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pharma_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('pharma_user_session');
    }
  }, [user]);

  // SaaS tenant and announcement CRUD functions
  const addTenant = (t: Omit<PharmacyTenant, 'id'>) => {
    const id = "tenant-" + Math.random().toString(36).substring(2, 9);
    setTenants(prev => [...prev, { ...t, id }]);
  };

  const updateTenant = (id: string, updated: Partial<PharmacyTenant>) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    // Dynamic sync of user's current branch settings if they belong to it
    if (user && user.client.id === id) {
      setUser(prev => prev ? { ...prev, client: { ...prev.client, ...updated } } : null);
    }
  };

  const deleteTenant = (id: string) => {
    setTenants(prev => prev.filter(t => t.id !== id));
  };

  const addAnnouncement = (title: string, message: string, severity: 'info' | 'warning' | 'critical') => {
    const newAnn: SaaSAnnouncement = {
      id: "ann-" + Math.random().toString(36).substring(2, 9),
      title,
      message,
      date: new Date().toISOString().split('T')[0],
      severity
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addTransaction = (tx: Omit<SaaSTransaction, 'id'>) => {
    const id = "tx-" + Math.floor(100 + Math.random() * 900);
    setTransactions(prev => [{ ...tx, id }, ...prev]);
  };

  const updateRolePermissions = (role: UserRole, permissions: Partial<RolePermissions>) => {
    setCustomPermissions(prev => {
      const updated = {
        ...prev,
        [role]: { ...prev[role], ...permissions }
      };
      return updated;
    });
  };

  // Switch between multiple clients / branches
  const switchClient = (tenantId: string) => {
    const selected = tenants.find(t => t.id === tenantId);
    if (selected && user) {
      const updatedUser = {
        ...user,
        client: selected
      };
      setUser(updatedUser);
    }
  };

  // JWT Payload builder simulation (Sign security)
  const generateJWTMacToken = (email: string, role: string, tenantId: string) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      sub: email,
      role: role,
      tenant: tenantId,
      iss: "pharmascript-saas",
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }));
    const mockHashSignature = "sha256_crypt_sig_" + Math.random().toString(36).substr(2, 8);
    return `${header}.${payload}.${mockHashSignature}`;
  };

  const signIn = (email: string, role: UserRole, tenantId: string, customName?: string) => {
    const selectedTenant = tenants.find(t => t.id === tenantId) || tenants[0];
    const token = generateJWTMacToken(email, role, selectedTenant.id);
    
    setUser({
      name: customName || email.split('@')[0].toUpperCase(),
      email,
      role,
      client: selectedTenant,
      jwtToken: token
    });
  };

  const signInWithGoogle = (tenantId: string) => {
    const email = "google.owner@gmail.com";
    const selectedTenant = tenants.find(t => t.id === tenantId) || tenants[0];
    const token = generateJWTMacToken(email, "Owner/Admin", selectedTenant.id);

    setUser({
      name: "Google Workspace Operator",
      email,
      role: "Owner/Admin",
      client: selectedTenant,
      jwtToken: token
    });
  };

  const signOut = () => {
    setUser(null);
  };

  const activeClient = user ? user.client : null;

  // Calcul Trial Days Remaining
  const trialDaysRemaining = activeClient
    ? Math.max(0, Math.ceil((new Date(activeClient.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Compute current permissions of active role (With bypass for SaaS Super Admin)
  const currentRolePermissions = user 
    ? (user.role === 'SaaS Super Admin' 
        ? {
            viewInventory: true,
            editInventory: true,
            posCheckout: true,
            viewFinanceReports: true,
            manageStaff: true,
            manageSubscription: true,
            dbSyncAdmin: true,
          }
        : (customPermissions[user.role] || DEFAULT_ROLE_PERMISSIONS['Staff']))
    : DEFAULT_ROLE_PERMISSIONS['Staff'];

  return (
    <AuthContext.Provider value={{
      user,
      tenants,
      currentRolePermissions,
      customPermissions,
      updateRolePermissions,
      signIn,
      signInWithGoogle,
      signOut,
      activeClient,
      switchClient,
      trialDaysRemaining,
      
      addTenant,
      updateTenant,
      deleteTenant,
      announcements,
      addAnnouncement,
      deleteAnnouncement,
      transactions,
      addTransaction
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
