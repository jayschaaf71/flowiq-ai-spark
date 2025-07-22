
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Eye,
  Send
} from "lucide-react";
import { priorAuthService, PriorAuthRequest } from "@/services/priorAuthorization";
import { PriorAuthRequestForm } from "./prior-auth/PriorAuthRequestForm";

export const PriorAuthorizationDashboard = () => {
  const [pendingAuths, setPendingAuths] = useState<PriorAuthRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuth, setSelectedAuth] = useState<PriorAuthRequest | null>(null);
  const { toast } = useToast();

  const loadPendingAuthorizations = useCallback(async () => {
    try {
      setLoading(true);
      const auths = await priorAuthService.getPendingAuthorizations();
      setPendingAuths(auths);
    } catch (error) {
      console.error('Error loading authorizations:', error);
      toast({
        title: "Error Loading Authorizations",
        description: "Unable to load prior authorization data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPendingAuthorizations();
  }, [loadPendingAuthorizations]);

  const handleSubmitAuth = async (authId: string) => {
    try {
      await priorAuthService.submitAuthRequest(authId);
      toast({
        title: "Authorization Submitted",
        description: "Prior authorization request has been submitted to the payer",
      });
      loadPendingAuthorizations();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit prior authorization request",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: "secondary" as const, icon: Clock },
      submitted: { variant: "outline" as const, icon: Clock },
      approved: { variant: "default" as const, icon: CheckCircle },
      denied: { variant: "destructive" as const, icon: XCircle },
      expired: { variant: "secondary" as const, icon: AlertTriangle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.draft;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const authStats = [
    { label: "Pending Requests", value: "12", icon: Clock, color: "text-orange-600" },
    { label: "Approved This Month", value: "45", icon: CheckCircle, color: "text-green-600" },
    { label: "Avg Processing Time", value: "2.3 days", icon: Shield, color: "text-blue-600" },
    { label: "Approval Rate", value: "94%", icon: Shield, color: "text-purple-600" }
  ];

  if (loading) {
    return <div className="flex justify-center p-8">Loading prior authorizations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Prior Authorization Management
          </h3>
          <p className="text-gray-600">
            AI-powered prior authorization requests and tracking
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Auth Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Prior Authorization Request</DialogTitle>
              <DialogDescription>
                Generate an AI-assisted prior authorization request
              </DialogDescription>
            </DialogHeader>
            <PriorAuthRequestForm onSuccess={loadPendingAuthorizations} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {authStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="denied">Denied</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Prior Authorizations</CardTitle>
              <CardDescription>
                Requests awaiting approval or requiring action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auth ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Procedure</TableHead>
                    <TableHead>Service Date</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAuths.map((auth) => (
                    <TableRow key={auth.id}>
                      <TableCell className="font-medium">{auth.id}</TableCell>
                      <TableCell>{auth.patientId}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {auth.procedureCodes.map((code, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{auth.serviceDate}</TableCell>
                      <TableCell>
                        <Badge variant={auth.urgency === 'emergent' ? 'destructive' : 
                                     auth.urgency === 'urgent' ? 'secondary' : 'outline'}>
                          {auth.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(auth.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">
                            {Math.round(auth.confidence * 100)}%
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            auth.confidence >= 0.8 ? 'bg-green-500' : 
                            auth.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedAuth(auth)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {auth.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSubmitAuth(auth.id)}
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Authorizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No approved authorizations to display
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="denied">
          <Card>
            <CardHeader>
              <CardTitle>Denied Authorizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No denied authorizations to display
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Authorization Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Analytics charts would be displayed here
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payer Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Payer response time metrics would be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Auth Detail Modal */}
      {selectedAuth && (
        <Dialog open={!!selectedAuth} onOpenChange={() => setSelectedAuth(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Prior Authorization Details</DialogTitle>
              <DialogDescription>
                Authorization request {selectedAuth.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedAuth.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Urgency</label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedAuth.urgency}</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Clinical Justification</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                  {selectedAuth.clinicalJustification}
                </div>
              </div>
              
              {selectedAuth.aiRecommendation && (
                <div>
                  <label className="text-sm font-medium">AI Recommendation</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-md text-sm">
                    {selectedAuth.aiRecommendation}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
