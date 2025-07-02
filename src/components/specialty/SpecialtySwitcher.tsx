import React from 'react';

export interface SpecialtyOption {
  id: string;
  name: string;
  brandName: string;
  description: string;
  color: string;
  specialty: string;
}

const specialtyOptions: SpecialtyOption[] = [
  {
    id: 'chiropractic',
    name: 'Chiropractic Care',
    brandName: 'Chiropractic IQ',
    description: 'Optimizing spinal health and mobility',
    color: 'green',
    specialty: 'chiropractic-care'
  },
  {
    id: 'dental',
    name: 'Dental Care',
    brandName: 'Dental IQ',
    description: 'Complete oral health management',
    color: 'blue',
    specialty: 'dental-care'
  },
  {
    id: 'dental-sleep',
    name: 'Dental Sleep Medicine',
    brandName: 'Dental Sleep IQ',
    description: 'Restoring quality sleep through dental solutions',
    color: 'purple',
    specialty: 'dental-sleep-medicine'
  },
  {
    id: 'appointment',
    name: 'Smart Scheduling',
    brandName: 'Appointment IQ',
    description: 'AI-powered scheduling and booking',
    color: 'indigo',
    specialty: 'appointment-scheduling'
  }
];

interface SpecialtySwitcherProps {
  currentSpecialty: string;
  onSpecialtyChange: (specialty: SpecialtyOption) => void;
}

export const SpecialtySwitcher: React.FC<SpecialtySwitcherProps> = ({
  currentSpecialty,
  onSpecialtyChange
}) => {
  const currentOption = specialtyOptions.find(opt => opt.specialty === currentSpecialty) || specialtyOptions[0];

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      border: '2px solid #333',
      padding: '20px',
      margin: '20px 0',
      borderRadius: '8px'
    }}>
      {/* Brand Name - Simple Text */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0 0 10px 0',
        color: '#333'
      }}>
        {currentOption.brandName}
      </h1>
      
      {/* Description - Simple Text */}
      <p style={{
        fontSize: '14px',
        margin: '0 0 20px 0',
        color: '#666'
      }}>
        {currentOption.description}
      </p>
      
      {/* Dropdown - Simple HTML Select */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px', fontSize: '14px' }}>
          Switch Specialty:
        </label>
        <select 
          value={currentOption.id}
          onChange={(e) => {
            const selected = specialtyOptions.find(opt => opt.id === e.target.value);
            if (selected) {
              onSpecialtyChange(selected);
            }
          }}
          style={{
            padding: '5px 10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          {specialtyOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.brandName}
            </option>
          ))}
        </select>
      </div>
      
      {/* Debug Info */}
      <div style={{
        fontSize: '12px',
        color: '#999',
        marginTop: '10px'
      }}>
        Current: {currentSpecialty} | Selected: {currentOption.id}
      </div>
    </div>
  );
};