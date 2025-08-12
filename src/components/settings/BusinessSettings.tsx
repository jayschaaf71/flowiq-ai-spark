import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Phone, Globe, Clock } from 'lucide-react';

export const BusinessSettings: React.FC = () => {
    const businessTypes = [
        'HVAC Services',
        'Plumbing Services',
        'Electrical Services',
        'Landscaping',
        'Cleaning Services',
        'Pest Control',
        'Roofing Services',
        'Painting Services',
        'Auto Repair',
        'Pet Services',
        'Personal Training',
        'Massage Therapy',
        'Hair Salon',
        'Real Estate',
        'Consulting',
        'Legal Services',
        'Accounting',
        'IT Services',
        'Photography',
        'Event Planning',
        'Other'
    ];

    return (
        <div className="space-y-6">
            {/* Business Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Business Information
                    </CardTitle>
                    <CardDescription>Configure your business profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input id="businessName" placeholder="Your Business Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessType">Business Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypes.map((type) => (
                                        <SelectItem key={type} value={type.toLowerCase()}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Business Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your business and services..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="(555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="contact@yourbusiness.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Input id="address" placeholder="123 Main St, City, State 12345" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input id="website" placeholder="https://yourbusiness.com" />
                    </div>
                </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Business Hours
                    </CardTitle>
                    <CardDescription>Set your availability for customer bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <div key={day} className="flex items-center gap-4">
                                <div className="w-24">
                                    <Label className="text-sm font-medium">{day}</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input type="time" className="w-32" />
                                    <span className="text-gray-500">to</span>
                                    <Input type="time" className="w-32" />
                                </div>
                                <Button variant="outline" size="sm">
                                    Closed
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Service Areas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Service Areas
                    </CardTitle>
                    <CardDescription>Define where you provide services</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
                            <Input id="serviceRadius" type="number" placeholder="25" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="serviceAreas">Specific Cities/Areas</Label>
                            <Textarea
                                id="serviceAreas"
                                placeholder="Enter cities or areas you serve, one per line..."
                                rows={3}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>Save Settings</Button>
            </div>
        </div>
    );
}; 