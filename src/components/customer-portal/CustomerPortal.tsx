import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Phone,
    Mail,
    CreditCard,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Star,
    Building2
} from 'lucide-react';

interface Service {
    id: string;
    name: string;
    duration: string;
    price: number;
    description: string;
    category: string;
    maxGroupSize?: number;
    currentBookings?: number;
}

interface Location {
    id: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
}

interface BookingSlot {
    id: string;
    time: string;
    date: string;
    available: boolean;
    locationId: string;
    serviceId: string;
    maxCapacity?: number;
    currentBookings?: number;
}

export const CustomerPortal: React.FC = () => {
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [groupSize, setGroupSize] = useState<number>(1);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    // Mock data - in real app this would come from API
    const businessInfo = {
        name: 'ABC HVAC Services',
        logo: '/logo.png',
        primaryColor: '#10b981',
        description: 'Professional HVAC maintenance and repair services',
        phone: '(555) 123-4567',
        email: 'contact@abchvac.com'
    };

    const services: Service[] = [
        {
            id: '1',
            name: 'HVAC Maintenance',
            duration: '1 hour',
            price: 245.00,
            description: 'Regular HVAC system maintenance and inspection',
            category: 'Maintenance'
        },
        {
            id: '2',
            name: 'Plumbing Repair',
            duration: '2 hours',
            price: 180.00,
            description: 'Emergency plumbing repairs and installations',
            category: 'Repair'
        },
        {
            id: '3',
            name: 'Yoga Class',
            duration: '1 hour',
            price: 25.00,
            description: 'Group yoga session for all levels',
            category: 'Wellness',
            maxGroupSize: 15,
            currentBookings: 8
        },
        {
            id: '4',
            name: 'Electrical Installation',
            duration: '3 hours',
            price: 450.00,
            description: 'New electrical installations and upgrades',
            category: 'Installation'
        }
    ];

    const locations: Location[] = [
        {
            id: '1',
            name: 'Main Office',
            address: '123 Main St, City, State 12345',
            phone: '(555) 123-4567',
            hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-3PM'
        },
        {
            id: '2',
            name: 'Downtown Branch',
            address: '456 Downtown Ave, City, State 12345',
            phone: '(555) 234-5678',
            hours: 'Mon-Fri: 9AM-5PM'
        }
    ];

    const availableSlots: BookingSlot[] = [
        {
            id: '1',
            time: '9:00 AM',
            date: '2024-01-20',
            available: true,
            locationId: '1',
            serviceId: '1',
            maxCapacity: 1
        },
        {
            id: '2',
            time: '10:00 AM',
            date: '2024-01-20',
            available: true,
            locationId: '1',
            serviceId: '1',
            maxCapacity: 1
        },
        {
            id: '3',
            time: '6:00 PM',
            date: '2024-01-20',
            available: true,
            locationId: '1',
            serviceId: '3',
            maxCapacity: 15,
            currentBookings: 8
        }
    ];

    const isGroupBooking = (service: Service) => service.maxGroupSize && service.maxGroupSize > 1;
    const getAvailableSpots = (slot: BookingSlot) =>
        (slot.maxCapacity || 1) - (slot.currentBookings || 0);

    return (
        <div className="min-h-screen bg-gray-50" style={{ '--primary-color': businessInfo.primaryColor } as any}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{businessInfo.name}</h1>
                                <p className="text-gray-600">{businessInfo.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {businessInfo.phone}
                            </div>
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {businessInfo.email}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Booking Flow */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Select Service */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Select a Service
                                </CardTitle>
                                <CardDescription>Choose the service you'd like to book</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedService === service.id
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => setSelectedService(service.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-medium">{service.name}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {service.duration}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <CreditCard className="h-4 w-4" />
                                                            ${service.price}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">{service.category}</Badge>
                                            </div>

                                            {isGroupBooking(service) && (
                                                <div className="mt-3 p-2 bg-blue-50 rounded">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                        <span className="text-blue-700">
                                                            {service.currentBookings || 0} of {service.maxGroupSize} spots filled
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 2: Select Location (if multiple) */}
                        {locations.length > 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Choose Location
                                    </CardTitle>
                                    <CardDescription>Select your preferred location</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {locations.map((location) => (
                                            <div
                                                key={location.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedLocation === location.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setSelectedLocation(location.id)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{location.name}</h3>
                                                        <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="h-4 w-4" />
                                                                {location.phone}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {location.hours}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 3: Select Date & Time */}
                        {selectedService && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Select Date & Time
                                    </CardTitle>
                                    <CardDescription>Choose your preferred appointment time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Date Selection */}
                                        <div>
                                            <Label>Select Date</Label>
                                            <div className="grid grid-cols-7 gap-2 mt-2">
                                                {Array.from({ length: 7 }, (_, i) => {
                                                    const date = new Date();
                                                    date.setDate(date.getDate() + i);
                                                    const dateStr = date.toISOString().split('T')[0];
                                                    return (
                                                        <button
                                                            key={i}
                                                            className={`p-2 text-center rounded border ${selectedDate === dateStr
                                                                    ? 'bg-green-500 text-white border-green-500'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                            onClick={() => setSelectedDate(dateStr)}
                                                        >
                                                            <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                                            <div className="font-medium">{date.getDate()}</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Time Selection */}
                                        {selectedDate && (
                                            <div>
                                                <Label>Select Time</Label>
                                                <div className="grid grid-cols-3 gap-2 mt-2">
                                                    {availableSlots
                                                        .filter(slot => slot.date === selectedDate && slot.serviceId === selectedService)
                                                        .map((slot) => (
                                                            <button
                                                                key={slot.id}
                                                                className={`p-3 text-center rounded border ${selectedTime === slot.time
                                                                        ? 'bg-green-500 text-white border-green-500'
                                                                        : slot.available
                                                                            ? 'border-gray-200 hover:border-gray-300'
                                                                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                                    }`}
                                                                onClick={() => slot.available && setSelectedTime(slot.time)}
                                                                disabled={!slot.available}
                                                            >
                                                                <div className="font-medium">{slot.time}</div>
                                                                {slot.maxCapacity && slot.maxCapacity > 1 && (
                                                                    <div className="text-xs">
                                                                        {getAvailableSpots(slot)} spots left
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 4: Group Size (for group bookings) */}
                        {selectedService && isGroupBooking(services.find(s => s.id === selectedService)!) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Group Size
                                    </CardTitle>
                                    <CardDescription>How many people will be attending?</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="groupSize">Number of People</Label>
                                            <Input
                                                id="groupSize"
                                                type="number"
                                                min="1"
                                                max={services.find(s => s.id === selectedService)?.maxGroupSize}
                                                value={groupSize}
                                                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                                                className="w-32"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 5: Customer Information */}
                        {selectedTime && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Your Information
                                    </CardTitle>
                                    <CardDescription>Please provide your contact details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={customerInfo.name}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={customerInfo.email}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={customerInfo.phone}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Special Notes (Optional)</Label>
                                            <Input
                                                id="notes"
                                                value={customerInfo.notes}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                                placeholder="Any special requirements or notes..."
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedService && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Service:</span>
                                            <span>{services.find(s => s.id === selectedService)?.name}</span>
                                        </div>
                                        {selectedLocation && (
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Location:</span>
                                                <span>{locations.find(l => l.id === selectedLocation)?.name}</span>
                                            </div>
                                        )}
                                        {selectedDate && (
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Date:</span>
                                                <span>{new Date(selectedDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {selectedTime && (
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Time:</span>
                                                <span>{selectedTime}</span>
                                            </div>
                                        )}
                                        {groupSize > 1 && (
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Group Size:</span>
                                                <span>{groupSize} people</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-3">
                                            <div className="flex items-center justify-between font-bold">
                                                <span>Total:</span>
                                                <span>
                                                    ${(services.find(s => s.id === selectedService)?.price || 0) * groupSize}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTime && customerInfo.name && customerInfo.email && (
                                    <Button className="w-full" size="lg">
                                        Confirm Booking
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About {businessInfo.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm">4.8/5 (127 reviews)</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Licensed & Insured</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Same Day Service Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>24/7 Emergency Support</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}; 