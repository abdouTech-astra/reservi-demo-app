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
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { getCustomerReliabilityScore } from "../../utils/bookingUtils";
import { getCustomerEngagementMetrics } from "../../utils/analyticsTracker";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessDashboard">;

interface Booking {
  id: string;
  customerName: string;
  service: string;
  time: string;
  duration: string;
  status: "confirmed" | "checked-in" | "completed" | "no-show" | "cancelled";
  price: string;
  tableNumber?: string;
  chairNumber?: string;
  customerPhone?: string;
  note?: string;
  dispute?: boolean;
  disputeReason?: string;
  disputeProof?: string;
}

// Mock booking data - simplified
const todayBookings: Booking[] = [
  {
    id: "B2025061",
    customerName: "Ahmed Ben Ali",
    service: "Table for 2",
    time: "7:30 PM",
    duration: "90 min",
    status: "confirmed",
    price: "Reserved",
    tableNumber: "T3",
    customerPhone: "+216 20 123 456",
  },
  {
    id: "B2025062",
    customerName: "Leila Mansour",
    service: "Table for 4",
    time: "8:00 PM",
    duration: "120 min",
    status: "confirmed",
    price: "Reserved",
    tableNumber: "T5",
    customerPhone: "+216 21 234 567",
  },
  {
    id: "B2025060",
    customerName: "Mohamed Khelif",
    service: "Table for 1",
    time: "6:30 PM",
    duration: "60 min",
    status: "completed",
    price: "45 TND",
    tableNumber: "T2",
    customerPhone: "+216 22 345 678",
  },
];

