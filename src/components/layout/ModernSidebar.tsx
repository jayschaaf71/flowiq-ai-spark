import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { useTenantConfig } from '@/utils/enhancedTenantConfig';
import { Home, Users, Calendar, Settings, User, Sparkles, Stethoscope, MessageSquare, TrendingUp, Settings as SettingsIcon, Target, Link } from 'lucide-react';

interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<any>;
}

interface AIAssistant {
    label: string;
    path: string;
    icon: React.ComponentType<any>;
    description: string;
}

export const ModernSidebar: React.FC = () => {
    const location = useLocation();
    const { currentTheme } = useSpecialtyTheme();
    const { tenantConfig } = useTenantConfig();

    // Convert HSL to hex for theme colors
    const hslToHex = (hsl: string): string => {
        if (!hsl) return '#8b5cf6'; // fallback purple

        try {
            // Parse HSL values, handling percentage symbols
            const parts = hsl.split(' ');
            const h = parseInt(parts[0]);
            const s = parseInt(parts[1].replace('%', ''));
            const l = parseInt(parts[2].replace('%', ''));

            // Validate inputs
            if (isNaN(h) || isNaN(s) || isNaN(l)) {
                console.warn('Invalid HSL values:', hsl);
                return '#8b5cf6'; // fallback purple
            }

            const hue = h / 360;
            const saturation = s / 100;
            const lightness = l / 100;

            const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
            const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
            const m = lightness - c / 2;

            let r = 0, g = 0, b = 0;

            if (hue < 1 / 6) {
                r = c; g = x; b = 0;
            } else if (hue < 2 / 6) {
                r = x; g = c; b = 0;
            } else if (hue < 3 / 6) {
                r = 0; g = c; b = x;
            } else if (hue < 4 / 6) {
                r = 0; g = x; b = c;
            } else if (hue < 5 / 6) {
                r = x; g = 0; b = c;
            } else {
                r = c; g = 0; b = x;
            }

            const toHex = (n: number) => {
                const value = Math.round((n + m) * 255);
                const hex = value.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };

            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        } catch (error) {
            console.error('Error converting HSL to hex:', error, 'HSL:', hsl);
            return '#8b5cf6'; // fallback purple
        }
    };

    // Safety check for theme colors - use cssVariables instead of colors
    const primaryColor = currentTheme?.cssVariables?.primary ?
        hslToHex(currentTheme.cssVariables.primary) : '#8b5cf6';
    const secondaryColor = currentTheme?.cssVariables?.secondary ?
        hslToHex(currentTheme.cssVariables.secondary) : '#a78bfa';
    const sidebarWidth = currentTheme?.layout?.sidebarWidth || '320px';
    const sidebarClass = currentTheme?.components?.sidebar || 'bg-white border-r border-gray-200';
    const headingClass = currentTheme?.typography?.headings?.h2 || 'text-xl font-semibold';
    const brandingTagline = currentTheme?.branding?.tagline || 'AI-Powered Workflow Intelligence';

    console.log('🔧 ModernSidebar: currentTheme:', currentTheme);
    console.log('🔧 ModernSidebar: cssVariables:', currentTheme?.cssVariables);
    console.log('🔧 ModernSidebar: primaryColor:', primaryColor);
    console.log('🔧 ModernSidebar: sidebarWidth:', sidebarWidth);

    const mainNavItems: NavItem[] = [
        { label: 'Dashboard', path: '/dashboard', icon: Home },
        { label: 'Patients', path: '/patients', icon: Users },
        { label: 'Schedule', path: '/schedule', icon: Calendar },
        { label: 'Integrations', path: '/integrations', icon: Link },
    ];

    const aiAssistants: AIAssistant[] = [
        {
            label: 'Clinical Assistant',
            path: '/assistants/clinical',
            icon: Stethoscope,
            description: 'SOAP notes, treatment plans, clinical guidelines'
        },
        {
            label: 'Communication Assistant',
            path: '/assistants/communication',
            icon: MessageSquare,
            description: 'Patient messaging, follow-ups, multi-channel communication'
        },
        {
            label: 'Revenue Assistant',
            path: '/assistants/revenue',
            icon: TrendingUp,
            description: 'Insurance verification, claims processing, billing automation'
        },
        {
            label: 'Operations Assistant',
            path: '/assistants/operations',
            icon: SettingsIcon,
            description: 'Staff scheduling, inventory, compliance monitoring'
        },
        {
            label: 'Growth Assistant',
            path: '/assistants/growth',
            icon: Target,
            description: 'Patient acquisition, referrals, business development'
        },
    ];

    const settingsItems: NavItem[] = [
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Profile', path: '/profile', icon: User },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            className={`${sidebarClass} h-screen fixed left-0 top-0 z-10 overflow-y-auto overflow-x-hidden`}
            style={{ width: sidebarWidth }}
        >
            {/* Branding Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                        style={{ backgroundColor: primaryColor, color: 'white' }}
                    >
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <h1 className={`${headingClass} text-gray-900 leading-tight`}>
                            {tenantConfig?.brand_name || 'Practice Name'}
                        </h1>
                        <p className="text-sm text-gray-600 leading-tight mt-1">
                            {brandingTagline}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Powered by FlowIQ
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-6">
                {/* Main Navigation */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        MAIN
                    </h3>
                    <div className="space-y-1">
                        {mainNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                            ? 'text-white shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`
                                    }
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? primaryColor : 'transparent',
                                    })}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                {/* AI Assistants */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        AI ASSISTANTS
                    </h3>
                    <div className="space-y-1">
                        {aiAssistants.map((assistant) => {
                            const Icon = assistant.icon;
                            return (
                                <NavLink
                                    key={assistant.path}
                                    to={assistant.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group ${isActive
                                            ? 'text-white shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`
                                    }
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? primaryColor : 'transparent',
                                    })}
                                    title={assistant.description}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="flex-1">{assistant.label}</span>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs bg-purple-100 text-purple-700 border-purple-200"
                                    >
                                        AI
                                    </Badge>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                {/* Account */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        ACCOUNT
                    </h3>
                    <div className="space-y-1">
                        {settingsItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                            ? 'text-white shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`
                                    }
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? primaryColor : 'transparent',
                                    })}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            Staff Member
                        </p>
                        <p className="text-xs text-gray-500">
                            {tenantConfig?.brand_name || 'Practice'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}; 