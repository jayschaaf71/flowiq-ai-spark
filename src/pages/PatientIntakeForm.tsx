import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicFormViewer } from '@/components/intake/PublicFormViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PatientIntakeForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();

  if (!formId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h1>
          <p className="text-gray-600">The requested form could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.close()}
            className="flex items-center gap-2 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Close Preview
          </Button>
        </div>
        
        <PublicFormViewer
          formId={formId}
          className="shadow-lg"
        />
      </div>
    </div>
  );
};

export default PatientIntakeForm;