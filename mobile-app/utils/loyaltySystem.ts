export interface LoyaltyPoints {
  id: string;
  customerId: string;
  businessId: string;
  points: number;
  earnedFrom: "booking" | "referral" | "review" | "bonus" | "purchase";
  earnedAt: Date;
  description: string;
  bookingId?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: "free_booking" | "discount" | "upgrade" | "gift";
  value: number; // percentage for discount, amount for gift
  isActive: boolean;
  expiresAt?: Date;
  businessId: string;
  icon: string;
  termsAndConditions: string[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  pointsMultiplier: number; // 1.0 = normal, 1.5 = 50% bonus
  color: string;
  icon: string;
  perks: {
    priorityBooking: boolean;
    freeReschedule: boolean;
    reducedCancellationFee: boolean;
    exclusiveOffers: boolean;
  };
}

export interface CustomerLoyalty {
  customerId: string;
  businessId: string;
  totalPoints: number;
  availablePoints: number; // points not yet redeemed
  currentTier: string;
  pointsHistory: LoyaltyPoints[];
  redeemedRewards: {
    rewardId: string;
    redeemedAt: Date;
    pointsSpent: number;
    used: boolean;
    usedAt?: Date;
  }[];
  joinedAt: Date;
  lastActivity: Date;
}

// Default loyalty tiers
export const DEFAULT_LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 0,
    maxPoints: 499,
    benefits: ["Earn 1 point per booking", "Basic customer support"],
    pointsMultiplier: 1.0,
    color: "#CD7F32",
    icon: "medal-outline",
    perks: {
      priorityBooking: false,
      freeReschedule: false,
      reducedCancellationFee: false,
      exclusiveOffers: false,
    },
  },
  {
    id: "silver",
    name: "Silver",
    minPoints: 500,
    maxPoints: 1499,
    benefits: [
      "Earn 1.2x points per booking",
      "Priority customer support",
      "Free rescheduling",
    ],
    pointsMultiplier: 1.2,
    color: "#C0C0C0",
    icon: "medal-outline",
    perks: {
      priorityBooking: false,
      freeReschedule: true,
      reducedCancellationFee: false,
      exclusiveOffers: false,
    },
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 1500,
    maxPoints: 2999,
    benefits: [
      "Earn 1.5x points per booking",
      "Priority booking slots",
      "50% reduced cancellation fees",
      "Exclusive offers",
    ],
    pointsMultiplier: 1.5,
    color: "#FFD700",
    icon: "medal-outline",
    perks: {
      priorityBooking: true,
      freeReschedule: true,
      reducedCancellationFee: true,
      exclusiveOffers: true,
    },
  },
  {
    id: "platinum",
    name: "Platinum",
    minPoints: 3000,
    maxPoints: 9999999,
    benefits: [
      "Earn 2x points per booking",
      "VIP priority booking",
      "Free cancellation anytime",
      "Exclusive VIP offers",
      "Personal concierge service",
    ],
    pointsMultiplier: 2.0,
    color: "#E5E4E2",
    icon: "star-outline",
    perks: {
      priorityBooking: true,
      freeReschedule: true,
      reducedCancellationFee: true,
      exclusiveOffers: true,
    },
  },
];

// Default rewards catalog
export const DEFAULT_REWARDS: LoyaltyReward[] = [
  {
    id: "free_booking_100",
    title: "Free Service Booking",
    description: "Get one free service booking (up to 50 TND value)",
    pointsCost: 100,
    type: "free_booking",
    value: 50,
    isActive: true,
    businessId: "all",
    icon: "gift-outline",
    termsAndConditions: [
      "Valid for services up to 50 TND value",
      "Cannot be combined with other offers",
      "Must be used within 30 days",
    ],
  },
  {
    id: "discount_10_50",
    title: "10% Discount",
    description: "Get 10% off your next booking",
    pointsCost: 50,
    type: "discount",
    value: 10,
    isActive: true,
    businessId: "all",
    icon: "pricetag-outline",
    termsAndConditions: [
      "Valid for one booking only",
      "Minimum booking value 20 TND",
      "Cannot be combined with other discounts",
    ],
  },
  {
    id: "discount_20_150",
    title: "20% Discount",
    description: "Get 20% off your next booking",
    pointsCost: 150,
    type: "discount",
    value: 20,
    isActive: true,
    businessId: "all",
    icon: "pricetag-outline",
    termsAndConditions: [
      "Valid for one booking only",
      "Minimum booking value 50 TND",
      "Cannot be combined with other discounts",
    ],
  },
  {
    id: "upgrade_75",
    title: "Service Upgrade",
    description: "Free upgrade to premium service",
    pointsCost: 75,
    type: "upgrade",
    value: 0,
    isActive: true,
    businessId: "all",
    icon: "arrow-up-circle-outline",
    termsAndConditions: [
      "Subject to availability",
      "Valid for participating services only",
      "Must be requested at time of booking",
    ],
  },
];

