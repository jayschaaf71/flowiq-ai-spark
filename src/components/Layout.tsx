
import React from 'react';
import { PageHeader } from './PageHeader';
import { AppSidebar } from './AppSidebar';
import { SageAI } from './ai/SageAI';
import { Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showSageAI?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showSageAI = true
}) => {
  console.log('🔧 Layout: Rendering with children:', typeof children);
  console.log('🔧 Layout: Children content:', children);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex">
      <AppSidebar />

      {/* Main Content Area - flex to fill remaining space */}
      <div className="flex-1 min-h-screen flex flex-col">
        {showHeader && <PageHeader />}
        <main className="flex-1 p-6 w-full">
          {children}
        </main>
      </div>

      {/* Floating Sage AI Assistant */}
      {showSageAI && <SageAI mode="floating" />}
    </div>
  );
};
