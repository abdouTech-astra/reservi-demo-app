// Advertising data utilities for managing sponsored content and campaigns

export interface SponsoredBusiness {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  ratingCount: number;
  distance: string;
  openNow: boolean;
  isSponsored: true;
  sponsorshipType: "standard" | "featured" | "premium";
  promotionalOffer?: string;
  businessId?: string;
}

export interface AdCampaign {
  id: string;
  businessId: string;
  businessName: string;
  planType: "basic" | "featured" | "premium";
  targetCategory: string;
  campaignName: string;
  promotionalOffer?: string;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "ended";
  impressions: number;
  clicks: number;
  bookings: number;
  spent: number;
  budget: number;
}

// Sample sponsored businesses data
export const sponsoredBusinesses: SponsoredBusiness[] = [
  {
    id: "sp1",
    name: "Premium Salon Deluxe",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    ratingCount: 312,
    distance: "0.5 km",
    openNow: true,
    isSponsored: true,
    sponsorshipType: "premium",
    promotionalOffer: "20% off first visit",
    businessId: "business_001",
  },
  {
    id: "sp2",
    name: "Elite Coffee House",
    category: "Café",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    ratingCount: 198,
    distance: "0.7 km",
    openNow: true,
    isSponsored: true,
    sponsorshipType: "featured",
    promotionalOffer: "Free pastry with coffee",
    businessId: "business_002",
  },
  {
    id: "sp3",
    name: "Royal Barber Club",
    category: "Barber",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    ratingCount: 156,
    distance: "1.0 km",
    openNow: true,
    isSponsored: true,
    sponsorshipType: "standard",
    promotionalOffer: "Traditional shave + haircut combo",
    businessId: "business_003",
  },
  {
    id: "sp4",
    name: "Mediterranean Feast",
    category: "Restaurant",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    ratingCount: 287,
    distance: "1.3 km",
    openNow: true,
    isSponsored: true,
    sponsorshipType: "premium",
    promotionalOffer: "10% off family meals",
    businessId: "business_004",
  },
  {
    id: "sp5",
    name: "Zen Spa & Wellness",
    category: "Spa",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    ratingCount: 145,
    distance: "1.8 km",
    openNow: true,
    isSponsored: true,
    sponsorshipType: "featured",
    promotionalOffer: "Relaxation package special",
    businessId: "business_005",
  },
];

// Mock campaign data
export const mockCampaigns: AdCampaign[] = [
  {
    id: "camp1",
    businessId: "business_001",
    businessName: "Le Petit Café",
    planType: "featured",
    targetCategory: "cafe",
    campaignName: "Holiday Special",
    promotionalOffer: "Free pastry with coffee",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    status: "active",
    impressions: 2450,
    clicks: 187,
    bookings: 23,
    spent: 120,
    budget: 120,
  },
];

/**
 * Get sponsored businesses for a specific category
 */
export const getSponsoredBusinessesByCategory = (
  category: string
): SponsoredBusiness[] => {
  if (category === "all") {
    return sponsoredBusinesses.slice(0, 3); // Show top 3 across all categories
  }

  return sponsoredBusinesses.filter((business) => {
    const businessCategory = business.category.toLowerCase();
    const targetCategory = category.toLowerCase();

    // Handle special case for café vs cafe
    if (targetCategory === "cafe" && businessCategory === "café") {
      return true;
    }
    if (targetCategory === "café" && businessCategory === "cafe") {
      return true;
    }

    return (
      businessCategory === targetCategory ||
      businessCategory.includes(targetCategory)
    );
  });
};

/**
 * Get campaigns for a specific business
 */
export const getCampaignsByBusinessId = (businessId: string): AdCampaign[] => {
  return mockCampaigns.filter((campaign) => campaign.businessId === businessId);
};

/**
 * Track sponsored business click (for analytics)
 */
export const trackSponsoredClick = (
  sponsoredBusinessId: string,
  campaignId?: string
): void => {
  // In a real app, this would send analytics data to a backend
  console.log(`Sponsored click tracked: ${sponsoredBusinessId}`, {
    campaignId,
  });
};

/**
 * Track sponsored business impression (for analytics)
 */
export const trackSponsoredImpression = (
  sponsoredBusinessId: string,
  campaignId?: string
): void => {
  // In a real app, this would send analytics data to a backend
  console.log(`Sponsored impression tracked: ${sponsoredBusinessId}`, {
    campaignId,
  });
};

/**
 * Calculate campaign performance metrics
 */
export const calculateCampaignMetrics = (campaign: AdCampaign) => {
  const clickThroughRate =
    campaign.impressions > 0
      ? (campaign.clicks / campaign.impressions) * 100
      : 0;
  const conversionRate =
    campaign.clicks > 0 ? (campaign.bookings / campaign.clicks) * 100 : 0;
  const costPerClick =
    campaign.clicks > 0 ? campaign.spent / campaign.clicks : 0;
  const costPerBooking =
    campaign.bookings > 0 ? campaign.spent / campaign.bookings : 0;

  return {
    clickThroughRate: Number(clickThroughRate.toFixed(2)),
    conversionRate: Number(conversionRate.toFixed(2)),
    costPerClick: Number(costPerClick.toFixed(2)),
    costPerBooking: Number(costPerBooking.toFixed(2)),
  };
};

/**
 * Get advertising plan pricing and features
 */
export const getAdvertisingPlans = () => {
  return [
    {
      id: "basic",
      name: "Basic Promotion",
      price: 50,
      duration: "7 days",
      features: [
        "Appear in sponsored section",
        "Basic promotion badge",
        "Category-specific targeting",
        "Email support",
      ],
    },
    {
      id: "featured",
      name: "Featured Business",
      price: 120,
      duration: "14 days",
      features: [
        "Premium sponsored placement",
        "Featured badge",
        "All categories visibility",
        "Priority support",
        "Performance analytics",
      ],
      recommended: true,
    },
    {
      id: "premium",
      name: "Premium Campaign",
      price: 200,
      duration: "30 days",
      features: [
        "Top sponsored placement",
        "Premium badge + offer highlight",
        "Cross-category visibility",
        "24/7 priority support",
        "Advanced analytics",
        "Custom promotional offers",
      ],
      popular: true,
    },
  ];
};

/**
 * Validate campaign data before submission
 */
export const validateCampaignData = (data: {
  campaignName: string;
  planId: string;
  targetCategory: string;
}) => {
  const errors: string[] = [];

  if (!data.campaignName || data.campaignName.trim().length < 3) {
    errors.push("Campaign name must be at least 3 characters long");
  }

  if (!data.planId) {
    errors.push("Please select an advertising plan");
  }

  if (!data.targetCategory) {
    errors.push("Please select a target category");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
