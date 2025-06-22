
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  Smartphone,
  Wifi,
  WifiOff,
  Save,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ConditionalFormField } from './ConditionalFormField';
import { FileUploadField } from './FileUploadField';
import { DigitalSignatureField } from './DigitalSignatureField';

interface EnhancedMobileFormProps {
  form: any;
  onSubmit: (data: any) => void;
}

export const EnhancedMobileForm: React.FC<EnhancedMobileFormProps> = ({ 
  form, 
  onSubmit 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const fields = form.form_fields || [];
  const fieldsPerStep = 1; // One field per step for mobile
  const totalSteps = Math.ceil(fields.length / fieldsPerStep);
  const currentField = fields[currentStep];

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && Object.keys(formData).length > 0 && isOnline) {
      const timer = setTimeout(() => {
        saveToLocalStorage();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [formData, autoSaveEnabled, isOnline]);

  // Load saved data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const saveToLocalStorage = () => {
    try {
      const saveData = {
        formData,
        currentStep,
        completedSteps: Array.from(completedSteps),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`intake_form_${form.id}`, JSON.stringify(saveData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(`intake_form_${form.id}`);
      if (saved) {
        const { 
          formData: savedData, 
          currentStep: savedStep, 
          completedSteps: savedCompleted = [] 
        } = JSON.parse(saved);
        setFormData(savedData);
        setCurrentStep(savedStep);
        setCompletedSteps(new Set(savedCompleted));
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  };

  const validateField = (field: any, value: any) => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (field.type === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }
    
    return null;
  };

  const handleFieldChange = (value: any) => {
    const fieldId = currentField.id;
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleNext = () => {
    const error = validateField(currentField, formData[currentField.id]);
    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [currentField.id]: error
      }));
      return;
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate all required fields
    const errors: Record<string, string> = {};
    fields.forEach((field: any, index: number) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        errors[field.id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Go to first field with error
      const firstErrorIndex = fields.findIndex((field: any) => errors[field.id]);
      setCurrentStep(firstErrorIndex);
      return;
    }

    // Clear saved data on successful submission
    localStorage.removeItem(`intake_form_${form.id}`);
    onSubmit(formData);
  };

  const renderField = () => {
    if (!currentField) return null;

    const commonProps = {
      field: currentField,
      value: formData[currentField.id],
      formData,
      onChange: handleFieldChange,
      onBlur: () => {},
      showValidation: true
    };

    switch (currentField.type) {
      case 'file':
        return (
          <FileUploadField
            submissionId="temp-submission-id"
            onFileUploaded={(file) => handleFieldChange(file)}
            onFileRemoved={(fileId) => console.log('File removed:', fileId)}
          />
        );
      case 'signature':
        return <DigitalSignatureField {...commonProps} />;
      default:
        return <ConditionalFormField {...commonProps} />;
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  const isStepCompleted = completedSteps.has(currentStep);
  const hasError = validationErrors[currentField?.id];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <h1 className="font-semibold text-lg">{form.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <Badge variant="outline">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
        </div>
        
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.round(progressPercentage)}% complete</span>
            {lastSaved && (
              <span className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {isStepCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-gray-400" />
              )}
              <h2 className="font-medium text-lg">{currentField?.label}</h2>
            </div>
            
            {currentField?.description && (
              <p className="text-sm text-gray-600 mb-4">{currentField.description}</p>
            )}
            
            {renderField()}
            
            {hasError && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {hasError}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mb-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentStep
                  ? 'bg-blue-600'
                  : i < currentStep || completedSteps.has(i)
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <Alert className="border-orange-200 bg-orange-50">
            <WifiOff className="w-4 h-4" />
            <AlertDescription className="text-orange-800">
              You're offline. Your progress is being saved locally and will sync when you reconnect.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === totalSteps - 1 ? (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!isOnline}
            >
              Submit Form
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={!!hasError}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        
        <div className="flex justify-center mt-2 space-x-4">
          <button
            onClick={saveToLocalStorage}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Manual Save
          </button>
          <button
            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Auto-save: {autoSaveEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
};
