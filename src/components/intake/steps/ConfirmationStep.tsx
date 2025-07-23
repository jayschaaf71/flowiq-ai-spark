
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Heart, Shield, Camera, Calendar } from 'lucide-react';

import { ConfirmationStepData } from '@/types/intake';

interface ConfirmationStepProps {
  formData: ConfirmationStepData;
  onSubmit: (data: { confirmed: boolean; submittedAt: string }) => void;
  onBack: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, onSubmit, onBack }) => {
  const handleSubmit = () => {
    onSubmit({ confirmed: true, submittedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
        <p className="text-gray-600">
          Please review the information below before submitting your intake form.
        </p>
      </div>

      {/* Personal Information Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}
            </div>
            <div>
              <span className="font-medium">Gender:</span> {formData.gender || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {formData.phone}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Email:</span> {formData.email}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History Summary */}
      {formData.medicalHistory && formData.medicalHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Medical History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.medicalHistory.map((condition, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">{condition.condition}</Badge>
                  {condition.date && <span className="text-sm text-gray-500">({condition.date})</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insurance Summary */}
      {formData.insurance && formData.insurance.provider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Insurance Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Provider:</span> {String(formData.insurance.provider)}</div>
              <div><span className="font-medium">Policy Number:</span> {String(formData.insurance.policyNumber)}</div>
              <div><span className="font-medium">Subscriber:</span> {String(formData.insurance.subscriberName || 'N/A')}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptom Assessment Summary */}
      {formData.symptomAssessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Symptom Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              {formData.symptomAssessment.primaryComplaint && (
                <div>
                  <span className="font-medium">Primary Complaint:</span> {String(formData.symptomAssessment.primaryComplaint)}
                </div>
              )}
              {formData.symptomAssessment.painLevel && (
                <div>
                  <span className="font-medium">Pain Level:</span> {String(formData.symptomAssessment.painLevel)}/10
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Information */}
      {formData.appointmentDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Appointment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Type:</span> {formData.appointmentType}</div>
              <div><span className="font-medium">Date:</span> {formData.appointmentDate}</div>
              <div><span className="font-medium">Time:</span> {formData.appointmentTime}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Ready to Submit</h3>
              <p className="text-sm text-green-800 mb-4">
                By submitting this form, you confirm that all information provided is accurate and complete.
                You'll receive a confirmation email with next steps and any additional instructions.
              </p>
              <div className="text-xs text-green-700">
                <p>• Your information is encrypted and HIPAA compliant</p>
                <p>• You'll receive appointment reminders and instructions</p>
                <p>• Your provider will be notified of your completed intake</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Review
        </Button>
        <Button onClick={handleSubmit} size="lg" className="bg-green-600 hover:bg-green-700">
          Submit Intake Form
        </Button>
      </div>
    </div>
  );
};
