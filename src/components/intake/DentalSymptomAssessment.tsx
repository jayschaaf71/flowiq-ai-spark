
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { SymptomAssessmentData, OnCompleteCallback } from '@/types/callbacks';

interface DentalSymptomAssessmentProps {
  onComplete: OnCompleteCallback<SymptomAssessmentData>;
  onSkip?: () => void;
}

export const DentalSymptomAssessment: React.FC<DentalSymptomAssessmentProps> = ({
  onComplete,
  onSkip
}) => {
  const [formData, setFormData] = useState({
    primaryComplaint: '',
    painLocation: [],
    painLevel: 5,
    painType: '',
    sensitivity: [],
    lastDentalVisit: '',
    currentMedications: '',
    dentalHistory: '',
    symptoms: [],
    eatingDifficulty: '',
    cosmeticConcerns: ''
  });

  const toothLocations = [
    'Upper Front Teeth', 'Upper Back Teeth (Left)', 'Upper Back Teeth (Right)',
    'Lower Front Teeth', 'Lower Back Teeth (Left)', 'Lower Back Teeth (Right)',
    'Gums', 'Jaw Joint', 'Tongue', 'Roof of Mouth'
  ];

  const painTypes = [
    'Sharp/Stabbing', 'Dull/Aching', 'Throbbing', 'Shooting',
    'Pressure', 'Burning', 'Tingling'
  ];

  const sensitivityTriggers = [
    'Hot Foods/Drinks', 'Cold Foods/Drinks', 'Sweet Foods',
    'Chewing', 'Brushing', 'Air', 'Touch'
  ];

  const dentalSymptoms = [
    'Bleeding Gums', 'Swollen Gums', 'Bad Breath', 'Dry Mouth',
    'Clicking Jaw', 'Grinding Teeth', 'Loose Teeth', 'Mouth Sores'
  ];

  const handleLocationChange = (location: string) => {
    setFormData(prev => ({
      ...prev,
      painLocation: prev.painLocation.includes(location)
        ? prev.painLocation.filter(l => l !== location)
        : [...prev.painLocation, location]
    }));
  };

  const handleSensitivityChange = (trigger: string) => {
    setFormData(prev => ({
      ...prev,
      sensitivity: prev.sensitivity.includes(trigger)
        ? prev.sensitivity.filter(s => s !== trigger)
        : [...prev.sensitivity, trigger]
    }));
  };

  const handleSymptomChange = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = () => {
    const symptomData: SymptomAssessmentData = {
      symptoms: [formData.primaryComplaint, ...formData.symptoms],
      severity: formData.painLevel,
      duration: formData.lastDentalVisit,
      location: formData.painLocation.join(', '),
      additionalNotes: formData.dentalHistory,
      ...formData // Include all form data
    };
    onComplete(symptomData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Dental Health Assessment</h3>
        <p className="text-gray-600">Help us understand your dental concerns before your visit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Primary Concern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            placeholder="Please describe your main dental concern..."
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
            Location of Discomfort
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {toothLocations.map((location) => (
              <button
                key={location}
                onClick={() => handleLocationChange(location)}
                className={`p-2 text-sm border rounded-lg transition-colors ${
                  formData.painLocation.includes(location)
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'border-gray-200 hover:border-blue-300'
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type of Pain/Discomfort</label>
            <div className="grid grid-cols-2 gap-2">
              {painTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData(prev => ({...prev, painType: type}))}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    formData.painType === type
                      ? 'bg-blue-100 border-blue-500 text-blue-800'
                      : 'border-gray-200 hover:border-blue-300'
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
          <CardTitle>Sensitivity</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">What triggers sensitivity?</label>
            <div className="grid grid-cols-2 gap-2">
              {sensitivityTriggers.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => handleSensitivityChange(trigger)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    formData.sensitivity.includes(trigger)
                      ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {dentalSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSymptomChange(symptom)}
                className={`p-2 text-sm border rounded-lg transition-colors ${
                  formData.symptoms.includes(symptom)
                    ? 'bg-red-100 border-red-500 text-red-800'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Dental History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Last dental visit:</label>
            <input
              type="date"
              value={formData.lastDentalVisit}
              onChange={(e) => setFormData(prev => ({...prev, lastDentalVisit: e.target.value}))}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Difficulty eating or chewing?</label>
            <textarea
              placeholder="Describe any eating difficulties..."
              value={formData.eatingDifficulty}
              onChange={(e) => setFormData(prev => ({...prev, eatingDifficulty: e.target.value}))}
              className="w-full p-3 border rounded-lg h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Any cosmetic concerns?</label>
            <textarea
              placeholder="Describe any cosmetic concerns with your smile..."
              value={formData.cosmeticConcerns}
              onChange={(e) => setFormData(prev => ({...prev, cosmeticConcerns: e.target.value}))}
              className="w-full p-3 border rounded-lg h-20"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {onSkip && (
          <Button variant="outline" onClick={onSkip} className="flex-1">
            Skip for Now
          </Button>
        )}
        <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
          Complete Assessment
        </Button>
      </div>
    </div>
  );
};
