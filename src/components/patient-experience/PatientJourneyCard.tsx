import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePatientJourney } from '@/hooks/usePatientJourney';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export const PatientJourneyCard: React.FC = () => {
  const { journeyStatus, loading, getNextAction } = usePatientJourney();
  const navigate = useNavigate();
  const nextAction = getNextAction();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800">Your Healthcare Journey</span>
          </div>
          <Badge variant="outline" className="bg-white">
            {journeyStatus.progressPercentage}% Complete
          </Badge>
        </CardTitle>
        <Progress value={journeyStatus.progressPercentage} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              {nextAction.action === 'journey-complete' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{nextAction.title}</h3>
              <p className="text-sm text-gray-600">{nextAction.description}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 p-3 bg-white/60 rounded-lg">
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {journeyStatus.completedSubmissions.length}
              </div>
              <div className="text-xs text-gray-600">Forms</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {journeyStatus.upcomingAppointments.length}
              </div>
              <div className="text-xs text-gray-600">Appointments</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">
                {journeyStatus.recentCheckIns.length}
              </div>
              <div className="text-xs text-gray-600">Check-ins</div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => navigate('/patient-journey')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {nextAction.action === 'journey-complete' ? 'View Journey' : 'Continue Journey'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};