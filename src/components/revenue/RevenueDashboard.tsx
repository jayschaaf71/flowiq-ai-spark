import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    DollarSign,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    Activity,
    Target,
    BarChart3,
    CreditCard,
    Shield,
    Zap
} from 'lucide-react';

interface RevenueMetrics {
    totalRevenue: number;
    outstandingClaims: number;
    collectionRate: number;
    activeClaims: number;
    pendingPayments: number;
    overdueAmount: number;
}

interface RecentActivity {
    id: string;
    type: 'claim_submitted' | 'payment_received' | 'denial_received' | 'auth_approved';
    description: string;
    amount?: number;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
}

export const RevenueDashboard = () => {
    // Mock data - in production this would come from your API
    const metrics: RevenueMetrics = {
        totalRevenue: 45280,
        outstandingClaims: 15420,
        collectionRate: 87.5,
        activeClaims: 23,
        pendingPayments: 12450,
        overdueAmount: 3280
    };

    const recentActivity: RecentActivity[] = [
        {
            id: '1',
            type: 'payment_received',
            description: 'Payment received from Blue Cross Blue Shield',
            amount: 1250.00,
            timestamp: '2024-01-15 14:30',
            status: 'success'
        },
        {
            id: '2',
            type: 'claim_submitted',
            description: 'Claim submitted for Sarah Johnson',
            amount: 850.00,
            timestamp: '2024-01-15 13:45',
            status: 'success'
        },
        {
            id: '3',
            type: 'denial_received',
            description: 'Claim denied - missing authorization',
            amount: 2100.00,
            timestamp: '2024-01-15 12:20',
            status: 'error'
        },
        {
            id: '4',
            type: 'auth_approved',
            description: 'Prior authorization approved for Michael Chen',
            timestamp: '2024-01-15 11:15',
            status: 'success'
        }
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'payment_received':
                return <DollarSign className="w-4 h-4 text-green-600" />;
            case 'claim_submitted':
                return <FileText className="w-4 h-4 text-blue-600" />;
            case 'denial_received':
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case 'auth_approved':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            default:
                return <Activity className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ${metrics.totalRevenue.toLocaleString()}
                                </p>
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
                                <p className="text-2xl font-bold text-blue-600">
                                    ${metrics.outstandingClaims.toLocaleString()}
                                </p>
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
                                <p className="text-2xl font-bold text-purple-600">
                                    {metrics.collectionRate}%
                                </p>
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
                                <p className="text-2xl font-bold text-orange-600">
                                    {metrics.activeClaims}
                                </p>
                            </div>
                            <Activity className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    ${metrics.pendingPayments.toLocaleString()}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                                <p className="text-2xl font-bold text-red-600">
                                    ${metrics.overdueAmount.toLocaleString()}
                                </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                            <FileText className="w-5 h-5" />
                            <span>Submit Claim</span>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                            <Shield className="w-5 h-5" />
                            <span>Verify Insurance</span>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            <span>Process Payment</span>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            <span>View Reports</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getActivityIcon(activity.type)}
                                    <div>
                                        <div className="font-medium">{activity.description}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {activity.amount && (
                                        <span className="font-medium">${activity.amount.toFixed(2)}</span>
                                    )}
                                    <Badge className={getStatusColor(activity.status)}>
                                        {activity.status}
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