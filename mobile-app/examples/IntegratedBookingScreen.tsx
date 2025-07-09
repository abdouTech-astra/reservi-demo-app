import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useBookings } from "../hooks/useBookings";
import { businessService } from "../utils/databaseService";
import { BusinessWithRelations } from "../utils/databaseTypes";

// Example of a fully integrated booking screen using Supabase
export default function IntegratedBookingScreen() {
  const { user, profile } = useAuth();
  const {
    bookings,
    loading: bookingsLoading,
    createBooking,
    cancelBooking,
    getUpcomingBookings,
    getPastBookings,
  } = useBookings();

  const [businesses, setBusinesses] = useState<BusinessWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "businesses" | "upcoming" | "past"
  >("businesses");

  // Fetch businesses from Supabase
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const data = await businessService.getAll({
        city: "Tunis", // You can make this dynamic
        featured: true,
      });
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      Alert.alert("Error", "Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  // Handle booking creation
  const handleBookBusiness = async (businessId: string, serviceId: string) => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to make a booking");
      return;
    }

    try {
      const bookingData = {
        business_id: businessId,
        service_id: serviceId,
        booking_date: new Date().toISOString().split("T")[0], // Today
        booking_time: "14:00", // 2 PM
        duration: 60,
        total_price: 0,
        status: "pending" as const,
      };

      const newBooking = await createBooking(bookingData);
      Alert.alert(
        "Booking Created!",
        `Your booking has been created with confirmation code: ${newBooking.confirmation_code}`
      );
    } catch (error: any) {
      Alert.alert("Booking Failed", error.message);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelBooking(bookingId, "Cancelled by customer");
              Alert.alert("Success", "Booking cancelled successfully");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBusinesses();
    setRefreshing(false);
  };

  // Load data on component mount
  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Render business item
  const renderBusinessItem = ({ item }: { item: BusinessWithRelations }) => (
    <View style={styles.businessCard}>
      <Text style={styles.businessName}>{item.name}</Text>
      <Text style={styles.businessDescription}>{item.description}</Text>
      <Text style={styles.businessInfo}>
        📍 {item.address}, {item.city}
      </Text>
      <Text style={styles.businessInfo}>
        ⭐ {item.rating} ({item.total_reviews} reviews)
      </Text>

      {item.services && item.services.length > 0 && (
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Services:</Text>
          {item.services.slice(0, 2).map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceButton}
              onPress={() => handleBookBusiness(item.id, service.id)}
            >
              <Text style={styles.serviceText}>
                {service.name} - {service.price} TND
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // Render booking item
  const renderBookingItem = ({ item }: { item: any }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingBusiness}>
        {item.business?.name || "Unknown Business"}
      </Text>
      <Text style={styles.bookingService}>
        {item.service?.name || "Unknown Service"}
      </Text>
      <Text style={styles.bookingDate}>
        📅 {item.booking_date} at {item.booking_time}
      </Text>
      <Text
        style={[styles.bookingStatus, { color: getStatusColor(item.status) }]}
      >
        Status: {item.status.toUpperCase()}
      </Text>

      {item.status === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelBooking(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      case "completed":
        return "#2196F3";
      default:
        return "#666";
    }
  };

  // Render content based on selected tab
  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    switch (selectedTab) {
      case "businesses":
        return (
          <FlatList
            data={businesses}
            renderItem={renderBusinessItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
          />
        );

      case "upcoming":
        const upcomingBookings = getUpcomingBookings();
        return (
          <FlatList
            data={upcomingBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No upcoming bookings</Text>
            }
            contentContainerStyle={styles.listContainer}
          />
        );

      case "past":
        const pastBookings = getPastBookings();
        return (
          <FlatList
            data={pastBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No past bookings</Text>
            }
            contentContainerStyle={styles.listContainer}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reservi</Text>
        {profile && (
          <Text style={styles.welcomeText}>
            Welcome, {profile.full_name || "User"}!
          </Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "businesses" && styles.activeTab]}
          onPress={() => setSelectedTab("businesses")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "businesses" && styles.activeTabText,
            ]}
          >
            Businesses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "upcoming" && styles.activeTab]}
          onPress={() => setSelectedTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming ({getUpcomingBookings().length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "past" && styles.activeTab]}
          onPress={() => setSelectedTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "past" && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Loading overlay for booking operations */}
      {bookingsLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.overlayText}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  listContainer: {
    padding: 15,
  },
  businessCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  businessDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  businessInfo: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  servicesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  serviceButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 5,
  },
  serviceText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingBusiness: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bookingService: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  bookingDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 50,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
});
