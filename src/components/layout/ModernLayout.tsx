import React from 'react';
import { ModernSidebar } from './ModernSidebar';
import { NotificationCenter } from '@/components/ui/NotificationCenter';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">FlowIQ</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              {/* Add other header items here */}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}; 