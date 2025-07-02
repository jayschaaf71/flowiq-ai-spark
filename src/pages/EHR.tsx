
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Activity, Stethoscope } from "lucide-react";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";
import { useState } from "react";

const EHR = () => {
  const [activeSection, setActiveSection] = useState("soap-notes");

  return (
    <>
      <PageHeader 
        title="Electronic Health Records"
        subtitle="Patient records, SOAP notes, and clinical documentation"
      />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm text-gray-600">Create and manage clinical notes</p>
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

        {activeSection === 'soap-notes' && <SOAPNotes />}
        
        {activeSection === 'charts' && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Charts</CardTitle>
              <CardDescription>Comprehensive patient record management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Patient Charts Coming Soon</p>
                <p className="text-sm">Full patient chart functionality will be available here</p>
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
              <div className="text-center py-8 text-gray-500">
                <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Clinical Tools Coming Soon</p>
                <p className="text-sm">Medical templates and assessment tools will be available here</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default EHR;
