import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  Receipt,
  Shield,
  Zap,
  Database,
  Calculator,
  Target,
  Award
} from 'lucide-react';

// Import existing comprehensive components
import ClaimsIQ from '@/pages/agents/ClaimsIQ';
import RevenueIQ from '@/pages/agents/RevenueIQ';
import BillingIQ from '@/pages/agents/BillingIQ';
import { PaymentsIQ } from '@/pages/agents/PaymentsIQ';
import InsuranceIQ from '@/pages/agents/InsuranceIQ';
import AuthIQ from '@/pages/agents/AuthIQ';
import { DenialManagement } from '@/components/claims/DenialManagement';
import { PaymentProcessingCenter } from '@/components/financial/PaymentProcessingCenter';

interface Claim {
  id: string;
  patientName: string;
  serviceDate: string;
  amount: number;
  status: 'pending' | 'submitted' | 'approved' | 'denied' | 'paid';
  insurance: string;
  claimNumber: string;
  submissionDate: string;
}

interface Payment {
  id: string;
  patientName: string;
  amount: number;
  method: 'credit_card' | 'cash' | 'check' | 'insurance';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  transactionId: string;
}

interface Revenue {
  period: string;
  totalRevenue: number;
  insuranceRevenue: number;
  patientRevenue: number;
  outstandingClaims: number;
  collectionRate: number;
}

export const RevenueAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('claims');

  // Mock data
  const claims: Claim[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      serviceDate: '2024-01-10',
      amount: 1250.00,
      status: 'submitted',
      insurance: 'Blue Cross Blue Shield',
      claimNumber: 'BCBS-2024-001',
      submissionDate: '2024-01-12'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      serviceDate: '2024-01-08',
      amount: 850.00,
      status: 'approved',
      insurance: 'United Healthcare',
      claimNumber: 'UHC-2024-002',
      submissionDate: '2024-01-09'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      serviceDate: '2024-01-05',
      amount: 2100.00,
      status: 'denied',
      insurance: 'Aetna',
      claimNumber: 'AETNA-2024-003',
      submissionDate: '2024-01-07'
    }
  ];

  const payments: Payment[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      amount: 250.00,
      method: 'credit_card',
      status: 'completed',
      date: '2024-01-15',
      transactionId: 'TXN-001'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      amount: 150.00,
      method: 'cash',
      status: 'completed',
      date: '2024-01-14',
      transactionId: 'TXN-002'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      amount: 500.00,
      method: 'insurance',
      status: 'pending',
      date: '2024-01-13',
      transactionId: 'TXN-003'
    }
  ];

  const revenueData: Revenue[] = [
    {
      period: 'January 2024',
      totalRevenue: 45000.00,
      insuranceRevenue: 32000.00,
      patientRevenue: 13000.00,
      outstandingClaims: 15000.00,
      collectionRate: 85.5
    }
  ];

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="w-4 h-4" />;
      case 'cash': return <DollarSign className="w-4 h-4" />;
      case 'check': return <FileText className="w-4 h-4" />;
      case 'insurance': return <Shield className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Assistant</h1>
          <p className="text-gray-600">AI-powered revenue management and financial optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${revenueData[0].totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Claims</p>
                <p className="text-2xl font-bold">${revenueData[0].outstandingClaims.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold">{revenueData[0].collectionRate}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Claims</p>
                <p className="text-2xl font-bold">{claims.length}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="denials">Denials</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-6">
          <ClaimsIQ />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentsIQ />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{payment.patientName}</div>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.method)}
                          <span className="text-sm text-gray-600">
                            ${payment.amount.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{payment.date}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {payment.transactionId}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <BillingIQ />
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <RevenueIQ />
        </TabsContent>

        {/* Auth Tab */}
        <TabsContent value="auth" className="space-y-6">
          <AuthIQ />
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-6">
          <InsuranceIQ />
        </TabsContent>

        {/* Denials Tab */}
        <TabsContent value="denials" className="space-y-6">
          <DenialManagement />
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing" className="space-y-6">
          <PaymentProcessingCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 