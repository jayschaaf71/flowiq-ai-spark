
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useClaimsData } from "@/hooks/useClaimsData";
import { useClaimsRealtime } from "@/hooks/useClaimsRealtime";
import { useAIClaimsProcessing } from "@/hooks/useAIClaimsProcessing";
import { 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw
} from "lucide-react";

export const ClaimsQueue = () => {
  const { claims, loading, updateClaimStatus } = useClaimsData();
  const { processing, processClaimWithAI, batchProcessClaims } = useAIClaimsProcessing();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Enable real-time updates
  useClaimsRealtime();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'ai_processing': return <Brain className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'ready_for_review': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'submitted': return <Send className="w-4 h-4 text-blue-600" />;
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      ai_processing: "outline",
      ready_for_review: "default",
      submitted: "secondary",
      paid: "default",
      denied: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status.replace('_', ' ')}</Badge>;
  };

  const handleAIProcessClaim = async (claimId: string) => {
    await processClaimWithAI(claimId);
  };

  const handleBatchProcess = async () => {
    const draftClaims = filteredClaims
      .filter(claim => claim.processing_status === 'draft')
      .map(claim => claim.id);
    
    if (draftClaims.length > 0) {
      await batchProcessClaims(draftClaims);
    }
  };

  const handleSubmitClaim = (claimId: string) => {
    updateClaimStatus(claimId, 'submitted');
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claim_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.processing_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const draftClaimsCount = claims.filter(c => c.processing_status === 'draft').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Claims Management</CardTitle>
          <CardDescription>Process and manage insurance claims with AI assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or claim ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ai_processing">AI Processing</SelectItem>
                <SelectItem value="ready_for_review">Ready for Review</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Claims Queue ({filteredClaims.length})</CardTitle>
              <CardDescription>Review and process pending claims</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {draftClaimsCount > 0 && (
                <Button 
                  size="sm" 
                  onClick={handleBatchProcess}
                  disabled={processing}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Process All ({draftClaimsCount})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Days in A/R</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claim_number}</TableCell>
                  <TableCell>{claim.patient_name}</TableCell>
                  <TableCell>{new Date(claim.service_date).toLocaleDateString()}</TableCell>
                  <TableCell>${claim.total_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{claim.insurance_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(claim.processing_status)}
                      {getStatusBadge(claim.processing_status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={claim.ai_confidence_score || 0} className="w-16" />
                      <span className="text-sm">{claim.ai_confidence_score || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${(claim.days_in_ar || 0) > 30 ? 'text-red-600' : 'text-gray-600'}`}>
                      {claim.days_in_ar || 0} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {claim.processing_status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAIProcessClaim(claim.id)}
                          disabled={processing}
                        >
                          <Brain className="w-3 h-3" />
                        </Button>
                      )}
                      {claim.processing_status === 'ready_for_review' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSubmitClaim(claim.id)}
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
          
          {filteredClaims.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No claims found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
