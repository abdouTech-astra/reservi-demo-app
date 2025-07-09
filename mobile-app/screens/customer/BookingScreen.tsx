import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import {
  calculateBookingFee,
  formatBookingDateTime,
  BusinessSettings,
  BookingFee,
  isSpecialDay,
} from "../../utils/bookingUtils";
import { formatAmount, PaymentResult } from "../../utils/paymentUtils";
import {
  createWaitlistEntry,
  DEFAULT_WAITLIST_SETTINGS,
} from "../../utils/waitlistSystem";
import {
  BusinessAvailability,
  getAvailableTimeSlotsForDate,
  canBookAtTime,
  getBusinessHoursForDate,
  DEFAULT_WEEKLY_SCHEDULE,
  DEFAULT_HOLIDAYS,
} from "../../utils/availabilitySystem";

type Props = NativeStackScreenProps<RootStackParamList, "Booking">;

const mockBusiness = {
  id: "1",
  name: "Le Petit Café",
  image:
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
};

const mockServices = [
  { id: "1", name: "Tunisian Mint Tea", price: "5 TND", duration: "10 min" },
  { id: "2", name: "Specialty Coffee", price: "7 TND", duration: "10 min" },
  {
    id: "3",
    name: "Croissant & Coffee Combo",
    price: "12 TND",
    duration: "15 min",
  },
  { id: "4", name: "Fresh Orange Juice", price: "6 TND", duration: "5 min" },
  { id: "5", name: "Pastry Selection", price: "15 TND", duration: "20 min" },
  { id: "6", name: "Breakfast Platter", price: "25 TND", duration: "30 min" },
];

// Mock business availability
const mockBusinessAvailability: BusinessAvailability = {
  businessId: "business_001",
  timezone: "Africa/Tunis",
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  holidays: DEFAULT_HOLIDAYS,
  specialHours: [],
  defaultSlotDuration: 30,
  bufferTime: 5,
  advanceBookingDays: 30,
  lastMinuteBookingHours: 2,
  isActive: true,
  lastUpdated: new Date(),
};

