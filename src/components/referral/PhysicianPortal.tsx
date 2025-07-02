import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  UserCheck, 
  Key, 
  FileText, 
  Send,
  Eye,
  Download,
  Plus
} from "lucide-react";

export const PhysicianPortal = () => {
  const [selectedPhysician, setSelectedPhysician] = useState(null);

  const physicians = [
    { 
      id: 1, 
      name: "Dr. Sarah Chen", 
      specialty: "Sleep Medicine", 
      email: "schen@sleepmed.com",
      status: "active",
      lastLogin: "2 hours ago",
      referrals: 34,
      portalAccess: true
    },
    { 
      id: 2, 
      name: "Dr. Mike Johnson", 
      specialty: "Primary Care", 
      email: "mjohnson@primarycare.com",
      status: "pending_invite",
      lastLogin: "Never",
      referrals: 8,
      portalAccess: false
    },
    { 
      id: 3, 
      name: "Dr. Emily Davis", 
      specialty: "Pulmonology", 
      email: "edavis@lungcenter.com",
      status: "active",
      lastLogin: "1 day ago",
      referrals: 12,
      portalAccess: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "pending_invite":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending Invite</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Secure Physician Portal
          </CardTitle>
          <CardDescription>
            OIDC-authenticated portal for referring physicians to track patient outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">28</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Reports Shared</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">HIPAA Compliant</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physician Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Physician Access Management</CardTitle>
              <CardDescription>
                Manage portal access and permissions for referring physicians
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Invite Physician
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {physicians.map((physician) => (
              <div key={physician.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{physician.name}</h3>
                    <p className="text-sm text-gray-600">{physician.specialty} • {physician.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(physician.status)}
                    {physician.portalAccess && (
                      <Badge variant="outline" className="text-purple-700">
                        <Key className="w-3 h-3 mr-1" />
                        Portal Access
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Total Referrals</div>
                    <div className="font-semibold">{physician.referrals}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Login</div>
                    <div className="font-semibold text-xs">{physician.lastLogin}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-semibold text-xs">{physician.status}</div>
                  </div>
                  <div className="flex gap-2">
                    {physician.portalAccess ? (
                      <>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Portal
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="w-4 h-4 mr-1" />
                          Send Report
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">
                        <Key className="w-4 h-4 mr-1" />
                        Grant Access
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portal Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Portal Configuration
          </CardTitle>
          <CardDescription>
            Configure OIDC authentication and portal settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="oidc_provider">OIDC Provider</Label>
                <Input
                  id="oidc_provider"
                  value="auth0.com/dental-sleep-iq"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="portal_url">Portal URL</Label>
                <Input
                  id="portal_url"
                  value="https://portal.dentalsleepiq.com"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session_timeout"
                  value="30"
                  type="number"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="welcome_message">Welcome Message</Label>
                <Textarea
                  id="welcome_message"
                  value="Welcome to the Dental Sleep IQ physician portal. Access patient outcome reports and track referral status securely."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
                <Button className="flex-1">
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};