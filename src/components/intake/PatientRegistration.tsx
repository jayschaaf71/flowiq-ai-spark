
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Clock } from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useTenantConfig } from '@/utils/tenantConfig';
import { PatientFormRenderer } from './PatientFormRenderer';

export const PatientRegistration: React.FC = () => {
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  
  const { forms, loading } = useIntakeForms();
  const tenantConfig = useTenantConfig();

  const selectedForm = forms.find(form => form.id === selectedFormId);

  const handleFormSubmissionComplete = (submission: any) => {
    console.log('Form submitted successfully:', submission);
    setShowForm(false);
    setSelectedFormId('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForm && selectedForm) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Patient Form</h2>
                <p className="text-sm text-gray-600">Complete your intake form</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Back to Forms
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <PatientFormRenderer
          form={selectedForm}
          onSubmissionComplete={handleFormSubmissionComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`text-${tenantConfig.primaryColor}-600`}>
            Patient Registration Portal
          </CardTitle>
          <CardDescription>
            Test and preview intake forms from the patient perspective
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className={`w-16 h-16 mx-auto mb-4 text-${tenantConfig.primaryColor}-600 opacity-50`} />
              <h3 className="text-lg font-medium mb-2">No Forms Available</h3>
              <p className="text-gray-600 mb-4">
                Create intake forms in the Form Builder to see them here.
              </p>
              <Button variant="outline">
                Go to Form Builder
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select an intake form to preview:
                </label>
                <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a form to preview..." />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedForm && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{selectedForm.title}</h3>
                        {selectedForm.description && (
                          <p className="text-gray-600 mb-4">{selectedForm.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>
                            {Array.isArray(selectedForm.form_fields) ? selectedForm.form_fields.length : 0} fields
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Est. 5-10 min</span>
                        </div>
                        <Badge 
                          className={selectedForm.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {selectedForm.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => setShowForm(true)}
                          className={`bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
                          disabled={!selectedForm.is_active}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Start Form Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Forms List */}
      {forms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Forms ({forms.length})</CardTitle>
            <CardDescription>All active intake forms for this practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedFormId(form.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{form.title}</h4>
                      {form.description && (
                        <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={form.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                      >
                        {form.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {Array.isArray(form.form_fields) ? form.form_fields.length : 0} fields
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
