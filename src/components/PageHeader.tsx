
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, LogOut, User, Zap } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useSpecialtyTheme } from "@/hooks/useSpecialtyTheme";
import { NotificationCenter } from "@/components/ui/NotificationCenter";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, subtitle, badge, children }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { currentTheme } = useSpecialtyTheme();

  // Convert HSL to hex for theme colors
  const hslToHex = (hsl: string): string => {
    if (!hsl) return '#0ea5e9'; // fallback blue

    console.log('🔧 HSL to Hex conversion - Input:', hsl);

    try {
      // Parse HSL values, handling percentage symbols
      const parts = hsl.split(' ');
      const h = parseInt(parts[0]);
      const s = parseInt(parts[1].replace('%', ''));
      const l = parseInt(parts[2].replace('%', ''));

      console.log('🔧 HSL to Hex conversion - Parsed values:', { h, s, l });

      // Validate inputs
      if (isNaN(h) || isNaN(s) || isNaN(l)) {
        console.warn('Invalid HSL values:', hsl, 'Parsed:', { h, s, l });
        return '#0ea5e9'; // fallback blue
      }

      const hue = h / 360;
      const saturation = s / 100;
      const lightness = l / 100;

      console.log('🔧 HSL to Hex conversion - Normalized:', { hue, saturation, lightness });

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

      const result = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      console.log('🔧 HSL to Hex conversion - Result:', result);
      return result;
    } catch (error) {
      console.error('Error converting HSL to hex:', error, 'HSL:', hsl);
      return '#0ea5e9'; // fallback blue
    }
  };

  // Safety check for theme colors - use cssVariables instead of colors
  const primaryColor = currentTheme?.cssVariables?.primary ?
    hslToHex(currentTheme.cssVariables.primary) : '#0ea5e9';
  const secondaryColor = currentTheme?.cssVariables?.secondary ?
    hslToHex(currentTheme.cssVariables.secondary) : '#38bdf8';

  // Debug logging for theme detection
  console.log('🔧 PageHeader: currentTheme:', currentTheme);
  console.log('🔧 PageHeader: cssVariables:', currentTheme?.cssVariables);
  console.log('🔧 PageHeader: primaryColor:', primaryColor);
  console.log('🔧 PageHeader: secondaryColor:', secondaryColor);



  const handleProfileSettings = () => {
    // Navigate to the correct settings page based on the current domain
    const hostname = window.location.hostname;
    if (hostname === 'connect.flow-iq.ai') {
      navigate('/dashboard?tab=settings');
    } else {
      navigate('/settings');
    }
  };

  const handleSignOut = () => {
    // Add actual logout logic here
    console.log('Signing out...');
  };



  return (
    <div className="relative">
      {/* Prominent header with theme-based colors */}
      <div
        className="border-b-4 shadow-2xl"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
          borderColor: primaryColor
        }}
      >
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Title and branding */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
                    <Zap className="w-7 h-7" style={{ color: primaryColor }} />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-12 h-12 bg-white/30 rounded-xl blur-lg"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-white/90 text-sm font-medium mt-1 drop-shadow-sm">{subtitle}</p>
                  )}
                </div>
              </div>
              {badge && (
                <Badge variant="secondary" className="bg-white/25 text-white border-white/40 font-medium px-3 py-1 backdrop-blur-sm">
                  {badge}
                </Badge>
              )}
            </div>

            {/* Right side - Actions and user menu */}
            <div className="flex items-center gap-3">
              {children}

              {/* Real-time Insurance Notifications */}
              <NotificationCenter />

              {/* User Profile */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-white/20 transition-all duration-200 rounded-lg border border-white/30 hover:border-white/50">
                    <Avatar className="h-8 w-8 ring-2 ring-white/50">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-sm">
                        JS
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200">
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                            JS
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Jason Schaaf</p>
                          <p className="text-xs text-slate-500">jayschaaf71@gmail.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                        onClick={handleProfileSettings}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                        onClick={() => navigate('/dashboard?tab=settings')}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Business Settings
                      </Button>
                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
