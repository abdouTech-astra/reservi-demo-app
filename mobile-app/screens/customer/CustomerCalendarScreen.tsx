import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  parseISO,
} from "date-fns";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerCalendar">;

interface CalendarBooking {
  id: string;
  businessName: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  status: "confirmed" | "completed" | "cancelled" | "rescheduled";
  price: string;
  address?: string;
  phone?: string;
  notes?: string;
  canReschedule: boolean;
  canCancel: boolean;
}

interface CalendarDay {
  date: Date;
  bookings: CalendarBooking[];
  isCurrentMonth: boolean;
  isToday: boolean;
  hasBookings: boolean;
}

// Mock booking data
const mockBookings: CalendarBooking[] = [
  {
    id: "B2025061",
    businessName: "Le Petit Café",
    service: "Tunisian Mint Tea",
    date: "2025-01-15",
    time: "10:30 AM",
    duration: "30 min",
    status: "confirmed",
    price: "5 TND",
    address: "Avenue Habib Bourguiba, Tunis",
    phone: "+216 71 123 456",
    canReschedule: true,
    canCancel: true,
  },
  {
    id: "B2025062",
    businessName: "Modern Barber Shop",
    service: "Haircut & Beard Trim",
    date: "2025-01-18",
    time: "2:00 PM",
    duration: "45 min",
    status: "confirmed",
    price: "35 TND",
    address: "Rue de la Liberté, Tunis",
    phone: "+216 71 234 567",
    canReschedule: true,
    canCancel: true,
  },
  {
    id: "B2025063",
    businessName: "Salon de Beauté",
    service: "Manicure",
    date: "2025-01-22",
    time: "4:30 PM",
    duration: "60 min",
    status: "confirmed",
    price: "40 TND",
    address: "Avenue Mohamed V, Tunis",
    phone: "+216 71 345 678",
    canReschedule: true,
    canCancel: false,
  },
  {
    id: "B2025064",
    businessName: "Le Petit Café",
    service: "Breakfast Platter",
    date: "2025-01-10",
    time: "9:00 AM",
    duration: "30 min",
    status: "completed",
    price: "25 TND",
    address: "Avenue Habib Bourguiba, Tunis",
    phone: "+216 71 123 456",
    canReschedule: false,
    canCancel: false,
  },
  {
    id: "B2025065",
    businessName: "Fitness Center",
    service: "Personal Training",
    date: "2025-01-08",
    time: "6:00 PM",
    duration: "60 min",
    status: "cancelled",
    price: "50 TND",
    address: "Rue Ibn Khaldoun, Tunis",
    phone: "+216 71 456 789",
    canReschedule: false,
    canCancel: false,
  },
];

