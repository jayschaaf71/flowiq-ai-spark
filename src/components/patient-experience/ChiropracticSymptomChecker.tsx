import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Activity,
  Heart,
  CheckCircle,
  Star,
  Calendar,
  Send
} from 'lucide-react';

interface SymptomData {
  painAreas: string[];
  painLevel: number;
  painType: string[];
  painDuration: string;
  triggers: string[];
  symptoms: string[];
  activities: string[];
  previousTreatment: string;
  currentMedications: string;
  additionalInfo: string;
}

interface SymptomCheckerProps {
  onComplete?: (data: SymptomData) => void;
  onBack?: () => void;
}

export const ChiropracticSymptomChecker: React.FC<SymptomCheckerProps> = ({ 
  onComplete, 
  onBack 
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [symptomData, setSymptomData] = useState<SymptomData>({
    painAreas: [],
    painLevel: 0,
    painType: [],
    painDuration: '',
    triggers: [],
    symptoms: [],
    activities: [],
    previousTreatment: '',
    currentMedications: '',
    additionalInfo: ''
  });

  const steps = [
    { title: 'Pain Location', icon: MapPin },
    { title: 'Pain Level', icon: Activity },
    { title: 'Pain Type', icon: AlertCircle },
    { title: 'Duration', icon: Clock },
    { title: 'Triggers', icon: Star },
    { title: 'Symptoms', icon: Heart },
    { title: 'Activities', icon: CheckCircle },
    { title: 'History', icon: Calendar }
  ];

  const painAreas = [
    { id: 'neck', label: 'Neck', description: 'Cervical spine' },
    { id: 'upperback', label: 'Upper Back', description: 'Thoracic spine' },
    { id: 'lowerback', label: 'Lower Back', description: 'Lumbar spine' },
    { id: 'shoulders', label: 'Shoulders', description: 'Shoulder blades' },
    { id: 'arms', label: 'Arms', description: 'Including hands' },
    { id: 'legs', label: 'Legs', description: 'Including feet' },
    { id: 'hips', label: 'Hips', description: 'Hip joints' },
    { id: 'headaches', label: 'Headaches', description: 'Head and temples' }
  ];

  const painTypes = [
    { id: 'sharp', label: 'Sharp/Stabbing', icon: '⚡' },
    { id: 'dull', label: 'Dull Ache', icon: '🔄' },
    { id: 'burning', label: 'Burning', icon: '🔥' },
    { id: 'throbbing', label: 'Throbbing', icon: '💓' },
    { id: 'shooting', label: 'Shooting', icon: '➡️' },
    { id: 'tingling', label: 'Tingling/Numbness', icon: '⚡' }
  ];

  const painTriggers = [
    { id: 'sitting', label: 'Sitting' },
    { id: 'standing', label: 'Standing' },
    { id: 'walking', label: 'Walking' },
    { id: 'bending', label: 'Bending Forward' },
    { id: 'lifting', label: 'Lifting Objects' },
    { id: 'turning', label: 'Turning/Twisting' },
    { id: 'sleeping', label: 'Sleeping/Lying Down' },
    { id: 'coughing', label: 'Coughing/Sneezing' }
  ];

  const additionalSymptoms = [
    { id: 'stiffness', label: 'Stiffness' },
    { id: 'weakness', label: 'Muscle Weakness' },
    { id: 'spasms', label: 'Muscle Spasms' },
    { id: 'numbness', label: 'Numbness' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'dizziness', label: 'Dizziness' },
    { id: 'nausea', label: 'Nausea' },
    { id: 'sleeping', label: 'Sleep Disturbance' }
  ];

  const affectedActivities = [
    { id: 'work', label: 'Work/Desk Activities' },
    { id: 'exercise', label: 'Exercise/Sports' },
    { id: 'driving', label: 'Driving' },
    { id: 'household', label: 'Household Chores' },
    { id: 'recreation', label: 'Recreation/Hobbies' },
    { id: 'sleep', label: 'Sleep Quality' },
    { id: 'social', label: 'Social Activities' },
    { id: 'selfcare', label: 'Self Care' }
  ];

  const handleArrayToggle = (field: keyof SymptomData, value: string) => {
    setSymptomData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Symptom Assessment Complete",
      description: "Your information has been saved and will be reviewed before your appointment.",
    });
    onComplete?.(symptomData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Pain Location
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Where are you experiencing pain or discomfort?</h3>
              <p className="text-muted-foreground">Select all areas that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {painAreas.map(area => (
                <div
                  key={area.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    symptomData.painAreas.includes(area.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleArrayToggle('painAreas', area.id)}
                >
                  <div className="font-medium">{area.label}</div>
                  <div className="text-sm text-muted-foreground">{area.description}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Pain Level
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">What is your current pain level?</h3>
              <p className="text-muted-foreground">0 = No pain, 10 = Worst possible pain</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>No Pain</span>
                <span>Worst Pain</span>
              </div>
              <div className="flex justify-between">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <button
                    key={level}
                    className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${
                      symptomData.painLevel === level
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSymptomData(prev => ({ ...prev, painLevel: level }))}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{symptomData.painLevel}/10</div>
                <div className="text-sm text-muted-foreground">
                  {symptomData.painLevel === 0 && 'No pain'}
                  {symptomData.painLevel >= 1 && symptomData.painLevel <= 3 && 'Mild pain'}
                  {symptomData.painLevel >= 4 && symptomData.painLevel <= 6 && 'Moderate pain'}
                  {symptomData.painLevel >= 7 && symptomData.painLevel <= 10 && 'Severe pain'}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Pain Type
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">How would you describe your pain?</h3>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {painTypes.map(type => (
                <div
                  key={type.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    symptomData.painType.includes(type.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleArrayToggle('painType', type.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Duration
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">How long have you been experiencing this pain?</h3>
              <p className="text-muted-foreground">Select the timeframe</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'hours', label: 'Few hours', description: 'Started today' },
                { id: 'days', label: '1-7 days', description: 'Recent onset' },
                { id: 'weeks', label: '1-4 weeks', description: 'Several weeks' },
                { id: 'months', label: '1-6 months', description: 'Few months' },
                { id: 'chronic', label: '6+ months', description: 'Chronic condition' }
              ].map(duration => (
                <div
                  key={duration.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    symptomData.painDuration === duration.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSymptomData(prev => ({ ...prev, painDuration: duration.id }))}
                >
                  <div className="font-medium">{duration.label}</div>
                  <div className="text-sm text-muted-foreground">{duration.description}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4: // Triggers
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">What makes your pain worse?</h3>
              <p className="text-muted-foreground">Select all triggers that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {painTriggers.map(trigger => (
                <div
                  key={trigger.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    symptomData.triggers.includes(trigger.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleArrayToggle('triggers', trigger.id)}
                >
                  <div className="font-medium text-center">{trigger.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Additional Symptoms
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Are you experiencing any additional symptoms?</h3>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {additionalSymptoms.map(symptom => (
                <div
                  key={symptom.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    symptomData.symptoms.includes(symptom.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleArrayToggle('symptoms', symptom.id)}
                >
                  <div className="font-medium text-center">{symptom.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // Affected Activities
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Which activities are affected by your pain?</h3>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {affectedActivities.map(activity => (
                <div
                  key={activity.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    symptomData.activities.includes(activity.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleArrayToggle('activities', activity.id)}
                >
                  <div className="font-medium text-center">{activity.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 7: // History & Additional Info
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Additional Information</h3>
              <p className="text-muted-foreground">Help us understand your complete health picture</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Previous treatments for this condition:</label>
                <Textarea
                  value={symptomData.previousTreatment}
                  onChange={(e) => setSymptomData(prev => ({ ...prev, previousTreatment: e.target.value }))}
                  placeholder="Physical therapy, chiropractic care, massage, medications, etc."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current medications:</label>
                <Textarea
                  value={symptomData.currentMedications}
                  onChange={(e) => setSymptomData(prev => ({ ...prev, currentMedications: e.target.value }))}
                  placeholder="List any medications you're currently taking"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Anything else you'd like us to know:</label>
                <Textarea
                  value={symptomData.additionalInfo}
                  onChange={(e) => setSymptomData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Recent injuries, accidents, stress factors, work environment, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Pre-Appointment Symptom Checker</h2>
        <p className="text-muted-foreground">
          Help us prepare for your visit by sharing details about your symptoms
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center mt-2">
            <Badge variant="outline" className="text-xs">
              {steps[currentStep].title}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onBack : handlePrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {currentStep === 0 ? 'Back to Dashboard' : 'Previous'}
        </Button>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Send className="w-4 h-4" />
              Complete Assessment
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};