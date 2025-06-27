
import React from 'react';
import { Zap } from 'lucide-react';
import { AgentType } from '../config/agentTypes';

interface SelectedAgentsSummaryProps {
  enabledAgents: AgentType[];
}

export const SelectedAgentsSummary: React.FC<SelectedAgentsSummaryProps> = ({
  enabledAgents
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-yellow-900">Selected Agents Summary</h4>
          <p className="text-sm text-yellow-800 mb-2">
            You've selected {enabledAgents.length} agent{enabledAgents.length !== 1 ? 's' : ''} that will:
          </p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Reduce administrative workload by up to 60%</li>
            <li>• Improve patient satisfaction with instant responses</li>
            <li>• Increase appointment booking rates</li>
            <li>• Ensure consistent follow-up care</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
