
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Smartphone,
  Wifi,
  WifiOff,
  Save
} from 'lucide-react';
import { ConditionalFormField } from './ConditionalFormField';
import { FileUploadField } from './FileUploadField';
import { DigitalSignatureField } from './DigitalSignatureField';

interface MobileOptimizedFormProps {
  form: any;
  onSubmit: (data: any) => void;
}

export const MobileOptimizedForm: React.FC<MobileOptimizedFormProps> = ({ 
  form, 
  onSubmit 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
    if (autoSaveEnabled && Object.keys(formData).length > 0) {
      const timer = setTimeout(() => {
        saveToLocalStorage();
      }, 2000); // Save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [formData, autoSaveEnabled]);

  // Load saved data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(`intake_form_${form.id}`, JSON.stringify({
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      }));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(`intake_form_${form.id}`);
      if (saved) {
        const { formData: savedData, currentStep: savedStep } = JSON.parse(saved);
        setFormData(savedData);
        setCurrentStep(savedStep);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  };

  const handleFieldChange = (value: any) => {
    setFormData(prev => ({
      ...prev,
      [currentField.id]: value
    }));
  };

  const handleNext = () => {
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
            {renderField()}
          </CardContent>
        </Card>

        {/* Offline Notice */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">
                  You're offline. Your progress is being saved locally and will sync when you reconnect.
                </span>
              </div>
            </CardContent>
          </Card>
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
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        
        <div className="text-center mt-2">
          <button
            onClick={saveToLocalStorage}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Manual Save
          </button>
        </div>
      </div>
    </div>
  );
};
