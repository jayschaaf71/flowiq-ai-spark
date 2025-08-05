import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, DollarSign, FileText, Phone, Mail, MessageSquare, Eye, Download } from 'lucide-react';

interface ServiceRecord {
    id: number;
    customer: string;
    service: string;
    date: string;
    duration: string;
    cost: number;
    status: 'completed' | 'pending' | 'cancelled';
    description?: string;
    technician?: string;
    invoiceId?: string;
    paymentStatus?: 'paid' | 'pending' | 'overdue';
    notes?: string;
    followUpRequired?: boolean;
}

export const ServiceHistory: React.FC = () => {
    const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
    const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

    const serviceHistory: ServiceRecord[] = [
        {
            id: 1,
            customer: 'Sarah Johnson',
            service: 'HVAC Maintenance',
            date: '2024-01-15',
            duration: '1 hour',
            cost: 245.00,
            status: 'completed',
            description: 'Regular HVAC system maintenance including filter replacement, duct cleaning, and system inspection. Found minor issues with thermostat calibration.',
            technician: 'John Smith',
            invoiceId: 'INV-2024-001',
            paymentStatus: 'paid',
            notes: 'Customer requested quarterly maintenance schedule. System performing well.',
            followUpRequired: false
        },
        {
            id: 2,
            customer: 'Mike Wilson',
            service: 'Plumbing Repair',
            date: '2024-01-10',
            duration: '2 hours',
            cost: 180.00,
            status: 'completed',
            description: 'Emergency plumbing repair for kitchen sink clog. Replaced damaged pipe section and installed new drain assembly.',
            technician: 'Mike Johnson',
            invoiceId: 'INV-2024-002',
            paymentStatus: 'paid',
            notes: 'Customer was very satisfied with quick response time.',
            followUpRequired: false
        },
        {
            id: 3,
            customer: 'Emma Davis',
            service: 'Electrical Installation',
            date: '2024-01-12',
            duration: '3 hours',
            cost: 450.00,
            status: 'completed',
            description: 'New electrical outlet installation in home office. Added 4 new outlets with USB charging ports and installed dedicated circuit.',
            technician: 'David Wilson',
            invoiceId: 'INV-2024-003',
            paymentStatus: 'pending',
            notes: 'Customer wants to schedule additional outlets in other rooms.',
            followUpRequired: true
        },
        {
            id: 4,
            customer: 'Robert Chen',
            service: 'AC Repair',
            date: '2024-01-08',
            duration: '1.5 hours',
            cost: 320.00,
            status: 'completed',
            description: 'Diagnosed and repaired AC unit not cooling properly. Replaced faulty capacitor and cleaned condenser coils.',
            technician: 'John Smith',
            invoiceId: 'INV-2024-004',
            paymentStatus: 'overdue',
            notes: 'Customer experiencing intermittent issues. May need system replacement soon.',
            followUpRequired: true
        },
        {
            id: 5,
            customer: 'Lisa Thompson',
            service: 'Drain Cleaning',
            date: '2024-01-05',
            duration: '45 minutes',
            cost: 95.00,
            status: 'completed',
            description: 'Cleared clogged bathroom drain using hydro-jetting equipment. Removed hair and soap buildup.',
            technician: 'Mike Johnson',
            invoiceId: 'INV-2024-005',
            paymentStatus: 'paid',
            notes: 'Recommended regular drain maintenance to prevent future clogs.',
            followUpRequired: false
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleViewService = (service: ServiceRecord) => {
        setSelectedService(service);
        setIsServiceDetailOpen(true);
    };

    const handleContactCustomer = (action: 'call' | 'email' | 'sms', customer: string) => {
        // Mock contact actions
        console.log(`${action} ${customer}`);
        // In real app, this would open phone/email/SMS
    };

    const handleDownloadInvoice = (invoiceId: string) => {
        // Mock invoice download
        console.log(`Downloading invoice ${invoiceId}`);
        // In real app, this would generate and download PDF
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Service History</CardTitle>
                    <CardDescription>Track customer service history and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {serviceHistory.map((service) => (
                            <div
                                key={service.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleViewService(service)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{service.customer}</div>
                                        <div className="text-sm text-gray-600">{service.service}</div>
                                        <div className="text-xs text-gray-500">{service.date}</div>
                                        {service.followUpRequired && (
                                            <Badge className="bg-orange-100 text-orange-700 text-xs mt-1">
                                                Follow-up Required
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            {service.duration}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            <DollarSign className="h-4 w-4" />
                                            ${service.cost}
                                        </div>
                                        {service.invoiceId && (
                                            <div className="text-xs text-gray-500">
                                                {service.invoiceId}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge className={getStatusColor(service.status)}>
                                            {service.status}
                                        </Badge>
                                        {service.paymentStatus && (
                                            <Badge className={getPaymentStatusColor(service.paymentStatus)}>
                                                {service.paymentStatus}
                                            </Badge>
                                        )}
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Service Detail Modal */}
            <Dialog open={isServiceDetailOpen} onOpenChange={setIsServiceDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Service Details</DialogTitle>
                        <DialogDescription>
                            Detailed view of service record and invoice
                        </DialogDescription>
                    </DialogHeader>
                    {selectedService && (
                        <div className="space-y-6">
                            {/* Service Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">Customer</h3>
                                    <p className="text-gray-600">{selectedService.customer}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Service</h3>
                                    <p className="text-gray-600">{selectedService.service}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Date</h3>
                                    <p className="text-gray-600">{selectedService.date}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Duration</h3>
                                    <p className="text-gray-600">{selectedService.duration}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Technician</h3>
                                    <p className="text-gray-600">{selectedService.technician || 'Not assigned'}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Cost</h3>
                                    <p className="text-gray-600 font-bold">${selectedService.cost}</p>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex gap-2">
                                <Badge className={getStatusColor(selectedService.status)}>
                                    {selectedService.status}
                                </Badge>
                                {selectedService.paymentStatus && (
                                    <Badge className={getPaymentStatusColor(selectedService.paymentStatus)}>
                                        {selectedService.paymentStatus}
                                    </Badge>
                                )}
                                {selectedService.followUpRequired && (
                                    <Badge className="bg-orange-100 text-orange-700">
                                        Follow-up Required
                                    </Badge>
                                )}
                            </div>

                            {/* Description */}
                            {selectedService.description && (
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Service Description</h3>
                                    <p className="text-gray-600">{selectedService.description}</p>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedService.notes && (
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                                    <p className="text-gray-600">{selectedService.notes}</p>
                                </div>
                            )}

                            {/* Invoice Information */}
                            {selectedService.invoiceId && (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Invoice Information</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Invoice ID: {selectedService.invoiceId}</p>
                                            <p className="text-sm text-gray-600">Amount: ${selectedService.cost}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadInvoice(selectedService.invoiceId!)}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Invoice
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleContactCustomer('call', selectedService.customer)}
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Customer
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleContactCustomer('email', selectedService.customer)}
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email Customer
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleContactCustomer('sms', selectedService.customer)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        SMS Customer
                                    </Button>
                                </div>
                                <Button variant="outline" onClick={() => setIsServiceDetailOpen(false)}>
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