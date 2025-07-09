import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSampleDataGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const generateChiropracticData = async (tenantId: string) => {
    setLoading(true);
    try {
      // Sample patients for chiropractic
      const chiropracticPatients = [
        {
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          date_of_birth: '1985-03-15',
          address: '123 Main St',
          city: 'Springfield',
          state: 'MO',
          zip_code: '65801',
          specialty: 'chiropractic',
          medical_history: 'Lower back pain, previous car accident',
          allergies: 'None known',
          tenant_id: tenantId
        },
        {
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '(555) 234-5678',
          date_of_birth: '1978-08-22',
          address: '456 Oak Ave',
          city: 'Springfield',
          state: 'MO',
          zip_code: '65802',
          specialty: 'chiropractic',
          medical_history: 'Neck pain, headaches, workplace injury',
          allergies: 'Latex',
          tenant_id: tenantId
        },
        {
          first_name: 'Michael',
          last_name: 'Davis',
          email: 'michael.davis@email.com',
          phone: '(555) 345-6789',
          date_of_birth: '1992-12-10',
          address: '789 Pine St',
          city: 'Springfield',
          state: 'MO',
          zip_code: '65803',
          specialty: 'chiropractic',
          medical_history: 'Sports injury, shoulder impingement',
          allergies: 'Penicillin',
          tenant_id: tenantId
        }
      ];

      // Insert patients
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .insert(chiropracticPatients)
        .select();

      if (patientsError) throw patientsError;

      // Sample providers
      const chiropracticProviders = [
        {
          first_name: 'Dr. Mark',
          last_name: 'Thompson',
          email: 'mark.thompson@westcountyspine.com',
          phone: '(555) 987-6543',
          specialty: 'Chiropractic Medicine',
          license_number: 'DC-12345',
          npi_number: '1234567890',
          tenant_id: tenantId
        },
        {
          first_name: 'Dr. Lisa',
          last_name: 'Rodriguez',
          email: 'lisa.rodriguez@westcountyspine.com',
          phone: '(555) 876-5432',
          specialty: 'Sports Chiropractic',
          license_number: 'DC-12346',
          npi_number: '1234567891',
          tenant_id: tenantId
        }
      ];

      const { data: providers, error: providersError } = await supabase
        .from('providers')
        .insert(chiropracticProviders)
        .select();

      if (providersError) throw providersError;

      // Sample appointments
      const appointments = patients?.map((patient, index) => ({
        patient_id: patient.id,
        provider_id: providers?.[index % providers.length]?.id,
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: ['09:00', '10:30', '14:00'][index % 3],
        duration: 60,
        appointment_type: ['Initial Consultation', 'Follow-up', 'Adjustment'][index % 3],
        status: 'scheduled',
        patient_name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email,
        phone: patient.phone,
        tenant_id: tenantId
      }));

      if (appointments) {
        const { error: appointmentsError } = await supabase
          .from('appointments')
          .insert(appointments);

        if (appointmentsError) throw appointmentsError;
      }

      toast({
        title: "Chiropractic Sample Data Generated",
        description: `Created ${patients.length} patients, ${providers.length} providers, and ${appointments?.length || 0} appointments`,
      });

      return { patients, providers, appointments };
    } catch (error) {
      console.error("Error generating chiropractic data:", error);
      toast({
        title: "Error",
        description: "Failed to generate chiropractic sample data",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateDentalSleepData = async (tenantId: string) => {
    setLoading(true);
    try {
      // Sample patients for dental sleep medicine
      const dentalSleepPatients = [
        {
          first_name: 'Robert',
          last_name: 'Wilson',
          email: 'robert.wilson@email.com',
          phone: '(555) 456-7890',
          date_of_birth: '1970-05-18',
          address: '321 Elm St',
          city: 'Des Moines',
          state: 'IA',
          zip_code: '50309',
          specialty: 'dental-sleep',
          medical_history: 'Sleep apnea, snoring, CPAP intolerance',
          allergies: 'None',
          tenant_id: tenantId
        },
        {
          first_name: 'Jennifer',
          last_name: 'Brown',
          email: 'jennifer.brown@email.com',
          phone: '(555) 567-8901',
          date_of_birth: '1965-11-03',
          address: '654 Maple Ave',
          city: 'Des Moines',
          state: 'IA',
          zip_code: '50310',
          specialty: 'dental-sleep',
          medical_history: 'Moderate OSA, grinding, TMJ dysfunction',
          allergies: 'Sulfa drugs',
          tenant_id: tenantId
        },
        {
          first_name: 'David',
          last_name: 'Miller',
          email: 'david.miller@email.com',
          phone: '(555) 678-9012',
          date_of_birth: '1980-07-25',
          address: '987 Cedar Ln',
          city: 'Des Moines',
          state: 'IA',
          zip_code: '50311',
          specialty: 'dental-sleep',
          medical_history: 'Severe sleep apnea, hypertension',
          allergies: 'Codeine',
          tenant_id: tenantId
        }
      ];

      // Insert patients
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .insert(dentalSleepPatients)
        .select();

      if (patientsError) throw patientsError;

      // Sample providers
      const dentalSleepProviders = [
        {
          first_name: 'Dr. Amanda',
          last_name: 'Chen',
          email: 'amanda.chen@midwestdentalsleep.com',
          phone: '(555) 789-0123',
          specialty: 'Dental Sleep Medicine',
          license_number: 'DDS-54321',
          npi_number: '9876543210',
          tenant_id: tenantId
        },
        {
          first_name: 'Dr. James',
          last_name: 'Parker',
          email: 'james.parker@midwestdentalsleep.com',
          phone: '(555) 890-1234',
          specialty: 'Sleep Medicine',
          license_number: 'MD-98765',
          npi_number: '9876543211',
          tenant_id: tenantId
        }
      ];

      const { data: providers, error: providersError } = await supabase
        .from('providers')
        .insert(dentalSleepProviders)
        .select();

      if (providersError) throw providersError;

      // Sample appointments
      const appointments = patients?.map((patient, index) => ({
        patient_id: patient.id,
        provider_id: providers?.[index % providers.length]?.id,
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: ['08:00', '11:00', '15:30'][index % 3],
        duration: 90,
        appointment_type: ['Sleep Consultation', 'Appliance Fitting', 'Follow-up'][index % 3],
        status: 'scheduled',
        patient_name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email,
        phone: patient.phone,
        tenant_id: tenantId
      }));

      if (appointments) {
        const { error: appointmentsError } = await supabase
          .from('appointments')
          .insert(appointments);

        if (appointmentsError) throw appointmentsError;
      }

      toast({
        title: "Dental Sleep Sample Data Generated",
        description: `Created ${patients.length} patients, ${providers.length} providers, and ${appointments?.length || 0} appointments`,
      });

      return { patients, providers, appointments };
    } catch (error) {
      console.error("Error generating dental sleep data:", error);
      toast({
        title: "Error",
        description: "Failed to generate dental sleep sample data",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateChiropracticData,
    generateDentalSleepData
  };
};