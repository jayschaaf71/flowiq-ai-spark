
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientRecords } from "./PatientRecords";
import { SOAPNotes } from "./SOAPNotes";
import { MigrationDashboard } from "./MigrationDashboard";
import { EHRAnalytics } from "./EHRAnalytics";
import { AppointmentIntegration } from "./AppointmentIntegration";

export const EHRDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">EHR Management</h1>
        <p className="text-muted-foreground">
          Comprehensive electronic health records system with integrated patient management
        </p>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patients">Patient Records</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
          <TabsTrigger value="migration">Data Migration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <PatientRecords />
        </TabsContent>

        <TabsContent value="appointments">
          <Appointment

 />
        </TabsContent>

        <TabsContent value="soap">
          <SOAPNotes />
        </TabsContent>

        <TabsContent value="migration">
          <MigrationDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <EHRAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
