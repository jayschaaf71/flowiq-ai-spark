import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Plus, Mail, MessageSquare, Eye, Download, Phone, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Invoice {
    id: string;
    customer: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    service: string;
    customerEmail?: string;
    customerPhone?: string;
    invoiceDate: string;
    description?: string;
    items?: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
    }>;
}

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

export const InvoiceManager: React.FC = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
    const [newInvoice, setNewInvoice] = useState({
        customer: '',
        service: '',
        description: '',
        dueDate: '',
        customerEmail: '',
        customerPhone: '',
        items: [] as InvoiceItem[]
    });
    const [newItem, setNewItem] = useState({
        description: '',
        quantity: 1,
        unitPrice: 0
    });

    const customers = [
        { name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567' },
        { name: 'Mike Wilson', email: 'mike.wilson@email.com', phone: '(555) 234-5678' },
        { name: 'Emma Davis', email: 'emma.davis@email.com', phone: '(555) 345-6789' },
        { name: 'Robert Chen', email: 'robert.chen@email.com', phone: '(555) 456-7890' },
        { name: 'Lisa Thompson', email: 'lisa.thompson@email.com', phone: '(555) 567-8901' }
    ];

    const services = [
        'HVAC Maintenance',
        'Plumbing Repair',
        'Electrical Installation',
        'AC Repair',
        'Drain Cleaning',
        'Emergency Service',
        'Inspection',
        'Installation'
    ];

    const invoices: Invoice[] = [
        {
            id: 'INV-001',
            customer: 'Sarah Johnson',
            amount: 245.00,
            status: 'paid',
            dueDate: '2024-01-15',
            service: 'HVAC Maintenance',
            customerEmail: 'sarah.johnson@email.com',
            customerPhone: '(555) 123-4567',
            invoiceDate: '2024-01-10',
            description: 'Regular HVAC system maintenance including filter replacement and system inspection',
            items: [
                { description: 'HVAC Maintenance Service', quantity: 1, unitPrice: 200.00 },
                { description: 'Filter Replacement', quantity: 1, unitPrice: 25.00 },
                { description: 'System Inspection', quantity: 1, unitPrice: 20.00 }
            ]
        },
        {
            id: 'INV-002',
            customer: 'Mike Wilson',
            amount: 180.00,
            status: 'pending',
            dueDate: '2024-01-20',
            service: 'Plumbing Repair',
            customerEmail: 'mike.wilson@email.com',
            customerPhone: '(555) 234-5678',
            invoiceDate: '2024-01-12',
            description: 'Emergency plumbing repair for kitchen sink clog',
            items: [
                { description: 'Emergency Plumbing Service', quantity: 1, unitPrice: 150.00 },
                { description: 'Parts and Materials', quantity: 1, unitPrice: 30.00 }
            ]
        },
        {
            id: 'INV-003',
            customer: 'Emma Davis',
            amount: 450.00,
            status: 'paid',
            dueDate: '2024-01-10',
            service: 'Electrical Installation',
            customerEmail: 'emma.davis@email.com',
            customerPhone: '(555) 345-6789',
            invoiceDate: '2024-01-05',
            description: 'New electrical outlet installation in home office',
            items: [
                { description: 'Electrical Installation', quantity: 1, unitPrice: 300.00 },
                { description: 'USB Outlets (4 units)', quantity: 4, unitPrice: 25.00 },
                { description: 'Dedicated Circuit Installation', quantity: 1, unitPrice: 150.00 }
            ]
        },
        {
            id: 'INV-004',
            customer: 'Robert Chen',
            amount: 320.00,
            status: 'overdue',
            dueDate: '2024-01-08',
            service: 'AC Repair',
            customerEmail: 'robert.chen@email.com',
            customerPhone: '(555) 456-7890',
            invoiceDate: '2024-01-01',
            description: 'AC unit repair and capacitor replacement',
            items: [
                { description: 'AC Repair Service', quantity: 1, unitPrice: 200.00 },
                { description: 'Capacitor Replacement', quantity: 1, unitPrice: 80.00 },
                { description: 'Condenser Coil Cleaning', quantity: 1, unitPrice: 40.00 }
            ]
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailOpen(true);
    };

    const handleEmailInvoice = (invoice: Invoice) => {
        if (invoice.customerEmail) {
            const subject = encodeURIComponent(`Invoice ${invoice.id} - ${invoice.service}`);
            const body = encodeURIComponent(`Dear ${invoice.customer},\n\nPlease find attached invoice ${invoice.id} for ${invoice.service}.\n\nAmount: $${invoice.amount}\nDue Date: ${invoice.dueDate}\n\nThank you for your business.\n\nBest regards,\nYour Service Team`);
            window.open(`mailto:${invoice.customerEmail}?subject=${subject}&body=${body}`);
        }
    };

    const handleTextInvoice = (invoice: Invoice) => {
        if (invoice.customerPhone) {
            const message = encodeURIComponent(`Hi ${invoice.customer}, your invoice ${invoice.id} for ${invoice.service} is ready. Amount: $${invoice.amount}, Due: ${invoice.dueDate}. View at: https://pay.flowiq.ai/${invoice.id}`);
            window.open(`sms:${invoice.customerPhone}?body=${message}`);
        }
    };

    const handleCallCustomer = (invoice: Invoice) => {
        if (invoice.customerPhone) {
            window.open(`tel:${invoice.customerPhone}`);
        }
    };

    const handleDownloadInvoice = (invoice: Invoice) => {
        console.log(`Downloading invoice ${invoice.id}`);
        // Mock download functionality
    };

    const handleCreateInvoice = () => {
        if (!newInvoice.customer || !newInvoice.service || !newInvoice.dueDate || newInvoice.items.length === 0) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields and add at least one item.",
                variant: "destructive"
            });
            return;
        }

        const totalAmount = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

        const invoice: Invoice = {
            id: `INV-${Date.now()}`,
            customer: newInvoice.customer,
            amount: totalAmount,
            status: 'pending',
            dueDate: newInvoice.dueDate,
            service: newInvoice.service,
            customerEmail: newInvoice.customerEmail,
            customerPhone: newInvoice.customerPhone,
            invoiceDate: new Date().toISOString().split('T')[0],
            description: newInvoice.description,
            items: [...newInvoice.items]
        };

        // In a real app, this would save to the database
        console.log('Creating invoice:', invoice);

        toast({
            title: "Invoice Created",
            description: `Invoice ${invoice.id} has been created for ${invoice.customer}.`,
        });

        // Reset form
        setNewInvoice({
            customer: '',
            service: '',
            description: '',
            dueDate: '',
            customerEmail: '',
            customerPhone: '',
            items: []
        });
        setIsCreateInvoiceOpen(false);
    };

    const handleAddItem = () => {
        if (!newItem.description || newItem.unitPrice <= 0) {
            toast({
                title: "Missing Information",
                description: "Please fill in item description and price.",
                variant: "destructive"
            });
            return;
        }

        setNewInvoice({
            ...newInvoice,
            items: [...newInvoice.items, { ...newItem }]
        });
        setNewItem({ description: '', quantity: 1, unitPrice: 0 });
    };

    const handleRemoveItem = (index: number) => {
        setNewInvoice({
            ...newInvoice,
            items: newInvoice.items.filter((_, i) => i !== index)
        });
    };

    const handleCustomerSelect = (customerName: string) => {
        const customer = customers.find(c => c.name === customerName);
        if (customer) {
            setNewInvoice({
                ...newInvoice,
                customer: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Create Invoice */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Invoice Management</h2>
                    <p className="text-gray-600">Create and manage customer invoices</p>
                </div>
                <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Invoice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Invoice</DialogTitle>
                            <DialogDescription>
                                Create a new invoice for a customer
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            {/* Customer and Service Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customer">Customer *</Label>
                                    <Select onValueChange={handleCustomerSelect}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.name} value={customer.name}>
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="service">Service *</Label>
                                    <Select onValueChange={(value) => setNewInvoice({ ...newInvoice, service: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {services.map((service) => (
                                                <SelectItem key={service} value={service}>
                                                    {service}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date *</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={newInvoice.dueDate}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newInvoice.description}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                                        placeholder="Service description..."
                                    />
                                </div>
                            </div>

                            {/* Invoice Items */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Invoice Items</Label>
                                    <Button variant="outline" size="sm" onClick={handleAddItem}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Item
                                    </Button>
                                </div>

                                {/* Add Item Form */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                                    <div className="space-y-2">
                                        <Label htmlFor="itemDescription">Description</Label>
                                        <Input
                                            id="itemDescription"
                                            value={newItem.description}
                                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                            placeholder="Item description"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="itemQuantity">Quantity</Label>
                                        <Input
                                            id="itemQuantity"
                                            type="number"
                                            min="1"
                                            value={newItem.quantity}
                                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="itemPrice">Unit Price ($)</Label>
                                        <Input
                                            id="itemPrice"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newItem.unitPrice}
                                            onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                {/* Items List */}
                                {newInvoice.items.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Items</Label>
                                        {newInvoice.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.description}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {item.quantity} × ${item.unitPrice} = ${(item.quantity * item.unitPrice).toFixed(2)}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="text-right font-bold">
                                            Total: ${newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateInvoice}>
                                    <Receipt className="h-4 w-4 mr-2" />
                                    Create Invoice
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Invoice List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Track billing and payments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {invoices.map((invoice) => (
                            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Receipt className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{invoice.customer}</div>
                                        <div className="text-sm text-gray-600">{invoice.service}</div>
                                        <div className="text-xs text-gray-500">Due: {invoice.dueDate}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="font-bold">${invoice.amount}</div>
                                    </div>
                                    <Badge className={getStatusColor(invoice.status)}>
                                        {invoice.status}
                                    </Badge>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewInvoice(invoice)}
                                            title="View invoice details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {invoice.customerEmail && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEmailInvoice(invoice)}
                                                title="Email invoice to customer"
                                            >
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {invoice.customerPhone && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleTextInvoice(invoice)}
                                                title="Send invoice via SMS"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {invoice.customerPhone && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCallCustomer(invoice)}
                                                title="Call customer"
                                            >
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Invoice Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Invoice Details</DialogTitle>
                        <DialogDescription>
                            Detailed view of invoice and payment information
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInvoice && (
                        <div className="space-y-6">
                            {/* Invoice Header */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Invoice ID</Label>
                                    <p className="font-medium">{selectedInvoice.id}</p>
                                </div>
                                <div>
                                    <Label>Customer</Label>
                                    <p className="font-medium">{selectedInvoice.customer}</p>
                                </div>
                                <div>
                                    <Label>Service</Label>
                                    <p className="text-sm text-gray-600">{selectedInvoice.service}</p>
                                </div>
                                <div>
                                    <Label>Amount</Label>
                                    <p className="font-bold text-lg">${selectedInvoice.amount}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge className={getStatusColor(selectedInvoice.status)}>
                                        {selectedInvoice.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Due Date</Label>
                                    <p className="text-sm text-gray-600">{selectedInvoice.dueDate}</p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            {(selectedInvoice.customerEmail || selectedInvoice.customerPhone) && (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedInvoice.customerEmail && (
                                            <div>
                                                <Label>Email</Label>
                                                <p className="text-sm text-gray-600">{selectedInvoice.customerEmail}</p>
                                            </div>
                                        )}
                                        {selectedInvoice.customerPhone && (
                                            <div>
                                                <Label>Phone</Label>
                                                <p className="text-sm text-gray-600">{selectedInvoice.customerPhone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {selectedInvoice.description && (
                                <div>
                                    <Label>Description</Label>
                                    <p className="text-sm text-gray-600 mt-1">{selectedInvoice.description}</p>
                                </div>
                            )}

                            {/* Invoice Items */}
                            {selectedInvoice.items && (
                                <div>
                                    <Label>Invoice Items</Label>
                                    <div className="mt-2 space-y-2">
                                        {selectedInvoice.items.map((item, index) => (
                                            <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                                                <div>
                                                    <p className="text-sm font-medium">{item.description}</p>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity} × ${item.unitPrice}</p>
                                                </div>
                                                <p className="text-sm font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadInvoice(selectedInvoice)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                    </Button>
                                    {selectedInvoice.customerEmail && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEmailInvoice(selectedInvoice)}
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            Email Invoice
                                        </Button>
                                    )}
                                    {selectedInvoice.customerPhone && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleTextInvoice(selectedInvoice)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            SMS Invoice
                                        </Button>
                                    )}
                                </div>
                                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 