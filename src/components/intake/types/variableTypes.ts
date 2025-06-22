
export interface CustomVariable {
  id: string;
  key: string;
  label: string;
  description: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'select';
  defaultValue?: string;
  options?: string[]; // For select type
  category: string;
  isSystem: boolean;
}

export interface VariableMapping {
  templateId: string;
  variableId: string;
  customValue?: string;
}

export const systemVariables: CustomVariable[] = [
  {
    id: 'patient-name',
    key: 'patientName',
    label: 'Patient Name',
    description: 'Full name of the patient',
    type: 'text',
    category: 'Patient Info',
    isSystem: true
  },
  {
    id: 'appointment-date',
    key: 'appointmentDate',
    label: 'Appointment Date',
    description: 'Date of the appointment',
    type: 'date',
    category: 'Appointment',
    isSystem: true
  },
  {
    id: 'practice-name',
    key: 'practiceName',
    label: 'Practice Name',
    description: 'Name of the medical practice',
    type: 'text',
    defaultValue: 'Your Practice Name',
    category: 'Practice Info',
    isSystem: true
  }
];
