/**
 * Shared Components Library
 * Consolidates common functionality across Chiropractic, Dental Sleep, and Communication apps
 */

import React from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Shared AI Agents
export { default as CommunicationIQ } from '@/pages/agents/CommunicationIQ';
export { default as ScribeIQ } from '@/pages/agents/ScribeIQ';
export { default as InsuranceIQ } from '@/pages/agents/InsuranceIQ';
export { default as RevenueIQ } from '@/pages/agents/RevenueIQ';
export { default as InventoryIQ } from '@/pages/agents/InventoryIQ';
export { default as EducationIQ } from '@/pages/agents/EducationIQ';
export { default as GrowthIQ } from '@/pages/agents/GrowthIQ';
export { default as OpsIQ } from '@/pages/agents/OpsIQ';
export { default as InsightIQ } from '@/pages/agents/InsightIQ';

// Shared Pages
export { Calendar } from '@/pages/Calendar';
export { default as Settings } from '@/pages/Settings';
export { default as Help } from '@/pages/Help';
export { default as Notifications } from '@/pages/Notifications';
export { default as ProviderSchedules } from '@/pages/ProviderSchedules';
export { default as PatientManagement } from '@/pages/PatientManagement';
export { default as Team } from '@/pages/Team';

// Shared Components
export { ClaimsDashboard } from '@/components/claims/ClaimsDashboard';
export { ScheduleDashboard } from '@/components/schedule/ScheduleDashboard';

/**
 * Shared Route Component Factory
 * Creates protected routes with consistent layout
 */
export const createProtectedRoute = (Component: React.ComponentType<any>, props?: any) => (
  <ProtectedRoute requiredRole="staff">
    <Layout>
      <Component {...props} />
    </Layout>
  </ProtectedRoute>
);

/**
 * Shared AI Agent Route Factory
 * Creates consistent AI agent routes
 */
export const createAgentRoute = (AgentComponent: React.ComponentType<any>, agentName: string) => (
  <ProtectedRoute requiredRole="staff">
    <Layout>
      <AgentComponent />
    </Layout>
  </ProtectedRoute>
);

/**
 * Shared Route Configuration
 * Defines common routes used across all apps
 */
export const SHARED_ROUTES = {
  // Core functionality
  dashboard: '/dashboard',
  calendar: '/calendar',
  patients: '/patients',
  team: '/team',
  settings: '/settings',
  help: '/help',
  notifications: '/notifications',
  providerSchedules: '/provider-schedules',
  
  // AI Agents
  communication: '/agents/communication',
  scribe: '/agents/scribe',
  insurance: '/agents/insurance',
  revenue: '/agents/revenue',
  inventory: '/agents/inventory',
  education: '/agents/education',
  growth: '/agents/growth',
  ops: '/agents/ops',
  insights: '/agents/insights',
  ehr: '/agents/ehr',
  
  // Specialty-specific
  claims: '/claims',
  schedule: '/schedule',
  analytics: '/analytics'
};

/**
 * Shared Route Generator
 * Generates consistent routes for any app
 */
export const generateSharedRoutes = (pathPrefix: string = '') => {
  const routes: Record<string, string> = {};
  
  Object.entries(SHARED_ROUTES).forEach(([key, route]) => {
    routes[key] = `${pathPrefix}${route}`;
  });
  
  return routes;
};

/**
 * Shared Navigation Items
 * Common navigation structure across apps
 */
export const SHARED_NAVIGATION = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'Monitor',
    description: 'Overview and key metrics'
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: 'Calendar',
    description: 'Appointment scheduling and management'
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: 'Users',
    description: 'Patient management and records'
  },
  {
    title: 'Communication',
    href: '/agents/communication',
    icon: 'MessageSquare',
    description: 'Voice, SMS, and email communication'
  },
  {
    title: 'Scribe',
    href: '/agents/scribe',
    icon: 'Stethoscope',
    description: 'Voice transcription and SOAP notes'
  },
  {
    title: 'Insurance',
    href: '/agents/insurance',
    icon: 'Shield',
    description: 'Claims processing and insurance management'
  },
  {
    title: 'Revenue',
    href: '/agents/revenue',
    icon: 'DollarSign',
    description: 'Billing and revenue analytics'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'Settings',
    description: 'Practice configuration'
  }
];

/**
 * Shared Feature Configuration
 * Common features available across all apps
 */
export const SHARED_FEATURES = {
  // Core functionality
  calendar: true,
  scheduling: true,
  patientManagement: true,
  communication: true,
  billing: true,
  insurance: true,
  
  // AI Agents
  voiceTranscription: true,
  soapGeneration: true,
  claimsProcessing: true,
  revenueAnalytics: true,
  patientIntake: true,
  automatedReminders: true,
  
  // Integrations
  ehrIntegration: true,
  paymentProcessing: true,
  insuranceVerification: true,
  calendarSync: true,
  smsIntegration: true,
  emailIntegration: true
};

/**
 * Shared Tenant Configuration
 * Common tenant settings across apps
 */
export const SHARED_TENANT_CONFIG = {
  // Branding
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  accentColor: '#f59e0b',
  
  // Features
  multiProvider: true,
  waitlistManagement: true,
  smartCommunication: true,
  automatedFollowUp: true,
  customerSupport: true,
  patientIntake: true,
  formBuilder: true,
  voiceIntake: true,
  smsReminders: true,
  emailCommunication: true,
  aiAssistant: true,
  
  // Integrations
  calendar: 'google' as const,
  ehr: 'integrated' as const,
  sms: true,
  email: true,
  voip: true,
  crm: true
}; 