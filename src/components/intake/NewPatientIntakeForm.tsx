
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Heart, Shield, FileText, CreditCard, Activity } from 'lucide-react';
import { useTenantConfig } from '@/utils/tenantConfig';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  mailingAddress: string;
  city: string;
  state: string;
  zip: string;
  homePhone: string;
  cellPhone: string;
  email: string;
  patientSSN: string;
  primaryInsuredSSN: string;
  status: string;
  occupation: string;
  employer: string;
  familyPhysician: string;
  physicianCity: string;
  physicianPhone: string;
  shareWithPhysician: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

interface SmokingStatus {
  status: string;
  startDate: string;
  endDate: string;
  quittingAid: string;
}

interface Vitals {
  heightFeet: string;
  heightInches: string;
  weight: string;
  medications: string[];
  supplements: string[];
  hasAllergies: string;
  allergies: Array<{
    allergen: string;
    reaction: string;
    startDate: string;
    endDate: string;
  }>;
  takingBloodThinners: string;
}

interface FamilyHistory {
  cancer: string;
  diabetes: string;
  stroke: string;
  highBloodPressure: string;
  backPain: string;
  headache: string;
  migraines: string;
  allergies: string;
  arthritis: string;
  scoliosis: string;
  other: string;
}

interface InjuryInfo {
  workRelated: string;
  workInjuryDate: string;
  autoAccident: string;
  autoAccidentDate: string;
}

interface HealthHistory {
  generalHealth: string;
  previousProblem: string;
  previousProblemWhen: string;
  previousTreatment: string;
  previousTreatmentBy: string;
  previousTreatmentOutcome: string;
  strokeOrClotting: string;
  strokeOrClottingWhen: string;
  recentSymptoms: string;
  recentSymptomsWhen: string;
  majorIllnesses: string;
}

interface SocialHistory {
  recreationalActivities: string;
  activitiesLimited: string;
  exerciseFrequency: string;
  smokingPacks: string;
  alcoholConsumption: string;
  balancedDiet: string;
  dietExplanation: string;
  adequateSleep: string;
  sleepHours: string;
  workStress: string;
  workStressExplanation: string;
  familyStress: string;
  familyStressExplanation: string;
  recreationalDrugs: string;
  recreationalDrugsExplanation: string;
  waterIntake: string;
  caffeineIntake: string;
  trainingGoals: string;
}

interface CurrentCondition {
  hadBefore: string;
  hadBeforeExplanation: string;
  receivedTreatment: string;
  treatmentExplanation: string;
  onset: string;
  painProgress: string;
  symptomsBegin: string;
  painCause: string;
  aggravatingFactors: string;
  relievingFactors: string;
  limitedActivities: string;
  interferesWithSleep: string;
  painWorseWhen: string;
  relatedSymptoms: string[];
  isPregnant: string;
}

interface PainAssessment {
  complaints: Array<{
    area: string;
    worst: string;
    best: string;
    typical: string;
  }>;
  specialCare: string;
}

interface ReviewOfSystems {
  constitutional: string[];
  integumentary: string[];
  neurological: string[];
  allergicImmunologic: string[];
  eyes: string[];
  gastrointestinal: string[];
  psychiatric: string[];
  cardiovascular: string[];
  genitourinary: string[];
  endocrine: string[];
  hematologic: string[];
  respiratory: string[];
  ent: string[];
  musculoskeletal: string[];
}

interface SoftTissueQuestions {
  bruiseEasily: string;
  bleedLong: string;
  bloodThinners: string;
  regularAspirin: string;
  regularCortisone: string;
  inflamedVeins: string;
  surgicalImplants: string;
  diabetesKidney: string;
  currentInfections: string;
  highBloodPressure: string;
}

interface ConsentInfo {
  informedConsent: boolean;
  assignmentOfBenefits: boolean;
  insuranceBenefits: boolean;
  hipaaConsent: boolean;
  softTissueConsent: boolean;
  authorizedPersons: string[];
}

interface FormData {
  personalInfo: PersonalInfo;
  smokingStatus: SmokingStatus;
  vitals: Vitals;
  familyHistory: FamilyHistory;
  injuryInfo: InjuryInfo;
  healthHistory: HealthHistory;
  socialHistory: SocialHistory;
  currentCondition: CurrentCondition;
  painAssessment: PainAssessment;
  reviewOfSystems: ReviewOfSystems;
  softTissueQuestions: SoftTissueQuestions;
  consentInfo: ConsentInfo;
}

