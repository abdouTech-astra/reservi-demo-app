import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Booking, Customer } from "../types";

// Header component for business screens
export const BusinessHeader = ({
  title,
  subtitle,
  onLanguagePress,
  onSettingsPress,
  language,
}: {
  title: string;
  subtitle: string;
  onLanguagePress: () => void;
  onSettingsPress: () => void;
  language: "English" | "Arabic" | "French";
}) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.businessName}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={onLanguagePress}
        >
          <Text style={styles.languageButtonText}>
            {language === "English"
              ? "EN"
              : language === "French"
              ? "FR"
              : "AR"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Navigation bar component
export const BusinessNavBar = ({
  active,
  onNavigate,
}: {
  active: "dashboard" | "calendar" | "services" | "settings";
  onNavigate: (screen: string) => void;
}) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[styles.navItem, active === "dashboard" && styles.activeNavItem]}
        onPress={() => onNavigate("BusinessDashboard")}
      >
        <Ionicons
          name={active === "dashboard" ? "home" : "home-outline"}
          size={24}
          color={active === "dashboard" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.navText,
            active === "dashboard" && styles.activeNavText,
          ]}
        >
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, active === "calendar" && styles.activeNavItem]}
        onPress={() => onNavigate("BusinessCalendar")}
      >
        <Ionicons
          name={active === "calendar" ? "calendar" : "calendar-outline"}
          size={24}
          color={active === "calendar" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.navText,
            active === "calendar" && styles.activeNavText,
          ]}
        >
          Calendar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, active === "services" && styles.activeNavItem]}
        onPress={() => onNavigate("BusinessServices")}
      >
        <Ionicons
          name={active === "services" ? "list" : "list-outline"}
          size={24}
          color={active === "services" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.navText,
            active === "services" && styles.activeNavText,
          ]}
        >
          Services
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, active === "settings" && styles.activeNavItem]}
        onPress={() => onNavigate("BusinessSettings")}
      >
        <Ionicons
          name={active === "settings" ? "settings" : "settings-outline"}
          size={24}
          color={active === "settings" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.navText,
            active === "settings" && styles.activeNavText,
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Section header component
export const SectionHeader = ({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Booking Card Component
export const BookingCard = ({
  booking,
  onStatusChange,
  onDisputeCreate,
  onCall,
}: {
  booking: Booking;
  onStatusChange: (booking: Booking, newStatus: Booking["status"]) => void;
  onDisputeCreate: (booking: Booking) => void;
  onCall: (booking: Booking) => void;
}) => {
  const getStatusColor = () => {
    switch (booking.status) {
      case "confirmed":
        return "#3b82f6"; // blue
      case "checked-in":
        return "#10b981"; // green
      case "completed":
        return "#6b7280"; // gray
      case "no-show":
        return "#ef4444"; // red
      case "cancelled":
        return "#f59e0b"; // amber
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = () => {
    switch (booking.status) {
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

  const getStatusText = () => {
    switch (booking.status) {
      case "confirmed":
        return "Confirmed";
      case "checked-in":
        return "Checked In";
      case "completed":
        return "Completed";
      case "no-show":
        return "No Show";
      case "cancelled":
        return "Cancelled";
      default:
        return booking.status;
    }
  };

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingRow}>
        <View>
          <View style={styles.customerNameRow}>
            <Text style={styles.customerName}>{booking.customerName}</Text>
            {booking.dispute && (
              <View style={styles.disputeBadge}>
                <Ionicons name="alert-circle" size={12} color="#ef4444" />
                <Text style={styles.disputeText}>Dispute</Text>
              </View>
            )}
          </View>
          <Text style={styles.bookingService}>{booking.service}</Text>
          {booking.tableNumber && (
            <Text style={styles.tableChairInfo}>
              Table: {booking.tableNumber}
            </Text>
          )}
          {booking.chairNumber && (
            <Text style={styles.tableChairInfo}>
              Chair: {booking.chairNumber}
            </Text>
          )}
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.bookingTime}>{booking.time}</Text>
          <Text style={styles.bookingDuration}>{booking.duration}</Text>
          <Text style={styles.bookingPrice}>{booking.price}</Text>
        </View>
      </View>

      <View style={styles.bookingFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor()}20` },
          ]}
        >
          <Ionicons name={getStatusIcon()} size={14} color={getStatusColor()} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>

        <View style={styles.bookingActions}>
          {booking.status === "confirmed" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.checkInButton]}
                onPress={() => onStatusChange(booking, "checked-in")}
              >
                <Text style={styles.actionButtonText}>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => onStatusChange(booking, "cancelled")}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {booking.status === "checked-in" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => onStatusChange(booking, "completed")}
            >
              <Text style={styles.actionButtonText}>Complete</Text>
            </TouchableOpacity>
          )}

          {(booking.status === "confirmed" ||
            booking.status === "checked-in") && (
            <TouchableOpacity
              style={[styles.actionButton, styles.noShowButton]}
              onPress={() => onStatusChange(booking, "no-show")}
            >
              <Text style={styles.actionButtonText}>No-Show</Text>
            </TouchableOpacity>
          )}

          {booking.status === "no-show" && !booking.dispute && (
            <TouchableOpacity
              style={[styles.actionButton, styles.disputeButton]}
              onPress={() => onDisputeCreate(booking)}
            >
              <Text style={styles.actionButtonText}>Report</Text>
            </TouchableOpacity>
          )}

          {booking.dispute && (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => onDisputeCreate(booking)}
            >
              <Text style={styles.actionButtonText}>View</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => onCall(booking)}
          >
            <Ionicons name="call-outline" size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Customer Row component
export const CustomerRow = ({ customer }: { customer: Customer }) => (
  <View style={styles.customerRow}>
    <View style={styles.customerInfo}>
      <View style={styles.customerAvatar}>
        <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
      </View>
      <View style={styles.customerDetails}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerMeta}>
          Last visit: {customer.lastVisit}
        </Text>
      </View>
    </View>

    <View style={styles.customerStats}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{customer.totalVisits}</Text>
        <Text style={styles.statLabel}>Visits</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{customer.rating.toFixed(1)}</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{customer.noShowCount}</Text>
        <Text style={styles.statLabel}>No-shows</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{customer.points}</Text>
        <Text style={styles.statLabel}>Points</Text>
      </View>
    </View>
  </View>
);

// Metric Card component
export const MetricCard = ({
  title,
  value,
  label,
  iconName,
  iconColor,
}: {
  title: string;
  value: string | number;
  label: string;
  iconName: string;
  iconColor: string;
}) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Ionicons name={iconName as any} size={16} color={iconColor} />
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageButton: {
    padding: 8,
    marginRight: 8,
  },
  languageButtonText: {
    fontSize: 14,
    color: "#6b7280",
  },
  settingsButton: {
    padding: 8,
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingBottom: 4, // For devices with home indicator
  },
  navItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: "#3b82f6",
  },
  navText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  activeNavText: {
    color: "#3b82f6",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3b82f6",
  },
  bookingCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  bookingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  customerNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  disputeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  disputeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#ef4444",
    marginLeft: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  bookingService: {
    fontSize: 14,
    color: "#6b7280",
  },
  tableChairInfo: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  bookingTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  bookingDuration: {
    fontSize: 12,
    color: "#6b7280",
  },
  bookingPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
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
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  bookingActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  checkInButton: {
    backgroundColor: "#10b981",
  },
  cancelButton: {
    backgroundColor: "#ef4444",
  },
  completeButton: {
    backgroundColor: "#6b7280",
  },
  noShowButton: {
    backgroundColor: "#f59e0b",
  },
  disputeButton: {
    backgroundColor: "#ef4444",
  },
  viewButton: {
    backgroundColor: "#3b82f6",
  },
  callButton: {
    padding: 4,
  },
  customerRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  customerDetails: {
    flex: 1,
  },
  customerMeta: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  customerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginLeft: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default {
  BusinessHeader,
  BusinessNavBar,
  SectionHeader,
  BookingCard,
  CustomerRow,
  MetricCard,
};
