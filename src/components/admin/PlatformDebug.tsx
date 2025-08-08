import React from 'react';

export const PlatformDebug = () => {
  console.log('🔧 [PlatformDebug] Component rendering - ULTRA SIMPLE');
  
  // Try to render the most basic possible component
  return (
    <div>
      <h1>DEBUG PAGE WORKING!</h1>
      <p>If you can see this, React is working.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>URL: {window.location.href}</p>
    </div>
  );
}; 