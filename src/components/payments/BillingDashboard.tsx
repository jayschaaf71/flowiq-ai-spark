import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CreditCard, Users, TrendingUp, Calendar, MoreHorizontal } from 'lucide-react';
import { SubscriptionManagement } from './SubscriptionManagement';
import { PatientPaymentForm } from './PatientPaymentForm';
import { PaymentLinkGenerator } from './PaymentLinkGenerator';
import { supabase } from '@/integrations/supabase/client';

interface PaymentRecord {
  id: string;
  patient_id: string;
  amount_cents: number;
  payment_type: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export const BillingDashboard: React.FC = () => {
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    completedToday: 0,
    activePatients: 0
  });

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      // Load recent payments
      const { data: payments, error: paymentsError } = await supabase
        .from('patient_payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (paymentsError) throw paymentsError;
      setRecentPayments(payments || []);

      // Calculate stats
      const totalRevenue = payments
        ?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount_cents, 0) || 0;

      const pendingPayments = payments
        ?.filter(p => p.status === 'pending').length || 0;

      const today = new Date().toISOString().split('T')[0];
      const completedToday = payments
        ?.filter(p => p.status === 'completed' && p.paid_at?.startsWith(today)).length || 0;

      setStats({
        totalRevenue: totalRevenue / 100,
        pendingPayments,
        completedToday,
        activePatients: new Set(payments?.map(p => p.patient_id)).size
      });

    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'copay':
        return 'Copay';
      case 'balance':
        return 'Balance';
      case 'procedure':
        return 'Procedure';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatients}</div>
            <p className="text-xs text-muted-foreground">With payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patient-payments">Patient Payments</TabsTrigger>
          <TabsTrigger value="payment-links">Payment Links</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment Activity</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ${(payment.amount_cents / 100).toFixed(2)}
                          </span>
                          <Badge variant="outline">
                            {getPaymentTypeLabel(payment.payment_type)}
                          </Badge>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Patient ID: {payment.patient_id}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent payments
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patient-payments">
          <PatientPaymentForm onPaymentComplete={loadBillingData} />
        </TabsContent>

        <TabsContent value="payment-links">
          <PaymentLinkGenerator />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};