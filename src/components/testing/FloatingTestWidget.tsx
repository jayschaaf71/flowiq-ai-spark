import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestTube, X, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface QuickTestOption {
  id: string;
  name: string;
  tenant: string;
  role: string;
  specialty: string;
}

const quickTestOptions: QuickTestOption[] = [
  {
    id: 'chiro-admin',
    name: 'West County Admin',
    tenant: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    role: 'practice_admin',
    specialty: 'chiropractic-care'
  },
  {
    id: 'chiro-staff',
    name: 'West County Staff',
    tenant: '024e36c1-a1bc-44d0-8805-3162ba59a0c2', 
    role: 'staff',
    specialty: 'chiropractic-care'
  },
  {
    id: 'dental-admin',
    name: 'Midwest Dental Admin',
    tenant: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    role: 'practice_admin', 
    specialty: 'dental-sleep-medicine'
  },
  {
    id: 'dental-provider',
    name: 'Midwest Dental Provider',
    tenant: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    role: 'provider',
    specialty: 'dental-sleep-medicine'
  },
  {
    id: 'platform-admin',
    name: 'Platform Admin',
    tenant: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    role: 'platform_admin',
    specialty: 'dental-sleep-medicine'
  }
];

export const FloatingTestWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();
  const { getBrandName, specialty } = useSpecialty();
  const { isPlatformAdmin } = useEnhancedAuth();

  // Only show for platform admins
  if (!isPlatformAdmin) return null;

  const applyQuickTest = async (option: QuickTestOption) => {
    setIsApplying(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: option.role as any,
          current_tenant_id: option.tenant,
          specialty: option.specialty === 'chiropractic-care' 
            ? 'Chiropractic Care' 
            : 'Dental Sleep Medicine'
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      localStorage.setItem('currentSpecialty', option.specialty);

      toast({
        title: 'Test Applied',
        description: `Switched to ${option.name}`,
      });

      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Error applying test:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply test configuration',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <TestTube className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-xl border-2 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="font-medium text-sm">Quick Test</span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {!isMinimized && (
          <CardContent className="p-3 space-y-3">
            {/* Current Status */}
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{getBrandName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Specialty:</span>
                <span className="font-medium">{specialty}</span>
              </div>
            </div>

            {/* Quick Options */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Quick Switch:</label>
              {quickTestOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => applyQuickTest(option)}
                  disabled={isApplying}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option.name}</span>
                    <Badge variant="secondary" className="text-xs h-5">
                      {option.role === 'practice_admin' ? 'Admin' : 
                       option.role === 'platform_admin' ? 'Platform' :
                       option.role === 'provider' ? 'Provider' : 'Staff'}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => window.open('/platform-admin', '_blank')}
            >
              Full Testing Interface
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};