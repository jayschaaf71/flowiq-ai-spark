import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import { useSpecialty } from './SpecialtyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types
export type ApplicationType = 'connect' | 'healthcare' | 'admin';
export type SageMode = 'floating' | 'embedded' | 'fullscreen';

export interface SageContext {
    applicationType: ApplicationType;
    specialty: string;
    tenantId: string;
    currentPage: string;
    userRole: string;
    availableActions: string[];
}

export interface SageResponse {
    response: string;
    action?: {
        type: string;
        data: any;
    };
    timestamp: string;
    sage_status: 'success' | 'error';
}

export interface SageCapability {
    id: string;
    name: string;
    description: string;
    action: string;
    category: 'scheduling' | 'communication' | 'billing' | 'analytics' | 'automation';
}

export interface SageMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    action?: {
        type: string;
        data: any;
    };
}

interface SageAIContextType {
    // Core AI functionality
    sendMessage: (message: string, context?: Partial<SageContext>) => Promise<SageResponse>;
    getCapabilities: () => SageCapability[];
    isAvailable: boolean;
    isLoading: boolean;

    // Application-specific context
    applicationType: ApplicationType;
    specialty: string;
    tenantId: string;

    // UI state
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    mode: SageMode;
    setMode: (mode: SageMode) => void;

    // Chat state
    messages: SageMessage[];
    addMessage: (message: SageMessage) => void;
    clearMessages: () => void;

    // Error handling
    error: string | null;
    clearError: () => void;
}

const SageAIContext = createContext<SageAIContextType | undefined>(undefined);

export const useSageAI = () => {
    const context = useContext(SageAIContext);
    if (context === undefined) {
        throw new Error('useSageAI must be used within a SageAIProvider');
    }
    return context;
};

interface SageAIProviderProps {
    children: ReactNode;
}

