import React, { useEffect, useState } from 'react';
import { EmbeddableBookingWidget } from '@/components/booking/EmbeddableBookingWidget';

export const BookingWidgetPage = () => {
  const [widgetConfig, setWidgetConfig] = useState({
    practiceId: '',
    providerId: '',
    locationId: '',
    themeColor: '#3B82F6',
    showFollowups: true
  });

  useEffect(() => {
    // Parse query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    
    setWidgetConfig({
      practiceId: urlParams.get('practice_id') || 'demo-practice',
      providerId: urlParams.get('provider_id') || '',
      locationId: urlParams.get('location_id') || '',
      themeColor: urlParams.get('theme_color') ? `#${urlParams.get('theme_color')}` : '#3B82F6',
      showFollowups: urlParams.get('show_followups') !== 'false'
    });

    // Send message to parent window when widget loads
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'widget_loaded',
        config: widgetConfig
      }, '*');
    }
  }, []);

  const handleBookingComplete = (appointmentData: any) => {
    // Send message to parent window when booking is complete
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'appointment_booked',
        appointment: appointmentData
      }, '*');
    }
  };

  const handleBookingCancelled = () => {
    // Send message to parent window when booking is cancelled
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'booking_cancelled'
      }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <EmbeddableBookingWidget
        practiceId={widgetConfig.practiceId}
        theme="light"
        compact={false}
      />
    </div>
  );
};

export default BookingWidgetPage;