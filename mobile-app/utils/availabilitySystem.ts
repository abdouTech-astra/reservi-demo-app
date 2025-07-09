import {
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  capacity: number;
  isAvailable: boolean;
  price?: number; // Optional dynamic pricing
}

export interface BreakTime {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
  recurringDays: number[]; // 0-6 (Sunday-Saturday)
}

export interface DaySchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isOpen: boolean;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  timeSlots: TimeSlot[];
  breaks: BreakTime[];
  maxCapacity: number;
  notes?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  isRecurring: boolean; // Annual recurring
  isClosed: boolean;
  customSchedule?: {
    openTime: string;
    closeTime: string;
    capacity: number;
  };
  description?: string;
}

export interface SpecialHours {
  id: string;
  date: string; // YYYY-MM-DD format
  reason: string;
  isClosed: boolean;
  customSchedule?: {
    openTime: string;
    closeTime: string;
    capacity: number;
  };
  createdAt: Date;
}

export interface BusinessAvailability {
  businessId: string;
  timezone: string;
  weeklySchedule: DaySchedule[];
  holidays: Holiday[];
  specialHours: SpecialHours[];
  defaultSlotDuration: number; // minutes
  bufferTime: number; // minutes between bookings
  advanceBookingDays: number; // how far in advance bookings allowed
  lastMinuteBookingHours: number; // minimum hours before booking
  isActive: boolean;
  lastUpdated: Date;
}

// Default weekly schedule template
export const DEFAULT_WEEKLY_SCHEDULE: DaySchedule[] = [
  // Sunday
  {
    dayOfWeek: 0,
    isOpen: false,
    openTime: "09:00",
    closeTime: "17:00",
    timeSlots: [],
    breaks: [],
    maxCapacity: 10,
    notes: "Closed on Sundays",
  },
  // Monday
  {
    dayOfWeek: 1,
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    timeSlots: generateDefaultTimeSlots("09:00", "18:00", 30, 10),
    breaks: [
      {
        id: "lunch_monday",
        name: "Lunch Break",
        startTime: "12:00",
        endTime: "13:00",
        isActive: true,
        recurringDays: [1, 2, 3, 4, 5],
      },
    ],
    maxCapacity: 10,
  },
  // Tuesday
  {
    dayOfWeek: 2,
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    timeSlots: generateDefaultTimeSlots("09:00", "18:00", 30, 10),
    breaks: [
      {
        id: "lunch_tuesday",
        name: "Lunch Break",
        startTime: "12:00",
        endTime: "13:00",
        isActive: true,
        recurringDays: [1, 2, 3, 4, 5],
      },
    ],
    maxCapacity: 10,
  },
  // Wednesday
  {
    dayOfWeek: 3,
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    timeSlots: generateDefaultTimeSlots("09:00", "18:00", 30, 10),
    breaks: [
      {
        id: "lunch_wednesday",
        name: "Lunch Break",
        startTime: "12:00",
        endTime: "13:00",
        isActive: true,
        recurringDays: [1, 2, 3, 4, 5],
      },
    ],
    maxCapacity: 10,
  },
  // Thursday
  {
    dayOfWeek: 4,
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    timeSlots: generateDefaultTimeSlots("09:00", "18:00", 30, 10),
    breaks: [
      {
        id: "lunch_thursday",
        name: "Lunch Break",
        startTime: "12:00",
        endTime: "13:00",
        isActive: true,
        recurringDays: [1, 2, 3, 4, 5],
      },
    ],
    maxCapacity: 10,
  },
  // Friday
  {
    dayOfWeek: 5,
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    timeSlots: generateDefaultTimeSlots("09:00", "18:00", 30, 10),
    breaks: [
      {
        id: "lunch_friday",
        name: "Lunch Break",
        startTime: "12:00",
        endTime: "13:00",
        isActive: true,
        recurringDays: [1, 2, 3, 4, 5],
      },
    ],
    maxCapacity: 10,
  },
  // Saturday
  {
    dayOfWeek: 6,
    isOpen: true,
    openTime: "10:00",
    closeTime: "16:00",
    timeSlots: generateDefaultTimeSlots("10:00", "16:00", 30, 8),
    breaks: [],
    maxCapacity: 8,
    notes: "Reduced hours on Saturday",
  },
];

// Default holidays
export const DEFAULT_HOLIDAYS: Holiday[] = [
  {
    id: "new_year",
    name: "New Year's Day",
    date: "2025-01-01",
    isRecurring: true,
    isClosed: true,
    description: "Closed for New Year's Day",
  },
  {
    id: "independence_day",
    name: "Independence Day",
    date: "2025-03-20",
    isRecurring: true,
    isClosed: true,
    description: "Tunisia Independence Day",
  },
  {
    id: "labour_day",
    name: "Labour Day",
    date: "2025-05-01",
    isRecurring: true,
    isClosed: true,
    description: "International Labour Day",
  },
  {
    id: "republic_day",
    name: "Republic Day",
    date: "2025-07-25",
    isRecurring: true,
    isClosed: true,
    description: "Tunisia Republic Day",
  },
];

