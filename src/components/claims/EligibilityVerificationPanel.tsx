
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePayerConnections, useEligibilityCheck } from "@/hooks/usePayerIntegration";
import { CheckCircle, XCircle, Shield, Clock, AlertTriangle } from "lucide-react";

interface EligibilityVerificationPanelProps {
  patientId?: string;
  onEligibilityVerified?: (result: any) => void;
}

export const EligibilityVerificationPanel = ({ 
  patientId, 
  onEligibilityVerified 
}: EligibilityVerificationPanelProps) => {
  const [selectedPayerId, setSelectedPayerId] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [procedureCodes, setProcedureCodes] = useState<string>("99213,99214");
  const [lastResult, setLastResult] = useState<any>(null);

  const { data: payers = [] } = usePayerConnections();
  const eligibilityCheck = useEligibilityCheck();

  const handleVerifyEligibility = async () => {
    if (!patientId || !selectedPayerId) return;

    try {
      const result = await eligibilityCheck.mutateAsync({
        patientId,
        payerConnectionId: selectedPayerId,
        serviceDate,
        procedureCodes: procedureCodes.split(',').map(code => code.trim())
      });

      setLastResult(result);
      onEligibilityVerified?.(result);
    } catch (error) {
      console.error('Eligibility verification failed:', error);
    }
  };

  const getEligibilityIcon = (isEligible: boolean) => {
    return isEligible ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600"; 
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Real-Time Eligibility Verification
          </CardTitle>
          <CardDescription>
            Verify patient insurance coverage and benefits before service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payer-select">Insurance Payer</Label>
              <Select value={selectedPayerId} onValueChange={setSelectedPayerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance payer" />
                </SelectTrigger>
                <SelectContent>
                  {payers.map((payer) => (
                    <SelectItem key={payer.id} value={payer.id}>
                      <div className="flex items-center gap-2">
                        <span>{payer.payerName}</span>
                        <Badge variant={payer.isActive ? "default" : "outline"} className="text-xs">
                          {payer.connectionType.toUpperCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service-date">Service Date</Label>
              <Input
                id="service-date"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="procedure-codes">Procedure Codes</Label>
            <Input
              id="procedure-codes"
              placeholder="99213, 99214, 93000"
              value={procedureCodes}
              onChange={(e) => setProcedureCodes(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleVerifyEligibility}
            disabled={!patientId || !selectedPayerId || eligibilityCheck.isPending}
            className="w-full"
          >
            {eligibilityCheck.isPending ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Verifying Eligibility...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Verify Eligibility
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getEligibilityIcon(lastResult.isEligible)}
              Eligibility Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <Badge variant={lastResult.isEligible ? "default" : "destructive"}>
                    {lastResult.isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Coverage Status</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold mb-1 ${getCoverageColor(lastResult.coverageDetails.coveragePercentage)}`}>
                  {lastResult.coverageDetails.coveragePercentage}%
                </div>
                <p className="text-sm text-gray-600">Coverage Percentage</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold mb-1 text-blue-600">
                  ${lastResult.coverageDetails.copayAmount || 'N/A'}
                </div>
                <p className="text-sm text-gray-600">Patient Copay</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Deductible Amount:</span>
                <span>${lastResult.coverageDetails.deductible}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Deductible Met:</span>
                <span>${lastResult.coverageDetails.deductibleMet}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Coverage Period:</span>
                <span>{lastResult.effectiveDate} to {lastResult.terminationDate}</span>
              </div>
            </div>

            {lastResult.authorizationRequired && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Prior Authorization Required</strong> - Some services may require pre-approval
                </AlertDescription>
              </Alert>
            )}

            {lastResult.errors && lastResult.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Eligibility Issues:</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {lastResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
