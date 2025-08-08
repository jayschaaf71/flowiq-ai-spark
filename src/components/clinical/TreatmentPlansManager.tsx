import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    User,
    Target,
    Activity,
    Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TreatmentPlan {
    id: string;
    patientName: string;
    patientId: string;
    planName: string;
    status: 'active' | 'completed' | 'paused' | 'draft';
    startDate: string;
    endDate: string;
    phases: TreatmentPhase[];
    progress: number;
    notes: string;
    createdBy: string;
    lastUpdated: string;
}

interface TreatmentPhase {
    id: string;
    name: string;
    description: string;
    duration: number; // weeks
    status: 'pending' | 'active' | 'completed';
    tasks: TreatmentTask[];
}

interface TreatmentTask {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
    assignedTo: string;
}

export const TreatmentPlansManager: React.FC = () => {
    const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const { toast } = useToast();

    useEffect(() => {
        loadTreatmentPlans();
    }, []);

    const loadTreatmentPlans = async () => {
        setLoading(true);
        try {
            // Mock data - in production would fetch from Supabase
            const mockPlans: TreatmentPlan[] = [
                {
                    id: '1',
                    patientName: 'John Smith',
                    patientId: 'P001',
                    planName: 'Sleep Apnea Treatment Plan',
                    status: 'active',
                    startDate: '2024-01-15',
                    endDate: '2024-04-15',
                    progress: 65,
                    notes: 'CPAP therapy with follow-up monitoring',
                    createdBy: 'Dr. Johnson',
                    lastUpdated: '2024-02-15T10:30:00Z',
                    phases: [
                        {
                            id: '1-1',
                            name: 'Initial Assessment',
                            description: 'Complete sleep study and diagnosis',
                            duration: 2,
                            status: 'completed',
                            tasks: [
                                {
                                    id: '1-1-1',
                                    name: 'Sleep Study',
                                    description: 'Conduct overnight sleep study',
                                    status: 'completed',
                                    dueDate: '2024-01-20',
                                    assignedTo: 'Sleep Lab'
                                }
                            ]
                        },
                        {
                            id: '1-2',
                            name: 'CPAP Titration',
                            description: 'CPAP pressure titration and fitting',
                            duration: 4,
                            status: 'active',
                            tasks: [
                                {
                                    id: '1-2-1',
                                    name: 'CPAP Fitting',
                                    description: 'Fit patient with CPAP device',
                                    status: 'completed',
                                    dueDate: '2024-02-01',
                                    assignedTo: 'Respiratory Therapist'
                                },
                                {
                                    id: '1-2-2',
                                    name: 'Follow-up Visit',
                                    description: '30-day follow-up appointment',
                                    status: 'in-progress',
                                    dueDate: '2024-02-28',
                                    assignedTo: 'Dr. Johnson'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: '2',
                    patientName: 'Sarah Wilson',
                    patientId: 'P002',
                    planName: 'TMJ Treatment Protocol',
                    status: 'active',
                    startDate: '2024-02-01',
                    endDate: '2024-05-01',
                    progress: 40,
                    notes: 'Conservative TMJ treatment with splint therapy',
                    createdBy: 'Dr. Martinez',
                    lastUpdated: '2024-02-15T14:20:00Z',
                    phases: [
                        {
                            id: '2-1',
                            name: 'Diagnostic Phase',
                            description: 'Complete TMJ assessment and imaging',
                            duration: 1,
                            status: 'completed',
                            tasks: [
                                {
                                    id: '2-1-1',
                                    name: 'TMJ Assessment',
                                    description: 'Complete TMJ examination',
                                    status: 'completed',
                                    dueDate: '2024-02-05',
                                    assignedTo: 'Dr. Martinez'
                                }
                            ]
                        },
                        {
                            id: '2-2',
                            name: 'Splint Therapy',
                            description: 'Custom splint fabrication and fitting',
                            duration: 6,
                            status: 'active',
                            tasks: [
                                {
                                    id: '2-2-1',
                                    name: 'Splint Fabrication',
                                    description: 'Create custom TMJ splint',
                                    status: 'completed',
                                    dueDate: '2024-02-10',
                                    assignedTo: 'Dental Lab'
                                },
                                {
                                    id: '2-2-2',
                                    name: 'Splint Fitting',
                                    description: 'Fit and adjust splint',
                                    status: 'in-progress',
                                    dueDate: '2024-02-25',
                                    assignedTo: 'Dr. Martinez'
                                }
                            ]
                        }
                    ]
                }
            ];
            setTreatmentPlans(mockPlans);
        } catch (error) {
            console.error('Error loading treatment plans:', error);
            toast({
                title: "Error",
                description: "Failed to load treatment plans",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'paused': return 'bg-yellow-100 text-yellow-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
            case 'paused': return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'draft': return <FileText className="h-4 w-4 text-gray-400" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    const filteredPlans = treatmentPlans.filter(plan => {
        const matchesSearch = plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.planName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const createTreatmentPlan = async (planData: Partial<TreatmentPlan>) => {
        try {
            // Mock creation - in production would save to Supabase
            const newPlan: TreatmentPlan = {
                id: Date.now().toString(),
                patientName: planData.patientName || '',
                patientId: planData.patientId || '',
                planName: planData.planName || '',
                status: 'draft',
                startDate: planData.startDate || '',
                endDate: planData.endDate || '',
                progress: 0,
                notes: planData.notes || '',
                createdBy: 'Current User',
                lastUpdated: new Date().toISOString(),
                phases: []
            };

            setTreatmentPlans([...treatmentPlans, newPlan]);
            setShowCreateDialog(false);
            toast({
                title: "Success",
                description: "Treatment plan created successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create treatment plan",
                variant: "destructive"
            });
        }
    };

    const updateTreatmentPlan = async (planId: string, updates: Partial<TreatmentPlan>) => {
        try {
            setTreatmentPlans(plans =>
                plans.map(plan =>
                    plan.id === planId
                        ? { ...plan, ...updates, lastUpdated: new Date().toISOString() }
                        : plan
                )
            );
            setShowEditDialog(false);
            toast({
                title: "Success",
                description: "Treatment plan updated successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update treatment plan",
                variant: "destructive"
            });
        }
    };

    const deleteTreatmentPlan = async (planId: string) => {
        try {
            setTreatmentPlans(plans => plans.filter(plan => plan.id !== planId));
            toast({
                title: "Success",
                description: "Treatment plan deleted successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete treatment plan",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Treatment Plans</h2>
                    <p className="text-gray-600">Manage patient treatment plans and protocols</p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Input
                        placeholder="Search treatment plans..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Treatment Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{plan.planName}</CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">{plan.patientName}</p>
                                </div>
                                <Badge className={getStatusColor(plan.status)}>
                                    {plan.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Progress */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span>Progress</span>
                                        <span>{plan.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${plan.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span>Created by {plan.createdBy}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-gray-400" />
                                        <span>{plan.phases.length} phases</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            setShowEditDialog(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        <Target className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteTreatmentPlan(plan.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Treatment Plan Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Treatment Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="patientName">Patient Name</Label>
                                <Input id="patientName" placeholder="Enter patient name" />
                            </div>
                            <div>
                                <Label htmlFor="patientId">Patient ID</Label>
                                <Input id="patientId" placeholder="Enter patient ID" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="planName">Plan Name</Label>
                            <Input id="planName" placeholder="Enter treatment plan name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="date" />
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="date" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" placeholder="Enter treatment plan notes" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => createTreatmentPlan({})}>
                                Create Plan
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Treatment Plan Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Treatment Plan</DialogTitle>
                    </DialogHeader>
                    {selectedPlan && (
                        <Tabs defaultValue="details" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="phases">Phases</TabsTrigger>
                                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="editPatientName">Patient Name</Label>
                                            <Input id="editPatientName" defaultValue={selectedPlan.patientName} />
                                        </div>
                                        <div>
                                            <Label htmlFor="editPlanName">Plan Name</Label>
                                            <Input id="editPlanName" defaultValue={selectedPlan.planName} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="editStartDate">Start Date</Label>
                                            <Input id="editStartDate" type="date" defaultValue={selectedPlan.startDate} />
                                        </div>
                                        <div>
                                            <Label htmlFor="editEndDate">End Date</Label>
                                            <Input id="editEndDate" type="date" defaultValue={selectedPlan.endDate} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="editNotes">Notes</Label>
                                        <Textarea id="editNotes" defaultValue={selectedPlan.notes} />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="phases">
                                <div className="space-y-4">
                                    {selectedPlan.phases.map((phase) => (
                                        <Card key={phase.id}>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                                                    <Badge className={getStatusColor(phase.status)}>
                                                        {phase.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-600 mb-2">{phase.description}</p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span>Duration: {phase.duration} weeks</span>
                                                    <span>Tasks: {phase.tasks.length}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="tasks">
                                <div className="space-y-4">
                                    {selectedPlan.phases.map((phase) => (
                                        <div key={phase.id}>
                                            <h4 className="font-medium mb-2">{phase.name}</h4>
                                            <div className="space-y-2">
                                                {phase.tasks.map((task) => (
                                                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                        <div>
                                                            <div className="font-medium">{task.name}</div>
                                                            <div className="text-sm text-gray-600">{task.description}</div>
                                                            <div className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                                                        </div>
                                                        <Badge className={getStatusColor(task.status)}>
                                                            {task.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => updateTreatmentPlan(selectedPlan?.id || '', {})}>
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 