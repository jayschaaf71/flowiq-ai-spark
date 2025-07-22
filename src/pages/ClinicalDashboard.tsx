import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartClinicalNotes } from '@/components/clinical/SmartClinicalNotes';
import { ClinicalDecisionSupport } from '@/components/clinical/ClinicalDecisionSupport';

export const ClinicalDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clinical Documentation & Decision Support</h1>
        <p className="text-muted-foreground">
          AI-powered clinical tools for documentation, decision support, and patient care
        </p>
      </div>

      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Smart Clinical Notes</TabsTrigger>
          <TabsTrigger value="decision-support">Decision Support</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <SmartClinicalNotes />
        </TabsContent>

        <TabsContent value="decision-support">
          <ClinicalDecisionSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
};