// Configuration for the Reservi app
export const config = {
  // Supabase Configuration
  // Replace these with your actual Supabase project credentials
  supabase: {
    url: "https://lursmicsdimjdtghagyo.supabase.co",
    anonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cnNtaWNzZGltamR0Z2hhZ3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjcwOTcsImV4cCI6MjA2NTA0MzA5N30.KTkhWqkGhaih_WCjEZEKF9xyTUvNPjoMXzF8bNWqCjU",
    serviceRoleKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cnNtaWNzZGltamR0Z2hhZ3lvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ2NzA5NywiZXhwIjoyMDY1MDQzMDk3fQ.bXTc7kar1WGEl5IwstF5qwWw-UdKvUnAiBbv4SvO7KY", // Keep this secret, only for admin operations
  },

  // App Configuration
  app: {
    name: "Reservi",
    version: "1.0.0",
    environment: "development", // development | staging | production
  },

  // Business Configuration
  business: {
    defaultBookingDuration: 60, // minutes
    maxAdvanceBookingDays: 30,
    cancellationHours: 24,
    reminderHours: 24,
  },

  // Advertising Configuration
  advertising: {
    plans: {
      basic: {
        price: 50,
        currency: "TND",
        duration: 30, // days
        maxAds: 5,
      },
      featured: {
        price: 120,
        currency: "TND",
        duration: 30,
        maxAds: 15,
      },
      premium: {
        price: 200,
        currency: "TND",
        duration: 30,
        maxAds: -1, // unlimited
      },
    },
  },

  // Loyalty & Rewards Configuration
  loyalty: {
    pointsPerBooking: 10,
    pointsPerSpent: 0.1, // 0.1 points per TND spent
    referralBonus: 50,
    welcomeBonus: 50,
  },

  // Notification Configuration
  notifications: {
    reminderHours: [24, 2], // Send reminders 24h and 2h before booking
    promotionCooldownDays: 7,
  },
};
