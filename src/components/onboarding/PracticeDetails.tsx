
import React from 'react';
import { PracticeDetailsStep } from './PracticeDetailsStep';

interface PracticeDetailsProps {
  practiceData: {
    practiceName: string;
    address: string;
    phone: string;
    email: string;
  };
  onPracticeDetailsUpdate: (data: any) => void;
}

export const PracticeDetails: React.FC<PracticeDetailsProps> = ({ 
  practiceData, 
  onPracticeDetailsUpdate 
}) => {
  // Transform the data structure to match what PracticeDetailsStep expects
  const transformedData = {
    practiceName: practiceData.practiceName,
    addressLine1: practiceData.address,
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: practiceData.phone,
    email: practiceData.email,
    website: '',
    description: '',
    teamSize: ''
  };

  const handleUpdate = (updatedData: any) => {
    // Transform back to the expected format
    const transformedBack = {
      practiceName: updatedData.practiceName,
      address: updatedData.addressLine1,
      phone: updatedData.phone,
      email: updatedData.email
    };
    onPracticeDetailsUpdate(transformedBack);
  };

  return (
    <PracticeDetailsStep
      practiceData={transformedData}
      onUpdatePracticeData={handleUpdate}
    />
  );
};
