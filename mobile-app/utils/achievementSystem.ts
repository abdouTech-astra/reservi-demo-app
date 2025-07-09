export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  gemstone: GemstoneType;
  points: number;
  category: "booking" | "loyalty" | "social" | "business" | "special";
  requirement: {
    type: "count" | "streak" | "amount" | "rating" | "time" | "special";
    target: number;
    metric: string;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
}

export interface Gemstone {
  id: string;
  name: string;
  type: GemstoneType;
  rarity: "common" | "rare" | "epic" | "legendary";
  color: string;
  glowColor: string;
  points: number;
  description: string;
  icon: string;
}

export type GemstoneType =
  | "ruby"
  | "emerald"
  | "sapphire"
  | "diamond"
  | "amethyst"
  | "topaz"
  | "opal"
  | "pearl"
  | "garnet"
  | "turquoise";

export interface UserLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  gemstoneReward?: GemstoneType;
  color: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  type: "customer" | "business";
  level: number;
  totalPoints: number;
  currentLevelProgress: number;
  achievements: Achievement[];
  gemstones: Gemstone[];
  stats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShows: number;
    totalSpent: number;
    averageRating: number;
    streakDays: number;
    referrals: number;
    reviewsGiven: number;
    // Business specific
    totalRevenue?: number;
    customersServed?: number;
    averageServiceRating?: number;
    businessAge?: number;
  };
}

// Predefined gemstones
export const GEMSTONES: Record<GemstoneType, Gemstone> = {
  ruby: {
    id: "ruby",
    name: "Ruby",
    type: "ruby",
    rarity: "rare",
    color: "#E53E3E",
    glowColor: "#FEB2B2",
    points: 50,
    description: "A precious red gemstone symbolizing passion and energy",
    icon: "diamond-outline",
  },
  emerald: {
    id: "emerald",
    name: "Emerald",
    type: "emerald",
    rarity: "rare",
    color: "#38A169",
    glowColor: "#9AE6B4",
    points: 50,
    description: "A vibrant green gemstone representing growth and harmony",
    icon: "diamond-outline",
  },
  sapphire: {
    id: "sapphire",
    name: "Sapphire",
    type: "sapphire",
    rarity: "epic",
    color: "#3182CE",
    glowColor: "#90CDF4",
    points: 100,
    description: "A brilliant blue gemstone of wisdom and loyalty",
    icon: "diamond-outline",
  },
  diamond: {
    id: "diamond",
    name: "Diamond",
    type: "diamond",
    rarity: "legendary",
    color: "#E2E8F0",
    glowColor: "#F7FAFC",
    points: 200,
    description: "The ultimate gemstone representing perfection and strength",
    icon: "diamond-outline",
  },
  amethyst: {
    id: "amethyst",
    name: "Amethyst",
    type: "amethyst",
    rarity: "rare",
    color: "#805AD5",
    glowColor: "#D6BCFA",
    points: 75,
    description: "A mystical purple gemstone of clarity and peace",
    icon: "diamond-outline",
  },
  topaz: {
    id: "topaz",
    name: "Topaz",
    type: "topaz",
    rarity: "common",
    color: "#D69E2E",
    glowColor: "#F6E05E",
    points: 25,
    description: "A golden gemstone bringing joy and abundance",
    icon: "diamond-outline",
  },
  opal: {
    id: "opal",
    name: "Opal",
    type: "opal",
    rarity: "epic",
    color: "#4FD1C7",
    glowColor: "#9DECF9",
    points: 125,
    description: "A magical gemstone with shifting colors and mystery",
    icon: "diamond-outline",
  },
  pearl: {
    id: "pearl",
    name: "Pearl",
    type: "pearl",
    rarity: "common",
    color: "#F7FAFC",
    glowColor: "#EDF2F7",
    points: 30,
    description: "An elegant gemstone symbolizing purity and wisdom",
    icon: "ellipse-outline",
  },
  garnet: {
    id: "garnet",
    name: "Garnet",
    type: "garnet",
    rarity: "common",
    color: "#C53030",
    glowColor: "#FED7D7",
    points: 20,
    description: "A deep red gemstone of commitment and devotion",
    icon: "diamond-outline",
  },
  turquoise: {
    id: "turquoise",
    name: "Turquoise",
    type: "turquoise",
    rarity: "rare",
    color: "#319795",
    glowColor: "#81E6D9",
    points: 60,
    description: "A protective blue-green gemstone of healing and friendship",
    icon: "diamond-outline",
  },
};