const CustomerCalendarScreen = ({ navigation }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<CalendarBooking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, statusFilter]);

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    const calendarDays = days.map((date) => {
      const dateString = format(date, "yyyy-MM-dd");
      const dayBookings = mockBookings.filter((booking) => {
        const matchesDate = booking.date === dateString;
        const matchesFilter =
          statusFilter === "all" || booking.status === statusFilter;
        return matchesDate && matchesFilter;
      });

      return {
        date,
        bookings: dayBookings,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        hasBookings: dayBookings.length > 0,
      };
    });

    setCalendarDays(calendarDays);
  };

  const handleDatePress = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (day.hasBookings) {
      // Show bookings for this date
      setSelectedBooking(day.bookings[0]);
      setShowBookingModal(true);
    }
  };

  const handleBookingPress = (booking: CalendarBooking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleReschedule = (booking: CalendarBooking) => {
    setShowBookingModal(false);
    navigation.navigate("Reschedule", {
      booking: {
        id: booking.id,
        businessName: booking.businessName,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        status: booking.status as any,
      },
    });
  };

  const handleCancel = (booking: CalendarBooking) => {
    setShowBookingModal(false);
    navigation.navigate("Cancellation", {
      bookingId: booking.id,
      businessName: booking.businessName,
      service: booking.service,
      date: booking.date,
      time: booking.time,
    });
  };

  const handleCallBusiness = (booking: CalendarBooking) => {
    if (booking.phone) {
      Alert.alert(
        "Call Business",
        `Call ${booking.businessName} at ${booking.phone}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Call",
            onPress: () => console.log(`Calling ${booking.phone}`),
          },
        ]
      );
    }
  };

  const getStatusColor = (status: CalendarBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      case "rescheduled":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: CalendarBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return "checkmark-circle-outline";
      case "completed":
        return "checkmark-done-outline";
      case "cancelled":
        return "close-circle-outline";
      case "rescheduled":
        return "refresh-outline";
      default:
        return "help-circle-outline";
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const exportToCalendar = () => {
    Alert.alert("Export to Calendar", "Choose your preferred calendar app:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Google Calendar",
        onPress: () => console.log("Export to Google Calendar"),
      },
      {
        text: "Apple Calendar",
        onPress: () => console.log("Export to Apple Calendar"),
      },
    ]);
  };

  const renderCalendarDay = (day: CalendarDay) => {
    const isSelected = selectedDate && isSameDay(day.date, selectedDate);

    return (
      <TouchableOpacity
        key={day.date.toISOString()}
        style={[
          styles.calendarDay,
          !day.isCurrentMonth && styles.otherMonthDay,
          day.isToday && styles.todayDay,
          isSelected && styles.selectedDay,
        ]}
        onPress={() => handleDatePress(day)}
      >
        <Text
          style={[
            styles.dayNumber,
            !day.isCurrentMonth && styles.otherMonthText,
            day.isToday && styles.todayText,
            isSelected && styles.selectedDayText,
          ]}
        >
          {format(day.date, "d")}
        </Text>
        {day.hasBookings && (
          <View style={styles.bookingIndicators}>
            {day.bookings.slice(0, 3).map((booking, index) => (
              <View
                key={booking.id}
                style={[
                  styles.bookingDot,
                  { backgroundColor: getStatusColor(booking.status) },
                ]}
              />
            ))}
            {day.bookings.length > 3 && (
              <Text style={styles.moreBookingsText}>
                +{day.bookings.length - 3}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderBookingModal = () => (
    <Modal
      visible={showBookingModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowBookingModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {selectedBooking && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Booking Details</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowBookingModal(false)}
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <Text style={styles.businessName}>
                      {selectedBooking.businessName}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: `${getStatusColor(
                            selectedBooking.status
                          )}20`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(selectedBooking.status)}
                        size={14}
                        color={getStatusColor(selectedBooking.status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(selectedBooking.status) },
                        ]}
                      >
                        {selectedBooking.status.charAt(0).toUpperCase() +
                          selectedBooking.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="cut-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {selectedBooking.service}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text style={styles.detailText}>
                        {format(
                          parseISO(selectedBooking.date),
                          "EEEE, MMMM d, yyyy"
                        )}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {selectedBooking.time} ({selectedBooking.duration})
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {selectedBooking.price}
                      </Text>
                    </View>
                    {selectedBooking.address && (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color="#6b7280"
                        />
                        <Text style={styles.detailText}>
                          {selectedBooking.address}
                        </Text>
                      </View>
                    )}
                    {selectedBooking.notes && (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="document-text-outline"
                          size={16}
                          color="#6b7280"
                        />
                        <Text style={styles.detailText}>
                          {selectedBooking.notes}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.actionButtons}>
                    {selectedBooking.phone && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.callButton]}
                        onPress={() => handleCallBusiness(selectedBooking)}
                      >
                        <Ionicons
                          name="call-outline"
                          size={18}
                          color="#3b82f6"
                        />
                        <Text style={styles.callButtonText}>Call</Text>
                      </TouchableOpacity>
                    )}

                    {selectedBooking.canReschedule && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.rescheduleButton]}
                        onPress={() => handleReschedule(selectedBooking)}
                      >
                        <Ionicons
                          name="refresh-outline"
                          size={18}
                          color="#f59e0b"
                        />
                        <Text style={styles.rescheduleButtonText}>
                          Reschedule
                        </Text>
                      </TouchableOpacity>
                    )}

                    {selectedBooking.canCancel && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleCancel(selectedBooking)}
                      >
                        <Ionicons
                          name="close-outline"
                          size={18}
                          color="#ef4444"
                        />
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const getUpcomingBookings = () => {
    const today = new Date();
    return mockBookings
      .filter((booking) => {
        const bookingDate = parseISO(booking.date);
        return bookingDate >= today && booking.status === "confirmed";
      })
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      .slice(0, 3);
  };

  const upcomingBookings = getUpcomingBookings();

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
        <Text style={styles.headerTitle}>My Calendar</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={exportToCalendar}
        >
          <Ionicons name="share-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth("prev")}
          >
            <Ionicons name="chevron-back" size={24} color="#3b82f6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.monthTitle} onPress={goToToday}>
            <Text style={styles.monthText}>
              {format(currentDate, "MMMM yyyy")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth("next")}
          >
            <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["all", "confirmed", "completed", "cancelled"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  statusFilter === status && styles.activeFilterChip,
                ]}
                onPress={() => setStatusFilter(status as any)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    statusFilter === status && styles.activeFilterChipText,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.dayHeader}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map(renderCalendarDay)}
          </View>
        </View>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            {upcomingBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={styles.upcomingBookingCard}
                onPress={() => handleBookingPress(booking)}
              >
                <View style={styles.upcomingBookingInfo}>
                  <Text style={styles.upcomingBusinessName}>
                    {booking.businessName}
                  </Text>
                  <Text style={styles.upcomingService}>{booking.service}</Text>
                  <Text style={styles.upcomingDateTime}>
                    {format(parseISO(booking.date), "MMM d")} at {booking.time}
                  </Text>
                </View>
                <View style={styles.upcomingBookingActions}>
                  <Text style={styles.upcomingPrice}>{booking.price}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate("CustomerHome")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>Book Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate("CustomerBookings")}
          >
            <Ionicons name="list-outline" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>All Bookings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderBookingModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
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
  exportButton: {
    padding: 4,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    flex: 1,
    alignItems: "center",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: "#3b82f6",
  },
  filterChipText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeFilterChipText: {
    color: "#fff",
  },
  calendar: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeaders: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 4,
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  todayDay: {
    backgroundColor: "#ebf5ff",
  },
  selectedDay: {
    backgroundColor: "#3b82f6",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  otherMonthText: {
    color: "#9ca3af",
  },
  todayText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  bookingIndicators: {
    flexDirection: "row",
    marginTop: 2,
    alignItems: "center",
  },
  bookingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  moreBookingsText: {
    fontSize: 8,
    color: "#6b7280",
    marginLeft: 2,
  },
  upcomingSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  upcomingBookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  upcomingBookingInfo: {
    flex: 1,
  },
  upcomingBusinessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  upcomingService: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  upcomingDateTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  upcomingBookingActions: {
    alignItems: "flex-end",
  },
  upcomingPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  quickActions: {
    flexDirection: "row",
    margin: 16,
    marginTop: 0,
  },
  quickAction: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b82f6",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  callButton: {
    borderColor: "#3b82f6",
    backgroundColor: "#ebf5ff",
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b82f6",
    marginLeft: 4,
  },
  rescheduleButton: {
    borderColor: "#f59e0b",
    backgroundColor: "#fef3c7",
  },
  rescheduleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f59e0b",
    marginLeft: 4,
  },
  cancelButton: {
    borderColor: "#ef4444",
    backgroundColor: "#fee2e2",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ef4444",
    marginLeft: 4,
  },
});

export default CustomerCalendarScreen;
