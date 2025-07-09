import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const PracticeBilling = () => {
  const billingStats = {
    monthlyRevenue: 125000,
    pendingClaims: 1250,
    outstandingBalance: 8500,
    collectionRate: 94.2
  };

  const recentTransactions = [
    { 
      id: 1, 
      patient: "Sarah Johnson",
      amount: 250,
      status: "paid",
      date: "2024-01-15",
      type: "consultation"
    },
    { 
      id: 2, 
      patient: "Mike Chen",
      amount: 150,
      status: "pending",
      date: "2024-01-14",
      type: "follow-up"
    },
    { 
      id: 3, 
      patient: "Lisa Rodriguez",
      amount: 400,
      status: "overdue",
      date: "2024-01-10",
      type: "treatment"
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Revenue</h1>
          <p className="text-muted-foreground">Manage practice billing and financial operations</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${billingStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${billingStats.pendingClaims.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              12 claims processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${billingStats.outstandingBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              5 accounts overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingStats.collectionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Target: 95%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.patient}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {transaction.type} - {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">${transaction.amount}</span>
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col items-center gap-2 p-4">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Submit Claims</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-center gap-2 p-4">
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">Process Payments</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-center gap-2 p-4">
              <AlertCircle className="h-6 w-6" />
              <span className="text-sm">Follow Up Overdue</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-center gap-2 p-4">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Revenue Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};