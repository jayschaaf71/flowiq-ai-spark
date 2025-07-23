
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Baby, Heart, Calendar, User, MapPin, Pill } from 'lucide-react';
import { useTenantConfig } from '@/utils/tenantConfig';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useToast } from '@/hooks/use-toast';

interface PreviousPregnancies {
  vaginal: string;
  cSection: string;
  miscarriage: string;
}

interface CurrentPregnancyIssues {
  preEclampsia: boolean;
  infertilityTreatment: boolean;
  morningSickness: boolean;
  other: string;
}

interface FormData {
  name: string;
  dueDate: string;
  weeksPregnant: string;
  visitReason: string;
  visitReasonOther: string;
  previousChiropractic: string;
  previousPregnancies: PreviousPregnancies;
  priorPregnancyChiropractic: string;
  currentPregnancyIssues: CurrentPregnancyIssues;
  covidShot: string;
  previousComplications: string;
  birthClass: string;
  birthClassOther: string;
  birthLocation: string;
  birthLocationSpecific: string;
  careProvider: string;
  doulaPlanned: string;
  doulaName: string;
  supplements: string;
  supplementsList: string;
  medications: string;
  medicationsList: string;
  prePregnancyActivity: string;
  currentActivity: string;
  birthExpectations: string;
  birthExpectationsOther: string;
  epiduralPreference: string;
  biggestFear: string;
  obMidwifeName: string;
  practiceName: string;
  phone: string;
  fax: string;
  permissionToContact: string;
}

