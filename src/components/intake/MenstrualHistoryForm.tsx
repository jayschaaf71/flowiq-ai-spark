
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Heart, Calendar, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenstrualHistoryData {
  personalInfo: {
    name: string;
    date: string;
    sport: string;
  };
  gynecologicalHistory: {
    visitedObGyn: string;
    lastPapSmear: string;
    firstPeriodDate: string;
    lastPeriod: string;
    irregularCycleDates: string;
  };
  menstrualPatterns: {
    periodFrequency: string;
    periodDuration: string;
    periodsLast12Months: string;
    longestWithoutPeriod: string;
    menstrualFlow: string;
    bleedingBetweenPeriods: string;
    painAndCramping: string;
  };
  painManagement: string[];
  exerciseImpact: {
    exerciseAffectsPeriods: string;
    exerciseEffectsDescription: string;
    consultedPractitioner: string;
    practitionerAdvice: string;
  };
  weightAndBody: {
    selfPerception: string;
    significantWeightChange: string;
    weightChangeDescription: string;
    pastYearWeight: string;
    pastYearActivity: string;
    activityChangeDescription: string;
  };
  healthHistory: {
    stressFractures: string;
    pastYearInjuries: string;
    dietInfluences: string;
    balancedDiet: string;
  };
  symptoms: {
    [key: string]: string;
  };
  medications: {
    prescriptions: string;
    vitamins: string;
    minerals: string;
    herbs: string;
  };
  additionalInfo: string;
}

