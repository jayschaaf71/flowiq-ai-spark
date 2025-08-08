import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Users,
    Search,
    Filter,
    Plus,
    Phone,
    Mail,
    Calendar,
    FileText,
    MessageSquare,
    User,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Download,
    X,
    Send
} from 'lucide-react';

interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    lastVisit: string;
    nextAppointment?: string;
    status: 'active' | 'inactive' | 'new' | 'follow-up';
    insurance: string;
    balance: number;
    notes: string;
}

export default function Patients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [newPatient, setNewPatient] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        insurance: '',
        notes: ''
    });
    const [showViewPatient, setShowViewPatient] = useState(false);
    const [showMessagePatient, setShowMessagePatient] = useState(false);
    const [selectedPatientForAction, setSelectedPatientForAction] = useState<Patient | null>(null);
    const [messageText, setMessageText] = useState('');
    const [showDropdownMenu, setShowDropdownMenu] = useState<string | null>(null);
    const { toast } = useToast();

    // Mock patient data
    const [patients, setPatients] = useState<Patient[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '(555) 123-4567',
            dateOfBirth: '1985-03-15',
            lastVisit: '2024-01-15',
            nextAppointment: '2024-02-15',
            status: 'active',
            insurance: 'Blue Cross Blue Shield',
            balance: 0,
            notes: 'CPAP therapy compliance at 85%. Sleep study completed.'
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            phone: '(555) 234-5678',
            dateOfBirth: '1978-11-22',
            lastVisit: '2024-01-14',
            nextAppointment: '2024-02-10',
            status: 'follow-up',
            insurance: 'Aetna',
            balance: 250,
            notes: 'Follow-up for CPAP fitting. Insurance verification needed.'
        },
        {
            id: '3',
            name: 'Lisa Rodriguez',
            email: 'lisa.rodriguez@email.com',
            phone: '(555) 345-6789',
            dateOfBirth: '1992-07-08',
            lastVisit: '2024-01-13',
            status: 'active',
            insurance: 'United Healthcare',
            balance: 0,
            notes: 'Initial consultation completed. Sleep study scheduled.'
        },
        {
            id: '4',
            name: 'David Thompson',
            email: 'david.thompson@email.com',
            phone: '(555) 456-7890',
            dateOfBirth: '1965-12-03',
            lastVisit: '2024-01-12',
            nextAppointment: '2024-02-20',
            status: 'active',
            insurance: 'Cigna',
            balance: 1800,
            notes: 'CPAP therapy initiated. Compliance monitoring needed.'
        },
        {
            id: '5',
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '(555) 567-8901',
            dateOfBirth: '1989-05-18',
            lastVisit: '2024-01-11',
            status: 'new',
            insurance: 'Blue Cross Blue Shield',
            balance: 0,
            notes: 'New patient. Initial consultation completed.'
        }
    ]);

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'follow-up': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBalanceColor = (balance: number) => {
        return balance > 0 ? 'text-red-600' : 'text-green-600';
    };

    const handleViewPatient = (patient: Patient) => {
        setSelectedPatientForAction(patient);
        setShowViewPatient(true);
    };

    const handleMessagePatient = (patient: Patient) => {
        setSelectedPatientForAction(patient);
        setShowMessagePatient(true);
    };

    const handleSendMessage = () => {
        if (selectedPatientForAction && messageText.trim()) {
            // In a real implementation, this would:
            // 1. Send via email if patient has email
            // 2. Send via SMS if patient has phone
            // 3. Send via in-app chat if patient has app access
            // 4. Log to patient communication history

            const messageType = selectedPatientForAction.email ? 'Email' : 'SMS';

            toast({
                title: "Message Sent",
                description: `Message sent to ${selectedPatientForAction.name} via ${messageType}`,
            });
            setMessageText('');
            setShowMessagePatient(false);
            setSelectedPatientForAction(null);
        }
    };

    const handleAddPatient = () => {
        if (newPatient.name && newPatient.email) {
            // Create new patient object
            const newPatientObj: Patient = {
                id: (patients.length + 1).toString(),
                name: newPatient.name,
                email: newPatient.email,
                phone: newPatient.phone,
                dateOfBirth: newPatient.dateOfBirth,
                lastVisit: new Date().toISOString().split('T')[0],
                status: 'new',
                insurance: newPatient.insurance,
                balance: 0,
                notes: newPatient.notes
            };

            // Add to patients array
            const updatedPatients = [...patients, newPatientObj];
            setPatients(updatedPatients);



            toast({
                title: "Patient Added",
                description: `Patient ${newPatient.name} has been added successfully.`,
            });
            setNewPatient({
                name: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                insurance: '',
                notes: ''
            });
            setShowAddPatient(false);
        }
    };

    const handleEditPatient = (patient: Patient) => {
        setSelectedPatientForAction(patient);
        setShowDropdownMenu(null);
        toast({
            title: "Edit Patient",
            description: `Edit functionality for ${patient.name} will be implemented.`,
        });
    };

    const handleDeletePatient = (patient: Patient) => {
        setPatients(patients.filter(p => p.id !== patient.id));
        setShowDropdownMenu(null);
        toast({
            title: "Patient Deleted",
            description: `${patient.name} has been removed.`,
        });
    };

    const handleToggleDropdown = (patientId: string) => {
        setShowDropdownMenu(showDropdownMenu === patientId ? null : patientId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-600">Manage patient records and information</p>
                </div>
                <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setShowAddPatient(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search patients by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="new">New</option>
                        <option value="follow-up">Follow-up</option>
                    </select>
                    <Button
                        variant="outline"
                        onClick={() => {
                            // Toggle advanced filter options
                            const filterOptions = [
                                'Insurance Type',
                                'Balance Range',
                                'Last Visit Date',
                                'Appointment Status',
                                'Provider'
                            ];
                            toast({
                                title: "Advanced Filters",
                                description: `Available filters: ${filterOptions.join(', ')}. Click to apply.`,
                            });
                        }}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Patient Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                <p className="text-2xl font-bold">{patients.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                                <p className="text-2xl font-bold">{patients.filter(p => p.status === 'active').length}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Follow-ups</p>
                                <p className="text-2xl font-bold">{patients.filter(p => p.status === 'follow-up').length}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New Patients</p>
                                <p className="text-2xl font-bold">{patients.filter(p => p.status === 'new').length}</p>
                            </div>
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Patient List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                                    <p className="text-sm text-gray-600">{patient.email}</p>
                                </div>
                                <Badge className={getStatusColor(patient.status)}>
                                    {patient.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Last visit: {patient.lastVisit}</span>
                            </div>
                            {patient.nextAppointment && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    <span>Next: {patient.nextAppointment}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>{patient.insurance}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className={`font-medium ${getBalanceColor(patient.balance)}`}>
                                    Balance: ${patient.balance}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleViewPatient(patient)}
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleMessagePatient(patient)}
                                >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Message
                                </Button>
                                <div className="relative">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleToggleDropdown(patient.id)}
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                    {showDropdownMenu === patient.id && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                            <button
                                                onClick={() => handleEditPatient(patient)}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeletePatient(patient)}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Add Patient Modal */}
            <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Patient</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newPatient.name}
                                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={newPatient.email}
                                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                value={newPatient.phone}
                                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="insurance" className="text-right">
                                Insurance
                            </Label>
                            <Input
                                id="insurance"
                                value={newPatient.insurance}
                                onChange={(e) => setNewPatient({ ...newPatient, insurance: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={newPatient.notes}
                                onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddPatient}>
                            Add Patient
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Patient Modal */}
            <Dialog open={showViewPatient} onOpenChange={setShowViewPatient}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Patient Details</DialogTitle>
                    </DialogHeader>
                    {selectedPatientForAction && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Name</Label>
                                    <p className="text-sm text-gray-600">{selectedPatientForAction.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm text-gray-600">{selectedPatientForAction.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Phone</Label>
                                    <p className="text-sm text-gray-600">{selectedPatientForAction.phone}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Insurance</Label>
                                    <p className="text-sm text-gray-600">{selectedPatientForAction.insurance}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Last Visit</Label>
                                    <p className="text-sm text-gray-600">{selectedPatientForAction.lastVisit}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Balance</Label>
                                    <p className={`text-sm font-medium ${getBalanceColor(selectedPatientForAction.balance)}`}>
                                        ${selectedPatientForAction.balance}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Notes</Label>
                                <p className="text-sm text-gray-600">{selectedPatientForAction.notes}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowViewPatient(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Message Patient Modal */}
            <Dialog open={showMessagePatient} onOpenChange={setShowMessagePatient}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Send Message</DialogTitle>
                    </DialogHeader>
                    {selectedPatientForAction && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">To: {selectedPatientForAction.name}</Label>
                                <p className="text-sm text-gray-600">{selectedPatientForAction.email}</p>
                            </div>
                            <div>
                                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your message here..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    className="mt-1"
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMessagePatient(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendMessage}>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 