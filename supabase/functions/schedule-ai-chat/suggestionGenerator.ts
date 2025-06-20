
export const generateContextAwareSuggestions = (
  userMessage: string, 
  aiResponse: string, 
  context: any, 
  userRole: string, 
  enableAutomation: boolean
): string[] => {
  const lowerMessage = userMessage.toLowerCase();
  const suggestions = new Set<string>();

  if (userRole === 'patient') {
    // Patient-specific suggestions based on real data with automation
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      if (enableAutomation) {
        if (context?.nextAvailableSlots && context.nextAvailableSlots.length > 0) {
          suggestions.add(`Book automatically with ${context.nextAvailableSlots[0].provider}`);
          suggestions.add("Create appointment with any available provider");
        }
        suggestions.add("Schedule my next appointment automatically");
        suggestions.add("Book appointment and send confirmations");
      } else {
        if (context?.nextAvailableSlots && context.nextAvailableSlots.length > 0) {
          suggestions.add(`Book with ${context.nextAvailableSlots[0].provider}`);
          suggestions.add("Compare provider availability");
        }
        suggestions.add("Show me all available times this week");
        suggestions.add("Check provider specialties");
      }
    }
    
    if (lowerMessage.includes('available') || lowerMessage.includes('next')) {
      if (enableAutomation && context?.availableSlots > 0) {
        suggestions.add("Book the earliest available slot automatically");
        suggestions.add("Create appointment with first available provider");
      } else if (context?.availableSlots > 0) {
        suggestions.add("Show specific available times");
        suggestions.add("Book the earliest available slot");
      }
      suggestions.add("Check availability for next week");
      suggestions.add("Find availability with specific provider");
    }
    
    if (lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
      suggestions.add("Find alternative times");
      suggestions.add("Check cancellation policy");
      suggestions.add("See provider availability");
    }

    // Default patient suggestions with automation awareness
    if (suggestions.size === 0) {
      if (enableAutomation) {
        if (context?.availableSlots > 0) {
          suggestions.add("Book next available appointment automatically");
          suggestions.add("Create appointment with confirmations");
        } else {
          suggestions.add("Auto-book appointment for tomorrow");
          suggestions.add("Schedule appointment next week automatically");
        }
        suggestions.add("Set up automated appointment reminders");
      } else {
        if (context?.availableSlots > 0) {
          suggestions.add("Book next available appointment");
          suggestions.add("See all available times today");
        } else {
          suggestions.add("Check availability for tomorrow");
          suggestions.add("Find appointments next week");
        }
        suggestions.add("View my upcoming appointments");
        suggestions.add("Set up appointment reminders");
      }
    }
  } else {
    // Staff-specific suggestions based on real data with automation
    if (lowerMessage.includes('book') || lowerMessage.includes('create') || lowerMessage.includes('schedule')) {
      if (enableAutomation) {
        if (context?.availableSlots > 0) {
          suggestions.add("Create appointment for patient automatically");
          suggestions.add("Book next available slot with confirmations");
        }
        suggestions.add("Set up multiple appointments automatically");
        suggestions.add("Bulk create appointments with reminders");
      } else {
        suggestions.add("Show detailed availability breakdown");
        suggestions.add("Help patient book appointment");
      }
    }
    
    if (lowerMessage.includes('availability') || lowerMessage.includes('schedule')) {
      if (context?.availableSlots > 0) {
        suggestions.add("Show detailed availability breakdown");
        suggestions.add("Optimize today's schedule");
      }
      suggestions.add("Check provider utilization");
      suggestions.add("Analyze booking patterns");
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
      suggestions.add("Suggest schedule improvements");
      suggestions.add("Identify peak hours");
      suggestions.add("Review provider efficiency");
    }
    
    if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      suggestions.add("Generate availability report");
      suggestions.add("Show booking statistics");
      suggestions.add("Analyze no-show patterns");
    }

    // Context-aware staff suggestions with automation
    if (context?.todaysAppointments > 10) {
      suggestions.add("Manage high-volume day efficiently");
    }
    
    if (context?.availableSlots < 5) {
      suggestions.add("Find ways to increase availability");
    }

    // Default staff suggestions with automation awareness
    if (suggestions.size === 0) {
      if (enableAutomation) {
        if (context?.availableSlots > 0) {
          suggestions.add("Create appointment for patient automatically");
          suggestions.add("Book available slot with confirmations");
        }
        suggestions.add("Set up automated appointment workflow");
        suggestions.add("Create multiple appointments efficiently");
      } else {
        if (context?.availableSlots > 0) {
          suggestions.add("Review available slots");
          suggestions.add("Optimize appointment spacing");
        }
        suggestions.add("Check today's schedule status");
        suggestions.add("Analyze current booking trends");
      }
    }
  }

  return Array.from(suggestions).slice(0, 4);
};
