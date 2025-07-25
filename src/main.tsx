
console.log('🚀 [DIAGNOSTIC] main.tsx - Starting application initialization');

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🚀 [DIAGNOSTIC] main.tsx - Imports loaded successfully');

// Add global error handling
window.onerror = (message, source, lineno, colno, error) => {
  console.error('🚨 [DIAGNOSTIC] Global error caught:', { message, source, lineno, colno, error });
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 [DIAGNOSTIC] Unhandled promise rejection:', event.reason);
});

try {
  console.log('🚀 [DIAGNOSTIC] main.tsx - Attempting to render React app');
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('🚨 [DIAGNOSTIC] main.tsx - Root element not found!');
    throw new Error('Root element not found');
  }
  
  console.log('🚀 [DIAGNOSTIC] main.tsx - Root element found, creating React root');
  const root = createRoot(rootElement);
  
  console.log('🚀 [DIAGNOSTIC] main.tsx - React root created, rendering App component');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('✅ [DIAGNOSTIC] main.tsx - App rendering initiated successfully');
} catch (error) {
  console.error('🚨 [DIAGNOSTIC] main.tsx - Failed to initialize app:', error);
}
