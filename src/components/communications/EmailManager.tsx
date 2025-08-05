import React from 'react';
import { Mail } from 'lucide-react';

export const EmailManager: React.FC = () => {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Email Manager</h3>
            </div>
            <p className="text-gray-600">Email management interface coming soon...</p>
        </div>
    );
}; 