
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { denialManagementService, DenialAnalysis, AutoCorrection } from "@/services/denialManagement";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { DenialMetricsCards } from "./denial/DenialMetricsCards";
import { DenialQueue } from "./denial/DenialQueue";
import { DenialAnalyticsTab } from "./denial/DenialAnalyticsTab";
import { DenialPatternsTab } from "./denial/DenialPatternsTab";
import { DenialAnalysisModal } from "./denial/DenialAnalysisModal";

interface DenialAnalyticsData {
  totalDenials: number;
  totalDeniedAmount?: number;
  autoCorrectible?: number;
  autoCorrectRate?: number;
  denialRate?: number;
  topReasons?: Array<{ reason: string; count: number }>;
  denialsByReason?: Array<{ reason: string; count: number }>;
  trends?: Array<{ month: string; count: number; amount?: number }>;
}

export const EnhancedDenialManagement = () => {
  const [denialAnalytics, setDenialAnalytics] = useState<DenialAnalyticsData | null>(null);
  const [selectedDenial, setSelectedDenial] = useState<DenialAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadDenialData = useCallback(async () => {
    try {
      const dateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      };
      
      const analytics = await denialManagementService.getDenialAnalytics(dateRange);
      setDenialAnalytics(analytics);
    } catch (error) {
      console.error('Error loading denial data:', error);
      toast({
        title: "Error Loading Data",
        description: "Unable to load denial analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDenialData();
  }, [loadDenialData]);


  const handleAutoCorrect = async (claimId: string, corrections: AutoCorrection[]) => {
    setIsProcessing(true);
    try {
      const success = await denialManagementService.applyAutoCorrections(claimId, corrections);
      
      if (success) {
        toast({
          title: "Auto-Correction Applied",
          description: `${corrections.length} corrections applied to claim ${claimId}`,
        });
        loadDenialData();
      } else {
        throw new Error('Auto-correction failed');
      }
    } catch (error) {
      toast({
        title: "Auto-Correction Failed",
        description: "Unable to apply corrections. Please try manual review.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeDenial = async (claimId: string) => {
    try {
      const mockDenialReasons = ['CO-97', 'CO-16'];
      const analysis = await denialManagementService.analyzeDenial(claimId, mockDenialReasons);
      setSelectedDenial(analysis);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze denial",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading denial analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Enhanced Denial Management
          </h3>
          <p className="text-gray-600">
            AI-powered denial analysis with automated correction workflows
          </p>
        </div>
        <Button variant="outline" onClick={loadDenialData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <DenialMetricsCards denialAnalytics={denialAnalytics} />

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Denial Queue</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <DenialQueue 
            isProcessing={isProcessing}
            onAutoCorrect={handleAutoCorrect}
            onAnalyzeDenial={analyzeDenial}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <DenialAnalyticsTab denialAnalytics={denialAnalytics} />
        </TabsContent>

        <TabsContent value="patterns">
          <DenialPatternsTab />
        </TabsContent>
      </Tabs>

      <DenialAnalysisModal selectedDenial={selectedDenial} />
    </div>
  );
};
