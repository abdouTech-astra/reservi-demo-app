import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { formatAmount } from "../../utils/paymentUtils";

type Props = NativeStackScreenProps<RootStackParamList, "BookingConfirmed">;

const BookingConfirmedScreen = ({ navigation, route }: Props) => {
  const { bookingDetails } = route.params;

  // Animation value for check mark
  const checkScale = new Animated.Value(0);
  const checkOpacity = new Animated.Value(0);

  useEffect(() => {
    // Start the check mark animation
    Animated.sequence([
      Animated.timing(checkScale, {
        toValue: 1.2,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.7)),
      }),
      Animated.timing(checkScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade in details
    Animated.timing(checkOpacity, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Get service name from mock data
  const mockServices = [
    { id: "1", name: "Tunisian Mint Tea", price: "5 TND" },
    { id: "2", name: "Specialty Coffee", price: "7 TND" },
    { id: "3", name: "Croissant & Coffee Combo", price: "12 TND" },
    { id: "4", name: "Fresh Orange Juice", price: "6 TND" },
    { id: "5", name: "Pastry Selection", price: "15 TND" },
    { id: "6", name: "Breakfast Platter", price: "25 TND" },
  ];

  const selectedService = mockServices.find(
    (s) => s.id === bookingDetails.service
  );
  const serviceName = selectedService?.name || "Unknown Service";
  const servicePrice = selectedService?.price || "0 TND";

  // Get time slot name
  const timeSlots = [
    { id: "1", time: "9:00 AM" },
    { id: "2", time: "9:30 AM" },
    { id: "3", time: "10:00 AM" },
    { id: "4", time: "10:30 AM" },
    { id: "5", time: "11:00 AM" },
    { id: "6", time: "11:30 AM" },
    { id: "7", time: "12:00 PM" },
    { id: "8", time: "12:30 PM" },
    { id: "9", time: "1:00 PM" },
    { id: "10", time: "1:30 PM" },
    { id: "11", time: "2:00 PM" },
    { id: "12", time: "2:30 PM" },
  ];

  const selectedTime = timeSlots.find((t) => t.id === bookingDetails.time);
  const timeDisplay = selectedTime?.time || "Unknown Time";

  const bookingId = `B${Date.now()}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Confirmed</Text>
        </View>

        <View style={styles.successContainer}>
          <Animated.View
            style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}
          >
            <Ionicons name="checkmark" size={48} color="#fff" />
          </Animated.View>
          <Text style={styles.successTitle}>All Set!</Text>
          <Text style={styles.successSubtitle}>
            Your booking has been confirmed
          </Text>
        </View>

        <Animated.View
          style={[styles.bookingDetailsContainer, { opacity: checkOpacity }]}
        >
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking ID</Text>
              <Text style={styles.detailValue}>{bookingId}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Business</Text>
              <Text style={styles.detailValue}>Le Petit Café</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service</Text>
              <Text style={styles.detailValue}>{serviceName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {bookingDetails.date
                  ? new Date(bookingDetails.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date not available"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{timeDisplay}</Text>
            </View>

            {bookingDetails.notes && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Notes</Text>
                  <Text style={styles.detailValue}>{bookingDetails.notes}</Text>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Total</Text>
              <Text style={styles.priceValue}>{servicePrice}</Text>
            </View>
          </View>

          {/* Payment Information */}
          {bookingDetails.bookingFee && (
            <View style={styles.paymentCard}>
              <Text style={styles.paymentTitle}>Payment Information</Text>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Booking Fee</Text>
                <Text style={styles.paymentValue}>
                  {formatAmount(bookingDetails.bookingFee.amount)} (
                  {bookingDetails.bookingFee.type})
                </Text>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Reason</Text>
                <Text style={styles.paymentDescription}>
                  {bookingDetails.bookingFee.description}
                </Text>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Refund Policy</Text>
                <Text style={styles.paymentDescription}>
                  {bookingDetails.bookingFee.isRefundable
                    ? "Refundable"
                    : "Non-refundable"}
                </Text>
              </View>

              {bookingDetails.paymentResult && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Status</Text>
                    <View style={styles.paymentStatusContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.paymentStatusText}>Paid</Text>
                    </View>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Transaction ID</Text>
                    <Text style={styles.paymentValue}>
                      {bookingDetails.paymentResult.transactionId || "N/A"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

          <View style={styles.pointsCard}>
            <View style={styles.pointsRow}>
              <View style={styles.pointsIconContainer}>
                <Ionicons name="star" size={20} color="#fff" />
              </View>
              <View style={styles.pointsContent}>
                <Text style={styles.pointsTitle}>You've earned 25 points!</Text>
                <Text style={styles.pointsDescription}>
                  Continue booking to earn rewards
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </View>

          <View style={styles.reminderContainer}>
            <Ionicons name="alarm-outline" size={24} color="#4b5563" />
            <Text style={styles.reminderText}>
              We'll send you a reminder 30 minutes before your appointment
            </Text>
          </View>

          {/* Cancellation Policy Notice */}
          <View style={styles.policyContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#3b82f6"
            />
            <Text style={styles.policyText}>
              You can cancel this booking up to 2 hours before your appointment
              time.
              {bookingDetails.bookingFee &&
              !bookingDetails.bookingFee.isRefundable
                ? " Booking fees are non-refundable."
                : bookingDetails.bookingFee
                ? " Booking fees will be refunded if cancelled in time."
                : ""}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.viewBookingsButton}
            onPress={() => navigation.navigate("CustomerBookings")}
          >
            <Text style={styles.viewBookingsText}>View My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("CustomerHome")}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  bookingDetailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    textAlign: "right",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  paymentCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    textAlign: "right",
  },
  paymentDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  paymentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentStatusText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 4,
  },
  pointsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 16,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  pointsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pointsContent: {
    flex: 1,
  },
  pointsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  pointsDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  reminderText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  viewBookingsButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  viewBookingsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#4b5563",
    fontSize: 16,
    fontWeight: "500",
  },
  policyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  policyText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 12,
    flex: 1,
  },
});

export default BookingConfirmedScreen;