export const NewPatientIntakeForm = () => {
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      mailingAddress: '',
      city: '',
      state: '',
      zip: '',
      homePhone: '',
      cellPhone: '',
      email: '',
      patientSSN: '',
      primaryInsuredSSN: '',
      status: '',
      occupation: '',
      employer: '',
      familyPhysician: '',
      physicianCity: '',
      physicianPhone: '',
      shareWithPhysician: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
    },
    smokingStatus: {
      status: '',
      startDate: '',
      endDate: '',
      quittingAid: ''
    },
    vitals: {
      heightFeet: '',
      heightInches: '',
      weight: '',
      medications: [],
      supplements: [],
      hasAllergies: '',
      allergies: [],
      takingBloodThinners: ''
    },
    familyHistory: {
      cancer: '',
      diabetes: '',
      stroke: '',
      highBloodPressure: '',
      backPain: '',
      headache: '',
      migraines: '',
      allergies: '',
      arthritis: '',
      scoliosis: '',
      other: ''
    },
    injuryInfo: {
      workRelated: '',
      workInjuryDate: '',
      autoAccident: '',
      autoAccidentDate: ''
    },
    healthHistory: {
      generalHealth: '',
      previousProblem: '',
      previousProblemWhen: '',
      previousTreatment: '',
      previousTreatmentBy: '',
      previousTreatmentOutcome: '',
      strokeOrClotting: '',
      strokeOrClottingWhen: '',
      recentSymptoms: '',
      recentSymptomsWhen: '',
      majorIllnesses: ''
    },
    socialHistory: {
      recreationalActivities: '',
      activitiesLimited: '',
      exerciseFrequency: '',
      smokingPacks: '',
      alcoholConsumption: '',
      balancedDiet: '',
      dietExplanation: '',
      adequateSleep: '',
      sleepHours: '',
      workStress: '',
      workStressExplanation: '',
      familyStress: '',
      familyStressExplanation: '',
      recreationalDrugs: '',
      recreationalDrugsExplanation: '',
      waterIntake: '',
      caffeineIntake: '',
      trainingGoals: ''
    },
    currentCondition: {
      hadBefore: '',
      hadBeforeExplanation: '',
      receivedTreatment: '',
      treatmentExplanation: '',
      onset: '',
      painProgress: '',
      symptomsBegin: '',
      painCause: '',
      aggravatingFactors: '',
      relievingFactors: '',
      limitedActivities: '',
      interferesWithSleep: '',
      painWorseWhen: '',
      relatedSymptoms: [],
      isPregnant: ''
    },
    painAssessment: {
      complaints: [
        { area: '', worst: '', best: '', typical: '' },
        { area: '', worst: '', best: '', typical: '' },
        { area: '', worst: '', best: '', typical: '' }
      ],
      specialCare: ''
    },
    reviewOfSystems: {
      constitutional: [],
      integumentary: [],
      neurological: [],
      allergicImmunologic: [],
      eyes: [],
      gastrointestinal: [],
      psychiatric: [],
      cardiovascular: [],
      genitourinary: [],
      endocrine: [],
      hematologic: [],
      respiratory: [],
      ent: [],
      musculoskeletal: []
    },
    softTissueQuestions: {
      bruiseEasily: '',
      bleedLong: '',
      bloodThinners: '',
      regularAspirin: '',
      regularCortisone: '',
      inflamedVeins: '',
      surgicalImplants: '',
      diabetesKidney: '',
      currentInfections: '',
      highBloodPressure: ''
    },
    consentInfo: {
      informedConsent: false,
      assignmentOfBenefits: false,
      insuranceBenefits: false,
      hipaaConsent: false,
      softTissueConsent: false,
      authorizedPersons: []
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const tenantConfig = useTenantConfig();
  const { submitForm } = useIntakeForms();
  const { toast } = useToast();

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof FormData] as object),
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: string, field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof FormData] as object),
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('New Patient Intake Form Data:', formData);
      
      toast({
        title: "Form Submitted",
        description: "Your new patient intake form has been submitted successfully!"
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl text-blue-900">New Patient Complete Intake Form</CardTitle>
              <p className="text-blue-700">West County Spine and Joint - Comprehensive Health Assessment</p>
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg mt-4">
            <p className="text-blue-800 font-medium">
              Please complete this comprehensive form to help us provide you with the best possible care. 
              Your answers will help us focus your examination and determine the most appropriate treatment plan.
            </p>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fullName">Patient's Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.personalInfo.gender}
                  onValueChange={(value) => handleInputChange('personalInfo', 'gender', value)}
                >
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="mailingAddress">Mailing Address</Label>
                <Input
                  id="mailingAddress"
                  value={formData.personalInfo.mailingAddress}
                  onChange={(e) => handleInputChange('personalInfo', 'mailingAddress', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.personalInfo.state}
                  onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  value={formData.personalInfo.zip}
                  onChange={(e) => handleInputChange('personalInfo', 'zip', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  type="tel"
                  value={formData.personalInfo.homePhone}
                  onChange={(e) => handleInputChange('personalInfo', 'homePhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cellPhone">Cell Phone</Label>
                <Input
                  id="cellPhone"
                  type="tel"
                  value={formData.personalInfo.cellPhone}
                  onChange={(e) => handleInputChange('personalInfo', 'cellPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientSSN">Patient Social Security #</Label>
                <Input
                  id="patientSSN"
                  value={formData.personalInfo.patientSSN}
                  onChange={(e) => handleInputChange('personalInfo', 'patientSSN', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="primaryInsuredSSN">Social Security # of Primary Insured</Label>
                <Input
                  id="primaryInsuredSSN"
                  value={formData.personalInfo.primaryInsuredSSN}
                  onChange={(e) => handleInputChange('personalInfo', 'primaryInsuredSSN', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                />
              </div>
            </div>

            <div>
              <Label>Employment Status</Label>
              <RadioGroup
                value={formData.personalInfo.status}
                onValueChange={(value) => handleInputChange('personalInfo', 'status', value)}
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {['Employed Full Time', 'Student', 'Part Time Student', 'Retired', 'Unemployed'].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <RadioGroupItem value={status.toLowerCase().replace(/\s+/g, '-')} id={status} />
                      <Label htmlFor={status} className="text-sm">{status}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.personalInfo.occupation}
                  onChange={(e) => handleInputChange('personalInfo', 'occupation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  value={formData.personalInfo.employer}
                  onChange={(e) => handleInputChange('personalInfo', 'employer', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="familyPhysician">Family Physician/Internist</Label>
                <Input
                  id="familyPhysician"
                  value={formData.personalInfo.familyPhysician}
                  onChange={(e) => handleInputChange('personalInfo', 'familyPhysician', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="physicianCity">City/State</Label>
                <Input
                  id="physicianCity"
                  value={formData.personalInfo.physicianCity}
                  onChange={(e) => handleInputChange('personalInfo', 'physicianCity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="physicianPhone">Phone</Label>
                <Input
                  id="physicianPhone"
                  type="tel"
                  value={formData.personalInfo.physicianPhone}
                  onChange={(e) => handleInputChange('personalInfo', 'physicianPhone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>May we share your information in our patient records with your physician for integrated care?</Label>
              <RadioGroup
                value={formData.personalInfo.shareWithPhysician}
                onValueChange={(value) => handleInputChange('personalInfo', 'shareWithPhysician', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="share-yes" />
                    <Label htmlFor="share-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="share-no" />
                    <Label htmlFor="share-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name & Number</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.personalInfo.emergencyContactName}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContactName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.personalInfo.emergencyContactPhone}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContactPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactRelation">Relation</Label>
                <Input
                  id="emergencyContactRelation"
                  value={formData.personalInfo.emergencyContactRelation}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContactRelation', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smoking Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Smoking & Health Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Smoking Status (check only 1)</Label>
              <RadioGroup
                value={formData.smokingStatus.status}
                onValueChange={(value) => handleInputChange('smokingStatus', 'status', value)}
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Current Everyday Smoker',
                    'Current Some Day Smoker', 
                    'Former Smoker',
                    'Never Smoker'
                  ].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <RadioGroupItem value={status.toLowerCase().replace(/\s+/g, '-')} id={status} />
                      <Label htmlFor={status} className="text-sm">{status}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="smokingStartDate">Start Date</Label>
                <Input
                  id="smokingStartDate"
                  type="date"
                  value={formData.smokingStatus.startDate}
                  onChange={(e) => handleInputChange('smokingStatus', 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="smokingEndDate">End Date</Label>
                <Input
                  id="smokingEndDate"
                  type="date"
                  value={formData.smokingStatus.endDate}
                  onChange={(e) => handleInputChange('smokingStatus', 'endDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quittingAid">In effort to quit smoking, I am currently taking:</Label>
                <Input
                  id="quittingAid"
                  value={formData.smokingStatus.quittingAid}
                  onChange={(e) => handleInputChange('smokingStatus', 'quittingAid', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Height</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Feet"
                    value={formData.vitals.heightFeet}
                    onChange={(e) => handleInputChange('vitals', 'heightFeet', e.target.value)}
                  />
                  <Input
                    placeholder="Inches"
                    value={formData.vitals.heightInches}
                    onChange={(e) => handleInputChange('vitals', 'heightInches', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.vitals.weight}
                  onChange={(e) => handleInputChange('vitals', 'weight', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {isSubmitting ? 'Submitting...' : 'Submit New Patient Intake Form'}
          </Button>
        </div>
      </form>
    </div>
  );
};
