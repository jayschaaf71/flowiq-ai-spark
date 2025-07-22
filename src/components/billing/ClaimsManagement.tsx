import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Send, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface Claim {
  id: string;
  claim_number: string;
  patient_id: string;
  patient_name: string;
  appointment_id?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'paid';
  total_amount: number;
  payer_name: string;
  procedure_codes: string[];
  diagnosis_codes: string[];
  submitted_date?: string;
  processed_date?: string;
  notes?: string;
  denial_reason?: string;
}

interface ClaimLine {
  procedure_code: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  diagnosis_code: string;
}

export const ClaimsManagement = () => {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const claims: Claim[] = [
    {
      id: '1',
      claim_number: 'CLM-2024-001',
      patient_id: 'patient-1',
      patient_name: 'John Doe',
      status: 'submitted',
      total_amount: 450.00,
      payer_name: 'Blue Cross Blue Shield',
      procedure_codes: ['99213', '87804'],
      diagnosis_codes: ['Z00.00'],
      submitted_date: '2024-01-15'
    },
    {
      id: '2',
      claim_number: 'CLM-2024-002',
      patient_id: 'patient-2',
      patient_name: 'Jane Smith',
      status: 'approved',
      total_amount: 325.00,
      payer_name: 'Aetna',
      procedure_codes: ['99214'],
      diagnosis_codes: ['M79.3'],
      submitted_date: '2024-01-12',
      processed_date: '2024-01-20'
    },
    {
      id: '3',
      claim_number: 'CLM-2024-003',
      patient_id: 'patient-3',
      patient_name: 'Mike Johnson',
      status: 'denied',
      total_amount: 280.00,
      payer_name: 'UnitedHealth',
      procedure_codes: ['99212'],
      diagnosis_codes: ['R50.9'],
      submitted_date: '2024-01-10',
      processed_date: '2024-01-18',
      denial_reason: 'Prior authorization required'
    }
  ];

  const [newClaim, setNewClaim] = useState({
    patient_name: '',
    payer_name: '',
    procedure_codes: [''],
    diagnosis_codes: [''],
    notes: ''
  });

  const [claimLines, setClaimLines] = useState<ClaimLine[]>([
    {
      procedure_code: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_amount: 0,
      diagnosis_code: ''
    }
  ]);

  const handleSubmitClaim = async (claimId: string) => {
    setIsSubmitting(true);
    try {
      // Simulate API call to submit claim
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Claim submitted successfully');
    } catch (error) {
      toast.error('Failed to submit claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClaim = async () => {
    try {
      // Validate required fields
      if (!newClaim.patient_name || !newClaim.payer_name) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Simulate API call to create claim
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Claim created successfully');
      
      // Reset form
      setNewClaim({
        patient_name: '',
        payer_name: '',
        procedure_codes: [''],
        diagnosis_codes: [''],
        notes: ''
      });
      setClaimLines([{
        procedure_code: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        total_amount: 0,
        diagnosis_code: ''
      }]);
    } catch (error) {
      toast.error('Failed to create claim');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under_review':
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return 'default';
      case 'denied':
        return 'destructive';
      case 'under_review':
      case 'submitted':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const addClaimLine = () => {
    setClaimLines([...claimLines, {
      procedure_code: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_amount: 0,
      diagnosis_code: ''
    }]);
  };

  const updateClaimLine = (index: number, field: keyof ClaimLine, value: string | number) => {
    const updated = [...claimLines];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate total if quantity or unit_price changed
    if (field === 'quantity' || field === 'unit_price') {
      updated[index].total_amount = updated[index].quantity * updated[index].unit_price;
    }
    
    setClaimLines(updated);
  };

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesSearch = 
      claim.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claim_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.payer_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const totalClaimAmount = claimLines.reduce((sum, line) => sum + line.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Claims Management</h2>
          <p className="text-muted-foreground">
            Submit and track insurance claims
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Claim
        </Button>
      </div>

      <Tabs defaultValue="claims" className="space-y-4">
        <TabsList>
          <TabsTrigger value="claims">Claims List</TabsTrigger>
          <TabsTrigger value="create">Create Claim</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Claims</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{claim.claim_number}</CardTitle>
                      <CardDescription>
                        {claim.patient_name} • {claim.payer_name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${claim.total_amount.toFixed(2)}
                        </div>
                        <Badge variant={getStatusVariant(claim.status)} className="text-xs">
                          {getStatusIcon(claim.status)}
                          <span className="ml-1">{claim.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Procedure Codes</Label>
                      <div className="flex flex-wrap gap-1">
                        {claim.procedure_codes.map((code, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Diagnosis Codes</Label>
                      <div className="flex flex-wrap gap-1">
                        {claim.diagnosis_codes.map((code, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Dates</Label>
                      <div className="text-sm space-y-1">
                        {claim.submitted_date && (
                          <div>Submitted: {claim.submitted_date}</div>
                        )}
                        {claim.processed_date && (
                          <div>Processed: {claim.processed_date}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {claim.denial_reason && (
                    <Alert className="mt-4">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Denial Reason:</strong> {claim.denial_reason}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                    {claim.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => handleSubmitClaim(claim.id)}
                        disabled={isSubmitting}
                      >
                        <Send className="mr-1 h-3 w-3" />
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    )}
                    {claim.status === 'denied' && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Resubmit
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Claim</CardTitle>
              <CardDescription>
                Enter claim details and procedure information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient Name *</Label>
                  <Input
                    id="patient-name"
                    value={newClaim.patient_name}
                    onChange={(e) => setNewClaim({...newClaim, patient_name: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payer-name">Insurance Payer *</Label>
                  <Select 
                    value={newClaim.payer_name} 
                    onValueChange={(value) => setNewClaim({...newClaim, payer_name: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance payer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
                      <SelectItem value="Aetna">Aetna</SelectItem>
                      <SelectItem value="UnitedHealth">UnitedHealth</SelectItem>
                      <SelectItem value="Cigna">Cigna</SelectItem>
                      <SelectItem value="Medicare">Medicare</SelectItem>
                      <SelectItem value="Medicaid">Medicaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Claim Lines</h3>
                  <Button variant="outline" onClick={addClaimLine}>
                    Add Line Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {claimLines.map((line, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid gap-4 md:grid-cols-5">
                        <div className="space-y-2">
                          <Label>Procedure Code</Label>
                          <Input
                            value={line.procedure_code}
                            onChange={(e) => updateClaimLine(index, 'procedure_code', e.target.value)}
                            placeholder="e.g., 99213"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={line.description}
                            onChange={(e) => updateClaimLine(index, 'description', e.target.value)}
                            placeholder="Service description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={line.quantity}
                            onChange={(e) => updateClaimLine(index, 'quantity', parseInt(e.target.value) || 1)}
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit Price</Label>
                          <Input
                            type="number"
                            value={line.unit_price}
                            onChange={(e) => updateClaimLine(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Total</Label>
                          <Input
                            value={line.total_amount.toFixed(2)}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label>Diagnosis Code</Label>
                        <Input
                          value={line.diagnosis_code}
                          onChange={(e) => updateClaimLine(index, 'diagnosis_code', e.target.value)}
                          placeholder="e.g., Z00.00"
                          className="mt-1"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-lg font-medium">Total Claim Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalClaimAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newClaim.notes}
                  onChange={(e) => setNewClaim({...newClaim, notes: e.target.value})}
                  placeholder="Additional notes or comments..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreateClaim} className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button onClick={handleCreateClaim} variant="outline" className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.4%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">
                  +8.3% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2 days</div>
                <p className="text-xs text-muted-foreground">
                  -0.5 days from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};