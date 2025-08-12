import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
    Users,
    Search,
    Plus,
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    Clock,
    X,
    UserPlus,
    Edit,
    Trash2
} from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    lastService: string;
    lastVisit: string;
    totalServices: number;
    status: 'active' | 'inactive';
    address?: string;
    notes?: string;
}

export const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '(555) 123-4567',
            lastService: 'HVAC Maintenance',
            lastVisit: '2024-01-15',
            totalServices: 8,
            status: 'active',
            address: '123 Main St, City, State 12345',
            notes: 'Prefers morning appointments'
        },
        {
            id: 2,
            name: 'Mike Wilson',
            email: 'mike.wilson@email.com',
            phone: '(555) 234-5678',
            lastService: 'Plumbing Repair',
            lastVisit: '2024-01-10',
            totalServices: 3,
            status: 'active',
            address: '456 Oak Ave, City, State 12345',
            notes: 'Emergency contact available'
        },
        {
            id: 3,
            name: 'Emma Davis',
            email: 'emma.davis@email.com',
            phone: '(555) 345-6789',
            lastService: 'Electrical Installation',
            lastVisit: '2024-01-12',
            totalServices: 5,
            status: 'active',
            address: '789 Pine Rd, City, State 12345',
            notes: 'Has security system'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    });

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleAddCustomer = () => {
        if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const customer: Customer = {
            id: Date.now(),
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            address: newCustomer.address,
            notes: newCustomer.notes,
            lastService: 'New Customer',
            lastVisit: new Date().toISOString().split('T')[0],
            totalServices: 0,
            status: 'active'
        };

        setCustomers([customer, ...customers]);
        setNewCustomer({ name: '', email: '', phone: '', address: '', notes: '' });
        setIsAddCustomerOpen(false);

        toast({
            title: "Customer Added",
            description: `${customer.name} has been added to your customer database.`,
        });
    };

    const handleContactAction = (action: 'call' | 'email' | 'sms', customer: Customer) => {
        switch (action) {
            case 'call':
                window.open(`tel:${customer.phone}`);
                break;
            case 'email':
                window.open(`mailto:${customer.email}`);
                break;
            case 'sms':
                window.open(`sms:${customer.phone}`);
                break;
        }

        toast({
            title: "Contact Action",
            description: `Initiating ${action} with ${customer.name}`,
        });
    };

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewCustomerOpen(true);
    };

    const handleDeleteCustomer = (customerId: number) => {
        setCustomers(customers.filter(c => c.id !== customerId));
        toast({
            title: "Customer Deleted",
            description: "Customer has been removed from your database.",
        });
    };

    const stats = {
        totalCustomers: customers.length,
        thisMonth: customers.filter(c => {
            const lastVisit = new Date(c.lastVisit);
            const now = new Date();
            return lastVisit.getMonth() === now.getMonth() && lastVisit.getFullYear() === now.getFullYear();
        }).length,
        pending: customers.filter(c => c.status === 'active').length,
        satisfaction: Math.round((customers.filter(c => c.status === 'active').length / customers.length) * 100)
    };

    return (
        <div className="space-y-6">
            {/* Search and Add Customer */}
            <div className="flex items-center justify-between">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search customers..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Customer</DialogTitle>
                            <DialogDescription>
                                Enter the customer's information to add them to your database.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name *</Label>
                                <Input
                                    id="name"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone *</Label>
                                <Input
                                    id="phone"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">Address</Label>
                                <Input
                                    id="address"
                                    value={newCustomer.address}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={newCustomer.notes}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddCustomer}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Customer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                                <p className="text-sm text-gray-600">Total Customers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">{stats.thisMonth}</p>
                                <p className="text-sm text-gray-600">This Month</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-sm text-gray-600">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-8 w-8 text-orange-600" />
                            <div>
                                <p className="text-2xl font-bold">{stats.satisfaction}%</p>
                                <p className="text-sm text-gray-600">Satisfaction</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Customer List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Customers</CardTitle>
                    <CardDescription>
                        {filteredCustomers.length} of {customers.length} customers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Users className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium cursor-pointer hover:text-blue-600"
                                            onClick={() => handleViewCustomer(customer)}>
                                            {customer.name}
                                        </div>
                                        <div className="text-sm text-gray-600">{customer.email}</div>
                                        <div className="text-xs text-gray-500">Last service: {customer.lastService}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(customer.status)}>
                                        {customer.status}
                                    </Badge>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleContactAction('call', customer)}
                                            title="Call customer"
                                        >
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleContactAction('email', customer)}
                                            title="Email customer"
                                        >
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleContactAction('sms', customer)}
                                            title="Send SMS"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewCustomer(customer)}
                                            title="View details"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteCustomer(customer.id)}
                                            title="Delete customer"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Customer Detail Modal */}
            <Dialog open={isViewCustomerOpen} onOpenChange={setIsViewCustomerOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                        <DialogDescription>
                            View and manage customer information
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCustomer && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Name</Label>
                                    <p className="font-medium">{selectedCustomer.name}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="font-medium">{selectedCustomer.email}</p>
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <p className="font-medium">{selectedCustomer.phone}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge className={getStatusColor(selectedCustomer.status)}>
                                        {selectedCustomer.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Total Services</Label>
                                    <p className="font-medium">{selectedCustomer.totalServices}</p>
                                </div>
                                <div>
                                    <Label>Last Visit</Label>
                                    <p className="font-medium">{selectedCustomer.lastVisit}</p>
                                </div>
                            </div>
                            {selectedCustomer.address && (
                                <div>
                                    <Label>Address</Label>
                                    <p className="font-medium">{selectedCustomer.address}</p>
                                </div>
                            )}
                            {selectedCustomer.notes && (
                                <div>
                                    <Label>Notes</Label>
                                    <p className="font-medium">{selectedCustomer.notes}</p>
                                </div>
                            )}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsViewCustomerOpen(false)}>
                                    Close
                                </Button>
                                <Button onClick={() => handleContactAction('call', selectedCustomer)}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Customer
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 