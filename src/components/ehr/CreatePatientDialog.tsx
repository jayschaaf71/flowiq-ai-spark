import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<'patients'>;

interface CreatePatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreated: (patient: Patient) => void;
  initialData?: Partial<Patient>;
}

export const CreatePatientDialog = ({ 
  open, 
  onOpenChange, 
  onPatientCreated, 
  initialData 
}: CreatePatientDialogProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [userTenantId, setUserTenantId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    date_of_birth: initialData?.date_of_birth || "",
    gender: initialData?.gender || "",
  });

  // Get user's tenant ID when component mounts
  useEffect(() => {
    const getCurrentUserTenant = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user);
        if (!user) {
          console.log('No authenticated user found');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('current_tenant_id, role')
          .eq('id', user.id)
          .single();

        console.log('User profile:', profile, 'Error:', profileError);

        if (profile?.current_tenant_id) {
          setUserTenantId(profile.current_tenant_id);
          console.log('Set tenant ID:', profile.current_tenant_id);
        }
      } catch (error) {
        console.error('Error getting user tenant:', error);
      }
    };

    if (open) {
      getCurrentUserTenant();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter at least first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (!userTenantId) {
      toast({
        title: "Access Error",
        description: "Unable to determine your organization. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Get current specialty from user-specific storage for HIPAA compliance
      const { data: { user } } = await supabase.auth.getUser();
      const currentSpecialty = localStorage.getItem(`currentSpecialty_${user?.id}`) || 'dental-sleep';
      
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender || null,
          patient_number: `PAT-${Date.now()}`, // Generate a unique patient number
          tenant_id: userTenantId, // Add the tenant_id to satisfy RLS policy
          specialty: currentSpecialty, // Add specialty to match the filter in usePatients
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Patient Created",
        description: `${data.first_name} ${data.last_name} has been added successfully.`,
      });

      onPatientCreated(data);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
          <DialogDescription>
            Add a new patient to the system
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john.doe@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !formData.first_name.trim() || !formData.last_name.trim()}
              className="flex-1"
            >
              {isCreating ? "Creating..." : "Create Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};