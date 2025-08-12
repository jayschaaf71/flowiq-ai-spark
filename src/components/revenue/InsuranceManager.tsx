import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Shield,
    CheckCircle,
    Clock,
    AlertTriangle,
    FileText,
    Send,
    Search,
    Phone,
    Mail,
    Download,
    Upload,
    Activity,
    Target
} from 'lucide-react';

interface EligibilityCheck {
    id: string;
    patientName: string;
    insurance: string;
    status: 'verified' | 'pending' | 'failed';
    coverage: string;
    copay: number;
    deductible: number;
    lastChecked: string;
}

interface Authorization {
    id: string;
    patientName: string;
    service: string;
    insurance: string;
    status: 'approved' | 'pending' | 'denied';
    requestDate: string;
    responseDate?: string;
    authNumber?: string;
}

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

interface Denial {
    id: string;
    patientName: string;
    claimNumber: string;
    denialReason: string;
    amount: number;
    status: 'new' | 'appealing' | 'resolved';
    denialDate: string;
    appealDeadline: string;
}

export const InsuranceManager = () => {
    const [activeTab, setActiveTab] = useState('eligibility');

    // Mock data
    const eligibilityChecks: EligibilityCheck[] = [
        {
            id: '1',
            patientName: 'Sarah Johnson',
            insurance: 'Blue Cross Blue Shield',
            status: 'verified',
            coverage: 'PPO',
            copay: 25,
            deductible: 500,
            lastChecked: '2024-01-15 10:30'
        },
        {
            id: '2',
            patientName: 'Michael Chen',
            insurance: 'United Healthcare',
            status: 'pending',
            coverage: 'HMO',
            copay: 20,
            deductible: 1000,
            lastChecked: '2024-01-15 09:15'
        },
        {
            id: '3',
            patientName: 'Lisa Rodriguez',
            insurance: 'Aetna',
            status: 'failed',
            coverage: 'PPO',
            copay: 30,
            deductible: 750,
            lastChecked: '2024-01-15 08:45'
        }
    ];

    const authorizations: Authorization[] = [
        {
            id: '1',
            patientName: 'Sarah Johnson',
            service: 'Sleep Study',
            insurance: 'Blue Cross Blue Shield',
            status: 'approved',
            requestDate: '2024-01-10',
            responseDate: '2024-01-12',
            authNumber: 'AUTH-001'
        },
        {
            id: '2',
            patientName: 'Michael Chen',
            service: 'CPAP Equipment',
            insurance: 'United Healthcare',
            status: 'pending',
            requestDate: '2024-01-13'
        },
        {
            id: '3',
            patientName: 'Lisa Rodriguez',
            service: 'Follow-up Consultation',
            insurance: 'Aetna',
            status: 'denied',
            requestDate: '2024-01-08',
            responseDate: '2024-01-10'
        }
    ];

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

    const denials: Denial[] = [
        {
            id: '1',
            patientName: 'Lisa Rodriguez',
            claimNumber: 'AETNA-2024-003',
            denialReason: 'Missing authorization',
            amount: 2100.00,
            status: 'new',
            denialDate: '2024-01-10',
            appealDeadline: '2024-02-10'
        },
        {
            id: '2',
            patientName: 'John Smith',
            claimNumber: 'BCBS-2024-004',
            denialReason: 'Incorrect coding',
            amount: 850.00,
            status: 'appealing',
            denialDate: '2024-01-08',
            appealDeadline: '2024-02-08'
        },
        {
            id: '3',
            patientName: 'Emma Davis',
            claimNumber: 'UHC-2024-005',
            denialReason: 'Out of network',
            amount: 1200.00,
            status: 'resolved',
            denialDate: '2024-01-05',
            appealDeadline: '2024-02-05'
        }
    ];

    const getEligibilityStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAuthStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'denied': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getClaimStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'submitted': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-gray-100 text-gray-800';
            case 'denied': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDenialStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-red-100 text-red-800';
            case 'appealing': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="eligibility" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Eligibility
                    </TabsTrigger>
                    <TabsTrigger value="authorization" className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Authorization
                    </TabsTrigger>
                    <TabsTrigger value="claims" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Claims
                    </TabsTrigger>
                    <TabsTrigger value="denials" className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Denials
                    </TabsTrigger>
                </TabsList>

                {/* Eligibility Tab */}
                <TabsContent value="eligibility" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Insurance Eligibility Verification</h3>
                            <p className="text-sm text-gray-600">Verify patient insurance coverage and benefits</p>
                        </div>
                        <Button>
                            <Search className="w-4 h-4 mr-2" />
                            Verify Eligibility
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Recent Eligibility Checks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {eligibilityChecks.map((check) => (
                                    <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{check.patientName}</div>
                                                <div className="text-sm text-gray-500">{check.insurance}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{check.coverage}</div>
                                                <div className="text-xs text-gray-500">Plan Type</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">${check.copay}</div>
                                                <div className="text-xs text-gray-500">Copay</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">${check.deductible}</div>
                                                <div className="text-xs text-gray-500">Deductible</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getEligibilityStatusColor(check.status)}>
                                                {check.status}
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

                {/* Authorization Tab */}
                <TabsContent value="authorization" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Prior Authorization Management</h3>
                            <p className="text-sm text-gray-600">Track authorization requests and responses</p>
                        </div>
                        <Button>
                            <Send className="w-4 h-4 mr-2" />
                            Request Authorization
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Authorization Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {authorizations.map((auth) => (
                                    <div key={auth.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{auth.patientName}</div>
                                                <div className="text-sm text-gray-500">{auth.service}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{auth.insurance}</div>
                                                <div className="text-xs text-gray-500">Payer</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{auth.requestDate}</div>
                                                <div className="text-xs text-gray-500">Requested</div>
                                            </div>
                                            {auth.authNumber && (
                                                <div className="text-center">
                                                    <div className="text-sm font-medium">{auth.authNumber}</div>
                                                    <div className="text-xs text-gray-500">Auth #</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getAuthStatusColor(auth.status)}>
                                                {auth.status}
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

                {/* Claims Tab */}
                <TabsContent value="claims" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Claims Processing</h3>
                            <p className="text-sm text-gray-600">Submit and track insurance claims</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Import Claims
                            </Button>
                            <Button>
                                <FileText className="w-4 h-4 mr-2" />
                                Submit Claims
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Recent Claims
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {claims.map((claim) => (
                                    <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{claim.patientName}</div>
                                                <div className="text-sm text-gray-500">{claim.insurance}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">${claim.amount.toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">Amount</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{claim.serviceDate}</div>
                                                <div className="text-xs text-gray-500">Service Date</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{claim.claimNumber}</div>
                                                <div className="text-xs text-gray-500">Claim #</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getClaimStatusColor(claim.status)}>
                                                {claim.status}
                                            </Badge>
                                            <Button size="sm" variant="outline">
                                                <Activity className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Denials Tab */}
                <TabsContent value="denials" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Denial Management</h3>
                            <p className="text-sm text-gray-600">Track and appeal claim denials</p>
                        </div>
                        <Button>
                            <Target className="w-4 h-4 mr-2" />
                            Appeal Denial
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Recent Denials
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {denials.map((denial) => (
                                    <div key={denial.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-medium">{denial.patientName}</div>
                                                <div className="text-sm text-gray-500">{denial.claimNumber}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">${denial.amount.toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">Amount</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{denial.denialDate}</div>
                                                <div className="text-xs text-gray-500">Denied</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium">{denial.appealDeadline}</div>
                                                <div className="text-xs text-gray-500">Appeal Deadline</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getDenialStatusColor(denial.status)}>
                                                {denial.status}
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
            </Tabs>
        </div>
    );
}; 