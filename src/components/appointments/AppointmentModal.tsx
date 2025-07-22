import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useCreateAppointment, useUpdateAppointment } from '@/hooks/useAppointments';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Appointment {
  id?: string;
  date: string;
  time: string;
  title: string;
  appointment_type: string;
  status: string;
  duration: number;
  patient_id?: string;
  patient_name?: string;
  email?: string;
  phone?: string;
  provider_id?: string;
  provider?: string;
  notes?: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment;
  defaultDate?: Date;
  defaultTime?: string;
}

const appointmentTypes = [
  'Initial Consultation',
  'Follow-up',
  'Sleep Study Review',
  'Appliance Fitting',
  'Titration',
  'Check-up',
  'Emergency'
];

const providers = [
  'Dr. Smith',
  'Dr. Johnson', 
  'Dr. Brown',
  'Dr. Davis'
];

export const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
  defaultDate, 
  defaultTime 
}: AppointmentModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    appointment_type: '',
    patient_name: '',
    email: '',
    phone: '',
    provider: '',
    title: '',
    notes: '',
    status: 'scheduled'
  });

  const { toast } = useToast();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const [currentUser, setCurrentUser] = useState<{ id: string; profile?: { current_tenant_id?: string } } | null>(null);

  // Get current user on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get profile with role information
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // Get tenant membership
        const { data: tenantUsers } = await supabase
          .from('tenant_users')
          .select('tenant_id, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(1);
        
        console.log('User profile:', profile);
        console.log('User tenant membership:', tenantUsers);
        
        setCurrentUser({ 
          ...user, 
          profile: {
            ...profile,
            current_tenant_id: tenantUsers?.[0]?.tenant_id || profile?.current_tenant_id
          }
        });
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (appointment) {
      setFormData({
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        appointment_type: appointment.appointment_type || '',
        patient_name: appointment.patient_name || '',
        email: appointment.email || '',
        phone: appointment.phone || '',
        provider: appointment.provider || '',
        title: appointment.title || '',
        notes: appointment.notes || '',
        status: appointment.status || 'scheduled'
      });
    } else if (defaultDate) {
      setFormData(prev => ({
        ...prev,
        date: format(defaultDate, 'yyyy-MM-dd'),
        time: defaultTime || '09:00',
        title: `${prev.appointment_type} - ${prev.patient_name}`.trim()
      }));
    }
  }, [appointment, defaultDate, defaultTime]);

  useEffect(() => {
    // Auto-generate title when patient name or appointment type changes
    if (formData.patient_name || formData.appointment_type) {
      const title = `${formData.appointment_type} - ${formData.patient_name}`.replace(/^[\s-]+|[\s-]+$/g, '');
      setFormData(prev => ({ ...prev, title: title || 'New Appointment' }));
    }
  }, [formData.patient_name, formData.appointment_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.patient_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!currentUser?.profile?.current_tenant_id) {
        toast({
          title: "Authentication Error",
          description: "User tenant not found. Please log in again.",
          variant: "destructive"
        });
        return;
      }

      const appointmentData = {
        ...formData,
        tenant_id: currentUser.profile.current_tenant_id,
        updated_at: new Date().toISOString()
      };

      if (appointment?.id) {
        await updateMutation.mutateAsync({ 
          id: appointment.id, 
          updates: appointmentData 
        });
      } else {
        await createMutation.mutateAsync({
          ...appointmentData,
          created_at: new Date().toISOString()
        });
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: "Error",
        description: "Failed to save appointment. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      duration: 60,
      appointment_type: '',
      patient_name: '',
      email: '',
      phone: '',
      provider: '',
      title: '',
      notes: '',
      status: 'scheduled'
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(new Date(formData.date), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Duration and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select 
                value={formData.duration.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_type">Appointment Type</Label>
              <Select 
                value={formData.appointment_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, appointment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Patient Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="patient_name"
                  value={formData.patient_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))}
                  className="pl-10"
                  placeholder="Enter patient name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    placeholder="patient@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Provider and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select 
                value={formData.provider} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, provider: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or instructions..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? 'Saving...' 
                : appointment ? 'Update Appointment' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};