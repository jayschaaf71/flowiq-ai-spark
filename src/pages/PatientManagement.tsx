
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientHeader } from "@/components/ehr/PatientHeader";
import { PatientSearchDialog } from "@/components/ehr/PatientSearchDialog";
import { EnhancedPatientDetail } from "@/components/ehr/EnhancedPatientDetail";
import { usePatientSelection } from "@/hooks/usePatientSelection";
import { useRealtime } from "@/hooks/useRealtime";

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
    <div className="space-y-6">
      <PageHeader 
        title="Patient Management"
        subtitle="Comprehensive patient records with integrated onboarding data"
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
          <EnhancedPatientDetail patientId={selectedPatient.id} />
        )}
      </div>
    </div>
  );
};

export default PatientManagement;
