import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppointmentIQWrapper } from '@/components/wrappers/AppointmentIQWrapper';
import { BookingInterface } from '@/components/schedule/BookingInterface';
import { EnhancedBookingFlow } from '@/components/schedule/EnhancedBookingFlow';
import { AppointmentBookingModal } from '@/components/schedule/AppointmentBookingModal';

interface StandaloneAppointmentIQProps {
  tenantConfig?: {
    branding?: {
      primaryColor?: string;
      logo?: string;
      name?: string;
    };
    features?: {
      voiceBooking?: boolean;
      aiConflictResolution?: boolean;
      multiProvider?: boolean;
      waitlistManagement?: boolean;
    };
    integrations?: {
      calendar?: 'google' | 'outlook' | 'apple';
      ehr?: string;
      sms?: boolean;
      email?: boolean;
    };
  };
}

export const StandaloneAppointmentIQ: React.FC<StandaloneAppointmentIQProps> = ({ 
  tenantConfig 
}) => {
  return (
    <Router>
      <AppointmentIQWrapper mode="standalone" tenantConfig={tenantConfig}>
        <Routes>
          {/* Main booking interface */}
          <Route path="/" element={<EnhancedBookingFlow />} />
          
          {/* Alternative booking interfaces */}
          <Route path="/book" element={<BookingInterface />} />
          
          {/* Success/confirmation pages */}
          <Route path="/confirmation/:appointmentId" element={
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                ✅ Appointment Confirmed!
              </h2>
              <p className="text-gray-600">
                You'll receive a confirmation email shortly.
              </p>
            </div>
          } />
          
          {/* Error/fallback */}
          <Route path="*" element={
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
              <a href="/" className="text-blue-600 hover:underline">
                Return to Booking
              </a>
            </div>
          } />
        </Routes>
      </AppointmentIQWrapper>
    </Router>
  );
};