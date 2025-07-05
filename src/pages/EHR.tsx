
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Activity, Stethoscope, Calendar, Users, Calculator } from "lucide-react";
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ChiropracticEHR } from "@/components/ehr/specialty/ChiropracticEHR";
import { DentistryEHR } from "@/components/ehr/specialty/DentistryEHR";
import { DentalSleepEHR } from "@/components/ehr/specialty/DentalSleepEHR";
import { GeneralPracticeEHR } from "@/components/ehr/specialty/GeneralPracticeEHR";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";

const EHR = () => {
  const [activeSection, setActiveSection] = useState("ehr-main");
  const { data: userProfile } = useUserProfile();

  const renderSpecialtyEHR = () => {
    const specialty = userProfile?.specialty;
    
    switch (specialty) {
      case 'Chiropractic':
        return <ChiropracticEHR />;
      case 'Dentistry':
        return <DentistryEHR />;
      case 'Dental Sleep Medicine':
        return <DentalSleepEHR />;
      case 'General Practice':
      default:
        return <GeneralPracticeEHR />;
    }
  };

  return (
    <>
      <PageHeader 
        title="Electronic Health Records"
        subtitle={`${userProfile?.specialty || 'General Practice'} EHR System`}
        badge={userProfile?.specialty || 'General Practice'}
      />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card 
            className={`cursor-pointer transition-all ${activeSection === 'ehr-main' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
            onClick={() => setActiveSection('ehr-main')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Main EHR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Access specialty-specific patient records</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeSection === 'soap-notes' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
            onClick={() => setActiveSection('soap-notes')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                SOAP Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Create and manage clinical documentation</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeSection === 'charts' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
            onClick={() => setActiveSection('charts')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Patient Charts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Access comprehensive patient records</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeSection === 'tools' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
            onClick={() => setActiveSection('tools')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Clinical Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Medical templates and assessment tools</p>
            </CardContent>
          </Card>
        </div>

        {activeSection === 'ehr-main' && renderSpecialtyEHR()}
        
        {activeSection === 'soap-notes' && <SOAPNotes />}
        
        {activeSection === 'charts' && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Charts</CardTitle>
              <CardDescription>Comprehensive patient record management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Activity className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="font-semibold">Vital Signs</p>
                    <p className="text-sm text-muted-foreground">Latest: BP 120/80</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <FileText className="w-8 h-8 text-green-600 mb-2" />
                    <p className="font-semibold">Lab Results</p>
                    <p className="text-sm text-muted-foreground">3 pending results</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="font-semibold">Appointments</p>
                    <p className="text-sm text-muted-foreground">Next: Today 2:00 PM</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Users className="w-8 h-8 text-orange-600 mb-2" />
                    <p className="font-semibold">Care Team</p>
                    <p className="text-sm text-muted-foreground">3 providers assigned</p>
                  </div>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Recent Chart Entries</h3>
                  </div>
                  <div className="divide-y">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Annual Physical Exam</p>
                          <p className="text-sm text-muted-foreground">Dr. Smith - Jan 15, 2024</p>
                        </div>
                        <Badge variant="outline">Complete</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Lab Work Review</p>
                          <p className="text-sm text-muted-foreground">Dr. Johnson - Jan 10, 2024</p>
                        </div>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'tools' && (
          <Card>
            <CardHeader>
              <CardTitle>Clinical Tools</CardTitle>
              <CardDescription>Medical templates and assessment tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <Stethoscope className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-semibold mb-2">SOAP Templates</h3>
                  <p className="text-sm text-muted-foreground">Pre-built templates for documentation</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <Activity className="w-10 h-10 text-green-600 mb-4" />
                  <h3 className="font-semibold mb-2">Assessment Tools</h3>
                  <p className="text-sm text-muted-foreground">Clinical assessment forms and scales</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <FileText className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="font-semibold mb-2">ICD-10 Lookup</h3>
                  <p className="text-sm text-muted-foreground">Quick diagnosis code search</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <Calculator className="w-10 h-10 text-orange-600 mb-4" />
                  <h3 className="font-semibold mb-2">Medical Calculators</h3>
                  <p className="text-sm text-muted-foreground">BMI, dosage, and risk calculators</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <Calendar className="w-10 h-10 text-red-600 mb-4" />
                  <h3 className="font-semibold mb-2">Care Plans</h3>
                  <p className="text-sm text-muted-foreground">Treatment planning templates</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <Users className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="font-semibold mb-2">Referral Forms</h3>
                  <p className="text-sm text-muted-foreground">Specialist referral templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default EHR;