export const MenstrualHistoryForm = () => {
  const [formData, setFormData] = useState<MenstrualHistoryData>({
    personalInfo: {
      name: '',
      date: '',
      sport: ''
    },
    gynecologicalHistory: {
      visitedObGyn: '',
      lastPapSmear: '',
      firstPeriodDate: '',
      lastPeriod: '',
      irregularCycleDates: ''
    },
    menstrualPatterns: {
      periodFrequency: '',
      periodDuration: '',
      periodsLast12Months: '',
      longestWithoutPeriod: '',
      menstrualFlow: '',
      bleedingBetweenPeriods: '',
      painAndCramping: ''
    },
    painManagement: [],
    exerciseImpact: {
      exerciseAffectsPeriods: '',
      exerciseEffectsDescription: '',
      consultedPractitioner: '',
      practitionerAdvice: ''
    },
    weightAndBody: {
      selfPerception: '',
      significantWeightChange: '',
      weightChangeDescription: '',
      pastYearWeight: '',
      pastYearActivity: '',
      activityChangeDescription: ''
    },
    healthHistory: {
      stressFractures: '',
      pastYearInjuries: '',
      dietInfluences: '',
      balancedDiet: ''
    },
    symptoms: {},
    medications: {
      prescriptions: '',
      vitamins: '',
      minerals: '',
      herbs: ''
    },
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof MenstrualHistoryData] as object,
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev.painManagement;
      if (checked) {
        return {
          ...prev,
          painManagement: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          painManagement: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const handleSymptomChange = (symptom: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Menstrual History Form Data:', formData);
      
      toast({
        title: "Form Submitted",
        description: "Your menstrual history questionnaire has been submitted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const symptomsList = [
    'Irregular menstrual periods',
    'Absent menstrual periods',
    'Cold intolerance',
    'Tingling sensation in hands or feet',
    'Headaches',
    'Lightheadedness/Dizziness',
    'Fainting',
    'Change in energy',
    'Change in urinary function/# of times urinating a day',
    'Sleeping difficulties',
    'Skin changes',
    'Hair loss',
    'Hair growth on face and/or chest',
    'Chest pains',
    'Rapid heart beat',
    'Shortness of breath',
    'Mood swings',
    'Episodes of crying for "no reason"',
    'Frequently thinking about food',
    'Confusion',
    'Difficulty concentrating',
    'Anxiety, especially around food',
    'Less social interaction with family',
    'Frequently tired',
    'Memory problems',
    'Difficulty making decisions',
    'Problems with teeth',
    'Sore throat',
    'Swollen parotid glands',
    'Taste changes',
    'Constipation',
    'Diarrhea',
    'Muscle pain',
    'Joint pain',
    'Obsessive-compulsive behaviors',
    'Feelings of depression'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-600" />
            <div>
              <CardTitle className="text-2xl text-pink-900">Menstrual History Questionnaire</CardTitle>
              <p className="text-pink-700">Comprehensive health assessment for women's wellness</p>
            </div>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg mt-4">
            <p className="text-pink-800 font-medium">
              To help complete your medical history, please complete the following information as accurately as possible. 
              Some of these questions deal with personal information. Please be assured that your answers will remain confidential.
            </p>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.personalInfo.name}
                  onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.personalInfo.date}
                  onChange={(e) => handleInputChange('personalInfo', 'date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sport">Sport/Activity</Label>
                <Input
                  id="sport"
                  value={formData.personalInfo.sport}
                  onChange={(e) => handleInputChange('personalInfo', 'sport', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gynecological History */}
        <Card>
          <CardHeader>
            <CardTitle>Gynecological History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>1. Have you been to an OB-GYN before?</Label>
              <RadioGroup
                value={formData.gynecologicalHistory.visitedObGyn}
                onValueChange={(value) => handleInputChange('gynecologicalHistory', 'visitedObGyn', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="obgyn-yes" />
                    <Label htmlFor="obgyn-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="obgyn-no" />
                    <Label htmlFor="obgyn-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
              {formData.gynecologicalHistory.visitedObGyn === 'yes' && (
                <div className="mt-2">
                  <Label htmlFor="lastPapSmear">Date of last pap smear</Label>
                  <Input
                    id="lastPapSmear"
                    type="date"
                    value={formData.gynecologicalHistory.lastPapSmear}
                    onChange={(e) => handleInputChange('gynecologicalHistory', 'lastPapSmear', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="firstPeriod">2. Approximate date/age of first menstrual period</Label>
              <Input
                id="firstPeriod"
                value={formData.gynecologicalHistory.firstPeriodDate}
                onChange={(e) => handleInputChange('gynecologicalHistory', 'firstPeriodDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lastPeriod">3. When was your last period?</Label>
              <Input
                id="lastPeriod"
                type="date"
                value={formData.gynecologicalHistory.lastPeriod}
                onChange={(e) => handleInputChange('gynecologicalHistory', 'lastPeriod', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="irregularCycles">4. If your periods have been irregular and/or infrequent and can remember all approximate dates, please list the cycle dates</Label>
              <Textarea
                id="irregularCycles"
                value={formData.gynecologicalHistory.irregularCycleDates}
                onChange={(e) => handleInputChange('gynecologicalHistory', 'irregularCycleDates', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Menstrual Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Menstrual Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>5. How often have you had menstrual periods in the last year?</Label>
              <RadioGroup
                value={formData.menstrualPatterns.periodFrequency}
                onValueChange={(value) => handleInputChange('menstrualPatterns', 'periodFrequency', value)}
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Once every 20 days or less',
                    'Every 21-27 days',
                    'Every 28-35 days',
                    'Every 36-50 days',
                    'Every 3-4 months',
                    'Very irregular, sometimes monthly, sometimes skip several months'
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="periodDuration">6. My periods usually last _____ days</Label>
                <Input
                  id="periodDuration"
                  type="number"
                  value={formData.menstrualPatterns.periodDuration}
                  onChange={(e) => handleInputChange('menstrualPatterns', 'periodDuration', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="periodsCount">7. Number of periods in the last 12 months</Label>
                <Input
                  id="periodsCount"
                  type="number"
                  value={formData.menstrualPatterns.periodsLast12Months}
                  onChange={(e) => handleInputChange('menstrualPatterns', 'periodsLast12Months', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="longestWithout">8. What is the longest you have gone without having a menstrual period?</Label>
              <Input
                id="longestWithout"
                value={formData.menstrualPatterns.longestWithoutPeriod}
                onChange={(e) => handleInputChange('menstrualPatterns', 'longestWithoutPeriod', e.target.value)}
              />
            </div>

            <div>
              <Label>9. My menstrual flow is usually:</Label>
              <RadioGroup
                value={formData.menstrualPatterns.menstrualFlow}
                onValueChange={(value) => handleInputChange('menstrualPatterns', 'menstrualFlow', value)}
              >
                <div className="flex space-x-6">
                  {['light', 'moderate', 'heavy'].map((flow) => (
                    <div key={flow} className="flex items-center space-x-2">
                      <RadioGroupItem value={flow} id={flow} />
                      <Label htmlFor={flow}>{flow}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>10. Do you have bleeding between periods?</Label>
              <RadioGroup
                value={formData.menstrualPatterns.bleedingBetweenPeriods}
                onValueChange={(value) => handleInputChange('menstrualPatterns', 'bleedingBetweenPeriods', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="bleeding-yes" />
                    <Label htmlFor="bleeding-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="bleeding-no" />
                    <Label htmlFor="bleeding-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>11. Do pain and cramping accompany your menstrual cycle?</Label>
              <RadioGroup
                value={formData.menstrualPatterns.painAndCramping}
                onValueChange={(value) => handleInputChange('menstrualPatterns', 'painAndCramping', value)}
              >
                <div className="flex space-x-6">
                  {['not at all', 'slightly', 'a great deal'].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={level} />
                      <Label htmlFor={level}>{level}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>12. If yes, do you (check all that apply):</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  'Take Pain Medication',
                  'Lose time from school, job or other function',
                  'Function less efficiently at school, job, home or sport',
                  'Reduce your level of physical exercise/training',
                  'Miss practice/workout days',
                  'Continue workout days but decrease training level',
                  'Continue life with little change'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.painManagement.includes(option)}
                      onCheckedChange={(checked) => handleArrayChange('painManagement', option, checked as boolean)}
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Exercise Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>13. Do you think vigorous exercise/training effects your menstrual periods?</Label>
              <RadioGroup
                value={formData.exerciseImpact.exerciseAffectsPeriods}
                onValueChange={(value) => handleInputChange('exerciseImpact', 'exerciseAffectsPeriods', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="exercise-yes" />
                    <Label htmlFor="exercise-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="exercise-no" />
                    <Label htmlFor="exercise-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
              {formData.exerciseImpact.exerciseAffectsPeriods === 'yes' && (
                <div className="mt-2">
                  <Label htmlFor="exerciseEffects">Please explain these changes:</Label>
                  <Textarea
                    id="exerciseEffects"
                    value={formData.exerciseImpact.exerciseEffectsDescription}
                    onChange={(e) => handleInputChange('exerciseImpact', 'exerciseEffectsDescription', e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>14. Have you ever seen a medical practitioner about problems associated with your period?</Label>
              <RadioGroup
                value={formData.exerciseImpact.consultedPractitioner}
                onValueChange={(value) => handleInputChange('exerciseImpact', 'consultedPractitioner', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="practitioner-yes" />
                    <Label htmlFor="practitioner-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="practitioner-no" />
                    <Label htmlFor="practitioner-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
              {formData.exerciseImpact.consultedPractitioner === 'yes' && (
                <div className="mt-2">
                  <Label htmlFor="practitionerAdvice">What did they tell you?</Label>
                  <Textarea
                    id="practitionerAdvice"
                    value={formData.exerciseImpact.practitionerAdvice}
                    onChange={(e) => handleInputChange('exerciseImpact', 'practitionerAdvice', e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weight and Body Image */}
        <Card>
          <CardHeader>
            <CardTitle>Weight and Body Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>15. Do you consider yourself:</Label>
              <RadioGroup
                value={formData.weightAndBody.selfPerception}
                onValueChange={(value) => handleInputChange('weightAndBody', 'selfPerception', value)}
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Underweight',
                    'Slightly Underweight',
                    'Just right',
                    'Slightly overweight',
                    'Overweight'
                  ].map((perception) => (
                    <div key={perception} className="flex items-center space-x-2">
                      <RadioGroupItem value={perception} id={perception} />
                      <Label htmlFor={perception}>{perception}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>16. Have you ever experienced significant weight loss or gain?</Label>
              <RadioGroup
                value={formData.weightAndBody.significantWeightChange}
                onValueChange={(value) => handleInputChange('weightAndBody', 'significantWeightChange', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="weight-change-yes" />
                    <Label htmlFor="weight-change-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="weight-change-no" />
                    <Label htmlFor="weight-change-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
              {formData.weightAndBody.significantWeightChange === 'yes' && (
                <div className="mt-2">
                  <Label htmlFor="weightChangeDesc">Please explain:</Label>
                  <Textarea
                    id="weightChangeDesc"
                    value={formData.weightAndBody.weightChangeDescription}
                    onChange={(e) => handleInputChange('weightAndBody', 'weightChangeDescription', e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>17. In the past year, has your weight:</Label>
              <RadioGroup
                value={formData.weightAndBody.pastYearWeight}
                onValueChange={(value) => handleInputChange('weightAndBody', 'pastYearWeight', value)}
              >
                <div className="flex space-x-6">
                  {[
                    'Basically stayed the same (varied 1-5 pounds)',
                    'Increased',
                    'Decreased'
                  ].map((change) => (
                    <div key={change} className="flex items-center space-x-2">
                      <RadioGroupItem value={change} id={change} />
                      <Label htmlFor={change}>{change}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>18. In the past year, has your sport activity/training:</Label>
              <RadioGroup
                value={formData.weightAndBody.pastYearActivity}
                onValueChange={(value) => handleInputChange('weightAndBody', 'pastYearActivity', value)}
              >
                <div className="flex space-x-6">
                  {[
                    'Basically stayed the same',
                    'Increased',
                    'Decreased'
                  ].map((change) => (
                    <div key={change} className="flex items-center space-x-2">
                      <RadioGroupItem value={change} id={change} />
                      <Label htmlFor={change}>{change}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              {(formData.weightAndBody.pastYearActivity === 'Increased' || formData.weightAndBody.pastYearActivity === 'Decreased') && (
                <div className="mt-2">
                  <Label htmlFor="activityChangeDesc">Please explain:</Label>
                  <Textarea
                    id="activityChangeDesc"
                    value={formData.weightAndBody.activityChangeDescription}
                    onChange={(e) => handleInputChange('weightAndBody', 'activityChangeDescription', e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health History */}
        <Card>
          <CardHeader>
            <CardTitle>Health History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>19. Do you have a history of stress fractures?</Label>
              <RadioGroup
                value={formData.healthHistory.stressFractures}
                onValueChange={(value) => handleInputChange('healthHistory', 'stressFractures', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="fractures-yes" />
                    <Label htmlFor="fractures-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="fractures-no" />
                    <Label htmlFor="fractures-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="injuries">20. Have you experienced any injuries the past year? If so, please describe:</Label>
              <Textarea
                id="injuries"
                value={formData.healthHistory.pastYearInjuries}
                onChange={(e) => handleInputChange('healthHistory', 'pastYearInjuries', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="dietInfluences">21. Do you currently have any problems that you feel influence your diet?</Label>
              <Textarea
                id="dietInfluences"
                value={formData.healthHistory.dietInfluences}
                onChange={(e) => handleInputChange('healthHistory', 'dietInfluences', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label>22. Is your diet well balanced?</Label>
              <RadioGroup
                value={formData.healthHistory.balancedDiet}
                onValueChange={(value) => handleInputChange('healthHistory', 'balancedDiet', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="diet-yes" />
                    <Label htmlFor="diet-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="diet-no" />
                    <Label htmlFor="diet-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>23. Do you now or have you ever experienced (for each checked, please add details to explain):</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {symptomsList.map((symptom) => (
                <div key={symptom} className="flex items-start space-x-3">
                  <Checkbox
                    id={symptom}
                    checked={formData.symptoms[symptom] !== undefined && formData.symptoms[symptom] !== ''}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        handleSymptomChange(symptom, '');
                      }
                    }}
                  />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={symptom} className="text-sm font-normal">{symptom}</Label>
                    {formData.symptoms[symptom] !== undefined && (
                      <Input
                        placeholder="Please explain..."
                        value={formData.symptoms[symptom] || ''}
                        onChange={(e) => handleSymptomChange(symptom, e.target.value)}
                        className="text-sm"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle>24. Current Medication/Supplement Intake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prescriptions">Prescription Medication</Label>
                <Textarea
                  id="prescriptions"
                  value={formData.medications.prescriptions}
                  onChange={(e) => handleInputChange('medications', 'prescriptions', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="vitamins">Vitamins</Label>
                <Textarea
                  id="vitamins"
                  value={formData.medications.vitamins}
                  onChange={(e) => handleInputChange('medications', 'vitamins', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="minerals">Minerals</Label>
                <Textarea
                  id="minerals"
                  value={formData.medications.minerals}
                  onChange={(e) => handleInputChange('medications', 'minerals', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="herbs">Herbs</Label>
                <Textarea
                  id="herbs"
                  value={formData.medications.herbs}
                  onChange={(e) => handleInputChange('medications', 'herbs', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>25. Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="additionalInfo">
                When in doubt, the more information Dr. Lauren has, the better we can understand the "whole picture" of you! 
                It is her goal to help you be a happy, healthy and active person for your entire life. Together, we can work towards that goal! 
                Your health is YOURS, and we are here to help. If there is anything else you would like Dr. Lauren to know, 
                or if you would like to elaborate more on one of the above questions, please feel free to do so in the open space below.
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                rows={5}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Menstrual History Questionnaire'}
          </Button>
        </div>
      </form>
    </div>
  );
};
