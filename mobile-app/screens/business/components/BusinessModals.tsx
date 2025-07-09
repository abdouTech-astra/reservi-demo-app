import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Booking, AppState } from "../types";
import { mockWorkingHours } from "../mockData";

interface ModalProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

// Status Change Modal
export const StatusChangeModal = ({ state, updateState }: ModalProps) => {
  const confirmStatusChange = (newStatus: Booking["status"]) => {
    if (!state.selectedBooking) return;

    // In a real app, this would make an API call to update the booking
    alert(`Booking ${state.selectedBooking.id} status changed to ${newStatus}`);

    updateState({
      showStatusModal: false,
      selectedBooking: null,
    });
  };

  return (
    <Modal
      visible={state.showStatusModal}
      transparent
      animationType="fade"
      onRequestClose={() => updateState({ showStatusModal: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Booking Status</Text>
            <TouchableOpacity
              onPress={() => updateState({ showStatusModal: false })}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Select a new status for booking {state.selectedBooking?.id}
            </Text>

            <View style={styles.statusOptions}>
              <TouchableOpacity
                style={[styles.statusOption, styles.confirmedOption]}
                onPress={() => confirmStatusChange("confirmed")}
              >
                <Ionicons name="time-outline" size={24} color="#3b82f6" />
                <Text style={styles.statusOptionText}>Confirmed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusOption, styles.checkedInOption]}
                onPress={() => confirmStatusChange("checked-in")}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#10b981"
                />
                <Text style={styles.statusOptionText}>Checked In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusOption, styles.completedOption]}
                onPress={() => confirmStatusChange("completed")}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={24}
                  color="#6b7280"
                />
                <Text style={styles.statusOptionText}>Completed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusOption, styles.noShowOption]}
                onPress={() => confirmStatusChange("no-show")}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="#ef4444"
                />
                <Text style={styles.statusOptionText}>No-Show</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusOption, styles.cancelledOption]}
                onPress={() => confirmStatusChange("cancelled")}
              >
                <Ionicons name="ban-outline" size={24} color="#f59e0b" />
                <Text style={styles.statusOptionText}>Cancelled</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Dispute Modal
