import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Users, Calendar, TrendingUp } from 'lucide-react';

const DentalSleepDashboardContent: React.FC = () => {
  const { specialty, theme, getBrandName } = useSpecialty();
  
  const stats = [
    {
      title: "Active Sleep Studies",
      value: "24",
      icon: Moon,
      trend: "+12%"
    },
    {
      title: "Patients This Month",
      value: "156",
      icon: Users,
      trend: "+8%"
    },
    {
      title: "Upcoming Appointments",
      value: "18",
      icon: Calendar,
      trend: "+15%"
    },
    {
      title: "Compliance Rate",
      value: "89%",
      icon: TrendingUp,
      trend: "+3%"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            {getBrandName()} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to your dental sleep medicine practice management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.trend}</span> from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sleep Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-muted-foreground">Sleep Apnea Study</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">CPAP Follow-up</p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Mike Wilson</p>
                    <p className="text-sm text-muted-foreground">Initial Consultation</p>
                  </div>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Scheduled
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Schedule New Appointment</span>
                  </div>
                </button>
                <button className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Add New Patient</span>
                  </div>
                </button>
                <button className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-primary" />
                    <span>Start Sleep Study</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DentalSleepDashboardFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Moon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Dental Sleep Dashboard</h2>
            <p className="text-muted-foreground">Loading your practice data...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const DentalSleepDashboard: React.FC = () => {
  return (
    <ErrorBoundary 
      fallback={<DentalSleepDashboardFallback />}
      onError={(error) => console.error('DentalSleepDashboard error:', error)}
    >
      <React.Suspense fallback={<LoadingSpinner text="Loading dashboard..." />}>
        <DentalSleepDashboardContent />
      </React.Suspense>
    </ErrorBoundary>
  );
};