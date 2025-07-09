# Reservili App - Workflow Documentation

## Overview

This document outlines all the workflows in the Reservili appointment booking app, including customer flows, business flows, payment processing, and cancellation policies.

## Table of Contents

1. [Customer Booking Flow](#customer-booking-flow)
2. [Payment Processing Flow](#payment-processing-flow)
3. [Cancellation Flow](#cancellation-flow)
4. [Business Management Flow](#business-management-flow)
5. [Customer Reliability System](#customer-reliability-system)
6. [Business Policy Configuration](#business-policy-configuration)

---

## Customer Booking Flow

### 1. Free Booking (Default)

```mermaid
graph TD
    A[Customer selects service] --> B[Customer selects date/time]
    B --> C{Is weekend or special day?}
    C -->|No| D[Free booking - proceed directly]
    C -->|Yes| E{Business allows free weekend bookings?}
    E -->|Yes| D
    E -->|No| F[Payment required]
    D --> G[Booking confirmed]
    F --> H[Navigate to payment screen]
    H --> I[Payment successful?]
    I -->|Yes| G
    I -->|No| J[Booking cancelled]
```

### 2. Paid Booking Flow

```mermaid
graph TD
    A[Payment required detected] --> B[Show payment alert]
    B --> C{Customer chooses to pay?}
    C -->|Yes| D[Navigate to payment screen]
    C -->|No| E[Booking cancelled]
    D --> F[Select payment provider]
    F --> G[Open WebView with payment gateway]
    G --> H[Customer completes payment]
    H --> I{Payment successful?}
    I -->|Yes| J[Return to app with success]
    I -->|No| K[Return to app with error]
    J --> L[Booking confirmed with payment]
    K --> M[Show error, allow retry]
```

---

## Payment Processing Flow

### 1. Payment Provider Selection

```mermaid
graph TD
    A[Payment screen opened] --> B[Display available providers]
    B --> C[Customer selects Paymee or Flouci]
    C --> D[Generate payment URL with booking details]
    D --> E[Open WebView with payment gateway]
```

### 2. Secure Payment Processing

```mermaid
graph TD
    A[WebView loads payment gateway] --> B[Customer enters payment details]
    B --> C[Gateway processes payment]
    C --> D{Payment successful?}
    D -->|Yes| E[Redirect to success URL]
    D -->|No| F[Redirect to cancel URL]
    E --> G[App validates payment response]
    F --> H[App handles cancellation]
    G --> I[Update booking status]
    H --> J[Allow retry or cancel booking]
```

### 3. Payment Types

- **Reservation Fee**: Non-refundable fee to secure booking
- **Deductible**: Amount deducted from final bill

---

## Cancellation Flow

### 1. Cancellation Policy Check

```mermaid
graph TD
    A[Customer requests cancellation] --> B[Check time until booking]
    B --> C{More than 2 hours?}
    C -->|Yes| D{Has booking fee?}
    C -->|No| E[Late cancellation - fee forfeited]
    D -->|Yes| F{Fee is refundable?}
    D -->|No| G[Free cancellation]
    F -->|Yes| H[Refund fee]
    F -->|No| I[Fee non-refundable]
    E --> J[Show penalty warning]
    G --> K[Confirm cancellation]
    H --> K
    I --> K
    J --> L{Customer confirms?}
    L -->|Yes| M[Cancel booking, forfeit fee]
    L -->|No| N[Keep booking]
```

### 2. Cancellation Scenarios

- **Early cancellation (>2 hours)**: Full refund if fee is refundable
- **Late cancellation (<2 hours)**: Fee forfeited, booking cancelled
- **Free bookings**: No penalty, just cancellation confirmation

---

## Business Management Flow

### 1. Dashboard Overview

```mermaid
graph TD
    A[Business Dashboard] --> B[Today's Bookings]
    A --> C[Customer Insights]
    A --> D[Revenue Analytics]
    B --> E[Booking Status Management]
    C --> F[Customer Reliability Scores]
    D --> G[Payment Tracking]
```

### 2. Booking Management

```mermaid
graph TD
    A[View booking] --> B{Booking status?}
    B -->|Confirmed| C[Check-in, Complete, No-show, Cancel]
    B -->|Checked-in| D[Complete, No-show]
    B -->|No-show| E[Create dispute]
    C --> F[Update status]
    D --> F
    E --> G[Document dispute with proof]
```

---

## Customer Reliability System

### 1. Reliability Score Calculation

```
Reliability Score = 100 - (No-show Rate × 2) - Cancellation Rate

Rating Levels:
- Excellent: 90-100%
- Good: 75-89%
- Fair: 60-74%
- Poor: <60%
```

### 2. Reliability Factors

- **Total Bookings**: Historical booking count
- **No-show Count**: Times customer didn't show up
- **Cancellation Count**: Times customer cancelled
- **Timing**: Late cancellations weighted more heavily

---

## Business Policy Configuration

### 1. Payment Policies

```mermaid
graph TD
    A[Business Settings] --> B[Payment & Booking Policies]
    B --> C[Allow Free Weekend Bookings]
    B --> D[Accept Walk-ins Only]
    B --> E[Refund Booking Fees on Cancellation]
    B --> F[Weekend Fee Amount]
    B --> G[Special Day Fee Amount]
    B --> H[Cancellation Policy Hours]
    B --> I[Fee Type: Reservation vs Deductible]
```

### 2. Policy Options

- **Allow Free Weekend Bookings**: Toggle for weekend payment requirement
- **Accept Walk-ins Only**: Disable advance bookings
- **Refund Policy**: Whether to refund fees on timely cancellation
- **Fee Amounts**: Configurable amounts for weekends and special days
- **Cancellation Window**: Hours before booking to cancel without penalty
- **Fee Type**: Reservation fee (non-refundable) vs deductible (from bill)

---

## Special Days Configuration

### 1. Default Special Days (Tunisia)

- New Year's Day (January 1)
- Independence Day (March 20)
- Martyrs' Day (April 9)
- Labour Day (May 1)
- Republic Day (July 25)

### 2. Custom Special Days

Businesses can add custom special days with:

- Date
- Name/Description
- Payment requirement
- Custom fee amount

---

## Error Handling & Edge Cases

### 1. Payment Failures

- Network connectivity issues
- Payment gateway errors
- Insufficient funds
- Card declined

### 2. Booking Conflicts

- Time slot no longer available
- Business closed
- Capacity reached

### 3. Cancellation Edge Cases

- Booking already started
- Multiple rapid cancellations
- System downtime during cancellation

---

## Security Considerations

### 1. Payment Security

- No card data stored in app
- PCI DSS compliant payment gateways
- Secure WebView implementation
- Payment validation on return

### 2. Data Protection

- Customer data encryption
- Secure API communications
- Payment transaction logging
- Dispute documentation

---

## Future Enhancements

### 1. Planned Features

- Subscription tiers for customers
- Advanced analytics dashboard
- Multi-language support
- Push notifications
- Loyalty program integration

### 2. Integration Possibilities

- Calendar sync
- SMS notifications
- Email marketing
- Social media integration
- Third-party payment providers

---

## Technical Implementation Notes

### 1. Key Components

- `PaymentScreen.tsx`: Handles payment provider selection and WebView
- `CancellationScreen.tsx`: Manages cancellation flow and policy display
- `BookingScreen.tsx`: Main booking interface with fee calculation
- `BusinessSettingsScreen.tsx`: Policy configuration interface

### 2. Utility Functions

- `paymentUtils.ts`: Payment processing and validation
- `bookingUtils.ts`: Date logic, fee calculation, cancellation policies
- `customerReliability.ts`: Reliability score calculations

### 3. State Management

- Local state for UI interactions
- API integration for data persistence
- Real-time updates for booking status
- Offline capability considerations

---

_This documentation should be reviewed and updated as features are added or modified._
