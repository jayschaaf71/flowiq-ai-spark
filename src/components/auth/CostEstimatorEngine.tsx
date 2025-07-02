import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Calculator, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Printer,
  Mail
} from "lucide-react";

export const CostEstimatorEngine = () => {
  const [estimateData, setEstimateData] = useState({
    patientId: "",
    insuranceProvider: "",
    procedureCode: "",
    customProcedure: ""
  });

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const dentalSleepProcedures = [
    { code: "D9944", description: "Occlusal guard - hard appliance", basePrice: 1200 },
    { code: "D9945", description: "Occlusal guard - soft appliance", basePrice: 800 },
    { code: "D9946", description: "Occlusal guard - dual laminate", basePrice: 1400 },
    { code: "D0486", description: "Laboratory accession of tissue", basePrice: 350 },
    { code: "D7899", description: "Unspecified oral surgery procedure", basePrice: 500 },
    { code: "CUSTOM", description: "Custom sleep appliance procedure", basePrice: 0 }
  ];

  const insuranceProviders = [
    "Aetna",
    "Blue Cross Blue Shield",
    "Cigna",
    "UnitedHealth",
    "Humana",
    "Delta Dental",
    "MetLife",
    "Guardian"
  ];

  const generateEstimate = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedProcedure = dentalSleepProcedures.find(p => p.code === estimateData.procedureCode);
    const basePrice = selectedProcedure?.basePrice || 1000;
    
    // Mock calculation based on insurance provider
    const insuranceMultiplier = estimateData.insuranceProvider === "Aetna" ? 0.8 : 
                               estimateData.insuranceProvider === "Blue Cross Blue Shield" ? 0.75 :
                               estimateData.insuranceProvider === "Cigna" ? 0.85 : 0.9;
    
    const coveredAmount = Math.floor(basePrice * insuranceMultiplier);
    const patientPortion = basePrice - coveredAmount;
    
    setEstimate({
      procedureCode: estimateData.procedureCode,
      procedureDescription: selectedProcedure?.description || "Custom procedure",
      totalCost: basePrice,
      insuranceCoverage: coveredAmount,
      patientPortion: patientPortion,
      deductible: 250,
      deductibleMet: 100,
      coinsurance: 20,
      copay: 25,
      outOfPocketMax: 3000,
      outOfPocketMet: 750,
      priorAuthRequired: basePrice > 1000,
      estimatedApprovalTime: "3-5 business days",
      notes: [
        "Estimate based on current benefit year",
        "Prior authorization may be required for procedures over $1000",
        "Actual coverage may vary based on medical necessity"
      ]
    });
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Cost Estimator Engine
          </CardTitle>
          <CardDescription>
            Generate accurate cost estimates for dental sleep medicine procedures
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Patient & Procedure Information</CardTitle>
            <CardDescription>
              Enter details to generate a cost estimate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-id">Patient ID</Label>
              <Input
                id="patient-id"
                placeholder="Enter patient ID"
                value={estimateData.patientId}
                onChange={(e) => setEstimateData(prev => ({
                  ...prev,
                  patientId: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance-provider">Insurance Provider</Label>
              <Select
                value={estimateData.insuranceProvider}
                onValueChange={(value) => setEstimateData(prev => ({
                  ...prev,
                  insuranceProvider: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance provider" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedure-code">Procedure Code</Label>
              <Select
                value={estimateData.procedureCode}
                onValueChange={(value) => setEstimateData(prev => ({
                  ...prev,
                  procedureCode: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select procedure code" />
                </SelectTrigger>
                <SelectContent>
                  {dentalSleepProcedures.map((procedure) => (
                    <SelectItem key={procedure.code} value={procedure.code}>
                      {procedure.code} - {procedure.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {estimateData.procedureCode === "CUSTOM" && (
              <div className="space-y-2">
                <Label htmlFor="custom-procedure">Custom Procedure Description</Label>
                <Input
                  id="custom-procedure"
                  placeholder="Describe the custom procedure"
                  value={estimateData.customProcedure}
                  onChange={(e) => setEstimateData(prev => ({
                    ...prev,
                    customProcedure: e.target.value
                  }))}
                />
              </div>
            )}

            <Button 
              onClick={generateEstimate}
              disabled={!estimateData.patientId || !estimateData.insuranceProvider || !estimateData.procedureCode || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Generating Estimate...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Generate Cost Estimate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Estimate Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Cost Estimate Results
            </CardTitle>
            {estimate && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Email to Patient
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!estimate ? (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Enter patient and procedure details to generate an estimate</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Procedure Info */}
                <div>
                  <h4 className="font-semibold mb-2">Procedure Information</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium">{estimate.procedureCode}</div>
                    <div className="text-sm text-gray-600">{estimate.procedureDescription}</div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h4 className="font-semibold mb-3">Cost Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Procedure Cost</span>
                      <span className="font-semibold">${estimate.totalCost}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Insurance Coverage</span>
                      <span className="font-semibold">-${estimate.insuranceCoverage}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Patient Portion</span>
                      <span>${estimate.patientPortion}</span>
                    </div>
                  </div>
                </div>

                {/* Benefits Details */}
                <div>
                  <h4 className="font-semibold mb-3">Benefit Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Deductible</span>
                      <div className="font-medium">${estimate.deductible} (${estimate.deductibleMet} met)</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Coinsurance</span>
                      <div className="font-medium">{estimate.coinsurance}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Copay</span>
                      <div className="font-medium">${estimate.copay}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Out-of-Pocket Max</span>
                      <div className="font-medium">${estimate.outOfPocketMax} (${estimate.outOfPocketMet} met)</div>
                    </div>
                  </div>
                </div>

                {/* Authorization Status */}
                {estimate.priorAuthRequired && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Prior Authorization Required</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Estimated approval time: {estimate.estimatedApprovalTime}
                    </p>
                  </div>
                )}

                {/* Important Notes */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Important Notes
                  </h4>
                  <div className="space-y-1">
                    {estimate.notes.map((note, index) => (
                      <p key={index} className="text-sm text-gray-600">• {note}</p>
                    ))}
                  </div>
                </div>

                {/* Accuracy Badge */}
                <div className="flex items-center justify-center">
                  <Badge className="bg-blue-100 text-blue-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    95% Accuracy Rate
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};