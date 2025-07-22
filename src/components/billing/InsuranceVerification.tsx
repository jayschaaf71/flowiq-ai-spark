import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  Search,
  Upload,
  Phone,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface InsuranceCard {
  id: string;
  patient_id: string;
  card_type: 'primary' | 'secondary';
  insurance_provider_name: string;
  policy_number: string;
  group_number: string;
  member_id: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'expired';
  front_image_path?: string;
  back_image_path?: string;
  extracted_data?: any;
  verified_at?: string;
}

interface VerificationResult {
  status: 'active' | 'inactive' | 'suspended';
  coverage_details: {
    deductible: number;
    copay: number;
    out_of_pocket_max: number;
    coverage_percentage: number;
  };
  effective_date: string;
  expiration_date: string;
  prior_auth_required: boolean;
  network_status: 'in-network' | 'out-of-network';
}

export const InsuranceVerification = () => {
  const [selectedCard, setSelectedCard] = useState<InsuranceCard | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const insuranceCards: InsuranceCard[] = [
    {
      id: '1',
      patient_id: 'patient-1',
      card_type: 'primary',
      insurance_provider_name: 'Blue Cross Blue Shield',
      policy_number: 'ABC123456789',
      group_number: 'GRP001',
      member_id: 'MEM789',
      verification_status: 'verified'
    },
    {
      id: '2',
      patient_id: 'patient-2',
      card_type: 'primary',
      insurance_provider_name: 'Aetna',
      policy_number: 'AET987654321',
      group_number: 'GRP002',
      member_id: 'MEM456',
      verification_status: 'pending'
    }
  ];

  const handleVerifyInsurance = async (card: InsuranceCard) => {
    setIsVerifying(true);
    setSelectedCard(card);
    
    try {
      // Simulate API call to insurance verification service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: VerificationResult = {
        status: 'active',
        coverage_details: {
          deductible: 1500,
          copay: 25,
          out_of_pocket_max: 8000,
          coverage_percentage: 80
        },
        effective_date: '2024-01-01',
        expiration_date: '2024-12-31',
        prior_auth_required: false,
        network_status: 'in-network'
      };
      
      setVerificationResult(mockResult);
      toast.success('Insurance verification completed successfully');
    } catch (error) {
      toast.error('Failed to verify insurance');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredCards = insuranceCards.filter(card =>
    card.insurance_provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.policy_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.member_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Insurance Verification</h2>
          <p className="text-muted-foreground">
            Verify patient insurance coverage and benefits
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Insurance Card
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by provider, policy number, or member ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">Insurance Cards</TabsTrigger>
          <TabsTrigger value="verification">Verification Results</TabsTrigger>
          <TabsTrigger value="benefits">Benefits Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <Card key={card.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {card.insurance_provider_name}
                    </CardTitle>
                    <Badge variant={getStatusVariant(card.verification_status)} className="text-xs">
                      {getStatusIcon(card.verification_status)}
                      <span className="ml-1">{card.verification_status}</span>
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {card.card_type} insurance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Policy:</span>
                      <span className="font-mono text-xs">{card.policy_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Group:</span>
                      <span className="font-mono text-xs">{card.group_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member ID:</span>
                      <span className="font-mono text-xs">{card.member_id}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyInsurance(card)}
                      disabled={isVerifying}
                      className="flex-1"
                    >
                      <CreditCard className="mr-1 h-3 w-3" />
                      {isVerifying && selectedCard?.id === card.id ? 'Verifying...' : 'Verify'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          {verificationResult ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Insurance Verification Results
                </CardTitle>
                <CardDescription>
                  Verification completed for {selectedCard?.insurance_provider_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Coverage Status</Label>
                    <Badge variant={verificationResult.status === 'active' ? 'default' : 'destructive'}>
                      {verificationResult.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Network Status</Label>
                    <Badge variant={verificationResult.network_status === 'in-network' ? 'default' : 'secondary'}>
                      {verificationResult.network_status}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Deductible</Label>
                    <div className="text-2xl font-bold text-primary">
                      ${verificationResult.coverage_details.deductible}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Copay</Label>
                    <div className="text-2xl font-bold text-primary">
                      ${verificationResult.coverage_details.copay}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Out-of-Pocket Max</Label>
                    <div className="text-2xl font-bold text-primary">
                      ${verificationResult.coverage_details.out_of_pocket_max}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Coverage %</Label>
                    <div className="text-2xl font-bold text-primary">
                      {verificationResult.coverage_details.coverage_percentage}%
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {verificationResult.prior_auth_required 
                      ? 'Prior authorization is required for certain procedures.'
                      : 'No prior authorization required for standard procedures.'
                    }
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  Select an insurance card to view verification results
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Summary</CardTitle>
              <CardDescription>
                Detailed coverage information and benefit limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Annual Deductible Progress</Label>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$525 of $1,500</span>
                      <span>35%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Out-of-Pocket Progress</Label>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$1,600 of $8,000</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Covered Services</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-secondary/50 rounded">
                      <span>Office Visits</span>
                      <span className="font-medium">$25 copay</span>
                    </div>
                    <div className="flex justify-between p-2 bg-secondary/50 rounded">
                      <span>Specialist Visits</span>
                      <span className="font-medium">$50 copay</span>
                    </div>
                    <div className="flex justify-between p-2 bg-secondary/50 rounded">
                      <span>Emergency Room</span>
                      <span className="font-medium">$300 copay</span>
                    </div>
                    <div className="flex justify-between p-2 bg-secondary/50 rounded">
                      <span>Prescription Drugs</span>
                      <span className="font-medium">80% coverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};