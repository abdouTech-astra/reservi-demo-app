# Advertising System Implementation

## Overview

The advertising system allows businesses to promote their services through sponsored content that appears prominently in the customer app. This system includes both customer-facing sponsored content and business-facing advertising management tools.

## Features

### Customer Side (CustomerHomeScreen)

1. **Sponsored Content Display**

   - Sponsored businesses appear in a dedicated "Featured Businesses" section
   - Displays after category selection with category-specific filtering
   - Prominent "Sponsored" badge and promotional offers
   - Enhanced visual design with special styling

2. **Category-Based Filtering**

   - Sponsored content adapts to selected category
   - Shows relevant businesses for each category
   - Displays top businesses across all categories when "All" is selected

3. **Analytics Tracking**
   - Automatic impression tracking when sponsored content is displayed
   - Click tracking for business profile views
   - Separate tracking for booking button clicks

### Business Side (BusinessAdvertisingScreen)

1. **Advertising Plans**

   - **Basic Promotion** (50 TND/7 days): Basic sponsored placement
   - **Featured Business** (120 TND/14 days): Premium placement with analytics
   - **Premium Campaign** (200 TND/30 days): Top placement with custom offers

2. **Campaign Management**

   - View active campaigns with performance metrics
   - Pause/resume campaigns
   - Track impressions, clicks, bookings, and spending

3. **Campaign Setup**
   - Custom campaign naming
   - Promotional offer configuration
   - Category targeting options
   - Auto-renewal settings

## File Structure

```
mobile-app/
├── screens/
│   ├── customer/
│   │   └── CustomerHomeScreen.tsx     # Customer-facing sponsored content
│   └── business/
│       └── BusinessAdvertisingScreen.tsx  # Business advertising management
├── utils/
│   └── advertisingData.ts             # Shared advertising utilities
└── ADVERTISING_SYSTEM.md              # This documentation
```

## Key Components

### Shared Utilities (`utils/advertisingData.ts`)

- `getSponsoredBusinessesByCategory()`: Filters sponsored businesses by category
- `trackSponsoredClick()`: Records click events for analytics
- `trackSponsoredImpression()`: Records impression events for analytics
- `calculateCampaignMetrics()`: Computes campaign performance metrics
- `validateCampaignData()`: Validates campaign setup data

### Customer Components

- **Sponsored Card**: Enhanced business card with promotional styling
- **Category Filtering**: Dynamic content based on selected category
- **Analytics Integration**: Automatic tracking of user interactions

### Business Components

- **Plan Cards**: Visual representation of advertising plans
- **Campaign Dashboard**: Overview of active campaigns and metrics
- **Purchase Modal**: Campaign setup and configuration interface

## Usage

### For Customers

1. Open the app and navigate to the home screen
2. Select a category to see relevant sponsored businesses
3. Sponsored content appears in the "Featured Businesses" section
4. Click on sponsored businesses to view details or book services

### For Businesses

1. Navigate to Business Dashboard
2. Click on "Advertise" in the quick actions
3. View current campaigns or purchase new advertising plans
4. Configure campaign details and promotional offers
5. Monitor campaign performance through analytics

## Analytics & Tracking

The system tracks the following metrics:

- **Impressions**: How many times sponsored content is displayed
- **Clicks**: User interactions with sponsored content
- **Bookings**: Conversions from sponsored content to actual bookings
- **Performance Metrics**: Click-through rates, conversion rates, cost per click

## Integration Points

### Navigation

- Added `BusinessAdvertising` route to navigation stack
- Accessible from Business Dashboard quick actions
- Deep linking support at `/business/advertising`

### Data Flow

1. Businesses purchase advertising campaigns
2. Campaign data is stored and managed
3. Customer app queries sponsored content by category
4. Analytics track user interactions
5. Performance metrics are calculated and displayed

## Future Enhancements

1. **Real-time Analytics**: Live campaign performance updates
2. **A/B Testing**: Test different promotional offers
3. **Geo-targeting**: Location-based sponsored content
4. **Budget Management**: Daily/weekly spending limits
5. **Advanced Targeting**: Customer demographics and preferences
6. **Automated Bidding**: Dynamic pricing based on competition

## Technical Notes

- Uses React Native with TypeScript
- Modular architecture with shared utilities
- Mock data for development and testing
- Responsive design for various screen sizes
- Accessibility considerations for sponsored content labeling

## Testing

To test the advertising system:

1. Run the app in development mode
2. Navigate to Customer Home and switch between categories
3. Observe sponsored content changes
4. Access Business Dashboard and click "Advertise"
5. Test campaign creation flow
6. Check console for analytics tracking logs
