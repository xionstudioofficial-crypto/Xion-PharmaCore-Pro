import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const PharmacyInfo: React.FC = () => {
    const { pharmacyInfo, updatePharmacyInfo } = useSettings();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" 
                    className="w-full rounded-xl border border-gray-200 p-3" 
                    placeholder="Pharmacy Address" 
                    value={pharmacyInfo.address}
                    onChange={(e) => updatePharmacyInfo({ address: e.target.value })}
                />
                <input 
                    type="text" 
                    className="w-full rounded-xl border border-gray-200 p-3" 
                    placeholder="Phone Number" 
                    value={pharmacyInfo.phone}
                    onChange={(e) => updatePharmacyInfo({ phone: e.target.value })}
                />
            </div>
            <input 
                type="email" 
                className="w-full rounded-xl border border-gray-200 p-3" 
                placeholder="Email" 
                value={pharmacyInfo.email}
                onChange={(e) => updatePharmacyInfo({ email: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" 
                    className="w-full rounded-xl border border-gray-200 p-3" 
                    placeholder="License Number" 
                    value={pharmacyInfo.licenseNumber}
                    onChange={(e) => updatePharmacyInfo({ licenseNumber: e.target.value })}
                />
                <input 
                    type="text" 
                    className="w-full rounded-xl border border-gray-200 p-3" 
                    placeholder="Tax Number" 
                    value={pharmacyInfo.taxNumber}
                    onChange={(e) => updatePharmacyInfo({ taxNumber: e.target.value })}
                />
            </div>
            <input 
                type="text" 
                className="w-full rounded-xl border border-gray-200 p-3" 
                placeholder="Owner Name" 
                value={pharmacyInfo.ownerName}
                onChange={(e) => updatePharmacyInfo({ ownerName: e.target.value })}
            />
             <button className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold" onClick={() => alert('Updated!')}>Save Info</button>
        </div>
    );
};