// Level system
export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    title: "Newcomer",
    minPoints: 0,
    maxPoints: 99,
    benefits: ["Basic booking features"],
    color: "#718096",
    icon: "person-outline",
  },
  {
    level: 2,
    title: "Explorer",
    minPoints: 100,
    maxPoints: 249,
    benefits: ["Priority customer support", "5% booking discount"],
    gemstoneReward: "garnet",
    color: "#C53030",
    icon: "compass-outline",
  },
  {
    level: 3,
    title: "Regular",
    minPoints: 250,
    maxPoints: 499,
    benefits: ["Extended cancellation window", "10% booking discount"],
    gemstoneReward: "topaz",
    color: "#D69E2E",
    icon: "star-outline",
  },
  {
    level: 4,
    title: "Enthusiast",
    minPoints: 500,
    maxPoints: 999,
    benefits: ["Early access to new features", "15% booking discount"],
    gemstoneReward: "pearl",
    color: "#38A169",
    icon: "heart-outline",
  },
  {
    level: 5,
    title: "VIP",
    minPoints: 1000,
    maxPoints: 1999,
    benefits: [
      "VIP customer support",
      "20% booking discount",
      "Free cancellations",
    ],
    gemstoneReward: "turquoise",
    color: "#319795",
    icon: "crown-outline",
  },
  {
    level: 6,
    title: "Elite",
    minPoints: 2000,
    maxPoints: 3999,
    benefits: [
      "Personal booking assistant",
      "25% booking discount",
      "Priority booking",
    ],
    gemstoneReward: "ruby",
    color: "#E53E3E",
    icon: "trophy-outline",
  },
  {
    level: 7,
    title: "Master",
    minPoints: 4000,
    maxPoints: 7999,
    benefits: [
      "Exclusive events access",
      "30% booking discount",
      "Custom booking preferences",
    ],
    gemstoneReward: "emerald",
    color: "#38A169",
    icon: "medal-outline",
  },
  {
    level: 8,
    title: "Legend",
    minPoints: 8000,
    maxPoints: 15999,
    benefits: [
      "Legendary status badge",
      "35% booking discount",
      "Unlimited free cancellations",
    ],
    gemstoneReward: "amethyst",
    color: "#805AD5",
    icon: "flash-outline",
  },
  {
    level: 9,
    title: "Champion",
    minPoints: 16000,
    maxPoints: 31999,
    benefits: [
      "Champion privileges",
      "40% booking discount",
      "Beta feature access",
    ],
    gemstoneReward: "sapphire",
    color: "#3182CE",
    icon: "shield-outline",
  },
  {
    level: 10,
    title: "Diamond Elite",
    minPoints: 32000,
    maxPoints: 999999,
    benefits: [
      "Ultimate privileges",
      "50% booking discount",
      "Lifetime VIP status",
    ],
    gemstoneReward: "diamond",
    color: "#E2E8F0",
    icon: "diamond-outline",
  },
];

