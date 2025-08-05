import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import {
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Shield,
  Activity,
  Target,
  MessageSquare,
  Settings,
  Stethoscope,
  Package,
  Moon,
  Receipt,
  CreditCard,
  AlertCircle,
  CheckSquare,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  status: 'confirmed' | 'scheduled' | 'pending' | 'cancelled';
  type: string;
  duration: number;
}

interface Claim {
  id: string;
  patientName: string;
  serviceDate: string;
  amount: number;
  status: 'complete-not-submitted' | 'submitted-not-paid' | 'paid' | 'denied' | 'pending';
  insurance: string;
  daysSinceService: number;
}

interface DashboardMetrics {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalClaims: number;
  completeNotSubmitted: number;
  submittedNotPaid: number;
  paidClaims: number;
  deniedClaims: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
}

export const DentalSleepDashboard = () => {
  const { tenantConfig, getBrandName } = useSpecialty();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    totalClaims: 0,
    completeNotSubmitted: 0,
    submittedNotPaid: 0,
    paidClaims: 0,
    deniedClaims: 0,
    revenueToday: 0,
    revenueWeek: 0,
    revenueMonth: 0
  });

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [pendingClaims, setPendingClaims] = useState<Claim[]>([]);

  // Mock data - replace with real API calls
  useEffect(() => {
    // Simulate loading data
    const mockAppointments: Appointment[] = [
      { id: '1', patientName: 'Sarah Johnson', time: '9:00 AM', status: 'confirmed', type: 'Sleep Study Review', duration: 60 },
      { id: '2', patientName: 'Michael Chen', time: '10:30 AM', status: 'scheduled', type: 'CPAP Fitting', duration: 45 },
      { id: '3', patientName: 'Lisa Rodriguez', time: '2:00 PM', status: 'pending', type: 'Follow-up', duration: 30 },
      { id: '4', patientName: 'David Thompson', time: '3:30 PM', status: 'confirmed', type: 'Initial Consultation', duration: 90 },
      { id: '5', patientName: 'Emma Wilson', time: '5:00 PM', status: 'scheduled', type: 'DME Delivery', duration: 30 }
    ];

    const mockClaims: Claim[] = [
      { id: '1', patientName: 'Sarah Johnson', serviceDate: '2024-01-14', amount: 2500, status: 'complete-not-submitted', insurance: 'Blue Cross', daysSinceService: 1 },
      { id: '2', patientName: 'Michael Chen', serviceDate: '2024-01-13', amount: 1800, status: 'submitted-not-paid', insurance: 'Aetna', daysSinceService: 2 },
      { id: '3', patientName: 'Lisa Rodriguez', serviceDate: '2024-01-12', amount: 3200, status: 'paid', insurance: 'Cigna', daysSinceService: 3 },
      { id: '4', patientName: 'David Thompson', serviceDate: '2024-01-11', amount: 1500, status: 'denied', insurance: 'UnitedHealth', daysSinceService: 4 },
      { id: '5', patientName: 'Emma Wilson', serviceDate: '2024-01-10', amount: 2100, status: 'submitted-not-paid', insurance: 'Blue Cross', daysSinceService: 5 }
    ];

    setTodayAppointments(mockAppointments);
    setPendingClaims(mockClaims);

    // Calculate metrics
    const confirmed = mockAppointments.filter(a => a.status === 'confirmed').length;
    const scheduled = mockAppointments.filter(a => a.status === 'scheduled').length;
    const pending = mockAppointments.filter(a => a.status === 'pending').length;
    const cancelled = mockAppointments.filter(a => a.status === 'cancelled').length;

    const completeNotSubmitted = mockClaims.filter(c => c.status === 'complete-not-submitted').length;
    const submittedNotPaid = mockClaims.filter(c => c.status === 'submitted-not-paid').length;
    const paid = mockClaims.filter(c => c.status === 'paid').length;
    const denied = mockClaims.filter(c => c.status === 'denied').length;

    setMetrics({
      totalAppointments: mockAppointments.length,
      confirmedAppointments: confirmed,
      pendingAppointments: pending,
      cancelledAppointments: cancelled,
      totalClaims: mockClaims.length,
      completeNotSubmitted,
      submittedNotPaid,
      paidClaims: paid,
      deniedClaims: denied,
      revenueToday: 4500,
      revenueWeek: 18500,
      revenueMonth: 72000
    });
  }, []);

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'scheduled':
        return 'bg-yellow-500 text-white';
      case 'pending':
        return 'bg-orange-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAppointmentStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'complete-not-submitted':
        return 'bg-red-500 text-white';
      case 'submitted-not-paid':
        return 'bg-yellow-500 text-white';
      case 'paid':
        return 'bg-green-500 text-white';
      case 'denied':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getClaimStatusText = (status: string) => {
    switch (status) {
      case 'complete-not-submitted':
        return 'Complete - Not Submitted';
      case 'submitted-not-paid':
        return 'Submitted - Not Paid';
      case 'paid':
        return 'Paid';
      case 'denied':
        return 'Denied';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-6 w-full max-w-none min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">{tenantConfig?.brand_name || getBrandName()}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{metrics.totalAppointments}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-blue-700">{metrics.confirmedAppointments} Confirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-blue-700">{metrics.pendingAppointments} Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Revenue Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${metrics.revenueToday.toLocaleString()}</div>
            <div className="text-xs text-green-700 mt-2">+12% from yesterday</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Claims Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{metrics.completeNotSubmitted + metrics.submittedNotPaid}</div>
            <div className="text-xs text-orange-700 mt-2">{metrics.completeNotSubmitted} need submission</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">${metrics.revenueMonth.toLocaleString()}</div>
            <div className="text-xs text-purple-700 mt-2">+8% from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments with Status Indicators */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <div className="space-y-3 w-full">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getAppointmentStatusColor(appointment.status)}`}>
                    {getAppointmentStatusIcon(appointment.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{appointment.patientName}</div>
                    <div className="text-sm text-gray-600">{appointment.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{appointment.time}</div>
                    <div className="text-sm text-gray-600">{appointment.duration} min</div>
                  </div>
                  <Badge className={getAppointmentStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Claims Status - Critical for Revenue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Claims Status - Revenue Critical
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getClaimStatusColor(claim.status)}`}>
                    {claim.status === 'complete-not-submitted' && <AlertCircle className="h-4 w-4" />}
                    {claim.status === 'submitted-not-paid' && <Clock className="h-4 w-4" />}
                    {claim.status === 'paid' && <CheckCircle className="h-4 w-4" />}
                    {claim.status === 'denied' && <XCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{claim.patientName}</div>
                    <div className="text-sm text-gray-600">{claim.insurance} • {claim.serviceDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${claim.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{claim.daysSinceService} days ago</div>
                  </div>
                  <Badge className={getClaimStatusColor(claim.status)}>
                    {getClaimStatusText(claim.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
          <Stethoscope className="h-6 w-6" />
          <span className="text-sm">Clinical Assistant</span>
        </Button>
        <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
          <MessageSquare className="h-6 w-6" />
          <span className="text-sm">Communication</span>
        </Button>
        <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
          <TrendingUp className="h-6 w-6" />
          <span className="text-sm">Revenue Assistant</span>
        </Button>
        <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Settings className="h-6 w-6" />
          <span className="text-sm">Operations</span>
        </Button>
      </div>
    </div>
  );
};