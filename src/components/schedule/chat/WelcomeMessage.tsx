
interface WelcomeMessageProps {
  role: string;
  firstName?: string;
}

export const WelcomeMessage = ({ role, firstName }: WelcomeMessageProps) => {
  const name = firstName ? ` ${firstName}` : '';
  
  if (role === 'patient') {
    return `Hello${name}! I'm Schedule iQ, your personal appointment assistant. I have real-time access to your scheduling information and can help you with:\n\n• Finding and booking your next appointment automatically\n• Checking actual provider availability\n• Rescheduling existing appointments\n• Setting up appointment reminders\n• Answering questions about your visits\n\nI can see current availability, book appointments instantly, and send confirmations automatically. What would you like help with today?`;
  } else {
    return `Hello${name}! I'm Schedule iQ, your AI scheduling assistant with real-time access to your practice data. I can help you with:\n\n• Managing appointments with live availability data\n• Automatically creating appointments for patients\n• Optimizing provider schedules based on actual bookings\n• Resolving scheduling conflicts with real-time information\n• Analyzing current scheduling patterns and trends\n• Setting up automated reminders and confirmations\n• Generating reports from actual appointment data\n• Improving practice efficiency with data-driven insights\n\nI have access to your current schedule and can create appointments automatically with confirmations. What would you like to work on today?`;
  }
};

export const getInitialSuggestions = (role: string) => {
  if (role === 'patient') {
    return [
      "Book my next available appointment automatically",
      "Find and schedule with any available provider", 
      "Show me upcoming appointments",
      "Set up appointment reminders"
    ];
  } else {
    return [
      "Book next available slot for a patient automatically",
      "Find and create appointment with any provider",
      "Check current provider availability",
      "Analyze today's appointment patterns"
    ];
  }
};