export const calculatePointsEarned = (
  bookingAmount: number,
  tier: LoyaltyTier,
  basePointsPerTND: number = 1
): number => {
  const basePoints = Math.floor(bookingAmount * basePointsPerTND);
  return Math.floor(basePoints * tier.pointsMultiplier);
};

export const getCurrentTier = (
  totalPoints: number,
  tiers: LoyaltyTier[] = DEFAULT_LOYALTY_TIERS
): LoyaltyTier => {
  return (
    tiers
      .slice()
      .reverse()
      .find((tier) => totalPoints >= tier.minPoints) || tiers[0]
  );
};

export const getNextTier = (
  currentTier: LoyaltyTier,
  tiers: LoyaltyTier[] = DEFAULT_LOYALTY_TIERS
): LoyaltyTier | null => {
  const currentIndex = tiers.findIndex((tier) => tier.id === currentTier.id);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
};

export const getPointsToNextTier = (
  totalPoints: number,
  tiers: LoyaltyTier[] = DEFAULT_LOYALTY_TIERS
): number => {
  const currentTier = getCurrentTier(totalPoints, tiers);
  const nextTier = getNextTier(currentTier, tiers);
  return nextTier ? nextTier.minPoints - totalPoints : 0;
};

export const getTierProgress = (
  totalPoints: number,
  tiers: LoyaltyTier[] = DEFAULT_LOYALTY_TIERS
): number => {
  const currentTier = getCurrentTier(totalPoints, tiers);
  const tierRange = currentTier.maxPoints - currentTier.minPoints;
  const pointsInTier = totalPoints - currentTier.minPoints;
  return Math.min((pointsInTier / tierRange) * 100, 100);
};

export const canRedeemReward = (
  availablePoints: number,
  reward: LoyaltyReward
): boolean => {
  return availablePoints >= reward.pointsCost && reward.isActive;
};

export const redeemReward = (
  customerLoyalty: CustomerLoyalty,
  rewardId: string,
  rewards: LoyaltyReward[] = DEFAULT_REWARDS
): CustomerLoyalty | null => {
  const reward = rewards.find((r) => r.id === rewardId);
  if (!reward || !canRedeemReward(customerLoyalty.availablePoints, reward)) {
    return null;
  }

  return {
    ...customerLoyalty,
    availablePoints: customerLoyalty.availablePoints - reward.pointsCost,
    redeemedRewards: [
      ...customerLoyalty.redeemedRewards,
      {
        rewardId: reward.id,
        redeemedAt: new Date(),
        pointsSpent: reward.pointsCost,
        used: false,
      },
    ],
    lastActivity: new Date(),
  };
};

export const awardLoyaltyPoints = (
  customerLoyalty: CustomerLoyalty,
  points: number,
  earnedFrom: LoyaltyPoints["earnedFrom"],
  description: string,
  bookingId?: string
): CustomerLoyalty => {
  const newPointsEntry: LoyaltyPoints = {
    id: `points_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    customerId: customerLoyalty.customerId,
    businessId: customerLoyalty.businessId,
    points,
    earnedFrom,
    earnedAt: new Date(),
    description,
    bookingId,
  };

  return {
    ...customerLoyalty,
    totalPoints: customerLoyalty.totalPoints + points,
    availablePoints: customerLoyalty.availablePoints + points,
    pointsHistory: [...customerLoyalty.pointsHistory, newPointsEntry],
    lastActivity: new Date(),
  };
};

export const formatPointsDisplay = (points: number): string => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
};

export const getLoyaltyInsights = (
  customerLoyalty: CustomerLoyalty,
  tiers: LoyaltyTier[] = DEFAULT_LOYALTY_TIERS
): {
  currentTier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsToNext: number;
  tierProgress: number;
  monthlyPoints: number;
  totalRedeemed: number;
} => {
  const currentTier = getCurrentTier(customerLoyalty.totalPoints, tiers);
  const nextTier = getNextTier(currentTier, tiers);
  const pointsToNext = getPointsToNextTier(customerLoyalty.totalPoints, tiers);
  const tierProgress = getTierProgress(customerLoyalty.totalPoints, tiers);

  // Calculate monthly points (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyPoints = customerLoyalty.pointsHistory
    .filter((p) => p.earnedAt >= thirtyDaysAgo)
    .reduce((sum, p) => sum + p.points, 0);

  // Calculate total redeemed points
  const totalRedeemed = customerLoyalty.redeemedRewards.reduce(
    (sum, r) => sum + r.pointsSpent,
    0
  );

  return {
    currentTier,
    nextTier,
    pointsToNext,
    tierProgress,
    monthlyPoints,
    totalRedeemed,
  };
};
