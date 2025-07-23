
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreditCardData {
  cardType: string;
  patientName: string;
  patientDOB: string;
  cardholderName: string;
  lastFourDigits: string;
  expirationDate: string;
  authorizedPatients: Array<{
    name: string;
    dob: string;
  }>;
  immediateCharging: boolean;
  signature: string;
  signatureDate: string;
}

export const CreditCardAgreementForm = () => {
  const [formData, setFormData] = useState<CreditCardData>({
    cardType: '',
    patientName: '',
    patientDOB: '',
    cardholderName: '',
    lastFourDigits: '',
    expirationDate: '',
    authorizedPatients: [{ name: '', dob: '' }],
    immediateCharging: false,
    signature: '',
    signatureDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthorizedPatientChange = (index: number, field: string, value: string) => {
    const updatedPatients = [...formData.authorizedPatients];
    updatedPatients[index] = { ...updatedPatients[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      authorizedPatients: updatedPatients
    }));
  };

  const addAuthorizedPatient = () => {
    if (formData.authorizedPatients.length < 3) {
      setFormData(prev => ({
        ...prev,
        authorizedPatients: [...prev.authorizedPatients, { name: '', dob: '' }]
      }));
    }
  };

  const removeAuthorizedPatient = (index: number) => {
    if (formData.authorizedPatients.length > 1) {
      const updatedPatients = formData.authorizedPatients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        authorizedPatients: updatedPatients
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add current date/time for signature
      const currentDate = new Date().toLocaleDateString();
      const updatedFormData = {
        ...formData,
        signatureDate: currentDate
      };

      console.log('Credit Card Agreement Form Data:', updatedFormData);
      
      toast({
        title: "Agreement Submitted",
        description: "Your credit card on file agreement has been submitted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit agreement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardTypes = [
    { value: "visa", label: "Visa" },
    { value: "mastercard", label: "MasterCard" },
    { value: "discover", label: "Discover" },
    { value: "amex", label: "American Express" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl text-blue-900">Credit Card on File Agreement</CardTitle>
              <p className="text-blue-700">West County Spine & Joint Chiropractic Clinic</p>
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg mt-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-blue-800">
                <p className="font-medium mb-2">Secure Payment Processing</p>
                <p className="text-sm">
                  Your payment information is stored securely through HIPAA-compliant practice management software. 
                  Only the last 4 digits of your card will be visible in our system for your protection.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Policy Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
              <p>
                <strong>West County Spine & Joint Chiropractic Clinic</strong> is committed to reducing waste and inefficiency 
                and making our check-out process as simple and easy as possible. Starting November 1st, 2021, we are requesting 
                that you provide a credit card on file with our office.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Your card will be charged on each date of treatment</li>
                <li>May be used to pay outstanding balances after insurance processing</li>
                <li>Payments processed through secure, HIPAA-compliant software</li>
                <li>Office personnel does not have access to your full card information</li>
                <li>Only the last 4 digits will show in our system</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Credit Card Information */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Card Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Card Type *</Label>
              <RadioGroup
                value={formData.cardType}
                onValueChange={(value) => handleInputChange('cardType', value)}
                className="flex flex-wrap gap-4 mt-2"
              >
                {cardTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value}>{type.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient's Name (Print) *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="patientDOB">Patient DOB *</Label>
                <Input
                  id="patientDOB"
                  type="date"
                  value={formData.patientDOB}
                  onChange={(e) => handleInputChange('patientDOB', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardholderName">Name on Card (Print) *</Label>
              <Input
                id="cardholderName"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastFourDigits">Last Four Digits of Credit Card Number *</Label>
                <Input
                  id="lastFourDigits"
                  value={formData.lastFourDigits}
                  onChange={(e) => handleInputChange('lastFourDigits', e.target.value)}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="1234"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expirationDate">Expiration Date (MM/YY) *</Label>
                <Input
                  id="expirationDate"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  placeholder="MM/YY"
                  pattern="[0-9]{2}/[0-9]{2}"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authorized Patients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Additional Authorized Patients</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAuthorizedPatient}
                disabled={formData.authorizedPatients.length >= 3}
              >
                Add Patient
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              List any other persons you authorize this credit card for (up to 3 additional patients)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.authorizedPatients.map((patient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor={`authPatientName-${index}`}>Patient Full Name</Label>
                  <Input
                    id={`authPatientName-${index}`}
                    value={patient.name}
                    onChange={(e) => handleAuthorizedPatientChange(index, 'name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`authPatientDOB-${index}`}>DOB</Label>
                    <Input
                      id={`authPatientDOB-${index}`}
                      type="date"
                      value={patient.dob}
                      onChange={(e) => handleAuthorizedPatientChange(index, 'dob', e.target.value)}
                    />
                  </div>
                  {formData.authorizedPatients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAuthorizedPatient(index)}
                      className="mt-6"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Authorization Agreement */}
        <Card>
          <CardHeader>
            <CardTitle>Authorization Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-2">Important Authorization</p>
                  <p>
                    By signing below, you authorize West County Spine & Joint Chiropractic Clinic to keep your signature 
                    and credit card information securely in your account. You authorize charges for copays at each visit 
                    and outstanding balances when due.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                If the credit card changes, expires, or is denied, I agree to immediately provide a new, valid credit card 
                which may be charged over the telephone with the same authorization as the original card.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="immediateCharging"
                checked={formData.immediateCharging}
                onCheckedChange={(checked) => handleInputChange('immediateCharging', checked)}
              />
              <Label htmlFor="immediateCharging" className="text-sm">
                Please check this box if you prefer not to receive a statement and would like us to bill your credit card 
                immediately for any balances due after the processing of your insurance.
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Digital Signature */}
        <Card>
          <CardHeader>
            <CardTitle>Digital Signature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="signature">Credit Card Holder's Full Name (Digital Signature) *</Label>
              <Input
                id="signature"
                value={formData.signature}
                onChange={(e) => handleInputChange('signature', e.target.value)}
                placeholder="Type your full name as digital signature"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                By typing your name above, you agree to the terms and authorize the charges as described.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Toggle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFAQ(!showFAQ)}
              >
                {showFAQ ? 'Hide FAQ' : 'View FAQ'}
              </Button>
            </div>
          </CardHeader>
          {showFAQ && (
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Do I have to leave my credit card information to be a patient at this practice?</h4>
                  <p className="text-gray-700">Yes. This is our policy and it is a growing trend in the healthcare industry. Insurance reimbursements are declining and there has been a large increase in patient deductibles.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-gray-900">How much and when will money be taken from my account?</h4>
                  <p className="text-gray-700">Your estimated per visit copay will be communicated to you on or around your 2nd visit. This amount will be charged at the time of each visit. Once insurance processes claims, any additional patient responsibility will be charged.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-gray-900">How do you safeguard the credit information you keep on file?</h4>
                  <p className="text-gray-700">We use the same methods to guard your credit card information as we do for your medical information. The card information is securely protected by our HIPAA compliant practice management system.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-gray-900">What are the benefits?</h4>
                  <p className="text-gray-700">It saves you time and drives our administrative costs down. The extra time staff has can now be spent on directly helping patients, either over the phone, with insurance claims or in person.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-gray-900">Can I still receive a paper bill by mail?</h4>
                  <p className="text-gray-700">Yes, if you want. You will receive one bill which will show what will be charged unless you contact us telling us what payment method you'd prefer.</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Credit Card Agreement'}
          </Button>
        </div>
      </form>
    </div>
  );
};
