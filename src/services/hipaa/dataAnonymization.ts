
export class DataAnonymizationService {
  async anonymizeForAI(data: any): Promise<{ anonymizedData: any; keyMap: Map<string, string> }> {
    const keyMap = new Map<string, string>();
    const anonymizedData = { ...data };

    // Replace PHI with tokens
    const phiFields = ['patient_name', 'email', 'phone', 'ssn', 'address', 'emergency_contact'];
    
    phiFields.forEach(field => {
      if (data[field]) {
        const token = `TOKEN_${field.toUpperCase()}_${this.generateSecureToken()}`;
        keyMap.set(token, data[field]);
        anonymizedData[field] = token;
      }
    });

    // Anonymize nested objects
    Object.keys(anonymizedData).forEach(key => {
      if (typeof anonymizedData[key] === 'object' && anonymizedData[key] !== null) {
        const nested = this.anonymizeNestedObject(anonymizedData[key], keyMap);
        anonymizedData[key] = nested;
      }
    });

    return { anonymizedData, keyMap };
  }

  deAnonymizeResponse(response: any, keyMap: Map<string, string>): any {
    let responseStr = JSON.stringify(response);
    keyMap.forEach((originalValue, token) => {
      responseStr = responseStr.replace(new RegExp(token, 'g'), originalValue);
    });
    return JSON.parse(responseStr);
  }

  private generateSecureToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private anonymizeNestedObject(obj: any, keyMap: Map<string, string>): any {
    const anonymized = { ...obj };
    Object.keys(anonymized).forEach(key => {
      if (typeof anonymized[key] === 'string' && this.isPotentialPHI(anonymized[key])) {
        const token = `TOKEN_${key.toUpperCase()}_${this.generateSecureToken()}`;
        keyMap.set(token, anonymized[key]);
        anonymized[key] = token;
      }
    });
    return anonymized;
  }

  private isPotentialPHI(value: string): boolean {
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone
    ];
    return phiPatterns.some(pattern => pattern.test(value));
  }
}
