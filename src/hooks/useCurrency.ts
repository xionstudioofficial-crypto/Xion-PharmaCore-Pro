import { useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';

const currencies: Record<string, string> = {
    'USD': '$',
    'PKR': 'Rs ',
    'EUR': '€',
    'GBP': '£'
};

export const useCurrency = () => {
    const { generalSettings } = useSettings();
    const currencyCode = generalSettings?.currency || 'USD';
    const symbol = currencies[currencyCode] || '$';

    const formatCurrency = useCallback((amount: number | string) => {
        let numericAmount = 0;
        if (typeof amount === 'string') {
            numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
        } else {
            numericAmount = amount;
        }
        
        return `${symbol}${numericAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [symbol]);

    return {
        symbol,
        formatCurrency,
        currencyCode
    };
};
