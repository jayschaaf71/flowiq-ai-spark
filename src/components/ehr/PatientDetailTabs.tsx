
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalHistory } from "./MedicalHistory";
import { PrescriptionManagement } from "./PrescriptionManagement";
import { FileAttachments } from "./FileAttachments";
import { CalendarIntegration } from "./CalendarIntegration";
import { BillingIntegration } from "./BillingIntegration";
import { SleepQuestionnaires } from "@/components/sleep-medicine/SleepQuestionnaires";
import { SleepStudyManager } from "@/components/sleep-medicine/SleepStudyManager";
import { OralApplianceTracker } from "@/components/sleep-medicine/OralApplianceTracker";
import { SleepIntakeForm } from "@/components/sleep-medicine/SleepIntakeForm";
import { DMEBilling } from "@/components/sleep-medicine/DMEBilling";

interface PatientDetailTabsProps {
  patientId: string;
}

export const PatientDetailTabs = ({ patientId }: PatientDetailTabsProps) => {
  return (
    <Tabs defaultValue="history" className="space-y-6">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="history">Medical History</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="sleep-studies">Sleep Studies</TabsTrigger>
        <TabsTrigger value="appliances">Appliances</TabsTrigger>
        <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
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

      <TabsContent value="sleep-studies">
        <SleepStudyManager patientId={patientId} />
      </TabsContent>

      <TabsContent value="appliances">
        <OralApplianceTracker patientId={patientId} />
      </TabsContent>

      <TabsContent value="questionnaires">
        <SleepQuestionnaires patientId={patientId} />
      </TabsContent>

      <TabsContent value="files">
        <FileAttachments patientId={patientId} />
      </TabsContent>

      <TabsContent value="calendar">
        <CalendarIntegration />
      </TabsContent>

      <TabsContent value="billing">
        <div className="space-y-6">
          <BillingIntegration />
          <DMEBilling patientId={patientId} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
