
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, TrendingUp, Receipt } from 'lucide-react';

export const BillingDashboard: React.FC = () => {
  const billingStats = {
    revenueToday: 2847,
    revenueThisMonth: 45620,
    outstandingInvoices: 12450,
    paidThisMonth: 33170
  };

  const recentTransactions = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      amount: 245.00,
      type: 'payment',
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 2,
      customer: 'Mike Wilson',
      amount: 180.00,
      type: 'invoice',
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: 3,
      customer: 'Emma Davis',
      amount: 450.00,
      type: 'payment',
      status: 'completed',
      date: '2024-01-13'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${billingStats.revenueToday}</p>
                <p className="text-sm text-gray-600">Revenue Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">${billingStats.revenueThisMonth}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">${billingStats.outstandingInvoices}</p>
                <p className="text-sm text-gray-600">Outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">${billingStats.paidThisMonth}</p>
                <p className="text-sm text-gray-600">Paid This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Track payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {transaction.type === 'payment' ? (
                      <CreditCard className="h-5 w-5 text-green-600" />
                    ) : (
                      <Receipt className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.customer}</div>
                    <div className="text-sm text-gray-600">{transaction.type}</div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold">${transaction.amount}</div>
                  </div>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
