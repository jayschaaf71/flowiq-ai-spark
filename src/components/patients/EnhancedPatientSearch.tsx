import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  MapPin,
  Phone,
  Mail,
  Heart,
  FileText
} from 'lucide-react';

interface Patient {
  id: string;
  patient_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  gender?: string;
  is_active: boolean;
  created_at: string;
  specialty?: string;
}

interface SearchFilters {
  searchTerm: string;
  ageRange: string;
  gender: string;
  city: string;
  state: string;
  appointmentStatus: string;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  hasAllergies?: boolean;
  hasInsurance?: boolean;
}

interface EnhancedPatientSearchProps {
  onSelectPatient: (patient: Patient) => void;
  onPatientsFiltered: (patients: Patient[]) => void;
}

export const EnhancedPatientSearch = ({ onSelectPatient, onPatientsFiltered }: EnhancedPatientSearchProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    ageRange: '',
    gender: '',
    city: '',
    state: '',
    appointmentStatus: '',
    registrationDateFrom: undefined,
    registrationDateTo: undefined,
    hasAllergies: undefined,
    hasInsurance: undefined
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const currentSpecialty = localStorage.getItem('currentSpecialty') || 'dental-sleep-medicine';
      const specialtyMapping: Record<string, string> = {
        'chiropractic': 'chiropractic',
        'chiropractic-care': 'chiropractic', 
        'dental-sleep': 'dental-sleep',
        'dental-sleep-medicine': 'dental-sleep',
        'med-spa': 'med-spa',
        'concierge': 'concierge',
        'hrt': 'hrt'
      };
      
      const patientSpecialty = specialtyMapping[currentSpecialty] || currentSpecialty;

      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          appointments:appointments(count),
          medical_conditions:medical_conditions(count),
          insurance_cards:insurance_cards(count)
        `)
        .eq('is_active', true)
        .eq('specialty', patientSpecialty)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...patients];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.first_name?.toLowerCase().includes(searchLower) ||
        patient.last_name?.toLowerCase().includes(searchLower) ||
        patient.patient_number?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phone?.includes(filters.searchTerm)
      );
    }

    // Age range filter
    if (filters.ageRange) {
      filtered = filtered.filter(patient => {
        const age = calculateAge(patient.date_of_birth);
        switch (filters.ageRange) {
          case '0-18': return age >= 0 && age <= 18;
          case '19-35': return age >= 19 && age <= 35;
          case '36-50': return age >= 36 && age <= 50;
          case '51-65': return age >= 51 && age <= 65;
          case '65+': return age > 65;
          default: return true;
        }
      });
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(patient => patient.gender === filters.gender);
    }

    // Location filters
    if (filters.city) {
      filtered = filtered.filter(patient => 
        patient.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.state) {
      filtered = filtered.filter(patient => 
        patient.state?.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // Date range filters
    if (filters.registrationDateFrom) {
      filtered = filtered.filter(patient => 
        new Date(patient.created_at) >= filters.registrationDateFrom!
      );
    }

    if (filters.registrationDateTo) {
      filtered = filtered.filter(patient => 
        new Date(patient.created_at) <= filters.registrationDateTo!
      );
    }

    setFilteredPatients(filtered);
    onPatientsFiltered(filtered);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      ageRange: '',
      gender: '',
      city: '',
      state: '',
      appointmentStatus: '',
      registrationDateFrom: undefined,
      registrationDateTo: undefined,
      hasAllergies: undefined,
      hasInsurance: undefined
    });
  };

  const getPatientStats = (patient: any) => {
    const appointmentCount = patient.appointments?.[0]?.count || 0;
    const allergyCount = patient.medical_conditions?.[0]?.count || 0;
    const hasInsurance = (patient.insurance_cards?.[0]?.count || 0) > 0;
    
    return { appointmentCount, allergyCount, hasInsurance };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Patient Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, ID, email, or phone..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            
            <Select value={filters.ageRange} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, ageRange: value }))
            }>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ages</SelectItem>
                <SelectItem value="0-18">0-18</SelectItem>
                <SelectItem value="19-35">19-35</SelectItem>
                <SelectItem value="36-50">36-50</SelectItem>
                <SelectItem value="51-65">51-65</SelectItem>
                <SelectItem value="65+">65+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.gender} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, gender: value }))
            }>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {(filters.searchTerm || filters.ageRange || filters.gender || filters.city || filters.state) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Input
                    placeholder="Filter by city"
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State</label>
                  <Input
                    placeholder="Filter by state"
                    value={filters.state}
                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Registration From</label>
                  <Input
                    type="date"
                    value={filters.registrationDateFrom ? filters.registrationDateFrom.toISOString().split('T')[0] : ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      registrationDateFrom: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Registration To</label>
                  <Input
                    type="date"
                    value={filters.registrationDateTo ? filters.registrationDateTo.toISOString().split('T')[0] : ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      registrationDateTo: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredPatients.length} of {patients.length} patients</span>
            {filteredPatients.length !== patients.length && (
              <span>Filtered by search criteria</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => {
          const stats = getPatientStats(patient);
          return (
            <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectPatient(patient)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {patient.patient_number}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Age {calculateAge(patient.date_of_birth)}</span>
                      </div>
                      
                      {patient.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone}</span>
                        </div>
                      )}
                      
                      {patient.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{patient.email}</span>
                        </div>
                      )}
                      
                      {(patient.city || patient.state) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{[patient.city, patient.state].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {stats.appointmentCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {stats.appointmentCount} appts
                      </Badge>
                    )}
                    
                    {stats.allergyCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Heart className="h-3 w-3 mr-1" />
                        {stats.allergyCount} allergies
                      </Badge>
                    )}
                    
                    {stats.hasInsurance && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        Insured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No patients found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};