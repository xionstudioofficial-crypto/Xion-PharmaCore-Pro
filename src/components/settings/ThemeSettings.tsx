import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const ThemeSettings: React.FC = () => {
    const { themeSettings, updateThemeSettings } = useSettings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                <input type="checkbox" checked={themeSettings.darkMode} onChange={(e) => updateThemeSettings({ darkMode: e.target.checked })} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <select className="mt-1 block w-full rounded-xl border border-gray-200 p-3" value={themeSettings.primaryColor} onChange={(e) => updateThemeSettings({ primaryColor: e.target.value as any })}>
                    <option value="emerald">Emerald</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Layout Density</label>
                <select className="mt-1 block w-full rounded-xl border border-gray-200 p-3" value={themeSettings.layoutDensity} onChange={(e) => updateThemeSettings({ layoutDensity: e.target.value as any })}>
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                </select>
            </div>
        </div>
    );
};