const BusinessDashboardScreen = ({ navigation }: Props) => {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "bookings" | "analytics"
  >("overview");

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const getStatusColor = () => {
      switch (item.status) {
        case "confirmed":
          return "#3b82f6";
        case "checked-in":
          return "#10b981";
        case "completed":
          return "#6b7280";
        case "no-show":
          return "#ef4444";
        case "cancelled":
          return "#f59e0b";
        default:
          return "#6b7280";
      }
    };

    const getStatusIcon = () => {
      switch (item.status) {
        case "confirmed":
          return "time-outline";
        case "checked-in":
          return "checkmark-circle-outline";
        case "completed":
          return "checkmark-done-outline";
        case "no-show":
          return "close-circle-outline";
        case "cancelled":
          return "ban-outline";
        default:
          return "help-circle-outline";
      }
    };

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.bookingService}>{item.service}</Text>
            {item.tableNumber && (
              <Text style={styles.tableInfo}>Table: {item.tableNumber}</Text>
            )}
          </View>
          <View style={styles.bookingTime}>
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor()}20` },
            ]}
          >
            <Ionicons
              name={getStatusIcon()}
              size={14}
              color={getStatusColor()}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>

          <View style={styles.bookingActions}>
            {item.status === "confirmed" && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="checkmark" size={16} color="#10b981" />
                <Text style={styles.actionText}>Check In</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call-outline" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const OverviewTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="calendar" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Reservations</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="people" size={20} color="#10b981" />
            </View>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Guests</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>15 min</Text>
            <Text style={styles.statLabel}>Avg Wait</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="star" size={20} color="#ef4444" />
            </View>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="eye-outline" size={16} color="#8b5cf6" />
              <Text style={styles.metricTitle}>Profile Views</Text>
            </View>
            <Text style={styles.metricValue}>
              {(() => {
                const metrics = getCustomerEngagementMetrics(
                  "business_001",
                  "week"
                );
                return metrics.profileClicks.total;
              })()}
            </Text>
            <Text style={styles.metricLabel}>This Week</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.metricTrendText}>+15.2%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="heart-outline" size={16} color="#ef4444" />
              <Text style={styles.metricTitle}>Interest Rate</Text>
            </View>
            <Text style={styles.metricValue}>
              {(() => {
                const metrics = getCustomerEngagementMetrics(
                  "business_001",
                  "week"
                );
                return `${metrics.interestMetrics.conversionRate.toFixed(1)}%`;
              })()}
            </Text>
            <Text style={styles.metricLabel}>Conversion</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.metricTrendText}>+8.4%</Text>
            </View>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="cash-outline" size={16} color="#10b981" />
              <Text style={styles.metricTitle}>Revenue</Text>
            </View>
            <Text style={styles.metricValue}>2,890</Text>
            <Text style={styles.metricLabel}>TND This Month</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.metricTrendText}>+12.8%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="close-circle-outline" size={16} color="#ef4444" />
              <Text style={styles.metricTitle}>No-Show</Text>
            </View>
            <Text style={styles.metricValue}>5%</Text>
            <Text style={styles.metricLabel}>Rate</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-down" size={12} color="#10b981" />
              <Text style={styles.metricTrendText}>-2.1%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("BusinessServices")}
          >
            <Ionicons name="restaurant" size={24} color="#3b82f6" />
            <Text style={styles.actionTitle}>Menu & Services</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("BusinessCalendar")}
          >
            <Ionicons name="calendar" size={24} color="#10b981" />
            <Text style={styles.actionTitle}>Manage Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("BusinessAdvertising")}
          >
            <Ionicons name="megaphone" size={24} color="#f59e0b" />
            <Text style={styles.actionTitle}>Advertise</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("CustomerManagement")}
          >
            <Ionicons name="people" size={24} color="#8b5cf6" />
            <Text style={styles.actionTitle}>Customers</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurant Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Restaurant Features</Text>
        <Text style={styles.sectionSubtitle}>
          Enhance your customer experience
        </Text>

        <View style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <Ionicons name="time" size={20} color="#3b82f6" />
            <Text style={styles.featureTitle}>Live Wait Times</Text>
            <Switch
              value={true}
              trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
              thumbColor="#3b82f6"
            />
          </View>
          <Text style={styles.featureDescription}>
            Let customers see current wait times before arriving
          </Text>
          <Text style={styles.featureBenefit}>
            ✓ Reduces crowding ✓ Improves customer satisfaction
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <Ionicons name="restaurant" size={20} color="#10b981" />
            <Text style={styles.featureTitle}>Table Preferences</Text>
            <Switch
              value={false}
              trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
              thumbColor="#f4f4f5"
            />
          </View>
          <Text style={styles.featureDescription}>
            Allow customers to request outdoor, window, or quiet seating
          </Text>
          <Text style={styles.featureBenefit}>
            ✓ Higher satisfaction ✓ More repeat customers
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <Ionicons name="fast-food" size={20} color="#f59e0b" />
            <Text style={styles.featureTitle}>Pre-Order Menu</Text>
            <Switch
              value={false}
              trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
              thumbColor="#f4f4f5"
            />
          </View>
          <Text style={styles.featureDescription}>
            Let customers order food ahead of time
          </Text>
          <Text style={styles.featureBenefit}>
            ✓ Faster service ✓ Better kitchen planning
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const BookingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Today's Reservations</Text>

      <FlatList
        data={todayBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bookingsList}
      />
    </View>
  );

  const AnalyticsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Performance Analytics</Text>

      {/* Weekly Overview */}
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>This Week</Text>
        <View style={styles.analyticsRow}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>47</Text>
            <Text style={styles.analyticsLabel}>Reservations</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>156</Text>
            <Text style={styles.analyticsLabel}>Guests Served</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>2,890 TND</Text>
            <Text style={styles.analyticsLabel}>Revenue</Text>
          </View>
        </View>
      </View>

      {/* Customer Engagement Analytics */}
      <View style={styles.analyticsCard}>
        <View style={styles.engagementHeader}>
          <View>
            <Text style={styles.analyticsTitle}>Customer Engagement</Text>
            <Text style={styles.engagementDescription}>
              Track how customers discover and interact with your business
            </Text>
          </View>
          <View style={styles.engagementTrend}>
            <Ionicons name="trending-up" size={20} color="#10b981" />
            <Text style={styles.engagementTrendText}>+15.2%</Text>
          </View>
        </View>

        <View style={styles.engagementMetrics}>
          <View style={styles.engagementMetric}>
            <Text style={styles.engagementMetricValue}>
              {(() => {
                const metrics = getCustomerEngagementMetrics(
                  "business_001",
                  "week"
                );
                return metrics.profileClicks.total;
              })()}
            </Text>
            <Text style={styles.engagementMetricLabel}>Profile Views</Text>
            <Text style={styles.engagementMetricSubtext}>This week</Text>
          </View>
          <View style={styles.engagementMetric}>
            <Text style={styles.engagementMetricValue}>
              {(() => {
                const metrics = getCustomerEngagementMetrics(
                  "business_001",
                  "week"
                );
                return metrics.profileClicks.unique;
              })()}
            </Text>
            <Text style={styles.engagementMetricLabel}>Unique Visitors</Text>
            <Text style={styles.engagementMetricSubtext}>New customers</Text>
          </View>
          <View style={styles.engagementMetric}>
            <Text style={styles.engagementMetricValue}>
              {(() => {
                const metrics = getCustomerEngagementMetrics(
                  "business_001",
                  "week"
                );
                return `${metrics.interestMetrics.conversionRate.toFixed(1)}%`;
              })()}
            </Text>
            <Text style={styles.engagementMetricLabel}>Interest Rate</Text>
            <Text style={styles.engagementMetricSubtext}>Click to booking</Text>
          </View>
        </View>

        <View style={styles.topInterests}>
          <Text style={styles.topInterestsTitle}>Top Customer Interests</Text>
          <View style={styles.interestsList}>
            {(() => {
              const metrics = getCustomerEngagementMetrics(
                "business_001",
                "week"
              );
              return Object.entries(metrics.interestMetrics.byInterestType)
                .slice(0, 3)
                .map(([type, count], index) => (
                  <View key={type} style={styles.interestItem}>
                    <View style={styles.interestIcon}>
                      <Ionicons
                        name={
                          type === "service_view"
                            ? "list-outline"
                            : type === "booking_attempt"
                            ? "calendar-outline"
                            : type === "gallery_view"
                            ? "images-outline"
                            : "heart-outline"
                        }
                        size={16}
                        color="#6b7280"
                      />
                    </View>
                    <Text style={styles.interestName}>
                      {type
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </Text>
                    <Text style={styles.interestCount}>{count}</Text>
                  </View>
                ));
            })()}
          </View>
        </View>
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Reservation Trends</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart" size={48} color="#e5e7eb" />
          <Text style={styles.chartText}>Chart coming soon</Text>
        </View>
      </View>

      {/* Peak Hours */}
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Peak Hours</Text>
        <View style={styles.peakHourItem}>
          <Text style={styles.peakHourTime}>7:00 PM - 9:00 PM</Text>
          <Text style={styles.peakHourCount}>Most Popular</Text>
        </View>
        <View style={styles.peakHourItem}>
          <Text style={styles.peakHourTime}>12:00 PM - 2:00 PM</Text>
          <Text style={styles.peakHourCount}>Lunch Rush</Text>
        </View>
      </View>

      {/* Monthly Comparison */}
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Monthly Comparison</Text>
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>This Month</Text>
            <Text style={styles.comparisonValue}>189 bookings</Text>
            <Text style={styles.comparisonChange}>+23% vs last month</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Revenue</Text>
            <Text style={styles.comparisonValue}>8,450 TND</Text>
            <Text style={styles.comparisonChange}>+18% vs last month</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.businessName}>Bistro Tunis</Text>
          <Text style={styles.subtitle}>Restaurant Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("BusinessSettings")}
        >
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
          onPress={() => setSelectedTab("overview")}
        >
          <Ionicons
            name="home"
            size={20}
            color={selectedTab === "overview" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "bookings" && styles.activeTab]}
          onPress={() => setSelectedTab("bookings")}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={selectedTab === "bookings" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "bookings" && styles.activeTabText,
            ]}
          >
            Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "analytics" && styles.activeTab]}
          onPress={() => setSelectedTab("analytics")}
        >
          <Ionicons
            name="bar-chart"
            size={20}
            color={selectedTab === "analytics" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "analytics" && styles.activeTabText,
            ]}
          >
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {selectedTab === "overview" && <OverviewTab />}
        {selectedTab === "bookings" && <BookingsTab />}
        {selectedTab === "analytics" && <AnalyticsTab />}
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  statsContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginLeft: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  metricTrend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  metricTrendText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
    marginLeft: 4,
  },
  quickActionsContainer: {
    padding: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginTop: 8,
    textAlign: "center",
  },
  featuresContainer: {
    padding: 16,
  },
  featureCard: {
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
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginLeft: 12,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  featureBenefit: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
  },
  bookingsList: {
    paddingBottom: 20,
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
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  bookingService: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  tableInfo: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "500",
  },
  bookingTime: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  durationText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  bookingActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f0fdf4",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
  },
  callButton: {
    padding: 8,
  },
  analyticsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  analyticsItem: {
    alignItems: "center",
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  peakHourItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  peakHourTime: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  peakHourCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  engagementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  engagementDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  engagementTrend: {
    flexDirection: "row",
    alignItems: "center",
  },
  engagementTrendText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
    marginLeft: 4,
  },
  engagementMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  engagementMetric: {
    alignItems: "center",
  },
  engagementMetricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  engagementMetricLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  engagementMetricSubtext: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  topInterests: {
    marginBottom: 12,
  },
  topInterestsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  interestIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  interestName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  interestCount: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  comparisonItem: {
    alignItems: "center",
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  comparisonChange: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default BusinessDashboardScreen;
