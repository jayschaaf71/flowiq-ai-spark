import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DollarSign,
    CreditCard,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    Mail,
    Phone,
    Send,
    Download,
    Upload
} from 'lucide-react';

interface Payment {
    id: string;
    patientName: string;
    amount: number;
    method: 'credit_card' | 'cash' | 'check' | 'insurance';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    date: string;
    transactionId: string;
}

interface Invoice {
    id: string;
    patientName: string;
    amount: number;
    dueDate: string;
    status: 'current' | 'overdue' | 'paid';
    daysPast: number;
}

interface Collection {
    id: string;
    patientName: string;
    amount: number;
    daysOverdue: number;
    lastContact: string;
    nextAction: string;
    priority: 'high' | 'medium' | 'low';
}

export const RevenueCycleManager = () => {
    const [activeTab, setActiveTab] = useState('payments');

    // Mock data
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

    const invoices: Invoice[] = [
        {
            id: '1',
            patientName: 'John Smith',
            amount: 340,
            dueDate: '2024-01-20',
            daysPast: 0,
            status: 'current'
        },
        {
            id: '2',
            patientName: 'Lisa Chen',
            amount: 275,
            dueDate: '2024-01-18',
            daysPast: 2,
            status: 'overdue'
        },
        {
            id: '3',
            patientName: 'Robert Brown',
            amount: 450,
            dueDate: '2024-01-15',
            daysPast: 5,
            status: 'overdue'
        }
    ];

    const collections: Collection[] = [
        {
            id: '1',
            patientName: 'Robert Brown',
            amount: 450,
            daysOverdue: 5,
            lastContact: '2024-01-13',
            nextAction: 'Send final notice',
            priority: 'high'
        },
        {
            id: '2',
            patientName: 'Lisa Chen',
            amount: 275,
            daysOverdue: 2,
            lastContact: '2024-01-14',
            nextAction: 'Call patient',
            priority: 'medium'
        },
        {
            id: '3',
            patientName: 'David Wilson',
            amount: 180,
            daysOverdue: 1,
            lastContact: '2024-01-15',
            nextAction: 'Send reminder',
            priority: 'low'
        }
    ];

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'credit_card': return <CreditCard className="w-4 h-4" />;
            case 'cash': return <DollarSign className="w-4 h-4" />;
            case 'check': return <FileText className="w-4 h-4" />;
            case 'insurance': return <CheckCircle className="w-4 h-4" />;
            default: return <CreditCard className="w-4 h-4" />;
        }
    };

    const getInvoiceStatusColor = (status: string) => {
        switch (status) {
            case 'current': return 'bg-blue-100 text-blue-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            case 'paid': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCollectionPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="payments" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payments
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Billing
                    </TabsTrigger>
                    <TabsTrigger value="collections" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Collections
                    </TabsTrigger>
                </TabsList>

                {/* Payments Tab */}
                <TabsContent value="payments" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Payment Processing</h3>
                            <p className="text-sm text-gray-600">Process patient and insurance payments</p>
                        </div>
                        <Button>
                            <Upload className="w-4 h-4 mr-2" />
                            Import Payments
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Payment Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">Total Collected</p>
                                            <p className="text-2xl font-bold text-green-600">$45,280</p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">Pending Payments</p>
                                            <p className="text-2xl font-bold text-yellow-600">$12,450</p>
                                        </div>
                                        <Clock className="w-8 h-8 text-yellow-600" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">Collection Rate</p>
                                            <p className="text-2xl font-bold text-blue-600">87.5%</p>
                                        </div>
                                        <CheckCircle className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Billing Management</h3>
                            <p className="text-sm text-gray-600">Generate invoices and manage billing</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <Button>
                                <FileText className="w-4 h-4 mr-2" />
                                Generate Invoices
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Pending Invoices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{invoice.patientName}</div>
                                                <div className="text-sm text-gray-500">Due: {invoice.dueDate}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                                                <div className="text-sm text-gray-500">
                                                    {invoice.daysPast > 0 ? `${invoice.daysPast} days overdue` : 'Current'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getInvoiceStatusColor(invoice.status)}>
                                                {invoice.status}
                                            </Badge>
                                            <Button size="sm" variant="outline">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Collections Tab */}
                <TabsContent value="collections" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Collections Management</h3>
                            <p className="text-sm text-gray-600">Follow up on overdue accounts</p>
                        </div>
                        <Button>
                            <Send className="w-4 h-4 mr-2" />
                            Send Reminders
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Overdue Accounts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {collections.map((collection) => (
                                    <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{collection.patientName}</div>
                                                <div className="text-sm text-gray-500">
                                                    {collection.daysOverdue} days overdue
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">${collection.amount.toFixed(2)}</div>
                                                <div className="text-sm text-gray-500">
                                                    Last contact: {collection.lastContact}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getCollectionPriorityColor(collection.priority)}>
                                                {collection.priority}
                                            </Badge>
                                            <Button size="sm" variant="outline">
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 