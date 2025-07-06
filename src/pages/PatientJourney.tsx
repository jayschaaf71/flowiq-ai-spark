import React from 'react';
import { PatientJourneyOrchestrator } from '@/components/patient-experience/PatientJourneyOrchestrator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientJourney: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/patient-dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-8 h-8 text-blue-600" />
                Your Healthcare Journey
              </h1>
              <p className="text-gray-600">
                Track your progress from registration to ongoing care
              </p>
            </div>
          </div>
        </div>

        {/* Journey Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Care Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We've designed a simple, step-by-step process to ensure you receive the best possible care. 
              Follow the steps below to complete your patient onboarding and get connected with your healthcare team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Complete required forms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Schedule your appointment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span>Receive ongoing care</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Journey Component */}
        <PatientJourneyOrchestrator />
      </div>
    </div>
  );
};

export default PatientJourney;