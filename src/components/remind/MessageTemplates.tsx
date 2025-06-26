import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { TemplateFilters } from "./templates/TemplateFilters";
import { TemplateForm } from "./templates/TemplateForm";
import { TemplateCard } from "./templates/TemplateCard";

interface Template {
  id: number;
  name: string;
  category: string;
  type: "sms" | "email" | "call";
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
}

const defaultTemplates: Template[] = [
  {
    id: 1,
    name: "Appointment Reminder - 24hr",
    category: "appointment",
    type: "sms",
    subject: "",
    content: "Hi {patientName}, this is a reminder that you have an appointment tomorrow at {time} with Dr. {doctorName}. Reply CONFIRM to confirm or RESCHEDULE to reschedule.",
    variables: ["patientName", "time", "doctorName"],
    usageCount: 156
  },
  {
    id: 2,
    name: "Welcome New Patient",
    category: "onboarding",
    type: "email",
    subject: "Welcome to {practiceName}!",
    content: "Dear {patientName},\n\nWelcome to our practice! We're excited to provide you with excellent healthcare. Please complete your intake forms before your first visit on {appointmentDate}.\n\nBest regards,\n{practiceName} Team",
    variables: ["patientName", "practiceName", "appointmentDate"],
    usageCount: 89
  },
  {
    id: 3,
    name: "Follow-up Care Instructions",
    category: "followup",
    type: "sms",
    subject: "",
    content: "Hi {patientName}, please remember to take your medication as prescribed and schedule your follow-up appointment in {timeframe}. Call us at {phoneNumber} if you have questions.",
    variables: ["patientName", "timeframe", "phoneNumber"],
    usageCount: 203
  },
  {
    id: 4,
    name: "Insurance Verification Required",
    category: "insurance",
    type: "email",
    subject: "Insurance Verification Needed - {patientName}",
    content: "Dear {patientName},\n\nWe need to verify your insurance information before your upcoming appointment. Please call our office at {phoneNumber} or visit our patient portal to update your details.\n\nThank you,\n{practiceName}",
    variables: ["patientName", "phoneNumber", "practiceName"],
    usageCount: 67
  }
];

export const MessageTemplates = () => {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [editingTemplate, setEditingTemplate, ] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    message: '',
    category: 'custom'
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) return;

    const template: Template = {
      id: Date.now(),
      name: newTemplate.name,
      category: newTemplate.category,
      type: "sms",
      subject: "",
      content: newTemplate.message,
      variables: [],
      usageCount: 0
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', message: '', category: 'custom' });
    setIsCreating(false);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;

    setTemplates(templates.map(t =>
      t.id === editingTemplate.id
        ? { ...t, content: editingTemplate.content }
        : t
    ));
    setEditingTemplate(null);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <TemplateFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onCreateNew={() => setIsCreating(true)}
      />

      <div className="space-y-4">
        {isCreating && (
          <TemplateForm
            formData={newTemplate}
            onChange={setNewTemplate}
            onSubmit={handleCreateTemplate}
            onCancel={() => setIsCreating(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              editingTemplate={editingTemplate}
              onEdit={setEditingTemplate}
              onUpdate={handleUpdateTemplate}
              onCancelEdit={() => setEditingTemplate(null)}
              onEditingChange={setEditingTemplate}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No templates found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
