
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Activity, Stethoscope } from "lucide-react";

const EHR = () => {
  return (
    <>
      <PageHeader 
        title="Electronic Health Records"
        subtitle="Patient records, SOAP notes, and clinical documentation"
      />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
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

          <Card>
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

          <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>EHR System</CardTitle>
            <CardDescription>
              Comprehensive electronic health record management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">EHR Module Coming Soon</p>
              <p className="text-sm">Full EHR functionality will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EHR;
