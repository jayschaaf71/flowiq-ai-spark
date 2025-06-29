
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Calendar, 
  FileText, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Clock
} from 'lucide-react';
import { PatientOnboardingWorkflow } from '../intake/PatientOnboardingWorkflow';
import { useIsMobile } from '@/hooks/use-mobile';

interface StreamlinedPatientOnboardingProps {
  onComplete: (patientId: string) => void;
  onCancel: () => void;
}

export const StreamlinedPatientOnboarding: React.FC<StreamlinedPatientOnboardingProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [patientId, setPatientId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const phases = [
    {
      id: 'intake',
      title: 'Personal Information',
      description: 'Complete your patient intake forms',
      icon: User,
      estimatedTime: '5-8 min'
    },
    {
      id: 'appointment',
      title: 'Schedule Appointment',
      description: 'Book your first appointment',
      icon: Calendar,
      estimatedTime: '2-3 min'
    },
    {
      id: 'documents',
      title: 'Upload Documents',
      description: 'Share insurance cards and medical records',
      icon: FileText,
      estimatedTime: '3-5 min'
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your onboarding is complete',
      icon: CheckCircle,
      estimatedTime: 'Done'
    }
  ];

  const currentPhaseData = phases[currentPhase];
  const progressPercentage = ((currentPhase + 1) / phases.length) * 100;
  const totalEstimatedTime = '10-16 minutes';

  const handlePhaseComplete = (phaseId: string, data?: any) => {
    console.log(`Phase ${phaseId} completed with data:`, data);
    
    if (phaseId === 'intake' && data) {
      setPatientId(data);
    }
    
    setCompletedPhases(prev => new Set([...prev, currentPhase]));
    
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      toast({
        title: "Step Completed!",
        description: `${currentPhaseData.title} completed successfully.`,
      });
    } else {
      // All phases complete
      onComplete(patientId || 'unknown');
    }
  };

  const handlePreviousPhase = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const renderPhaseContent = () => {
    switch (phases[currentPhase].id) {
      case 'intake':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Welcome to FlowIQ!</h3>
              <p className="text-gray-600">
                Let's get you set up with your patient information. This usually takes about 5-8 minutes.
              </p>
            </div>
            <PatientOnboardingWorkflow
              onComplete={(patientId) => handlePhaseComplete('intake', patientId)}
              onCancel={onCancel}
            />
          </div>
        );

      case 'appointment':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Schedule Your First Appointment</h3>
              <p className="text-gray-600">
                Now let's get you scheduled with one of our providers.
              </p>
            </div>
            
            <Card className="p-6">
              <div className="text-center">
                <p className="mb-4">Great! Your patient information is complete.</p>
                <p className="text-sm text-gray-600 mb-6">
                  Patient ID: {patientId}
                </p>
                <Button 
                  onClick={() => handlePhaseComplete('appointment')}
                  className="w-full"
                >
                  Continue to Appointment Booking
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-gray-600">
                Upload your insurance cards and any relevant medical records.
              </p>
            </div>
            
            <Card className="p-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="w-8 h-8 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Document upload functionality coming soon</p>
                  <p className="text-sm text-gray-500">For now, you can bring your documents to your appointment</p>
                </div>
                
                <Button 
                  onClick={() => handlePhaseComplete('documents')}
                  className="w-full"
                >
                  Skip for Now - Complete Later
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-green-600">All Set!</h3>
              <p className="text-gray-600">
                Your onboarding is complete. Welcome to FlowIQ!
              </p>
            </div>
            
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Patient information completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Account setup finished</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Ready for your first appointment</span>
                </div>
              </div>
            </Card>
            
            <Button 
              onClick={() => onComplete(patientId || 'completed')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Mobile-optimized header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isMobile && <Smartphone className="w-5 h-5 text-blue-600" />}
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              Patient Onboarding
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{totalEstimatedTime}</span>
          </div>
        </div>
        
        {/* Enhanced progress indicator */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Step {currentPhase + 1} of {phases.length}
            </span>
            <Badge variant="outline" className="text-xs">
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="text-center">
            <h2 className="font-semibold text-lg text-gray-900">
              {currentPhaseData.title}
            </h2>
            <p className="text-sm text-gray-600">
              {currentPhaseData.description}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                Est. {currentPhaseData.estimatedTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase indicators - Mobile optimized */}
      {!isMobile && (
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isCompleted = completedPhases.has(index);
              const isCurrent = index === currentPhase;
              
              return (
                <div key={phase.id} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${isCurrent ? 'border-blue-500 bg-blue-50' : 
                      isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}
                  `}>
                    <Icon className={`w-5 h-5 ${
                      isCurrent ? 'text-blue-600' : 
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  {index < phases.length - 1 && (
                    <div className={`w-12 h-0.5 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile phase indicators */}
      {isMobile && (
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentPhase
                    ? 'bg-blue-600'
                    : index < currentPhase || completedPhases.has(index)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-2xl mx-auto">
        {currentPhase === 0 ? (
          // For the intake phase, render the component directly without a card wrapper
          renderPhaseContent()
        ) : (
          <Card>
            <CardContent className="p-6">
              {renderPhaseContent()}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation - only show for non-intake phases */}
      {currentPhase > 0 && currentPhase < phases.length - 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePreviousPhase}
              disabled={currentPhase === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={onCancel} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Offline notice for mobile */}
      {isMobile && !navigator.onLine && (
        <Alert className="fixed bottom-20 left-4 right-4 border-orange-200 bg-orange-50">
          <AlertDescription className="text-orange-800">
            You're offline. Your progress is being saved locally.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
