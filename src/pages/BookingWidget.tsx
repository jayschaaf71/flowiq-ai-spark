import React, { useEffect, useState } from 'react';
import { AppointmentBooking } from '@/components/appointments/AppointmentBooking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, Phone } from 'lucide-react';

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
    
    const config = {
      practiceId: urlParams.get('practice_id') || 'demo-practice',
      providerId: urlParams.get('provider_id') || '',
      locationId: urlParams.get('location_id') || '',
      themeColor: urlParams.get('theme_color') ? `#${urlParams.get('theme_color')}` : '#3B82F6',
      showFollowups: urlParams.get('show_followups') !== 'false'
    };
    
    setWidgetConfig(config);

    // Send message to parent window when widget loads
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'widget_loaded',
        config: config
      }, '*');
    }

    // Apply theme color to CSS variables
    document.documentElement.style.setProperty('--primary', config.themeColor);
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
      <div className="max-w-4xl mx-auto">
        {/* Widget Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Choose a convenient time for your visit</p>
          {widgetConfig.practiceId && (
            <Badge variant="outline" className="mt-2">
              Practice: {widgetConfig.practiceId}
            </Badge>
          )}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Same Day</p>
              <p className="text-xs text-gray-600">Available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Expert Care</p>
              <p className="text-xs text-gray-600">Certified Providers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Convenient</p>
              <p className="text-xs text-gray-600">Multiple Locations</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Widget */}
        <AppointmentBooking
          selectedProvider={widgetConfig.providerId}
          onSuccess={handleBookingComplete}
          onCancel={handleBookingCancelled}
        />

        {/* Widget Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by Appointment IQ</p>
        </div>
      </div>
    </div>
  );
};

export default BookingWidgetPage;