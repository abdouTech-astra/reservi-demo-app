# Reservili - Enhanced Appointment Booking App

A comprehensive React Native appointment booking application with advanced payment processing, cancellation policies, and business management features.

## 🚀 Features

### Customer Features

- **Smart Booking System**: Free bookings by default with paid options for weekends/special days
- **Secure Payment Processing**: Integration with Paymee and Flouci payment gateways
- **Flexible Cancellation**: 2-hour cancellation policy with fee handling
- **Service Selection**: Browse and book various services with pricing
- **Booking Management**: View, modify, and cancel bookings
- **Real-time Updates**: Live booking status updates

### Business Features

- **Comprehensive Dashboard**: View bookings, customer insights, and revenue analytics
- **Customer Reliability Tracking**: Automated scoring based on no-shows and cancellations
- **Flexible Policy Configuration**: Customizable payment and cancellation policies
- **Payment Insights**: Track paid vs free bookings and revenue
- **Booking Management**: Update booking statuses, handle disputes
- **Business Settings**: Configure fees, policies, and operational preferences

### Payment & Policy Features

- **Dynamic Pricing**: Weekend and special day fees
- **Payment Types**: Reservation fees (non-refundable) or deductibles (from final bill)
- **Cancellation Policies**: Configurable time windows and penalty rules
- **Special Days**: Pre-configured Tunisian holidays with custom day support
- **Secure Processing**: WebView-based payment with no card data storage

## 🛠 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- React Native development environment

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reservi-demo-app/mobile-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install additional dependencies**

   ```bash
   npx expo install expo-web-browser expo-linking react-native-webview
   ```

4. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on device/simulator**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 📱 App Structure

```
mobile-app/
├── screens/
│   ├── customer/
│   │   ├── BookingScreen.tsx          # Enhanced booking with payment logic
│   │   ├── PaymentScreen.tsx          # Secure payment processing
│   │   ├── CancellationScreen.tsx     # Cancellation with policy handling
│   │   └── ...
│   └── business/
│       ├── BusinessDashboardScreen.tsx # Enhanced with reliability scores
│       ├── BusinessSettingsScreen.tsx  # Policy configuration
│       └── ...
├── utils/
│   ├── paymentUtils.ts               # Payment processing utilities
│   ├── bookingUtils.ts               # Booking logic and policies
│   └── ...
├── components/
└── docs/
    └── WORKFLOW_DOCUMENTATION.md     # Comprehensive workflow docs
```

## 🔧 Configuration

### Business Policy Settings

Navigate to Business Settings > Payment & Booking Policies to configure:

- **Allow Free Weekend Bookings**: Toggle weekend payment requirements
- **Accept Walk-ins Only**: Disable advance bookings
- **Refund Booking Fees**: Control refund policy for cancellations
- **Fee Amounts**: Set weekend and special day fees (default: 30 TND)
- **Cancellation Window**: Hours before booking to cancel without penalty (default: 2 hours)
- **Fee Type**: Choose between reservation fee or deductible

### Payment Gateway Configuration

Update payment provider settings in `utils/paymentUtils.ts`:

```typescript
const baseUrls = {
  paymee: "https://sandbox.paymee.tn/gateway", // Use production URL for live
  flouci: "https://developers.flouci.com/api/generate_payment",
};
```

### Special Days Configuration

Modify special days in `utils/bookingUtils.ts`:

```typescript
export const DEFAULT_SPECIAL_DAYS: SpecialDay[] = [
  {
    date: "2025-01-01",
    name: "New Year's Day",
    requiresPayment: true,
    feeAmount: 30,
  },
  // Add more special days...
];
```

## 💳 Payment Integration

### Supported Providers

- **Paymee**: Tunisian payment gateway
- **Flouci**: Mobile payment solution

### Security Features

- No card data stored in app
- PCI DSS compliant payment gateways
- Secure WebView implementation
- Payment validation on return
- Transaction logging for disputes

### Payment Flow

1. Customer selects service and date
2. App calculates if payment is required
3. Payment screen shows available providers
4. WebView opens with secure payment gateway
5. Customer completes payment
6. App validates response and confirms booking

## 📊 Customer Reliability System

### Scoring Algorithm

```
Reliability Score = 100 - (No-show Rate × 2) - Cancellation Rate

Rating Levels:
- Excellent: 90-100% (Green)
- Good: 75-89% (Blue)
- Fair: 60-74% (Orange)
- Poor: <60% (Red)
```

### Factors Considered

- Total booking history
- No-show incidents
- Cancellation frequency
- Timing of cancellations

## 🔄 Cancellation Policy

### Policy Rules

- **Early Cancellation** (>2 hours): Full refund if fee is refundable
- **Late Cancellation** (<2 hours): Fee forfeited, booking cancelled
- **Free Bookings**: No penalty, confirmation required

### Business Controls

- Configurable cancellation window
- Refund policy toggle
- Fee type selection (reservation vs deductible)

## 🎨 UI/UX Features

### Customer Experience

- Clear payment requirement indicators
- Booking fee breakdown in summary
- Cancellation policy warnings
- Payment success/failure feedback
- Reliability score display (for businesses)

### Business Experience

- Customer reliability badges
- Payment vs free booking insights
- Policy configuration interface
- Booking status management
- Dispute handling system

## 📚 Documentation

- **Workflow Documentation**: See `docs/WORKFLOW_DOCUMENTATION.md` for detailed flow diagrams
- **API Documentation**: Coming soon
- **Business Guide**: Coming soon

## 🚧 Development

### Key Components

1. **BookingScreen**: Enhanced with payment logic and fee calculation
2. **PaymentScreen**: Secure payment processing with WebView
3. **CancellationScreen**: Policy-aware cancellation handling
4. **BusinessSettingsScreen**: Comprehensive policy configuration
5. **BusinessDashboardScreen**: Enhanced with reliability tracking

### Utility Functions

1. **paymentUtils.ts**: Payment processing, validation, and formatting
2. **bookingUtils.ts**: Date logic, fee calculation, and cancellation policies
3. **customerReliability.ts**: Reliability score calculations

### State Management

- Local state for UI interactions
- Props-based navigation parameters
- Future: Redux/Context for global state

## 🔮 Future Enhancements

### Planned Features

- [ ] Customer subscription tiers
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Arabic, French)
- [ ] Push notifications
- [ ] Loyalty program integration
- [ ] Calendar sync
- [ ] SMS notifications
- [ ] Email marketing integration

### Technical Improvements

- [ ] Offline capability
- [ ] Real-time updates with WebSockets
- [ ] Advanced caching
- [ ] Performance optimizations
- [ ] Automated testing suite

## 🐛 Troubleshooting

### Common Issues

1. **Payment WebView not loading**

   - Check internet connectivity
   - Verify payment gateway URLs
   - Ensure WebView permissions

2. **Date/time calculation errors**

   - Verify timezone settings
   - Check date-fns configuration
   - Validate special day dates

3. **Booking fee not calculating**
   - Check business settings
   - Verify weekend detection
   - Validate special day configuration

### Debug Mode

Enable debug logging by setting:

```typescript
const DEBUG_MODE = true; // In development
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Tunisian market**
