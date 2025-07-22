import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, Mail, Users, Calendar } from 'lucide-react';
import { PRACTICE_CONFIGS, PracticeConfig } from '@/utils/practiceConfig';

interface PracticeOverviewProps {
  practiceId: string;
}

export const PracticeOverview: React.FC<PracticeOverviewProps> = ({ practiceId }) => {
  const config = Object.values(PRACTICE_CONFIGS).find(p => p.id === practiceId);
  
  if (!config) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Practice configuration not found.</p>
        </CardContent>
      </Card>
    );
  }

  const workingDays = Object.entries(config.workingHours)
    .filter(([day, hours]) => hours !== null)
    .map(([day]) => day);

  return (
    <div className="space-y-6">
      {/* Practice Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{config.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                Specializing in {config.specialty.replace('-', ' ')}
              </p>
            </div>
            <Badge 
              style={{ backgroundColor: config.colors.primary }}
              className="text-white"
            >
              {config.subdomain}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Operating Days</p>
                <p className="text-sm text-muted-foreground">
                  {workingDays.length} days/week
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Appointment Types</p>
                <p className="text-sm text-muted-foreground">
                  {config.appointmentTypes.length} types
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Form Templates</p>
                <p className="text-sm text-muted-foreground">
                  {config.formTemplates.length} templates
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">
                  {config.timezone}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(config.workingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium capitalize">{day}</span>
                {hours ? (
                  <span className="text-sm text-muted-foreground">
                    {hours.start} - {hours.end}
                  </span>
                ) : (
                  <Badge variant="secondary">Closed</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Types */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {config.appointmentTypes.map((type, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <span className="text-sm font-medium">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Form Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.formTemplates.map((template, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <span className="text-sm font-medium capitalize">
                  {template.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};