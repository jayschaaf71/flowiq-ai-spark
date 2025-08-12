import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Wrench, Settings, DollarSign, Clock } from 'lucide-react';

interface ServiceType {
    id: number;
    name: string;
    category: string;
    description: string;
    duration: number;
    price: number;
    isActive: boolean;
}

export const ServiceTypeConfig: React.FC = () => {
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([
        {
            id: 1,
            name: 'HVAC Maintenance',
            category: 'Maintenance',
            description: 'Regular HVAC system maintenance and inspection',
            duration: 60,
            price: 245.00,
            isActive: true
        },
        {
            id: 2,
            name: 'Plumbing Repair',
            category: 'Repair',
            description: 'Emergency plumbing repairs and installations',
            duration: 120,
            price: 180.00,
            isActive: true
        },
        {
            id: 3,
            name: 'Electrical Installation',
            category: 'Installation',
            description: 'New electrical installations and upgrades',
            duration: 180,
            price: 450.00,
            isActive: true
        }
    ]);

    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
    const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
    const [newService, setNewService] = useState({
        name: '',
        category: '',
        description: '',
        duration: 60,
        price: 0
    });

    const businessTypes = {
        'hvac': {
            name: 'HVAC Services',
            services: [
                { name: 'AC Maintenance', category: 'Maintenance', description: 'Regular AC system maintenance', duration: 60, price: 120 },
                { name: 'Heating Repair', category: 'Repair', description: 'Heating system repairs', duration: 90, price: 200 },
                { name: 'Duct Cleaning', category: 'Cleaning', description: 'Air duct cleaning service', duration: 120, price: 150 },
                { name: 'Thermostat Installation', category: 'Installation', description: 'Smart thermostat installation', duration: 45, price: 180 },
                { name: 'Emergency AC Repair', category: 'Emergency', description: '24/7 emergency AC repairs', duration: 120, price: 300 }
            ]
        },
        'plumbing': {
            name: 'Plumbing Services',
            services: [
                { name: 'Leak Repair', category: 'Repair', description: 'Fix water leaks and drips', duration: 60, price: 150 },
                { name: 'Drain Cleaning', category: 'Cleaning', description: 'Clogged drain cleaning', duration: 45, price: 100 },
                { name: 'Water Heater Installation', category: 'Installation', description: 'New water heater installation', duration: 180, price: 800 },
                { name: 'Pipe Replacement', category: 'Repair', description: 'Damaged pipe replacement', duration: 120, price: 250 },
                { name: 'Emergency Plumbing', category: 'Emergency', description: '24/7 emergency plumbing', duration: 90, price: 200 }
            ]
        },
        'electrical': {
            name: 'Electrical Services',
            services: [
                { name: 'Outlet Installation', category: 'Installation', description: 'New electrical outlet installation', duration: 60, price: 120 },
                { name: 'Circuit Repair', category: 'Repair', description: 'Electrical circuit repairs', duration: 90, price: 180 },
                { name: 'Lighting Installation', category: 'Installation', description: 'New lighting fixtures', duration: 120, price: 200 },
                { name: 'Panel Upgrade', category: 'Upgrade', description: 'Electrical panel upgrades', duration: 240, price: 1200 },
                { name: 'Emergency Electrical', category: 'Emergency', description: '24/7 emergency electrical', duration: 90, price: 250 }
            ]
        },
        'consulting': {
            name: 'Consulting Services',
            services: [
                { name: 'Business Strategy', category: 'Strategy', description: 'Business strategy consultation', duration: 120, price: 300 },
                { name: 'Financial Planning', category: 'Planning', description: 'Financial planning services', duration: 90, price: 250 },
                { name: 'Market Analysis', category: 'Analysis', description: 'Market research and analysis', duration: 180, price: 500 },
                { name: 'Process Optimization', category: 'Optimization', description: 'Business process improvement', duration: 240, price: 800 },
                { name: 'Technology Consulting', category: 'Technology', description: 'IT and technology consulting', duration: 120, price: 350 }
            ]
        }
    };

    const handleAddService = () => {
        if (!newService.name || !newService.category || newService.price <= 0) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields and set a valid price.",
                variant: "destructive"
            });
            return;
        }

        const service: ServiceType = {
            id: Date.now(),
            name: newService.name,
            category: newService.category,
            description: newService.description,
            duration: newService.duration,
            price: newService.price,
            isActive: true
        };

        setServiceTypes([service, ...serviceTypes]);
        setNewService({ name: '', category: '', description: '', duration: 60, price: 0 });
        setIsAddServiceOpen(false);

        toast({
            title: "Service Added",
            description: `${service.name} has been added to your service types.`,
        });
    };

    const handleEditService = () => {
        if (!selectedService) return;

        if (!newService.name || !newService.category || newService.price <= 0) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields and set a valid price.",
                variant: "destructive"
            });
            return;
        }

        const updatedServiceTypes = serviceTypes.map(service =>
            service.id === selectedService.id
                ? { ...service, ...newService }
                : service
        );

        setServiceTypes(updatedServiceTypes);
        setSelectedService(null);
        setNewService({ name: '', category: '', description: '', duration: 60, price: 0 });
        setIsEditServiceOpen(false);

        toast({
            title: "Service Updated",
            description: `${newService.name} has been updated.`,
        });
    };

    const handleDeleteService = (serviceId: number) => {
        const service = serviceTypes.find(s => s.id === serviceId);
        setServiceTypes(serviceTypes.filter(s => s.id !== serviceId));

        toast({
            title: "Service Deleted",
            description: `${service?.name} has been removed from your service types.`,
        });
    };

    const handleToggleService = (serviceId: number) => {
        const updatedServiceTypes = serviceTypes.map(service =>
            service.id === serviceId
                ? { ...service, isActive: !service.isActive }
                : service
        );
        setServiceTypes(updatedServiceTypes);

        const service = serviceTypes.find(s => s.id === serviceId);
        toast({
            title: "Service Updated",
            description: `${service?.name} has been ${service?.isActive ? 'deactivated' : 'activated'}.`,
        });
    };

    const handleAddBusinessServices = (businessType: string) => {
        const business = businessTypes[businessType as keyof typeof businessTypes];
        if (!business) return;

        const newServices: ServiceType[] = business.services.map((service, index) => ({
            id: Date.now() + index,
            name: service.name,
            category: service.category,
            description: service.description,
            duration: service.duration,
            price: service.price,
            isActive: true
        }));

        setServiceTypes([...newServices, ...serviceTypes]);

        toast({
            title: "Services Added",
            description: `${business.name} service types have been added to your configuration.`,
        });
    };

    const handleEditServiceClick = (service: ServiceType) => {
        setSelectedService(service);
        setNewService({
            name: service.name,
            category: service.category,
            description: service.description,
            duration: service.duration,
            price: service.price
        });
        setIsEditServiceOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Quick Add Business Services */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Add Business Services</CardTitle>
                    <CardDescription>Add pre-configured service types for your business</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(businessTypes).map(([key, business]) => (
                            <Button
                                key={key}
                                variant="outline"
                                onClick={() => handleAddBusinessServices(key)}
                                className="h-auto p-4 flex-col"
                            >
                                <Wrench className="h-6 w-6 mb-2" />
                                <span className="text-sm">{business.name}</span>
                                <span className="text-xs text-gray-500 mt-1">
                                    {business.services.length} services
                                </span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Service Types List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Service Types</CardTitle>
                            <CardDescription>Configure your service offerings and pricing</CardDescription>
                        </div>
                        <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Service
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Service</DialogTitle>
                                    <DialogDescription>
                                        Create a new service type for your business
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="serviceName" className="text-right">Name *</Label>
                                        <Input
                                            id="serviceName"
                                            value={newService.name}
                                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="serviceCategory" className="text-right">Category *</Label>
                                        <Input
                                            id="serviceCategory"
                                            value={newService.category}
                                            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="serviceDescription" className="text-right">Description</Label>
                                        <Textarea
                                            id="serviceDescription"
                                            value={newService.description}
                                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="serviceDuration" className="text-right">Duration (min) *</Label>
                                        <Input
                                            id="serviceDuration"
                                            type="number"
                                            value={newService.duration}
                                            onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="servicePrice" className="text-right">Price ($) *</Label>
                                        <Input
                                            id="servicePrice"
                                            type="number"
                                            step="0.01"
                                            value={newService.price}
                                            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddService}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Service
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {serviceTypes.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Settings className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{service.name}</h3>
                                            <Badge variant={service.isActive ? "default" : "secondary"}>
                                                {service.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {service.duration} min
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" />
                                                ${service.price}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Wrench className="h-4 w-4" />
                                                {service.category}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleService(service.id)}
                                    >
                                        {service.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditServiceClick(service)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteService(service.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Service Modal */}
            <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>
                            Update service information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editServiceName" className="text-right">Name *</Label>
                            <Input
                                id="editServiceName"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editServiceCategory" className="text-right">Category *</Label>
                            <Input
                                id="editServiceCategory"
                                value={newService.category}
                                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editServiceDescription" className="text-right">Description</Label>
                            <Textarea
                                id="editServiceDescription"
                                value={newService.description}
                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editServiceDuration" className="text-right">Duration (min) *</Label>
                            <Input
                                id="editServiceDuration"
                                type="number"
                                value={newService.duration}
                                onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editServicePrice" className="text-right">Price ($) *</Label>
                            <Input
                                id="editServicePrice"
                                type="number"
                                step="0.01"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditServiceOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditService}>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Service
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 