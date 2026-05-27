import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const PrinterSettings: React.FC = () => {
    const { printerSettings, updatePrinterSettings } = useSettings();

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Thermal Printer Name</label>
                <input 
                    type="text" 
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-3" 
                    value={printerSettings.thermalPrinterName}
                    onChange={(e) => updatePrinterSettings({ thermalPrinterName: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Barcode Printer Name</label>
                <input 
                    type="text" 
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-3" 
                    value={printerSettings.barcodePrinterName}
                    onChange={(e) => updatePrinterSettings({ barcodePrinterName: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Receipt Size</label>
                <select 
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-3"
                    value={printerSettings.receiptSize}
                    onChange={(e) => updatePrinterSettings({ receiptSize: e.target.value as '58mm' | '80mm' })}
                >
                    <option value="58mm">58mm</option>
                    <option value="80mm">80mm</option>
                </select>
            </div>
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Auto Print Receipt</label>
                <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-700" 
                    checked={printerSettings.autoPrint}
                    onChange={(e) => updatePrinterSettings({ autoPrint: e.target.checked })}
                />
            </div>
             <button className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold" onClick={() => alert('Updated!')}>Save Settings</button>
        </div>
    );
};
