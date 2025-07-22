import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  CheckCircle,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  LogIn,
  Play,
  Phone,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getTenantBySubdomain } from "@/config/deployment";
import { getPracticeConfig } from "@/utils/practiceConfig";

interface TenantLandingPageProps {
  subdomain: string;
}

export const TenantLandingPage: React.FC<TenantLandingPageProps> = ({ subdomain }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const tenantConfig = getTenantBySubdomain(subdomain);
  const practiceConfig = getPracticeConfig(subdomain);
  
  // Debug logging
  console.log('TenantLandingPage Debug:', {
    subdomain,
    tenantConfig,
    practiceConfig,
    user: !!user
  });
  
  if (!tenantConfig || !practiceConfig) {
    console.warn('Missing tenant or practice config:', { subdomain, tenantConfig, practiceConfig });
    
    // Show error state instead of returning null
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">
            Configuration Error
          </h1>
          <p className="text-red-600 mb-4">
            Unable to load tenant configuration for "{subdomain}"
          </p>
          <div className="bg-red-100 p-4 rounded-lg text-left text-sm text-red-700">
            <p><strong>Debug Info:</strong></p>
            <p>Subdomain: {subdomain}</p>
            <p>Tenant Config: {tenantConfig ? 'Found' : 'Missing'}</p>
            <p>Practice Config: {practiceConfig ? 'Found' : 'Missing'}</p>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            className="mt-4"
            variant="outline"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const getSpecialtyContent = () => {
    switch (practiceConfig.specialty) {
      case 'chiropractic-care':
        return {
          hero: {
            title: "Your Path to Pain-Free Living",
            subtitle: "Expert chiropractic care with advanced technology",
            description: "Experience comprehensive spinal health solutions, from pain relief to wellness optimization. Our cutting-edge AI technology ensures personalized treatment plans.",
            ctaText: "Book Your Consultation"
          },
          services: [
            { name: "Spinal Adjustments", description: "Precise spinal manipulation for optimal alignment" },
            { name: "Physical Therapy", description: "Targeted exercises and rehabilitation programs" },
            { name: "Spinal Decompression", description: "Non-surgical treatment for disc problems" },
            { name: "Massage Therapy", description: "Therapeutic massage for muscle tension relief" },
            { name: "X-Ray Analysis", description: "Advanced imaging for accurate diagnosis" },
            { name: "Wellness Plans", description: "Comprehensive health and wellness programs" }
          ],
          features: [
            { title: "Pain Assessment", description: "Advanced pain analysis and treatment planning", icon: Activity },
            { title: "Spinal Health", description: "Comprehensive spinal health monitoring", icon: Shield },
            { title: "Recovery Tracking", description: "Progress monitoring and outcome measurement", icon: TrendingUp }
          ]
        };
      
      case 'dental-sleep-medicine':
        return {
          hero: {
            title: "Restore Your Quality Sleep",
            subtitle: "Advanced dental sleep medicine solutions",
            description: "Combat sleep apnea and sleep disorders with cutting-edge oral appliance therapy. Our AI-powered treatment plans ensure optimal outcomes.",
            ctaText: "Schedule Sleep Consultation"
          },
          services: [
            { name: "Sleep Study Analysis", description: "Comprehensive sleep disorder evaluation" },
            { name: "Oral Appliance Therapy", description: "Custom-fitted sleep apnea treatment devices" },
            { name: "CPAP Alternative Solutions", description: "Comfortable alternatives to CPAP therapy" },
            { name: "TMJ Treatment", description: "Temporomandibular joint disorder therapy" },
            { name: "Airway Assessment", description: "Advanced airway evaluation and treatment" },
            { name: "Sleep Optimization", description: "Comprehensive sleep health improvement" }
          ],
          features: [
            { title: "Sleep Analysis", description: "AI-powered sleep pattern analysis", icon: Brain },
            { title: "Appliance Monitoring", description: "Smart oral appliance effectiveness tracking", icon: Activity },
            { title: "Treatment Optimization", description: "Continuous treatment plan refinement", icon: TrendingUp }
          ]
        };
      
      default:
        return {
          hero: {
            title: "Advanced Healthcare Solutions",
            subtitle: "Personalized care with AI technology",
            description: "Experience the future of healthcare with our AI-powered practice management and patient care solutions.",
            ctaText: "Get Started"
          },
          services: [],
          features: []
        };
    }
  };

  const content = getSpecialtyContent();
  
  const workingHours = Object.entries(practiceConfig.workingHours)
    .filter(([_, hours]) => hours !== null)
    .map(([day, hours]) => ({ day: day.charAt(0).toUpperCase() + day.slice(1), hours }));

  const handleBookAppointment = () => {
    if (user) {
      navigate('/appointments/book');
    } else {
      navigate('/auth?defaultTab=signup&intent=book-appointment');
    }
  };

  const handlePatientPortal = () => {
    navigate('/auth?defaultTab=signin&intent=patient-portal');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${practiceConfig.colors.primary}15, ${practiceConfig.colors.secondary}15)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4"
                style={{ backgroundColor: practiceConfig.colors.primary }}
              >
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                  {practiceConfig.name}
                </h1>
                <p className="text-xl font-medium" style={{ color: practiceConfig.colors.primary }}>
                  {content.hero.subtitle}
                </p>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-bold mb-6" style={{ color: 'hsl(var(--foreground))' }}>
                {content.hero.title}
              </h2>
              
              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {content.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  className="text-white hover:scale-105 transition-all duration-200 px-8 py-3 text-lg shadow-lg"
                  style={{ backgroundColor: practiceConfig.colors.primary }}
                  onClick={handleBookAppointment}
                >
                  {content.hero.ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-lg"
                  style={{ borderColor: practiceConfig.colors.primary, color: practiceConfig.colors.primary }}
                  onClick={handlePatientPortal}
                >
                  <LogIn className="mr-2 w-5 h-5" />
                  Patient Portal
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" style={{ color: practiceConfig.colors.secondary }} />
                  Same-Day Appointments
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" style={{ color: practiceConfig.colors.secondary }} />
                  Insurance Accepted
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" style={{ color: practiceConfig.colors.secondary }} />
                  Advanced Technology
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      {content.services.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
              Our Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Comprehensive care tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: 'hsl(var(--foreground))' }}>
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Technology Features */}
      {content.features.length > 0 && (
        <div className="py-16" style={{ backgroundColor: 'hsl(var(--muted/20))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                Advanced Technology
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
                AI-powered healthcare for better outcomes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${practiceConfig.colors.primary}15` }}
                    >
                      <feature.icon className="w-8 h-8" style={{ color: practiceConfig.colors.primary }} />
                    </div>
                    <CardTitle style={{ color: 'hsl(var(--foreground))' }}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Practice Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
                <Clock className="w-5 h-5 mr-2" style={{ color: practiceConfig.colors.primary }} />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workingHours.map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span style={{ color: 'hsl(var(--foreground))' }}>{day}</span>
                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {hours ? `${hours.start} - ${hours.end}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
                <Phone className="w-5 h-5 mr-2" style={{ color: practiceConfig.colors.primary }} />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                size="lg" 
                className="w-full text-white"
                style={{ backgroundColor: practiceConfig.colors.primary }}
                onClick={handleBookAppointment}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment Online
              </Button>
              <div className="text-center pt-4">
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Questions? Need immediate assistance?
                </p>
                <p className="font-semibold" style={{ color: practiceConfig.colors.primary }}>
                  Call us for personalized care
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: practiceConfig.colors.primary }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Advanced Care?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our patients who trust {practiceConfig.name} for exceptional healthcare
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ color: practiceConfig.colors.primary }}
            onClick={handleBookAppointment}
          >
            {content.hero.ctaText}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: practiceConfig.colors.primary }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{practiceConfig.name}</span>
            </div>
            <p className="text-gray-400 mb-6">
              {content.hero.subtitle}
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 {practiceConfig.name}. All rights reserved.</span>
              <span>•</span>
              <span>Powered by FlowIQ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};