function generateDefaultTimeSlots(
  openTime: string,
  closeTime: string,
  slotDuration: number,
  capacity: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [openHour, openMinute] = openTime.split(":").map(Number);
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);

  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  for (
    let minutes = openMinutes;
    minutes < closeMinutes;
    minutes += slotDuration
  ) {
    const startHour = Math.floor(minutes / 60);
    const startMinute = minutes % 60;
    const endMinutes = minutes + slotDuration;
    const endHour = Math.floor(endMinutes / 60);
    const endMinuteValue = endMinutes % 60;

    if (endMinutes <= closeMinutes) {
      slots.push({
        id: `slot_${startHour}_${startMinute}`,
        startTime: `${startHour.toString().padStart(2, "0")}:${startMinute
          .toString()
          .padStart(2, "0")}`,
        endTime: `${endHour.toString().padStart(2, "0")}:${endMinuteValue
          .toString()
          .padStart(2, "0")}`,
        capacity,
        isAvailable: true,
      });
    }
  }

  return slots;
}

export const getBusinessHoursForDate = (
  date: Date,
  availability: BusinessAvailability
): {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  capacity?: number;
  reason?: string;
} => {
  const dateString = format(date, "yyyy-MM-dd");
  const dayOfWeek = date.getDay();

  // Check for special hours first
  const specialHour = availability.specialHours.find(
    (sh) => sh.date === dateString
  );
  if (specialHour) {
    if (specialHour.isClosed) {
      return {
        isOpen: false,
        reason: specialHour.reason,
      };
    }
    return {
      isOpen: true,
      openTime: specialHour.customSchedule?.openTime,
      closeTime: specialHour.customSchedule?.closeTime,
      capacity: specialHour.customSchedule?.capacity,
      reason: specialHour.reason,
    };
  }

  // Check for holidays
  const holiday = availability.holidays.find((h) => {
    if (h.isRecurring) {
      const holidayDate = parseISO(h.date);
      return (
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getDate() === date.getDate()
      );
    }
    return h.date === dateString;
  });

  if (holiday) {
    if (holiday.isClosed) {
      return {
        isOpen: false,
        reason: `Closed for ${holiday.name}`,
      };
    }
    return {
      isOpen: true,
      openTime: holiday.customSchedule?.openTime,
      closeTime: holiday.customSchedule?.closeTime,
      capacity: holiday.customSchedule?.capacity,
      reason: holiday.name,
    };
  }

  // Use regular weekly schedule
  const daySchedule = availability.weeklySchedule.find(
    (ds) => ds.dayOfWeek === dayOfWeek
  );

  if (!daySchedule || !daySchedule.isOpen) {
    return {
      isOpen: false,
      reason: "Regular day off",
    };
  }

  return {
    isOpen: true,
    openTime: daySchedule.openTime,
    closeTime: daySchedule.closeTime,
    capacity: daySchedule.maxCapacity,
  };
};

export const getAvailableTimeSlotsForDate = (
  date: Date,
  availability: BusinessAvailability,
  existingBookings: { time: string; capacity: number }[] = []
): TimeSlot[] => {
  const businessHours = getBusinessHoursForDate(date, availability);
  if (!businessHours.isOpen) {
    return [];
  }

  const dayOfWeek = date.getDay();
  const daySchedule = availability.weeklySchedule.find(
    (ds) => ds.dayOfWeek === dayOfWeek
  );

  if (!daySchedule) {
    return [];
  }

  // Get base time slots
  let availableSlots = [...daySchedule.timeSlots];

  // Remove slots during break times
  const activeBreaks = daySchedule.breaks.filter(
    (breakTime) =>
      breakTime.isActive && breakTime.recurringDays.includes(dayOfWeek)
  );

  availableSlots = availableSlots.filter((slot) => {
    return !activeBreaks.some((breakTime) =>
      isTimeSlotDuringBreak(slot, breakTime)
    );
  });

  // Adjust capacity based on existing bookings
  availableSlots = availableSlots.map((slot) => {
    const bookingsForSlot = existingBookings.filter(
      (booking) => booking.time === slot.startTime
    );
    const bookedCapacity = bookingsForSlot.reduce(
      (sum, booking) => sum + booking.capacity,
      0
    );
    const remainingCapacity = slot.capacity - bookedCapacity;

    return {
      ...slot,
      capacity: remainingCapacity,
      isAvailable: remainingCapacity > 0,
    };
  });

  // Filter out unavailable slots
  return availableSlots.filter((slot) => slot.isAvailable);
};

