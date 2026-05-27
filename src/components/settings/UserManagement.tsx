import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { User } from '../../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export const UserManagement: React.FC = () => {
    const { users, addUser, updateUser, deleteUser } = useSettings();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<User['role']>('Staff');

    const handleAddUser = () => {
        if (!name || !email) return;
        addUser({ id: Date.now().toString(), name, email, role });
        setName(''); setEmail('');
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <input type="text" placeholder="Name" className="flex-1 rounded-xl border border-gray-200 p-3" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" className="flex-1 rounded-xl border border-gray-200 p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                <select className="rounded-xl border border-gray-200 p-3" value={role} onChange={(e) => setRole(e.target.value as User['role'])}>
                    {['Admin', 'Pharmacist', 'Salesman', 'Accountant', 'Staff'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button onClick={handleAddUser} className="bg-emerald-700 text-white rounded-xl px-4"><Plus /></button>
            </div>
            <div className="space-y-2">
                {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email} - {user.role}</p>
                        </div>
                        <button onClick={() => deleteUser(user.id)} className="text-red-500"><Trash2 /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
