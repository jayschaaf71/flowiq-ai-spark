
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { claimGenerationService } from "@/services/claimGeneration";
import { Brain, FileText, Clock, CheckCircle } from "lucide-react";

interface ClaimGenerationFormData {
  patientId: string;
  providerId: string;
  serviceDate: string;
  clinicalNotes: string;
  diagnosis: string;
  procedureType: string;
  specialty: string;
}

export const ClaimGenerationEngine = () => {
  const [formData, setFormData] = useState<ClaimGenerationFormData>({
    patientId: '',
    providerId: '',
    serviceDate: '',
    clinicalNotes: '',
    diagnosis: '',
    procedureType: '',
    specialty: 'general'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedClaim, setGeneratedClaim] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.clinicalNotes || !formData.serviceDate) {
      toast({
        title: "Missing Information",
        description: "Please provide clinical notes and service date",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const claim = await claimGenerationService.generateClaim({
        patientId: formData.patientId || 'patient-001',
        providerId: formData.providerId || 'provider-001',
        serviceDate: formData.serviceDate,
        clinicalNotes: formData.clinicalNotes,
        diagnosis: formData.diagnosis.split(',').map(d => d.trim()),
        procedures: [formData.procedureType],
        specialty: formData.specialty
      });

      setGeneratedClaim(claim);
      toast({
        title: "Claim Generated Successfully",
        description: `Claim ${claim.claimNumber} created with ${Math.round(claim.confidence * 100)}% confidence`
      });
    } catch (error) {
      console.error('Claim generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate claim. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready_for_submission':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ready_for_review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Claim Generation Engine
          </CardTitle>
          <CardDescription>
            Generate claims automatically from clinical documentation using AI-powered medical coding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Service Date</label>
              <Input
                type="date"
                value={formData.serviceDate}
                onChange={(e) => setFormData({...formData, serviceDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Specialty</label>
              <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Practice</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="chiropractic">Chiropractic</SelectItem>
                  <SelectItem value="orthopedic">Orthopedic</SelectItem>
                  <SelectItem value="med_spa">Med Spa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Procedure Type</label>
            <Input
              placeholder="e.g., consultation, cleaning, adjustment"
              value={formData.procedureType}
              onChange={(e) => setFormData({...formData, procedureType: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Diagnosis (comma-separated)</label>
            <Input
              placeholder="e.g., routine dental prophylaxis, back pain"
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Clinical Notes</label>
            <Textarea
              placeholder="Enter clinical documentation, procedure notes, or physician observations..."
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({...formData, clinicalNotes: e.target.value})}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating Claim..." : "Generate Claim with AI"}
          </Button>
        </CardContent>
      </Card>

      {generatedClaim && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(generatedClaim.status)}
              Generated Claim: {generatedClaim.claimNumber}
            </CardTitle>
            <CardDescription>
              Confidence Score: {Math.round(generatedClaim.confidence * 100)}% | 
              Status: {generatedClaim.status.replace('_', ' ').toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Generated Medical Codes</h4>
                <div className="space-y-2">
                  {generatedClaim.codes.map((code: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-mono font-medium">{code.code}</span>
                        <span className="ml-2 text-sm text-gray-600">{code.description}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{code.codeType}</div>
                        <div className="text-xs text-gray-500">{Math.round(code.confidence * 100)}% confidence</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Total Claim Amount:</span>
                <span className="text-lg font-bold">${generatedClaim.totalAmount.toFixed(2)}</span>
              </div>

              {generatedClaim.validationWarnings.length > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 className="font-medium text-yellow-800 mb-1">Warnings</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {generatedClaim.validationWarnings.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline">
                  Review & Edit
                </Button>
                <Button 
                  disabled={generatedClaim.status !== 'ready_for_submission'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Claim
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
