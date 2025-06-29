
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, MapPin } from 'lucide-react';

interface EmbeddableBookingWidgetProps {
  practiceId?: string;
  theme?: 'light' | 'dark';
  compact?: boolean;
}

export const EmbeddableBookingWidget: React.FC<EmbeddableBookingWidgetProps> = ({
  practiceId,
  theme = 'light',
  compact = false
}) => {
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    patientInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      isNewPatient: true
    }
  });

  const appointmentTypes = [
    { value: 'new-patient', label: 'New Patient Consultation', duration: '60 min' },
    { value: 'follow-up', label: 'Follow-up Visit', duration: '30 min' },
    { value: 'urgent-care', label: 'Urgent Care', duration: '45 min' },
    { value: 'wellness', label: 'Wellness Check', duration: '30 min' }
  ];

  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleBookAppointment = () => {
    // Redirect to the complete intake flow with pre-filled data
    const queryParams = new URLSearchParams({
      type: bookingData.appointmentType,
      date: bookingData.preferredDate,
      time: bookingData.preferredTime,
      firstName: bookingData.patientInfo.firstName,
      lastName: bookingData.patientInfo.lastName,
      phone: bookingData.patientInfo.phone,
      email: bookingData.patientInfo.email,
      source: 'widget'
    });
    
    window.open(`/complete-intake?${queryParams.toString()}`, '_blank');
  };

  if (compact && !showBookingFlow) {
    return (
      <div className={`inline-block ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-4 border`}>
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold">Book Appointment</h3>
            <p className="text-sm text-gray-600">Get started in minutes</p>
          </div>
          <Button 
            onClick={() => setShowBookingFlow(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Book Now
          </Button>
        </div>
      </div>
    );
  }

  if (!showBookingFlow) {
    return (
      <Card className={`max-w-md mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`} style={{
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Book Your Appointment</CardTitle>
          <p className="text-gray-600">Quick and easy online booking</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Same Day Appointments</p>
              <p className="text-sm text-green-600">Available today</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">New Patient Welcome</p>
              <p className="text-sm text-blue-600">Complete intake online</p>
            </div>
          </div>

          <Button 
            onClick={() => setShowBookingFlow(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Start Booking Process
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Secure • HIPAA Compliant • No Account Required
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`max-w-lg mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Book Appointment - Step {step} of 3</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowBookingFlow(false)}
          >
            ×
          </Button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Select Appointment Type</h3>
            {appointmentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setBookingData(prev => ({...prev, appointmentType: type.value}))}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  bookingData.appointmentType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-gray-600">{type.duration}</p>
                  </div>
                  {bookingData.appointmentType === type.value && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </div>
              </button>
            ))}
            <Button 
              onClick={() => setStep(2)}
              disabled={!bookingData.appointmentType}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Select Date & Time</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Date</label>
              <input
                type="date"
                value={bookingData.preferredDate}
                onChange={(e) => setBookingData(prev => ({...prev, preferredDate: e.target.value}))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Time</label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setBookingData(prev => ({...prev, preferredTime: time}))}
                    className={`p-2 text-sm border rounded-lg transition-colors ${
                      bookingData.preferredTime === time
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!bookingData.preferredDate || !bookingData.preferredTime}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Your Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={bookingData.patientInfo.firstName}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    patientInfo: {...prev.patientInfo, firstName: e.target.value}
                  }))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={bookingData.patientInfo.lastName}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    patientInfo: {...prev.patientInfo, lastName: e.target.value}
                  }))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={bookingData.patientInfo.phone}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  patientInfo: {...prev.patientInfo, phone: e.target.value}
                }))}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={bookingData.patientInfo.email}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  patientInfo: {...prev.patientInfo, email: e.target.value}
                }))}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleBookAppointment}
                disabled={!bookingData.patientInfo.firstName || !bookingData.patientInfo.lastName || 
                         !bookingData.patientInfo.phone || !bookingData.patientInfo.email}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete Booking
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
