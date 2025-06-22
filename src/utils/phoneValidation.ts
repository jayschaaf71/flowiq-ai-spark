
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.length === 10) {
    // US number without country code
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US number with country code
    return `+${digits}`;
  } else if (digits.length > 11) {
    // International number
    return `+${digits}`;
  }
  
  // Return as-is if can't format
  return phone;
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, message: 'Phone number is required' };
  }

  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 10) {
    return { isValid: false, message: 'Phone number must be at least 10 digits' };
  }
  
  if (digits.length > 15) {
    return { isValid: false, message: 'Phone number cannot exceed 15 digits' };
  }

  // Basic US number validation
  if (digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))) {
    const localNumber = digits.length === 11 ? digits.slice(1) : digits;
    const areaCode = localNumber.slice(0, 3);
    const exchange = localNumber.slice(3, 6);
    
    // Check for invalid area codes and exchanges
    if (areaCode.startsWith('0') || areaCode.startsWith('1')) {
      return { isValid: false, message: 'Invalid area code' };
    }
    
    if (exchange.startsWith('0') || exchange.startsWith('1')) {
      return { isValid: false, message: 'Invalid exchange code' };
    }
  }

  return { isValid: true };
};

export const formatPhoneForDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    const localDigits = digits.slice(1);
    return `+1 (${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6)}`;
  }
  
  return phone;
};
