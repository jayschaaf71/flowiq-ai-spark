import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  ChevronRight,
  Award,
  Users,
  Activity
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
  
  // Use fallback configurations for demo purposes
  const practice = practiceConfig || {
    name: subdomain === 'west-county-spine' ? 'West County Spine and Joint' : 'Midwest Dental Sleep Medicine Institute',
    specialty: subdomain === 'west-county-spine' ? 'chiropractic-care' : 'dental-sleep-medicine',
    appointmentTypes: subdomain === 'west-county-spine' 
      ? ['Initial Consultation', 'Adjustment Session', 'Spinal Decompression', 'Physical Therapy']
      : ['Sleep Study Consultation', 'CPAP Follow-up', 'Oral Appliance Fitting', 'Sleep Study Review'],
    colors: {
      primary: subdomain === 'west-county-spine' ? '#2563eb' : '#7c3aed',
      secondary: subdomain === 'west-county-spine' ? '#10b981' : '#06b6d4'
    }
  };

  const tenant = tenantConfig || {
    id: subdomain === 'west-county-spine' ? '024e36c1-a1bc-44d0-8805-3162ba59a0c2' : 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    name: practice.name,
    specialty: practice.specialty
  };

  // Handle booking appointment
  const handleBookAppointment = () => {
    if (user) {
      navigate('/patient-portal');
    } else {
      navigate('/auth?defaultTab=signup&redirect=patient-portal');
    }
  };

  // Handle patient portal access
  const handlePatientPortal = () => {
    if (user) {
      navigate('/patient-portal');
    } else {
      navigate('/auth?defaultTab=signin&redirect=patient-portal');
    }
  };

  // Handle staff login
  const handleStaffLogin = () => {
    navigate('/auth?defaultTab=signin&redirect=dashboard');
  };

  const isChiropractic = practice.specialty.includes('chiropractic');
  const isDental = practice.specialty.includes('dental') || practice.specialty.includes('sleep');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4"
                style={{ backgroundColor: practice.colors.primary }}
              >
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">
                  {practice.name}
                </h1>
                <p className="text-xl font-medium" style={{ color: practice.colors.primary }}>
                  {isChiropractic ? 'Expert Chiropractic Care' : 'Sleep Medicine Specialists'}
                </p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                {isChiropractic ? (
                  <>
                    Your Spine Health, 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r" 
                          style={{ backgroundImage: `linear-gradient(to right, ${practice.colors.primary}, ${practice.colors.secondary})` }}>
                      {" "}Our Priority
                    </span>
                  </>
                ) : (
                  <>
                    Better Sleep, 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r"
                          style={{ backgroundImage: `linear-gradient(to right, ${practice.colors.primary}, ${practice.colors.secondary})` }}>
                      {" "}Better Life
                    </span>
                  </>
                )}
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {isChiropractic ? (
                  'Experience personalized chiropractic care with advanced techniques and compassionate treatment. Book your appointment today.'
                ) : (
                  'Comprehensive sleep disorder diagnosis and treatment. From sleep studies to oral appliance therapy, we help you achieve better sleep.'
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  className="text-white hover:scale-105 transition-all duration-200 px-8 py-3 text-lg shadow-lg"
                  style={{ backgroundColor: practice.colors.primary }}
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                  <Calendar className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-lg hover:bg-gray-50"
                  style={{ borderColor: practice.colors.primary, color: practice.colors.primary }}
                  onClick={handlePatientPortal}
                >
                  Patient Portal
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-lg hover:bg-gray-50 text-gray-600 border-gray-300"
                  onClick={handleStaffLogin}
                >
                  Staff Login
                  <Users className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  5-Star Rated
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-blue-600 mr-1" />
                  Licensed & Certified
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-green-600 mr-1" />
                  Same Day Appointments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isChiropractic 
              ? 'Comprehensive chiropractic care tailored to your specific needs'
              : 'Advanced sleep medicine treatments for better rest and health'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {practice.appointmentTypes.slice(0, 4).map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{service}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed mb-4">
                  {isChiropractic 
                    ? 'Professional chiropractic treatment designed to restore proper spine alignment and reduce pain.'
                    : 'Specialized sleep medicine consultation to diagnose and treat sleep disorders effectively.'
                  }
                </CardDescription>
                <Button 
                  variant="outline" 
                  size="sm"
                  style={{ borderColor: practice.colors.primary, color: practice.colors.primary }}
                  onClick={handleBookAppointment}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact & Location Section */}
      <div style={{ backgroundColor: practice.colors.primary }} className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ready to schedule your appointment?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <Phone className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-semibold">Call Us</h3>
              <p className="text-blue-100">(555) 123-4567</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-semibold">Visit Us</h3>
              <p className="text-blue-100">123 Healthcare Blvd, Suite 100</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-semibold">Hours</h3>
              <p className="text-blue-100">Mon-Fri: 8AM-6PM</p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-gray-900 hover:bg-gray-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleBookAppointment}
          >
            Schedule Your Appointment
            <Calendar className="ml-2 w-5 h-5" />
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
                style={{ backgroundColor: practice.colors.primary }}
              >
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{practice.name}</span>
            </div>
            <p className="text-gray-400 mb-6">
              {isChiropractic ? 'Expert Chiropractic Care' : 'Sleep Medicine Specialists'}
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 {practice.name}. All rights reserved.</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};