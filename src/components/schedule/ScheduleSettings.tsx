import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Clock, Bell, Brain, Calendar, Users, Shield, Server } from "lucide-react";
import { AppointmentTypesConfig } from "@/components/schedule/AppointmentTypesConfig";
import { AdvancedComplianceDashboard } from "@/components/compliance/AdvancedComplianceDashboard";
import { ProductionDashboard } from "@/components/production/ProductionDashboard";
import { EditTeamMemberDialog } from "@/components/team/EditTeamMemberDialog";
import { GeneralSettingsTab } from "./settings/GeneralSettingsTab";
import { WorkingHoursTab } from "./settings/WorkingHoursTab";
import { AppointmentConfigTab } from "./settings/AppointmentConfigTab";
import { NotificationSettingsTab } from "./settings/NotificationSettingsTab";
import { AISettingsTab } from "./settings/AISettingsTab";
import { StaffManagementTab } from "./settings/StaffManagementTab";
import { StaffScheduleTab } from "./settings/StaffScheduleTab";
import { EnhancedProviderManagement } from "./settings/EnhancedProviderManagement";
import { AIWaitlistManager } from "./AIWaitlistManager";

export const ScheduleSettings = () => {
  const { toast } = useToast();

  const [editingMember, setEditingMember] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [settings, setSettings] = useState({
    workingHours: {
      monday: { start: "09:00", end: "17:00", enabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "09:00", end: "13:00", enabled: false },
      sunday: { start: "09:00", end: "13:00", enabled: false }
    },
    appointments: {
      defaultDuration: 60,
      bufferTime: 15,
      maxAdvanceBooking: 90,
      minAdvanceBooking: 2,
      allowOnlineBooking: true,
      requireDeposit: false,
      depositAmount: 0
    },
    notifications: {
      emailReminders: true,
      smsReminders: true,
      reminderTiming: [24, 2],
      confirmationRequired: true,
      autoReschedule: false
    },
    aiSettings: {
      autoOptimization: true,
      conflictResolution: true,
      predictiveScheduling: true,
      waitlistManagement: true,
      noShowPrediction: true,
      smartReminders: true
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your schedule settings have been updated successfully.",
    });
  };

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };

  const handleAppointmentSettingsChange = (updates: any) => {
    setSettings(prev => ({
      ...prev,
      appointments: { ...prev.appointments, ...updates }
    }));
  };

  const handleNotificationSettingsChange = (updates: any) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates }
    }));
  };

  const handleAISettingsChange = (updates: any) => {
    setSettings(prev => ({
      ...prev,
      aiSettings: { ...prev.aiSettings, ...updates }
    }));
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setEditDialogOpen(true);
  };

  const handleUpdateStaffSchedule = (staffId: string, workingHours: any, procedureSchedules?: any[]) => {
    console.log("Updating staff schedule:", { staffId, workingHours, procedureSchedules });

    toast({
      title: "Schedule Updated",
      description: "Staff member schedule has been updated successfully.",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schedule Settings</h2>
          <p className="text-gray-600">Configure your scheduling preferences and AI automation</p>
        </div>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10 gap-1">
          <TabsTrigger value="general" className="text-xs">
            <Settings className="w-4 h-4 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="hours" className="text-xs">
            <Clock className="w-4 h-4 mr-1" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="appointments" className="text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="w-4 h-4 mr-1" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">
            <Brain className="w-4 h-4 mr-1" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="enhanced-providers" className="text-xs">
            <Users className="w-4 h-4 mr-1" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="providers" className="text-xs">
            <Users className="w-4 h-4 mr-1" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="appointment-types" className="text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            Types
          </TabsTrigger>
          <TabsTrigger value="staff-schedules" className="text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="ai-waitlist" className="text-xs">
            <Brain className="w-4 h-4 mr-1" />
            AI Waitlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettingsTab />
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <WorkingHoursTab
            settings={settings.workingHours}
            onWorkingHoursChange={handleWorkingHoursChange}
          />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentConfigTab
            settings={settings.appointments}
            onSettingsChange={handleAppointmentSettingsChange}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettingsTab
            settings={settings.notifications}
            onSettingsChange={handleNotificationSettingsChange}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AISettingsTab
            settings={settings.aiSettings}
            onSettingsChange={handleAISettingsChange}
          />
        </TabsContent>

        <TabsContent value="enhanced-providers" className="space-y-4">
          <EnhancedProviderManagement />
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <StaffManagementTab onEditMember={handleEditMember} />
        </TabsContent>

        <TabsContent value="appointment-types" className="space-y-4">
          <AppointmentTypesConfig />
        </TabsContent>

        <TabsContent value="staff-schedules" className="space-y-4">
          <StaffScheduleTab onUpdateStaffSchedule={handleUpdateStaffSchedule} />
        </TabsContent>

        <TabsContent value="ai-waitlist" className="space-y-4">
          <AIWaitlistManager />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <AdvancedComplianceDashboard />
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <ProductionDashboard />
        </TabsContent>
      </Tabs>

      <EditTeamMemberDialog
        member={editingMember}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};
