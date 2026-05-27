export interface GeneralSettingsData {
    pharmacyName: string;
    businessType: 'Retail Pharmacy' | 'Wholesale';
    currency: string;
    language: string;
    timezone: string;
    dateFormat: string;
}

export interface PharmacyInfoData {
    address: string;
    phone: string;
    email: string;
    licenseNumber: string;
    taxNumber: string;
    ownerName: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Pharmacist' | 'Salesman' | 'Accountant' | 'Staff';
}

export interface BillingSettingsData {
    gstPercentage: number;
    discountRules: string;
}

export interface PrinterSettingsData {
    thermalPrinterName: string;
    barcodePrinterName: string;
    receiptSize: '58mm' | '80mm';
    autoPrint: boolean;
}

export interface NotificationSettingsData {
    lowStockAlerts: boolean;
    expiryAlerts: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
}

export interface SubscriptionSettingsData {
    currentPlan: 'Basic' | 'Premium' | 'Enterprise';
    trialDaysRemaining: number;
    expiryDate: string;
}

export interface BackupSettingsData {
    cloudSync: boolean;
    autoBackup: boolean;
    isOfflineMode: boolean;
}

export interface SecuritySettingsData {
    enable2FA: boolean;
    sessions: { id: string, device: string, lastActive: string }[];
    loginHistory: { id: string, date: string, device: string }[];
}

export interface ThemeSettingsData {
    darkMode: boolean;
    primaryColor: 'emerald' | 'blue' | 'purple';
    layoutDensity: 'compact' | 'comfortable';
}

export interface SettingsContextType {
    generalSettings: GeneralSettingsData;
    updateGeneralSettings: (settings: Partial<GeneralSettingsData>) => void;
    pharmacyInfo: PharmacyInfoData;
    updatePharmacyInfo: (info: Partial<PharmacyInfoData>) => void;
    users: User[];
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: string) => void;
    billingSettings: BillingSettingsData;
    updateBillingSettings: (settings: Partial<BillingSettingsData>) => void;
    printerSettings: PrinterSettingsData;
    updatePrinterSettings: (settings: Partial<PrinterSettingsData>) => void;
    notificationSettings: NotificationSettingsData;
    updateNotificationSettings: (settings: Partial<NotificationSettingsData>) => void;
    subscriptionSettings: SubscriptionSettingsData;
    updateSubscriptionSettings: (settings: Partial<SubscriptionSettingsData>) => void;
    backupSettings: BackupSettingsData;
    updateBackupSettings: (settings: Partial<BackupSettingsData>) => void;
    securitySettings: SecuritySettingsData;
    updateSecuritySettings: (settings: Partial<SecuritySettingsData>) => void;
    themeSettings: ThemeSettingsData;
    updateThemeSettings: (settings: Partial<ThemeSettingsData>) => void;
}
