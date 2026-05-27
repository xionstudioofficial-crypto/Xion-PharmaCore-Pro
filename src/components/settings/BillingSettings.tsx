import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const BillingSettings: React.FC = () => {
    const { billingSettings, updateBillingSettings } = useSettings();

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">GST/VAT Percentage (%)</label>
                <input 
                    type="number" 
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-3" 
                    value={billingSettings.gstPercentage}
                    onChange={(e) => updateBillingSettings({ gstPercentage: Number(e.target.value) })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Discount Rules</label>
                <textarea 
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-3" 
                    value={billingSettings.discountRules}
                    onChange={(e) => updateBillingSettings({ discountRules: e.target.value })}
                    rows={4}
                />
            </div>
             <button className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold" onClick={() => alert('Updated!')}>Save Settings</button>
        </div>
    );
};
