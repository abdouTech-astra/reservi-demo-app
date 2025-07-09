# Implementation Guide - Gamification & Waitlist Features

## Quick Start

### 1. Gamification System Usage

#### Import the Achievement System

```typescript
import {
  UserProfile,
  Achievement,
  Gemstone,
  getUserLevel,
  awardPoints,
  unlockAchievement,
  updateAchievementProgress,
  CUSTOMER_ACHIEVEMENTS,
  BUSINESS_ACHIEVEMENTS,
  GEMSTONES,
} from "../utils/achievementSystem";
```

#### Award Points to User

```typescript
// Award points for completing a booking
const updatedProfile = awardPoints(userProfile, 50, "Booking completed");

// Check for level up
const oldLevel = getUserLevel(userProfile.totalPoints);
const newLevel = getUserLevel(updatedProfile.totalPoints);
if (newLevel.level > oldLevel.level) {
  // User leveled up! Show celebration
  showLevelUpModal(newLevel);
}
```

#### Track Achievement Progress

```typescript
// Update achievement progress based on user stats
const profileWithProgress = updateAchievementProgress(userProfile);

// Check for newly unlocked achievements
const newlyUnlocked = profileWithProgress.achievements.filter(
  (achievement, index) =>
    achievement.unlocked && !userProfile.achievements[index].unlocked
);

// Unlock specific achievement
if (userStats.totalBookings >= 25) {
  const updatedProfile = unlockAchievement(userProfile, "loyal_customer");
}
```

#### Display User Level Information

```typescript
const currentLevel = getUserLevel(userProfile.totalPoints);
const nextLevel = getNextLevel(currentLevel.level);
const progress = calculateLevelProgress(userProfile.totalPoints);

console.log(`User is ${currentLevel.title} (Level ${currentLevel.level})`);
console.log(`Progress to next level: ${progress}%`);
```

### 2. Waitlist System Usage

#### Import the Waitlist System

```typescript
import {
  WaitlistEntry,
  WaitlistNotification,
  createWaitlistEntry,
  processWaitlistForCancellation,
  getWaitlistPosition,
  getWaitlistSummary,
  DEFAULT_WAITLIST_SETTINGS,
} from "../utils/waitlistSystem";
```

#### Create Waitlist Entry

```typescript
const waitlistEntry = createWaitlistEntry(
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
  customerLevel,
  isVip,
  waitlistSettings
);
```

#### Handle Booking Cancellation

```typescript
// When a booking is cancelled, notify waitlist
const { notifiedEntries, notifications } = processWaitlistForCancellation(
  cancelledDate,
  cancelledTime,
  serviceId,
  businessId,
  waitlistEntries,
  waitlistSettings
);

// Send notifications to customers
notifications.forEach((notification) => {
  sendPushNotification(notification);
});
```

#### Get Waitlist Information

```typescript
// Get customer's position in waitlist
const position = getWaitlistPosition(waitlistEntries, entryId);

// Get customer's waitlist summary
const summary = getWaitlistSummary(waitlistEntries, customerId);
console.log(`Active waitlists: ${summary.activeEntries}`);
console.log(`Best position: #${summary.topPosition}`);
```

## Integration Examples

### 1. Booking Completion Hook

```typescript
const handleBookingComplete = async (bookingData: BookingData) => {
  // Award points for booking completion
  let updatedProfile = awardPoints(userProfile, 25, "Booking completed");

  // Check for achievement unlocks
  if (userProfile.stats.totalBookings === 0) {
    // First booking achievement
    updatedProfile = unlockAchievement(updatedProfile, "first_booking");
  }

  // Update user stats
  updatedProfile.stats.totalBookings += 1;
  updatedProfile.stats.completedBookings += 1;
  updatedProfile.stats.totalSpent += bookingData.amount;

  // Update achievement progress
  updatedProfile = updateAchievementProgress(updatedProfile);

  // Save to database
  await saveUserProfile(updatedProfile);

  // Show success feedback
  showBookingSuccessWithRewards(updatedProfile);
};
```

### 2. Booking Cancellation Hook

```typescript
const handleBookingCancellation = async (bookingData: BookingData) => {
  // Process waitlist for this cancelled slot
  const { notifiedEntries, notifications } = processWaitlistForCancellation(
    bookingData.date,
    bookingData.time,
    bookingData.serviceId,
    bookingData.businessId,
    await getWaitlistEntries(bookingData.businessId),
    await getWaitlistSettings(bookingData.businessId)
  );

  // Send notifications
  for (const notification of notifications) {
    await sendWaitlistNotification(notification);
  }

  // Update waitlist entries in database
  await updateWaitlistEntries(notifiedEntries);
};
```

### 3. Real-time Waitlist Updates

```typescript
// Set up real-time position updates
const setupWaitlistUpdates = (customerId: string) => {
  const interval = setInterval(async () => {
    const customerEntries = await getCustomerWaitlistEntries(customerId);

    for (const entry of customerEntries) {
      const currentPosition = getWaitlistPosition(
        await getAllWaitlistEntries(entry.businessId),
        entry.id
      );

      // If position changed significantly, notify customer
      if (Math.abs(currentPosition - entry.lastKnownPosition) >= 3) {
        const notification = createPositionUpdateNotification(
          entry,
          currentPosition,
          estimateWaitTime(currentPosition, waitlistSettings)
        );

        await sendWaitlistNotification(notification);
        entry.lastKnownPosition = currentPosition;
      }
    }
  }, 30000); // Check every 30 seconds

  return () => clearInterval(interval);
};
```

## Custom Achievement Creation

### Define New Achievement

```typescript
const customAchievement: Achievement = {
  id: "social_media_share",
  title: "Social Butterfly",
  description: "Share your booking on social media",
  icon: "share-social-outline",
  gemstone: "opal",
  points: 100,
  category: "social",
  requirement: {
    type: "count",
    target: 1,
    metric: "social_shares",
  },
  rarity: "rare",
  unlocked: false,
  progress: 0,
};
```

### Custom Point Calculation

```typescript
const calculateCustomPoints = (action: string, context: any): number => {
  switch (action) {
    case "weekend_booking":
      return 30; // Extra points for weekend bookings
    case "early_morning_booking":
      return 20; // Bonus for early bookings
    case "last_minute_booking":
      return 15; // Points for filling last-minute slots
    case "review_with_photo":
      return 40; // Extra points for photo reviews
    default:
      return 10; // Base points
  }
};
```

## Waitlist Configuration

### Business-Specific Settings

```typescript
const restaurantWaitlistSettings: WaitlistSettings = {
  businessId: "restaurant_123",
  enabled: true,
  maxWaitlistSize: 30, // Smaller for restaurants
  notificationWindow: 15, // Quick response needed
  maxNotificationsPerEntry: 2,
  priorityRules: {
    vipCustomers: true,
    loyaltyLevel: true,
    firstComeFirstServe: false, // VIP priority over FCFS
  },
  autoExpiry: {
    enabled: true,
    hours: 4, // Shorter expiry for restaurants
  },
  estimatedWaitTime: {
    enabled: true,
    averageSlotDuration: 90, // 1.5 hours average meal time
  },
};

