
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle,
  Clock,
  User,
  FileText,
  CreditCard,
  Camera,
  Shield,
  Heart,
  Phone,
  Mail,
  Calendar,
  Smartphone
} from 'lucide-react';

interface IntakeStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
  completed: boolean;
  estimatedTime: string;
}

export const CompleteIntakeFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const intakeSteps: IntakeStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic details and contact information',
      icon: User,
      required: true,
      completed: false,
      estimatedTime: '2 min'
    },
    {
      id: 'medical-history',
      title: 'Medical History',
      description: 'Previous conditions, surgeries, and medications',
      icon: Heart,
      required: true,
      completed: false,
      estimatedTime: '5 min'
    },
    {
      id: 'insurance',
      title: 'Insurance Information',
      description: 'Upload insurance cards and verify coverage',
      icon: CreditCard,
      required: true,
      completed: false,
      estimatedTime: '3 min'
    },
    {
      id: 'symptoms',
      title: 'Current Symptoms',
      description: 'Describe your reason for today\'s visit',
      icon: FileText,
      required: true,
      completed: false,
      estimatedTime: '3 min'
    },
    {
      id: 'emergency-contact',
      title: 'Emergency Contact',
      description: 'Someone we can contact in case of emergency',
      icon: Phone,
      required: true,
      completed: false,
      estimatedTime: '2 min'
    },
    {
      id: 'consent',
      title: 'Consent & Agreements',
      description: 'Review and sign required forms',
      icon: Shield,
      required: true,
      completed: false,
      estimatedTime: '3 min'
    },
    {
      id: 'photo-id',
      title: 'Photo ID Verification',
      description: 'Take a photo of your ID for verification',
      icon: Camera,
      required: true,
      completed: false,
      estimatedTime: '1 min'
    },
    {
      id: 'appointment-prep',
      title: 'Appointment Preparation',
      description: 'Final instructions and check-in confirmation',
      icon: Calendar,
      required: true,
      completed: false,
      estimatedTime: '2 min'
    }
  ];

  const totalSteps = intakeSteps.length;
  const completedCount = completedSteps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;
  const totalEstimatedTime = intakeSteps.reduce((acc, step) => {
    const minutes = parseInt(step.estimatedTime);
    return acc + minutes;
  }, 0);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    // Move to next step
    const nextIncompleteStep = intakeSteps.findIndex(
      step => !completedSteps.includes(step.id) && step.id !== stepId
    );
    
    if (nextIncompleteStep !== -1) {
      setCurrentStep(nextIncompleteStep);
    }
  };

  const currentStepData = intakeSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <h1 className="font-semibold text-lg">Complete Your Intake</h1>
          </div>
          <Badge variant="outline">
            {completedCount} of {totalSteps}
          </Badge>
        </div>
        
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.round(progressPercentage)}% complete</span>
            <span>~{totalEstimatedTime - (completedCount * 2)} min remaining</span>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {completedCount === 0 && (
        <div className="p-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Smartphone className="w-4 h-4" />
            <AlertDescription className="text-blue-800">
              Complete your intake before your appointment to save time at the clinic. 
              Your information is secure and HIPAA compliant.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Step Overview */}
      <div className="p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentStepData.icon className="w-5 h-5 text-blue-600" />
              {currentStepData.title}
            </CardTitle>
            <CardDescription>
              {currentStepData.description} • {currentStepData.estimatedTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent(currentStepData.id)}
            
            <div className="mt-6">
              <Button 
                onClick={() => handleStepComplete(currentStepData.id)}
                className="w-full"
              >
                {completedCount === totalSteps - 1 ? 'Complete Intake' : 'Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intakeSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = index === currentStep;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isCurrent ? 'border-blue-200 bg-blue-50' : 
                      isCompleted ? 'border-green-200 bg-green-50' : 
                      'border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${isCurrent ? 'text-blue-900' : ''}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">{step.estimatedTime}</p>
                    </div>
                    
                    {step.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Status */}
      {completedCount === totalSteps && (
        <div className="p-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Intake Complete!
              </h3>
              <p className="text-green-800 mb-4">
                You're all set for your appointment. No additional paperwork needed at the clinic.
              </p>
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                View Appointment Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  function renderStepContent(stepId: string) {
    switch (stepId) {
      case 'personal':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="date"
              placeholder="Date of Birth"
              className="w-full p-3 border rounded-lg"
            />
          </div>
        );
      
      case 'medical-history':
        return (
          <div className="space-y-4">
            <textarea
              placeholder="List any current medications..."
              className="w-full p-3 border rounded-lg h-24"
            />
            <textarea
              placeholder="Known allergies..."
              className="w-full p-3 border rounded-lg h-24"
            />
            <textarea
              placeholder="Previous surgeries or major medical conditions..."
              className="w-full p-3 border rounded-lg h-24"
            />
          </div>
        );
      
      case 'symptoms':
        return (
          <div className="space-y-4">
            <textarea
              placeholder="Briefly describe your symptoms or reason for today's visit..."
              className="w-full p-3 border rounded-lg h-32"
            />
            <div>
              <label className="block text-sm font-medium mb-2">Pain Level (0-10)</label>
              <input
                type="range"
                min="0"
                max="10"
                className="w-full"
              />
            </div>
          </div>
        );
      
      case 'insurance':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Take a photo of your insurance card</p>
              <Button variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Upload Front
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Back of insurance card</p>
              <Button variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Upload Back
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Step content will be loaded here</p>
          </div>
        );
    }
  }
};
