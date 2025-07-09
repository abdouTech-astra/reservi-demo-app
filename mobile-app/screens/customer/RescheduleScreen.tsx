import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import {
  calculateBookingFee,
  BusinessSettings,
  BookingFee,
  isSpecialDay,
} from "../../utils/bookingUtils";
import { formatAmount, PaymentResult } from "../../utils/paymentUtils";

type Props = NativeStackScreenProps<RootStackParamList, "Reschedule">;

// Available time slots with availability status
const timeSlots = [
  { id: "1", time: "9:00 AM", available: true },
  { id: "2", time: "9:30 AM", available: false },
  { id: "3", time: "10:00 AM", available: true },
  { id: "4", time: "10:30 AM", available: false },
  { id: "5", time: "11:00 AM", available: true },
  { id: "6", time: "11:30 AM", available: true },
  { id: "7", time: "12:00 PM", available: false },
  { id: "8", time: "12:30 PM", available: true },
  { id: "9", time: "1:00 PM", available: false },
  { id: "10", time: "1:30 PM", available: true },
  { id: "11", time: "2:00 PM", available: false },
  { id: "12", time: "2:30 PM", available: true },
];

const RescheduleScreen = ({ navigation, route }: Props) => {
  const { booking } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingFee, setBookingFee] = useState<BookingFee | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Mock business settings
  const businessSettings: BusinessSettings = {
    allowFreeWeekendBookings: false,
    acceptWalkInsOnly: false,
    refundBookingFeesOnCancellation: true,
    weekendFeeAmount: 30,
    specialDayFeeAmount: 30,
    cancellationPolicyHours: 2,
    feeType: "reservation",
  };

  // Calculate initial fee for today's date
  useEffect(() => {
    const initialFee = calculateBookingFee(selectedDate, businessSettings);
    setBookingFee(initialFee);
  }, [selectedDate]);

  // Get dates for the next 14 days (more options for rescheduling)
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const fee = calculateBookingFee(date, businessSettings);
    setBookingFee(fee);

    if (fee) {
      Alert.alert(
        "Additional Fee Required",
        `A ${formatAmount(fee.amount)} ${
          fee.type
        } fee is required for this date.\n\nReason: ${fee.description}`,
        [{ text: "OK" }]
      );
    }
  };

  const handleConfirmReschedule = () => {
    if (!selectedTime) {
      Alert.alert("Select Time", "Please select a new time slot.");
      return;
    }

    const originalDate = new Date(booking.date);
    const newDate = selectedDate;
    const selectedTimeSlot = timeSlots.find((t) => t.id === selectedTime);

    Alert.alert(
      "Confirm Reschedule",
      `Reschedule your booking from:\n${originalDate.toLocaleDateString()} at ${
        booking.time
      }\n\nTo:\n${newDate.toLocaleDateString()} at ${
        selectedTimeSlot?.time
      }\n\n${
        bookingFee
          ? `Additional fee: ${formatAmount(bookingFee.amount)} TND`
          : "No additional fees"
      }`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            if (bookingFee) {
              proceedToPayment();
            } else {
              completeReschedule();
            }
          },
        },
      ]
    );
  };

  const proceedToPayment = () => {
    if (!bookingFee || !selectedTime) return;

    const selectedTimeSlot = timeSlots.find((t) => t.id === selectedTime);
    const rescheduleId = `R${Date.now()}`;

    navigation.navigate("Payment", {
      bookingId: rescheduleId,
      amount: bookingFee.amount,
      description: `Reschedule fee - ${
        booking.service
      } to ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot?.time}`,
      customerEmail: "customer@example.com",
      customerPhone: "+216 20 123 456",
      onPaymentSuccess: (result: PaymentResult) => {
        completeReschedule(result);
      },
      onPaymentCancel: () => {
        // Payment cancelled, stay on reschedule screen
      },
    });
  };

  const completeReschedule = (paymentResult?: PaymentResult) => {
    const selectedTimeSlot = timeSlots.find((t) => t.id === selectedTime);

    Alert.alert(
      "Booking Rescheduled! ✅",
      `Your booking has been successfully rescheduled to ${selectedDate.toLocaleDateString()} at ${
        selectedTimeSlot?.time
      }.\n\nA confirmation will be sent to your email.`,
      [
        {
          text: "View Bookings",
          onPress: () => navigation.navigate("CustomerBookings"),
        },
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reschedule Booking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Current Booking Info */}
        <View style={styles.currentBookingCard}>
          <View style={styles.currentBookingHeader}>
            <Ionicons name="calendar-outline" size={20} color="#6b7280" />
            <Text style={styles.currentBookingTitle}>Current Booking</Text>
          </View>
          <View style={styles.currentBookingDetails}>
            <Text style={styles.businessName}>{booking.businessName}</Text>
            <Text style={styles.serviceName}>{booking.service}</Text>
            <Text style={styles.currentDateTime}>
              {new Date(booking.date).toLocaleDateString()} at {booking.time}
            </Text>
          </View>
        </View>

        {/* Fee Alert Banner */}
        {bookingFee && (
          <View style={styles.feeAlertBanner}>
            <View style={styles.feeAlertIcon}>
              <Ionicons name="card-outline" size={20} color="#dc2626" />
            </View>
            <View style={styles.feeAlertContent}>
              <Text style={styles.feeAlertTitle}>
                Additional Fee: {formatAmount(bookingFee.amount)}
              </Text>
              <Text style={styles.feeAlertDescription}>
                {bookingFee.description} •{" "}
                {bookingFee.isRefundable ? "Refundable" : "Non-refundable"}
              </Text>
            </View>
          </View>
        )}

        {/* Select New Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}
          >
            {dates.map((date, index) => {
              const isWeekendDate = date.getDay() === 0 || date.getDay() === 6;
              const hasSpecialDay = isSpecialDay(date);
              const requiresFee = isWeekendDate || hasSpecialDay;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateItem,
                    isDateSelected(date) && styles.selectedDateItem,
                    requiresFee &&
                      !isDateSelected(date) &&
                      styles.feeRequiredDateItem,
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isDateSelected(date) && styles.selectedDayText,
                      requiresFee &&
                        !isDateSelected(date) &&
                        styles.feeRequiredDayText,
                    ]}
                  >
                    {formatDay(date)}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      isDateSelected(date) && styles.selectedDateText,
                      requiresFee &&
                        !isDateSelected(date) &&
                        styles.feeRequiredDateText,
                    ]}
                  >
                    {formatDate(date)}
                  </Text>
                  {requiresFee && (
                    <View style={styles.feeIndicator}>
                      <Ionicons
                        name="card"
                        size={10}
                        color={isDateSelected(date) ? "#fff" : "#dc2626"}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Select New Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  selectedTime === slot.id && styles.selectedTimeSlot,
                  !slot.available && styles.unavailableTimeSlot,
                ]}
                onPress={() => slot.available && setSelectedTime(slot.id)}
                disabled={!slot.available}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === slot.id && styles.selectedTimeText,
                    !slot.available && styles.unavailableTimeText,
                  ]}
                >
                  {slot.time}
                </Text>
                {!slot.available && (
                  <Text style={styles.unavailableLabel}>Full</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reschedule Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Reschedule Summary</Text>

          <View style={styles.summarySection}>
            <Text style={styles.summarySubtitle}>From:</Text>
            <Text style={styles.summaryValue}>
              {new Date(booking.date).toLocaleDateString()} at {booking.time}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summarySubtitle}>To:</Text>
            <Text style={styles.summaryValue}>
              {selectedTime
                ? `${selectedDate.toLocaleDateString()} at ${
                    timeSlots.find((t) => t.id === selectedTime)?.time
                  }`
                : "Please select new time"}
            </Text>
          </View>

          {bookingFee && (
            <View style={styles.summarySection}>
              <Text style={styles.summarySubtitle}>Additional Fee:</Text>
              <Text style={styles.feeValue}>
                {formatAmount(bookingFee.amount)} TND
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedTime && styles.disabledButton]}
          onPress={handleConfirmReschedule}
          disabled={!selectedTime}
        >
          <Text style={styles.confirmButtonText}>
            {bookingFee
              ? `Pay ${formatAmount(bookingFee.amount)} TND & Reschedule`
              : "Confirm Reschedule"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 28,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  currentBookingCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  currentBookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  currentBookingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 8,
  },
  currentBookingDetails: {},
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  currentDateTime: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3b82f6",
  },
  feeAlertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  feeAlertIcon: {
    marginRight: 12,
  },
  feeAlertContent: {
    flex: 1,
  },
  feeAlertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 2,
  },
  feeAlertDescription: {
    fontSize: 12,
    color: "#991b1b",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  dateList: {
    paddingVertical: 8,
  },
  dateItem: {
    width: 64,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  selectedDateItem: {
    backgroundColor: "#3b82f6",
  },
  feeRequiredDateItem: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 4,
  },
  selectedDayText: {
    color: "#fff",
  },
  feeRequiredDayText: {
    color: "#dc2626",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  selectedDateText: {
    color: "#fff",
  },
  feeRequiredDateText: {
    color: "#dc2626",
  },
  feeIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 2,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeSlot: {
    width: "31%",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTimeSlot: {
    backgroundColor: "#3b82f6",
  },
  unavailableTimeSlot: {
    backgroundColor: "#f3f4f6",
    opacity: 0.6,
  },
  timeText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  selectedTimeText: {
    color: "#fff",
  },
  unavailableTimeText: {
    color: "#9ca3af",
  },
  unavailableLabel: {
    fontSize: 10,
    color: "#ef4444",
    fontWeight: "500",
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  summarySection: {
    marginBottom: 12,
  },
  summarySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 16,
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default RescheduleScreen;
