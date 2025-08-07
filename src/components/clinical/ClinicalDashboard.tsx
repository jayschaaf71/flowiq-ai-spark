import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Mic,
    Users,
    Activity,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    Plus,
    Brain,
    Database,
    Link
} from 'lucide-react';

interface ClinicalMetrics {
    totalSOAPNotes: number;
    pendingReviews: number;
    voiceRecordings: number;
    activePatients: number;
    systemConnections: number;
    aiGeneratedNotes: number;
}

interface RecentActivity {
    id: string;
    type: 'soap_note' | 'voice_recording' | 'patient_record' | 'system_sync';
    title: string;
    description: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'error';
}

export const ClinicalDashboard = () => {
    const navigate = useNavigate();

    // Mock data for demonstration
    const metrics: ClinicalMetrics = {
        totalSOAPNotes: 247,
        pendingReviews: 12,
        voiceRecordings: 89,
        activePatients: 156,
        systemConnections: 3,
        aiGeneratedNotes: 189
    };

    const recentActivity: RecentActivity[] = [
        {
            id: '1',
            type: 'soap_note',
            title: 'SOAP Note Generated',
            description: 'Sarah Johnson - Sleep Study Review',
            timestamp: '2 hours ago',
            status: 'completed'
        },
        {
            id: '2',
            type: 'voice_recording',
            title: 'Voice Recording Completed',
            description: 'Michael Chen - CPAP Fitting',
            timestamp: '3 hours ago',
            status: 'completed'
        },
        {
            id: '3',
            type: 'system_sync',
            title: 'System Sync',
            description: 'Sleep Impressions - 15 records synced',
            timestamp: '4 hours ago',
            status: 'completed'
        },
        {
            id: '4',
            type: 'patient_record',
            title: 'Patient Record Updated',
            description: 'Lisa Rodriguez - Treatment plan modified',
            timestamp: '5 hours ago',
            status: 'pending'
        }
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'soap_note':
                return <FileText className="w-4 h-4 text-blue-600" />;
            case 'voice_recording':
                return <Mic className="w-4 h-4 text-green-600" />;
            case 'patient_record':
                return <Users className="w-4 h-4 text-purple-600" />;
            case 'system_sync':
                return <Database className="w-4 h-4 text-orange-600" />;
            default:
                return <Activity className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleNewSOAPNote = () => {
        navigate('/clinical/soap-notes');
    };

    const handleStartRecording = () => {
        navigate('/clinical/soap-notes?tab=voice-recording');
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'voice-recording':
                navigate('/clinical/soap-notes?tab=voice-recording');
                break;
            case 'create-soap':
                navigate('/clinical/soap-notes');
                break;
            case 'patient-records':
                navigate('/patients');
                break;
            case 'system-sync':
                navigate('/integrations');
                break;
            default:
                break;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clinical Dashboard</h1>
                    <p className="text-gray-600">AI-powered clinical documentation and patient management</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleNewSOAPNote}>
                        <Plus className="w-4 h-4 mr-2" />
                        New SOAP Note
                    </Button>
                    <Button onClick={handleStartRecording}>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total SOAP Notes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalSOAPNotes}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.pendingReviews}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics.pendingReviews > 0 ? 'Requires attention' : 'All caught up'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Voice Recordings</CardTitle>
                        <Mic className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.voiceRecordings}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics.aiGeneratedNotes} AI-generated notes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activePatients}</div>
                        <p className="text-xs text-muted-foreground">
                            +5 new this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Connections</CardTitle>
                        <Link className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.systemConnections}</div>
                        <p className="text-xs text-muted-foreground">
                            All systems connected
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.aiGeneratedNotes}</div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((metrics.aiGeneratedNotes / metrics.totalSOAPNotes) * 100)}% of total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
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
                                        <h4 className="font-medium">{activity.title}</h4>
                                        <p className="text-sm text-gray-600">{activity.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(activity.status)}>
                                        {activity.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">{activity.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('voice-recording')}>
                            <Mic className="w-6 h-6" />
                            <span>Voice Recording</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('create-soap')}>
                            <FileText className="w-6 h-6" />
                            <span>Create SOAP Note</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('patient-records')}>
                            <Users className="w-6 h-6" />
                            <span>Patient Records</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('system-sync')}>
                            <Database className="w-6 h-6" />
                            <span>System Sync</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 