// Customer achievements
export const CUSTOMER_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_booking",
    title: "First Steps",
    description: "Complete your first booking",
    icon: "footsteps-outline",
    gemstone: "garnet",
    points: 50,
    category: "booking",
    requirement: { type: "count", target: 1, metric: "bookings" },
    rarity: "common",
    unlocked: false,
    progress: 0,
  },
  {
    id: "booking_streak_7",
    title: "Weekly Warrior",
    description: "Book services for 7 consecutive days",
    icon: "calendar-outline",
    gemstone: "topaz",
    points: 100,
    category: "booking",
    requirement: { type: "streak", target: 7, metric: "booking_days" },
    rarity: "rare",
    unlocked: false,
    progress: 0,
  },
  {
    id: "loyal_customer",
    title: "Loyal Customer",
    description: "Complete 25 bookings",
    icon: "heart-outline",
    gemstone: "ruby",
    points: 200,
    category: "loyalty",
    requirement: { type: "count", target: 25, metric: "completed_bookings" },
    rarity: "rare",
    unlocked: false,
    progress: 0,
  },
  {
    id: "big_spender",
    title: "Big Spender",
    description: "Spend 1000 TND on bookings",
    icon: "cash-outline",
    gemstone: "emerald",
    points: 300,
    category: "loyalty",
    requirement: { type: "amount", target: 1000, metric: "total_spent" },
    rarity: "epic",
    unlocked: false,
    progress: 0,
  },
  {
    id: "perfect_rating",
    title: "Perfect Customer",
    description: "Maintain 5.0 average rating with 10+ reviews",
    icon: "star-outline",
    gemstone: "diamond",
    points: 500,
    category: "social",
    requirement: { type: "rating", target: 5.0, metric: "average_rating" },
    rarity: "legendary",
    unlocked: false,
    progress: 0,
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Book 10 services before 9 AM",
    icon: "sunny-outline",
    gemstone: "pearl",
    points: 75,
    category: "booking",
    requirement: { type: "count", target: 10, metric: "early_bookings" },
    rarity: "common",
    unlocked: false,
    progress: 0,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Book 10 services after 7 PM",
    icon: "moon-outline",
    gemstone: "amethyst",
    points: 75,
    category: "booking",
    requirement: { type: "count", target: 10, metric: "late_bookings" },
    rarity: "common",
    unlocked: false,
    progress: 0,
  },
  {
    id: "social_butterfly",
    title: "Social Butterfly",
    description: "Refer 5 friends to the platform",
    icon: "people-outline",
    gemstone: "opal",
    points: 250,
    category: "social",
    requirement: { type: "count", target: 5, metric: "referrals" },
    rarity: "epic",
    unlocked: false,
    progress: 0,
  },
  {
    id: "reviewer",
    title: "Helpful Reviewer",
    description: "Leave 20 detailed reviews",
    icon: "chatbubble-outline",
    gemstone: "turquoise",
    points: 150,
    category: "social",
    requirement: { type: "count", target: 20, metric: "reviews_given" },
    rarity: "rare",
    unlocked: false,
    progress: 0,
  },
  {
    id: "weekend_warrior",
    title: "Weekend Warrior",
    description: "Book 15 weekend services",
    icon: "wine-outline",
    gemstone: "sapphire",
    points: 125,
    category: "booking",
    requirement: { type: "count", target: 15, metric: "weekend_bookings" },
    rarity: "rare",
    unlocked: false,
    progress: 0,
  },
];

// Business achievements
export const BUSINESS_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_customer",
    title: "First Customer",
    description: "Serve your first customer",
    icon: "person-add-outline",
    gemstone: "garnet",
    points: 100,
    category: "business",
    requirement: { type: "count", target: 1, metric: "customers_served" },
    rarity: "common",
    unlocked: false,
    progress: 0,
  },
  {
    id: "hundred_customers",
    title: "Century Club",
    description: "Serve 100 customers",
    icon: "people-outline",
    gemstone: "ruby",
    points: 500,
    category: "business",
    requirement: { type: "count", target: 100, metric: "customers_served" },
    rarity: "rare",
    unlocked: false,
    progress: 0,
  },
  {
    id: "revenue_milestone",
    title: "Revenue Master",
    description: "Generate 10,000 TND in revenue",
    icon: "trending-up-outline",
    gemstone: "emerald",
    points: 750,
    category: "business",
    requirement: { type: "amount", target: 10000, metric: "total_revenue" },
    rarity: "epic",
    unlocked: false,
    progress: 0,
  },
  {
    id: "perfect_service",
    title: "Perfect Service",
    description: "Maintain 5.0 average rating with 50+ reviews",
    icon: "star-outline",
    gemstone: "diamond",
    points: 1000,
    category: "business",
    requirement: {
      type: "rating",
      target: 5.0,
      metric: "average_service_rating",
    },
    rarity: "legendary",
    unlocked: false,
    progress: 0,
  },
  {
    id: "reliable_business",
    title: "Reliable Partner",
    description: "Complete 500 bookings without cancellation",
    icon: "checkmark-circle-outline",
    gemstone: "sapphire",
    points: 400,
    category: "business",
    requirement: { type: "count", target: 500, metric: "completed_bookings" },
    rarity: "epic",
    unlocked: false,
    progress: 0,
  },
  {
    id: "quick_responder",
    title: "Quick Responder",
    description: "Respond to 100 bookings within 5 minutes",
    icon: "flash-outline",
    gemstone: "topaz",
    points: 200,
    category: "business",
    requirement: { type: "count", target: 100, metric: "quick_responses" },
    rarity: "rare",
    unlocked: false,
    progress: 0,
  },
  {
    id: "veteran_business",
    title: "Veteran Business",
    description: "Operate for 365 days on the platform",
    icon: "time-outline",
    gemstone: "amethyst",
    points: 300,
    category: "business",
    requirement: { type: "time", target: 365, metric: "business_age" },
    rarity: "rare",
    unlocked: false,
    progress: 0,
  },
  {
    id: "customer_favorite",
    title: "Customer Favorite",
    description: "Get 100 repeat customers",
    icon: "heart-outline",
    gemstone: "opal",
    points: 350,
    category: "business",
    requirement: { type: "count", target: 100, metric: "repeat_customers" },
    rarity: "epic",
    unlocked: false,
    progress: 0,
  },
];

