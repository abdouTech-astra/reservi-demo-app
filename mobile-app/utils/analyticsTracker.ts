// Analytics Tracker for Customer Profile Interactions and Interest Metrics

export interface ProfileClickEvent {
  id: string;
  customerId: string;
  businessId: string;
  timestamp: Date;
  source: "search" | "recommendation" | "direct" | "social";
  sessionId: string;
  deviceType: "mobile" | "tablet" | "desktop";
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface InterestEvent {
  id: string;
  customerId: string;
  businessId: string;
  timestamp: Date;
  interestType:
    | "service_view"
    | "gallery_view"
    | "menu_view"
    | "reviews_read"
    | "contact_info_view"
    | "booking_attempt"
    | "save_business"
    | "share_business";
  duration?: number; // Time spent on action in seconds
  metadata?: {
    serviceId?: string;
    galleryImageIndex?: number;
    reviewsRead?: number;
    shareMethod?: string;
  };
  sessionId: string;
}

export interface CustomerEngagementMetrics {
  businessId: string;
  period: "today" | "week" | "month" | "year";
  profileClicks: {
    total: number;
    unique: number;
    bySource: Record<string, number>;
    byHour: Record<string, number>;
    trend: number; // Percentage change from previous period
  };
  interestMetrics: {
    totalInteractions: number;
    uniqueCustomers: number;
    averageSessionDuration: number;
    conversionRate: number; // Percentage who clicked and then booked
    byInterestType: Record<string, number>;
    topServices: Array<{
      serviceId: string;
      serviceName: string;
      views: number;
      conversionRate: number;
    }>;
  };
  customerJourney: {
    clickToBookingRate: number;
    averageTimeToBooking: number; // In hours
    dropOffPoints: Array<{
      stage: string;
      dropOffRate: number;
    }>;
  };
}

export interface AnalyticsData {
  profileClicks: ProfileClickEvent[];
  interestEvents: InterestEvent[];
}

// Mock data for demonstration
const mockProfileClicks: ProfileClickEvent[] = [
  {
    id: "pc_001",
    customerId: "customer_001",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    source: "search",
    sessionId: "session_001",
    deviceType: "mobile",
  },
  {
    id: "pc_002",
    customerId: "customer_002",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    source: "recommendation",
    sessionId: "session_002",
    deviceType: "mobile",
  },
  {
    id: "pc_003",
    customerId: "customer_003",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    source: "direct",
    sessionId: "session_003",
    deviceType: "tablet",
  },
  {
    id: "pc_004",
    customerId: "customer_004",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    source: "social",
    sessionId: "session_004",
    deviceType: "mobile",
  },
  {
    id: "pc_005",
    customerId: "customer_005",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    source: "search",
    sessionId: "session_005",
    deviceType: "mobile",
  },
  {
    id: "pc_006",
    customerId: "customer_001",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    source: "direct",
    sessionId: "session_006",
    deviceType: "mobile",
  },
  {
    id: "pc_007",
    customerId: "customer_006",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    source: "recommendation",
    sessionId: "session_007",
    deviceType: "desktop",
  },
];

const mockInterestEvents: InterestEvent[] = [
  {
    id: "ie_001",
    customerId: "customer_001",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    interestType: "service_view",
    duration: 45,
    metadata: { serviceId: "service_001" },
    sessionId: "session_001",
  },
  {
    id: "ie_002",
    customerId: "customer_001",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000),
    interestType: "gallery_view",
    duration: 30,
    metadata: { galleryImageIndex: 2 },
    sessionId: "session_001",
  },
  {
    id: "ie_003",
    customerId: "customer_002",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    interestType: "menu_view",
    duration: 60,
    sessionId: "session_002",
  },
  {
    id: "ie_004",
    customerId: "customer_002",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 120000),
    interestType: "booking_attempt",
    sessionId: "session_002",
  },
  {
    id: "ie_005",
    customerId: "customer_003",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    interestType: "reviews_read",
    duration: 90,
    metadata: { reviewsRead: 5 },
    sessionId: "session_003",
  },
  {
    id: "ie_006",
    customerId: "customer_004",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    interestType: "save_business",
    sessionId: "session_004",
  },
  {
    id: "ie_007",
    customerId: "customer_005",
    businessId: "business_001",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    interestType: "share_business",
    metadata: { shareMethod: "whatsapp" },
    sessionId: "session_005",
  },
];

// Utility functions
export const trackProfileClick = (
  event: Omit<ProfileClickEvent, "id" | "timestamp">
): ProfileClickEvent => {
  const profileClick: ProfileClickEvent = {
    id: `pc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    ...event,
  };

  // In a real app, this would send to analytics service
  console.log("Profile click tracked:", profileClick);

  return profileClick;
};

export const trackInterestEvent = (
  event: Omit<InterestEvent, "id" | "timestamp">
): InterestEvent => {
  const interestEvent: InterestEvent = {
    id: `ie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    ...event,
  };

  // In a real app, this would send to analytics service
  console.log("Interest event tracked:", interestEvent);

  return interestEvent;
};

