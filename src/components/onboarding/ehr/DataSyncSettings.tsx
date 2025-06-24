
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Zap, 
  Calendar, 
  Users,
  FileText,
  Database
} from "lucide-react";
import { EHRSystem } from './types';

interface DataSyncSettingsProps {
  syncSettings: {
    patientData: boolean;
    appointments: boolean;
    clinicalNotes: boolean;
    billing: boolean;
  };
  onSyncToggle: (setting: string, enabled: boolean) => void;
  selectedEHR: EHRSystem | undefined;
  primaryColor: string;
}

export const DataSyncSettings: React.FC<DataSyncSettingsProps> = ({
  syncSettings,
  onSyncToggle,
  selectedEHR,
  primaryColor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" style={{ color: primaryColor }} />
          Data Synchronization
        </CardTitle>
        <CardDescription>
          Choose what data to sync between FlowIQ and {selectedEHR?.name}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <div>
              <Label>Patient Demographics</Label>
              <p className="text-sm text-gray-600">Name, contact info, insurance</p>
            </div>
          </div>
          <Switch
            checked={syncSettings.patientData}
            onCheckedChange={(checked) => onSyncToggle('patientData', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <div>
              <Label>Appointments & Scheduling</Label>
              <p className="text-sm text-gray-600">Sync appointment data</p>
            </div>
          </div>
          <Switch
            checked={syncSettings.appointments}
            onCheckedChange={(checked) => onSyncToggle('appointments', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <div>
              <Label>Clinical Notes & Documentation</Label>
              <p className="text-sm text-gray-600">SOAP notes, treatment plans</p>
            </div>
          </div>
          <Switch
            checked={syncSettings.clinicalNotes}
            onCheckedChange={(checked) => onSyncToggle('clinicalNotes', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <div>
              <Label>Billing & Claims</Label>
              <p className="text-sm text-gray-600">Insurance claims, payments</p>
            </div>
          </div>
          <Switch
            checked={syncSettings.billing}
            onCheckedChange={(checked) => onSyncToggle('billing', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
