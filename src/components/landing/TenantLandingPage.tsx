
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Phone, Mail, Star, Users, Award, Shield } from 'lucide-react';
import { useEnhancedTenantConfig } from '@/utils/enhancedTenantConfig';

export const TenantLandingPage: React.FC = () => {
  const { tenantConfig, isLoading } = useEnhancedTenantConfig();

  // CRITICAL: All hooks must be called before any early returns
  // Set page title - moved before early returns to fix hook order
  React.useEffect(() => {
    if (tenantConfig) {
      document.title = `${tenantConfig.name} - Healthcare Practice Management`;
    }
  }, [tenantConfig]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading practice information...</p>
        </div>
      </div>
    );
  }

  if (!tenantConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Practice Not Found</h1>
          <p className="text-muted-foreground">The requested practice could not be found.</p>
        </div>
      </div>
    );
  }

  console.log('TenantLandingPage: Using tenant config:', tenantConfig);

  // Create inline styles using tenant-specific colors
  const primaryStyle = { 
    backgroundColor: tenantConfig.primary_color, 
    color: 'white',
    borderColor: tenantConfig.primary_color
  };
  const primaryBorderStyle = { borderColor: tenantConfig.primary_color };
  const primaryTextStyle = { color: tenantConfig.primary_color };

  const getSpecialtyDescription = () => {
    switch (tenantConfig.specialty) {
      case 'chiropractic-care':
        return 'Expert chiropractic care for optimal spinal health and wellness';
      case 'dental-sleep-medicine':
        return 'Advanced sleep medicine solutions for better rest and health';
      case 'dental-care':
        return 'Comprehensive dental care for your oral health and wellness';
      case 'medical-spa':
        return 'Premium medical spa services for beauty and wellness';
      default:
        return 'Professional healthcare services tailored to your needs';
    }
  };

  const getDefaultServices = () => {
    switch (tenantConfig.specialty) {
      case 'chiropractic-care':
        return ['Spinal Adjustment', 'Physical Therapy', 'Massage Therapy', 'Pain Management', 'Wellness Consultation', 'Rehabilitation'];
      case 'dental-sleep-medicine':
        return ['Sleep Study', 'Sleep Apnea Treatment', 'CPAP Therapy', 'Oral Appliance Therapy', 'Sleep Consultation', 'Follow-up Care'];
      case 'dental-care':
        return ['General Checkup', 'Dental Cleaning', 'Cosmetic Dentistry', 'Orthodontics', 'Oral Surgery', 'Emergency Care'];
      case 'medical-spa':
        return ['Botox Treatment', 'Dermal Fillers', 'Laser Therapy', 'Chemical Peels', 'Skin Rejuvenation', 'Consultation'];
      default:
        return ['Consultation', 'Treatment', 'Follow-up', 'Therapy', 'Wellness Care', 'Emergency Care'];
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffffff, #f8fafc)' }}>
      {/* Debug badge */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        background: tenantConfig.primary_color, 
        color: 'white', 
        padding: '8px 12px', 
        zIndex: 9999,
        fontSize: '11px',
        borderRadius: '4px'
      }}>
        ✓ {tenantConfig.name}
      </div>
      <section 
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        style={{ 
          background: `linear-gradient(135deg, ${tenantConfig.primary_color}15, ${tenantConfig.secondary_color}10)`
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6" 
              style={{ 
                color: '#1a1a1a',
                position: 'relative',
                zIndex: 1000
              }}
              data-practice-name={tenantConfig.name}
              title={`Debug: Should show ${tenantConfig.name}`}
            >
              {tenantConfig.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: '#4a4a4a' }}>
              {getSpecialtyDescription()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-3"
                style={primaryStyle}
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3"
                style={{ ...primaryBorderStyle, ...primaryTextStyle }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Our Services
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#4a4a4a' }}>
              Comprehensive {tenantConfig.specialty.includes('chiropractic') ? 'chiropractic' : tenantConfig.specialty.includes('dental-sleep') ? 'sleep medicine' : tenantConfig.specialty.includes('dental') ? 'dental' : 'healthcare'} care tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getDefaultServices().slice(0, 6).map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl" style={primaryTextStyle}>
                    {service}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription style={{ color: '#4a4a4a' }}>
                    Professional {service.toLowerCase()} services provided by our experienced team.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Why Choose Us
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={primaryStyle}
              >
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Expert Team
              </h3>
              <p style={{ color: '#4a4a4a' }}>
                Experienced professionals dedicated to your health and wellness.
              </p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={primaryStyle}
              >
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Advanced Technology
              </h3>
              <p style={{ color: '#4a4a4a' }}>
                State-of-the-art equipment and modern treatment techniques.
              </p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={primaryStyle}
              >
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Personalized Care
              </h3>
              <p style={{ color: '#4a4a4a' }}>
                Customized treatment plans tailored to your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
            Schedule Your Visit
          </h2>
          <p className="text-xl mb-8" style={{ color: '#4a4a4a' }}>
            Take the first step towards better health. Contact us today to schedule your appointment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2" style={{ color: '#4a4a4a' }}>
              <Clock className="h-5 w-5" style={primaryTextStyle} />
              <span>Open 7 days a week</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#4a4a4a' }}>
              <MapPin className="h-5 w-5" style={primaryTextStyle} />
              <span>Convenient location</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              size="lg" 
              className="text-lg px-12 py-4"
              style={primaryStyle}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              Book Your Appointment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
