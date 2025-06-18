
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CreateWorkflowDialogProps {
  onCreateWorkflow: (workflow: any) => void;
}

export const CreateWorkflowDialog = ({ onCreateWorkflow }: CreateWorkflowDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("");

  const templates = [
    { id: "blank", name: "Blank Workflow", description: "Start from scratch" },
    { id: "patient-onboarding", name: "Patient Onboarding", description: "Complete patient registration process" },
    { id: "appointment-management", name: "Appointment Management", description: "Full appointment lifecycle" },
    { id: "insurance-verification", name: "Insurance Verification", description: "Automated insurance checking" },
    { id: "follow-up-care", name: "Follow-up Care", description: "Post-appointment patient care" },
    { id: "billing-workflow", name: "Billing & Collections", description: "Invoice and payment processing" }
  ];

  const handleCreate = () => {
    const newWorkflow = {
      id: Date.now(),
      name: name || "New Workflow",
      description: description || "Workflow description",
      status: "draft",
      efficiency: 0,
      lastRun: "Never",
      template: template
    };
    
    onCreateWorkflow(newWorkflow);
    setOpen(false);
    setName("");
    setDescription("");
    setTemplate("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Set up a new automated workflow for your practice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template">Choose Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((tmpl) => (
                  <SelectItem key={tmpl.id} value={tmpl.id}>
                    <div>
                      <div className="font-medium">{tmpl.name}</div>
                      <div className="text-xs text-muted-foreground">{tmpl.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow does"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Workflow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
