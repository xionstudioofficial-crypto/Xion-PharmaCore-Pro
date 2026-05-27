import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const GeneralSettings: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useSettings();

    const handleSave = () => {
        // Since it's automatically saved in context due to the hook, 
        // we might just want to show a toast/notification, but for now 
        // let's just log it or alert.
        alert('Settings saved!');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
                    <input 
                        type="text" 
                        className="mt-1 block w-full rounded-xl border border-gray-200 p-3" 
                        value={generalSettings.pharmacyName}
                        onChange={(e) => updateGeneralSettings({ pharmacyName: e.target.value })}
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700">Business Type</label>
                    <select 
                        className="mt-1 block w-full rounded-xl border border-gray-200 p-3"
                        value={generalSettings.businessType}
                        onChange={(e) => updateGeneralSettings({ businessType: e.target.value as 'Retail Pharmacy' | 'Wholesale' })}
                    >
                        <option value="Retail Pharmacy">Retail Pharmacy</option>
                        <option value="Wholesale">Wholesale</option>
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select 
                        className="mt-1 block w-full rounded-xl border border-gray-200 p-3"
                        value={generalSettings.currency}
                        onChange={(e) => updateGeneralSettings({ currency: e.target.value })}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="PKR">Pakistani Rupee (Rs)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select 
                        className="mt-1 block w-full rounded-xl border border-gray-200 p-3"
                        value={generalSettings.language}
                        onChange={(e) => updateGeneralSettings({ language: e.target.value })}
                    >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                    </select>
                </div>
            </div>
            <button 
                onClick={handleSave}
                className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold"
            >
                Save Settings
            </button>
        </div>
    );
};
