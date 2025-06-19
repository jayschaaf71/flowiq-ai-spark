
import { useState, useCallback } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Patient = Tables<'patients'>;

interface PatientSelectionState {
  selectedPatient: Patient | null;
  isSearchOpen: boolean;
}

export const usePatientSelection = () => {
  const [state, setState] = useState<PatientSelectionState>({
    selectedPatient: null,
    isSearchOpen: false,
  });

  const selectPatient = useCallback((patient: Patient) => {
    setState(prev => ({
      ...prev,
      selectedPatient: patient,
      isSearchOpen: false,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedPatient: null,
    }));
  }, []);

  const openSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSearchOpen: true,
    }));
  }, []);

  const closeSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSearchOpen: false,
    }));
  }, []);

  return {
    selectedPatient: state.selectedPatient,
    isSearchOpen: state.isSearchOpen,
    selectPatient,
    clearSelection,
    openSearch,
    closeSearch,
  };
};
