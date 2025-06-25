
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const PatientManagement = () => {
  return (
    <Layout>
      <PageHeader 
        title="Patient Management"
        subtitle="Manage patient records, communications, and care coordination"
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search Patients
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Patient Management System
            </CardTitle>
            <CardDescription>
              Comprehensive patient record management and communication tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Patient Management Coming Soon</p>
              <p className="text-sm">Full patient management features will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientManagement;