export const DisputeModal = ({ state, updateState }: ModalProps) => {
  const submitDispute = () => {
    if (!state.selectedBooking) return;

    // In a real app, this would make an API call to submit the dispute
    alert(
      `Dispute for booking ${state.selectedBooking.id} has been submitted.`
    );

    updateState({
      showDisputeModal: false,
      selectedBooking: null,
      disputeNote: "",
      disputeProof: "",
    });
  };

  return (
    <Modal
      visible={state.showDisputeModal}
      transparent
      animationType="fade"
      onRequestClose={() => updateState({ showDisputeModal: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {state.selectedBooking?.dispute
                ? "View Dispute"
                : "Report No-Show"}
            </Text>
            <TouchableOpacity
              onPress={() => updateState({ showDisputeModal: false })}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.bookingDetailItem}>
              <Text style={styles.bookingDetailLabel}>Booking ID:</Text>
              <Text style={styles.bookingDetailValue}>
                {state.selectedBooking?.id}
              </Text>
            </View>

            <View style={styles.bookingDetailItem}>
              <Text style={styles.bookingDetailLabel}>Customer:</Text>
              <Text style={styles.bookingDetailValue}>
                {state.selectedBooking?.customerName}
              </Text>
            </View>

            <View style={styles.bookingDetailItem}>
              <Text style={styles.bookingDetailLabel}>Time:</Text>
              <Text style={styles.bookingDetailValue}>
                {state.selectedBooking?.time}
              </Text>
            </View>

            <Text style={styles.inputLabel}>Reason for Dispute:</Text>
            <TextInput
              style={styles.disputeInput}
              placeholder="Explain what happened..."
              value={state.disputeNote}
              onChangeText={(text) => updateState({ disputeNote: text })}
              multiline
              numberOfLines={4}
              editable={!state.selectedBooking?.dispute}
            />

            <View style={styles.disputeUpload}>
              <Text style={styles.inputLabel}>Proof (optional):</Text>
              {state.disputeProof ? (
                <View style={styles.proofPreview}>
                  <Text style={styles.proofText}>Photo Attached</Text>
                  <TouchableOpacity
                    style={styles.removeProofButton}
                    disabled={!!state.selectedBooking?.dispute}
                    onPress={() => updateState({ disputeProof: "" })}
                  >
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  disabled={!!state.selectedBooking?.dispute}
                  onPress={() =>
                    updateState({ disputeProof: "proof_placeholder" })
                  }
                >
                  <Ionicons name="camera-outline" size={20} color="#3b82f6" />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
              )}
            </View>

            {!state.selectedBooking?.dispute && (
              <TouchableOpacity
                style={styles.submitDisputeButton}
                onPress={submitDispute}
              >
                <Text style={styles.submitDisputeText}>Submit Report</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Push Notification Modal
export const NotificationModal = ({ state, updateState }: ModalProps) => {
  const sendNotification = () => {
    if (!state.notificationTitle || !state.notificationMessage) {
      alert("Please fill in all fields");
      return;
    }

    updateState({ isLoading: true });

    // Simulate API call
    setTimeout(() => {
      alert("Your notification has been sent to all eligible customers.");

      updateState({
        showNotificationModal: false,
        notificationTitle: "",
        notificationMessage: "",
        isLoading: false,
      });
    }, 1500);
  };

  return (
    <Modal
      visible={state.showNotificationModal}
      transparent
      animationType="fade"
      onRequestClose={() => updateState({ showNotificationModal: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Send Push Notification</Text>
            <TouchableOpacity
              onPress={() => updateState({ showNotificationModal: false })}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Send a notification to your customers
            </Text>

            <Text style={styles.inputLabel}>Notification Title:</Text>
            <TextInput
              style={styles.notificationInput}
              placeholder="e.g., Special Offer"
              value={state.notificationTitle}
              onChangeText={(text) => updateState({ notificationTitle: text })}
            />

            <Text style={styles.inputLabel}>Message:</Text>
            <TextInput
              style={styles.notificationTextarea}
              placeholder="Enter your message here..."
              value={state.notificationMessage}
              onChangeText={(text) =>
                updateState({ notificationMessage: text })
              }
              multiline
              numberOfLines={4}
            />

            <View style={styles.targetAudience}>
              <Text style={styles.inputLabel}>Target Audience:</Text>
              <View style={styles.audienceOptions}>
                <TouchableOpacity
                  style={[styles.audienceOption, styles.audienceOptionSelected]}
                >
                  <Text style={styles.audienceOptionText}>All Customers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audienceOption}>
                  <Text style={styles.audienceOptionText}>Past Customers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audienceOption}>
                  <Text style={styles.audienceOptionText}>Loyal Customers</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.sendNotificationButton}
              onPress={sendNotification}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendNotificationText}>
                  Send Notification
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Capacity Management Modal
export const CapacityModal = ({ state, updateState }: ModalProps) => {
  const updateCapacitySettings = () => {
    // In a real app, this would make an API call to update capacity
    alert("Your capacity settings have been updated.");
    updateState({ showCapacityModal: false });
  };

  return (
    <Modal
      visible={state.showCapacityModal}
      transparent
      animationType="fade"
      onRequestClose={() => updateState({ showCapacityModal: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Capacity Management</Text>
            <TouchableOpacity
              onPress={() => updateState({ showCapacityModal: false })}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Manage your available capacity</Text>

            <View style={styles.daySelector}>
              <TouchableOpacity
                style={[styles.dayOption, styles.dayOptionSelected]}
              >
                <Text style={styles.dayOptionText}>Monday</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dayOption}>
                <Text style={styles.dayOptionText}>Tuesday</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dayOption}>
                <Text style={styles.dayOptionText}>Wednesday</Text>
              </TouchableOpacity>
              {/* Other days would be horizontal scrollable */}
            </View>

            <View style={styles.timeSlotManager}>
              <Text style={styles.timeSlotHeader}>Available Time Slots:</Text>

              {mockWorkingHours[0].slots.map((slot) => (
                <View key={slot.id} style={styles.capacitySlotRow}>
                  <Text style={styles.capacitySlotTime}>{slot.time}</Text>
                  <View style={styles.capacityControls}>
                    <Text style={styles.capacityValue}>
                      {slot.booked}/{slot.capacity}
                    </Text>
                    <View style={styles.capacityButtons}>
                      <TouchableOpacity style={styles.capacityButton}>
                        <Ionicons name="remove" size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.capacityButton}>
                        <Ionicons name="add" size={16} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                    <Switch
                      value={slot.isAvailable}
                      trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                      thumbColor={slot.isAvailable ? "#3b82f6" : "#f4f4f5"}
                    />
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.updateCapacityButton}
              onPress={updateCapacitySettings}
            >
              <Text style={styles.updateCapacityText}>Update Capacity</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Language Selection Modal
export const LanguageModal = ({ state, updateState }: ModalProps) => {
  const handleLanguageChange = (language: AppState["language"]) => {
    updateState({
      language,
      showLanguageModal: false,
    });
  };

  return (
    <Modal
      visible={state.showLanguageModal}
      transparent
      animationType="fade"
      onRequestClose={() => updateState({ showLanguageModal: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity
              onPress={() => updateState({ showLanguageModal: false })}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                state.language === "English" && styles.selectedLanguageOption,
              ]}
              onPress={() => handleLanguageChange("English")}
            >
              <Text style={styles.languageOptionText}>English</Text>
              {state.language === "English" && (
                <Ionicons name="checkmark" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                state.language === "French" && styles.selectedLanguageOption,
              ]}
              onPress={() => handleLanguageChange("French")}
            >
              <Text style={styles.languageOptionText}>Français</Text>
              {state.language === "French" && (
                <Ionicons name="checkmark" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                state.language === "Arabic" && styles.selectedLanguageOption,
              ]}
              onPress={() => handleLanguageChange("Arabic")}
            >
              <Text style={styles.languageOptionText}>العربية</Text>
              {state.language === "Arabic" && (
                <Ionicons name="checkmark" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    maxHeight: "85%",
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  modalContent: {
    flex: 1,
  },
  modalText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statusOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  confirmedOption: {
    borderColor: "#3b82f6",
  },
  checkedInOption: {
    borderColor: "#10b981",
  },
  completedOption: {
    borderColor: "#6b7280",
  },
  noShowOption: {
    borderColor: "#ef4444",
  },
  cancelledOption: {
    borderColor: "#f59e0b",
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginTop: 4,
  },
  bookingDetailItem: {
    marginBottom: 12,
  },
  bookingDetailLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 2,
  },
  bookingDetailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  disputeInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    minHeight: 100,
  },
  disputeUpload: {
    marginBottom: 16,
  },
  proofPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  proofText: {
    fontSize: 14,
    color: "#111827",
  },
  removeProofButton: {
    padding: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderStyle: "dashed",
    backgroundColor: "#f9fafb",
  },
  uploadButtonText: {
    fontSize: 14,
    color: "#3b82f6",
    marginLeft: 8,
  },
  submitDisputeButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitDisputeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  notificationInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    color: "#111827",
  },
  notificationTextarea: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    minHeight: 100,
  },
  targetAudience: {
    marginBottom: 16,
  },
  audienceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  audienceOption: {
    flex: 1,
    margin: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
  },
  audienceOptionSelected: {
    backgroundColor: "#ebf5ff",
    borderColor: "#3b82f6",
  },
  audienceOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  sendNotificationButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  sendNotificationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  daySelector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dayOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
  },
  dayOptionSelected: {
    backgroundColor: "#ebf5ff",
    borderColor: "#3b82f6",
  },
  dayOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  timeSlotManager: {
    marginBottom: 16,
  },
  timeSlotHeader: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  capacitySlotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  capacitySlotTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  capacityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  capacityValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginHorizontal: 8,
  },
  capacityButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  capacityButton: {
    padding: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    marginHorizontal: 2,
  },
  updateCapacityButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateCapacityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  selectedLanguageOption: {
    backgroundColor: "#f9fafb",
  },
  languageOptionText: {
    fontSize: 16,
    color: "#111827",
  },
});

export default {
  StatusChangeModal,
  DisputeModal,
  NotificationModal,
  CapacityModal,
  LanguageModal,
};
