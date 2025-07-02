
import React, { useState } from 'react';
import { PatientsList } from '@/components/patients/PatientsList';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientProfile } from '@/components/patients/PatientProfile';

type ViewMode = 'list' | 'add' | 'profile';

interface Patient {
  id: string;
  patient_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  is_active: boolean;
  created_at: string;
}

const PatientManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('profile');
  };

  const handleAddPatient = () => {
    setViewMode('add');
  };

  const handlePatientCreated = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('profile');
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setViewMode('list');
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'add':
        return (
          <PatientForm
            onSuccess={handlePatientCreated}
            onCancel={handleBackToList}
          />
        );
      case 'profile':
        return selectedPatient ? (
          <PatientProfile
            patientId={selectedPatient.id}
            onBack={handleBackToList}
          />
        ) : null;
      default:
        return (
          <PatientsList
            onSelectPatient={handleSelectPatient}
            onAddPatient={handleAddPatient}
          />
        );
    }
  };

  return (
    <div className="container mx-auto py-6">
      {renderContent()}
    </div>
  );
};

export default PatientManagement;
