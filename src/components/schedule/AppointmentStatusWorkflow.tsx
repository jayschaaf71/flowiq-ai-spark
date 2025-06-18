
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  MessageSquare,
  Calendar
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

interface AppointmentStatusWorkflowProps {
  appointment: Appointment;
  onStatusUpdate: (appointmentId: string, newStatus: Appointment['status'], notes?: string) => void;
}

export const AppointmentStatusWorkflow = ({ 
  appointment, 
  onStatusUpdate 
}: AppointmentStatusWorkflowProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Appointment['status']>(appointment.status);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    {
      value: "pending" as const,
      label: "Pending",
      icon: Clock,
      color: "text-yellow-600",
      description: "Appointment is scheduled but not confirmed"
    },
    {
      value: "confirmed" as const,
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-green-600",
      description: "Patient has confirmed their attendance"
    },
    {
      value: "completed" as const,
      label: "Completed",
      icon: CheckCircle,
      color: "text-blue-600",
      description: "Appointment has been completed successfully"
    },
    {
      value: "cancelled" as const,
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600",
      description: "Appointment has been cancelled"
    },
    {
      value: "no-show" as const,
      label: "No Show",
      icon: AlertTriangle,
      color: "text-gray-600",
      description: "Patient did not show up for appointment"
    }
  ];

  const currentStatus = statusOptions.find(s => s.value === appointment.status);
  const newStatus = statusOptions.find(s => s.value === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    if (!statusOption) return null;

    const Icon = statusOption.icon;
    return (
      <Badge className={`${getStatusColor(status)} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {statusOption.label}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "no-show": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAvailableTransitions = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled", "no-show"],
      cancelled: ["pending", "confirmed"],
      completed: ["pending"], // Allow reopening if needed
      "no-show": ["pending", "confirmed"]
    };
    return transitions[currentStatus] || [];
  };

  const availableStatuses = getAvailableTransitions(appointment.status);

  const handleStatusUpdate = async () => {
    if (selectedStatus === appointment.status) {
      toast({
        title: "No Change",
        description: "Status is already set to this value",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onStatusUpdate(appointment.id, selectedStatus, notes);
      setIsOpen(false);
      setNotes("");
      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${selectedStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (appointment.status === "pending") {
      actions.push(
        <Button
          key="confirm"
          size="sm"
          onClick={() => {
            setSelectedStatus("confirmed");
            handleStatusUpdate();
          }}
          disabled={isLoading}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Confirm
        </Button>
      );
    }

    if (appointment.status === "confirmed") {
      actions.push(
        <Button
          key="complete"
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedStatus("completed");
            handleStatusUpdate();
          }}
          disabled={isLoading}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Complete
        </Button>
      );
    }

    return actions;
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge(appointment.status)}
      
      {/* Quick Actions */}
      {getQuickActions()}

      {/* Status Workflow Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowRight className="h-3 w-3 mr-1" />
            Change
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Change the status of this appointment and add notes if needed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Status */}
            <div>
              <h4 className="text-sm font-medium mb-2">Current Status</h4>
              <div className="flex items-center gap-2">
                {currentStatus && (
                  <>
                    <currentStatus.icon className={`h-4 w-4 ${currentStatus.color}`} />
                    <span>{currentStatus.label}</span>
                  </>
                )}
              </div>
            </div>

            {/* New Status Selection */}
            <div>
              <h4 className="text-sm font-medium mb-2">New Status</h4>
              <Select 
                value={selectedStatus} 
                onValueChange={(value) => setSelectedStatus(value as Appointment['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions
                    .filter(status => availableStatuses.includes(status.value) || status.value === appointment.status)
                    .map((status) => {
                      const Icon = status.icon;
                      return (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${status.color}`} />
                            <div>
                              <div>{status.label}</div>
                              <div className="text-xs text-gray-500">{status.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            {/* Status Change Preview */}
            {selectedStatus !== appointment.status && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  {currentStatus && <currentStatus.icon className={`h-4 w-4 ${currentStatus.color}`} />}
                  <span>{currentStatus?.label}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  {newStatus && <newStatus.icon className={`h-4 w-4 ${newStatus.color}`} />}
                  <span>{newStatus?.label}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h4 className="text-sm font-medium mb-2">Notes (Optional)</h4>
              <Textarea
                placeholder="Add a note about this status change..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
