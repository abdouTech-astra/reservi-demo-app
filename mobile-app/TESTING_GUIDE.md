# Testing Guide for Reservi Demo App

## 🧪 How to Test All Implemented Features

### Prerequisites

1. Start the development server: `npm start`
2. Open the app in Expo Go or simulator
3. Navigate through the customer flow

## 📱 Customer Booking Flow Testing

### 1. **Basic Booking Flow**

1. Start from Welcome screen → Customer Login → Customer Home
2. Tap on "Le Petit Café" business card
3. Tap "Book Now" button
4. **Expected**: BookingScreen opens with service selection

### 2. **Fee Calculation Testing**

1. In BookingScreen, select any service
2. **Test Weekend Dates**:

   - Look for dates highlighted in red (weekends)
   - Tap on a weekend date (Saturday/Sunday)
   - **Expected**:
     - Alert popup: "Booking Fee Required: 30.00 TND"
     - Red banner appears at top showing fee details
     - Fee shows in booking summary

3. **Test Weekday Dates**:
   - Tap on a weekday date (Monday-Friday)
   - **Expected**: No fee alert, no red banner

### 3. **Visual Indicators Testing**

1. In date selection, look for:
   - **Weekend dates**: Red background with card icon
   - **Weekday dates**: Gray background, no icon
   - **Selected date**: Blue background
2. **Expected**: Clear visual distinction between fee/no-fee dates

### 4. **Payment Flow Testing**

1. Select a weekend date + service + time
2. Tap "Confirm Booking"
3. **Expected**: Alert asking to proceed with payment
4. Tap "Pay Now"
5. **Expected**: PaymentScreen opens with WebView
6. **Note**: Payment providers are in sandbox mode

### 5. **Booking Confirmation Testing**

1. After payment (or free booking), check BookingConfirmedScreen
2. **Expected**:
   - Animated checkmark
   - Correct service name and date formatting
   - Payment information (if fee was charged)
   - Booking ID and details

### 6. **Customer Bookings List Testing**

1. From BookingConfirmed, tap "View My Bookings"
2. **Expected**: CustomerBookingsScreen with tabs
3. Check "Upcoming" tab for bookings with:
   - Fee information (if applicable)
   - Payment status indicators
   - Cancel button functionality

### 7. **Cancellation Flow Testing**

1. In CustomerBookings, tap "Cancel" on a booking
2. **Expected**: CancellationScreen opens
3. Check for:
   - Time until booking calculation
   - Fee forfeiture warnings
   - Policy information

## 🏢 Business Features Testing

### 8. **Business Dashboard Testing**

1. Go to Welcome → Business Login → Business Dashboard
2. **Expected**: Customer reliability scores with color-coded indicators
3. Look for:
   - Green dots (Excellent customers)
   - Blue dots (Good customers)
   - Orange dots (Fair customers)
   - Red dots (Poor customers)

### 9. **Business Settings Testing**

1. Navigate to Business Settings
2. **Expected**: "Payment & Booking Policies" section
3. Test toggles:
   - Allow free weekend bookings
   - Accept walk-ins only
   - Refund booking fees on cancellation
4. Test fee amount inputs and policy hours

## 🔍 Specific Features to Verify

### Fee Calculation Logic

- **Weekends (Sat/Sun)**: Should show 30 TND fee
- **Weekdays (Mon-Fri)**: Should be free
- **Special Days**: Tunisian holidays should show 30 TND fee

### Visual Feedback

- **Fee Alert Banner**: Red background, clear fee amount
- **Date Indicators**: Red dates with card icons for fee-required dates
- **Payment Status**: Green checkmarks for paid, orange clock for pending

### Navigation Flow

- **Booking → Payment → Confirmation → Bookings List**
- **Bookings List → Cancellation**
- **All back buttons and navigation should work**

## 🐛 Common Issues to Check

### 1. **Date Formatting Error** (FIXED)

- ✅ BookingConfirmed screen should show proper date formatting
- ✅ No "Cannot read property 'toLocaleDateString' of undefined" errors

### 2. **Fee Calculation**

- ✅ Fees should calculate immediately when dates are selected
- ✅ Fee banner should appear/disappear based on date selection

### 3. **Payment Integration**

- ✅ Payment screen should open WebView
- ✅ Payment providers (Paymee/Flouci) should be selectable

### 4. **Type Safety**

- ✅ No TypeScript errors in development
- ✅ All navigation parameters properly typed

## 📊 Expected Results Summary

| Feature                | Status | Expected Behavior           |
| ---------------------- | ------ | --------------------------- |
| Weekend Fee Detection  | ✅     | 30 TND fee for Sat/Sun      |
| Visual Date Indicators | ✅     | Red background + card icon  |
| Fee Alert Banner       | ✅     | Shows when fee required     |
| Payment Flow           | ✅     | WebView with providers      |
| Booking Confirmation   | ✅     | Dynamic content with fees   |
| Bookings List          | ✅     | Fee info + payment status   |
| Cancellation           | ✅     | Policy-aware warnings       |
| Business Dashboard     | ✅     | Customer reliability scores |
| Business Settings      | ✅     | Configurable policies       |

## 🎯 Success Criteria

The app is working correctly if:

1. ✅ Weekend dates show red indicators and trigger fee alerts
2. ✅ Payment flow works for fee-required bookings
3. ✅ Booking confirmation shows all details correctly
4. ✅ Customer bookings list displays fee information
5. ✅ Cancellation screen shows policy warnings
6. ✅ Business features show customer reliability
7. ✅ No crashes or TypeScript errors

**All features are now fully implemented and ready for testing!**
