import { useEffect, useCallback } from 'react';
import { SetupData } from '@/pages/PracticeSetup';

const STORAGE_KEY = 'practice-setup-data';
const STEP_STORAGE_KEY = 'practice-setup-step';

export const usePracticeSetupPersistence = (
  setupData: SetupData,
  setSetupData: (data: SetupData) => void,
  currentStep: number,
  setCurrentStep: (step: number) => void
) => {
  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading saved practice setup data...');
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
    
    console.log('Saved data:', savedData);
    console.log('Saved step:', savedStep);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as SetupData;
        console.log('Restoring setup data:', parsedData);
        setSetupData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved setup data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    if (savedStep) {
      try {
        const parsedStep = parseInt(savedStep, 10);
        console.log('Restoring step:', parsedStep);
        if (parsedStep >= 1 && parsedStep <= 5) {
          setCurrentStep(parsedStep);
        }
      } catch (error) {
        console.error('Failed to parse saved step:', error);
        localStorage.removeItem(STEP_STORAGE_KEY);
      }
    }
  }, []);

  // Save data to localStorage whenever setupData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setupData));
  }, [setupData]);

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
  }, []);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) !== null || localStorage.getItem(STEP_STORAGE_KEY) !== null;
  }, []);

  return {
    clearSavedData,
    hasSavedData
  };
};