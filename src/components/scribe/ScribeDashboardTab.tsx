
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Mic, 
  Clock, 
  TrendingUp, 
  Brain,
  Smartphone,
  ArrowRight,
  Plus,
  Bell,
  TestTube
} from "lucide-react";
import { ViewTranscriptionDialog } from "./ViewTranscriptionDialog";
import { EdgeFunctionTester } from "./EdgeFunctionTester";
import { ScribeRecentTranscriptions } from "./ScribeRecentTranscriptions";

export const ScribeDashboardTab = () => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTranscription, setSelectedTranscription] = useState(null);
  const [showTesting, setShowTesting] = useState(false);


  const handleNavigateToLive = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'whisper' }));
  };

  const handleNavigateToSOAP = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'soap' }));
  };

  const handleNavigateToSettings = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'settings' }));
  };

  const handleAddReminder = () => {
    // Navigate to RemindIQ page using React Router
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/agents/remind' }));
  };

  // Mock data for recent transcriptions
  const mockTranscriptions = [
    {
      id: 1,
      patientName: "Patient Visit #25",
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      source: "Live Recording",
      content: "Patient complains of persistent headache lasting 3 days. Pain is throbbing, located in temporal region. No visual disturbances. Taking ibuprofen with minimal relief. No fever. Sleep pattern normal. Stress levels elevated due to work.",
      soapNote: {
        subjective: "Patient reports persistent headache for 3 days, throbbing pain in temporal region, no visual disturbances, minimal relief with ibuprofen, no fever, elevated stress due to work.",
        objective: "Patient alert and oriented. Vital signs stable. No obvious distress. Cranial nerves II-XII grossly intact. No neck stiffness.",
        assessment: "Tension headache likely related to stress. Rule out migraine.",
        plan: "Continue ibuprofen as needed. Stress management techniques. Follow up in 1 week if symptoms persist. Return if severe or associated with vision changes."
      },
      status: "SOAP Generated"
    },
    {
      id: 2,
      patientName: "Patient Visit #26", 
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
      source: "Live Recording",
      content: "Follow-up visit for hypertension. Patient reports good compliance with medications. Home blood pressure readings averaging 135/85. No side effects from lisinopril. Walking 30 minutes daily. Diet improved with less sodium.",
      soapNote: {
        subjective: "Follow-up for hypertension. Good medication compliance. Home BP readings average 135/85. No medication side effects. Exercising daily, improved diet.",
        objective: "BP today 138/82. Heart rate 72, regular. Weight stable. No peripheral edema.",
        assessment: "Hypertension, improving but not yet at goal.",
        plan: "Continue current lisinopril dose. Increase walking to 45 minutes daily. Follow up in 6 weeks. Continue home BP monitoring."
      },
      status: "SOAP Generated"
    },
    {
      id: 3,
      patientName: "Patient Visit #27",
      timestamp: new Date(Date.now() - 10800000).toLocaleTimeString(), 
      source: "Live Recording",
      content: "Annual physical exam. Patient feeling well overall. No new concerns. Review of systems negative except for occasional knee stiffness in the morning.",
      soapNote: {
        subjective: "Annual physical, feeling well, no new concerns, occasional morning knee stiffness.",
        objective: "Well-appearing. Vital signs within normal limits. Physical exam unremarkable except mild crepitus in bilateral knees.",
        assessment: "Healthy adult, mild osteoarthritis of knees.",
        plan: "Continue current health maintenance. Consider glucosamine supplement for knee symptoms. Return for routine care in 1 year."
      },
      status: "SOAP Generated"
    }
  ];

  const handleViewTranscription = (transcription) => {
    setSelectedTranscription(transcription);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
          onClick={handleNavigateToSOAP}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              SOAP Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <p className="text-sm text-gray-600">Generated today</p>
            <p className="text-xs text-blue-600 mt-1 opacity-75">Click to view SOAP generation</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-green-300"
          onClick={handleNavigateToLive}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic className="w-4 h-4" />
              Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-sm text-gray-600">Processed today</p>
            <p className="text-xs text-green-600 mt-1 opacity-75">Click to start recording</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-primary/30"
          onClick={handleNavigateToSettings}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Avg. Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2.3s</div>
            <p className="text-sm text-muted-foreground">Per recording</p>
            <p className="text-xs text-primary/70 mt-1">Click to adjust settings</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-orange-300"
          onClick={handleNavigateToSettings}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">98.7%</div>
            <p className="text-sm text-gray-600">Transcription rate</p>
            <p className="text-xs text-orange-600 mt-1 opacity-75">Click to view settings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Start recording or manage your scribe settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleNavigateToLive}
              className="w-full justify-start"
              size="lg"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Live Recording
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
            

            <Button 
              onClick={() => setShowTesting(!showTesting)}
              variant={showTesting ? "default" : "outline"}
              className="w-full justify-start"
              size="lg"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {showTesting ? 'Hide' : 'Show'} Function Testing
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>

            <div className="pt-4 space-y-2 border-t">
              <h4 className="font-medium text-sm">Pilot Program Features</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Real-time Transcription
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  SOAP Generation
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <ScribeRecentTranscriptions />

      {/* Function Testing Panel */}
      {showTesting && (
        <div className="mt-6">
          <EdgeFunctionTester />
        </div>
      )}

      {/* View Dialog */}
      <ViewTranscriptionDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        transcription={selectedTranscription}
      />
    </div>
  );
};
