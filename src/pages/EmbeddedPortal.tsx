import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BrandedPatientPortal } from '@/components/patient-experience/BrandedPatientPortal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BrandingConfig {
  practiceName: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tagline?: string;
  website?: string;
  phone?: string;
}

export const EmbeddedPortal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Extract branding configuration from URL parameters
      const config: BrandingConfig = {
        practiceName: searchParams.get('practiceName') || 'Healthcare Practice',
        logo: searchParams.get('logo') || undefined,
        primaryColor: searchParams.get('primaryColor') || '#3B82F6',
        secondaryColor: searchParams.get('secondaryColor') || '#06B6D4',
        tagline: searchParams.get('tagline') || undefined,
        website: searchParams.get('website') || undefined,
        phone: searchParams.get('phone') || undefined
      };

      setBranding(config);
      setLoading(false);

      // Set document title
      document.title = `${config.practiceName} - Patient Portal`;

      // Apply meta tags for SEO and branding
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Access your patient portal for ${config.practiceName}. View appointments, medical records, and manage your healthcare online.`
        );
      }

      // Apply theme colors to meta tags for mobile browsers
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', config.primaryColor);

    } catch (err) {
      console.error('Error configuring embedded portal:', err);
      setError('Failed to load portal configuration');
      setLoading(false);
    }
  }, [searchParams]);

  // Optimize for embedding by removing unnecessary margins/padding
  useEffect(() => {
    // Add embedded portal specific styles
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';

    // Cleanup on unmount
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading patient portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please check your embed configuration and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!branding) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No portal configuration found. Please ensure you're using the correct embed code.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto">
      <BrandedPatientPortal
        branding={branding}
        tenantId={searchParams.get('tenant') || undefined}
        isEmbedded={true}
      />
    </div>
  );
};