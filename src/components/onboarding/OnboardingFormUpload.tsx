import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Bot,
  Sparkles
} from 'lucide-react';
import { AIFormCreator } from '../intake/AIFormCreator';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { toast } from 'sonner';

interface OnboardingFormUploadProps {
  onFormsCreated?: () => void;
  onNext?: () => void;
}

export const OnboardingFormUpload: React.FC<OnboardingFormUploadProps> = ({ 
  onFormsCreated, 
  onNext 
}) => {
  const { forms } = useIntakeForms();

  const handleFormCreated = () => {
    toast.success('Form created successfully! You can now customize it further or create additional forms.');
    onFormsCreated?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Bot className="w-6 h-6" />
            Upload Your Current Forms
          </CardTitle>
          <CardDescription className="text-blue-600">
            Upload your existing intake forms and we'll automatically convert them into digital forms. 
            Supports PDF, Word documents, text files, and more.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Upload Your Forms?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 mb-1">AI-Powered Conversion</h3>
              <p className="text-sm text-green-600">
                Our AI instantly converts your paper forms into smart digital forms
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 mb-1">Maintains Structure</h3>
              <p className="text-sm text-blue-600">
                Preserves your form logic, required fields, and question flow
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800 mb-1">Multiple Formats</h3>
              <p className="text-sm text-purple-600">
                Supports PDF, Word, text files, and markdown documents
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Form Creator */}
      <AIFormCreator onFormCreated={handleFormCreated} />

      {/* Created Forms Summary */}
      {forms.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Forms Created ({forms.length})
            </CardTitle>
            <CardDescription className="text-green-600">
              Your uploaded forms have been successfully converted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {forms.slice(0, 4).map((form) => (
                <div key={form.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <FileText className="w-4 h-4 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{form.title}</p>
                    <p className="text-xs text-gray-600">
                      {Array.isArray(form.form_fields) ? form.form_fields.length : 0} fields
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
            
            {forms.length > 4 && (
              <p className="text-sm text-green-600 mt-3">
                And {forms.length - 4} more forms...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-6">
        <div className="text-sm text-gray-600">
          {forms.length === 0 ? (
            "Upload your forms to continue with onboarding"
          ) : (
            `${forms.length} form${forms.length !== 1 ? 's' : ''} ready to use`
          )}
        </div>
        
        {onNext && (
          <Button 
            onClick={onNext}
            disabled={forms.length === 0}
            className="flex items-center gap-2"
          >
            Continue Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Skip Option */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-500 mb-2">
          Don't have forms to upload right now?
        </p>
        {onNext && (
          <Button 
            variant="ghost" 
            onClick={onNext}
            className="text-gray-600 hover:text-gray-800"
          >
            Skip this step - I'll add forms later
          </Button>
        )}
      </div>
    </div>
  );
};