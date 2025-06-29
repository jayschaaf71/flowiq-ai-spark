
import React, { createContext, useContext, useState, useCallback } from 'react';

interface DashboardState {
  selectedPatient: string | null;
  selectedAppointment: string | null;
  activeModule: string;
  notifications: Notification[];
  filters: {
    dateRange: { start: Date; end: Date };
    provider: string | null;
    status: string | null;
  };
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface DashboardContextType {
  state: DashboardState;
  setSelectedPatient: (patientId: string | null) => void;
  setSelectedAppointment: (appointmentId: string | null) => void;
  setActiveModule: (module: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationRead: (notificationId: string) => void;
  updateFilters: (filters: Partial<DashboardState['filters']>) => void;
  clearNotifications: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardState>({
    selectedPatient: null,
    selectedAppointment: null,
    activeModule: 'dashboard',
    notifications: [],
    filters: {
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        end: new Date()
      },
      provider: null,
      status: null
    }
  });

  const setSelectedPatient = useCallback((patientId: string | null) => {
    setState(prev => ({ ...prev, selectedPatient: patientId }));
  }, []);

  const setSelectedAppointment = useCallback((appointmentId: string | null) => {
    setState(prev => ({ ...prev, selectedAppointment: appointmentId }));
  }, []);

  const setActiveModule = useCallback((module: string) => {
    setState(prev => ({ ...prev, activeModule: module }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      isRead: false
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 50) // Keep only 50 most recent
    }));
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<DashboardState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState(prev => ({ ...prev, notifications: [] }));
  }, []);

  const value: DashboardContextType = {
    state,
    setSelectedPatient,
    setSelectedAppointment,
    setActiveModule,
    addNotification,
    markNotificationRead,
    updateFilters,
    clearNotifications
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
