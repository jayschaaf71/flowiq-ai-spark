
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2 } from "lucide-react";
import { priorAuthService } from "@/services/priorAuthorization";

interface PriorAuthRequestFormProps {
  onSuccess?: () => void;
}

export const PriorAuthRequestForm = ({ onSuccess }: PriorAuthRequestFormProps) => {
  const [formData, setFormData] = useState({
    patientId: '',
    providerId: '',
    insuranceProviderId: '',
    serviceDate: '',
    procedureCodes: '',
    diagnosisCodes: '',
    clinicalJustification: '',
    urgency: 'routine' as 'routine' | 'urgent' | 'emergent'
  });
  
  const [loading, setLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const request = {
        ...formData,
        procedureCodes: formData.procedureCodes.split(',').map(code => code.trim()),
        diagnosisCodes: formData.diagnosisCodes.split(',').map(code => code.trim())
      };

      const authRequest = await priorAuthService.generateAuthRequest(request);
      
      toast({
        title: "Authorization Request Created",
        description: `Request ${authRequest.id} has been generated with ${Math.round(authRequest.confidence * 100)}% confidence`,
      });

      setAiRecommendation(authRequest.aiRecommendation || null);
      onSuccess?.();
      
    } catch (error) {
      console.error('Error creating auth request:', error);
      toast({
        title: "Error Creating Request",
        description: "Failed to create prior authorization request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientId">Patient ID</Label>
            <Input
              id="patientId"
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              placeholder="Enter patient ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="providerId">Provider ID</Label>
            <Input
              id="providerId"
              value={formData.providerId}
              onChange={(e) => handleInputChange('providerId', e.target.value)}
              placeholder="Enter provider ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="insuranceProviderId">Insurance Provider</Label>
            <Select value={formData.insuranceProviderId} onValueChange={(value) => handleInputChange('insuranceProviderId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select insurance provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                <SelectItem value="aetna">Aetna</SelectItem>
                <SelectItem value="cigna">Cigna</SelectItem>
                <SelectItem value="united">United Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="serviceDate">Service Date</Label>
            <Input
              id="serviceDate"
              type="date"
              value={formData.serviceDate}
              onChange={(e) => handleInputChange('serviceDate', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="procedureCodes">Procedure Codes</Label>
            <Input
              id="procedureCodes"
              value={formData.procedureCodes}
              onChange={(e) => handleInputChange('procedureCodes', e.target.value)}
              placeholder="Enter codes separated by commas"
              required
            />
          </div>

          <div>
            <Label htmlFor="diagnosisCodes">Diagnosis Codes</Label>
            <Input
              id="diagnosisCodes"
              value={formData.diagnosisCodes}
              onChange={(e) => handleInputChange('diagnosisCodes', e.target.value)}
              placeholder="Enter codes separated by commas"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select value={formData.urgency} onValueChange={(value: any) => handleInputChange('urgency', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="emergent">Emergent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="clinicalJustification">Clinical Justification</Label>
          <Textarea
            id="clinicalJustification"
            value={formData.clinicalJustification}
            onChange={(e) => handleInputChange('clinicalJustification', e.target.value)}
            placeholder="Provide detailed clinical justification for the procedure"
            rows={4}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Request...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Generate AI-Assisted Request
            </>
          )}
        </Button>
      </form>

      {aiRecommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Recommendation
            </CardTitle>
            <CardDescription>
              AI analysis of your prior authorization request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">{aiRecommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
