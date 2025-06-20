
import { AvailabilitySlot, ScheduleTemplate, SupabaseAvailabilitySlot, SupabaseScheduleTemplate } from "@/types/availability";

export const convertToAvailabilitySlot = (item: SupabaseAvailabilitySlot): AvailabilitySlot => ({
  ...item
});

export const convertToScheduleTemplate = (item: SupabaseScheduleTemplate): ScheduleTemplate => ({
  ...item
});

export const generateSlotsFromTemplates = (
  templatesData: ScheduleTemplate[],
  providerId: string,
  startDate: Date,
  endDate: Date
): Omit<AvailabilitySlot, 'id'>[] => {
  const generatedSlots: Omit<AvailabilitySlot, 'id'>[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const template = templatesData.find(t => t.day_of_week === dayOfWeek);

    if (template) {
      const startTime = new Date(`${currentDate.toISOString().split('T')[0]}T${template.start_time}`);
      const endTime = new Date(`${currentDate.toISOString().split('T')[0]}T${template.end_time}`);

      while (startTime < endTime) {
        const slotEndTime = new Date(startTime.getTime() + template.slot_duration * 60000);
        
        generatedSlots.push({
          provider_id: providerId,
          date: currentDate.toISOString().split('T')[0],
          start_time: startTime.toTimeString().split(' ')[0].slice(0, 5),
          end_time: slotEndTime.toTimeString().split(' ')[0].slice(0, 5),
          is_available: true
        });

        startTime.setTime(slotEndTime.getTime() + template.buffer_time * 60000);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return generatedSlots;
};
