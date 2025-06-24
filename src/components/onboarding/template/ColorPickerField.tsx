
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  label,
  value,
  onChange
}) => {
  const presetColors = [
    '#16A34A', '#059669', '#34D399', // Greens
    '#3B82F6', '#1D4ED8', '#60A5FA', // Blues
    '#DC2626', '#B91C1C', '#F87171', // Reds
    '#7C3AED', '#6D28D9', '#A78BFA', // Purples
    '#EC4899', '#DB2777', '#F472B6', // Pinks
    '#F59E0B', '#D97706', '#FCD34D', // Yellows
  ];

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 p-1 border rounded cursor-pointer"
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono text-sm"
        />
      </div>
      
      {/* Preset Color Palette */}
      <div className="grid grid-cols-6 gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
              value === color ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-200'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
