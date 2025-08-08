import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';

const Profile = () => {
    const { data: userProfile } = useUserProfile();
    const { currentTheme } = useSpecialtyTheme();

    // Mock user data for development
    const user = {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@flowiq.com",
        role: "Practice Manager",
        avatar: "/api/placeholder/150/150",
        phone: "+1 (555) 123-4567",
        department: "FlowIQ Connect",
        joinDate: "January 2024",
        status: "Active",
        permissions: ["admin", "scheduling", "communications", "billing"],
        lastLogin: "2 hours ago"
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Your personal and professional details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.role}</p>
                                        <Badge variant="secondary" className="mt-1">{user.status}</Badge>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-sm text-gray-900">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Phone</label>
                                        <p className="text-sm text-gray-900">{user.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Department</label>
                                        <p className="text-sm text-gray-900">{user.department}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Member Since</label>
                                        <p className="text-sm text-gray-900">{user.joinDate}</p>
                                    </div>
                                </div>

                                <Button className="w-full">Edit Profile</Button>
                            </CardContent>
                        </Card>

                        {/* Activity & Stats */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Activity & Statistics</CardTitle>
                                <CardDescription>Your recent activity and performance metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">156</div>
                                        <div className="text-sm text-gray-600">Appointments Handled</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">94%</div>
                                        <div className="text-sm text-gray-600">Customer Satisfaction</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">23</div>
                                        <div className="text-sm text-gray-600">AI Assistants Used</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">12</div>
                                        <div className="text-sm text-gray-600">Hours This Week</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Completed appointment scheduling for Sarah Johnson</span>
                                            <span className="text-gray-500">2 hours ago</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Used Clinical Assistant for treatment planning</span>
                                            <span className="text-gray-500">4 hours ago</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span>Sent follow-up communication to 3 patients</span>
                                            <span className="text-gray-500">6 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your account security and authentication</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Two-Factor Authentication</h4>
                                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                    </div>
                                    <Button variant="outline">Enable 2FA</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Password</h4>
                                        <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                                    </div>
                                    <Button variant="outline">Change Password</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Login Sessions</h4>
                                        <p className="text-sm text-gray-600">Manage active sessions across devices</p>
                                    </div>
                                    <Button variant="outline">View Sessions</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Configure how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Email Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive updates via email</p>
                                    </div>
                                    <Button variant="outline">Configure</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">SMS Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
                                    </div>
                                    <Button variant="outline">Configure</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">In-App Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive notifications within the app</p>
                                    </div>
                                    <Button variant="outline">Configure</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Customize your FlowIQ Connect experience</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Theme</h4>
                                        <p className="text-sm text-gray-600">Choose your preferred color scheme</p>
                                    </div>
                                    <Button variant="outline">Customize</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Language</h4>
                                        <p className="text-sm text-gray-600">Set your preferred language</p>
                                    </div>
                                    <Button variant="outline">Change</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Time Zone</h4>
                                        <p className="text-sm text-gray-600">Set your local time zone</p>
                                    </div>
                                    <Button variant="outline">Set Time Zone</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile; 