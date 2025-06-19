
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientHeader } from "@/components/ehr/PatientHeader";
import { PatientSearchDialog } from "@/components/ehr/PatientSearchDialog";
import { MedicalHistory } from "@/components/ehr/MedicalHistory";
import { FileAttachments } from "@/components/ehr/FileAttachments";
import { AuditTrail } from "@/components/ehr/AuditTrail";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";
import { usePatientSelection } from "@/hooks/usePatientSelection";
import { useRealtime } from "@/hooks/useRealtime";
import { PrescriptionManagement } from "@/components/ehr/PrescriptionManagement";

const PatientManagement = () => {
  const {
    selectedPatient,
    isSearchOpen,
    selectPatient,
    clearSelection,
    openSearch,
    closeSearch,
  } = usePatientSelection();

  // Enable real-time updates
  useRealtime();

  return (
    <Layout>
      <PageHeader 
        title="Patient Management"
        subtitle="Comprehensive patient records and medical history management"
      />
      
      <div className="p-6 space-y-6">
        <PatientHeader 
          patient={selectedPatient}
          onSearchClick={openSearch}
          onClearSelection={clearSelection}
        />
        
        <PatientSearchDialog
          open={isSearchOpen}
          onOpenChange={closeSearch}
          onPatientSelect={selectPatient}
        />
        
        {selectedPatient && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Medical History</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MedicalHistory patientId={selectedPatient.id} />
                <PrescriptionManagement patientId={selectedPatient.id} />
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <MedicalHistory patientId={selectedPatient.id} />
            </TabsContent>
            
            <TabsContent value="medications">
              <PrescriptionManagement patientId={selectedPatient.id} />
            </TabsContent>
            
            <TabsContent value="soap">
              <SOAPNotes patientId={selectedPatient.id} />
            </TabsContent>
            
            <TabsContent value="files">
              <FileAttachments patientId={selectedPatient.id} />
            </TabsContent>
            
            <TabsContent value="audit">
              <AuditTrail tableName="patients" recordId={selectedPatient.id} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default PatientManagement;
