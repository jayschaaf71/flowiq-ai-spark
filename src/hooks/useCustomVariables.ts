import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface CustomVariable {
  id: string;
  key: string;
  label: string;
  description?: string;
  type: 'text' | 'select' | 'number' | 'date';
  default_value?: string;
  options?: string[];
  category: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export const useCustomVariables = () => {
  const { toast } = useToast();
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVariables = async () => {
    try {
      setLoading(true);
      // Mock custom variables
      const mockVariables: CustomVariable[] = [
        {
          id: '1',
          key: 'practice_name',
          label: 'Practice Name',
          description: 'Name of the medical practice',
          type: 'text',
          default_value: 'Healthcare Practice',
          category: 'practice',
          is_system: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setVariables(mockVariables);
    } catch (error) {
      console.error('Error loading custom variables:', error);
    } finally {
      setLoading(false);
    }
  };

  const createVariable = async (variable: Omit<CustomVariable, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newVariable: CustomVariable = {
        ...variable,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setVariables(prev => [...prev, newVariable]);
      return newVariable;
    } catch (error) {
      console.error('Error creating custom variable:', error);
      return null;
    }
  };

  useEffect(() => {
    loadVariables();
  }, []);

  return {
    variables,
    loading,
    createVariable,
    refetch: loadVariables
  };
};