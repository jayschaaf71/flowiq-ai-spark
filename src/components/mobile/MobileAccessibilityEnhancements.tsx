import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  Type, 
  Volume2, 
  Vibrate, 
  Palette, 
  Settings,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  darkMode: boolean;
  reduceMotion: boolean;
  largeButtons: boolean;
  voiceNavigation: boolean;
  hapticFeedback: boolean;
  screenReader: boolean;
}

export const MobileAccessibilityEnhancements: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    darkMode: false,
    reduceMotion: false,
    largeButtons: false,
    voiceNavigation: false,
    hapticFeedback: true,
    screenReader: false
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Apply accessibility settings to the document
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--base-font-size', `${settings.fontSize}px`);
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Reduce motion
    if (settings.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.style.setProperty('--animation-duration', '300ms');
    }
    
    // Large buttons
    if (settings.largeButtons) {
      root.classList.add('large-buttons');
    } else {
      root.classList.remove('large-buttons');
    }
    
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings({
      fontSize: 16,
      highContrast: false,
      darkMode: false,
      reduceMotion: false,
      largeButtons: false,
      voiceNavigation: false,
      hapticFeedback: true,
      screenReader: false
    });
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
        aria-label="Open accessibility settings"
      >
        <Eye className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4">
      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Accessibility Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <Label>Font Size</Label>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting('fontSize', value[0])}
                min={12}
                max={24}
                step={1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Current: {settings.fontSize}px
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Visual
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion">Reduce Motion</Label>
                <Switch
                  id="reduce-motion"
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="large-buttons">Larger Touch Targets</Label>
                <Switch
                  id="large-buttons"
                  checked={settings.largeButtons}
                  onCheckedChange={(checked) => updateSetting('largeButtons', checked)}
                />
              </div>
            </div>
          </div>

          {/* Audio & Haptic */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio & Haptic
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-nav">Voice Navigation</Label>
                <Switch
                  id="voice-nav"
                  checked={settings.voiceNavigation}
                  onCheckedChange={(checked) => updateSetting('voiceNavigation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="haptic">Haptic Feedback</Label>
                  <Vibrate className="w-4 h-4" />
                </div>
                <Switch
                  id="haptic"
                  checked={settings.hapticFeedback}
                  onCheckedChange={(checked) => updateSetting('hapticFeedback', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader">Screen Reader Support</Label>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="w-full"
            >
              Reset to Defaults
            </Button>
            
            <Button
              onClick={() => setIsExpanded(false)}
              className="w-full"
            >
              Apply Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};