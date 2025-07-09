import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerBookings">;

type BookingType = "upcoming" | "past" | "cancelled";

interface Booking {
  id: string;
  businessName: string;
  service: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  price: string;
  bookingFee?: {
    amount: number;
    type: "reservation" | "deductible";
    description: string;
    isRefundable: boolean;
  };
  paymentStatus?: "paid" | "pending" | "refunded";
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: "B2025061",
    businessName: "Le Petit Café",
    service: "Tunisian Mint Tea",
    date: "Today",
    time: "10:30 AM",
    status: "confirmed",
    price: "5 TND",
  },
  {
    id: "B2025055",
    businessName: "Modern Barber Shop",
    service: "Haircut & Beard Trim",
    date: "Tomorrow",
    time: "2:00 PM",
    status: "confirmed",
    price: "35 TND",
  },
  {
    id: "B2025042",
    businessName: "Le Petit Café",
    service: "Breakfast Platter",
    date: "June 12, 2025", // Saturday - weekend booking
    time: "9:00 AM",
    status: "confirmed",
    price: "25 TND",
    bookingFee: {
      amount: 30,
      type: "reservation",
      description: "Weekend booking fee",
      isRefundable: false,
    },
    paymentStatus: "paid",
  },
  {
    id: "B2025030",
    businessName: "Salon de Beauté",
    service: "Manicure",
    date: "May 28, 2025",
    time: "4:30 PM",
    status: "completed",
    price: "40 TND",
  },
  {
    id: "B2025022",
    businessName: "Bistro Tunis",
    service: "Dinner Reservation (2 people)",
    date: "May 25, 2025",
    time: "7:30 PM",
    status: "completed",
    price: "120 TND",
  },
  {
    id: "B2025018",
    businessName: "Al Madina Restaurant",
    service: "Lunch Reservation (4 people)",
    date: "May 20, 2025",
    time: "1:00 PM",
    status: "cancelled",
    price: "200 TND",
  },
];

const CustomerBookingsScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<BookingType>("upcoming");

  const getFilteredBookings = () => {
    switch (activeTab) {
      case "upcoming":
        return mockBookings.filter((booking) => booking.status === "confirmed");
      case "past":
        return mockBookings.filter((booking) => booking.status === "completed");
      case "cancelled":
        return mockBookings.filter((booking) => booking.status === "cancelled");
      default:
        return [];
    }
  };

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const getStatusColor = () => {
      switch (item.status) {
        case "confirmed":
          return "#10b981"; // green
        case "completed":
          return "#6b7280"; // gray
        case "cancelled":
          return "#ef4444"; // red
        default:
          return "#6b7280";
      }
    };

    const getStatusText = () => {
      switch (item.status) {
        case "confirmed":
          return "Confirmed";
        case "completed":
          return "Completed";
        case "cancelled":
          return "Cancelled";
        default:
          return item.status;
      }
    };

    return (
      <TouchableOpacity style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor()}20` },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View style={styles.bookingInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>{item.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.serviceContainer}>
          <Text style={styles.serviceLabel}>Service:</Text>
          <Text style={styles.serviceText}>{item.service}</Text>
        </View>

        {/* Booking Fee Information */}
        {item.bookingFee && (
          <View style={styles.feeContainer}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Booking Fee:</Text>
              <Text style={styles.feeAmount}>
                {item.bookingFee.amount} TND ({item.bookingFee.type})
              </Text>
            </View>
            <Text style={styles.feeDescription}>
              {item.bookingFee.description}
            </Text>
            <View style={styles.paymentStatusRow}>
              <Text style={styles.paymentLabel}>Payment:</Text>
              <View style={styles.paymentStatusContainer}>
                <Ionicons
                  name={
                    item.paymentStatus === "paid"
                      ? "checkmark-circle"
                      : "time-outline"
                  }
                  size={14}
                  color={item.paymentStatus === "paid" ? "#10b981" : "#f59e0b"}
                />
                <Text
                  style={[
                    styles.paymentStatusText,
                    {
                      color:
                        item.paymentStatus === "paid" ? "#10b981" : "#f59e0b",
                    },
                  ]}
                >
                  {item.paymentStatus === "paid" ? "Paid" : "Pending"}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bookingFooter}>
          <Text style={styles.bookingId}>#{item.id}</Text>
          <Text style={styles.bookingPrice}>{item.price}</Text>
        </View>

        {item.status === "confirmed" && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={() =>
                navigation.navigate("Reschedule", {
                  booking: {
                    id: item.id,
                    businessName: item.businessName,
                    service: item.service,
                    date: item.date,
                    time: item.time,
                    status: item.status,
                  },
                })
              }
            >
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                navigation.navigate("Cancellation", {
                  bookingId: item.id,
                  businessName: item.businessName,
                  service: item.service,
                  date: item.date,
                  time: item.time,
                  bookingFee: item.bookingFee,
                })
              }
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filteredBookings = getFilteredBookings();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "cancelled" && styles.activeTab]}
          onPress={() => setActiveTab("cancelled")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "cancelled" && styles.activeTabText,
            ]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Bookings</Text>
          <Text style={styles.emptyDescription}>
            {activeTab === "upcoming"
              ? "You don't have any upcoming bookings."
              : activeTab === "past"
              ? "You don't have any past bookings."
              : "You don't have any cancelled bookings."}
          </Text>
          {activeTab === "upcoming" && (
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => navigation.navigate("CustomerHome")}
            >
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  placeholder: {
    width: 28,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  bookingInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#4b5563",
  },
  serviceContainer: {
    marginBottom: 12,
  },
  serviceLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  serviceText: {
    fontSize: 14,
    color: "#111827",
  },
  feeContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  feeLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  feeAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#dc2626",
  },
  feeDescription: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 6,
  },
  paymentStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  paymentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  bookingId: {
    fontSize: 12,
    color: "#6b7280",
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  actionContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  rescheduleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fee2e2",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ef4444",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  bookNowButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomerBookingsScreen;
