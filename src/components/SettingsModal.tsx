import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, User, Building, CreditCard, Printer, Bell, Shield, Database, LayoutGrid, Palette, Info, ChevronRight } from 'lucide-react';
import { SettingsPanel } from './settings/SettingsPanel';

const SETTINGS_CATEGORIES = [
    { id: 'general', name: 'General Settings', icon: Settings },
    { id: 'pharmacy', name: 'Pharmacy Information', icon: Building },
    { id: 'user', name: 'User & Role Management', icon: User },
    { id: 'billing', name: 'Billing & Tax', icon: CreditCard },
    { id: 'printer', name: 'Printer Settings', icon: Printer },
    { id: 'notifications', name: 'Notification Settings', icon: Bell },
    { id: 'subscription', name: 'Subscription & Plans', icon: LayoutGrid },
    { id: 'backup', name: 'Backup & Sync', icon: Database },
    { id: 'security', name: 'Security Settings', icon: Shield },
    { id: 'theme', name: 'Theme & Appearance', icon: Palette },
    { id: 'about', name: 'About System', icon: Info },
];

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [activeCategory, setActiveCategory] = useState(SETTINGS_CATEGORIES[0].id);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-5xl h-[80vh] flex shadow-2xl overflow-hidden">
                        
                        {/* Sidebar */}
                        <div className="w-64 bg-gray-50 border-r border-gray-100 p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition"><X className="w-5 h-5"/></button>
                            </div>
                            <nav className="space-y-1 overflow-y-auto">
                                {SETTINGS_CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button 
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeCategory === cat.id ? 'bg-emerald-50 text-emerald-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-4 h-4" />
                                                {cat.name}
                                            </div>
                                            <ChevronRight className={`w-4 h-4 ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0'}`} />
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-10 bg-white">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">
                                {SETTINGS_CATEGORIES.find(c => c.id === activeCategory)?.name}
                            </h3>
                            <SettingsPanel category={activeCategory} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
