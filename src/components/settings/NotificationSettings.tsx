import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const NotificationSettings: React.FC = () => {
    const { notificationSettings, updateNotificationSettings } = useSettings();

    const toggle = (key: keyof typeof notificationSettings) => {
        updateNotificationSettings({ [key]: !notificationSettings[key] });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {[
                    { key: 'lowStockAlerts', label: 'Low Stock Alerts' },
                    { key: 'expiryAlerts', label: 'Expiry Alerts' },
                    { key: 'pushNotifications', label: 'Push Notifications' },
                    { key: 'emailNotifications', label: 'Email Notifications' }
                ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">{label}</label>
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-700"
                            checked={notificationSettings[key as keyof typeof notificationSettings]}
                            onChange={() => toggle(key as keyof typeof notificationSettings)}
                        />
                    </div>
                ))}
            </div>
             <button className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold" onClick={() => alert('Updated!')}>Save Settings</button>
        </div>
    );
};
