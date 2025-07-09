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
  TextInput,
  Animated,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import {
  WaitlistEntry,
  WaitlistNotification,
  WaitlistSettings,
  mockWaitlistEntries,
  mockWaitlistNotifications,
  getWaitlistPosition,
  getWaitlistSummary,
  estimateWaitTime,
  DEFAULT_WAITLIST_SETTINGS,
  createWaitlistEntry,
  extendWaitlistEntry,
  cancelWaitlistEntry,
} from "../../utils/waitlistSystem";

type Props = NativeStackScreenProps<RootStackParamList, "Waitlist">;

const WaitlistScreen = ({ navigation }: Props) => {
  const [waitlistEntries, setWaitlistEntries] =
    useState<WaitlistEntry[]>(mockWaitlistEntries);
  const [notifications, setNotifications] = useState<WaitlistNotification[]>(
    mockWaitlistNotifications
  );
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [newWaitlistForm, setNewWaitlistForm] = useState({
    businessName: "",
    serviceName: "",
    preferredDate: "",
    preferredTime: "",
    alternativeTimes: [] as string[],
  });

  const customerId = "customer_001"; // Mock customer ID
  const customerName = "Ahmed Ben Ali";
  const customerPhone = "+216 20 123 456";

  const waitlistSummary = getWaitlistSummary(waitlistEntries, customerId);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update positions and estimated wait times
      setWaitlistEntries((prevEntries) =>
        prevEntries.map((entry) => ({
          ...entry,
          estimatedWaitTime: estimateWaitTime(
            getWaitlistPosition(prevEntries, entry.id),
            { ...DEFAULT_WAITLIST_SETTINGS, businessId: entry.businessId }
          ),
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleJoinWaitlist = () => {
    if (
      !newWaitlistForm.businessName ||
      !newWaitlistForm.serviceName ||
      !newWaitlistForm.preferredDate ||
      !newWaitlistForm.preferredTime
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newEntry = createWaitlistEntry(
      customerId,
      customerName,
      customerPhone,
      `business_${Date.now()}`,
      newWaitlistForm.businessName,
      `service_${Date.now()}`,
      newWaitlistForm.serviceName,
      newWaitlistForm.preferredDate,
      newWaitlistForm.preferredTime,
      newWaitlistForm.alternativeTimes,
      4, // Customer level
      false, // VIP status
      { ...DEFAULT_WAITLIST_SETTINGS, businessId: `business_${Date.now()}` }
    );

    setWaitlistEntries((prev) => [...prev, newEntry]);
    setShowJoinModal(false);
    setNewWaitlistForm({
      businessName: "",
      serviceName: "",
      preferredDate: "",
      preferredTime: "",
      alternativeTimes: [],
    });

    Alert.alert(
      "Joined Waitlist! 🎉",
      `You've been added to the waitlist for ${newWaitlistForm.serviceName} at ${newWaitlistForm.businessName}. We'll notify you when a spot opens up!`
    );
  };

  const handleExtendWaitlist = (entry: WaitlistEntry) => {
    Alert.alert(
      "Extend Waitlist",
      "Would you like to extend your waitlist entry for 24 more hours?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Extend",
          onPress: () => {
            const extendedEntry = extendWaitlistEntry(entry, 24);
            setWaitlistEntries((prev) =>
              prev.map((e) => (e.id === entry.id ? extendedEntry : e))
            );
            Alert.alert("Success", "Your waitlist entry has been extended!");
          },
        },
      ]
    );
  };

  const handleCancelWaitlist = (entry: WaitlistEntry) => {
    Alert.alert(
      "Cancel Waitlist",
      "Are you sure you want to remove yourself from this waitlist?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            const cancelledEntry = cancelWaitlistEntry(
              entry,
              "Customer cancelled"
            );
            setWaitlistEntries((prev) =>
              prev.map((e) => (e.id === entry.id ? cancelledEntry : e))
            );
            Alert.alert("Cancelled", "You've been removed from the waitlist.");
          },
        },
      ]
    );
  };

  const handleNotificationAction = (
    notification: WaitlistNotification,
    action: "book" | "decline"
  ) => {
    if (action === "book" && notification.availableSlot) {
      Alert.alert(
        "Book Now",
        `Would you like to book ${notification.availableSlot.time} on ${notification.availableSlot.date}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Book Now",
            onPress: () => {
              // Navigate to booking screen with pre-filled data
              Alert.alert(
                "Success",
                "Booking confirmed! Redirecting to payment..."
              );
              // Remove from waitlist and mark as converted
              setWaitlistEntries((prev) =>
                prev.map((entry) =>
                  entry.id === notification.waitlistEntryId
                    ? { ...entry, status: "converted" as const }
                    : entry
                )
              );
            },
          },
        ]
      );
    } else {
      // Mark notification as declined
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, actionTaken: "declined" as const }
            : n
        )
      );
    }
  };

  const getStatusColor = (status: WaitlistEntry["status"]) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "notified":
        return "#f59e0b";
      case "expired":
        return "#ef4444";
      case "converted":
        return "#3b82f6";
      case "cancelled":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: WaitlistEntry["status"]) => {
    switch (status) {
      case "active":
        return "time-outline";
      case "notified":
        return "notifications-outline";
      case "expired":
        return "close-circle-outline";
      case "converted":
        return "checkmark-circle-outline";
      case "cancelled":
        return "ban-outline";
      default:
        return "help-circle-outline";
    }
  };

  const renderWaitlistSummary = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Your Waitlist Summary</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {waitlistSummary.activeEntries}
          </Text>
          <Text style={styles.summaryLabel}>Active Waitlists</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            #{waitlistSummary.topPosition || "-"}
          </Text>
          <Text style={styles.summaryLabel}>Best Position</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {Math.round(waitlistSummary.totalWaitTime / 60)}h
          </Text>
          <Text style={styles.summaryLabel}>Est. Wait Time</Text>
        </View>
      </View>
    </View>
  );

  const renderNotificationCard = (notification: WaitlistNotification) => (
    <View key={notification.id} style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Ionicons
            name={
              notification.type === "spot_available"
                ? "notifications"
                : "information-circle"
            }
            size={20}
            color="#3b82f6"
          />
        </View>
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>
            {notification.sentAt.toLocaleTimeString()}
          </Text>
        </View>
      </View>
      <Text style={styles.notificationMessage}>{notification.message}</Text>

      {notification.type === "spot_available" &&
        notification.availableSlot &&
        !notification.actionTaken && (
          <View style={styles.notificationActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              onPress={() => handleNotificationAction(notification, "decline")}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.bookButton]}
              onPress={() => handleNotificationAction(notification, "book")}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );

  const renderWaitlistCard = (entry: WaitlistEntry) => {
    const position = getWaitlistPosition(waitlistEntries, entry.id);
    const isActive = entry.status === "active";

    return (
      <TouchableOpacity
        key={entry.id}
        style={[
          styles.waitlistCard,
          { borderLeftColor: getStatusColor(entry.status) },
        ]}
        onPress={() => setSelectedEntry(entry)}
      >
        <View style={styles.waitlistHeader}>
          <View style={styles.waitlistInfo}>
            <Text style={styles.businessName}>{entry.businessName}</Text>
            <Text style={styles.serviceName}>{entry.serviceName}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(entry.status) },
            ]}
          >
            <Ionicons
              name={getStatusIcon(entry.status) as any}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusText}>{entry.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.waitlistDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {entry.preferredDate} at {entry.preferredTime}
            </Text>
          </View>

          {isActive && (
            <>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>Position #{position}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  Est. wait: {Math.round((entry.estimatedWaitTime || 0) / 60)}h
                </Text>
              </View>
            </>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="hourglass-outline" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              Expires: {entry.expiresAt.toLocaleDateString()}
            </Text>
          </View>
        </View>

        {isActive && (
          <View style={styles.waitlistActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleExtendWaitlist(entry)}
            >
              <Ionicons name="time-outline" size={16} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Extend</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelWaitlist(entry)}
            >
              <Ionicons name="close-outline" size={16} color="#ef4444" />
              <Text style={[styles.actionButtonText, { color: "#ef4444" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const activeNotifications = notifications.filter((n) => !n.actionTaken);
  const activeWaitlists = waitlistEntries.filter(
    (entry) => entry.customerId === customerId && entry.status === "active"
  );
  const pastWaitlists = waitlistEntries.filter(
    (entry) => entry.customerId === customerId && entry.status !== "active"
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
        <Text style={styles.headerTitle}>Waitlists</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowJoinModal(true)}
        >
          <Ionicons name="add" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderWaitlistSummary()}

        {activeNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🔔 Notifications ({activeNotifications.length})
            </Text>
            {activeNotifications.map(renderNotificationCard)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ⏳ Active Waitlists ({activeWaitlists.length})
          </Text>
          {activeWaitlists.length > 0 ? (
            activeWaitlists.map(renderWaitlistCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No active waitlists</Text>
              <Text style={styles.emptyStateSubtext}>
                Join a waitlist when your preferred time is full
              </Text>
            </View>
          )}
        </View>

        {pastWaitlists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📋 Past Waitlists ({pastWaitlists.length})
            </Text>
            {pastWaitlists.map(renderWaitlistCard)}
          </View>
        )}
      </ScrollView>

      {/* Join Waitlist Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join Waitlist</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowJoinModal(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Business Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWaitlistForm.businessName}
                  onChangeText={(text) =>
                    setNewWaitlistForm((prev) => ({
                      ...prev,
                      businessName: text,
                    }))
                  }
                  placeholder="Enter business name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Service Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWaitlistForm.serviceName}
                  onChangeText={(text) =>
                    setNewWaitlistForm((prev) => ({
                      ...prev,
                      serviceName: text,
                    }))
                  }
                  placeholder="Enter service name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Preferred Date *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWaitlistForm.preferredDate}
                  onChangeText={(text) =>
                    setNewWaitlistForm((prev) => ({
                      ...prev,
                      preferredDate: text,
                    }))
                  }
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Preferred Time *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWaitlistForm.preferredTime}
                  onChangeText={(text) =>
                    setNewWaitlistForm((prev) => ({
                      ...prev,
                      preferredTime: text,
                    }))
                  }
                  placeholder="HH:MM AM/PM"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => setShowJoinModal(false)}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.joinButton]}
                  onPress={handleJoinWaitlist}
                >
                  <Text style={styles.joinButtonText}>Join Waitlist</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Waitlist Detail Modal */}
      <Modal
        visible={!!selectedEntry}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEntry(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedEntry && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Waitlist Details</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedEntry(null)}
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailModalContent}>
                  <Text style={styles.detailModalBusiness}>
                    {selectedEntry.businessName}
                  </Text>
                  <Text style={styles.detailModalService}>
                    {selectedEntry.serviceName}
                  </Text>

                  <View style={styles.detailModalInfo}>
                    <View style={styles.detailModalRow}>
                      <Text style={styles.detailModalLabel}>Status:</Text>
                      <Text
                        style={[
                          styles.detailModalValue,
                          { color: getStatusColor(selectedEntry.status) },
                        ]}
                      >
                        {selectedEntry.status.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.detailModalRow}>
                      <Text style={styles.detailModalLabel}>Joined:</Text>
                      <Text style={styles.detailModalValue}>
                        {selectedEntry.joinedAt.toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.detailModalRow}>
                      <Text style={styles.detailModalLabel}>Expires:</Text>
                      <Text style={styles.detailModalValue}>
                        {selectedEntry.expiresAt.toLocaleDateString()}
                      </Text>
                    </View>

                    {selectedEntry.status === "active" && (
                      <>
                        <View style={styles.detailModalRow}>
                          <Text style={styles.detailModalLabel}>Position:</Text>
                          <Text style={styles.detailModalValue}>
                            #
                            {getWaitlistPosition(
                              waitlistEntries,
                              selectedEntry.id
                            )}
                          </Text>
                        </View>

                        <View style={styles.detailModalRow}>
                          <Text style={styles.detailModalLabel}>
                            Est. Wait:
                          </Text>
                          <Text style={styles.detailModalValue}>
                            {Math.round(
                              (selectedEntry.estimatedWaitTime || 0) / 60
                            )}{" "}
                            hours
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  notificationTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3b82f6",
    marginLeft: 4,
  },
  declineButton: {
    borderColor: "#ef4444",
  },
  declineButtonText: {
    color: "#ef4444",
  },
  bookButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  bookButtonText: {
    color: "#fff",
  },
  waitlistCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  waitlistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  waitlistInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  serviceName: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
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
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  waitlistDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  waitlistActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelButton: {
    borderColor: "#ef4444",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
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
    padding: 24,
    width: "90%",
    maxWidth: 400,
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
    marginBottom: 20,
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
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelModalButton: {
    borderColor: "#d1d5db",
  },
  cancelModalButtonText: {
    color: "#6b7280",
    fontWeight: "500",
  },
  joinButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  detailModalContent: {
    paddingVertical: 8,
  },
  detailModalBusiness: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  detailModalService: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  detailModalInfo: {},
  detailModalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailModalLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  detailModalValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
});

export default WaitlistScreen;
