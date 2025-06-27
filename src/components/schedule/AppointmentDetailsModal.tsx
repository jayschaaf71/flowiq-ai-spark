
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, Edit, Trash2, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onAppointmentUpdated: (appointment: any) => void;
  onAppointmentDeleted: (appointmentId: string) => void;
}

export const AppointmentDetailsModal = ({ 
  isOpen, 
  onClose, 
  appointment,
  onAppointmentUpdated,
  onAppointmentDeleted
}: AppointmentDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointment.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      });

      onAppointmentUpdated(data);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Could not update appointment status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async () => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointment.id);

      if (error) throw error;

      toast({
        title: "Appointment Deleted",
        description: "The appointment has been successfully deleted",
      });

      onAppointmentDeleted(appointment.id);
      onClose();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Appointment Details
            </span>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Name:</strong> {appointment.title}</p>
              {appointment.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {appointment.email}
                </p>
              )}
              {appointment.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {appointment.phone}
                </p>
              )}
            </div>
          </div>

          {/* Appointment Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Appointment Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Date:</strong> {format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {format(parseISO(`2000-01-01T${appointment.time}`), 'h:mm a')}</p>
              <p><strong>Duration:</strong> {appointment.duration} minutes</p>
              <p><strong>Type:</strong> {appointment.appointment_type}</p>
              {appointment.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="mt-1 text-gray-600">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {appointment.status !== 'confirmed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus('confirmed')}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Confirm
                </Button>
              )}
              {appointment.status !== 'completed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus('completed')}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Mark Complete
                </Button>
              )}
              {appointment.status !== 'cancelled' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus('cancelled')}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteAppointment}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="flex items-center gap-1">
                <Edit className="w-3 h-3" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
