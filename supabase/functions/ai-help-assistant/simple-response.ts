// Simple AI response without complex processing for debugging
export function getSimpleResponse(message: string, specialty: string, brandName: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Quick responses for common questions
  if (lowerMessage.includes('schedule') && lowerMessage.includes('appointment')) {
    return `To schedule an appointment in ${brandName}:
1. Navigate to the Schedule iQ section
2. Click "New Appointment" 
3. Select the patient and provider
4. Choose available time slots
5. Save the appointment

The AI scheduling assistant will help optimize timing and avoid conflicts.`;
  }
  
  if (lowerMessage.includes('add') && lowerMessage.includes('patient')) {
    return `To add a new patient in ${brandName}:
1. Go to Patient Management
2. Click "Add New Patient"
3. Fill in the patient details
4. Use voice input for faster data entry
5. Save the patient record

You can also use Intake iQ for voice-enabled patient registration.`;
  }
  
  if (lowerMessage.includes('voice') || lowerMessage.includes('intake')) {
    return `${brandName} offers voice-enabled intake through Intake iQ:
- Patients can speak their responses instead of typing
- AI automatically converts speech to text
- Forms are completed faster and more accurately
- Available on both desktop and mobile devices`;
  }
  
  if (lowerMessage.includes('claims') || lowerMessage.includes('insurance')) {
    return `Claims processing in ${brandName} is handled by Claims iQ:
- Automated claim generation and submission
- AI-powered coding suggestions
- Real-time denial tracking and appeals
- Revenue cycle optimization`;
  }
  
  // Default helpful response
  return `I'm your ${brandName} AI assistant for ${specialty} practice management. I can help you with:

• Patient management and scheduling
• Voice-enabled intake forms (Intake iQ)
• AI-powered appointment scheduling (Schedule iQ) 
• Medical documentation (Scribe iQ)
• Insurance claims processing (Claims iQ)

What specific feature would you like help with?`;
}