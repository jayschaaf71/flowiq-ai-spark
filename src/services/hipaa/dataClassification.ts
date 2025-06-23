
import { PHIDataClassification } from './types';

export class DataClassificationService {
  async classifyData(data: any): Promise<PHIDataClassification> {
    const phiIndicators = [
      'ssn', 'social_security', 'date_of_birth', 'dob', 'phone', 'email',
      'address', 'medical_record', 'patient_id', 'diagnosis', 'medication',
      'treatment', 'insurance', 'emergency_contact'
    ];

    const dataString = JSON.stringify(data).toLowerCase();
    const containsPHI = phiIndicators.some(indicator => 
      dataString.includes(indicator) || Object.keys(data).some(key => 
        key.toLowerCase().includes(indicator)
      )
    );

    const dataTypes: string[] = [];
    if (dataString.includes('medical') || dataString.includes('diagnosis')) dataTypes.push('medical');
    if (dataString.includes('financial') || dataString.includes('insurance')) dataTypes.push('financial');
    if (dataString.includes('demographic') || dataString.includes('address')) dataTypes.push('demographic');

    const sensitivityLevel = this.determineSensitivityLevel(data, containsPHI);

    return {
      containsPHI,
      dataTypes,
      sensitivityLevel,
      requiresEncryption: containsPHI || sensitivityLevel === 'high' || sensitivityLevel === 'critical',
      auditRequired: containsPHI || sensitivityLevel !== 'low'
    };
  }

  private determineSensitivityLevel(data: any, containsPHI: boolean): 'low' | 'medium' | 'high' | 'critical' {
    if (containsPHI) {
      const criticalFields = ['ssn', 'medical_record', 'diagnosis', 'treatment'];
      const hasCritical = criticalFields.some(field => 
        JSON.stringify(data).toLowerCase().includes(field)
      );
      return hasCritical ? 'critical' : 'high';
    }
    return 'medium';
  }
}
