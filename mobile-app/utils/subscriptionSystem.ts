export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "TND";
  billingCycle: "monthly" | "quarterly" | "yearly";
  businessId: string;
  isActive: boolean;
  features: {
    priorityBooking: boolean;
    discountPercentage: number;
    freeRescheduling: boolean;
    waiveCancellationFees: boolean;
    lastMinuteBooking: boolean; // Allow booking within 2 hours
    exclusiveServices: boolean;
    personalConcierge: boolean;
    unlimitedBookings: boolean;
    maxBookingsPerMonth?: number;
  };
  perks: string[];
  color: string;
  icon: string;
  popularBadge?: boolean;
}

export interface CustomerSubscription {
  id: string;
  customerId: string;
  businessId: string;
  planId: string;
  status: "active" | "cancelled" | "expired" | "pending";
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  totalPaid: number;
  bookingsUsed: number;
  createdAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface SubscriptionUsage {
  subscriptionId: string;
  month: string; // YYYY-MM format
  bookingsCount: number;
  discountUsed: number;
  savingsAmount: number;
  lastUpdated: Date;
}

// Default subscription plans template
export const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for occasional visitors",
    price: 15,
    currency: "TND",
    billingCycle: "monthly",
    businessId: "template",
    isActive: true,
    features: {
      priorityBooking: false,
      discountPercentage: 5,
      freeRescheduling: false,
      waiveCancellationFees: false,
      lastMinuteBooking: false,
      exclusiveServices: false,
      personalConcierge: false,
      unlimitedBookings: false,
      maxBookingsPerMonth: 3,
    },
    perks: [
      "5% discount on all services",
      "Up to 3 bookings per month",
      "Standard customer support",
    ],
    color: "#6B7280",
    icon: "card-outline",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Great for regular customers",
    price: 35,
    currency: "TND",
    billingCycle: "monthly",
    businessId: "template",
    isActive: true,
    features: {
      priorityBooking: true,
      discountPercentage: 15,
      freeRescheduling: true,
      waiveCancellationFees: false,
      lastMinuteBooking: true,
      exclusiveServices: false,
      personalConcierge: false,
      unlimitedBookings: false,
      maxBookingsPerMonth: 8,
    },
    perks: [
      "15% discount on all services",
      "Priority booking slots",
      "Free rescheduling",
      "Last-minute booking allowed",
      "Up to 8 bookings per month",
    ],
    color: "#3B82F6",
    icon: "star-outline",
    popularBadge: true,
  },
  {
    id: "vip",
    name: "VIP",
    description: "Ultimate experience for VIP customers",
    price: 75,
    currency: "TND",
    billingCycle: "monthly",
    businessId: "template",
    isActive: true,
    features: {
      priorityBooking: true,
      discountPercentage: 25,
      freeRescheduling: true,
      waiveCancellationFees: true,
      lastMinuteBooking: true,
      exclusiveServices: true,
      personalConcierge: true,
      unlimitedBookings: true,
    },
    perks: [
      "25% discount on all services",
      "VIP priority booking",
      "Unlimited bookings",
      "Free cancellation anytime",
      "Access to exclusive services",
      "Personal concierge service",
      "Premium customer support",
    ],
    color: "#F59E0B",
    icon: "diamond-outline",
  },
];

export const calculateSubscriptionDiscount = (
  originalAmount: number,
  subscription: CustomerSubscription,
  plans: SubscriptionPlan[]
): {
  discountAmount: number;
  finalAmount: number;
  discountPercentage: number;
} => {
  const plan = plans.find((p) => p.id === subscription.planId);
  if (!plan || subscription.status !== "active") {
    return {
      discountAmount: 0,
      finalAmount: originalAmount,
      discountPercentage: 0,
    };
  }

  const discountAmount =
    (originalAmount * plan.features.discountPercentage) / 100;
  return {
    discountAmount,
    finalAmount: originalAmount - discountAmount,
    discountPercentage: plan.features.discountPercentage,
  };
};

export const canMakeBooking = (
  subscription: CustomerSubscription | null,
  plans: SubscriptionPlan[],
  currentMonthBookings: number,
  isLastMinute: boolean = false
): {
  canBook: boolean;
  reason?: string;
  requiresUpgrade?: boolean;
} => {
  if (!subscription || subscription.status !== "active") {
    return {
      canBook: !isLastMinute,
      reason: isLastMinute
        ? "Last-minute booking requires a subscription"
        : undefined,
      requiresUpgrade: isLastMinute,
    };
  }

  const plan = plans.find((p) => p.id === subscription.planId);
  if (!plan) {
    return { canBook: false, reason: "Invalid subscription plan" };
  }

  // Check last-minute booking permission
  if (isLastMinute && !plan.features.lastMinuteBooking) {
    return {
      canBook: false,
      reason: "Last-minute booking not allowed with current plan",
      requiresUpgrade: true,
    };
  }

  // Check booking limits
  if (!plan.features.unlimitedBookings && plan.features.maxBookingsPerMonth) {
    if (currentMonthBookings >= plan.features.maxBookingsPerMonth) {
      return {
        canBook: false,
        reason: `Monthly booking limit reached (${plan.features.maxBookingsPerMonth})`,
        requiresUpgrade: true,
      };
    }
  }

  return { canBook: true };
};

