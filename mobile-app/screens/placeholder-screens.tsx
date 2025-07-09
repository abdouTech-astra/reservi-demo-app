import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Button from "../components/Button";

// Generic placeholder screen generator
function createPlaceholderScreen<T extends keyof RootStackParamList>(
  screenName: T,
  screenTitle: string
) {
  const PlaceholderScreen = ({
    navigation,
    route,
  }: NativeStackScreenProps<RootStackParamList, T>) => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{screenTitle}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{screenTitle}</Text>
          <Text style={styles.description}>
            This is a placeholder for the {screenTitle.toLowerCase()} screen.
          </Text>

          <Button
            fullWidth
            style={styles.actionButton}
            onPress={() => navigation.goBack()}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  };

  return PlaceholderScreen;
}

// Create placeholder screens for all remaining screens
export const BookingScreen = createPlaceholderScreen("Booking", "Booking");
export const BookingConfirmedScreen = createPlaceholderScreen(
  "BookingConfirmed",
  "Booking Confirmed"
);
export const CustomerBookingsScreen = createPlaceholderScreen(
  "CustomerBookings",
  "My Bookings"
);
export const BusinessDashboardScreen = createPlaceholderScreen(
  "BusinessDashboard",
  "Dashboard"
);
export const BusinessCalendarScreen = createPlaceholderScreen(
  "BusinessCalendar",
  "Calendar"
);
export const BusinessServicesScreen = createPlaceholderScreen(
  "BusinessServices",
  "Services"
);
export const BusinessSettingsScreen = createPlaceholderScreen(
  "BusinessSettings",
  "Settings"
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 24,
    textAlign: "center",
  },
  actionButton: {
    marginTop: 16,
  },
});
