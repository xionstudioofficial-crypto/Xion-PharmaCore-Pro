import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const SubscriptionSettings: React.FC = () => {
    const { subscriptionSettings, updateSubscriptionSettings } = useSettings();

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Subscription & Plans</h2>
            <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                <p>Current Plan: <strong>{subscriptionSettings.currentPlan}</strong></p>
                <p>Trial days remaining: <strong>{subscriptionSettings.trialDaysRemaining}</strong></p>
                <p>Expiry Date: <strong>{subscriptionSettings.expiryDate}</strong></p>
            </div>
            <div className="flex gap-4">
                <button 
                    className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold"
                    onClick={() => alert('Redirecting to upgrade page...')}
                >
                    Upgrade
                </button>
                <button 
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-semibold"
                    onClick={() => alert('Processing renewal...')}
                >
                    Renew
                </button>
            </div>
            <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold mb-2">Payment History</h3>
                <p className="text-sm text-gray-500">No payment records found.</p>
            </div>
        </div>
    );
};
