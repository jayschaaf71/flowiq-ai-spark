import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Receipt, 
  CreditCard, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  FileText,
  Shield,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  User,
  Database,
  MessageSquare,
  Settings,
  BarChart3,
  Target,
  RefreshCw,
  AlertCircle,
  CheckSquare
} from 'lucide-react';

interface Claim {
  id: string;
  patientName: string;
  serviceDate: string;
  amount: number;
  status: 'complete-not-submitted' | 'submitted-not-paid' | 'paid' | 'denied' | 'pending';
  insurance: string;
  daysSinceService: number;
  claimNumber: string;
}

interface Payment {
  id: string;
  patientName: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  reference: string;
}

interface InsuranceAuth {
  id: string;
  patientName: string;
  service: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  requestDate: string;
  responseDate?: string;
  insurance: string;
}

export const RevenueAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('claims');
  const [metrics, setMetrics] = useState({
    totalClaims: 45,
    pendingClaims: 12,
    paidClaims: 28,
    deniedClaims: 5,
    totalRevenue: 125000,
    pendingRevenue: 32000,
    collectedRevenue: 93000,
    averageDaysToPayment: 18
  });

  // Mock data
  const claims: Claim[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      serviceDate: '2024-01-14',
      amount: 2500,
      status: 'complete-not-submitted',
      insurance: 'Blue Cross',
      daysSinceService: 1,
      claimNumber: 'BC-2024-001'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      serviceDate: '2024-01-13',
      amount: 1800,
      status: 'submitted-not-paid',
      insurance: 'Aetna',
      daysSinceService: 2,
      claimNumber: 'AE-2024-002'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      serviceDate: '2024-01-12',
      amount: 3200,
      status: 'paid',
      insurance: 'Cigna',
      daysSinceService: 3,
      claimNumber: 'CG-2024-003'
    },
    {
      id: '4',
      patientName: 'David Thompson',
      serviceDate: '2024-01-11',
      amount: 1500,
      status: 'denied',
      insurance: 'UnitedHealth',
      daysSinceService: 4,
      claimNumber: 'UH-2024-004'
    },
    {
      id: '5',
      patientName: 'Emma Wilson',
      serviceDate: '2024-01-10',
      amount: 2100,
      status: 'submitted-not-paid',
      insurance: 'Blue Cross',
      daysSinceService: 5,
      claimNumber: 'BC-2024-005'
    }
  ];

  const payments: Payment[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      amount: 250,
      method: 'Credit Card',
      status: 'completed',
      date: '2024-01-15',
      reference: 'CC-2024-001'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      amount: 180,
      method: 'Insurance',
      status: 'pending',
      date: '2024-01-14',
      reference: 'INS-2024-002'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      amount: 320,
      method: 'Cash',
      status: 'completed',
      date: '2024-01-13',
      reference: 'CASH-2024-003'
    }
  ];

  const authorizations: InsuranceAuth[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      service: 'CPAP Equipment',
      status: 'approved',
      requestDate: '2024-01-10',
      responseDate: '2024-01-12',
      insurance: 'Blue Cross'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      service: 'Sleep Study',
      status: 'pending',
      requestDate: '2024-01-13',
      insurance: 'Aetna'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      service: 'Oral Appliance',
      status: 'denied',
      requestDate: '2024-01-08',
      responseDate: '2024-01-10',
      insurance: 'Cigna'
    }
  ];

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

  const getClaimStatusIcon = (status: string) => {
    switch (status) {
      case 'complete-not-submitted':
        return <AlertCircle className="h-4 w-4" />;
      case 'submitted-not-paid':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'denied':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAuthStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'denied':
        return 'bg-red-500 text-white';
      case 'expired':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Assistant</h1>
          <p className="text-gray-600">AI-powered revenue cycle management and insurance processing</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm bg-gradient-to-r from-green-500 to-blue-500 text-white">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${metrics.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-green-700 mt-2">+15% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Collected Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${metrics.collectedRevenue.toLocaleString()}</div>
            <div className="text-xs text-blue-700 mt-2">74% collection rate</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Pending Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">${metrics.pendingRevenue.toLocaleString()}</div>
            <div className="text-xs text-orange-700 mt-2">26% pending</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Avg Days to Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{metrics.averageDaysToPayment}</div>
            <div className="text-xs text-purple-700 mt-2">days</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="claims" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Claims Management
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Processing
          </TabsTrigger>
          <TabsTrigger value="authorizations" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Insurance Auth
          </TabsTrigger>
        </TabsList>

        {/* Claims Management Tab */}
        <TabsContent value="claims" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Claims List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Claims Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getClaimStatusColor(claim.status)}`}>
                          {getClaimStatusIcon(claim.status)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{claim.patientName}</div>
                          <div className="text-sm text-gray-600">{claim.insurance} • {claim.serviceDate}</div>
                          <div className="text-xs text-gray-500 mt-1">Claim: {claim.claimNumber}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">${claim.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{claim.daysSinceService} days ago</div>
                        </div>
                        <Badge className={getClaimStatusColor(claim.status)}>
                          {claim.status.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Claims Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Claims Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Claims</span>
                    <span className="font-medium">{metrics.totalClaims}</span>
                  </div>
                  <Progress value={62} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Paid Claims</span>
                    <span className="font-medium text-green-600">{metrics.paidClaims}</span>
                  </div>
                  <Progress value={62} className="h-2 bg-green-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Claims</span>
                    <span className="font-medium text-yellow-600">{metrics.pendingClaims}</span>
                  </div>
                  <Progress value={27} className="h-2 bg-yellow-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Denied Claims</span>
                    <span className="font-medium text-red-600">{metrics.deniedClaims}</span>
                  </div>
                  <Progress value={11} className="h-2 bg-red-100" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Processing Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payments List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getPaymentStatusColor(payment.status)}`}>
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{payment.patientName}</div>
                          <div className="text-sm text-gray-600">{payment.method} • {payment.date}</div>
                          <div className="text-xs text-gray-500 mt-1">Ref: {payment.reference}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">${payment.amount.toLocaleString()}</div>
                        </div>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Insurance</div>
                      <div className="text-sm text-blue-700">Primary payment method</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">65%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Credit Card</div>
                      <div className="text-sm text-green-700">Patient payments</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">25%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Cash</div>
                      <div className="text-sm text-purple-700">Walk-in payments</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">10%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insurance Authorization Tab */}
        <TabsContent value="authorizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Authorizations List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Insurance Authorizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {authorizations.map((auth) => (
                    <div key={auth.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getAuthStatusColor(auth.status)}`}>
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{auth.patientName}</div>
                          <div className="text-sm text-gray-600">{auth.service} • {auth.insurance}</div>
                          <div className="text-xs text-gray-500 mt-1">Requested: {auth.requestDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {auth.responseDate && (
                            <div className="text-sm text-gray-600">Response: {auth.responseDate}</div>
                          )}
                        </div>
                        <Badge className={getAuthStatusColor(auth.status)}>
                          {auth.status.charAt(0).toUpperCase() + auth.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Authorization Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Authorization Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Approved</div>
                      <div className="text-sm text-green-700">Authorization granted</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">8</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium text-yellow-900">Pending</div>
                      <div className="text-sm text-yellow-700">Awaiting response</div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">3</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-red-900">Denied</div>
                      <div className="text-sm text-red-700">Authorization denied</div>
                    </div>
                    <div className="text-2xl font-bold text-red-900">2</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 