export const PregnancyQuestionnaire = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dueDate: '',
    weeksPregnant: '',
    visitReason: '',
    visitReasonOther: '',
    previousChiropractic: '',
    previousPregnancies: {
      vaginal: '',
      cSection: '',
      miscarriage: ''
    },
    priorPregnancyChiropractic: '',
    currentPregnancyIssues: {
      preEclampsia: false,
      infertilityTreatment: false,
      morningSickness: false,
      other: ''
    },
    covidShot: '',
    previousComplications: '',
    birthClass: '',
    birthClassOther: '',
    birthLocation: '',
    birthLocationSpecific: '',
    careProvider: '',
    doulaPlanned: '',
    doulaName: '',
    supplements: '',
    supplementsList: '',
    medications: '',
    medicationsList: '',
    prePregnancyActivity: '',
    currentActivity: '',
    birthExpectations: '',
    birthExpectationsOther: '',
    epiduralPreference: '',
    biggestFear: '',
    obMidwifeName: '',
    practiceName: '',
    phone: '',
    fax: '',
    permissionToContact: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const tenantConfig = useTenantConfig();
  const { submitForm } = useIntakeForms();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    const [parent, child] = field.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof FormData] as object),
        [child]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This would integrate with your existing form submission system
      console.log('Pregnancy Questionnaire Data:', formData);
      
      toast({
        title: "Questionnaire Submitted",
        description: "Your pregnancy questionnaire has been submitted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit questionnaire. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Baby className="h-8 w-8 text-pink-600" />
            <div>
              <CardTitle className="text-2xl text-pink-900">Pregnancy Questionnaire</CardTitle>
              <p className="text-pink-700">West County Spine and Joint - Prenatal Care</p>
            </div>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg mt-4">
            <p className="text-pink-800 font-medium">
              Congratulations on your pregnancy! It is important for us to know your PAST history and current GOALS, 
              so please give us some information that will help us to take care of you:
            </p>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weeksPregnant"># of weeks currently pregnant</Label>
                <Input
                  id="weeksPregnant"
                  type="number"
                  value={formData.weeksPregnant}
                  onChange={(e) => handleInputChange('weeksPregnant', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit Reason */}
        <Card>
          <CardHeader>
            <CardTitle>Reason for Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.visitReason}
              onValueChange={(value) => handleInputChange('visitReason', value)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wellness" id="wellness" />
                  <Label htmlFor="wellness">Wellness Visit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lowback" id="lowback" />
                  <Label htmlFor="lowback">Low Back Pain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pubic" id="pubic" />
                  <Label htmlFor="pubic">Pubic Symphysis Discomfort</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pelvic" id="pelvic" />
                  <Label htmlFor="pelvic">Pelvic/Hip discomfort</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="headache" id="headache" />
                  <Label htmlFor="headache">Headache/neck pain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </div>
            </RadioGroup>
            {formData.visitReason === 'other' && (
              <Input
                className="mt-2"
                placeholder="Please specify"
                value={formData.visitReasonOther}
                onChange={(e) => handleInputChange('visitReasonOther', e.target.value)}
              />
            )}
          </CardContent>
        </Card>

        {/* Previous Care */}
        <Card>
          <CardHeader>
            <CardTitle>Previous Care History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Have you been under chiropractic care previously?</Label>
              <RadioGroup
                value={formData.previousChiropractic}
                onValueChange={(value) => handleInputChange('previousChiropractic', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="prev-chiro-yes" />
                    <Label htmlFor="prev-chiro-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="prev-chiro-no" />
                    <Label htmlFor="prev-chiro-no">No</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Number of Previous Pregnancies:</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="vaginal">Vaginal</Label>
                  <Input
                    id="vaginal"
                    type="number"
                    value={formData.previousPregnancies.vaginal}
                    onChange={(e) => handleInputChange('previousPregnancies.vaginal', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="csection">C-Section</Label>
                  <Input
                    id="csection"
                    type="number"
                    value={formData.previousPregnancies.cSection}
                    onChange={(e) => handleInputChange('previousPregnancies.cSection', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="miscarriage">Miscarriage</Label>
                  <Input
                    id="miscarriage"
                    type="number"
                    value={formData.previousPregnancies.miscarriage}
                    onChange={(e) => handleInputChange('previousPregnancies.miscarriage', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Did you receive Chiropractic care during prior pregnancies?</Label>
              <RadioGroup
                value={formData.priorPregnancyChiropractic}
                onValueChange={(value) => handleInputChange('priorPregnancyChiropractic', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="prior-preg-yes" />
                    <Label htmlFor="prior-preg-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="prior-preg-no" />
                    <Label htmlFor="prior-preg-no">No</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Current Pregnancy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Current Pregnancy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>In this pregnancy, have you experienced:</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preeclampsia"
                    checked={formData.currentPregnancyIssues.preEclampsia}
                    onCheckedChange={(checked) => handleCheckboxChange('currentPregnancyIssues.preEclampsia', checked as boolean)}
                  />
                  <Label htmlFor="preeclampsia">Pre-Eclampsia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="infertility"
                    checked={formData.currentPregnancyIssues.infertilityTreatment}
                    onCheckedChange={(checked) => handleCheckboxChange('currentPregnancyIssues.infertilityTreatment', checked as boolean)}
                  />
                  <Label htmlFor="infertility">Use of infertility drugs/In-Vitro Fertilization</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="morning-sickness"
                    checked={formData.currentPregnancyIssues.morningSickness}
                    onCheckedChange={(checked) => handleCheckboxChange('currentPregnancyIssues.morningSickness', checked as boolean)}
                  />
                  <Label htmlFor="morning-sickness">Morning Sickness</Label>
                </div>
              </div>
              <Input
                className="mt-2"
                placeholder="Other complications"
                value={formData.currentPregnancyIssues.other}
                onChange={(e) => handleInputChange('currentPregnancyIssues.other', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="covid-shot">Did you receive the Covid-19 shot?</Label>
              <Input
                id="covid-shot"
                value={formData.covidShot}
                onChange={(e) => handleInputChange('covidShot', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="complications">Please tell us about any complications, if any, you experienced in previous pregnancies:</Label>
              <Textarea
                id="complications"
                value={formData.previousComplications}
                onChange={(e) => handleInputChange('previousComplications', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Birth Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Birth Plans & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>What birth class have you decided to take (did you take)?</Label>
              <Select
                value={formData.birthClass}
                onValueChange={(value) => handleInputChange('birthClass', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select birth class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bradley">Bradley</SelectItem>
                  <SelectItem value="hypnobabies">Hypnobabies/Hypnobirthing</SelectItem>
                  <SelectItem value="hospital">Hospital class</SelectItem>
                  <SelectItem value="babysteps">BabySteps</SelectItem>
                  <SelectItem value="not-sure">Not yet sure</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.birthClass === 'other' && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={formData.birthClassOther}
                  onChange={(e) => handleInputChange('birthClassOther', e.target.value)}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Where do you plan to give birth?</Label>
                <Select
                  value={formData.birthLocation}
                  onValueChange={(value) => handleInputChange('birthLocation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="birth-center">Birth Center</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="birth-location-specific">Which one?</Label>
                <Input
                  id="birth-location-specific"
                  value={formData.birthLocationSpecific}
                  onChange={(e) => handleInputChange('birthLocationSpecific', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="care-provider">Do you plan to use an Obstetrician or a Midwife?</Label>
              <Input
                id="care-provider"
                value={formData.careProvider}
                onChange={(e) => handleInputChange('careProvider', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doula-planned">Do you plan to use Doula?</Label>
                <Input
                  id="doula-planned"
                  value={formData.doulaPlanned}
                  onChange={(e) => handleInputChange('doulaPlanned', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="doula-name">If so, who:</Label>
                <Input
                  id="doula-name"
                  value={formData.doulaName}
                  onChange={(e) => handleInputChange('doulaName', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medications & Supplements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medications & Supplements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Are you taking any supplements and/or vitamins?</Label>
              <RadioGroup
                value={formData.supplements}
                onValueChange={(value) => handleInputChange('supplements', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="supplements-yes" />
                    <Label htmlFor="supplements-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="supplements-no" />
                    <Label htmlFor="supplements-no">No</Label>
                  </div>
                </div>
              </RadioGroup>
              {formData.supplements === 'yes' && (
                <Textarea
                  className="mt-2"
                  placeholder="If yes, what product(s):"
                  value={formData.supplementsList}
                  onChange={(e) => handleInputChange('supplementsList', e.target.value)}
                />
              )}
            </div>

            <div>
              <Label>Are you taking any prescription medications?</Label>
              <RadioGroup
                value={formData.medications}
                onValueChange={(value) => handleInputChange('medications', value)}
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="medications-yes" />
                    <Label htmlFor="medications-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="medications-no" />
                    <Label htmlFor="medications-no">No</Label>
                  </div>
                </div>
              </RadioGroup>
              {formData.medications === 'yes' && (
                <Textarea
                  className="mt-2"
                  placeholder="If yes, what medication(s):"
                  value={formData.medicationsList}
                  onChange={(e) => handleInputChange('medicationsList', e.target.value)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity & Birth Expectations */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Level & Birth Expectations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pre-activity">What was your activity level like prior to getting pregnant?</Label>
              <Textarea
                id="pre-activity"
                value={formData.prePregnancyActivity}
                onChange={(e) => handleInputChange('prePregnancyActivity', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="current-activity">What has your activity level been like during this pregnancy?</Label>
              <Textarea
                id="current-activity"
                value={formData.currentActivity}
                onChange={(e) => handleInputChange('currentActivity', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label>What are your hopes or expectations for the birth?</Label>
              <RadioGroup
                value={formData.birthExpectations}
                onValueChange={(value) => handleInputChange('birthExpectations', value)}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="natural" id="natural" />
                    <Label htmlFor="natural">Natural birth</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vbac" id="vbac" />
                    <Label htmlFor="vbac">VBAC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="planned-c" id="planned-c" />
                    <Label htmlFor="planned-c">Planned C-Section</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unsure" id="unsure" />
                    <Label htmlFor="unsure">Unsure</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other-birth" id="other-birth" />
                    <Label htmlFor="other-birth">Other</Label>
                  </div>
                </div>
              </RadioGroup>
              {formData.birthExpectations === 'other-birth' && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={formData.birthExpectationsOther}
                  onChange={(e) => handleInputChange('birthExpectationsOther', e.target.value)}
                />
              )}
            </div>

            <div>
              <Label>Epidural Preference:</Label>
              <RadioGroup
                value={formData.epiduralPreference}
                onValueChange={(value) => handleInputChange('epiduralPreference', value)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="only-if-necessary" id="epidural-necessary" />
                    <Label htmlFor="epidural-necessary">Epidural only if necessary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definite" id="epidural-definite" />
                    <Label htmlFor="epidural-definite">Definite Epidural</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="biggest-fear">What is your biggest fear going into this birth?</Label>
              <Textarea
                id="biggest-fear"
                value={formData.biggestFear}
                onChange={(e) => handleInputChange('biggestFear', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Healthcare Provider Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Healthcare Provider Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ob-midwife">Name of OB or Midwife:</Label>
                <Input
                  id="ob-midwife"
                  value={formData.obMidwifeName}
                  onChange={(e) => handleInputChange('obMidwifeName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="practice-name">Practice Name:</Label>
                <Input
                  id="practice-name"
                  value={formData.practiceName}
                  onChange={(e) => handleInputChange('practiceName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-phone">Phone:</Label>
                <Input
                  id="provider-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="provider-fax">Fax:</Label>
                <Input
                  id="provider-fax"
                  value={formData.fax}
                  onChange={(e) => handleInputChange('fax', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-blue-900 font-medium">
                May we have your permission to contact your doctor/birth attendant and doula to confer with them and share information regarding the chiropractic care that you are receiving here?
              </Label>
              <RadioGroup
                value={formData.permissionToContact}
                onValueChange={(value) => handleInputChange('permissionToContact', value)}
              >
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="permission-yes" />
                    <Label htmlFor="permission-yes">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="permission-no" />
                    <Label htmlFor="permission-no">NO</Label>
                  </div>
                </div>
              </RadioGroup>
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
            {isSubmitting ? 'Submitting...' : 'Submit Pregnancy Questionnaire'}
          </Button>
        </div>
      </form>
    </div>
  );
};
