
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle,
  Clock,
  User,
  FileText,
  CreditCard,
  Camera,
  MapPin,
  Phone,
  AlertCircle,
  Smartphone
} from 'lucide-react';

export const MobileCheckIn: React.FC = () => {
  const [checkInStep, setCheckInStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const checkInSteps = [
    { title: 'Verify Identity', icon: User, required: true },
    { title: 'Update Information', icon: FileText, required: true },
    { title: 'Insurance Card', icon: CreditCard, required: true },
    { title: 'Forms & Consent', icon: FileText, required: true },
    { title: 'Payment', icon: CreditCard, required: false },
    { title: 'Complete Check-in', icon: CheckCircle, required: true }
  ];

  const appointment = {
    date: 'Today',
    time: '2:00 PM',
    provider: 'Dr. Sarah Johnson',
    type: 'Follow-up Visit',
    location: 'Main Clinic - Room 205'
  };

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < checkInSteps.length - 1) {
      setCheckInStep(stepIndex + 1);
    }
  };

  const renderStepContent = () => {
    switch (checkInStep) {
      case 0: // Verify Identity
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verify Your Identity</h3>
              <p className="text-gray-600">Please confirm your information to proceed</p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    defaultValue="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-lg"
                    defaultValue="1990-01-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-lg"
                    defaultValue="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => handleStepComplete(0)}
              className="w-full"
            >
              Verify Identity
            </Button>
          </div>
        );

      case 1: // Update Information
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Update Your Information</h3>
              <p className="text-gray-600">Please review and update your contact information</p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    defaultValue="123 Main St, City, ST 12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Emergency contact name and phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Language</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Other</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => handleStepComplete(1)}
              className="w-full"
            >
              Update Information
            </Button>
          </div>
        );

      case 2: // Insurance Card
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Insurance Verification</h3>
              <p className="text-gray-600">Take a photo of your insurance card</p>
            </div>

            <div className="space-y-4">
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Please take clear photos of both sides of your insurance card
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="p-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Front of Insurance Card</p>
                    <Button variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Back of Insurance Card</p>
                    <Button variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => handleStepComplete(2)}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      case 3: // Forms & Consent
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Forms & Consent</h3>
              <p className="text-gray-600">Please review and sign required forms</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacy Policy (HIPAA)</h4>
                      <p className="text-sm text-gray-600">Required signature</p>
                    </div>
                    <Button size="sm" variant="outline">Review & Sign</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Treatment Consent</h4>
                      <p className="text-sm text-gray-600">Required signature</p>
                    </div>
                    <Button size="sm" variant="outline">Review & Sign</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Payment Authorization</h4>
                      <p className="text-sm text-gray-600">Optional</p>
                    </div>
                    <Button size="sm" variant="outline">Review & Sign</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => handleStepComplete(3)}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      case 4: // Payment
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Payment</h3>
              <p className="text-gray-600">Pay your copay or outstanding balance</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Copay</span>
                  <span className="font-semibold">$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding Balance</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Due</span>
                  <span>$25.00</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Pay with Card
              </Button>
              <Button variant="outline" className="w-full">
                <Smartphone className="w-4 h-4 mr-2" />
                Pay with Mobile Wallet
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleStepComplete(4)}>
                Pay at Front Desk
              </Button>
            </div>
          </div>
        );

      case 5: // Complete
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Check-in Complete!</h3>
              <p className="text-gray-600">You're all set for your appointment</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{appointment.date} at {appointment.time}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <p className="font-medium">{appointment.provider}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <p className="font-medium">{appointment.location}</p>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please have a seat in the waiting area. You'll be called when it's time for your appointment.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call if You Need Help
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (completedSteps.length / checkInSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Check-in</h1>
            <p className="text-sm text-gray-600">
              Step {checkInStep + 1} of {checkInSteps.length}
            </p>
          </div>
          <Badge variant="outline">
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="mt-3" />
      </div>

      {/* Step Indicators */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex justify-between">
          {checkInSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === checkInStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs text-center ${
                  isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.title.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {renderStepContent()}
      </div>
    </div>
  );
};
