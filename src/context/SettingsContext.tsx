import React, { createContext, useContext, useState, useEffect } from 'react';
import { GeneralSettingsData, PharmacyInfoData, User, BillingSettingsData, PrinterSettingsData, NotificationSettingsData, SubscriptionSettingsData, BackupSettingsData, SecuritySettingsData, ThemeSettingsData, SettingsContextType } from '../types';

const defaultGeneralSettings: GeneralSettingsData = {
    pharmacyName: 'PharmaPlus',
    businessType: 'Retail Pharmacy',
    currency: 'USD',
    language: 'English',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
};

const defaultPharmacyInfo: PharmacyInfoData = {
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    taxNumber: '',
    ownerName: '',
};

const defaultBillingSettings: BillingSettingsData = {
    gstPercentage: 0,
    discountRules: '',
};

const defaultPrinterSettings: PrinterSettingsData = {
    thermalPrinterName: '',
    barcodePrinterName: '',
    receiptSize: '80mm',
    autoPrint: false,
};

const defaultNotificationSettings: NotificationSettingsData = {
    lowStockAlerts: true,
    expiryAlerts: true,
    pushNotifications: true,
    emailNotifications: false,
};

const defaultSubscriptionSettings: SubscriptionSettingsData = {
    currentPlan: 'Premium',
    trialDaysRemaining: 14,
    expiryDate: '2026-12-31',
};

const defaultBackupSettings: BackupSettingsData = {
    cloudSync: true,
    autoBackup: true,
    isOfflineMode: false,
};

const defaultSecuritySettings: SecuritySettingsData = {
    enable2FA: false,
    sessions: [{ id: '1', device: 'Chrome / Windows', lastActive: '2026-05-26 06:20:00' }],
    loginHistory: [{ id: '1', date: '2026-05-26 06:00:00', device: 'Chrome / Windows' }],
};

const defaultThemeSettings: ThemeSettingsData = {
    darkMode: false,
    primaryColor: 'emerald',
    layoutDensity: 'comfortable',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [generalSettings, setGeneralSettings] = useState<GeneralSettingsData>(() => {
        const saved = localStorage.getItem('generalSettings');
        return saved ? JSON.parse(saved) : defaultGeneralSettings;
    });

    const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyInfoData>(() => {
        const saved = localStorage.getItem('pharmacyInfo');
        return saved ? JSON.parse(saved) : defaultPharmacyInfo;
    });

    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('users');
        return saved ? JSON.parse(saved) : [];
    });

    const [billingSettings, setBillingSettings] = useState<BillingSettingsData>(() => {
        const saved = localStorage.getItem('billingSettings');
        return saved ? JSON.parse(saved) : defaultBillingSettings;
    });

    const [printerSettings, setPrinterSettings] = useState<PrinterSettingsData>(() => {
        const saved = localStorage.getItem('printerSettings');
        return saved ? JSON.parse(saved) : defaultPrinterSettings;
    });

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData>(() => {
        const saved = localStorage.getItem('notificationSettings');
        return saved ? JSON.parse(saved) : defaultNotificationSettings;
    });

    const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSettingsData>(() => {
        const saved = localStorage.getItem('subscriptionSettings');
        return saved ? JSON.parse(saved) : defaultSubscriptionSettings;
    });

    const [backupSettings, setBackupSettings] = useState<BackupSettingsData>(() => {
        const saved = localStorage.getItem('backupSettings');
        return saved ? JSON.parse(saved) : defaultBackupSettings;
    });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettingsData>(() => {
        const saved = localStorage.getItem('securitySettings');
        return saved ? JSON.parse(saved) : defaultSecuritySettings;
    });

    const [themeSettings, setThemeSettings] = useState<ThemeSettingsData>(() => {
        const saved = localStorage.getItem('themeSettings');
        return saved ? JSON.parse(saved) : defaultThemeSettings;
    });

    useEffect(() => {
        localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
    }, [generalSettings]);

    useEffect(() => {
        localStorage.setItem('pharmacyInfo', JSON.stringify(pharmacyInfo));
    }, [pharmacyInfo]);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('billingSettings', JSON.stringify(billingSettings));
    }, [billingSettings]);

    useEffect(() => {
        localStorage.setItem('printerSettings', JSON.stringify(printerSettings));
    }, [printerSettings]);

    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    }, [notificationSettings]);

    useEffect(() => {
        localStorage.setItem('subscriptionSettings', JSON.stringify(subscriptionSettings));
    }, [subscriptionSettings]);

    useEffect(() => {
        localStorage.setItem('backupSettings', JSON.stringify(backupSettings));
    }, [backupSettings]);

    useEffect(() => {
        localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    }, [securitySettings]);

    useEffect(() => {
        localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
    }, [themeSettings]);

    const updateGeneralSettings = (newSettings: Partial<GeneralSettingsData>) => {
        setGeneralSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updatePharmacyInfo = (newInfo: Partial<PharmacyInfoData>) => {
        setPharmacyInfo(prev => ({ ...prev, ...newInfo }));
    };

    const updateBillingSettings = (newSettings: Partial<BillingSettingsData>) => {
        setBillingSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updatePrinterSettings = (newSettings: Partial<PrinterSettingsData>) => {
        setPrinterSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateNotificationSettings = (newSettings: Partial<NotificationSettingsData>) => {
        setNotificationSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateSubscriptionSettings = (newSettings: Partial<SubscriptionSettingsData>) => {
        setSubscriptionSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateBackupSettings = (newSettings: Partial<BackupSettingsData>) => {
        setBackupSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateSecuritySettings = (newSettings: Partial<SecuritySettingsData>) => {
        setSecuritySettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateThemeSettings = (newSettings: Partial<ThemeSettingsData>) => {
        setThemeSettings(prev => ({ ...prev, ...newSettings }));
    };

    const addUser = (user: User) => setUsers(prev => [...prev, user]);
    const updateUser = (updatedUser: User) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    const deleteUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));

    return (
        <SettingsContext.Provider value={{
            generalSettings,
            updateGeneralSettings,
            pharmacyInfo,
            updatePharmacyInfo,
            users,
            addUser,
            updateUser,
            deleteUser,
            billingSettings,
            updateBillingSettings,
            printerSettings,
            updatePrinterSettings,
            notificationSettings,
            updateNotificationSettings,
            subscriptionSettings,
            updateSubscriptionSettings,
            backupSettings,
            updateBackupSettings,
            securitySettings,
            updateSecuritySettings,
            themeSettings,
            updateThemeSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
