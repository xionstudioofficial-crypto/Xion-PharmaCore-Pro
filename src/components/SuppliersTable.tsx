import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierLedgerModal } from './SupplierLedgerModal';

const suppliers = [
    { id: 1, name: 'PharmaCorp Inc.', balance: 1200 },
    { id: 2, name: 'MediSupply Ltd.', balance: -500 },
];

const mockHistory = [
    { date: '2024-05-01', description: 'Payment Received', debit: 0, credit: 500 },
    { date: '2024-05-15', description: 'Medicines Purchased', debit: 200, credit: 0 },
];

export const SuppliersTable: React.FC = () => {
    const [suppliersList, setSuppliersList] = useState([
        { id: 1, name: 'PharmaCorp Inc.', balance: 1200 },
        { id: 2, name: 'MediSupply Ltd.', balance: -500 },
    ]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<typeof suppliersList[0] | null>(null);
    const [filter, setFilter] = useState('');

    const filteredSuppliers = suppliersList.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

    const toggleAll = () => {
        if (selectedIds.length === filteredSuppliers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSuppliers.map(s => s.id));
        }
    };

    const toggleRow = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const deleteSelected = () => {
        setSuppliersList(suppliersList.filter(s => !selectedIds.includes(s.id)));
        setSelectedIds([]);
    };

    return (
        <Card className="rounded-2xl shadow-sm border-none bg-white">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        Suppliers
                        {selectedIds.length > 0 && (
                            <button 
                                onClick={deleteSelected}
                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200"
                            >
                                Delete {selectedIds.length}
                            </button>
                        )}
                    </div>
                    <input type="text" placeholder="Search..." onChange={e => setFilter(e.target.value)} className="text-xs font-normal border p-1 rounded-lg w-32" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-gray-500">
                            <th className="p-3">
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.length > 0 && selectedIds.length === filteredSuppliers.length}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th className="p-3">Supplier Name</th>
                            <th className="p-3">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map(s => (
                            <tr key={s.id} className="border-b hover:bg-gray-50 cursor-pointer">
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5"
                                        checked={selectedIds.includes(s.id)}
                                        onChange={() => toggleRow(s.id)}
                                    />
                                </td>
                                <td className="p-4 font-semibold text-emerald-800" onClick={() => setSelectedSupplier(s)}>{s.name}</td>
                                <td className="p-4" onClick={() => setSelectedSupplier(s)}>${s.balance.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <SupplierLedgerModal 
                    isOpen={!!selectedSupplier} 
                    onClose={() => setSelectedSupplier(null)} 
                    supplierName={selectedSupplier?.name || ''}
                    history={mockHistory}
                />
            </CardContent>
        </Card>
    );
};
