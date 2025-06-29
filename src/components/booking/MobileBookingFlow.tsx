
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CreditCard,
  FileText,
  Camera
} from 'lucide-react';

interface BookingStep {
  id: string;
  title: string;
  completed: boolean;
}

export const MobileBookingFlow: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const steps: BookingStep[] = [
    { id: 'service', title: 'Select Service', completed: false },
    { id: 'provider', title: 'Choose Provider', completed: false },
    { id: 'datetime', title: 'Date & Time', completed: false },
    { id: 'details', title: 'Your Details', completed: false },
    { id: 'insurance', title: 'Insurance', completed: false },
    { id: 'confirmation', title: 'Confirmation', completed: false }
  ];

  const services = [
    { id: '1', name: 'Annual Physical', duration: '60 min', price: '$150' },
    { id: '2', name: 'Follow-up Visit', duration: '30 min', price: '$100' },
    { id: '3', name: 'Urgent Care', duration: '45 min', price: '$125' },
    { id: '4', name: 'Telehealth Consultation', duration: '30 min', price: '$75' }
  ];

  const providers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Family Medicine',
      rating: 4.9,
      nextAvailable: 'Today 2:00 PM',
      image: '/api/placeholder/100/100'
    },
    {
      id: '2',
      name: 'Dr. Mike Chen',
      specialty: 'Internal Medicine',
      rating: 4.8,
      nextAvailable: 'Tomorrow 9:00 AM',
      image: '/api/placeholder/100/100'
    }
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Service Selection
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">What type of appointment do you need?</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <Card key={service.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">{service.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Provider Selection
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose your provider</h3>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <Card
                    key={provider.id}
                    className={`cursor-pointer transition-colors ${
                      selectedProvider === provider.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-gray-600">{provider.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm ml-1">{provider.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {provider.nextAvailable}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Date & Time Selection
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select date and time</h3>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Choose a date</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <Button
                        key={i}
                        variant={selectedDate === dateStr ? 'default' : 'outline'}
                        className="h-16 flex-col"
                        onClick={() => setSelectedDate(dateStr)}
                      >
                        <span className="text-xs">{date.toLocaleDateString('en', { weekday: 'short' })}</span>
                        <span className="font-semibold">{date.getDate()}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h4 className="font-medium mb-3">Available times</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Patient Details
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Your information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-3 border rounded-lg"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Brief description of your concern..."
                />
              </div>
            </div>
          </div>
        );

      case 4: // Insurance
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Insurance Provider</label>
                <select className="w-full p-3 border rounded-lg">
                  <option>Select your insurance</option>
                  <option>Blue Cross Blue Shield</option>
                  <option>Aetna</option>
                  <option>Cigna</option>
                  <option>UnitedHealthcare</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Member ID</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your member ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Group Number</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter group number (if applicable)"
                />
              </div>
              
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  You can also take a photo of your insurance card for faster processing
                </AlertDescription>
              </Alert>
              
              <Button variant="outline" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Take Photo of Insurance Card
              </Button>
            </div>
          </div>
        );

      case 5: // Confirmation
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Appointment Confirmed!</h3>
              <p className="text-gray-600">Your appointment has been successfully scheduled</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{selectedDate}</p>
                    <p className="text-sm text-gray-600">{selectedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Family Medicine</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Main Clinic</p>
                    <p className="text-sm text-gray-600">123 Medical Center Dr</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Clinic
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold">Book Appointment</h1>
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="mt-3" />
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={currentStep === 5}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
