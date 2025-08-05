import React from 'react';
import { MessageSquare } from 'lucide-react';

export const SMSManager: React.FC = () => {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">SMS Manager</h3>
            </div>
            <p className="text-gray-600">SMS management interface coming soon...</p>
        </div>
    );
}; 