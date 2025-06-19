
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useInsuranceProviders, usePatientInsurance, useCreatePatientInsurance } from "@/hooks/useInsurance";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Plus, Phone, Globe } from "lucide-react";
import { format } from "date-fns";

interface InsuranceManagementProps {
  patientId: string;
}

export const InsuranceManagement = ({ patientId }: InsuranceManagementProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    insurance_provider_id: "",
    policy_number: "",
    group_number: "",
    subscriber_name: "",
    subscriber_relationship: "self",
    effective_date: "",
    expiration_date: "",
    is_primary: false,
    copay_amount: "",
    deductible_amount: "",
  });

  const { data: providers = [] } = useInsuranceProviders();
  const { data: patientInsurance = [], refetch } = usePatientInsurance(patientId);
  const createInsurance = useCreatePatientInsurance();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.insurance_provider_id || !formData.policy_number) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createInsurance.mutateAsync({
        patient_id: patientId,
        insurance_provider_id: formData.insurance_provider_id,
        policy_number: formData.policy_number,
        group_number: formData.group_number || null,
        subscriber_name: formData.subscriber_name || null,
        subscriber_relationship: formData.subscriber_relationship || null,
        effective_date: formData.effective_date || null,
        expiration_date: formData.expiration_date || null,
        is_primary: formData.is_primary,
        copay_amount: formData.copay_amount ? parseFloat(formData.copay_amount) : null,
        deductible_amount: formData.deductible_amount ? parseFloat(formData.deductible_amount) : null,
        is_active: true,
      });

      toast({
        title: "Success",
        description: "Insurance information added successfully",
      });

      setOpen(false);
      setFormData({
        insurance_provider_id: "",
        policy_number: "",
        group_number: "",
        subscriber_name: "",
        subscriber_relationship: "self",
        effective_date: "",
        expiration_date: "",
        is_primary: false,
        copay_amount: "",
        deductible_amount: "",
      });
      refetch();
    } catch (error) {
      console.error('Error adding insurance:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Insurance Information</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Insurance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Insurance Coverage</DialogTitle>
              <DialogDescription>
                Add insurance information for this patient
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Insurance Provider *</Label>
                  <Select value={formData.insurance_provider_id} onValueChange={(value) => setFormData(prev => ({ ...prev, insurance_provider_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Policy Number *</Label>
                  <Input
                    value={formData.policy_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, policy_number: e.target.value }))}
                    placeholder="Policy number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Group Number</Label>
                  <Input
                    value={formData.group_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, group_number: e.target.value }))}
                    placeholder="Group number"
                  />
                </div>

                <div>
                  <Label>Subscriber Relationship</Label>
                  <Select value={formData.subscriber_relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, subscriber_relationship: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Effective Date</Label>
                  <Input
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, effective_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Expiration Date</Label>
                  <Input
                    type="date"
                    value={formData.expiration_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Copay Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.copay_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, copay_amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Deductible Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.deductible_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, deductible_amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createInsurance.isPending}>
                  {createInsurance.isPending ? "Adding..." : "Add Insurance"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {patientInsurance.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insurance Information</h3>
            <p className="text-gray-500 mb-4">Add insurance coverage for this patient</p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Insurance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {patientInsurance.map((insurance) => (
            <Card key={insurance.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {insurance.insurance_providers?.name}
                    {insurance.is_primary && (
                      <Badge variant="default">Primary</Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Policy #:</span>
                    <div className="font-medium">{insurance.policy_number}</div>
                  </div>
                  {insurance.group_number && (
                    <div>
                      <span className="text-gray-500">Group #:</span>
                      <div className="font-medium">{insurance.group_number}</div>
                    </div>
                  )}
                  {insurance.subscriber_relationship && (
                    <div>
                      <span className="text-gray-500">Relationship:</span>
                      <div className="font-medium capitalize">{insurance.subscriber_relationship}</div>
                    </div>
                  )}
                  {insurance.copay_amount && (
                    <div>
                      <span className="text-gray-500">Copay:</span>
                      <div className="font-medium">${insurance.copay_amount}</div>
                    </div>
                  )}
                </div>

                {(insurance.effective_date || insurance.expiration_date) && (
                  <div className="flex gap-4 text-sm">
                    {insurance.effective_date && (
                      <div>
                        <span className="text-gray-500">Effective:</span>
                        <span className="ml-1">{format(new Date(insurance.effective_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {insurance.expiration_date && (
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <span className="ml-1">{format(new Date(insurance.expiration_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                )}

                {insurance.insurance_providers && (
                  <div className="flex gap-4 text-sm text-gray-600">
                    {insurance.insurance_providers.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {insurance.insurance_providers.phone}
                      </div>
                    )}
                    {insurance.insurance_providers.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <a href={insurance.insurance_providers.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
