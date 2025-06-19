
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSOAPTemplates, useCreateSOAPTemplate } from "@/hooks/useSOAPTemplates";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus } from "lucide-react";

interface SOAPTemplateProps {
  onSelectTemplate: (template: any) => void;
  specialty?: string;
}

export const SOAPTemplateSelector = ({ onSelectTemplate, specialty }: SOAPTemplateProps) => {
  const [open, setOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialty || "");
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    specialty: "",
    is_active: true,
    template_data: {
      subjective: "",
      objective: "",
      assessment: "",
      plan: ""
    }
  });

  const { data: templates = [], isLoading } = useSOAPTemplates(selectedSpecialty);
  const createTemplate = useCreateSOAPTemplate();
  const { toast } = useToast();

  const specialties = [
    "General Practice",
    "Chiropractic", 
    "Dentistry",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics"
  ];

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.specialty) {
      toast({
        title: "Error",
        description: "Please fill in template name and specialty",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTemplate.mutateAsync(newTemplate);
      setOpen(false);
      setNewTemplate({
        name: "",
        specialty: "",
        is_active: true,
        template_data: { subjective: "", objective: "", assessment: "", plan: "" }
      });
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label>Select Specialty</Label>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All specialties</SelectItem>
              {specialties.map((spec) => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create SOAP Template</DialogTitle>
              <DialogDescription>
                Create a reusable template for SOAP notes
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Initial Consultation"
                  />
                </div>
                <div>
                  <Label>Specialty</Label>
                  <Select value={newTemplate.specialty} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, specialty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subjective Template</Label>
                  <Textarea
                    value={newTemplate.template_data.subjective}
                    onChange={(e) => setNewTemplate(prev => ({
                      ...prev,
                      template_data: { ...prev.template_data, subjective: e.target.value }
                    }))}
                    placeholder="Template for subjective section..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Objective Template</Label>
                  <Textarea
                    value={newTemplate.template_data.objective}
                    onChange={(e) => setNewTemplate(prev => ({
                      ...prev,
                      template_data: { ...prev.template_data, objective: e.target.value }
                    }))}
                    placeholder="Template for objective section..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assessment Template</Label>
                  <Textarea
                    value={newTemplate.template_data.assessment}
                    onChange={(e) => setNewTemplate(prev => ({
                      ...prev,
                      template_data: { ...prev.template_data, assessment: e.target.value }
                    }))}
                    placeholder="Template for assessment section..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Plan Template</Label>
                  <Textarea
                    value={newTemplate.template_data.plan}
                    onChange={(e) => setNewTemplate(prev => ({
                      ...prev,
                      template_data: { ...prev.template_data, plan: e.target.value }
                    }))}
                    placeholder="Template for plan section..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} disabled={createTemplate.isPending}>
                  {createTemplate.isPending ? "Creating..." : "Create Template"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? (
          <div className="col-span-full text-center py-4">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="col-span-full text-center py-4 text-gray-500">
            No templates found for selected specialty
          </div>
        ) : (
          templates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => onSelectTemplate(template)}
            >
              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              <div>
                <div className="font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.specialty}</div>
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  );
};
