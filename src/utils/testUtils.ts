
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthProvider';
import { DashboardProvider } from '@/contexts/DashboardContext';
import React, { ReactElement } from 'react';

// Create a custom render function that includes all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DashboardProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </DashboardProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Test data generators
export const generateMockPatient = (overrides = {}) => ({
  id: 'test-patient-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-0123',
  dateOfBirth: '1990-01-01',
  ...overrides
});

export const generateMockAppointment = (overrides = {}) => ({
  id: 'test-appointment-1',
  patientId: 'test-patient-1',
  providerId: 'test-provider-1',
  date: new Date().toISOString().split('T')[0],
  time: '10:00',
  status: 'scheduled',
  type: 'consultation',
  ...overrides
});

export const generateMockProvider = (overrides = {}) => ({
  id: 'test-provider-1',
  firstName: 'Dr. Jane',
  lastName: 'Smith',
  email: 'jane.smith@clinic.com',
  specialty: 'General Practice',
  ...overrides
});

// Test utilities for API mocking
export const mockApiResponse = (data: any, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (error: any, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(error), delay);
  });
};

// Export everything
export * from '@testing-library/react';
export { customRender as render };
