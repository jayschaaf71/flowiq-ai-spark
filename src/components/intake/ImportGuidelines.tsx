
import React from 'react';

export const ImportGuidelines: React.FC = () => {
  return (
    <div className="pt-4 border-t">
      <h4 className="font-medium mb-2">Import Guidelines</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Only JSON files exported from this system are supported</li>
        <li>• Imported templates will be assigned new IDs to prevent conflicts</li>
        <li>• Built-in templates cannot be overwritten</li>
        <li>• Large files may take a moment to process</li>
      </ul>
    </div>
  );
};
