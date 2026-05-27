import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const BackupSettings: React.FC = () => {
    const { backupSettings, updateBackupSettings } = useSettings();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Cloud Sync</label>
                <input type="checkbox" checked={backupSettings.cloudSync} onChange={(e) => updateBackupSettings({ cloudSync: e.target.checked })} />
            </div>
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                <input type="checkbox" checked={backupSettings.autoBackup} onChange={(e) => updateBackupSettings({ autoBackup: e.target.checked })} />
            </div>
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Offline Mode Status</label>
                <span className={`px-2 py-1 rounded text-xs ${backupSettings.isOfflineMode ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {backupSettings.isOfflineMode ? 'OFFLINE' : 'ONLINE'}
                </span>
            </div>
            <button className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold w-full" onClick={() => alert('Synced manually!')}>Manual Sync</button>
        </div>
    );
};
