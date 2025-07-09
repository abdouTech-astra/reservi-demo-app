export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  type: "booking" | "reminder" | "promotion" | "system" | "loyalty";
  variables: string[]; // e.g., ["customerName", "businessName", "bookingTime"]
  isActive: boolean;
  businessId?: string; // null for system-wide templates
}

export interface PushNotification {
  id: string;
  recipientId: string;
  recipientType: "customer" | "business";
  title: string;
  body: string;
  data?: Record<string, any>;
  type: "booking" | "reminder" | "promotion" | "system" | "loyalty";
  priority: "high" | "normal" | "low";
  scheduledFor?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  status: "pending" | "sent" | "delivered" | "read" | "failed";
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  userType: "customer" | "business";
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  categories: {
    bookingConfirmations: boolean;
    bookingReminders: boolean;
    promotions: boolean;
    loyaltyUpdates: boolean;
    systemUpdates: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  };
  reminderTiming: {
    beforeBooking: number; // hours
    afterBooking: number; // hours for follow-up
  };
}

export interface FCMConfig {
  serverKey: string;
  senderId: string;
  apiUrl: string;
}

// Default notification templates
export const DEFAULT_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: "booking_confirmed",
    name: "Booking Confirmed",
    title: "Booking Confirmed! ✅",
    body: "Your booking at {{businessName}} for {{serviceName}} on {{bookingDate}} at {{bookingTime}} has been confirmed.",
    type: "booking",
    variables: ["businessName", "serviceName", "bookingDate", "bookingTime"],
    isActive: true,
  },
  {
    id: "booking_reminder",
    name: "Booking Reminder",
    title: "Upcoming Appointment Reminder ⏰",
    body: "Don't forget! You have an appointment at {{businessName}} tomorrow at {{bookingTime}} for {{serviceName}}.",
    type: "reminder",
    variables: ["businessName", "serviceName", "bookingTime"],
    isActive: true,
  },
  {
    id: "booking_cancelled",
    name: "Booking Cancelled",
    title: "Booking Cancelled",
    body: "Your booking at {{businessName}} for {{bookingDate}} has been cancelled. {{refundInfo}}",
    type: "booking",
    variables: ["businessName", "bookingDate", "refundInfo"],
    isActive: true,
  },
  {
    id: "loyalty_points_earned",
    name: "Loyalty Points Earned",
    title: "Points Earned! 🌟",
    body: "You've earned {{points}} loyalty points from your recent booking at {{businessName}}. Total: {{totalPoints}} points.",
    type: "loyalty",
    variables: ["points", "businessName", "totalPoints"],
    isActive: true,
  },
  {
    id: "loyalty_tier_upgraded",
    name: "Loyalty Tier Upgrade",
    title: "Congratulations! Tier Upgraded! 🎉",
    body: "You've been upgraded to {{newTier}} tier! Enjoy your new benefits including {{benefits}}.",
    type: "loyalty",
    variables: ["newTier", "benefits"],
    isActive: true,
  },
  {
    id: "promotion_offer",
    name: "Promotional Offer",
    title: "Special Offer Just for You! 🎁",
    body: "{{businessName}} has a special offer: {{offerDescription}}. Valid until {{expiryDate}}.",
    type: "promotion",
    variables: ["businessName", "offerDescription", "expiryDate"],
    isActive: true,
  },
  {
    id: "wallet_credited",
    name: "Wallet Credited",
    title: "Wallet Updated 💰",
    body: "{{amount}} TND has been added to your wallet. {{reason}}. New balance: {{newBalance}} TND.",
    type: "system",
    variables: ["amount", "reason", "newBalance"],
    isActive: true,
  },
  {
    id: "subscription_expiring",
    name: "Subscription Expiring",
    title: "Subscription Expiring Soon ⚠️",
    body: "Your {{planName}} subscription expires in {{daysLeft}} days. Renew now to continue enjoying your benefits.",
    type: "system",
    variables: ["planName", "daysLeft"],
    isActive: true,
  },
];

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  userId: "",
  userType: "customer",
  enablePushNotifications: true,
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  categories: {
    bookingConfirmations: true,
    bookingReminders: true,
    promotions: true,
    loyaltyUpdates: true,
    systemUpdates: true,
  },
  quietHours: {
    enabled: true,
    startTime: "22:00",
    endTime: "08:00",
  },
  reminderTiming: {
    beforeBooking: 24, // 24 hours before
    afterBooking: 2, // 2 hours after for follow-up
  },
};

