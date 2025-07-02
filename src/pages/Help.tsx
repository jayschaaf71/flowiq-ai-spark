import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIHelpAssistant } from "@/components/help/AIHelpAssistant";
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Documentation Center
                </CardTitle>
                <CardDescription>
                  Comprehensive guides, tutorials, and reference materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Getting Started</h3>
                    <p className="text-sm text-gray-600">Learn the basics of FlowiQ and set up your practice</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">AI Agents Guide</h3>
                    <p className="text-sm text-gray-600">Complete guide to using Intake iQ, Schedule iQ, and other AI features</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Voice Features</h3>
                    <p className="text-sm text-gray-600">How to use voice-enabled forms and AI processing</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Mobile App</h3>
                    <p className="text-sm text-gray-600">Using FlowiQ on mobile devices and tablets</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">EHR Integration</h3>
                    <p className="text-sm text-gray-600">Connecting and working with electronic health records</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Claims Processing</h3>
                    <p className="text-sm text-gray-600">Managing insurance claims and revenue cycle</p>
                  </Card>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Need immediate help?</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    Try the AI Assistant tab above for instant, context-aware help with any FlowiQ feature!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Help;