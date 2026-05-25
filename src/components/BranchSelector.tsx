import React from 'react';
import { useBranch } from '@/src/context/BranchContext';
import { MapPin } from 'lucide-react';

const branches = [
  { id: 'main_branch', name: 'Main Branch' },
  { id: 'north_branch', name: 'North Branch' },
  { id: 'south_branch', name: 'South Branch' },
];

export const BranchSelector: React.FC = () => {
    const { branchId, setBranchId } = useBranch();
    return (
        <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
            {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
        </select>
    );
};
