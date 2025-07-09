import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIHelpAssistant } from "@/components/help/AIHelpAssistant";
import { DocumentationGuides } from "@/components/help/DocumentationGuides";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, BookOpen, Bot, MessageCircle } from "lucide-react";

const Help = () => {
  return (
    <>
      <PageHeader 
        title="Help & Support"
        subtitle="Get instant AI-powered help and documentation for FlowIQ"
      />
      
      <div className="space-y-6">
        <Tabs defaultValue="ai-assistant" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-assistant" className="mt-6">
            <AIHelpAssistant />
          </TabsContent>

          <TabsContent value="documentation" className="mt-6">
            <DocumentationGuides />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Help;