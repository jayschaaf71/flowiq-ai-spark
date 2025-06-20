import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus, Edit, Trash2, Calendar, User } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    procedures?: string[];
  };
}

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  working_hours?: Json;
  procedure_schedules?: ProcedureSchedule[];
}

interface ProcedureSchedule {
  id: string;
  procedure_name: string;
  days: string[];
  start_time: string;
  end_time: string;
  duration: number;
  notes?: string;
}

interface StaffScheduleConfigProps {
  staff: StaffMember[];
  onUpdateSchedule: (staffId: string, schedule: WorkingHours, procedureSchedules?: ProcedureSchedule[]) => void;
}

const procedures = [
  "Regular Cleaning",
  "Deep Cleaning",
  "Root Canal",
  "Crown Preparation",
  "Filling",
  "Extraction",
  "Whitening",
  "Consultation",
  "Emergency",
  "X-Ray"
];

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
];

export const StaffScheduleConfig = ({ staff, onUpdateSchedule }: StaffScheduleConfigProps) => {
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours>({});
  const [procedureSchedules, setProcedureSchedules] = useState<ProcedureSchedule[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [procedureDialogOpen, setProcedureDialogOpen] = useState(false);
  const [newProcedure, setNewProcedure] = useState<Partial<ProcedureSchedule>>({
    procedure_name: "",
    days: [],
    start_time: "09:00",
    end_time: "17:00",
    duration: 60
  });

  const parseWorkingHours = (jsonHours: Json | undefined): WorkingHours => {
    if (!jsonHours) return {};
    
    // Handle the case where jsonHours might be a string or object
    let parsed: any;
    if (typeof jsonHours === 'string') {
      try {
        parsed = JSON.parse(jsonHours);
      } catch {
        return {};
      }
    } else {
      parsed = jsonHours;
    }

    // Ensure the structure matches our WorkingHours interface
    const workingHours: WorkingHours = {};
    daysOfWeek.forEach(({ key }) => {
      if (parsed[key]) {
        workingHours[key] = {
          enabled: parsed[key].enabled || (parsed[key].start && parsed[key].end),
          start: parsed[key].start || "09:00",
          end: parsed[key].end || "17:00",
          procedures: parsed[key].procedures || []
        };
      } else {
        workingHours[key] = {
          enabled: false,
          start: "09:00",
          end: "17:00",
          procedures: []
        };
      }
    });

    return workingHours;
  };

  const initializeStaffSchedule = (staffMember: StaffMember) => {
    const defaultHours: WorkingHours = {
      monday: { enabled: true, start: "09:00", end: "17:00" },
      tuesday: { enabled: true, start: "09:00", end: "17:00" },
      wednesday: { enabled: true, start: "09:00", end: "17:00" },
      thursday: { enabled: true, start: "09:00", end: "17:00" },
      friday: { enabled: true, start: "09:00", end: "17:00" },
      saturday: { enabled: false, start: "09:00", end: "13:00" },
      sunday: { enabled: false, start: "09:00", end: "13:00" }
    };

    setSelectedStaff(staffMember);
    setWorkingHours(parseWorkingHours(staffMember.working_hours) || defaultHours);
    setProcedureSchedules(staffMember.procedure_schedules || []);
    setEditDialogOpen(true);
  };

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = () => {
    if (!selectedStaff) return;

    onUpdateSchedule(selectedStaff.id, workingHours, procedureSchedules);
    toast({
      title: "Schedule Updated",
      description: `Working hours updated for ${selectedStaff.first_name} ${selectedStaff.last_name}`,
    });
    setEditDialogOpen(false);
  };

  const handleAddProcedureSchedule = () => {
    if (!newProcedure.procedure_name || !newProcedure.days?.length) {
      toast({
        title: "Validation Error",
        description: "Please select a procedure and at least one day",
        variant: "destructive",
      });
      return;
    }

    const procedureSchedule: ProcedureSchedule = {
      id: Date.now().toString(),
      procedure_name: newProcedure.procedure_name!,
      days: newProcedure.days!,
      start_time: newProcedure.start_time!,
      end_time: newProcedure.end_time!,
      duration: newProcedure.duration!,
      notes: newProcedure.notes
    };

    setProcedureSchedules(prev => [...prev, procedureSchedule]);
    setProcedureDialogOpen(false);
    setNewProcedure({
      procedure_name: "",
      days: [],
      start_time: "09:00",
      end_time: "17:00",
      duration: 60
    });

    toast({
      title: "Procedure Schedule Added",
      description: `${procedureSchedule.procedure_name} schedule configured`,
    });
  };

  const handleRemoveProcedureSchedule = (id: string) => {
    setProcedureSchedules(prev => prev.filter(p => p.id !== id));
  };

  const toggleDaySelection = (day: string) => {
    setNewProcedure(prev => ({
      ...prev,
      days: prev.days?.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...(prev.days || []), day]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {staff.map((member) => (
          <Card key={member.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{member.first_name} {member.last_name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {member.working_hours && (
                  <Badge variant="secondary" className="text-xs">
                    Schedule Configured
                  </Badge>
                )}
                {member.procedure_schedules?.length && (
                  <Badge variant="outline" className="text-xs">
                    {member.procedure_schedules.length} Procedure Rules
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => initializeStaffSchedule(member)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Configure Schedule
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Configuration Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Configure Schedule - {selectedStaff?.first_name} {selectedStaff?.last_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* General Working Hours */}
            <div>
              <h3 className="text-lg font-medium mb-4">General Working Hours</h3>
              <div className="space-y-3">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={workingHours[key]?.enabled || false}
                        onCheckedChange={(checked) => handleWorkingHoursChange(key, 'enabled', checked)}
                      />
                      <Label className="font-medium w-20">{label}</Label>
                    </div>
                    
                    {workingHours[key]?.enabled && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={workingHours[key]?.start || "09:00"}
                          onChange={(e) => handleWorkingHoursChange(key, 'start', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="time"
                          value={workingHours[key]?.end || "17:00"}
                          onChange={(e) => handleWorkingHoursChange(key, 'end', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure-Specific Schedules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Procedure-Specific Schedules</h3>
                <Dialog open={procedureDialogOpen} onOpenChange={setProcedureDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Procedure Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Procedure Schedule</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Procedure</Label>
                        <Select 
                          value={newProcedure.procedure_name} 
                          onValueChange={(value) => setNewProcedure(prev => ({ ...prev, procedure_name: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select procedure" />
                          </SelectTrigger>
                          <SelectContent>
                            {procedures.map(proc => (
                              <SelectItem key={proc} value={proc}>{proc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Days Available</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {daysOfWeek.map(({ key, label }) => (
                            <Button
                              key={key}
                              variant={newProcedure.days?.includes(key) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleDaySelection(key)}
                            >
                              {label.substring(0, 3)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={newProcedure.start_time}
                            onChange={(e) => setNewProcedure(prev => ({ ...prev, start_time: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={newProcedure.end_time}
                            onChange={(e) => setNewProcedure(prev => ({ ...prev, end_time: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Typical Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={newProcedure.duration}
                          onChange={(e) => setNewProcedure(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                        />
                      </div>

                      <div>
                        <Label>Notes (optional)</Label>
                        <Input
                          value={newProcedure.notes || ""}
                          onChange={(e) => setNewProcedure(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any special notes for this procedure schedule"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline" onClick={() => setProcedureDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProcedureSchedule}>
                        Add Schedule
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {procedureSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{schedule.procedure_name}</div>
                      <div className="text-sm text-gray-600">
                        {schedule.days.map(day => daysOfWeek.find(d => d.key === day)?.label).join(", ")} • 
                        {schedule.start_time} - {schedule.end_time} • 
                        {schedule.duration}min
                      </div>
                      {schedule.notes && (
                        <div className="text-xs text-gray-500 mt-1">{schedule.notes}</div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveProcedureSchedule(schedule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {procedureSchedules.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No procedure-specific schedules configured yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>
              Save Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
