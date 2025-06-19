
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalHistory } from "./MedicalHistory";
import { PrescriptionManagement } from "./PrescriptionManagement";
import { FileAttachments } from "./FileAttachments";
import { CalendarIntegration } from "./CalendarIntegration";
import { BillingIntegration } from "./BillingIntegration";

interface PatientDetailTabsProps {
  patientId: string;
}

export const PatientDetailTabs = ({ patientId }: PatientDetailTabsProps) => {
  return (
    <Tabs defaultValue="history" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="history">Medical History</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="history">
        <MedicalHistory patientId={patientId} />
      </TabsContent>

      <TabsContent value="prescriptions">
        <PrescriptionManagement patientId={patientId} />
      </TabsContent>

      <TabsContent value="files">
        <FileAttachments patientId={patientId} />
      </TabsContent>

      <TabsContent value="calendar">
        <CalendarIntegration />
      </TabsContent>

      <TabsContent value="billing">
        <BillingIntegration />
      </TabsContent>
    </Tabs>
  );
};
