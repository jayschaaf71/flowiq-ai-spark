import React from 'react';
import { ModernSidebar } from './ModernSidebar';
import { SageAI } from '@/components/ai/SageAI';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';

interface ModernLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showSageAI?: boolean;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({
    children,
    showHeader = true,
    showSageAI = true
}) => {
    const { currentTheme } = useSpecialtyTheme();

    // Comprehensive safety checks for theme properties
    const sidebarWidth = currentTheme?.layout?.sidebarWidth || '320px';
    const themeComponents = currentTheme?.components?.sidebar || 'bg-white border-r border-gray-200';
    const themeTypography = currentTheme?.typography?.headings?.h2 || 'text-xl font-semibold';

    console.log('🔧 ModernLayout: currentTheme:', currentTheme);
    console.log('🔧 ModernLayout: sidebarWidth:', sidebarWidth);
    console.log('🔧 ModernLayout: themeComponents:', themeComponents);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex">
            {/* Modern Sidebar */}
            <ModernSidebar />

            {/* Main Content Area - positioned to start after sidebar */}
            <div
                className="flex-1 min-h-screen flex flex-col"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth})`,
                    maxWidth: 'none',
                    minWidth: '0',
                    overflowX: 'hidden'
                }}
            >
                {/* Main Content */}
                <main className="flex-1 p-6 w-full min-w-0" style={{ width: '100%', maxWidth: 'none', overflowX: 'hidden' }}>
                    <div className="w-full max-w-none min-w-0" style={{ width: '100%', maxWidth: 'none', overflowX: 'hidden' }}>
                        {children}
                    </div>
                </main>
            </div>

            {/* Floating Sage AI Assistant */}
            {showSageAI && <SageAI mode="floating" />}
        </div>
    );
}; 