export const getCustomerEngagementMetrics = (
  businessId: string,
  period: "today" | "week" | "month" | "year" = "week"
): CustomerEngagementMetrics => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }

  // Filter data for the specified period
  const periodClicks = mockProfileClicks.filter(
    (click) => click.businessId === businessId && click.timestamp >= startDate
  );

  const periodInterests = mockInterestEvents.filter(
    (event) => event.businessId === businessId && event.timestamp >= startDate
  );

  // Calculate profile click metrics
  const uniqueCustomers = new Set(periodClicks.map((click) => click.customerId))
    .size;
  const clicksBySource = periodClicks.reduce((acc, click) => {
    acc[click.source] = (acc[click.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clicksByHour = periodClicks.reduce((acc, click) => {
    const hour = click.timestamp.getHours().toString().padStart(2, "0") + ":00";
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate interest metrics
  const uniqueInterestCustomers = new Set(
    periodInterests.map((event) => event.customerId)
  ).size;
  const interestsByType = periodInterests.reduce((acc, event) => {
    acc[event.interestType] = (acc[event.interestType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDuration = periodInterests
    .filter((event) => event.duration)
    .reduce((sum, event) => sum + (event.duration || 0), 0);
  const averageSessionDuration =
    periodInterests.length > 0 ? totalDuration / periodInterests.length : 0;

  // Calculate conversion rate (customers who clicked and then attempted booking)
  const customersWhoBooked = new Set(
    periodInterests
      .filter((event) => event.interestType === "booking_attempt")
      .map((event) => event.customerId)
  );
  const conversionRate =
    uniqueCustomers > 0 ? (customersWhoBooked.size / uniqueCustomers) * 100 : 0;

  // Mock service data
  const topServices = [
    {
      serviceId: "service_001",
      serviceName: "Tunisian Mint Tea",
      views: 15,
      conversionRate: 25,
    },
    {
      serviceId: "service_002",
      serviceName: "Breakfast Platter",
      views: 12,
      conversionRate: 30,
    },
    {
      serviceId: "service_003",
      serviceName: "Specialty Coffee",
      views: 10,
      conversionRate: 20,
    },
  ];

  // Calculate trend (mock data for demonstration)
  const trend = period === "week" ? 15.2 : period === "month" ? 8.7 : 5.3;

  return {
    businessId,
    period,
    profileClicks: {
      total: periodClicks.length,
      unique: uniqueCustomers,
      bySource: clicksBySource,
      byHour: clicksByHour,
      trend,
    },
    interestMetrics: {
      totalInteractions: periodInterests.length,
      uniqueCustomers: uniqueInterestCustomers,
      averageSessionDuration,
      conversionRate,
      byInterestType: interestsByType,
      topServices,
    },
    customerJourney: {
      clickToBookingRate: conversionRate,
      averageTimeToBooking: 2.5, // Mock data: 2.5 hours average
      dropOffPoints: [
        { stage: "Profile View", dropOffRate: 15 },
        { stage: "Service Browse", dropOffRate: 25 },
        { stage: "Booking Form", dropOffRate: 35 },
      ],
    },
  };
};

export const getProfileClickTrend = (
  businessId: string,
  days: number = 7
): Array<{ date: string; clicks: number; uniqueCustomers: number }> => {
  const trend = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    const dayClicks = mockProfileClicks.filter((click) => {
      const clickDate = click.timestamp.toISOString().split("T")[0];
      return click.businessId === businessId && clickDate === dateStr;
    });

    const uniqueCustomers = new Set(dayClicks.map((click) => click.customerId))
      .size;

    trend.push({
      date: dateStr,
      clicks: dayClicks.length,
      uniqueCustomers,
    });
  }

  return trend;
};

export const getInterestHeatmap = (
  businessId: string,
  period: "week" | "month" = "week"
): Record<string, Record<string, number>> => {
  const now = new Date();
  const startDate =
    period === "week"
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const periodEvents = mockInterestEvents.filter(
    (event) => event.businessId === businessId && event.timestamp >= startDate
  );

  const heatmap: Record<string, Record<string, number>> = {};

  periodEvents.forEach((event) => {
    const hour = event.timestamp.getHours();
    const day = event.timestamp.toLocaleDateString("en-US", {
      weekday: "short",
    });

    if (!heatmap[day]) {
      heatmap[day] = {};
    }

    heatmap[day][hour] = (heatmap[day][hour] || 0) + 1;
  });

  return heatmap;
};

export const getCustomerInterestScore = (
  customerId: string,
  businessId: string
): number => {
  const customerEvents = mockInterestEvents.filter(
    (event) =>
      event.customerId === customerId && event.businessId === businessId
  );

  if (customerEvents.length === 0) return 0;

  // Calculate interest score based on different actions
  const scoreWeights = {
    service_view: 1,
    gallery_view: 1,
    menu_view: 2,
    reviews_read: 2,
    contact_info_view: 3,
    booking_attempt: 5,
    save_business: 4,
    share_business: 3,
  };

  const totalScore = customerEvents.reduce((score, event) => {
    return score + (scoreWeights[event.interestType] || 1);
  }, 0);

  // Normalize to 0-100 scale
  const maxPossibleScore = customerEvents.length * 5; // Max weight is 5
  return Math.min((totalScore / maxPossibleScore) * 100, 100);
};

export default {
  trackProfileClick,
  trackInterestEvent,
  getCustomerEngagementMetrics,
  getProfileClickTrend,
  getInterestHeatmap,
  getCustomerInterestScore,
};
