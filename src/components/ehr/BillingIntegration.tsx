
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Plus,
  Calculator
} from "lucide-react";

interface BillingCode {
  id: string;
  code: string;
  description: string;
  fee: number;
  codeType: "CPT" | "ICD-10" | "HCPCS";
}

interface AppointmentBilling {
  appointmentId: string;
  patientName: string;
  date: string;
  procedures: BillingCode[];
  totalAmount: number;
  status: "draft" | "submitted" | "paid";
}

export const BillingIntegration = () => {
  const [selectedCodes, setSelectedCodes] = useState<BillingCode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock billing codes - replace with actual API calls
  const billingCodes: BillingCode[] = [
    {
      id: "1",
      code: "99213",
      description: "Office visit, established patient, moderate complexity",
      fee: 150.00,
      codeType: "CPT"
    },
    {
      id: "2",
      code: "99214",
      description: "Office visit, established patient, high complexity",
      fee: 200.00,
      codeType: "CPT"
    },
    {
      id: "3",
      code: "M79.3",
      description: "Panniculitis, unspecified",
      fee: 0,
      codeType: "ICD-10"
    }
  ];

  // Mock appointment billing data
  const appointmentBillings: AppointmentBilling[] = [
    {
      appointmentId: "1",
      patientName: "Sarah Johnson",
      date: "2024-01-15",
      procedures: [billingCodes[0]],
      totalAmount: 150.00,
      status: "submitted"
    },
    {
      appointmentId: "2",
      patientName: "Mike Chen",
      date: "2024-01-14",
      procedures: [billingCodes[1]],
      totalAmount: 200.00,
      status: "paid"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-yellow-100 text-yellow-700";
      case "submitted": return "bg-blue-100 text-blue-700";
      case "paid": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Clock className="h-4 w-4" />;
      case "submitted": return <FileText className="h-4 w-4" />;
      case "paid": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const addBillingCode = (code: BillingCode) => {
    if (!selectedCodes.find(c => c.id === code.id)) {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const removeBillingCode = (codeId: string) => {
    setSelectedCodes(selectedCodes.filter(c => c.id !== codeId));
  };

  const filteredCodes = billingCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = selectedCodes.reduce((sum, code) => sum + code.fee, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Billing Integration</h3>
        <p className="text-sm text-muted-foreground">
          Connect appointments to billing codes and manage claims
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Code Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Procedure Coding
            </CardTitle>
            <CardDescription>
              Select billing codes for the current appointment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Search Billing Codes</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by code or description..."
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredCodes.map((code) => (
                <div key={code.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{code.codeType}</Badge>
                      <span className="font-mono font-medium">{code.code}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{code.description}</p>
                    {code.fee > 0 && (
                      <p className="text-sm font-medium">${code.fee.toFixed(2)}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addBillingCode(code)}
                    disabled={selectedCodes.some(c => c.id === code.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {selectedCodes.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">Selected Codes</h4>
                {selectedCodes.map((code) => (
                  <div key={code.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                      <span className="font-mono font-medium">{code.code}</span>
                      {code.fee > 0 && (
                        <span className="ml-2 text-sm">${code.fee.toFixed(2)}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeBillingCode(code.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <p className="font-medium">Total: ${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Billing
            </CardTitle>
            <CardDescription>
              Recent appointment billing and claims status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentBillings.map((billing) => (
                <div key={billing.appointmentId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{billing.patientName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(billing.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(billing.status)}>
                      {getStatusIcon(billing.status)}
                      <span className="ml-1">{billing.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    {billing.procedures.map((proc, index) => (
                      <div key={index} className="text-sm flex justify-between">
                        <span>{proc.code} - {proc.description}</span>
                        <span>${proc.fee.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 mt-2 border-t flex justify-between font-medium">
                    <span>Total</span>
                    <span>${billing.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common billing management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm">Generate Claim</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">Payment Entry</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calculator className="h-5 w-5" />
              <span className="text-sm">Fee Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Verify Insurance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