const BookingScreen = ({ navigation, route }: Props) => {
  const { businessId } = route.params;
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [bookingFee, setBookingFee] = useState<BookingFee | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);

  // Calculate initial fee for today's date and load time slots
  React.useEffect(() => {
    const initialFee = calculateBookingFee(selectedDate, businessSettings);
    setBookingFee(initialFee);

    // Load available time slots for the selected date
    const slots = getAvailableTimeSlotsForDate(
      selectedDate,
      mockBusinessAvailability
    );
    const formattedSlots = slots.map((slot, index) => ({
      id: `slot_${index}`,
      time: `${slot.startTime}`,
      available: slot.isAvailable,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));
    setAvailableTimeSlots(formattedSlots);
  }, [selectedDate]);

  // Mock business settings - in real app, this would come from API
  const businessSettings: BusinessSettings = {
    allowFreeWeekendBookings: false,
    acceptWalkInsOnly: false,
    refundBookingFeesOnCancellation: true,
    weekendFeeAmount: 30,
    specialDayFeeAmount: 30,
    cancellationPolicyHours: 2,
    feeType: "reservation",
  };

  // Get dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
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
    // Calculate booking fee when date changes
    const fee = calculateBookingFee(date, businessSettings);
    setBookingFee(fee);

    // Show immediate feedback for fee calculation
    if (fee) {
      Alert.alert(
        "Booking Fee Required",
        `A ${formatAmount(fee.amount)} ${
          fee.type
        } fee is required for this date.\n\nReason: ${fee.description}`,
        [{ text: "OK" }]
      );
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedTime) {
      Alert.alert(
        "Incomplete Booking",
        "Please select a service and time slot."
      );
      return;
    }

    if (bookingFee) {
      // Show payment required alert
      Alert.alert(
        "Payment Required",
        `This booking requires a ${formatAmount(bookingFee.amount)} ${
          bookingFee.type
        } fee.\n\nReason: ${
          bookingFee.description
        }\n\nWould you like to proceed with payment?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Pay Now",
            onPress: () => proceedToPayment(),
          },
        ]
      );
    } else {
      // Free booking - proceed directly
      completeBooking();
    }
  };

  const proceedToPayment = () => {
    if (!bookingFee || !selectedService || !selectedTime) return;

    const selectedServiceData = mockServices.find(
      (s) => s.id === selectedService
    );
    const bookingId = `B${Date.now()}`;

    setIsProcessingPayment(true);

    navigation.navigate("Payment", {
      bookingId,
      amount: bookingFee.amount,
      description: `${bookingFee.description} - ${selectedServiceData?.name}`,
      customerEmail: "customer@example.com", // In real app, get from user profile
      customerPhone: "+216 20 123 456", // In real app, get from user profile
      onPaymentSuccess: (result: PaymentResult) => {
        setIsProcessingPayment(false);
        completeBooking(result);
      },
      onPaymentCancel: () => {
        setIsProcessingPayment(false);
      },
    });
  };

  const completeBooking = (paymentResult?: PaymentResult) => {
    // In a real app, you would submit the booking to the API
    // For now, we'll just navigate to the confirmation screen
    navigation.navigate("BookingConfirmed", {
      bookingDetails: {
        service: selectedService,
        date: selectedDate.toISOString(), // Convert to string for navigation
        time: selectedTime,
        notes,
        bookingFee,
        paymentResult,
      },
    });
  };

  const handleJoinWaitlist = (timeSlot: string) => {
    if (!selectedService) {
      Alert.alert("Select Service", "Please select a service first.");
      return;
    }

    const selectedServiceData = mockServices.find(
      (s) => s.id === selectedService
    );
    if (!selectedServiceData) return;

    Alert.alert(
      "Join Waitlist",
      `Would you like to join the waitlist for ${
        selectedServiceData.name
      } at ${timeSlot} on ${selectedDate.toLocaleDateString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join Waitlist",
          onPress: () => {
            // Create waitlist entry
            const waitlistEntry = createWaitlistEntry(
              "customer_001", // Mock customer ID
              "Ahmed Ben Ali", // Mock customer name
              "+216 20 123 456", // Mock customer phone
              businessId,
              mockBusiness.name,
              selectedService,
              selectedServiceData.name,
              selectedDate.toISOString().split("T")[0], // YYYY-MM-DD format
              timeSlot,
              [], // No alternative times for now
              4, // Mock customer level
              false, // Mock VIP status
              { ...DEFAULT_WAITLIST_SETTINGS, businessId }
            );

            Alert.alert(
              "Joined Waitlist! 🎉",
              `You've been added to the waitlist for ${selectedServiceData.name} at ${timeSlot}. We'll notify you when a spot opens up!`,
              [
                {
                  text: "View Waitlists",
                  onPress: () => navigation.navigate("Waitlist"),
                },
                { text: "OK" },
              ]
            );
          },
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
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{mockBusiness.name}</Text>
          <Text style={styles.businessId}>Business #{businessId}</Text>
        </View>

        {/* Fee Alert Banner */}
        {bookingFee && (
          <View style={styles.feeAlertBanner}>
            <View style={styles.feeAlertIcon}>
              <Ionicons name="card-outline" size={20} color="#dc2626" />
            </View>
            <View style={styles.feeAlertContent}>
              <Text style={styles.feeAlertTitle}>
                Booking Fee Required: {formatAmount(bookingFee.amount)}
              </Text>
              <Text style={styles.feeAlertDescription}>
                {bookingFee.description} •{" "}
                {bookingFee.isRefundable ? "Refundable" : "Non-refundable"}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          {mockServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceItem,
                selectedService === service.id && styles.selectedServiceItem,
              ]}
              onPress={() => setSelectedService(service.id)}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <View style={styles.serviceDetails}>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                  <Text style={styles.serviceDuration}>
                    <Ionicons name="time-outline" size={14} color="#6b7280" />{" "}
                    {service.duration}
                  </Text>
                </View>
              </View>
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedService === service.id && styles.radioOuterSelected,
                  ]}
                >
                  {selectedService === service.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}
          >
            {dates.map((date, index) => {
              const isWeekendDate = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {availableTimeSlots.map((slot) => (
              <View key={slot.id} style={styles.timeSlotContainer}>
                <TouchableOpacity
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
                {!slot.available && (
                  <TouchableOpacity
                    style={styles.waitlistButton}
                    onPress={() => handleJoinWaitlist(slot.time)}
                  >
                    <Ionicons name="list-outline" size={12} color="#f59e0b" />
                    <Text style={styles.waitlistButtonText}>Join Waitlist</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special requirements or notes for your booking"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.bookingSummary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>
              {selectedService
                ? mockServices.find((s) => s.id === selectedService)?.name
                : "Not selected"}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>
              {selectedTime
                ? availableTimeSlots.find((t) => t.id === selectedTime)?.time
                : "Not selected"}
            </Text>
          </View>
          {bookingFee && (
            <>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Booking Fee</Text>
                <Text style={styles.feeValue}>
                  {formatAmount(bookingFee.amount)} ({bookingFee.type})
                </Text>
              </View>
              <View style={styles.feeDescription}>
                <Text style={styles.feeDescriptionText}>
                  {bookingFee.description}
                </Text>
                <Text style={styles.feeRefundText}>
                  {bookingFee.isRefundable ? "Refundable" : "Non-refundable"}
                </Text>
              </View>
            </>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service Total</Text>
            <Text style={styles.totalValue}>
              {selectedService
                ? mockServices.find((s) => s.id === selectedService)?.price
                : "0 TND"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  businessInfo: {
    marginBottom: 24,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  businessId: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
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
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedServiceItem: {
    backgroundColor: "#ebf5ff",
    borderColor: "#3b82f6",
    borderWidth: 1,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginRight: 12,
  },
  serviceDuration: {
    fontSize: 14,
    color: "#6b7280",
  },
  radioContainer: {
    marginLeft: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#3b82f6",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3b82f6",
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
  timeSlotContainer: {
    width: "31%",
    marginBottom: 8,
  },
  timeSlot: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 4,
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
  waitlistButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  waitlistButtonText: {
    fontSize: 10,
    color: "#f59e0b",
    fontWeight: "500",
    marginLeft: 4,
  },
  notesInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#111827",
  },
  bookingSummary: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
  feeDescription: {
    backgroundColor: "#fef3c7",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  feeDescriptionText: {
    fontSize: 12,
    color: "#92400e",
    marginBottom: 2,
  },
  feeRefundText: {
    fontSize: 11,
    color: "#78350f",
    fontWeight: "500",
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
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default BookingScreen;
