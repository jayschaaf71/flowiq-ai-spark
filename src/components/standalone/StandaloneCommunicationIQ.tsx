import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CommunicationIQWrapper } from '@/components/wrappers/CommunicationIQWrapper';
import { BookingInterface } from '@/components/schedule/BookingInterface';
import { EnhancedBookingFlow } from '@/components/schedule/EnhancedBookingFlow';
import { AppointmentBookingModal } from '@/components/schedule/AppointmentBookingModal';

interface StandaloneCommunicationIQProps {
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
      smartCommunication?: boolean;
      automatedFollowUp?: boolean;
      customerSupport?: boolean;
    };
    integrations?: {
      calendar?: 'google' | 'outlook' | 'apple';
      ehr?: string;
      sms?: boolean;
      email?: boolean;
      voip?: boolean;
      crm?: boolean;
    };
  };
}

export const StandaloneCommunicationIQ: React.FC<StandaloneCommunicationIQProps> = ({ 
  tenantConfig 
}) => {
  return (
    <Router>
      <CommunicationIQWrapper mode="standalone" tenantConfig={tenantConfig}>
        <Routes>
          {/* Main communication interface */}
          <Route path="/" element={<EnhancedBookingFlow />} />
          
          {/* Alternative booking interfaces */}
          <Route path="/book" element={<BookingInterface />} />
          
          {/* Success/confirmation pages */}
          <Route path="/confirmation/:appointmentId" element={
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                ✅ Communication Confirmed!
              </h2>
              <p className="text-gray-600">
                You'll receive a confirmation message shortly.
              </p>
            </div>
          } />
          
          {/* Error/fallback */}
          <Route path="*" element={
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
              <a href="/" className="text-blue-600 hover:underline">
                Return to Communication Hub
              </a>
            </div>
          } />
        </Routes>
      </CommunicationIQWrapper>
    </Router>
  );
};