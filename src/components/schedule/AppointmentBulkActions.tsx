
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckSquare, 
  Square, 
  Send, 
  Calendar, 
  Users, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  appointment_type: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  phone?: string;
  email?: string;
  created_at: string;
  patient_id: string;
  provider_id?: string;
}

interface AppointmentBulkActionsProps {
  appointments: Appointment[];
  selectedAppointments: string[];
  onSelectionChange: (appointmentIds: string[]) => void;
  onBulkStatusUpdate: (appointmentIds: string[], newStatus: Appointment['status']) => void;
  onBulkSendReminders: (appointmentIds: string[]) => void;
  onBulkDelete: (appointmentIds: string[]) => void;
}

export const AppointmentBulkActions = ({
  appointments,
  selectedAppointments,
  onSelectionChange,
  onBulkStatusUpdate,
  onBulkSendReminders,
  onBulkDelete
}: AppointmentBulkActionsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAll = () => {
    if (selectedAppointments.length === appointments.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(appointments.map(apt => apt.id));
    }
  };

  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedAppointments.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select appointments first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      switch (action) {
        case "status":
          if (value) {
            await onBulkStatusUpdate(selectedAppointments, value as Appointment['status']);
            toast({
              title: "Status Updated",
              description: `${selectedAppointments.length} appointments updated to ${value}`,
            });
          }
          break;
        case "reminders":
          await onBulkSendReminders(selectedAppointments);
          toast({
            title: "Reminders Sent",
            description: `Reminders sent to ${selectedAppointments.length} patients`,
          });
          break;
        case "delete":
          await onBulkDelete(selectedAppointments);
          toast({
            title: "Appointments Deleted",
            description: `${selectedAppointments.length} appointments deleted`,
          });
          break;
      }
      onSelectionChange([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAllSelected = appointments.length > 0 && selectedAppointments.length === appointments.length;
  const isPartiallySelected = selectedAppointments.length > 0 && selectedAppointments.length < appointments.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Actions
            {selectedAppointments.length > 0 && (
              <Badge variant="secondary">
                {selectedAppointments.length} selected
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className={isPartiallySelected ? "data-[state=checked]:bg-gray-500" : ""}
            />
            <span className="text-sm text-gray-600">
              Select All ({appointments.length})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedAppointments.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Bulk Status Update */}
              <Select
                onValueChange={(value) => handleBulkAction("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Confirm
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Cancel
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                      Complete
                    </div>
                  </SelectItem>
                  <SelectItem value="no-show">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      No Show
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Send Reminders */}
              <Button
                variant="outline"
                onClick={() => handleBulkAction("reminders")}
                disabled={isLoading}
                className="justify-start"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Reminders
              </Button>

              {/* Reschedule */}
              <Button
                variant="outline"
                disabled={isLoading}
                className="justify-start"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>

              {/* Delete */}
              <Button
                variant="outline"
                onClick={() => handleBulkAction("delete")}
                disabled={isLoading}
                className="justify-start text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>

            {/* Selection Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                <strong>{selectedAppointments.length}</strong> appointments selected
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Actions will be applied to all selected appointments
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Select appointments to perform bulk actions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
