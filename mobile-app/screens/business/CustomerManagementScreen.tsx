import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerManagement">;

const { width } = Dimensions.get("window");

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  lastVisit: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShows: number;
  totalSpent: number;
  averageRating: number;
  loyaltyLevel: number;
  isVip: boolean;
  tags: string[];
  notes: string;
  preferredServices: string[];
  communicationPreference: "email" | "sms" | "both";
  status: "active" | "inactive" | "blocked";
  upcomingBookings: number;
}

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "Ahmed Ben Ali",
    email: "ahmed.benali@email.com",
    phone: "+216 20 123 456",
    joinDate: "2024-01-15",
    lastVisit: "2025-01-10",
    totalBookings: 25,
    completedBookings: 23,
    cancelledBookings: 2,
    noShows: 0,
    totalSpent: 850,
    averageRating: 4.8,
    loyaltyLevel: 6,
    isVip: true,
    tags: ["Regular", "High Value", "Punctual"],
    notes: "Prefers morning appointments. Always tips well.",
    preferredServices: ["Haircut", "Beard Trim"],
    communicationPreference: "both",
    status: "active",
    upcomingBookings: 2,
  },
  {
    id: "cust_002",
    name: "Leila Mansour",
    email: "leila.mansour@email.com",
    phone: "+216 21 234 567",
    joinDate: "2024-03-22",
    lastVisit: "2025-01-08",
    totalBookings: 18,
    completedBookings: 16,
    cancelledBookings: 2,
    noShows: 0,
    totalSpent: 720,
    averageRating: 4.9,
    loyaltyLevel: 5,
    isVip: false,
    tags: ["Regular", "Friendly"],
    notes: "Loves trying new services. Very social.",
    preferredServices: ["Manicure", "Facial"],
    communicationPreference: "email",
    status: "active",
    upcomingBookings: 1,
  },
  {
    id: "cust_003",
    name: "Mohamed Trabelsi",
    email: "mohamed.trabelsi@email.com",
    phone: "+216 22 345 678",
    joinDate: "2024-06-10",
    lastVisit: "2024-12-20",
    totalBookings: 8,
    completedBookings: 6,
    cancelledBookings: 1,
    noShows: 1,
    totalSpent: 240,
    averageRating: 4.2,
    loyaltyLevel: 2,
    isVip: false,
    tags: ["Occasional"],
    notes: "Sometimes runs late. Prefers afternoon slots.",
    preferredServices: ["Haircut"],
    communicationPreference: "sms",
    status: "active",
    upcomingBookings: 0,
  },
];

const CustomerManagementScreen = ({ navigation }: Props) => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "vip" | "inactive"
  >("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, selectedFilter, customers]);

  const filterCustomers = () => {
    let filtered = customers;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case "active":
        filtered = filtered.filter((customer) => customer.status === "active");
        break;
      case "vip":
        filtered = filtered.filter((customer) => customer.isVip);
        break;
      case "inactive":
        filtered = filtered.filter(
          (customer) => customer.status === "inactive"
        );
        break;
    }

    setFilteredCustomers(filtered);
  };

  const handleCustomerAction = (customer: Customer, action: string) => {
    switch (action) {
      case "view":
        setSelectedCustomer(customer);
        setShowCustomerModal(true);
        break;
      case "message":
        Alert.alert("Send Message", `Message sent to ${customer.name}!`);
        break;
      case "book":
        Alert.alert("Book Appointment", `Create booking for ${customer.name}?`);
        break;
    }
  };

  const renderCustomerCard = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => handleCustomerAction(item, "view")}
    >
      <View style={styles.customerHeader}>
        <View style={styles.customerAvatar}>
          <Text style={styles.avatarText}>
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Text>
        </View>
        <View style={styles.customerInfo}>
          <View style={styles.customerNameRow}>
            <Text style={styles.customerName}>{item.name}</Text>
            {item.isVip && (
              <View style={styles.vipBadge}>
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={styles.vipText}>VIP</Text>
              </View>
            )}
          </View>
          <Text style={styles.customerEmail}>{item.email}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
        </View>
        <View style={styles.customerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCustomerAction(item, "message")}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCustomerAction(item, "book")}
          >
            <Ionicons name="calendar-outline" size={18} color="#10b981" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.customerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalBookings}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalSpent} TND</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.status === "active" ? "#10b981" : "#f59e0b",
              },
            ]}
          />
          <Text style={styles.statLabel}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.customerFooter}>
        <Text style={styles.lastVisit}>
          Last visit: {new Date(item.lastVisit).toLocaleDateString()}
        </Text>
        <View style={styles.loyaltyBadge}>
          <Text style={styles.loyaltyText}>Level {item.loyaltyLevel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCustomerModal = () => (
    <Modal
      visible={showCustomerModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCustomerModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {selectedCustomer && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedCustomer.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCustomerModal(false)}
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.customerDetailSection}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  <View style={styles.detailRow}>
                    <Ionicons name="mail-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {selectedCustomer.email}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {selectedCustomer.phone}
                    </Text>
                  </View>
                </View>

                <View style={styles.customerDetailSection}>
                  <Text style={styles.sectionTitle}>Statistics</Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatValue}>
                        {selectedCustomer.totalBookings}
                      </Text>
                      <Text style={styles.modalStatLabel}>Total Bookings</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatValue}>
                        {selectedCustomer.completedBookings}
                      </Text>
                      <Text style={styles.modalStatLabel}>Completed</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatValue}>
                        {selectedCustomer.totalSpent} TND
                      </Text>
                      <Text style={styles.modalStatLabel}>Total Spent</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatValue}>
                        {selectedCustomer.averageRating.toFixed(1)}
                      </Text>
                      <Text style={styles.modalStatLabel}>Rating</Text>
                    </View>
                  </View>
                </View>

                {selectedCustomer.notes && (
                  <View style={styles.customerDetailSection}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <Text style={styles.notesText}>
                      {selectedCustomer.notes}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

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
        <Text style={styles.headerTitle}>Customer Management</Text>
        <TouchableOpacity
          style={styles.analyticsButton}
          onPress={() => setShowAnalytics(!showAnalytics)}
        >
          <Ionicons name="analytics-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchAndFilters}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "all" && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === "all" && styles.activeFilterChipText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "active" && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter("active")}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === "active" && styles.activeFilterChipText,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "vip" && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter("vip")}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === "vip" && styles.activeFilterChipText,
              ]}
            >
              VIP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "inactive" && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter("inactive")}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === "inactive" && styles.activeFilterChipText,
              ]}
            >
              Inactive
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {renderCustomerModal()}
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
  analyticsButton: {
    padding: 4,
  },
  searchAndFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#111827",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  listContainer: {
    padding: 16,
  },
  customerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customerInfo: {
    flex: 1,
  },
  customerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  vipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  vipText: {
    fontSize: 10,
    color: "#92400e",
    fontWeight: "600",
    marginLeft: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: "#6b7280",
  },
  customerActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  customerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  customerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastVisit: {
    fontSize: 12,
    color: "#6b7280",
  },
  loyaltyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
  },
  loyaltyText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  customerDetailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modalStatItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 12,
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  modalStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});

export default CustomerManagementScreen;
