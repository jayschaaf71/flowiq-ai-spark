
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PatientPrepDashboard } from '@/components/provider/PatientPrepDashboard';

export const PatientPrepPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  if (!appointmentId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">No appointment ID provided</p>
          <Button onClick={() => navigate('/provider-mobile')}>
            Go Back to Provider Portal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/provider-mobile')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Provider Portal
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-xl font-semibold">Patient Preparation</h1>
        </div>

        {/* Patient Prep Dashboard */}
        <PatientPrepDashboard appointmentId={appointmentId} />
      </div>
    </div>
  );
};
