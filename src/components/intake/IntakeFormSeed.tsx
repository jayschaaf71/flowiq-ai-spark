
import { useEffect } from 'react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useTenantConfig } from '@/utils/tenantConfig';
import type { Json } from '@/integrations/supabase/types';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  helpText?: string;
}

export const IntakeFormSeed = () => {
  const { createForm, forms } = useIntakeForms();
  const tenantConfig = useTenantConfig();

  const westCountyForms = [
    {
      title: "New Patient Intake Form",
      description: "Complete patient information and medical history for new patients",
      form_fields: [
        {
          id: "full_name",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true
        },
        {
          id: "date_of_birth",
          type: "date",
          label: "Date of Birth",
          required: true
        },
        {
          id: "gender",
          type: "radio",
          label: "Gender",
          required: true,
          options: ["Male", "Female", "Other", "Prefer not to say"]
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          placeholder: "(555) 123-4567",
          required: true
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "your.email@example.com",
          required: true
        },
        {
          id: "address",
          type: "textarea",
          label: "Address",
          placeholder: "Street address, City, State, ZIP",
          required: true
        },
        {
          id: "emergency_contact_name",
          type: "text",
          label: "Emergency Contact Name",
          placeholder: "Full name of emergency contact",
          required: true
        },
        {
          id: "emergency_contact_phone",
          type: "phone",
          label: "Emergency Contact Phone",
          placeholder: "(555) 123-4567",
          required: true
        },
        {
          id: "chief_complaint",
          type: "textarea",
          label: "What brings you in today?",
          placeholder: "Describe your main concern or reason for visit",
          required: true
        },
        {
          id: "pain_level",
          type: "range",
          label: "Current Pain Level (0-10)",
          required: false,
          validation: { min: 0, max: 10 }
        },
        {
          id: "insurance_provider",
          type: "text",
          label: "Insurance Provider",
          placeholder: "Name of your insurance company",
          required: true
        },
        {
          id: "insurance_id",
          type: "text",
          label: "Insurance ID Number",
          placeholder: "Your insurance member ID",
          required: true
        }
      ] as FormField[],
      is_active: true
    },
    {
      title: "Medical History Questionnaire",
      description: "Detailed medical history and current health status",
      form_fields: [
        {
          id: "current_medications",
          type: "textarea",
          label: "Current Medications",
          placeholder: "List all medications you are currently taking, including dosages",
          required: false
        },
        {
          id: "allergies",
          type: "textarea",
          label: "Allergies",
          placeholder: "List any allergies to medications, foods, or other substances",
          required: false
        },
        {
          id: "previous_surgeries",
          type: "textarea",
          label: "Previous Surgeries",
          placeholder: "List any previous surgeries and dates",
          required: false
        },
        {
          id: "family_history",
          type: "textarea",
          label: "Family Medical History",
          placeholder: "Relevant family medical history",
          required: false
        },
        {
          id: "smoking_status",
          type: "radio",
          label: "Do you smoke?",
          required: true,
          options: ["Never", "Former smoker", "Current smoker"]
        },
        {
          id: "alcohol_use",
          type: "radio",
          label: "Alcohol use",
          required: true,
          options: ["Never", "Rarely", "Socially", "Regularly"]
        },
        {
          id: "exercise_frequency",
          type: "select",
          label: "How often do you exercise?",
          required: false,
          options: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week"]
        }
      ] as FormField[],
      is_active: true
    },
    {
      title: "Pain Assessment Form",
      description: "Detailed assessment of your pain and symptoms",
      form_fields: [
        {
          id: "pain_location",
          type: "checkbox",
          label: "Where is your pain located?",
          required: true,
          options: ["Lower back", "Upper back", "Neck", "Shoulders", "Arms", "Legs", "Hips", "Other"]
        },
        {
          id: "pain_duration",
          type: "radio",
          label: "How long have you had this pain?",
          required: true,
          options: ["Less than 1 week", "1-4 weeks", "1-3 months", "3-6 months", "More than 6 months"]
        },
        {
          id: "pain_onset",
          type: "radio",
          label: "How did your pain start?",
          required: true,
          options: ["Sudden onset", "Gradual onset", "After injury/accident", "Unknown"]
        },
        {
          id: "pain_intensity_morning",
          type: "range",
          label: "Pain Level in the Morning (0-10)",
          required: true,
          validation: { min: 0, max: 10 }
        },
        {
          id: "pain_intensity_evening",
          type: "range",
          label: "Pain Level in the Evening (0-10)",
          required: true,
          validation: { min: 0, max: 10 }
        },
        {
          id: "pain_description",
          type: "checkbox",
          label: "How would you describe your pain?",
          required: false,
          options: ["Sharp", "Dull", "Burning", "Throbbing", "Shooting", "Stabbing", "Cramping"]
        },
        {
          id: "activities_affected",
          type: "checkbox",
          label: "What activities are affected by your pain?",
          required: false,
          options: ["Walking", "Sitting", "Standing", "Sleeping", "Work", "Exercise", "Daily activities"]
        }
      ] as FormField[],
      is_active: true
    }
  ];

  useEffect(() => {
    const seedForms = async () => {
      // Only seed if we don't have forms already
      if (forms.length === 0) {
        console.log('Seeding intake forms for West County Spine and Joint...');
        
        for (const formData of westCountyForms) {
          try {
            await createForm({
              title: formData.title,
              description: formData.description,
              form_fields: formData.form_fields as Json,
              is_active: formData.is_active
            });
            console.log(`Created form: ${formData.title}`);
          } catch (error) {
            console.error(`Error creating form ${formData.title}:`, error);
          }
        }
      }
    };

    seedForms();
  }, [forms.length, createForm]);

  return null; // This component doesn't render anything
};
