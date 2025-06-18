
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export const WorkflowOrchestrationHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Workflow Orchestration</h3>
      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
        <Settings className="w-4 h-4 mr-2" />
        Configure
      </Button>
    </div>
  );
};
