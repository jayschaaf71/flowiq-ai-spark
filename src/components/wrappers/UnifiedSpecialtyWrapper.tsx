
import React, { useEffect, useState } from 'react';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { TenantProtectedRoute } from '@/components/auth/TenantProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface UnifiedSpecialtyWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'practice_admin' | 'platform_admin';
  allowedSpecialties?: string[];
  fallbackSpecialty?: string;
}

const ThemeApplier: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTheme } = useSpecialtyTheme();
  const [themeApplied, setThemeApplied] = useState(false);

  useEffect(() => {
    console.log('🎨 ThemeApplier - applying theme:', currentTheme.name);
    console.log('🎨 ThemeApplier - CSS variables:', currentTheme.cssVariables);
    
    // Small delay to ensure CSS variables are applied
    const timer = setTimeout(() => {
      setThemeApplied(true);
      console.log('✅ ThemeApplier - theme applied successfully');
    }, 100); // Increased delay slightly
    
    return () => clearTimeout(timer);
  }, [currentTheme]);

  if (!themeApplied) {
    console.log('⏳ ThemeApplier - waiting for theme to apply...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('🎨 ThemeApplier - rendering children with applied theme');
  return <>{children}</>;
};

export const UnifiedSpecialtyWrapper: React.FC<UnifiedSpecialtyWrapperProps> = ({ 
  children, 
  requiredRole = 'staff',
  allowedSpecialties,
  fallbackSpecialty = 'chiropractic'
}) => {
  const { currentTheme, specialty } = useSpecialtyTheme();

  console.log('🔄 UnifiedSpecialtyWrapper - detected specialty:', specialty);
  console.log('🔄 UnifiedSpecialtyWrapper - allowed specialties:', allowedSpecialties);
  console.log('🔄 UnifiedSpecialtyWrapper - current theme:', currentTheme.name);

  // Check if current specialty is allowed
  const isSpecialtyAllowed = !allowedSpecialties || allowedSpecialties.includes(specialty);

  console.log('🔄 UnifiedSpecialtyWrapper - is specialty allowed?', isSpecialtyAllowed);

  if (!isSpecialtyAllowed) {
    console.error('❌ UnifiedSpecialtyWrapper - Specialty not allowed!', {
      detected: specialty,
      allowed: allowedSpecialties,
      fallback: fallbackSpecialty
    });
    
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This specialty ({specialty}) is not available in this context. 
              Supported specialties: {allowedSpecialties?.join(', ')}.
            </AlertDescription>
          </Alert>
        </div>
      </ErrorBoundary>
    );
  }

  console.log('✅ UnifiedSpecialtyWrapper - Specialty allowed, rendering children');

  return (
    <ErrorBoundary>
      <TenantProtectedRoute requiredRole={requiredRole}>
        <SpecialtyProvider>
          <ThemeApplier>
            <div className={`${currentTheme.name}-iq-theme min-h-screen`} data-specialty={specialty}>
              {children}
            </div>
          </ThemeApplier>
        </SpecialtyProvider>
      </TenantProtectedRoute>
    </ErrorBoundary>
  );
};
