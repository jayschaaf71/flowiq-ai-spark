import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  MessageSquare, 
  Bell, 
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Phone,
  MapPin,
  Star,
  CreditCard,
  FileText,
  Download,
  Zap,
  Shield
} from 'lucide-react';

interface UpcomingAppointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  type: string;
  location: string;
  status: 'confirmed' | 'pending' | 'reminded';
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

export const PatientMobileExperience: React.FC = () => {
  const { toast } = useToast();
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([
    {
      id: '1',
      date: '2024-07-05',
      time: '2:00 PM',
      provider: 'Dr. Sarah Johnson',
      type: 'Follow-up Visit',
      location: 'Main Clinic - Room 205',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2024-07-12',
      time: '10:30 AM',
      provider: 'Dr. Michael Chen',
      type: 'Dental Cleaning',
      location: 'Dental Wing - Chair 3',
      status: 'pending'
    }
  ]);

  const [healthMetrics] = useState<HealthMetric[]>([
    { id: '1', name: 'Blood Pressure', value: 120, unit: '/80 mmHg', status: 'good', lastUpdated: '2 days ago' },
    { id: '2', name: 'Heart Rate', value: 72, unit: 'bpm', status: 'good', lastUpdated: '2 days ago' },
    { id: '3', name: 'Blood Sugar', value: 95, unit: 'mg/dL', status: 'good', lastUpdated: '1 week ago' },
    { id: '4', name: 'Weight', value: 165, unit: 'lbs', status: 'warning', lastUpdated: '2 weeks ago' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Lab Results Available', message: 'Your recent blood work results are ready for review', time: '2 hours ago', urgent: false },
    { id: '2', title: 'Appointment Reminder', message: 'Upcoming appointment with Dr. Johnson tomorrow at 2:00 PM', time: '1 day ago', urgent: true },
    { id: '3', title: 'Prescription Ready', message: 'Your prescription refill is ready for pickup', time: '2 days ago', urgent: false }
  ]);

  const handleQuickAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} feature coming soon!`,
    });
  };

  const getHealthStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthStatusIcon = (status: HealthMetric['status']) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Header with Patient Photo */}
      <Card className="gradient-primary text-primary-foreground border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Good afternoon, John!</h1>
              <p className="text-primary-foreground/80">Your health journey continues</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">4.9</span>
                </div>
                <span className="text-sm text-primary-foreground/70">Patient satisfaction</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Notifications */}
      {notifications.filter(n => n.urgent).map(notification => (
        <Alert key={notification.id} className="border-warning/50 bg-warning/5">
          <Bell className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">{notification.title}</div>
            <div className="text-sm text-muted-foreground">{notification.message}</div>
          </AlertDescription>
        </Alert>
      ))}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard
          icon={Calendar}
          title="Book Appointment"
          description="Schedule your next visit"
          color="bg-blue-500"
          onClick={() => handleQuickAction('Book Appointment')}
        />
        <QuickActionCard
          icon={MessageSquare}
          title="Message Doctor"
          description="Secure communication"
          color="bg-green-500"
          onClick={() => handleQuickAction('Message Doctor')}
        />
        <QuickActionCard
          icon={CreditCard}
          title="Pay Bills"
          description="Manage payments"
          color="bg-purple-500"
          onClick={() => handleQuickAction('Pay Bills')}
        />
        <QuickActionCard
          icon={FileText}
          title="View Records"
          description="Health history"
          color="bg-orange-500"
          onClick={() => handleQuickAction('View Records')}
        />
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="p-4 border rounded-xl hover-lift cursor-pointer bg-gradient-subtle">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{appointment.type}</h3>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.date} at {appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{appointment.provider}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full" onClick={() => handleQuickAction('View All Appointments')}>
            View All Appointments
          </Button>
        </CardContent>
      </Card>

      {/* Health Metrics Dashboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-red-500" />
            Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {healthMetrics.map((metric) => {
              const StatusIcon = getHealthStatusIcon(metric.status);
              return (
                <div key={metric.id} className="p-3 border rounded-lg bg-gradient-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <StatusIcon className={`w-4 h-4 ${getHealthStatusColor(metric.status)}`} />
                  </div>
                  <div className="text-lg font-bold">
                    {metric.value}
                    <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{metric.lastUpdated}</div>
                </div>
              );
            })}
          </div>
          
          <Button variant="outline" className="w-full mt-4" onClick={() => handleQuickAction('View Health Dashboard')}>
            <Zap className="w-4 h-4 mr-2" />
            View Full Health Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-blue-500" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className="p-3 border rounded-lg hover-lift cursor-pointer">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${notification.urgent ? 'bg-warning' : 'bg-success'}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full" onClick={() => handleQuickAction('View All Notifications')}>
            View All Notifications
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Emergency Contact</h3>
                <p className="text-sm text-muted-foreground">24/7 urgent care line</p>
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Call Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuickActionCard: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}> = ({ icon: Icon, title, description, color, onClick }) => (
  <Card className="hover-lift cursor-pointer transition-all duration-200 hover:shadow-lg" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-2`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);