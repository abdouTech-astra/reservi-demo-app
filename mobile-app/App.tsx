import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";

// Import screens
import WelcomeScreen from "./screens/WelcomeScreen";
import CustomerLoginScreen from "./screens/customer/CustomerLoginScreen";
import BusinessLoginScreen from "./screens/business/BusinessLoginScreen";
import CustomerHomeScreen from "./screens/customer/CustomerHomeScreen";
import BusinessProfileScreen from "./screens/customer/BusinessProfileScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import BusinessDashboardScreen from "./screens/business/BusinessDashboardScreen";
import BookingConfirmedScreen from "./screens/customer/BookingConfirmedScreen";
import CustomerBookingsScreen from "./screens/customer/CustomerBookingsScreen";
import BookingScreen from "./screens/customer/BookingScreen";
import PaymentScreen from "./screens/customer/PaymentScreen";
import CancellationScreen from "./screens/customer/CancellationScreen";
import RescheduleScreen from "./screens/customer/RescheduleScreen";
import ProfileScreen from "./screens/customer/ProfileScreen";
import WaitlistScreen from "./screens/customer/WaitlistScreen";
import CustomerRewardsScreen from "./screens/customer/CustomerRewardsScreen";
import SmartRecommendationsScreen from "./screens/customer/SmartRecommendationsScreen";
import CustomerWaitlistScreen from "./screens/customer/CustomerWaitlistScreen";
import BusinessCalendarScreen from "./screens/business/BusinessCalendarScreen";
import BusinessServicesScreen from "./screens/business/BusinessServicesScreen";
import BusinessSettingsScreen from "./screens/business/BusinessSettingsScreen";
import CustomerManagementScreen from "./screens/business/CustomerManagementScreen";
import EnhancedBusinessScreen from "./screens/business/EnhancedBusinessScreen";
import CustomerCalendarScreen from "./screens/customer/CustomerCalendarScreen";
import BusinessAdvertisingScreen from "./screens/business/BusinessAdvertisingScreen";
// Import placeholder screens
import {} from "./screens/placeholder-screens";

// Define our stack navigator param list
export type RootStackParamList = {
  Welcome: undefined;
  CustomerLogin: undefined;
  BusinessLogin: undefined;
  CustomerHome: undefined;
  BusinessProfile: { id: string };
  Booking: { businessId: string };
  Payment: {
    bookingId: string;
    amount: number;
    description: string;
    customerEmail?: string;
    customerPhone?: string;
    onPaymentSuccess: (result: any) => void;
    onPaymentCancel: () => void;
  };
  Cancellation: {
    bookingId: string;
    businessName: string;
    service: string;
    date: string;
    time: string;
    bookingFee?: any;
  };
  Reschedule: {
    booking: {
      id: string;
      businessName: string;
      service: string;
      date: string;
      time: string;
      status: string;
    };
  };
  BookingConfirmed: {
    bookingDetails: {
      service: string | null;
      date: string; // Changed to string since Date objects get serialized
      time: string | null;
      notes: string;
      bookingFee: any;
      paymentResult?: any;
    };
  };
  CustomerBookings: undefined;
  CustomerCalendar: undefined;
  Profile: undefined;
  Waitlist: undefined;
  CustomerRewards: undefined;
  SmartRecommendations: undefined;
  CustomerWaitlist: undefined;
  BusinessDashboard: undefined;
  BusinessCalendar: undefined;
  BusinessServices: undefined;
  BusinessSettings: undefined;
  CustomerManagement: undefined;
  EnhancedBusiness: undefined;
  BusinessAdvertising: undefined;
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Define linking configuration
const linking = {
  prefixes: ["Reservili://"],
  config: {
    screens: {
      // Public Routes
      Welcome: "/",

      // Customer Routes
      CustomerLogin: "/customer/login",
      CustomerHome: "/customer/home",
      BusinessProfile: "/customer/business/:id",
      Booking: "/customer/booking/:businessId",
      Payment: "/customer/payment",
      Cancellation: "/customer/cancellation",
      Reschedule: "/customer/reschedule",
      BookingConfirmed: "/customer/booking-confirmed",
      CustomerBookings: "/customer/bookings",
      CustomerCalendar: "/customer/calendar",
      Profile: "/customer/profile",
      Waitlist: "/customer/waitlist",
      CustomerRewards: "/customer/rewards",
      SmartRecommendations: "/customer/recommendations",
      CustomerWaitlist: "/customer/waitlist-management",

      // Business Routes
      BusinessLogin: "/business/login",
      BusinessDashboard: "/business/dashboard",
      BusinessCalendar: "/business/calendar",
      BusinessServices: "/business/services",
      BusinessSettings: "/business/settings",
      CustomerManagement: "/business/customers",
      EnhancedBusiness: "/business/enhanced",
      BusinessAdvertising: "/business/advertising",

      // Catch-all Route
      NotFound: "*",
    },
  },
};

// Loading component for NavigationContainer
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#3b82f6" />
  </View>
);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Public Routes */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />

            {/* Customer Routes */}
            <Stack.Screen
              name="CustomerLogin"
              component={CustomerLoginScreen}
            />
            <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
            <Stack.Screen
              name="BusinessProfile"
              component={BusinessProfileScreen}
            />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Cancellation" component={CancellationScreen} />
            <Stack.Screen name="Reschedule" component={RescheduleScreen} />
            <Stack.Screen
              name="BookingConfirmed"
              component={BookingConfirmedScreen}
            />
            <Stack.Screen
              name="CustomerBookings"
              component={CustomerBookingsScreen}
            />
            <Stack.Screen
              name="CustomerCalendar"
              component={CustomerCalendarScreen}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Waitlist" component={WaitlistScreen} />
            <Stack.Screen
              name="CustomerRewards"
              component={CustomerRewardsScreen}
            />
            <Stack.Screen
              name="SmartRecommendations"
              component={SmartRecommendationsScreen}
            />
            <Stack.Screen
              name="CustomerWaitlist"
              component={CustomerWaitlistScreen}
            />

            {/* Business Routes */}
            <Stack.Screen
              name="BusinessLogin"
              component={BusinessLoginScreen}
            />
            <Stack.Screen
              name="BusinessDashboard"
              component={BusinessDashboardScreen}
            />
            <Stack.Screen
              name="BusinessCalendar"
              component={BusinessCalendarScreen}
            />
            <Stack.Screen
              name="BusinessServices"
              component={BusinessServicesScreen}
            />
            <Stack.Screen
              name="BusinessSettings"
              component={BusinessSettingsScreen}
            />
            <Stack.Screen
              name="CustomerManagement"
              component={CustomerManagementScreen}
            />
            <Stack.Screen
              name="EnhancedBusiness"
              component={EnhancedBusinessScreen}
            />
            <Stack.Screen
              name="BusinessAdvertising"
              component={BusinessAdvertisingScreen}
            />

            {/* Catch-all Route */}
            <Stack.Screen name="NotFound" component={NotFoundScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
