import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, Zap } from 'lucide-react';

export const PaymentProcessor: React.FC = () => {
    const paymentMethods = [
        {
            id: 1,
            type: 'Credit Card',
            last4: '4242',
            status: 'active',
            isDefault: true
        },
        {
            id: 2,
            type: 'Bank Account',
            last4: '1234',
            status: 'active',
            isDefault: false
        }
    ];

    const recentPayments = [
        {
            id: 1,
            customer: 'Sarah Johnson',
            amount: 245.00,
            method: 'Credit Card',
            status: 'completed',
            date: '2024-01-15'
        },
        {
            id: 2,
            customer: 'Emma Davis',
            amount: 450.00,
            method: 'Bank Transfer',
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
            {/* Payment Methods */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment processing</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{method.type}</div>
                                        <div className="text-sm text-gray-600">•••• {method.last4}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(method.status)}>
                                        {method.status}
                                    </Badge>
                                    {method.isDefault && (
                                        <Badge className="bg-green-100 text-green-700">
                                            Default
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>Track payment processing</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentPayments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{payment.customer}</div>
                                        <div className="text-sm text-gray-600">{payment.method}</div>
                                        <div className="text-xs text-gray-500">{payment.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="font-bold">${payment.amount}</div>
                                    </div>
                                    <Badge className={getStatusColor(payment.status)}>
                                        {payment.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Secure Payment Processing
                    </CardTitle>
                    <CardDescription>Powered by Stripe with PCI compliance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Zap className="h-4 w-4" />
                        Real-time processing with fraud protection
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 