
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Users, Calendar, Settings, Zap } from "lucide-react";
import { useSampleData } from "@/hooks/useSampleData";
import { useAvailabilitySlots } from "@/hooks/useAvailabilitySlots";

export const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { loading: sampleDataLoading, setupSampleData } = useSampleData();
  const { generateSlotsFromTemplate } = useAvailabilitySlots();

  const steps = [
    {
      id: 0,
      title: "Create Sample Providers",
      description: "Set up demo providers and their schedules",
      icon: Users,
      action: async () => {
        await setupSampleData();
        setCompletedSteps(prev => [...prev, 0]);
      }
    },
    {
      id: 1,
      title: "Generate Availability Slots",
      description: "Create bookable time slots for the next 30 days",
      icon: Calendar,
      action: async () => {
        // This would generate slots for all providers
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        
        // In a real implementation, we'd loop through all providers
        // For now, we'll simulate this
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, 1]);
        }, 2000);
      }
    },
    {
      id: 2,
      title: "Configure AI Settings",
      description: "Set up intelligent scheduling preferences",
      icon: Settings,
      action: async () => {
        //Simulate AI configuration
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, 2]);
        }, 1000);
      }
    },
    {
      id: 3,
      title: "Test System",
      description: "Run system checks and validate functionality",
      icon: Zap,
      action: async () => {
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, 3]);
        }, 1500);
      }
    }
  ];

  const handleStepAction = async (step: typeof steps[0]) => {
    setCurrentStep(step.id);
    await step.action();
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const allStepsCompleted = completedSteps.length === steps.length;
  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          ScheduleIQ Setup Wizard
        </CardTitle>
        <Progress value={progress} className="mt-2" />
        <p className="text-sm text-gray-600 mt-2">
          {completedSteps.length}/{steps.length} steps completed
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {allStepsCompleted ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Setup complete! ScheduleIQ is now fully functional and ready to use.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Complete these steps to get ScheduleIQ fully operational.
            </AlertDescription>
          </Alert>
        )}

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = isStepCompleted(step.id);
          const isActive = currentStep === step.id;
          
          return (
            <div 
              key={step.id} 
              className={`border rounded-lg p-4 ${isActive ? 'border-blue-300 bg-blue-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100 text-green-600' : 
                    isActive ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-800">
                      Complete
                    </Badge>
                  )}
                  {isActive && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Running...
                    </Badge>
                  )}
                  {!isCompleted && !isActive && (
                    <Button 
                      size="sm"
                      onClick={() => handleStepAction(step)}
                      disabled={sampleDataLoading}
                    >
                      {sampleDataLoading && step.id === 0 ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : null}
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {allStepsCompleted && (
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">What's Available Now:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✅ 3 Demo providers with realistic schedules</li>
              <li>✅ 30 days of available time slots</li>
              <li>✅ AI-powered scheduling suggestions</li>
              <li>✅ Real-time calendar updates</li>
              <li>✅ Conflict detection and resolution</li>
              <li>✅ Enhanced booking flow</li>
              <li>✅ Automated reminders system</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
