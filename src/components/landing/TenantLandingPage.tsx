
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Phone, Mail, Star, Users, Award, Shield } from 'lucide-react';
import { getPracticeConfig } from '@/utils/practiceConfig';

interface TenantLandingPageProps {
  tenantSubdomain: string;
}

export const TenantLandingPage: React.FC<TenantLandingPageProps> = ({ tenantSubdomain }) => {
  const practiceConfig = getPracticeConfig(tenantSubdomain);

  if (!practiceConfig) {
    console.error('No practice config found for tenant:', tenantSubdomain);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Practice Not Found</h1>
          <p className="text-gray-600">The requested practice could not be found.</p>
        </div>
      </div>
    );
  }

  console.log('TenantLandingPage: Using practice config:', practiceConfig);

  // Create inline styles using practice-specific colors
  const primaryStyle = { backgroundColor: practiceConfig.colors.primary, color: 'white' };
  const primaryBorderStyle = { borderColor: practiceConfig.colors.primary };
  const primaryTextStyle = { color: practiceConfig.colors.primary };

  // Force a page refresh if we detect the wrong content
  React.useEffect(() => {
    const hostname = window.location.hostname;
    console.log('TenantLandingPage: hostname =', hostname);
    console.log('TenantLandingPage: practice config =', practiceConfig);
    
    // Add to page title to verify this component is loading
    document.title = `${practiceConfig.name} - Healthcare Practice Management`;
  }, [practiceConfig]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffffff, #f8fafc)' }}>
      {/* Force content visibility */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        background: practiceConfig.colors.primary, 
        color: 'white', 
        padding: '8px 12px', 
        zIndex: 9999,
        fontSize: '11px',
        borderRadius: '4px'
      }}>
        ✓ {practiceConfig.name}
      </div>
      <section 
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        style={{ 
          background: `linear-gradient(135deg, ${practiceConfig.colors.primary}15, ${practiceConfig.colors.secondary}10)`
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
              data-practice-name={practiceConfig.name}
              title={`Debug: Should show ${practiceConfig.name}`}
            >
              {practiceConfig.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: '#4a4a4a' }}>
              {practiceConfig.specialty === 'chiropractic-care' 
                ? 'Expert chiropractic care for optimal spinal health and wellness'
                : practiceConfig.specialty === 'dental-sleep' 
                ? 'Advanced sleep medicine solutions for better rest and health'
                : 'Comprehensive dental care for your oral health and wellness'
              }
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
              Comprehensive {practiceConfig.specialty === 'chiropractic-care' ? 'chiropractic' : practiceConfig.specialty === 'dental-sleep' ? 'sleep medicine' : 'dental'} care tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceConfig.appointmentTypes.slice(0, 6).map((service, index) => (
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
              <span>Open {Object.keys(practiceConfig.workingHours).filter(day => 
                practiceConfig.workingHours[day] !== null
              ).length} days a week</span>
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
