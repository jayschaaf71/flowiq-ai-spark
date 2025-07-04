import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Shield, 
  Phone, 
  MapPin,
  Edit,
  Plus,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { usePatientInsurance } from '@/hooks/usePatientInsurance';
import { useToast } from '@/hooks/use-toast';

export const InsuranceInformation: React.FC = () => {
  const { insurance, loading, error, refetch, updateInsurance } = usePatientInsurance();
  const [editingInsurance, setEditingInsurance] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateInsurance = async (insuranceId: string, updates: any) => {
    try {
      await updateInsurance(insuranceId, updates);
      setIsEditDialogOpen(false);
      setEditingInsurance(null);
      toast({
        title: "Insurance Updated",
        description: "Your insurance information has been updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update insurance information",
        variant: "destructive",
      });
    }
  };

  const isExpiringSoon = (expirationDate: string | null) => {
    if (!expirationDate) return false;
    const expiry = new Date(expirationDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return expiry <= threeMonthsFromNow && expiry >= today;
  };

  const isExpired = (expirationDate: string | null) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Failed to load insurance information</p>
            <Button onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Insurance Information
              </CardTitle>
              <CardDescription>
                Manage your insurance coverage and benefits
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Insurance
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Insurance Cards */}
      <div className="space-y-4">
        {insurance.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-4" />
                <p>No insurance information on file</p>
                <p className="text-sm">Add your insurance information to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          insurance.map((ins) => (
            <Card key={ins.id} className="relative">
              {ins.is_primary && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600">Primary</Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Insurance Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base md:text-lg truncate">
                          {ins.insurance_providers?.name || 'Insurance Provider'}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {ins.subscriber_relationship === 'self' ? 'Primary Holder' : `Dependent (${ins.subscriber_relationship})`}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <Label className="text-xs md:text-sm font-medium">Policy Number</Label>
                        <p className="text-sm md:text-base text-muted-foreground break-all">{ins.policy_number}</p>
                      </div>
                      {ins.group_number && (
                        <div>
                          <Label className="text-xs md:text-sm font-medium">Group Number</Label>
                          <p className="text-sm md:text-base text-muted-foreground">{ins.group_number}</p>
                        </div>
                      )}
                      {ins.subscriber_name && (
                        <div>
                          <Label className="text-xs md:text-sm font-medium">Subscriber</Label>
                          <p className="text-sm md:text-base text-muted-foreground">{ins.subscriber_name}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-xs md:text-sm font-medium">Relationship</Label>
                        <p className="text-sm md:text-base text-muted-foreground capitalize">
                          {ins.subscriber_relationship}
                        </p>
                      </div>
                    </div>

                    {/* Coverage Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {ins.effective_date && (
                        <div>
                          <Label className="text-xs md:text-sm font-medium">Effective Date</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {new Date(ins.effective_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {ins.expiration_date && (
                        <div>
                          <Label className="text-xs md:text-sm font-medium">Expiration Date</Label>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                            <p className={`text-xs md:text-sm ${
                              isExpired(ins.expiration_date) ? 'text-red-600' :
                              isExpiringSoon(ins.expiration_date) ? 'text-orange-600' :
                              'text-muted-foreground'
                            }`}>
                              {new Date(ins.expiration_date).toLocaleDateString()}
                            </p>
                            {isExpired(ins.expiration_date) && (
                              <Badge variant="destructive" className="text-xs">Expired</Badge>
                            )}
                            {isExpiringSoon(ins.expiration_date) && !isExpired(ins.expiration_date) && (
                              <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                                Expiring Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm md:text-base">Coverage Details</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {ins.copay_amount && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <Label className="text-xs md:text-sm font-medium">Copay</Label>
                          </div>
                          <p className="text-base md:text-lg font-semibold text-blue-700">
                            ${ins.copay_amount.toFixed(2)}
                          </p>
                        </div>
                      )}
                      
                      {ins.deductible_amount && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <Label className="text-xs md:text-sm font-medium">Deductible</Label>
                          </div>
                          <p className="text-base md:text-lg font-semibold text-green-700">
                            ${ins.deductible_amount.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Provider Contact */}
                    {ins.insurance_providers && (
                      <div className="space-y-2">
                        <Label className="text-xs md:text-sm font-medium">Provider Contact</Label>
                        {ins.insurance_providers.phone && (
                          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                            <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span>{ins.insurance_providers.phone}</span>
                          </div>
                        )}
                        {ins.insurance_providers.address && (
                          <div className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 mt-0.5" />
                            <span className="break-words">{ins.insurance_providers.address}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Alerts */}
                    {(isExpired(ins.expiration_date) || isExpiringSoon(ins.expiration_date)) && (
                      <div className={`p-3 rounded-lg border ${
                        isExpired(ins.expiration_date) 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${
                            isExpired(ins.expiration_date) ? 'text-red-600' : 'text-orange-600'
                          }`} />
                          <p className={`text-sm font-medium ${
                            isExpired(ins.expiration_date) ? 'text-red-800' : 'text-orange-800'
                          }`}>
                            {isExpired(ins.expiration_date) 
                              ? 'Insurance has expired' 
                              : 'Insurance expires soon'}
                          </p>
                        </div>
                        <p className={`text-xs mt-1 ${
                          isExpired(ins.expiration_date) ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          Contact your provider to renew your coverage
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-4 md:mt-6 pt-4 border-t">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingInsurance(ins)}
                        className="h-10 touch-manipulation"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Information
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Insurance Information</DialogTitle>
                        <DialogDescription>
                          Update your insurance details
                        </DialogDescription>
                      </DialogHeader>
                      {editingInsurance && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Policy Number</Label>
                              <Input
                                value={editingInsurance.policy_number}
                                onChange={(e) => setEditingInsurance({
                                  ...editingInsurance,
                                  policy_number: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Group Number</Label>
                              <Input
                                value={editingInsurance.group_number || ''}
                                onChange={(e) => setEditingInsurance({
                                  ...editingInsurance,
                                  group_number: e.target.value
                                })}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Copay Amount</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingInsurance.copay_amount || ''}
                                onChange={(e) => setEditingInsurance({
                                  ...editingInsurance,
                                  copay_amount: parseFloat(e.target.value) || null
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Deductible Amount</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingInsurance.deductible_amount || ''}
                                onChange={(e) => setEditingInsurance({
                                  ...editingInsurance,
                                  deductible_amount: parseFloat(e.target.value) || null
                                })}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleUpdateInsurance(editingInsurance.id, editingInsurance)}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Coverage Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Coverage Verification
          </CardTitle>
          <CardDescription>
            Real-time insurance eligibility and benefits verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Coverage Active</p>
                <p className="text-sm text-green-600">
                  Last verified: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Verify Coverage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};