
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { PatientData } from "@/types/patient-onboarding";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useState, useEffect } from "react";

interface PersonalInformationStepProps {
  patientData: PatientData;
  setPatientData: (data: PatientData | ((prev: PatientData) => PatientData)) => void;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
}

export const PersonalInformationStep = ({ patientData, setPatientData }: PersonalInformationStepProps) => {
  const { handleError } = useErrorHandler();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateField = (field: keyof PatientData, value: string) => {
    const errors: ValidationErrors = { ...validationErrors };

    switch (field) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        } else {
          delete errors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete errors.lastName;
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          errors.dateOfBirth = 'Date of birth is required';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          
          if (birthDate > today) {
            errors.dateOfBirth = 'Date of birth cannot be in the future';
          } else if (age > 150) {
            errors.dateOfBirth = 'Please enter a valid date of birth';
          } else if (age < 0) {
            errors.dateOfBirth = 'Please enter a valid date of birth';
          } else {
            delete errors.dateOfBirth;
          }
        }
        break;

      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Phone number is required';
        } else {
          // Basic phone validation - remove all non-digits and check length
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length < 10) {
            errors.phone = 'Please enter a valid phone number';
          } else {
            delete errors.phone;
          }
        }
        break;

      case 'email':
        if (!value.trim()) {
          errors.email = 'Email address is required';
        } else {
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          if (!emailRegex.test(value)) {
            errors.email = 'Please enter a valid email address';
          } else {
            delete errors.email;
          }
        }
        break;
    }

    setValidationErrors(errors);
  };

  const handleInputChange = (field: keyof PatientData, value: string) => {
    try {
      setPatientData(prev => ({ ...prev, [field]: value }));
      validateField(field, value);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(`Failed to update ${field}`));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return phoneNumber;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={patientData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
            className={validationErrors.firstName ? 'border-red-500' : ''}
          />
          {validationErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={patientData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
            className={validationErrors.lastName ? 'border-red-500' : ''}
          />
          {validationErrors.lastName && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium">
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={patientData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={validationErrors.dateOfBirth ? 'border-red-500' : ''}
          />
          {validationErrors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <Label htmlFor="gender" className="text-sm font-medium">
            Gender
          </Label>
          <Select 
            value={patientData.gender} 
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number *
          </Label>
          <Input
            id="phone"
            value={patientData.phone}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              handleInputChange('phone', formatted);
            }}
            placeholder="(555) 123-4567"
            maxLength={14}
            className={validationErrors.phone ? 'border-red-500' : ''}
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={patientData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="email@example.com"
            className={validationErrors.email ? 'border-red-500' : ''}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};
