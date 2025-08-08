import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    FileText,
    Download,
    Calendar,
    Target,
    Activity,
    PieChart,
    LineChart,
    Filter,
    Search
} from 'lucide-react';

interface RevenueMetric {
    period: string;
    totalRevenue: number;
    insuranceRevenue: number;
    patientRevenue: number;
    outstandingClaims: number;
    collectionRate: number;
    change: number;
}

interface PayerPerformance {
    payer: string;
    totalClaims: number;
    approvedClaims: number;
    deniedClaims: number;
    averagePayment: number;
    daysToPayment: number;
    collectionRate: number;
}

interface ServiceRevenue {
    service: string;
    totalRevenue: number;
    patientCount: number;
    averageRevenue: number;
    growthRate: number;
}

export const RevenueAnalytics = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const revenueMetrics: RevenueMetric[] = [
        {
            period: 'January 2024',
            totalRevenue: 45280,
            insuranceRevenue: 32000,
            patientRevenue: 13280,
            outstandingClaims: 15420,
            collectionRate: 87.5,
            change: 12.3
        },
        {
            period: 'December 2023',
            totalRevenue: 40320,
            insuranceRevenue: 28500,
            patientRevenue: 11820,
            outstandingClaims: 12800,
            collectionRate: 85.2,
            change: 8.7
        },
        {
            period: 'November 2023',
            totalRevenue: 37150,
            insuranceRevenue: 26200,
            patientRevenue: 10950,
            outstandingClaims: 14200,
            collectionRate: 83.1,
            change: 5.2
        }
    ];

    const payerPerformance: PayerPerformance[] = [
        {
            payer: 'Blue Cross Blue Shield',
            totalClaims: 45,
            approvedClaims: 42,
            deniedClaims: 3,
            averagePayment: 1250,
            daysToPayment: 28,
            collectionRate: 93.3
        },
        {
            payer: 'United Healthcare',
            totalClaims: 32,
            approvedClaims: 28,
            deniedClaims: 4,
            averagePayment: 980,
            daysToPayment: 35,
            collectionRate: 87.5
        },
        {
            payer: 'Aetna',
            totalClaims: 28,
            approvedClaims: 24,
            deniedClaims: 4,
            averagePayment: 1100,
            daysToPayment: 42,
            collectionRate: 85.7
        }
    ];

    const serviceRevenue: ServiceRevenue[] = [
        {
            service: 'Sleep Study',
            totalRevenue: 18500,
            patientCount: 12,
            averageRevenue: 1542,
            growthRate: 15.2
        },
        {
            service: 'CPAP Equipment',
            totalRevenue: 14200,
            patientCount: 8,
            averageRevenue: 1775,
            growthRate: 8.7
        },
        {
            service: 'Consultation',
            totalRevenue: 8580,
            patientCount: 24,
            averageRevenue: 358,
            growthRate: 12.3
        },
        {
            service: 'Follow-up',
            totalRevenue: 4000,
            patientCount: 16,
            averageRevenue: 250,
            growthRate: 5.8
        }
    ];

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="payers" className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Payer Performance
                    </TabsTrigger>
                    <TabsTrigger value="services" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Service Revenue
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Reports
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Revenue Overview</h3>
                            <p className="text-sm text-gray-600">Key financial metrics and trends</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Revenue Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {revenueMetrics.map((metric) => (
                                        <div key={metric.period} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <div className="font-medium">{metric.period}</div>
                                                    <div className="text-sm text-gray-500">
                                                        ${metric.totalRevenue.toLocaleString()} total
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-medium">{metric.collectionRate}%</div>
                                                    <div className="text-xs text-gray-500">Collection Rate</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-medium">${metric.outstandingClaims.toLocaleString()}</div>
                                                    <div className="text-xs text-gray-500">Outstanding</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={metric.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                    {metric.change > 0 ? '+' : ''}{metric.change}%
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5" />
                                    Revenue Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Insurance Revenue</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">$32,000</div>
                                            <div className="text-xs text-gray-500">70.7%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Patient Revenue</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">$13,280</div>
                                            <div className="text-xs text-gray-500">29.3%</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-sm font-medium mb-2">Key Insights</div>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Collection rate improved 2.3% this month</li>
                                            <li>• Insurance revenue up 12.3% from last month</li>
                                            <li>• Outstanding claims reduced by 8.2%</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Payer Performance Tab */}
                <TabsContent value="payers" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Payer Performance Analysis</h3>
                            <p className="text-sm text-gray-600">Compare insurance payer performance</p>
                        </div>
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Payer Performance Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {payerPerformance.map((payer) => (
                                    <div key={payer.payer} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{payer.payer}</div>
                                                <div className="text-sm text-gray-500">
                                                    {payer.approvedClaims}/{payer.totalClaims} claims approved
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">${payer.averagePayment}</div>
                                                <div className="text-xs text-gray-500">Avg Payment</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{payer.daysToPayment} days</div>
                                                <div className="text-xs text-gray-500">To Payment</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{payer.collectionRate}%</div>
                                                <div className="text-xs text-gray-500">Collection Rate</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={payer.collectionRate > 90 ? 'bg-green-100 text-green-800' : payer.collectionRate > 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                                                {payer.collectionRate > 90 ? 'Excellent' : payer.collectionRate > 80 ? 'Good' : 'Needs Attention'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Service Revenue Tab */}
                <TabsContent value="services" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Service Revenue Analysis</h3>
                            <p className="text-sm text-gray-600">Revenue breakdown by service type</p>
                        </div>
                        <Button>
                            <LineChart className="w-4 h-4 mr-2" />
                            View Trends
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Service Revenue Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {serviceRevenue.map((service) => (
                                    <div key={service.service} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{service.service}</div>
                                                <div className="text-sm text-gray-500">
                                                    {service.patientCount} patients
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">${service.totalRevenue.toLocaleString()}</div>
                                                <div className="text-xs text-gray-500">Total Revenue</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">${service.averageRevenue}</div>
                                                <div className="text-xs text-gray-500">Avg Revenue</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{service.growthRate}%</div>
                                                <div className="text-xs text-gray-500">Growth</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={service.growthRate > 10 ? 'bg-green-100 text-green-800' : service.growthRate > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                                                {service.growthRate > 10 ? 'High Growth' : service.growthRate > 5 ? 'Stable' : 'Declining'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Financial Reports</h3>
                            <p className="text-sm text-gray-600">Generate and download financial reports</p>
                        </div>
                        <Button>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Report
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Standard Reports
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="w-4 h-4 mr-2" />
                                        Monthly Revenue Report
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="w-4 h-4 mr-2" />
                                        Payer Performance Report
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="w-4 h-4 mr-2" />
                                        Collection Rate Analysis
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="w-4 h-4 mr-2" />
                                        Outstanding Claims Report
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Custom Reports
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Search className="w-4 h-4 mr-2" />
                                        Create Custom Report
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Scheduled Reports
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Revenue Forecasting
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Target className="w-4 h-4 mr-2" />
                                        KPI Dashboard
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 