// Utility functions
export const getUserLevel = (points: number): UserLevel => {
  return (
    USER_LEVELS.find(
      (level) => points >= level.minPoints && points <= level.maxPoints
    ) || USER_LEVELS[0]
  );
};

export const getNextLevel = (currentLevel: number): UserLevel | null => {
  return USER_LEVELS.find((level) => level.level === currentLevel + 1) || null;
};

export const calculateLevelProgress = (points: number): number => {
  const currentLevel = getUserLevel(points);
  const progressInLevel = points - currentLevel.minPoints;
  const levelRange = currentLevel.maxPoints - currentLevel.minPoints;
  return Math.min((progressInLevel / levelRange) * 100, 100);
};

export const checkAchievementProgress = (
  achievement: Achievement,
  userStats: UserProfile["stats"]
): number => {
  const { requirement } = achievement;
  let currentValue = 0;

  switch (requirement.metric) {
    case "bookings":
      currentValue = userStats.totalBookings;
      break;
    case "completed_bookings":
      currentValue = userStats.completedBookings;
      break;
    case "total_spent":
      currentValue = userStats.totalSpent;
      break;
    case "average_rating":
      currentValue = userStats.averageRating;
      break;
    case "referrals":
      currentValue = userStats.referrals;
      break;
    case "reviews_given":
      currentValue = userStats.reviewsGiven;
      break;
    case "customers_served":
      currentValue = userStats.customersServed || 0;
      break;
    case "total_revenue":
      currentValue = userStats.totalRevenue || 0;
      break;
    case "average_service_rating":
      currentValue = userStats.averageServiceRating || 0;
      break;
    case "business_age":
      currentValue = userStats.businessAge || 0;
      break;
    default:
      currentValue = 0;
  }

  return Math.min((currentValue / requirement.target) * 100, 100);
};

export const awardPoints = (
  userProfile: UserProfile,
  points: number,
  reason: string
): UserProfile => {
  const newTotalPoints = userProfile.totalPoints + points;
  const newLevel = getUserLevel(newTotalPoints);
  const oldLevel = getUserLevel(userProfile.totalPoints);

  // Check if user leveled up and award gemstone
  let newGemstones = [...userProfile.gemstones];
  if (newLevel.level > oldLevel.level && newLevel.gemstoneReward) {
    const gemstone = GEMSTONES[newLevel.gemstoneReward];
    newGemstones.push(gemstone);
  }

  return {
    ...userProfile,
    totalPoints: newTotalPoints,
    level: newLevel.level,
    currentLevelProgress: calculateLevelProgress(newTotalPoints),
    gemstones: newGemstones,
  };
};

export const unlockAchievement = (
  userProfile: UserProfile,
  achievementId: string
): UserProfile => {
  const achievements = userProfile.achievements.map((achievement) => {
    if (achievement.id === achievementId && !achievement.unlocked) {
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date(),
        progress: 100,
      };
    }
    return achievement;
  });

  // Find the unlocked achievement and award points + gemstone
  const unlockedAchievement = achievements.find((a) => a.id === achievementId);
  if (unlockedAchievement && unlockedAchievement.unlocked) {
    const updatedProfile = awardPoints(
      userProfile,
      unlockedAchievement.points,
      `Achievement: ${unlockedAchievement.title}`
    );
    const gemstone = GEMSTONES[unlockedAchievement.gemstone];

    return {
      ...updatedProfile,
      achievements,
      gemstones: [...updatedProfile.gemstones, gemstone],
    };
  }

  return { ...userProfile, achievements };
};

export const updateAchievementProgress = (
  userProfile: UserProfile
): UserProfile => {
  const achievements = userProfile.achievements.map((achievement) => {
    if (!achievement.unlocked) {
      const progress = checkAchievementProgress(achievement, userProfile.stats);
      return { ...achievement, progress };
    }
    return achievement;
  });

  return { ...userProfile, achievements };
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case "common":
      return "#718096";
    case "rare":
      return "#3182CE";
    case "epic":
      return "#805AD5";
    case "legendary":
      return "#D69E2E";
    default:
      return "#718096";
  }
};

export const getRarityGlow = (rarity: string): string => {
  switch (rarity) {
    case "common":
      return "#E2E8F0";
    case "rare":
      return "#90CDF4";
    case "epic":
      return "#D6BCFA";
    case "legendary":
      return "#F6E05E";
    default:
      return "#E2E8F0";
  }
};
