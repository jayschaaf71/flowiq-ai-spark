import React from 'react';

export const SimpleTest: React.FC = () => {
  console.log('🚀 SimpleTest component rendering!');
  
  return (
    <div className="p-8 bg-primary text-primary-foreground min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          🦷 Dental Sleep Medicine Dashboard
        </h1>
        <p className="text-xl mb-6">
          Test component is working! Route is functional.
        </p>
        <div className="bg-white/10 p-4 rounded-lg">
          <p>Current path: {window.location.pathname}</p>
          <p>Component successfully loaded</p>
        </div>
      </div>
    </div>
  );
};