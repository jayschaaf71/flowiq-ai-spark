import React from 'react';
import { ModernSidebar } from './ModernSidebar';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernSidebar />
      {/* Main Content Area - positioned to start after sidebar */}
      <main
        className="min-h-screen"
        style={{
          marginLeft: '320px', // Account for fixed sidebar width
          width: 'calc(100vw - 320px)',
          maxWidth: 'none',
          minWidth: '0',
          overflowX: 'hidden'
        }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}; 