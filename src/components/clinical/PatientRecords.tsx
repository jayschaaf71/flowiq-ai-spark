import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    User,
    FileText,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    Plus,
    Search,
    Filter,
    Edit,
    Eye,
    Download,
    Upload,
    Activity,
    Heart,
    Pill,
    Stethoscope,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

interface PatientRecord {
    id: string;
    name: string;
    dateOfBirth: string;
    lastVisit: string;
    nextAppointment: string;
    diagnosis: string;
    treatment: string;
    status: 'active' | 'completed' | 'follow-up';
    primaryDiagnosis: string;
    medications: string[];
    allergies: string[];
    vitalSigns: {
        bloodPressure: string;
        heartRate: number;
        temperature: number;
        weight: number;
    };
    recentNotes: string[];
}

interface ClinicalHistory {
    id: string;
    date: string;
    type: 'visit' | 'procedure' | 'test' | 'medication';
    description: string;
    provider: string;
    status: 'completed' | 'scheduled' | 'cancelled';
}

export const PatientRecords = () => {
    const [selectedTab, setSelectedTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

    // Mock data
    const patientRecords: PatientRecord[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            dateOfBirth: '1985-03-15',
            lastVisit: '2024-01-15',
            nextAppointment: '2024-02-15',
            diagnosis: 'Obstructive Sleep Apnea',
            treatment: 'CPAP Therapy',
            status: 'active',
            primaryDiagnosis: 'G47.33 - Obstructive Sleep Apnea',
            medications: ['CPAP Device', 'Sleep Study Monitor'],
            allergies: ['Latex'],
            vitalSigns: {
                bloodPressure: '120/80',
                heartRate: 72,
                temperature: 98.6,
                weight: 145
            },
            recentNotes: [
                'Patient reports improved sleep quality with CPAP therapy',
                'AHI reduced from 25 to 3',
                'Compliance rate at 85%'
            ]
        },
        {
            id: '2',
            name: 'Michael Chen',
            dateOfBirth: '1978-11-22',
            lastVisit: '2024-01-14',
            nextAppointment: '2024-01-28',
            diagnosis: 'Sleep Apnea',
            treatment: 'CPAP Therapy',
            status: 'active',
            primaryDiagnosis: 'G47.33 - Obstructive Sleep Apnea',
            medications: ['CPAP Device'],
            allergies: ['None'],
            vitalSigns: {
                bloodPressure: '118/78',
                heartRate: 68,
                temperature: 98.4,
                weight: 165
            },
            recentNotes: [
                'Initial CPAP fitting completed',
                'Patient tolerated well',
                'Mask fitting optimal'
            ]
        },
        {
            id: '3',
            name: 'Lisa Rodriguez',
            dateOfBirth: '1992-07-08',
            lastVisit: '2024-01-13',
            nextAppointment: '2024-01-27',
            diagnosis: 'Sleep Disordered Breathing',
            treatment: 'Oral Appliance',
            status: 'follow-up',
            primaryDiagnosis: 'G47.30 - Sleep Apnea, unspecified',
            medications: ['Oral Appliance'],
            allergies: ['Penicillin'],
            vitalSigns: {
                bloodPressure: '125/82',
                heartRate: 75,
                temperature: 98.8,
                weight: 130
            },
            recentNotes: [
                'Follow-up visit completed',
                'Patient reports mild discomfort with mask',
                'Adjusted settings and provided new cushion'
            ]
        }
    ];

    const clinicalHistory: ClinicalHistory[] = [
        {
            id: '1',
            date: '2024-01-15',
            type: 'visit',
            description: 'Sleep Study Review',
            provider: 'Dr. Smith',
            status: 'completed'
        },
        {
            id: '2',
            date: '2024-01-10',
            type: 'procedure',
            description: 'CPAP Fitting',
            provider: 'Dr. Johnson',
            status: 'completed'
        },
        {
            id: '3',
            date: '2024-01-05',
            type: 'test',
            description: 'Sleep Study',
            provider: 'Dr. Williams',
            status: 'completed'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'follow-up':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getHistoryIcon = (type: string) => {
        switch (type) {
            case 'visit':
                return <User className="w-4 h-4 text-blue-600" />;
            case 'procedure':
                return <Stethoscope className="w-4 h-4 text-green-600" />;
            case 'test':
                return <Activity className="w-4 h-4 text-purple-600" />;
            case 'medication':
                return <Pill className="w-4 h-4 text-red-600" />;
            default:
                return <FileText className="w-4 h-4 text-gray-600" />;
        }
    };

    const filteredPatients = patientRecords.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
                    <p className="text-gray-600">Comprehensive patient management and clinical history</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                    </Button>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Patient
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="follow-up">Follow-up</option>
                </select>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Patient Overview</TabsTrigger>
                    <TabsTrigger value="clinical-history">Clinical History</TabsTrigger>
                    <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
                    <TabsTrigger value="vital-signs">Vital Signs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Patient List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPatients.map((patient) => (
                            <Card key={patient.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{patient.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years old
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(patient.status)}>
                                            {patient.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium">Primary Diagnosis:</span>
                                            <p className="text-sm text-gray-600">{patient.primaryDiagnosis}</p>
                                        </div>

                                        <div>
                                            <span className="text-sm font-medium">Treatment:</span>
                                            <p className="text-sm text-gray-600">{patient.treatment}</p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span>Last Visit:</span>
                                            <span className="text-gray-600">{patient.lastVisit}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span>Next Appointment:</span>
                                            <span className="text-gray-600">{patient.nextAppointment}</span>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="clinical-history" className="space-y-6">
                    {/* Clinical History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Clinical History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {clinicalHistory.map((history) => (
                                    <div key={history.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {getHistoryIcon(history.type)}
                                            <div>
                                                <h4 className="font-medium">{history.description}</h4>
                                                <p className="text-sm text-gray-600">{history.provider} • {history.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={
                                                history.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    history.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                            }>
                                                {history.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="treatment-plans" className="space-y-6">
                    {/* Treatment Plans */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-green-600" />
                                Treatment Plans
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {filteredPatients.map((patient) => (
                                    <Card key={patient.id} className="border">
                                        <CardHeader>
                                            <CardTitle>{patient.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">Current Treatment</h4>
                                                    <p className="text-sm text-gray-600">{patient.treatment}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Medications</h4>
                                                    <div className="space-y-1">
                                                        {patient.medications.map((med, index) => (
                                                            <Badge key={index} variant="outline" className="mr-1">
                                                                {med}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Allergies</h4>
                                                    <div className="space-y-1">
                                                        {patient.allergies.length > 0 ? (
                                                            patient.allergies.map((allergy, index) => (
                                                                <Badge key={index} variant="destructive" className="mr-1">
                                                                    {allergy}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">None</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Recent Notes</h4>
                                                    <div className="space-y-1">
                                                        {patient.recentNotes.slice(0, 2).map((note, index) => (
                                                            <p key={index} className="text-sm text-gray-600">
                                                                • {note}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="vital-signs" className="space-y-6">
                    {/* Vital Signs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-600" />
                                Vital Signs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPatients.map((patient) => (
                                    <Card key={patient.id} className="border">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{patient.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Blood Pressure:</span>
                                                    <span className="text-sm">{patient.vitalSigns.bloodPressure}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Heart Rate:</span>
                                                    <span className="text-sm">{patient.vitalSigns.heartRate} bpm</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Temperature:</span>
                                                    <span className="text-sm">{patient.vitalSigns.temperature}°F</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Weight:</span>
                                                    <span className="text-sm">{patient.vitalSigns.weight} lbs</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 