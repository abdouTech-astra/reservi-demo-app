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
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomerWaitlistScreen = ({ navigation }: any) => {
  const [activeWaitlists, setActiveWaitlists] = useState([
    {
      id: "wait_1",
      businessName: "Bistro Tunis",
      businessType: "Restaurant",
      joinedAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      estimatedWait: 25,
      currentPosition: 3,
      totalWaiting: 8,
      status: "waiting",
      partySize: 2,
      tablePreference: "Outdoor",
      notificationsEnabled: true,
      businessImage:
        "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=300",
      businessAddress: "12 Avenue Habib Bourguiba, Tunis",
      lastUpdate: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    },
    {
      id: "wait_2",
      businessName: "Modern Barber Shop",
      businessType: "Barber",
      joinedAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      estimatedWait: 10,
      currentPosition: 1,
      totalWaiting: 3,
      status: "next",
      serviceRequested: "Classic Cut & Beard Trim",
      stylistPreference: "Ahmed",
      notificationsEnabled: true,
      businessImage:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300",
      businessAddress: "45 Rue de la Liberté, Tunis",
      lastUpdate: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    },
  ]);

  const [waitlistHistory] = useState([
    {
      id: "hist_1",
      businessName: "Le Petit Café",
      businessType: "Café",
      joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60000 + 20 * 60000),
      actualWait: 18,
      estimatedWait: 20,
      status: "completed",
      rating: 5,
      experience: "Excellent - seated exactly on time!",
    },
    {
      id: "hist_2",
      businessName: "Family Table Restaurant",
      businessType: "Restaurant",
      joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
      status: "cancelled",
      reason: "Plans changed",
    },
  ]);

  const getTimeElapsed = (joinedAt: Date) => {
    const elapsed = Date.now() - joinedAt.getTime();
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "next":
        return "#10b981";
      case "waiting":
        return "#f59e0b";
      case "completed":
        return "#6b7280";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "next":
        return "checkmark-circle";
      case "waiting":
        return "time";
      case "completed":
        return "checkmark-done";
      case "cancelled":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const handleLeaveWaitlist = (waitlistId: string, businessName: string) => {
    Alert.alert(
      "Leave Waitlist",
      `Are you sure you want to leave the waitlist at ${businessName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            setActiveWaitlists((prev) =>
              prev.filter((w) => w.id !== waitlistId)
            );
            Alert.alert(
              "Left Waitlist",
              "You have been removed from the waitlist."
            );
          },
        },
      ]
    );
  };

  const handleNotificationToggle = (waitlistId: string) => {
    setActiveWaitlists((prev) =>
      prev.map((w) =>
        w.id === waitlistId
          ? { ...w, notificationsEnabled: !w.notificationsEnabled }
          : w
      )
    );
  };

  const renderWaitlistCard = ({ item }: { item: any }) => (
    <View style={styles.waitlistCard}>
      <View style={styles.cardHeader}>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <Text style={styles.businessType}>{item.businessType}</Text>
          <Text style={styles.businessAddress}>{item.businessAddress}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status === "next"
              ? "You're Next!"
              : item.status === "waiting"
              ? "Waiting"
              : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.waitDetails}>
        <View style={styles.positionContainer}>
          <View style={styles.positionCircle}>
            <Text style={styles.positionNumber}>{item.currentPosition}</Text>
          </View>
          <View style={styles.positionInfo}>
            <Text style={styles.positionText}>Position in queue</Text>
            <Text style={styles.totalWaiting}>
              {item.totalWaiting} people waiting
            </Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.timeText}>Est. {item.estimatedWait} min</Text>
          </View>
          <View style={styles.timeInfo}>
            <Ionicons name="clock-outline" size={16} color="#6b7280" />
            <Text style={styles.timeText}>
              Waiting {getTimeElapsed(item.joinedAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Service Details */}
      <View style={styles.serviceDetails}>
        {item.partySize && (
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>Party of {item.partySize}</Text>
          </View>
        )}
        {item.tablePreference && (
          <View style={styles.detailItem}>
            <Ionicons name="restaurant-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.tablePreference} seating
            </Text>
          </View>
        )}
        {item.serviceRequested && (
          <View style={styles.detailItem}>
            <Ionicons name="cut-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.serviceRequested}</Text>
          </View>
        )}
        {item.stylistPreference && (
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>
              Stylist: {item.stylistPreference}
            </Text>
          </View>
        )}
      </View>

      {/* Last Update */}
      <View style={styles.updateInfo}>
        <Text style={styles.updateText}>
          Last updated {getTimeElapsed(item.lastUpdate)} ago
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => handleNotificationToggle(item.id)}
        >
          <Ionicons
            name={
              item.notificationsEnabled ? "notifications" : "notifications-off"
            }
            size={16}
            color={item.notificationsEnabled ? "#3b82f6" : "#6b7280"}
          />
          <Text
            style={[
              styles.notificationText,
              { color: item.notificationsEnabled ? "#3b82f6" : "#6b7280" },
            ]}
          >
            {item.notificationsEnabled
              ? "Notifications On"
              : "Notifications Off"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.leaveButton}
          onPress={() => handleLeaveWaitlist(item.id, item.businessName)}
        >
          <Text style={styles.leaveButtonText}>Leave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistoryCard = ({ item }: { item: any }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <Text style={styles.businessType}>{item.businessType}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status)}
            size={14}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status), fontSize: 12 },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.historyDate}>
        {item.joinedAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      {item.status === "completed" && (
        <View style={styles.completedInfo}>
          <Text style={styles.completedText}>
            Waited {item.actualWait} minutes (est. {item.estimatedWait} min)
          </Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="star"
                  size={12}
                  color={i < item.rating ? "#f59e0b" : "#e5e7eb"}
                />
              ))}
            </View>
          )}
          {item.experience && (
            <Text style={styles.experienceText}>{item.experience}</Text>
          )}
        </View>
      )}

      {item.status === "cancelled" && item.reason && (
        <Text style={styles.cancelReason}>Reason: {item.reason}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Waitlists</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Waitlists */}
        {activeWaitlists.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Waitlists</Text>
            <Text style={styles.sectionSubtitle}>
              You'll receive notifications when it's almost your turn
            </Text>
            <FlatList
              data={activeWaitlists}
              renderItem={renderWaitlistCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={48} color="#e5e7eb" />
            <Text style={styles.emptyTitle}>No Active Waitlists</Text>
            <Text style={styles.emptySubtitle}>
              Join a waitlist at your favorite restaurants and barber shops to
              skip the wait
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate("CustomerHome")}
            >
              <Text style={styles.exploreButtonText}>Explore Businesses</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Waitlist Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Waitlist Tips</Text>
          <View style={styles.tip}>
            <Ionicons name="notifications-outline" size={16} color="#3b82f6" />
            <Text style={styles.tipText}>
              Enable notifications to get updates about your position
            </Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="location-outline" size={16} color="#10b981" />
            <Text style={styles.tipText}>
              Arrive 5-10 minutes before your estimated time
            </Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="time-outline" size={16} color="#f59e0b" />
            <Text style={styles.tipText}>
              Wait times are updated in real-time
            </Text>
          </View>
        </View>

        {/* History */}
        {waitlistHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            <FlatList
              data={waitlistHistory}
              renderItem={renderHistoryCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
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
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
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
  waitlistCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  businessType: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  businessAddress: {
    fontSize: 12,
    color: "#9ca3af",
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
  waitDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  positionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  positionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  positionNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  positionInfo: {
    flex: 1,
  },
  positionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  totalWaiting: {
    fontSize: 12,
    color: "#6b7280",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#6b7280",
  },
  serviceDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#6b7280",
  },
  updateInfo: {
    marginBottom: 12,
  },
  updateText: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  notificationText: {
    fontSize: 12,
    fontWeight: "500",
  },
  leaveButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  leaveButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  completedInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  completedText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 4,
  },
  experienceText: {
    fontSize: 12,
    color: "#10b981",
    fontStyle: "italic",
  },
  cancelReason: {
    fontSize: 12,
    color: "#ef4444",
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  tipsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
});

export default CustomerWaitlistScreen;
