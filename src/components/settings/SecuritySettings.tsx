import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const SecuritySettings: React.FC = () => {
    const { securitySettings, updateSecuritySettings } = useSettings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Enable 2FA</label>
                <input type="checkbox" checked={securitySettings.enable2FA} onChange={(e) => updateSecuritySettings({ enable2FA: e.target.checked })} />
            </div>
            <button className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold w-full">Change Password</button>
            
            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Active Sessions</h3>
                {securitySettings.sessions.map(s => (
                    <div key={s.id} className="text-sm border-b py-2 flex justify-between">
                        <span>{s.device}</span>
                        <span className="text-gray-500">{s.lastActive}</span>
                    </div>
                ))}
            </div>
            
            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Login History</h3>
                {securitySettings.loginHistory.map(h => (
                    <div key={h.id} className="text-sm border-b py-2 flex justify-between">
                        <span>{h.device}</span>
                        <span className="text-gray-500">{h.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
