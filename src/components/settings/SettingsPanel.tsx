import React from 'react';
import { GeneralSettings } from './GeneralSettings';
import { PharmacyInfo } from './PharmacyInfo';
import { UserManagement } from './UserManagement';
import { BillingSettings } from './BillingSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { PrinterSettings } from './PrinterSettings';
import { NotificationSettings } from './NotificationSettings';
import { BackupSettings } from './BackupSettings';
import { SecuritySettings } from './SecuritySettings';
import { ThemeSettings } from './ThemeSettings';

export const SettingsPanel: React.FC<{ category: string }> = ({ category }) => {
    switch (category) {
        case 'general': return <GeneralSettings />;
        case 'pharmacy': return <PharmacyInfo />;
        case 'user': return <UserManagement />;
        case 'billing': return <BillingSettings />;
        case 'subscription': return <SubscriptionSettings />;
        case 'printer': return <PrinterSettings />;
        case 'notification': return <NotificationSettings />;
        case 'backup': return <BackupSettings />;
        case 'security': return <SecuritySettings />;
        case 'theme': return <ThemeSettings />;
        default: return <div className="text-gray-500">Settings category: {category}</div>;
    }
};
