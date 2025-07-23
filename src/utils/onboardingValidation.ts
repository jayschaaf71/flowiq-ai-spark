
export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export const validatePracticeDetails = (practiceData: any): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required field validation
  if (!practiceData.practiceName?.trim()) {
    errors.push({
      field: 'practiceName',
      message: 'Practice name is required',
      type: 'error'
    });
  }

  if (!practiceData.email?.trim()) {
    errors.push({
      field: 'email',
      message: 'Email address is required',
      type: 'error'
    });
  } else if (!isValidEmail(practiceData.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
      type: 'error'
    });
  }

  // Format validation
  if (practiceData.phone && !isValidPhone(practiceData.phone)) {
    warnings.push({
      field: 'phone',
      message: 'Phone number format may not be valid',
      type: 'warning'
    });
  }

  // Business logic validation
  if (practiceData.practiceName?.length < 2) {
    errors.push({
      field: 'practiceName',
      message: 'Practice name must be at least 2 characters',
      type: 'error'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateTeamConfig = (teamConfig: any): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (teamConfig.inviteTeam && teamConfig.teamMembers?.length === 0) {
    warnings.push({
      field: 'teamMembers',
      message: 'You selected to invite team members but haven\'t added any',
      type: 'warning'
    });
  }

  teamConfig.teamMembers?.forEach((member: any, index: number) => {
    if (!member.name?.trim()) {
      errors.push({
        field: `teamMembers.${index}.name`,
        message: `Team member ${index + 1} name is required`,
        type: 'error'
      });
    }

    if (!member.email?.trim()) {
      errors.push({
        field: `teamMembers.${index}.email`,
        message: `Team member ${index + 1} email is required`,
        type: 'error'
      });
    } else if (!isValidEmail(member.email)) {
      errors.push({
        field: `teamMembers.${index}.email`,
        message: `Team member ${index + 1} email is not valid`,
        type: 'error'
      });
    }

    if (!member.role) {
      errors.push({
        field: `teamMembers.${index}.role`,
        message: `Team member ${index + 1} role is required`,
        type: 'error'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateSpecialtySelection = (specialty: any): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!specialty) {
    errors.push({
      field: 'specialty',
      message: 'Please select your practice specialty',
      type: 'error'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
};

// Helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9]?[\d\s\-()]{7,15}$/;
  return phoneRegex.test(phone);
};

export const getStepValidation = (step: string, data: any): ValidationResult => {
  switch (step) {
    case 'specialty':
      return validateSpecialtySelection(data.specialty);
    case 'practice':
      return validatePracticeDetails(data.practiceData);
    case 'team':
      return validateTeamConfig(data.teamConfig);
    default:
      return { isValid: true, errors: [], warnings: [] };
  }
};
