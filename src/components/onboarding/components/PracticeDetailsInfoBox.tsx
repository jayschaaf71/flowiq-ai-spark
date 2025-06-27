
import React from 'react';

export const PracticeDetailsInfoBox: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-2">Why do we need this information?</h3>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• <strong>Practice Details:</strong> Personalizes patient communications and branding</li>
        <li>• <strong>Contact Info:</strong> Enables automated reminders and notifications</li>
        <li>• <strong>Business Hours:</strong> Optimizes scheduling and AI agent availability</li>
        <li>• <strong>Team Size:</strong> Configures user management and workflow templates</li>
      </ul>
    </div>
  );
};
