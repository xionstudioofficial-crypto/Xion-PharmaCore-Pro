import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from 'lucide-react';
import { useActivityLogs } from '@/src/context/ActivityLogContext';

export const ActivityLogs: React.FC = () => {
    const { logs } = useActivityLogs();

    return (
        <Card className="rounded-2xl shadow-sm border-none bg-white col-span-12">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-700"/> Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {logs.map((log, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b text-sm">
                        <span><span className="font-semibold text-emerald-800">{log.action}</span> by {log.user}</span>
                        <span className="text-gray-400">{log.time}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
