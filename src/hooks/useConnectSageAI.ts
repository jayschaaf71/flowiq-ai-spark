import { useSageAI } from '@/contexts/SageAIContext';
import { useCallback } from 'react';

export const useConnectSageAI = () => {
    const baseSage = useSageAI();

    const scheduleService = useCallback(async (customerId: string, serviceType: string, date?: string) => {
        try {
            const response = await baseSage.sendMessage(
                `Schedule a ${serviceType} service for customer ${customerId}${date ? ` on ${date}` : ''}`,
                {
                    applicationType: 'connect',
                    availableActions: ['schedule_service']
                }
            );
            return response;
        } catch (error) {
            console.error('Error scheduling service:', error);
            throw error;
        }
    }, [baseSage]);

    const manageCustomer = useCallback(async (action: string, customerId?: string, query?: string) => {
        try {
            let message = '';
            switch (action) {
                case 'search':
                    message = `Find customer information for: ${query}`;
                    break;
                case 'add':
                    message = 'Add a new customer to the system';
                    break;
                case 'update':
                    message = `Update customer information for customer ${customerId}`;
                    break;
                case 'view':
                    message = `Show customer details for customer ${customerId}`;
                    break;
                default:
                    message = `Manage customer: ${action}`;
            }

            const response = await baseSage.sendMessage(message, {
                applicationType: 'connect',
                availableActions: ['manage_customer']
            });
            return response;
        } catch (error) {
            console.error('Error managing customer:', error);
            throw error;
        }
    }, [baseSage]);

    const processPayment = useCallback(async (invoiceId: string, amount?: number) => {
        try {
            const response = await baseSage.sendMessage(
                `Process payment for invoice ${invoiceId}${amount ? ` for $${amount}` : ''}`,
                {
                    applicationType: 'connect',
                    availableActions: ['process_payment']
                }
            );
            return response;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }, [baseSage]);

    const getBusinessAnalytics = useCallback(async (type: string = 'overview') => {
        try {
            const response = await baseSage.sendMessage(
                `Show me ${type} business analytics`,
                {
                    applicationType: 'connect',
                    availableActions: ['business_analytics']
                }
            );
            return response;
        } catch (error) {
            console.error('Error getting business analytics:', error);
            throw error;
        }
    }, [baseSage]);

    return {
        ...baseSage,
        scheduleService,
        manageCustomer,
        processPayment,
        getBusinessAnalytics
    };
}; 