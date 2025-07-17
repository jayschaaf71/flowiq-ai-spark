
import { useState } from "react";
import { EnhancedCalendarView } from "./EnhancedCalendarView";
import { AppointmentFilters } from "./AppointmentFilters";
import { AppointmentBulkActions } from "./AppointmentBulkActions";
import { SageTaskPanel } from "./SageTaskPanel";
import { useAppointments } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments">;

export const CalendarView = () => {
  const { appointments, updateAppointmentStatus, sendReminder } = useAppointments();
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("all");

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (providerFilter !== "all") count++;
    if (dateFilter) count++;
    if (appointmentTypeFilter !== "all") count++;
    return count;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setProviderFilter("all");
    setDateFilter(undefined);
    setAppointmentTypeFilter("all");
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesProvider = providerFilter === "all" || apt.provider_id === providerFilter;
    const matchesDate = !dateFilter || apt.date === format(dateFilter, "yyyy-MM-dd");
    const matchesType = appointmentTypeFilter === "all" || apt.appointment_type === appointmentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesProvider && matchesDate && matchesType;
  });

  const handleBulkStatusUpdate = async (appointmentIds: string[], newStatus: string) => {
    for (const id of appointmentIds) {
      await updateAppointmentStatus(id, newStatus);
    }
  };

  const handleBulkSendReminders = async (appointmentIds: string[]) => {
    for (const id of appointmentIds) {
      const appointment = appointments.find(apt => apt.id === id);
      if (appointment) {
        await sendReminder(appointment);
      }
    }
  };

  const handleBulkDelete = async (appointmentIds: string[]) => {
    // Implementation for bulk delete
    console.log("Bulk delete:", appointmentIds);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <AppointmentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        providerFilter={providerFilter}
        onProviderChange={setProviderFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        appointmentTypeFilter={appointmentTypeFilter}
        onAppointmentTypeChange={setAppointmentTypeFilter}
        onClearFilters={clearFilters}
        activeFiltersCount={getActiveFiltersCount()}
      />

      {/* Bulk Actions */}
      <AppointmentBulkActions
        appointments={filteredAppointments}
        selectedAppointments={selectedAppointments}
        onSelectionChange={setSelectedAppointments}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkSendReminders={handleBulkSendReminders}
        onBulkDelete={handleBulkDelete}
      />

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-3">
          <EnhancedCalendarView />
        </div>
        
        {/* SAGE Intelligence Panel */}
        <div className="lg:col-span-1">
          <SageTaskPanel />
        </div>
      </div>
    </div>
  );
};
