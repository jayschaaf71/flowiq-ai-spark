import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { useSpecialty } from '@/contexts/SpecialtyContext';

interface CalendarFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  providerFilter: string;
  onProviderFilterChange: (value: string) => void;
  appointmentTypeFilter: string;
  onAppointmentTypeFilterChange: (value: string) => void;
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
        'Initial Consultation',
        'Follow-up',
        'Check-up',
        'Emergency'
      ];
  }
};

const providers = [
  'Dr. Smith',
  'Dr. Johnson', 
  'Dr. Brown',
  'Dr. Davis'
];

export const CalendarFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  providerFilter,
  onProviderFilterChange,
  appointmentTypeFilter,
  onAppointmentTypeFilterChange,
  onClearFilters,
  activeFiltersCount
}: CalendarFiltersProps) => {
  const { currentSpecialty } = useSpecialty();
  const appointmentTypes = getAppointmentTypesBySpecialty(currentSpecialty);
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments, patients..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>

          {/* Provider Filter */}
          <Select value={providerFilter} onValueChange={onProviderFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Appointment Type Filter */}
          <Select value={appointmentTypeFilter} onValueChange={onAppointmentTypeFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {appointmentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {activeFiltersCount} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};