
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  MapPin,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ChiropracticSymptomAssessmentProps {
  onComplete: (data: any) => void;
  onSkip?: () => void;
}

export const ChiropracticSymptomAssessment: React.FC<ChiropracticSymptomAssessmentProps> = ({
  onComplete,
  onSkip
}) => {
  const [formData, setFormData] = useState({
    primaryComplaint: '',
    painLocation: [],
    painLevel: 5,
    painType: '',
    onsetDate: '',
    onsetCause: '',
    previousTreatment: '',
    currentMedications: '',
    painPattern: '',
    activityLimitations: [],
    workImpact: '',
    sleepImpact: '',
    previousChiropracticCare: ''
  });

  const painLocations = [
    'Neck', 'Upper Back', 'Mid Back', 'Lower Back', 
    'Left Shoulder', 'Right Shoulder', 'Left Arm', 'Right Arm',
    'Left Hip', 'Right Hip', 'Left Leg', 'Right Leg', 'Head'
  ];

  const painTypes = [
    'Sharp/Stabbing', 'Dull/Aching', 'Burning', 'Tingling/Numbness',
    'Throbbing', 'Shooting', 'Cramping', 'Stiffness'
  ];

  const activityLimitations = [
    'Walking', 'Sitting', 'Standing', 'Bending', 'Lifting',
    'Reaching', 'Driving', 'Exercise', 'Work Activities'
  ];

  const handleLocationChange = (location: string) => {
    setFormData(prev => ({
      ...prev,
      painLocation: prev.painLocation.includes(location)
        ? prev.painLocation.filter(l => l !== location)
        : [...prev.painLocation, location]
    }));
  };

  const handleActivityChange = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activityLimitations: prev.activityLimitations.includes(activity)
        ? prev.activityLimitations.filter(a => a !== activity)
        : [...prev.activityLimitations, activity]
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Current Symptom Assessment</h3>
        <p className="text-gray-600">Help us understand your condition before your visit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Primary Complaint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            placeholder="Please describe your main concern or pain..."
            value={formData.primaryComplaint}
            onChange={(e) => setFormData(prev => ({...prev, primaryComplaint: e.target.value}))}
            className="w-full p-3 border rounded-lg h-24"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Pain Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {painLocations.map((location) => (
              <button
                key={location}
                onClick={() => handleLocationChange(location)}
                className={`p-2 text-sm border rounded-lg transition-colors ${
                  formData.painLocation.includes(location)
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pain Level & Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Pain Level (0 = No Pain, 10 = Severe Pain): {formData.painLevel}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.painLevel}
              onChange={(e) => setFormData(prev => ({...prev, painLevel: parseInt(e.target.value)}))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No Pain</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type of Pain</label>
            <div className="grid grid-cols-2 gap-2">
              {painTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData(prev => ({...prev, painType: type}))}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    formData.painType === type
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Pain History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">When did this pain start?</label>
            <input
              type="date"
              value={formData.onsetDate}
              onChange={(e) => setFormData(prev => ({...prev, onsetDate: e.target.value}))}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">What caused this pain?</label>
            <textarea
              placeholder="e.g., lifting heavy object, car accident, gradual onset..."
              value={formData.onsetCause}
              onChange={(e) => setFormData(prev => ({...prev, onsetCause: e.target.value}))}
              className="w-full p-3 border rounded-lg h-20"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Activities that are difficult due to pain:</label>
            <div className="grid grid-cols-2 gap-2">
              {activityLimitations.map((activity) => (
                <button
                  key={activity}
                  onClick={() => handleActivityChange(activity)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    formData.activityLimitations.includes(activity)
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Impact on work/daily activities (1-10):</label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.workImpact}
              onChange={(e) => setFormData(prev => ({...prev, workImpact: e.target.value}))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              Level: {formData.workImpact}/10
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Impact on sleep (1-10):</label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.sleepImpact}
              onChange={(e) => setFormData(prev => ({...prev, sleepImpact: e.target.value}))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              Level: {formData.sleepImpact}/10
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {onSkip && (
          <Button variant="outline" onClick={onSkip} className="flex-1">
            Skip for Now
          </Button>
        )}
        <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
          Complete Assessment
        </Button>
      </div>
    </div>
  );
};
