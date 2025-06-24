
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
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

interface Claim {
  id: string;
  patient: string;
  dateOfService: string;
  amount: number;
  status: 'draft' | 'processing' | 'ready' | 'submitted' | 'paid' | 'denied';
  payer: string;
  confidence: number;
  procedures: string[];
}

export const ClaimsQueue = () => {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-2024-001",
      patient: "Sarah Johnson",
      dateOfService: "2024-01-15",
      amount: 350.00,
      status: "ready",
      payer: "Aetna",
      confidence: 96,
      procedures: ["D1110", "D0150"]
    },
    {
      id: "CLM-2024-002",
      patient: "Mike Wilson",
      dateOfService: "2024-01-14",
      amount: 275.50,
      status: "processing",
      payer: "BCBS",
      confidence: 89,
      procedures: ["D2392", "D2140"]
    },
    {
      id: "CLM-2024-003",
      patient: "Emma Davis",
      dateOfService: "2024-01-13",
      amount: 125.00,
      status: "submitted",
      payer: "Cigna",
      confidence: 98,
      procedures: ["D1110"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'processing': return <Brain className="w-4 h-4 text-blue-500" />;
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'submitted': return <Send className="w-4 h-4 text-blue-600" />;
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      processing: "outline",
      ready: "default",
      submitted: "secondary",
      paid: "default",
      denied: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const handleProcessClaim = (claimId: string) => {
    setClaims(prev => prev.map(claim =>
      claim.id === claimId ? { ...claim, status: 'processing' as const } : claim
    ));
    toast({
      title: "Claim Processing Started",
      description: `AI coding analysis initiated for ${claimId}`,
    });
  };

  const handleSubmitClaim = (claimId: string) => {
    setClaims(prev => prev.map(claim =>
      claim.id === claimId ? { ...claim, status: 'submitted' as const } : claim
    ));
    toast({
      title: "Claim Submitted",
      description: `${claimId} has been submitted to the payer`,
    });
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
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
              <Button size="sm">
                <Brain className="w-4 h-4 mr-2" />
                Process All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date of Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Procedures</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>{claim.patient}</TableCell>
                  <TableCell>{claim.dateOfService}</TableCell>
                  <TableCell>${claim.amount.toFixed(2)}</TableCell>
                  <TableCell>{claim.payer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(claim.status)}
                      {getStatusBadge(claim.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={claim.confidence} className="w-16" />
                      <span className="text-sm">{claim.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {claim.procedures.map((code, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {claim.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleProcessClaim(claim.id)}
                        >
                          <Brain className="w-3 h-3" />
                        </Button>
                      )}
                      {claim.status === 'ready' && (
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
        </CardContent>
      </Card>
    </div>
  );
};
