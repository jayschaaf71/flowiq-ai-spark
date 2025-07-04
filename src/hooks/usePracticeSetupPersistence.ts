import { useEffect, useCallback } from 'react';
import { SetupData } from '@/pages/PracticeSetup';

const STORAGE_KEY = 'practice-setup-data';

export const usePracticeSetupPersistence = (
  setupData: SetupData,
  setSetupData: (data: SetupData) => void
) => {
  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as SetupData;
        setSetupData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved setup data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [setSetupData]);

  // Save data to localStorage whenever setupData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setupData));
  }, [setupData]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  return {
    clearSavedData,
    hasSavedData
  };
};