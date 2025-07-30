import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Users, TrendingUp, CheckCircle, Clock, Moon } from 'lucide-react';

export const DentalSleepDashboard: React.FC = () => {
  console.log('🦷 DentalSleepDashboard: Rendering DentalSleepDashboard component');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dental Sleep iQ Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dental sleep medicine practice management</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sleep Studies</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients This Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-green-600">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-green-600">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sleep Studies */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Sleep Studies</CardTitle>
            <CardDescription>Latest patient sleep studies and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">John Smith</div>
                <div className="text-sm text-muted-foreground">Sleep Apnea Study</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">CPAP Follow-up</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Mike Wilson</div>
                <div className="text-sm text-muted-foreground">Initial Consultation</div>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule New Appointment
            </Button>
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
            <Button variant="outline" className="w-full">
              <Moon className="mr-2 h-4 w-4" />
              Start Sleep Study
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};