export const getSubscriptionBenefits = (
  subscription: CustomerSubscription | null,
  plans: SubscriptionPlan[]
): {
  hasActivePlan: boolean;
  planName?: string;
  benefits: string[];
  discountPercentage: number;
  canRescheduleForFree: boolean;
  canCancelForFree: boolean;
  hasPriorityBooking: boolean;
  canBookLastMinute: boolean;
} => {
  if (!subscription || subscription.status !== "active") {
    return {
      hasActivePlan: false,
      benefits: [],
      discountPercentage: 0,
      canRescheduleForFree: false,
      canCancelForFree: false,
      hasPriorityBooking: false,
      canBookLastMinute: false,
    };
  }

  const plan = plans.find((p) => p.id === subscription.planId);
  if (!plan) {
    return {
      hasActivePlan: false,
      benefits: [],
      discountPercentage: 0,
      canRescheduleForFree: false,
      canCancelForFree: false,
      hasPriorityBooking: false,
      canBookLastMinute: false,
    };
  }

  return {
    hasActivePlan: true,
    planName: plan.name,
    benefits: plan.perks,
    discountPercentage: plan.features.discountPercentage,
    canRescheduleForFree: plan.features.freeRescheduling,
    canCancelForFree: plan.features.waiveCancellationFees,
    hasPriorityBooking: plan.features.priorityBooking,
    canBookLastMinute: plan.features.lastMinuteBooking,
  };
};

export const calculateSubscriptionSavings = (
  subscription: CustomerSubscription,
  usage: SubscriptionUsage[],
  plans: SubscriptionPlan[]
): {
  totalSavings: number;
  monthlyAverage: number;
  breakEvenPoint: number;
  isWorthwhile: boolean;
} => {
  const plan = plans.find((p) => p.id === subscription.planId);
  if (!plan) {
    return {
      totalSavings: 0,
      monthlyAverage: 0,
      breakEvenPoint: 0,
      isWorthwhile: false,
    };
  }

  const totalSavings = usage.reduce((sum, u) => sum + u.savingsAmount, 0);
  const monthlyAverage = usage.length > 0 ? totalSavings / usage.length : 0;
  const breakEvenPoint = plan.price / (plan.features.discountPercentage / 100);
  const isWorthwhile = monthlyAverage > plan.price;

  return {
    totalSavings,
    monthlyAverage,
    breakEvenPoint,
    isWorthwhile,
  };
};

export const getUpgradeRecommendation = (
  currentSubscription: CustomerSubscription | null,
  monthlyBookings: number,
  averageBookingAmount: number,
  plans: SubscriptionPlan[]
): {
  shouldUpgrade: boolean;
  recommendedPlan?: SubscriptionPlan;
  potentialSavings: number;
  reason: string;
} => {
  const currentPlan = currentSubscription
    ? plans.find((p) => p.id === currentSubscription.planId)
    : null;

  // Calculate potential savings for each plan
  const planAnalysis = plans.map((plan) => {
    const monthlyCost = plan.price;
    const discountSavings =
      (averageBookingAmount *
        monthlyBookings *
        plan.features.discountPercentage) /
      100;
    const netSavings = discountSavings - monthlyCost;

    return {
      plan,
      netSavings,
      discountSavings,
      monthlyCost,
    };
  });

  // Find the best plan
  const bestPlan = planAnalysis
    .filter((analysis) => analysis.netSavings > 0)
    .sort((a, b) => b.netSavings - a.netSavings)[0];

  if (!bestPlan) {
    return {
      shouldUpgrade: false,
      potentialSavings: 0,
      reason:
        "No subscription plan would provide savings based on current usage",
    };
  }

  // Check if current plan is already optimal
  if (currentPlan && currentPlan.id === bestPlan.plan.id) {
    return {
      shouldUpgrade: false,
      potentialSavings: 0,
      reason: "You already have the optimal plan for your usage",
    };
  }

  return {
    shouldUpgrade: true,
    recommendedPlan: bestPlan.plan,
    potentialSavings: bestPlan.netSavings,
    reason: `You could save ${bestPlan.netSavings.toFixed(
      2
    )} TND per month with the ${bestPlan.plan.name} plan`,
  };
};

export const isSubscriptionExpiringSoon = (
  subscription: CustomerSubscription,
  daysThreshold: number = 7
): boolean => {
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
};

export const formatSubscriptionStatus = (
  subscription: CustomerSubscription
): {
  statusText: string;
  statusColor: string;
  actionRequired: boolean;
} => {
  const now = new Date();

  switch (subscription.status) {
    case "active":
      if (subscription.endDate < now) {
        return {
          statusText: "Expired",
          statusColor: "#EF4444",
          actionRequired: true,
        };
      }
      if (isSubscriptionExpiringSoon(subscription)) {
        return {
          statusText: "Expiring Soon",
          statusColor: "#F59E0B",
          actionRequired: true,
        };
      }
      return {
        statusText: "Active",
        statusColor: "#10B981",
        actionRequired: false,
      };
    case "cancelled":
      return {
        statusText: "Cancelled",
        statusColor: "#6B7280",
        actionRequired: false,
      };
    case "expired":
      return {
        statusText: "Expired",
        statusColor: "#EF4444",
        actionRequired: true,
      };
    case "pending":
      return {
        statusText: "Pending",
        statusColor: "#F59E0B",
        actionRequired: true,
      };
    default:
      return {
        statusText: "Unknown",
        statusColor: "#6B7280",
        actionRequired: false,
      };
  }
};
