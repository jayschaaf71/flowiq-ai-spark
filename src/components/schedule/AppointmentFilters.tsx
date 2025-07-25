
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useProviders } from "@/hooks/useProviders";
import { useSpecialty } from "@/contexts/SpecialtyContext";

interface AppointmentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  providerFilter: string;
  onProviderChange: (value: string) => void;
  dateFilter: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  appointmentTypeFilter: string;
  onAppointmentTypeChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

// Specialty-specific appointment types
const getAppointmentTypesBySpecialty = (specialty: string) => {
  switch (specialty) {
    case 'dental-sleep':
      return [
        'Initial Consultation',
        'Sleep Study Review',
        'Appliance Fitting',
        'Titration',
        'Follow-up',
        'Check-up',
        'Emergency'
      ];
    case 'chiropractic':
      return [
        'Initial Consultation',
        'Adjustment Session',
        'Spinal Decompression',
        'Physical Therapy',
        'Massage Therapy',
        'Follow-up Visit',
        'Emergency'
      ];
    default:
      return [
        'Consultation',
        'Cleaning',
        'Checkup',
        'Root Canal',
        'Filling',
        'Extraction',
        'Emergency',
        'Follow-up'
      ];
  }
};

export const AppointmentFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  providerFilter,
  onProviderChange,
  dateFilter,
  onDateChange,
  appointmentTypeFilter,
  onAppointmentTypeChange,
  onClearFilters,
  activeFiltersCount
}: AppointmentFiltersProps) => {
  const { providers } = useProviders();
  const { currentSpecialty } = useSpecialty();
  const [isDateOpen, setIsDateOpen] = useState(false);
  
  const appointmentTypes = getAppointmentTypesBySpecialty(currentSpecialty);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeFiltersCount} active
              </Badge>
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search appointments, patients, phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>

          {/* Provider Filter */}
          <Select value={providerFilter} onValueChange={onProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Appointment Type Filter */}
          <Select value={appointmentTypeFilter} onValueChange={onAppointmentTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {appointmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={(date) => {
                  onDateChange(date);
                  setIsDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};
