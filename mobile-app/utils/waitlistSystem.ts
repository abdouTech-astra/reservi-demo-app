export interface WaitlistEntry {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  businessId: string;
  businessName: string;
  serviceId: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  alternativeTimes: string[];
  priority: number;
  joinedAt: Date;
  expiresAt: Date;
  status: "active" | "notified" | "expired" | "converted" | "cancelled";
  notificationsSent: number;
  maxNotifications: number;
  notes?: string;
  estimatedWaitTime?: number;
}

export interface WaitlistNotification {
  id: string;
  waitlistEntryId: string;
  customerId: string;
  type: "spot_available" | "position_update" | "expiry_warning" | "cancelled";
  title: string;
  message: string;
  sentAt: Date;
  readAt?: Date;
  actionTaken?: "booked" | "ignored" | "declined";
  availableSlot?: {
    date: string;
    time: string;
    expiresAt: Date;
  };
}

export interface WaitlistSettings {
  businessId: string;
  enabled: boolean;
  maxWaitlistSize: number;
  notificationWindow: number; // minutes to respond
  maxNotificationsPerEntry: number;
  priorityRules: {
    vipCustomers: boolean;
    loyaltyLevel: boolean;
    firstComeFirstServe: boolean;
  };
  autoExpiry: {
    enabled: boolean;
    hours: number;
  };
  estimatedWaitTime: {
    enabled: boolean;
    averageSlotDuration: number; // minutes
  };
}

export interface WaitlistStats {
  businessId: string;
  totalEntries: number;
  activeEntries: number;
  conversionRate: number;
  averageWaitTime: number;
  popularTimeSlots: { time: string; count: number }[];
  customerSatisfaction: number;
}

// Default waitlist settings
export const DEFAULT_WAITLIST_SETTINGS: Omit<WaitlistSettings, "businessId"> = {
  enabled: true,
  maxWaitlistSize: 50,
  notificationWindow: 30, // 30 minutes to respond
  maxNotificationsPerEntry: 3,
  priorityRules: {
    vipCustomers: true,
    loyaltyLevel: true,
    firstComeFirstServe: true,
  },
  autoExpiry: {
    enabled: true,
    hours: 24,
  },
  estimatedWaitTime: {
    enabled: true,
    averageSlotDuration: 60, // 1 hour average
  },
};

// Utility functions
export const calculatePriority = (
  customerLevel: number,
  isVip: boolean,
  joinedAt: Date,
  settings: WaitlistSettings
): number => {
  let priority = 0;

  // Base priority from join time (earlier = higher priority)
  const hoursWaiting = (Date.now() - joinedAt.getTime()) / (1000 * 60 * 60);
  priority += hoursWaiting * 10;

  // VIP bonus
  if (settings.priorityRules.vipCustomers && isVip) {
    priority += 1000;
  }

  // Loyalty level bonus
  if (settings.priorityRules.loyaltyLevel) {
    priority += customerLevel * 100;
  }

  return Math.round(priority);
};

export const estimateWaitTime = (
  position: number,
  settings: WaitlistSettings
): number => {
  if (!settings.estimatedWaitTime.enabled) return 0;

  // Estimate based on position and average slot duration
  return position * settings.estimatedWaitTime.averageSlotDuration;
};

export const getWaitlistPosition = (
  waitlistEntries: WaitlistEntry[],
  entryId: string
): number => {
  const sortedEntries = waitlistEntries
    .filter((entry) => entry.status === "active")
    .sort((a, b) => b.priority - a.priority);

  return sortedEntries.findIndex((entry) => entry.id === entryId) + 1;
};

