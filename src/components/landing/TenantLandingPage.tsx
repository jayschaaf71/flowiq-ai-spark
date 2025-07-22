
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Phone, MapPin, Mail, Star } from 'lucide-react';
import { getPracticeConfig, PracticeConfig } from '@/utils/practiceConfig';

interface TenantLandingPageProps {
  tenantSubdomain: string;
}

export const TenantLandingPage: React.FC<TenantLandingPageProps> = ({ tenantSubdomain }) => {
  const practiceConfig = getPracticeConfig(tenantSubdomain);
  
  if (!practiceConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Practice Not Found</h1>
          <p className="text-gray-600">The requested practice could not be found.</p>
        </div>
      </div>
    );
  }

  const getSpecialtyFeatures = (specialty: string) => {
    switch (specialty) {
      case 'chiropractic-care':
        return [
          'Spinal Adjustments',
          'Pain Management',
          'Sports Injury Recovery',
          'Wellness Care',
          'Posture Correction',
          'Headache Treatment'
        ];
      case 'dental-sleep-medicine':
        return [
          'Sleep Apnea Treatment',
          'Oral Appliance Therapy',
          'CPAP Alternatives',
          'Snoring Solutions',
          'Sleep Study Analysis',
          'TMJ Treatment'
        ];
      default:
        return ['Comprehensive Care', 'Expert Treatment', 'Personalized Service'];
    }
  };

  const getHeroMessage = (specialty: string) => {
    switch (specialty) {
      case 'chiropractic-care':
        return {
          title: 'Your Path to Pain-Free Living',
          subtitle: 'Expert chiropractic care for lasting relief and optimal wellness'
        };
      case 'dental-sleep-medicine':
        return {
          title: 'Sleep Better, Live Better',
          subtitle: 'Comprehensive sleep apnea treatment and oral appliance therapy'
        };
      default:
        return {
          title: 'Expert Healthcare',
          subtitle: 'Comprehensive care tailored to your needs'
        };
    }
  };

  const features = getSpecialtyFeatures(practiceConfig.specialty);
  const heroMessage = getHeroMessage(practiceConfig.specialty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Debug Info */}
      <div className="bg-yellow-50 border-b border-yellow-200 p-2 text-xs">
        <strong>Debug:</strong> Tenant: {tenantSubdomain} | Practice: {practiceConfig.name} | 
        Specialty: {practiceConfig.specialty} | Colors: {practiceConfig.colors.primary}
      </div>

      {/* Hero Section */}
      <section 
        className="py-20 px-4 text-center text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${practiceConfig.colors.primary}, ${practiceConfig.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            {practiceConfig.specialty.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {practiceConfig.name}
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-4 font-light">
            {heroMessage.title}
          </h2>
          
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {heroMessage.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 text-lg"
            >
              <Users className="mr-2 h-5 w-5" />
              Patient Portal
            </Button>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-white"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive care designed to help you achieve optimal health and wellness
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${practiceConfig.colors.primary}20` }}
                  >
                    <Star 
                      className="h-6 w-6" 
                      style={{ color: practiceConfig.colors.primary }} 
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{feature}</h3>
                  <p className="text-sm text-muted-foreground">
                    Expert care tailored to your specific needs
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Types Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Appointments</h2>
            <p className="text-lg text-muted-foreground">
              Choose the appointment type that best fits your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {practiceConfig.appointmentTypes.slice(0, 6).map((type, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${practiceConfig.colors.primary}15` }}
                  >
                    <Clock 
                      className="h-5 w-5" 
                      style={{ color: practiceConfig.colors.primary }} 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{type}</h3>
                    <p className="text-sm text-muted-foreground">Available for booking</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Hours Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
            <p className="text-lg text-muted-foreground">
              We're here to help you on your journey to better health
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>info@{tenantSubdomain}.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>123 Healthcare Drive<br />Your City, ST 12345</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Hours */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">Office Hours</h3>
                <div className="space-y-3">
                  {Object.entries(practiceConfig.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-muted-foreground">
                        {hours ? `${hours.start} - ${hours.end}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 px-4 text-center text-white"
        style={{ 
          background: `linear-gradient(135deg, ${practiceConfig.colors.primary}, ${practiceConfig.colors.secondary})` 
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards better health. Book your appointment today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Now
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2">{practiceConfig.name}</h3>
          <p className="text-gray-400 mb-4">
            {heroMessage.subtitle}
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="/auth" className="hover:text-white transition-colors">
              Staff Login
            </a>
            <a href="/patient-portal" className="hover:text-white transition-colors">
              Patient Portal
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-500">
            © 2024 {practiceConfig.name}. All rights reserved. Powered by FlowIQ AI.
          </div>
        </div>
      </footer>
    </div>
  );
};
