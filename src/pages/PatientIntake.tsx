import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicFormViewer } from '@/components/intake/PublicFormViewer';
import { ArrowLeft, FileText, Clock, CheckCircle, Phone, Mail } from 'lucide-react';

const PatientIntake: React.FC = () => {
  const { formId } = useParams<{ formId?: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Default form ID for demo purposes
  const defaultFormId = 'demo-form';
  const activeFormId = formId || defaultFormId;

  useEffect(() => {
    // Auto-show form if form ID is provided
    if (formId) {
      setShowForm(true);
    }
  }, [formId]);

  const handleStartForm = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Could redirect to a thank you page or reset
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Welcome
            </Button>
          </div>
          
          <PublicFormViewer
            formId={activeFormId}
            onSubmitSuccess={handleFormSuccess}
            className="shadow-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Intake Portal</h1>
              <p className="text-gray-600">Complete your information before your visit</p>
            </div>
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Welcome Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Welcome to Your Patient Intake</CardTitle>
            <CardDescription className="text-blue-100">
              Please complete the intake form before your appointment to help us provide the best care possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">5-10 Minutes</p>
                <p className="text-sm text-blue-100">Average completion time</p>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Secure & Private</p>
                <p className="text-sm text-blue-100">Your data is protected</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Save Time</p>
                <p className="text-sm text-blue-100">Faster check-in process</p>
              </div>
            </div>
            
            <Button
              onClick={handleStartForm}
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              Start Your Intake Form
            </Button>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Personal and contact information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Medical history and current medications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Insurance information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Reason for today's visit</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">support@example.com</span>
                </div>
                <p className="text-xs text-gray-600">
                  Our support team is available Monday-Friday, 8 AM - 6 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Privacy & Security</h3>
                <p className="text-sm text-gray-600">
                  Your personal health information is protected by HIPAA laws and our strict privacy policies. 
                  All data is encrypted and stored securely. We will never share your information without your consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientIntake;