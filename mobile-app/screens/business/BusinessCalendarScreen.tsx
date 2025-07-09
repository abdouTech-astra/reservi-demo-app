import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { AppState, Booking } from "./types";
import { todayBookings, futureBookings } from "./mockData";
import BusinessModals from "./components/BusinessModals";
import {
  BusinessHeader,
  BusinessNavBar,
  SectionHeader,
  BookingCard,
} from "./components/BusinessUIComponents";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessCalendar">;

// Dummy days data for the calendar
const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
const currentDayIndex = new Date().getDate() - 1;

const BusinessCalendarScreen = ({ navigation }: Props) => {
  // Set up state
  const [state, setState] = useState<AppState>({
    language: "English",
    currency: "TND",
    autoCancel: true,
    autoCancelTime: 15,
    bookingStatusFilter: "all",
    dateFilter: "today",
    showStatusModal: false,
    showDisputeModal: false,
    showNotificationModal: false,
    showCapacityModal: false,
    showLanguageModal: false,
    selectedBooking: null,
    disputeNote: "",
    disputeProof: "",
    notificationTitle: "",
    notificationMessage: "",
    isLoading: false,
  });

  // State for calendar view
  const [selectedDate, setSelectedDate] = useState(currentDayIndex);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">(
    "day"
  );

  // Helper function to update state
  const updateState = (newState: Partial<AppState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // Handler for booking status updates
  const handleStatusChange = (
    booking: Booking,
    newStatus: Booking["status"]
  ) => {
    updateState({
      selectedBooking: booking,
      showStatusModal: true,
    });
  };

  // Handle dispute creation
  const handleDisputeCreate = (booking: Booking) => {
    updateState({
      selectedBooking: booking,
      showDisputeModal: true,
      disputeNote: booking.disputeReason || "",
      disputeProof: booking.disputeProof || "",
    });
  };

  // Handle call customer
  const handleCallCustomer = (booking: Booking) => {
    alert(`Calling ${booking.customerName} at ${booking.customerPhone}`);
  };

  // Dummy function to get bookings for a specific date
  const getBookingsForDate = (date: number): Booking[] => {
    // This is just dummy logic for the demo
    // In a real app, you would filter bookings based on the selected date
    if (date === currentDayIndex) {
      return todayBookings;
    } else if (date === currentDayIndex + 1) {
      return futureBookings;
    } else if (date > currentDayIndex && date < currentDayIndex + 5) {
      // Generate some random bookings for nearby future dates
      return futureBookings.slice(0, Math.floor(Math.random() * 3));
    }
    return [];
  };

  // Get month name
  const getMonthName = (month: number): string => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  // Function to get day name from index
  const getDayName = (day: number): string => {
    const date = new Date(selectedYear, selectedMonth, day);
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  };

  // Calendar day render
  const renderCalendarDay = ({ item }: { item: number }) => {
    const isSelected = selectedDate === item - 1;
    const isToday = currentDayIndex === item - 1;
    const hasBookings = getBookingsForDate(item - 1).length > 0;

    return (
      <TouchableOpacity
        style={[
          styles.calendarDay,
          isSelected && styles.selectedCalendarDay,
          isToday && styles.todayCalendarDay,
        ]}
        onPress={() => setSelectedDate(item - 1)}
      >
        <Text style={styles.calendarDayName}>{getDayName(item)}</Text>
        <Text
          style={[
            styles.calendarDayNumber,
            isSelected && styles.selectedCalendarDayText,
          ]}
        >
          {item}
        </Text>
        {hasBookings && <View style={styles.hasBookingsIndicator} />}
      </TouchableOpacity>
    );
  };

  // Get bookings for the selected date
  const bookingsForSelectedDate = getBookingsForDate(selectedDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <BusinessHeader
        title="Le Petit Café"
        subtitle="Calendar & Bookings"
        language={state.language}
        onLanguagePress={() => updateState({ showLanguageModal: true })}
        onSettingsPress={() => navigation.navigate("BusinessSettings")}
      />

      <View style={styles.calendarHeader}>
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.monthArrow}>
            <Ionicons name="chevron-back" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {getMonthName(selectedMonth)} {selectedYear}
          </Text>
          <TouchableOpacity style={styles.monthArrow}>
            <Ionicons name="chevron-forward" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              calendarView === "day" && styles.viewToggleButtonActive,
            ]}
            onPress={() => setCalendarView("day")}
          >
            <Text
              style={[
                styles.viewToggleText,
                calendarView === "day" && styles.viewToggleTextActive,
              ]}
            >
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              calendarView === "week" && styles.viewToggleButtonActive,
            ]}
            onPress={() => setCalendarView("week")}
          >
            <Text
              style={[
                styles.viewToggleText,
                calendarView === "week" && styles.viewToggleTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              calendarView === "month" && styles.viewToggleButtonActive,
            ]}
            onPress={() => setCalendarView("month")}
          >
            <Text
              style={[
                styles.viewToggleText,
                calendarView === "month" && styles.viewToggleTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={daysInMonth}
        renderItem={renderCalendarDay}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={styles.calendarDaysContainer}
        style={styles.calendarFlatList}
        initialScrollIndex={currentDayIndex}
        getItemLayout={(_, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
      />

      <View style={styles.dateHeader}>
        <Text style={styles.dateTitle}>
          {getDayName(selectedDate + 1)},{" "}
          {getMonthName(selectedMonth).slice(0, 3)} {selectedDate + 1}
        </Text>

        {bookingsForSelectedDate.length > 0 && (
          <View style={styles.bookingCountBadge}>
            <Text style={styles.bookingCountText}>
              {bookingsForSelectedDate.length} bookings
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {bookingsForSelectedDate.length > 0 ? (
          <View>
            <SectionHeader title="Bookings" />
            {bookingsForSelectedDate.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusChange={handleStatusChange}
                onDisputeCreate={handleDisputeCreate}
                onCall={handleCallCustomer}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#e5e7eb" />
            <Text style={styles.emptyStateTitle}>No Bookings</Text>
            <Text style={styles.emptyStateSubtitle}>
              There are no bookings scheduled for this date.
            </Text>
            <TouchableOpacity
              style={styles.createBookingButton}
              onPress={() =>
                alert("Create booking feature will be implemented")
              }
            >
              <Text style={styles.createBookingText}>Create Booking</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.timeSlotsContainer}>
          <SectionHeader title="Time Slots Availability" />

          <View style={styles.timeSlots}>
            <View style={styles.timeSlot}>
              <Text style={styles.timeSlotTime}>8:00 AM</Text>
              <View
                style={[styles.availabilityIndicator, styles.availableSlot]}
              >
                <Text style={styles.availabilityText}>3/10</Text>
              </View>
            </View>

            <View style={styles.timeSlot}>
              <Text style={styles.timeSlotTime}>10:00 AM</Text>
              <View style={[styles.availabilityIndicator, styles.limitedSlot]}>
                <Text style={styles.availabilityText}>8/10</Text>
              </View>
            </View>

            <View style={styles.timeSlot}>
              <Text style={styles.timeSlotTime}>12:00 PM</Text>
              <View style={[styles.availabilityIndicator, styles.fullSlot]}>
                <Text style={styles.availabilityText}>10/10</Text>
              </View>
            </View>

            <View style={styles.timeSlot}>
              <Text style={styles.timeSlotTime}>2:00 PM</Text>
              <View
                style={[styles.availabilityIndicator, styles.availableSlot]}
              >
                <Text style={styles.availabilityText}>5/10</Text>
              </View>
            </View>

            <View style={styles.timeSlot}>
              <Text style={styles.timeSlotTime}>4:00 PM</Text>
              <View style={[styles.availabilityIndicator, styles.limitedSlot]}>
                <Text style={styles.availabilityText}>7/10</Text>
              </View>
            </View>

            <View style={styles.timeSlot}>
              <Text style={styles.timeSlotTime}>6:00 PM</Text>
              <View
                style={[styles.availabilityIndicator, styles.availableSlot]}
              >
                <Text style={styles.availabilityText}>4/10</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BusinessNavBar
        active="calendar"
        onNavigate={(screen) =>
          navigation.navigate(screen as keyof RootStackParamList)
        }
      />

      <BusinessModals.StatusChangeModal
        state={state}
        updateState={updateState}
      />
      <BusinessModals.DisputeModal state={state} updateState={updateState} />
      <BusinessModals.LanguageModal state={state} updateState={updateState} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthArrow: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginHorizontal: 8,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 2,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggleText: {
    fontSize: 14,
    color: "#6b7280",
  },
  viewToggleTextActive: {
    color: "#111827",
    fontWeight: "500",
  },
  calendarFlatList: {
    maxHeight: 100,
    backgroundColor: "#fff",
  },
  calendarDaysContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  calendarDay: {
    width: 60,
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedCalendarDay: {
    backgroundColor: "#ebf5ff",
  },
  todayCalendarDay: {
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  calendarDayName: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  selectedCalendarDayText: {
    color: "#3b82f6",
  },
  hasBookingsIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
    marginTop: 2,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  bookingCountBadge: {
    backgroundColor: "#ebf5ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bookingCountText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3b82f6",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  createBookingButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createBookingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  timeSlotsContainer: {
    marginTop: 16,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  timeSlots: {
    marginTop: 8,
  },
  timeSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  timeSlotTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  availabilityIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  availableSlot: {
    backgroundColor: "#dcfce7",
  },
  limitedSlot: {
    backgroundColor: "#fef3c7",
  },
  fullSlot: {
    backgroundColor: "#fee2e2",
  },
});

export default BusinessCalendarScreen;
