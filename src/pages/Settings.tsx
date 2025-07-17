import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TwoFactorAuth } from "@/components/auth/TwoFactorAuth";
import { TeamManagement } from "@/components/settings/TeamManagement";
import { ProviderNotificationPreferences } from "@/components/provider/ProviderNotificationPreferences";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  // In a real app, you'd get this from auth context
  const providerId = 'current-provider-id'; // This should come from auth context
  
  // State for form persistence
  const [practiceInfo, setPracticeInfo] = useState({
    name: "Midwest Dental Sleep Medicine Institute",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const handleSavePracticeInfo = () => {
    toast({
      title: "Practice information saved",
      description: "Your practice details have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings"
        subtitle="Configure your FlowIQ preferences and manage your practice"
      />
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice Information</CardTitle>
                <CardDescription>Basic practice configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Practice Name</label>
                  <input 
                    className="w-full p-2 border rounded" 
                    value={practiceInfo.name}
                    onChange={(e) => setPracticeInfo(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Zone</label>
                  <select className="w-full p-2 border rounded">
                    <option>Eastern Time (EST)</option>
                    <option selected>Central Time (CST)</option>
                    <option>Mountain Time (MST)</option>
                    <option>Pacific Time (PST)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Practice Type</label>
                  <div className="w-full p-2 border rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Dental Sleep Medicine Practice</span>
                  </div>
                </div>
                <Button onClick={handleSavePracticeInfo} className="w-full mt-4">
                  Save Practice Information
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Practice contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input 
                    className="w-full p-2 border rounded" 
                    placeholder="(555) 123-4567"
                    value={practiceInfo.phone}
                    onChange={(e) => setPracticeInfo(prev => ({...prev, phone: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input 
                    className="w-full p-2 border rounded" 
                    placeholder="contact@practice.com"
                    value={practiceInfo.email}
                    onChange={(e) => setPracticeInfo(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <input 
                    className="w-full p-2 border rounded" 
                    placeholder="https://practice.com"
                    value={practiceInfo.website}
                    onChange={(e) => setPracticeInfo(prev => ({...prev, website: e.target.value}))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Practice location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Street Address</label>
                  <input 
                    className="w-full p-2 border rounded" 
                    placeholder="123 Medical Drive"
                    value={practiceInfo.address}
                    onChange={(e) => setPracticeInfo(prev => ({...prev, address: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <input 
                      className="w-full p-2 border rounded" 
                      placeholder="City"
                      value={practiceInfo.city}
                      onChange={(e) => setPracticeInfo(prev => ({...prev, city: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <input 
                      className="w-full p-2 border rounded" 
                      placeholder="State"
                      value={practiceInfo.state}
                      onChange={(e) => setPracticeInfo(prev => ({...prev, state: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP Code</label>
                  <input 
                    className="w-full p-2 border rounded" 
                    placeholder="12345"
                    value={practiceInfo.zipCode}
                    onChange={(e) => setPracticeInfo(prev => ({...prev, zipCode: e.target.value}))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>
        
        <TabsContent value="notifications">
          <ProviderNotificationPreferences providerId={providerId} />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and privacy options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session Timeout</span>
                  <span className="text-sm text-muted-foreground">30 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Login Notifications</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password Expiry</span>
                  <span className="text-sm text-muted-foreground">90 days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HIPAA Compliance</CardTitle>
                <CardDescription>Healthcare privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Audit Logging</span>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Encryption</span>
                  <Badge className="bg-green-100 text-green-700">AES-256</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Access Control</span>
                  <Badge className="bg-green-100 text-green-700">Role-Based</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Backup</span>
                  <Badge className="bg-green-100 text-green-700">Daily</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <TwoFactorAuth />
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Practice billing and payment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax ID (EIN)</label>
                  <input className="w-full p-2 border rounded" placeholder="XX-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">NPI Number</label>
                  <input className="w-full p-2 border rounded" placeholder="1234567890" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Billing Contact Email</label>
                  <input className="w-full p-2 border rounded" placeholder="billing@practice.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Accepted payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credit Cards</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ACH/Bank Transfer</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cash Payments</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Insurance Claims</span>
                  <input type="checkbox" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;