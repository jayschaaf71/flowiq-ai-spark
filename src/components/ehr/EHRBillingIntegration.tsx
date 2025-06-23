
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Send,
  Eye
} from "lucide-react";

interface BillingRecord {
  id: string;
  patientName: string;
  serviceDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  insuranceStatus: 'pending' | 'approved' | 'denied';
  procedureCodes: string[];
}

export const EHRBillingIntegration = () => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([
    {
      id: "INV-001",
      patientName: "John Smith",
      serviceDate: "2024-01-15",
      amount: 350.00,
      status: "sent",
      insuranceStatus: "approved",
      procedureCodes: ["D0150", "D1110"]
    },
    {
      id: "INV-002",
      patientName: "Sarah Johnson",
      serviceDate: "2024-01-14",
      amount: 125.00,
      status: "paid",
      insuranceStatus: "approved",
      procedureCodes: ["D0120"]
    },
    {
      id: "INV-003",
      patientName: "Mike Wilson",
      serviceDate: "2024-01-13",
      amount: 450.00,
      status: "overdue",
      insuranceStatus: "pending",
      procedureCodes: ["D2140", "D2391"]
    }
  ]);

  const { toast } = useToast();

  const billingStats = [
    { label: "Outstanding Revenue", value: "$12,450", icon: DollarSign, trend: "+5.2%" },
    { label: "Claims Processed", value: "47", icon: Receipt, trend: "+12%" },
    { label: "Collection Rate", value: "94.5%", icon: TrendingUp, trend: "+2.1%" },
    { label: "Pending Claims", value: "8", icon: Clock, trend: "-15%" }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      sent: "outline", 
      paid: "default",
      overdue: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getInsuranceStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      denied: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const handleSendBill = (billId: string) => {
    setBillingRecords(prev => prev.map(record =>
      record.id === billId ? { ...record, status: 'sent' as const } : record
    ));
    toast({
      title: "Bill Sent",
      description: `Invoice ${billId} has been sent to the patient.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            EHR Billing Integration
          </h3>
          <p className="text-gray-600">
            Seamless billing integration with insurance processing and patient invoicing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Receipt className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                {stat.trend} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Billing Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Billing Activity</CardTitle>
          <CardDescription>
            Latest billing records and insurance claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Procedures</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.serviceDate}</TableCell>
                  <TableCell>${record.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{getInsuranceStatusBadge(record.insuranceStatus)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {record.procedureCodes.map((code, index) => (
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
                      {record.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSendBill(record.id)}
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

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Insurance Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Eligibility Verification</p>
                <p className="text-sm text-gray-500">Real-time insurance verification</p>
              </div>
              <Badge variant="default">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Claims Processing</p>
                <p className="text-sm text-gray-500">Automated claim submissions</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Payment Posting</p>
                <p className="text-sm text-gray-500">Automatic payment reconciliation</p>
              </div>
              <Badge variant="secondary">Pending Setup</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="font-medium text-red-800">Overdue Payments</p>
              </div>
              <p className="text-sm text-red-700">3 invoices are past due. Follow up required.</p>
              <Button size="sm" variant="outline" className="mt-2">
                View Details
              </Button>
            </div>
            
            <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <p className="font-medium text-yellow-800">Pending Claims</p>
              </div>
              <p className="text-sm text-yellow-700">8 claims awaiting insurance response.</p>
              <Button size="sm" variant="outline" className="mt-2">
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