export const createNotification = (
  recipientId: string,
  recipientType: "customer" | "business",
  templateId: string,
  variables: Record<string, string>,
  templates: NotificationTemplate[] = DEFAULT_NOTIFICATION_TEMPLATES,
  scheduledFor?: Date,
  priority: PushNotification["priority"] = "normal"
): PushNotification | null => {
  const template = templates.find((t) => t.id === templateId);
  if (!template || !template.isActive) {
    return null;
  }

  // Replace variables in title and body
  let title = template.title;
  let body = template.body;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    title = title.replace(new RegExp(placeholder, "g"), value);
    body = body.replace(new RegExp(placeholder, "g"), value);
  });

  const notification: PushNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientId,
    recipientType,
    title,
    body,
    type: template.type,
    priority,
    scheduledFor,
    status: "pending",
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date(),
    data: {
      templateId,
      variables,
    },
  };

  // Set expiry (24 hours for reminders, 7 days for others)
  if (template.type === "reminder") {
    notification.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else {
    notification.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  return notification;
};

export const shouldSendNotification = (
  notification: PushNotification,
  preferences: NotificationPreferences
): {
  shouldSend: boolean;
  reason?: string;
} => {
  // Check if push notifications are enabled
  if (!preferences.enablePushNotifications) {
    return { shouldSend: false, reason: "Push notifications disabled" };
  }

  // Check category preferences
  const categoryMap = {
    booking: preferences.categories.bookingConfirmations,
    reminder: preferences.categories.bookingReminders,
    promotion: preferences.categories.promotions,
    loyalty: preferences.categories.loyaltyUpdates,
    system: preferences.categories.systemUpdates,
  };

  if (!categoryMap[notification.type]) {
    return {
      shouldSend: false,
      reason: `${notification.type} notifications disabled`,
    };
  }

  // Check quiet hours
  if (preferences.quietHours.enabled) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const startTime = preferences.quietHours.startTime;
    const endTime = preferences.quietHours.endTime;

    // Handle quiet hours that span midnight
    if (startTime > endTime) {
      if (currentTime >= startTime || currentTime <= endTime) {
        return { shouldSend: false, reason: "Quiet hours active" };
      }
    } else {
      if (currentTime >= startTime && currentTime <= endTime) {
        return { shouldSend: false, reason: "Quiet hours active" };
      }
    }
  }

  // Check if notification has expired
  if (notification.expiresAt && notification.expiresAt < new Date()) {
    return { shouldSend: false, reason: "Notification expired" };
  }

  return { shouldSend: true };
};

export const sendPushNotification = async (
  notification: PushNotification,
  deviceToken: string,
  fcmConfig: FCMConfig
): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> => {
  try {
    const payload = {
      to: deviceToken,
      notification: {
        title: notification.title,
        body: notification.body,
        sound: "default",
        badge: 1,
      },
      data: {
        notificationId: notification.id,
        type: notification.type,
        ...notification.data,
      },
      priority: notification.priority === "high" ? "high" : "normal",
    };

    const response = await fetch(fcmConfig.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${fcmConfig.serverKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.success === 1) {
      return {
        success: true,
        messageId: result.results?.[0]?.message_id,
      };
    } else {
      return {
        success: false,
        error: result.results?.[0]?.error || "Unknown error",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

export const scheduleBookingReminder = (
  bookingId: string,
  customerId: string,
  businessName: string,
  serviceName: string,
  bookingDateTime: Date,
  preferences: NotificationPreferences
): PushNotification | null => {
  const reminderTime = new Date(bookingDateTime);
  reminderTime.setHours(
    reminderTime.getHours() - preferences.reminderTiming.beforeBooking
  );

  // Don't schedule if reminder time is in the past
  if (reminderTime < new Date()) {
    return null;
  }

  return createNotification(
    customerId,
    "customer",
    "booking_reminder",
    {
      businessName,
      serviceName,
      bookingTime: bookingDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    DEFAULT_NOTIFICATION_TEMPLATES,
    reminderTime,
    "high"
  );
};

export const createBookingConfirmation = (
  customerId: string,
  businessName: string,
  serviceName: string,
  bookingDate: string,
  bookingTime: string
): PushNotification | null => {
  return createNotification(
    customerId,
    "customer",
    "booking_confirmed",
    {
      businessName,
      serviceName,
      bookingDate,
      bookingTime,
    },
    DEFAULT_NOTIFICATION_TEMPLATES,
    undefined,
    "high"
  );
};

export const createLoyaltyPointsNotification = (
  customerId: string,
  points: number,
  businessName: string,
  totalPoints: number
): PushNotification | null => {
  return createNotification(
    customerId,
    "customer",
    "loyalty_points_earned",
    {
      points: points.toString(),
      businessName,
      totalPoints: totalPoints.toString(),
    },
    DEFAULT_NOTIFICATION_TEMPLATES,
    undefined,
    "normal"
  );
};

export const createWalletCreditNotification = (
  customerId: string,
  amount: number,
  reason: string,
  newBalance: number
): PushNotification | null => {
  return createNotification(
    customerId,
    "customer",
    "wallet_credited",
    {
      amount: amount.toFixed(2),
      reason,
      newBalance: newBalance.toFixed(2),
    },
    DEFAULT_NOTIFICATION_TEMPLATES,
    undefined,
    "normal"
  );
};

export const createSubscriptionExpiryNotification = (
  customerId: string,
  planName: string,
  daysLeft: number
): PushNotification | null => {
  return createNotification(
    customerId,
    "customer",
    "subscription_expiring",
    {
      planName,
      daysLeft: daysLeft.toString(),
    },
    DEFAULT_NOTIFICATION_TEMPLATES,
    undefined,
    "high"
  );
};

export const batchSendNotifications = async (
  notifications: PushNotification[],
  deviceTokens: Record<string, string>, // userId -> deviceToken
  fcmConfig: FCMConfig
): Promise<{
  sent: number;
  failed: number;
  results: Array<{ notificationId: string; success: boolean; error?: string }>;
}> => {
  const results = [];
  let sent = 0;
  let failed = 0;

  for (const notification of notifications) {
    const deviceToken = deviceTokens[notification.recipientId];
    if (!deviceToken) {
      results.push({
        notificationId: notification.id,
        success: false,
        error: "No device token",
      });
      failed++;
      continue;
    }

    const result = await sendPushNotification(
      notification,
      deviceToken,
      fcmConfig
    );
    results.push({
      notificationId: notification.id,
      success: result.success,
      error: result.error,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { sent, failed, results };
};

export const getNotificationStats = (
  notifications: PushNotification[]
): {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  byType: Record<string, number>;
} => {
  const stats = {
    total: notifications.length,
    pending: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    byType: {} as Record<string, number>,
  };

  notifications.forEach((notification) => {
    stats[notification.status]++;
    stats.byType[notification.type] =
      (stats.byType[notification.type] || 0) + 1;
  });

  return stats;
};

export const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};
