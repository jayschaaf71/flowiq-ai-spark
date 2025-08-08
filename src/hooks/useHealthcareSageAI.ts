import { useSageAI } from '@/contexts/SageAIContext';
import { useCallback } from 'react';

export const useHealthcareSageAI = () => {
    const baseSage = useSageAI();

    const searchPatient = useCallback(async (query: string) => {
        try {
            const response = await baseSage.sendMessage(
                `Find patient records for: ${query}`,
                {
                    applicationType: 'healthcare',
                    availableActions: ['search_patients']
                }
            );
            return response;
        } catch (error) {
            console.error('Error searching patient:', error);
            throw error;
        }
    }, [baseSage]);

    const scheduleAppointment = useCallback(async (patientId: string, appointmentType: string, date?: string) => {
        try {
            const response = await baseSage.sendMessage(
                `Schedule a ${appointmentType} appointment for patient ${patientId}${date ? ` on ${date}` : ''}`,
                {
                    applicationType: 'healthcare',
                    availableActions: ['schedule_appointment']
                }
            );
            return response;
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            throw error;
        }
    }, [baseSage]);

    const generateSOAP = useCallback(async (appointmentId: string) => {
        try {
            const response = await baseSage.sendMessage(
                `Generate SOAP notes for appointment ${appointmentId}`,
                {
                    applicationType: 'healthcare',
                    availableActions: ['generate_document']
                }
            );
            return response;
        } catch (error) {
            console.error('Error generating SOAP:', error);
            throw error;
        }
    }, [baseSage]);

    const getClinicalGuidance = useCallback(async (topic: string) => {
        try {
            const response = await baseSage.sendMessage(
                `Provide clinical guidance on: ${topic}`,
                {
                    applicationType: 'healthcare',
                    availableActions: ['provide_guidance']
                }
            );
            return response;
        } catch (error) {
            console.error('Error getting clinical guidance:', error);
            throw error;
        }
    }, [baseSage]);

    const generateDocument = useCallback(async (documentType: string, patientInfo?: any) => {
        try {
            const response = await baseSage.sendMessage(
                `Generate a ${documentType} document${patientInfo ? ` for patient ${patientInfo.id}` : ''}`,
                {
                    applicationType: 'healthcare',
                    availableActions: ['generate_document']
                }
            );
            return response;
        } catch (error) {
            console.error('Error generating document:', error);
            throw error;
        }
    }, [baseSage]);

    return {
        ...baseSage,
        searchPatient,
        scheduleAppointment,
        generateSOAP,
        getClinicalGuidance,
        generateDocument
    };
}; 