export const SageAIProvider: React.FC<SageAIProviderProps> = ({ children }) => {
    const { specialty, tenantConfig } = useSpecialty();

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<SageMode>('floating');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<SageMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm Sage, your AI assistant. I can help you with scheduling, customer management, and business operations. What can I help you with today?",
            timestamp: new Date(),
        }
    ]);
    const [error, setError] = useState<string | null>(null);

    // Determine application type based on hostname
    const applicationType = useMemo((): ApplicationType => {
        const hostname = window.location.hostname;
        if (hostname === 'connect.flow-iq.ai') return 'connect';
        if (hostname === 'app.flow-iq.ai') return 'admin';
        return 'healthcare';
    }, []);

    // Get capabilities based on application type
    const getCapabilities = useCallback((): SageCapability[] => {
        const baseCapabilities: SageCapability[] = [
            {
                id: 'general-help',
                name: 'General Help',
                description: 'Get help with any feature or workflow',
                action: 'How can I help you today?',
                category: 'automation'
            }
        ];

        switch (applicationType) {
            case 'connect':
                return [
                    ...baseCapabilities,
                    {
                        id: 'schedule-service',
                        name: 'Schedule Service',
                        description: 'Book appointments and manage scheduling',
                        action: 'Schedule a service appointment',
                        category: 'scheduling'
                    },
                    {
                        id: 'manage-customer',
                        name: 'Manage Customer',
                        description: 'Search and manage customer records',
                        action: 'Find customer information',
                        category: 'communication'
                    },
                    {
                        id: 'process-payment',
                        name: 'Process Payment',
                        description: 'Handle payments and invoices',
                        action: 'Process a payment',
                        category: 'billing'
                    },
                    {
                        id: 'business-analytics',
                        name: 'Business Analytics',
                        description: 'View business insights and reports',
                        action: 'Show me business analytics',
                        category: 'analytics'
                    }
                ];

            case 'healthcare':
                return [
                    ...baseCapabilities,
                    {
                        id: 'search-patient',
                        name: 'Search Patient',
                        description: 'Find patient records and information',
                        action: 'Find patient records',
                        category: 'communication'
                    },
                    {
                        id: 'schedule-appointment',
                        name: 'Schedule Appointment',
                        description: 'Book and manage appointments',
                        action: 'Schedule an appointment',
                        category: 'scheduling'
                    },
                    {
                        id: 'generate-soap',
                        name: 'Generate SOAP',
                        description: 'Create clinical documentation',
                        action: 'Generate SOAP notes',
                        category: 'automation'
                    },
                    {
                        id: 'clinical-guidance',
                        name: 'Clinical Guidance',
                        description: 'Get treatment protocols and guidance',
                        action: 'Get clinical guidance',
                        category: 'automation'
                    }
                ];

            case 'admin':
                return [
                    ...baseCapabilities,
                    {
                        id: 'tenant-management',
                        name: 'Tenant Management',
                        description: 'Manage multi-tenant configurations',
                        action: 'Manage tenant settings',
                        category: 'automation'
                    },
                    {
                        id: 'system-analytics',
                        name: 'System Analytics',
                        description: 'View platform-wide analytics',
                        action: 'Show system analytics',
                        category: 'analytics'
                    },
                    {
                        id: 'user-management',
                        name: 'User Management',
                        description: 'Manage users and permissions',
                        action: 'Manage users',
                        category: 'automation'
                    }
                ];

            default:
                return baseCapabilities;
        }
    }, [applicationType]);

    // Send message to Sage AI
    const sendMessage = useCallback(async (
        message: string,
        context?: Partial<SageContext>
    ): Promise<SageResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            // Get current user with proper error handling
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            // Use a fallback user ID if authentication fails
            let userId = 'anonymous-user';
            if (user) {
                userId = user.id;
            } else if (authError) {
                console.warn('Authentication error, using anonymous user:', authError);
            }

            // Build context
            const fullContext: SageContext = {
                applicationType,
                specialty,
                tenantId: tenantConfig?.id || 'default',
                currentPage: window.location.pathname,
                userRole: 'user', // TODO: Get actual user role
                availableActions: getCapabilities().map(c => c.id),
                ...context
            };

            // Call Sage AI function
            const { data, error } = await supabase.functions.invoke('sage-ai-assistant', {
                body: {
                    message,
                    userId,
                    context: fullContext,
                    conversationHistory: messages.slice(-6).map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                }
            });

            if (error) {
                console.error('Sage AI function error:', error);
                throw new Error(error.message || 'Failed to get response from Sage AI');
            }

            if (!data) {
                throw new Error('No response received from Sage AI');
            }

            return data as SageResponse;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Sage AI error:', err);

            // Don't show toast for authentication errors to avoid spam
            if (!errorMessage.includes('authentication') && !errorMessage.includes('log in')) {
                toast({
                    title: "Sage AI Error",
                    description: errorMessage,
                    variant: "destructive"
                });
            }

            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [applicationType, specialty, tenantConfig, messages, getCapabilities]);

    // Add message to chat
    const addMessage = useCallback((message: SageMessage) => {
        setMessages(prev => [...prev, message]);
    }, []);

    // Clear messages
    const clearMessages = useCallback(() => {
        setMessages([{
            id: '1',
            role: 'assistant',
            content: "Hello! I'm Sage, your AI assistant. I can help you with scheduling, customer management, and business operations. What can I help you with today?",
            timestamp: new Date(),
        }]);
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: SageAIContextType = {
        sendMessage,
        getCapabilities,
        isAvailable: true, // TODO: Check if Sage AI is available
        isLoading,
        applicationType,
        specialty,
        tenantId: tenantConfig?.id || 'default',
        isOpen,
        setIsOpen,
        mode,
        setMode,
        messages,
        addMessage,
        clearMessages,
        error,
        clearError
    };

    return (
        <SageAIContext.Provider value={value}>
            {children}
        </SageAIContext.Provider>
    );
}; 