export const createWaitlistEntry = (
  customerId: string,
  customerName: string,
  customerPhone: string,
  businessId: string,
  businessName: string,
  serviceId: string,
  serviceName: string,
  preferredDate: string,
  preferredTime: string,
  alternativeTimes: string[] = [],
  customerLevel: number = 1,
  isVip: boolean = false,
  settings: WaitlistSettings
): WaitlistEntry => {
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + settings.autoExpiry.hours * 60 * 60 * 1000
  );

  return {
    id: `waitlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    customerId,
    customerName,
    customerPhone,
    businessId,
    businessName,
    serviceId,
    serviceName,
    preferredDate,
    preferredTime,
    alternativeTimes,
    priority: calculatePriority(customerLevel, isVip, now, settings),
    joinedAt: now,
    expiresAt,
    status: "active",
    notificationsSent: 0,
    maxNotifications: settings.maxNotificationsPerEntry,
  };
};

export const createSpotAvailableNotification = (
  waitlistEntry: WaitlistEntry,
  availableDate: string,
  availableTime: string,
  notificationWindow: number
): WaitlistNotification => {
  const expiresAt = new Date(Date.now() + notificationWindow * 60 * 1000);

  return {
    id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    waitlistEntryId: waitlistEntry.id,
    customerId: waitlistEntry.customerId,
    type: "spot_available",
    title: "Booking Spot Available! 🎉",
    message: `Great news! A spot just opened up at ${waitlistEntry.businessName} for ${waitlistEntry.serviceName} on ${availableDate} at ${availableTime}. You have ${notificationWindow} minutes to book!`,
    sentAt: new Date(),
    availableSlot: {
      date: availableDate,
      time: availableTime,
      expiresAt,
    },
  };
};

export const createPositionUpdateNotification = (
  waitlistEntry: WaitlistEntry,
  newPosition: number,
  estimatedWaitTime: number
): WaitlistNotification => {
  return {
    id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    waitlistEntryId: waitlistEntry.id,
    customerId: waitlistEntry.customerId,
    type: "position_update",
    title: "Waitlist Update 📍",
    message: `You're now #${newPosition} in line for ${
      waitlistEntry.serviceName
    } at ${waitlistEntry.businessName}. Estimated wait time: ${Math.round(
      estimatedWaitTime / 60
    )} hours.`,
    sentAt: new Date(),
  };
};

export const createExpiryWarningNotification = (
  waitlistEntry: WaitlistEntry,
  hoursUntilExpiry: number
): WaitlistNotification => {
  return {
    id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    waitlistEntryId: waitlistEntry.id,
    customerId: waitlistEntry.customerId,
    type: "expiry_warning",
    title: "Waitlist Expiring Soon ⏰",
    message: `Your waitlist entry for ${waitlistEntry.serviceName} at ${waitlistEntry.businessName} will expire in ${hoursUntilExpiry} hours. Would you like to extend it?`,
    sentAt: new Date(),
  };
};

export const processWaitlistForCancellation = (
  cancelledDate: string,
  cancelledTime: string,
  serviceId: string,
  businessId: string,
  waitlistEntries: WaitlistEntry[],
  settings: WaitlistSettings
): {
  notifiedEntries: WaitlistEntry[];
  notifications: WaitlistNotification[];
} => {
  // Find matching waitlist entries
  const matchingEntries = waitlistEntries
    .filter(
      (entry) =>
        entry.status === "active" &&
        entry.businessId === businessId &&
        entry.serviceId === serviceId &&
        (entry.preferredDate === cancelledDate ||
          entry.alternativeTimes.includes(cancelledTime)) &&
        entry.notificationsSent < entry.maxNotifications
    )
    .sort((a, b) => b.priority - a.priority);

  if (matchingEntries.length === 0) {
    return { notifiedEntries: [], notifications: [] };
  }

  // Notify the highest priority customer
  const topEntry = matchingEntries[0];
  const notification = createSpotAvailableNotification(
    topEntry,
    cancelledDate,
    cancelledTime,
    settings.notificationWindow
  );

  // Update the waitlist entry
  const updatedEntry: WaitlistEntry = {
    ...topEntry,
    status: "notified",
    notificationsSent: topEntry.notificationsSent + 1,
  };

  return {
    notifiedEntries: [updatedEntry],
    notifications: [notification],
  };
};

export const cleanupExpiredEntries = (
  waitlistEntries: WaitlistEntry[]
): { activeEntries: WaitlistEntry[]; expiredEntries: WaitlistEntry[] } => {
  const now = new Date();
  const activeEntries: WaitlistEntry[] = [];
  const expiredEntries: WaitlistEntry[] = [];

  waitlistEntries.forEach((entry) => {
    if (entry.status === "active" && entry.expiresAt < now) {
      expiredEntries.push({ ...entry, status: "expired" });
    } else {
      activeEntries.push(entry);
    }
  });

  return { activeEntries, expiredEntries };
};

export const extendWaitlistEntry = (
  entry: WaitlistEntry,
  additionalHours: number
): WaitlistEntry => {
  const newExpiresAt = new Date(
    entry.expiresAt.getTime() + additionalHours * 60 * 60 * 1000
  );

  return {
    ...entry,
    expiresAt: newExpiresAt,
  };
};

export const cancelWaitlistEntry = (
  entry: WaitlistEntry,
  reason: string = "Customer cancelled"
): WaitlistEntry => {
  return {
    ...entry,
    status: "cancelled",
    notes: reason,
  };
};

export const convertWaitlistToBooking = (
  entry: WaitlistEntry,
  bookingId: string
): WaitlistEntry => {
  return {
    ...entry,
    status: "converted",
    notes: `Converted to booking: ${bookingId}`,
  };
};

export const calculateWaitlistStats = (
  waitlistEntries: WaitlistEntry[],
  businessId: string
): WaitlistStats => {
  const businessEntries = waitlistEntries.filter(
    (entry) => entry.businessId === businessId
  );
  const totalEntries = businessEntries.length;
  const activeEntries = businessEntries.filter(
    (entry) => entry.status === "active"
  ).length;
  const convertedEntries = businessEntries.filter(
    (entry) => entry.status === "converted"
  ).length;

  const conversionRate =
    totalEntries > 0 ? (convertedEntries / totalEntries) * 100 : 0;

  // Calculate average wait time for converted entries
  const convertedWithWaitTime = businessEntries
    .filter((entry) => entry.status === "converted")
    .map((entry) => {
      // Assuming conversion happened when status changed
      return 24; // Placeholder - in real app, track actual conversion time
    });

  const averageWaitTime =
    convertedWithWaitTime.length > 0
      ? convertedWithWaitTime.reduce((sum, time) => sum + time, 0) /
        convertedWithWaitTime.length
      : 0;

  // Popular time slots
  const timeSlotCounts: Record<string, number> = {};
  businessEntries.forEach((entry) => {
    timeSlotCounts[entry.preferredTime] =
      (timeSlotCounts[entry.preferredTime] || 0) + 1;
  });

  const popularTimeSlots = Object.entries(timeSlotCounts)
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    businessId,
    totalEntries,
    activeEntries,
    conversionRate,
    averageWaitTime,
    popularTimeSlots,
    customerSatisfaction: 85, // Placeholder - would be calculated from feedback
  };
};

export const getWaitlistSummary = (
  waitlistEntries: WaitlistEntry[],
  customerId: string
): {
  activeEntries: number;
  totalWaitTime: number;
  nextNotification?: Date;
  topPosition: number;
} => {
  const customerEntries = waitlistEntries.filter(
    (entry) => entry.customerId === customerId && entry.status === "active"
  );

  const activeEntries = customerEntries.length;
  const totalWaitTime = customerEntries.reduce((sum, entry) => {
    return sum + (entry.estimatedWaitTime || 0);
  }, 0);

  // Find the entry with the highest priority (best position)
  let topPosition = 0;
  if (customerEntries.length > 0) {
    const allActiveEntries = waitlistEntries.filter(
      (entry) => entry.status === "active"
    );
    const bestEntry = customerEntries.sort(
      (a, b) => b.priority - a.priority
    )[0];
    topPosition = getWaitlistPosition(allActiveEntries, bestEntry.id);
  }

  return {
    activeEntries,
    totalWaitTime,
    topPosition,
  };
};

// Mock data for testing
export const mockWaitlistEntries: WaitlistEntry[] = [
  {
    id: "waitlist_001",
    customerId: "customer_001",
    customerName: "Ahmed Ben Ali",
    customerPhone: "+216 20 123 456",
    businessId: "business_001",
    businessName: "Le Petit Café",
    serviceId: "service_001",
    serviceName: "Breakfast Platter",
    preferredDate: "2025-01-15",
    preferredTime: "10:00 AM",
    alternativeTimes: ["10:30 AM", "11:00 AM"],
    priority: 1250,
    joinedAt: new Date("2025-01-14T08:00:00"),
    expiresAt: new Date("2025-01-15T08:00:00"),
    status: "active",
    notificationsSent: 0,
    maxNotifications: 3,
    estimatedWaitTime: 120,
  },
  {
    id: "waitlist_002",
    customerId: "customer_002",
    customerName: "Leila Mansour",
    customerPhone: "+216 21 234 567",
    businessId: "business_001",
    businessName: "Le Petit Café",
    serviceId: "service_002",
    serviceName: "Specialty Coffee",
    preferredDate: "2025-01-15",
    preferredTime: "2:00 PM",
    alternativeTimes: ["2:30 PM", "3:00 PM"],
    priority: 980,
    joinedAt: new Date("2025-01-14T10:30:00"),
    expiresAt: new Date("2025-01-15T10:30:00"),
    status: "active",
    notificationsSent: 1,
    maxNotifications: 3,
    estimatedWaitTime: 90,
  },
];

export const mockWaitlistNotifications: WaitlistNotification[] = [
  {
    id: "notification_001",
    waitlistEntryId: "waitlist_002",
    customerId: "customer_002",
    type: "spot_available",
    title: "Booking Spot Available! 🎉",
    message:
      "Great news! A spot just opened up at Le Petit Café for Specialty Coffee on 2025-01-15 at 2:00 PM. You have 30 minutes to book!",
    sentAt: new Date("2025-01-14T13:30:00"),
    availableSlot: {
      date: "2025-01-15",
      time: "2:00 PM",
      expiresAt: new Date("2025-01-14T14:00:00"),
    },
  },
];