const salonWaitlistSettings: WaitlistSettings = {
  businessId: "salon_456",
  enabled: true,
  maxWaitlistSize: 50,
  notificationWindow: 60, // More time to respond
  maxNotificationsPerEntry: 3,
  priorityRules: {
    vipCustomers: true,
    loyaltyLevel: true,
    firstComeFirstServe: true,
  },
  autoExpiry: {
    enabled: true,
    hours: 48, // Longer expiry for salons
  },
  estimatedWaitTime: {
    enabled: true,
    averageSlotDuration: 120, // 2 hours average service time
  },
};
```

## Testing Utilities

### Mock Data Generation

```typescript
// Generate test user profile
const createTestUserProfile = (level: number): UserProfile => {
  const points = USER_LEVELS[level - 1]?.minPoints || 0;
  return {
    id: `test_user_${Date.now()}`,
    type: "customer",
    level,
    totalPoints: points,
    currentLevelProgress: calculateLevelProgress(points),
    achievements: CUSTOMER_ACHIEVEMENTS.map((achievement, index) => ({
      ...achievement,
      unlocked: index < level,
      progress: index < level ? 100 : Math.random() * 80,
    })),
    gemstones: Object.values(GEMSTONES).slice(0, level),
    stats: {
      totalBookings: level * 5,
      completedBookings: level * 4,
      cancelledBookings: level,
      noShows: 0,
      totalSpent: level * 100,
      averageRating: 4.5 + level * 0.05,
      streakDays: level * 2,
      referrals: Math.floor(level / 2),
      reviewsGiven: level * 3,
    },
  };
};

// Generate test waitlist entries
const createTestWaitlistEntries = (count: number): WaitlistEntry[] => {
  return Array.from({ length: count }, (_, i) =>
    createWaitlistEntry(
      `customer_${i}`,
      `Test Customer ${i}`,
      `+216 20 ${String(i).padStart(6, "0")}`,
      "test_business",
      "Test Business",
      "test_service",
      "Test Service",
      new Date().toISOString().split("T")[0],
      "10:00 AM",
      [],
      Math.floor(Math.random() * 10) + 1,
      Math.random() > 0.8,
      DEFAULT_WAITLIST_SETTINGS
    )
  );
};
```

## Performance Optimization

### Efficient Achievement Checking

```typescript
// Batch achievement progress updates
const batchUpdateAchievements = (
  userProfiles: UserProfile[]
): UserProfile[] => {
  return userProfiles.map((profile) => {
    // Only update achievements that could have changed
    const relevantAchievements = profile.achievements.filter(
      (achievement) => !achievement.unlocked && achievement.progress < 100
    );

    // Update only relevant achievements
    const updatedAchievements = profile.achievements.map((achievement) => {
      if (relevantAchievements.includes(achievement)) {
        return {
          ...achievement,
          progress: checkAchievementProgress(achievement, profile.stats),
        };
      }
      return achievement;
    });

    return { ...profile, achievements: updatedAchievements };
  });
};
```

### Waitlist Memory Management

```typescript
// Clean up expired entries periodically
const cleanupWaitlists = async () => {
  const allEntries = await getAllWaitlistEntries();
  const { activeEntries, expiredEntries } = cleanupExpiredEntries(allEntries);

  // Archive expired entries instead of deleting
  await archiveWaitlistEntries(expiredEntries);
  await updateActiveWaitlistEntries(activeEntries);

  console.log(`Cleaned up ${expiredEntries.length} expired waitlist entries`);
};

// Run cleanup every hour
setInterval(cleanupWaitlists, 60 * 60 * 1000);
```

This implementation guide provides practical examples for integrating and extending both the gamification and waitlist systems in your application.
