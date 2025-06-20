
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Calendar } from "lucide-react";

interface Conflict {
  id: string;
  type: 'overlap' | 'back-to-back' | 'buffer-violation' | 'double-booking';
  severity: 'high' | 'medium' | 'low';
  message: string;
  appointmentId?: string;
  suggestedAction: string;
}

interface ConflictDetectionProps {
  date: string;
  time: string;
  duration: number;
  providerId?: string;
  excludeAppointmentId?: string;
  onConflictsDetected: (conflicts: Conflict[]) => void;
}

export const ConflictDetection = ({
  date,
  time,
  duration,
  providerId,
  excludeAppointmentId,
  onConflictsDetected
}: ConflictDetectionProps) => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [checking, setChecking] = useState(false);

  const detectConflicts = async () => {
    if (!date || !time) return;
    
    setChecking(true);
    try {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      // Check for existing appointments
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('date', date);

      if (providerId) {
        query = query.eq('provider_id', providerId);
      }

      if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId);
      }

      const { data: existingAppointments, error } = await query;

      if (error) throw error;

      const detectedConflicts: Conflict[] = [];

      existingAppointments?.forEach(appointment => {
        const aptStart = new Date(`${appointment.date}T${appointment.time}`);
        const aptEnd = new Date(aptStart.getTime() + appointment.duration * 60000);

        // Check for direct overlap
        if (
          (startTime < aptEnd && endTime > aptStart)
        ) {
          detectedConflicts.push({
            id: `overlap-${appointment.id}`,
            type: 'overlap',
            severity: 'high',
            message: `Overlaps with existing appointment: ${appointment.title}`,
            appointmentId: appointment.id,
            suggestedAction: 'Reschedule to a different time slot'
          });
        }

        // Check for back-to-back scheduling (no buffer)
        const timeDiffStart = Math.abs(startTime.getTime() - aptEnd.getTime()) / (1000 * 60);
        const timeDiffEnd = Math.abs(endTime.getTime() - aptStart.getTime()) / (1000 * 60);

        if (timeDiffStart < 15 && timeDiffStart > 0) {
          detectedConflicts.push({
            id: `buffer-start-${appointment.id}`,
            type: 'buffer-violation',
            severity: 'medium',
            message: `Only ${Math.round(timeDiffStart)} minutes after ${appointment.title}`,
            appointmentId: appointment.id,
            suggestedAction: 'Add 15-minute buffer between appointments'
          });
        }

        if (timeDiffEnd < 15 && timeDiffEnd > 0) {
          detectedConflicts.push({
            id: `buffer-end-${appointment.id}`,
            type: 'buffer-violation',
            severity: 'medium',
            message: `Only ${Math.round(timeDiffEnd)} minutes before ${appointment.title}`,
            appointmentId: appointment.id,
            suggestedAction: 'Add 15-minute buffer between appointments'
          });
        }
      });

      setConflicts(detectedConflicts);
      onConflictsDetected(detectedConflicts);

    } catch (error) {
      console.error("Error detecting conflicts:", error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    detectConflicts();
  }, [date, time, duration, providerId, excludeAppointmentId]);

  if (conflicts.length === 0 && !checking) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <Calendar className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          No scheduling conflicts detected. This time slot is available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {checking && (
        <Alert>
          <Clock className="h-4 w-4 animate-spin" />
          <AlertDescription>Checking for scheduling conflicts...</AlertDescription>
        </Alert>
      )}
      
      {conflicts.map(conflict => (
        <Alert key={conflict.id} variant={conflict.severity === 'high' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={conflict.severity === 'high' ? 'destructive' : 'secondary'}>
                  {conflict.severity}
                </Badge>
                <span className="font-medium">{conflict.message}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Suggestion: {conflict.suggestedAction}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
