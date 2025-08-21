import React from 'react';

export function Progress({ value = 0, className = '' }: { value?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full h-3 bg-gray-200 rounded ${className}`}>
      <div className="h-3 bg-green-500 rounded" style={{ width: `${clamped}%` }} />
    </div>
  );
}
