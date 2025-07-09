import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, User, ArrowUpDown } from 'lucide-react';

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  incident_type: string;
  detected_at: string;
  resolved_at?: string;
  assigned_to?: string;
  affected_systems?: string[];
  impact_level?: string;
  response_time_minutes?: number;
  resolution_time_minutes?: number;
  tenant_id?: string;
}

interface SecurityIncidentCardProps {
  incident: SecurityIncident;
}

export const SecurityIncidentCard: React.FC<SecurityIncidentCardProps> = ({ incident }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'investigating': return 'secondary';
      case 'resolved': return 'default';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{incident.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{incident.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getSeverityColor(incident.severity)}>
              {incident.severity.toUpperCase()}
            </Badge>
            <Badge variant={getStatusColor(incident.status) as any}>
              {incident.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(incident.detected_at).toLocaleDateString()}</span>
          </div>
          {incident.assigned_to && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{incident.assigned_to}</span>
            </div>
          )}
          {incident.impact_level && (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span>{incident.impact_level} Impact</span>
            </div>
          )}
          {incident.response_time_minutes && (
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span>{incident.response_time_minutes}m response</span>
            </div>
          )}
        </div>
        
        {incident.affected_systems && incident.affected_systems.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Affected Systems:</p>
            <div className="flex flex-wrap gap-1">
              {incident.affected_systems.map((system, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {system}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm">View Details</Button>
          {incident.status === 'open' && (
            <Button size="sm">Investigate</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};