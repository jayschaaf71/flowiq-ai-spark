import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  MessageSquare, 
  Bell, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Star,
  Wifi,
  Battery
} from 'lucide-react';

interface EnhancedMobileInterfaceProps {
  children: React.ReactNode;
  showPatientFeatures?: boolean;
}

export const EnhancedMobileInterface: React.FC<EnhancedMobileInterfaceProps> = ({ 
  children, 
  showPatientFeatures = false 
}) => {
  const isMobile = useIsMobile();
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);

  useEffect(() => {
    // Monitor connection status
    const updateConnectionStatus = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Monitor battery if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Enhanced Mobile Status Bar */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">FlowIQ</span>
            {connectionStatus === 'offline' && (
              <Badge variant="destructive" className="text-xs">
                Offline
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Wifi className={`w-3 h-3 ${connectionStatus === 'online' ? 'text-success' : 'text-destructive'}`} />
            </div>
            <div className="flex items-center gap-1">
              <Battery className={`w-3 h-3 ${batteryLevel > 20 ? 'text-success' : 'text-warning'}`} />
              <span className="text-xs">{batteryLevel}%</span>
            </div>
            <span className="text-xs">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Patient-Specific Quick Actions */}
      {showPatientFeatures && (
        <div className="bg-gradient-primary text-primary-foreground p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">Welcome back, John</h2>
              <p className="text-primary-foreground/80 text-sm">Your next appointment is in 2 days</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              View Details
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <PatientQuickAction icon={Calendar} label="Book" />
            <PatientQuickAction icon={MessageSquare} label="Message" />
            <PatientQuickAction icon={Heart} label="Health" />
            <PatientQuickAction icon={Phone} label="Call" />
          </div>
        </div>
      )}

      {/* Enhanced Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>

      {/* Enhanced Mobile Footer for Patients */}
      {showPatientFeatures && <PatientMobileFooter />}
    </div>
  );
};

const PatientQuickAction: React.FC<{ icon: React.ComponentType<any>; label: string }> = ({ 
  icon: Icon, 
  label 
}) => (
  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
    <Icon className="w-5 h-5" />
    <span className="text-xs font-medium">{label}</span>
  </div>
);

const PatientMobileFooter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', icon: User, label: 'Home', path: '/patient-dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Appointments', path: '/appointments' },
    { id: 'health', icon: Heart, label: 'Health', path: '/health' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/messages' },
    { id: 'more', icon: Bell, label: 'More', path: '/more' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 px-2 py-1">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 bg-primary rounded-full mt-1 animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Safe area padding for devices with home indicators */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  );
};