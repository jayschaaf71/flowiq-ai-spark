
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Variable } from 'lucide-react';
import { VariableCard } from './VariableCard';
import { CustomVariable } from '../types/variableTypes';

interface VariablesByCategoryProps {
  variablesByCategory: Record<string, CustomVariable[]>;
  onEditVariable: (variable: CustomVariable) => void;
  onDeleteVariable: (id: string) => void;
}

export const VariablesByCategory: React.FC<VariablesByCategoryProps> = ({
  variablesByCategory,
  onEditVariable,
  onDeleteVariable
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(variablesByCategory).map(([category, categoryVariables]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Variable className="w-5 h-5" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryVariables.map((variable) => (
                <VariableCard
                  key={variable.id}
                  variable={variable}
                  onEdit={onEditVariable}
                  onDelete={onDeleteVariable}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
