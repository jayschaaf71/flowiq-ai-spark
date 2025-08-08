import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Users,
    Search,
    Plus,
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    Clock,
    X
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    lastService: string;
    lastVisit: string;
    totalServices: number;
    status: 'active' | 'inactive';
}

export const CustomerDatabase: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '(555) 123-4567',
            lastService: 'HVAC Maintenance',
            lastVisit: '2024-01-15',
            totalServices: 8,
            status: 'active'
        },
        {
            id: 2,
            name: 'Mike Wilson',
            email: 'mike.wilson@email.com',
            phone: '(555) 234-5678',
            lastService: 'Plumbing Repair',
            lastVisit: '2024-01-10',
            totalServices: 3,
            status: 'active'
        },
        {
            id: 3,
            name: 'Emma Davis',
            email: 'emma.davis@email.com',
            phone: '(555) 345-6789',
            lastService: 'Electrical Installation',
            lastVisit: '2024-01-12',
            totalServices: 5,
            status: 'active'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        lastService: '',
        lastVisit: '',
        totalServices: 0,
        status: 'active' as const
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
                description: "Please fill in all required fields (name, email, phone).",
                variant: "destructive"
            });
            return;
        }

        const customer: Customer = {
            id: customers.length + 1,
            ...newCustomer
        };

        setCustomers([...customers, customer]);
        setNewCustomer({
            name: '',
            email: '',
            phone: '',
            lastService: '',
            lastVisit: '',
            totalServices: 0,
            status: 'active'
        });
        setIsAddCustomerOpen(false);

        toast({
            title: "Customer Added",
            description: `${customer.name} has been added to the database.`,
        });
    };

    const handleContactAction = (action: 'call' | 'email' | 'text', customer: Customer) => {
        let message = '';
        let description = '';

        switch (action) {
            case 'call':
                message = `Calling ${customer.name}`;
                description = `Initiating call to ${customer.phone}`;
                break;
            case 'email':
                message = `Emailing ${customer.name}`;
                description = `Opening email client for ${customer.email}`;
                break;
            case 'text':
                message = `Texting ${customer.name}`;
                description = `Opening SMS for ${customer.phone}`;
                break;
        }

        toast({
            title: message,
            description: description,
        });
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
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Customer</DialogTitle>
                            <DialogDescription>Enter customer information to add them to your database.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                        placeholder="Full name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="lastService">Last Service</Label>
                                    <Input
                                        id="lastService"
                                        value={newCustomer.lastService}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, lastService: e.target.value })}
                                        placeholder="Service type"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="totalServices">Total Services</Label>
                                    <Input
                                        id="totalServices"
                                        type="number"
                                        value={newCustomer.totalServices}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, totalServices: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddCustomer}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Customer
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Customer List */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Database</CardTitle>
                    <CardDescription>Manage your customer information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredCustomers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? 'No customers found matching your search.' : 'No customers in database.'}
                            </div>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Users className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{customer.name}</div>
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
                                                title={`Call ${customer.name}`}
                                            >
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleContactAction('email', customer)}
                                                title={`Email ${customer.name}`}
                                            >
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleContactAction('text', customer)}
                                                title={`Text ${customer.name}`}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 