export const isTimeSlotDuringBreak = (
  slot: TimeSlot,
  breakTime: BreakTime
): boolean => {
  const slotStart = timeToMinutes(slot.startTime);
  const slotEnd = timeToMinutes(slot.endTime);
  const breakStart = timeToMinutes(breakTime.startTime);
  const breakEnd = timeToMinutes(breakTime.endTime);

  // Check if slot overlaps with break time
  return slotStart < breakEnd && slotEnd > breakStart;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

export const canBookAtTime = (
  date: Date,
  time: string,
  availability: BusinessAvailability,
  existingBookings: { time: string; capacity: number }[] = []
): {
  canBook: boolean;
  reason?: string;
  availableCapacity?: number;
} => {
  const now = new Date();
  const bookingDateTime = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  bookingDateTime.setHours(hours, minutes, 0, 0);

  // Check if booking is too far in advance
  const daysInAdvance = Math.ceil(
    (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysInAdvance > availability.advanceBookingDays) {
    return {
      canBook: false,
      reason: `Bookings only allowed ${availability.advanceBookingDays} days in advance`,
    };
  }

  // Check if booking is too last minute
  const hoursUntilBooking =
    (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilBooking < availability.lastMinuteBookingHours) {
    return {
      canBook: false,
      reason: `Bookings must be made at least ${availability.lastMinuteBookingHours} hours in advance`,
    };
  }

  // Check if business is open
  const businessHours = getBusinessHoursForDate(date, availability);
  if (!businessHours.isOpen) {
    return {
      canBook: false,
      reason: businessHours.reason || "Business is closed",
    };
  }

  // Get available slots for the date
  const availableSlots = getAvailableTimeSlotsForDate(
    date,
    availability,
    existingBookings
  );

  const requestedSlot = availableSlots.find((slot) => slot.startTime === time);
  if (!requestedSlot) {
    return {
      canBook: false,
      reason: "Time slot not available",
    };
  }

  return {
    canBook: true,
    availableCapacity: requestedSlot.capacity,
  };
};

export const addSpecialHours = (
  availability: BusinessAvailability,
  date: string,
  reason: string,
  isClosed: boolean,
  customSchedule?: {
    openTime: string;
    closeTime: string;
    capacity: number;
  }
): BusinessAvailability => {
  const specialHour: SpecialHours = {
    id: `special_${Date.now()}`,
    date,
    reason,
    isClosed,
    customSchedule,
    createdAt: new Date(),
  };

  return {
    ...availability,
    specialHours: [...availability.specialHours, specialHour],
    lastUpdated: new Date(),
  };
};

export const updateDaySchedule = (
  availability: BusinessAvailability,
  dayOfWeek: number,
  schedule: Partial<DaySchedule>
): BusinessAvailability => {
  const updatedSchedule = availability.weeklySchedule.map((day) =>
    day.dayOfWeek === dayOfWeek ? { ...day, ...schedule } : day
  );

  return {
    ...availability,
    weeklySchedule: updatedSchedule,
    lastUpdated: new Date(),
  };
};

export const addBreakTime = (
  availability: BusinessAvailability,
  dayOfWeek: number,
  breakTime: Omit<BreakTime, "id">
): BusinessAvailability => {
  const newBreak: BreakTime = {
    ...breakTime,
    id: `break_${Date.now()}`,
  };

  const updatedSchedule = availability.weeklySchedule.map((day) =>
    day.dayOfWeek === dayOfWeek
      ? { ...day, breaks: [...day.breaks, newBreak] }
      : day
  );

  return {
    ...availability,
    weeklySchedule: updatedSchedule,
    lastUpdated: new Date(),
  };
};

export const getBusinessStatus = (
  availability: BusinessAvailability
): {
  isCurrentlyOpen: boolean;
  nextOpenTime?: Date;
  nextCloseTime?: Date;
  currentCapacity?: number;
} => {
  const now = new Date();
  const today = startOfDay(now);
  const businessHours = getBusinessHoursForDate(today, availability);

  if (!businessHours.isOpen) {
    // Find next open day
    for (let i = 1; i <= 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() + i);
      const nextDayHours = getBusinessHoursForDate(nextDay, availability);

      if (nextDayHours.isOpen && nextDayHours.openTime) {
        const nextOpenTime = new Date(nextDay);
        const [hours, minutes] = nextDayHours.openTime.split(":").map(Number);
        nextOpenTime.setHours(hours, minutes, 0, 0);

        return {
          isCurrentlyOpen: false,
          nextOpenTime,
        };
      }
    }

    return { isCurrentlyOpen: false };
  }

  // Business is open today, check current time
  const [openHours, openMinutes] = businessHours
    .openTime!.split(":")
    .map(Number);
  const [closeHours, closeMinutes] = businessHours
    .closeTime!.split(":")
    .map(Number);

  const openTime = new Date(today);
  openTime.setHours(openHours, openMinutes, 0, 0);

  const closeTime = new Date(today);
  closeTime.setHours(closeHours, closeMinutes, 0, 0);

  const isCurrentlyOpen = now >= openTime && now <= closeTime;

  return {
    isCurrentlyOpen,
    nextOpenTime: isCurrentlyOpen ? undefined : openTime,
    nextCloseTime: isCurrentlyOpen ? closeTime : undefined,
    currentCapacity: businessHours.capacity,
  };
};

export const formatBusinessHours = (
  availability: BusinessAvailability
): string[] => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return availability.weeklySchedule.map((schedule) => {
    const dayName = daysOfWeek[schedule.dayOfWeek];
    if (!schedule.isOpen) {
      return `${dayName}: Closed`;
    }
    return `${dayName}: ${schedule.openTime} - ${schedule.closeTime}`;
  });
};
