import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Notification } from "../types";
import { notificationTemplates } from "../mockData";

interface NotificationScheduleProps {
  schedule: {
    isScheduled: boolean;
    date: Date | null;
    recurring: "none" | "daily" | "weekly" | "monthly";
    sendNow: boolean;
  };
  onScheduleChange: (schedule: {
    isScheduled: boolean;
    date: Date | null;
    recurring: "none" | "daily" | "weekly" | "monthly";
    sendNow: boolean;
  }) => void;
}

const NotificationScheduler = ({
  schedule,
  onScheduleChange,
}: NotificationScheduleProps) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleRecurringChange = (
    value: "none" | "daily" | "weekly" | "monthly"
  ) => {
    onScheduleChange({ ...schedule, recurring: value });
  };

  // In a real app, we would use a date picker component
  const handleDateSelect = () => {
    if (!schedule.date) {
      onScheduleChange({
        ...schedule,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      });
    } else {
      // Toggle back to null for demo purposes
      onScheduleChange({ ...schedule, date: null });
    }
  };

  return (
    <View style={styles.schedulerContainer}>
      <View style={styles.schedulerHeader}>
        <Text style={styles.schedulerTitle}>Notification Schedule</Text>
        <Switch
          value={schedule.isScheduled}
          onValueChange={(value) =>
            onScheduleChange({ ...schedule, isScheduled: value })
          }
          trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
          thumbColor={schedule.isScheduled ? "#3b82f6" : "#f4f4f5"}
        />
      </View>

      {schedule.isScheduled && (
        <View style={styles.scheduleOptions}>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={handleDateSelect}
          >
            <Ionicons name="calendar-outline" size={20} color="#6b7280" />
            <Text style={styles.dateText}>{formatDate(schedule.date)}</Text>
          </TouchableOpacity>

          <Text style={styles.recurringLabel}>Recurring</Text>
          <View style={styles.recurringOptions}>
            <TouchableOpacity
              style={[
                styles.recurringOption,
                schedule.recurring === "none" && styles.recurringOptionSelected,
              ]}
              onPress={() => handleRecurringChange("none")}
            >
              <Text
                style={[
                  styles.recurringOptionText,
                  schedule.recurring === "none" &&
                    styles.recurringOptionTextSelected,
                ]}
              >
                None
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.recurringOption,
                schedule.recurring === "daily" &&
                  styles.recurringOptionSelected,
              ]}
              onPress={() => handleRecurringChange("daily")}
            >
              <Text
                style={[
                  styles.recurringOptionText,
                  schedule.recurring === "daily" &&
                    styles.recurringOptionTextSelected,
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.recurringOption,
                schedule.recurring === "weekly" &&
                  styles.recurringOptionSelected,
              ]}
              onPress={() => handleRecurringChange("weekly")}
            >
              <Text
                style={[
                  styles.recurringOptionText,
                  schedule.recurring === "weekly" &&
                    styles.recurringOptionTextSelected,
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.recurringOption,
                schedule.recurring === "monthly" &&
                  styles.recurringOptionSelected,
              ]}
              onPress={() => handleRecurringChange("monthly")}
            >
              <Text
                style={[
                  styles.recurringOptionText,
                  schedule.recurring === "monthly" &&
                    styles.recurringOptionTextSelected,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sendNowContainer}>
            <Text style={styles.sendNowText}>Also send immediately</Text>
            <Switch
              value={schedule.sendNow}
              onValueChange={(value) =>
                onScheduleChange({ ...schedule, sendNow: value })
              }
              trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
              thumbColor={schedule.sendNow ? "#3b82f6" : "#f4f4f5"}
            />
          </View>
        </View>
      )}
    </View>
  );
};

interface TemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Notification) => void;
}

const NotificationTemplateModal = ({
  visible,
  onClose,
  onSelectTemplate,
}: TemplateModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Template</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={notificationTemplates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.templateItem}
                onPress={() => {
                  onSelectTemplate(item);
                  onClose();
                }}
              >
                <View style={styles.templateHeader}>
                  <Text style={styles.templateTitle}>{item.title}</Text>
                  {item.sent && (
                    <View style={styles.sentBadge}>
                      <Text style={styles.sentText}>Sent</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.templateMessage}>{item.message}</Text>
                <Text style={styles.templateDate}>{item.date}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>No templates found</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export interface NotificationTokens {
  businessName: string;
  customerName: string;
  bookingDate: string;
  bookingTime: string;
  serviceName: string;
}

interface AudienceOption {
  id: string;
  name: string;
  count: number;
}

export const NotificationManager = () => {
  // Templates state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
  }>({
    title: "",
    message: "",
  });

  // Schedule state
  const [schedule, setSchedule] = useState<{
    isScheduled: boolean;
    date: Date | null;
    recurring: "none" | "daily" | "weekly" | "monthly";
    sendNow: boolean;
  }>({
    isScheduled: false,
    date: null,
    recurring: "none",
    sendNow: true,
  });

  // Personalization tokens
  const [usePersonalization, setUsePersonalization] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Audience options
  const audienceOptions: AudienceOption[] = [
    { id: "all", name: "All Customers", count: 120 },
    { id: "active", name: "Active Customers", count: 85 },
    { id: "inactive", name: "Inactive Customers", count: 35 },
    { id: "new", name: "New Customers (Last 30 days)", count: 22 },
  ];

  const [selectedAudience, setSelectedAudience] = useState(
    audienceOptions[0].id
  );

  const handleTemplateSelect = (template: Notification) => {
    setNotification({
      title: template.title,
      message: template.message,
    });
  };

  const handleSendNotification = () => {
    if (!notification.title || !notification.message) {
      alert("Please enter a title and message");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      let successMessage = "Notification sent successfully!";

      if (schedule.isScheduled && !schedule.sendNow) {
        successMessage = `Notification scheduled for ${schedule.date?.toLocaleDateString()}`;
        if (schedule.recurring !== "none") {
          successMessage += ` (recurring ${schedule.recurring})`;
        }
      }

      alert(successMessage);
      setIsLoading(false);

      // Reset form in a real app
      // setNotification({ title: "", message: "" });
      // setSchedule({ isScheduled: false, date: null, recurring: "none", sendNow: true });
    }, 1500);
  };

  const getPreviewWithTokens = (text: string): string => {
    if (!usePersonalization) return text;

    // Replace tokens with sample values
    return text
      .replace(/\{\{businessName\}\}/g, "Le Petit Café")
      .replace(/\{\{customerName\}\}/g, "Ahmed")
      .replace(/\{\{bookingDate\}\}/g, "June 15, 2025")
      .replace(/\{\{bookingTime\}\}/g, "10:30 AM")
      .replace(/\{\{serviceName\}\}/g, "Breakfast Platter");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Manager</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.formSection}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Compose Notification</Text>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={() => setShowTemplateModal(true)}
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#3b82f6"
              />
              <Text style={styles.templateButtonText}>Templates</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="e.g., Special Offer"
              value={notification.title}
              onChangeText={(text) =>
                setNotification({ ...notification, title: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Enter your message here..."
              value={notification.message}
              onChangeText={(text) =>
                setNotification({ ...notification, message: text })
              }
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.personalizationContainer}>
            <View style={styles.personalizationHeader}>
              <Text style={styles.personalizationTitle}>Personalization</Text>
              <Switch
                value={usePersonalization}
                onValueChange={setUsePersonalization}
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={usePersonalization ? "#3b82f6" : "#f4f4f5"}
              />
            </View>

            {usePersonalization && (
              <View style={styles.tokensContainer}>
                <Text style={styles.tokensTitle}>Available Tokens:</Text>
                <View style={styles.tokenList}>
                  <TouchableOpacity
                    style={styles.token}
                    onPress={() =>
                      setNotification({
                        ...notification,
                        message: notification.message + " {{businessName}}",
                      })
                    }
                  >
                    <Text style={styles.tokenText}>{{ businessName }}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.token}
                    onPress={() =>
                      setNotification({
                        ...notification,
                        message: notification.message + " {{customerName}}",
                      })
                    }
                  >
                    <Text style={styles.tokenText}>{{ customerName }}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.token}
                    onPress={() =>
                      setNotification({
                        ...notification,
                        message: notification.message + " {{bookingDate}}",
                      })
                    }
                  >
                    <Text style={styles.tokenText}>{{ bookingDate }}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.token}
                    onPress={() =>
                      setNotification({
                        ...notification,
                        message: notification.message + " {{bookingTime}}",
                      })
                    }
                  >
                    <Text style={styles.tokenText}>{{ bookingTime }}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.token}
                    onPress={() =>
                      setNotification({
                        ...notification,
                        message: notification.message + " {{serviceName}}",
                      })
                    }
                  >
                    <Text style={styles.tokenText}>{{ serviceName }}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <NotificationScheduler
            schedule={schedule}
            onScheduleChange={setSchedule}
          />

          <View style={styles.audienceContainer}>
            <Text style={styles.audienceTitle}>Target Audience</Text>
            <View style={styles.audienceOptions}>
              {audienceOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.audienceOption,
                    selectedAudience === option.id &&
                      styles.audienceOptionSelected,
                  ]}
                  onPress={() => setSelectedAudience(option.id)}
                >
                  <Text
                    style={[
                      styles.audienceOptionText,
                      selectedAudience === option.id &&
                        styles.audienceOptionTextSelected,
                    ]}
                  >
                    {option.name}
                  </Text>
                  <Text
                    style={[
                      styles.audienceCount,
                      selectedAudience === option.id &&
                        styles.audienceCountSelected,
                    ]}
                  >
                    {option.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={styles.notificationPreview}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewAppName}>Reservi</Text>
              <Text style={styles.previewTime}>Just now</Text>
            </View>
            <Text style={styles.previewNotificationTitle}>
              {getPreviewWithTokens(notification.title) || "Notification Title"}
            </Text>
            <Text style={styles.previewNotificationMessage}>
              {getPreviewWithTokens(notification.message) ||
                "Your notification message will appear here..."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendNotification}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="paper-plane" size={18} color="#fff" />
              <Text style={styles.sendButtonText}>
                {schedule.isScheduled && !schedule.sendNow
                  ? "Schedule Notification"
                  : "Send Notification"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <NotificationTemplateModal
        visible={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  contentContainer: {
    padding: 16,
  },
  formSection: {
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  templateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#ebf5ff",
    borderRadius: 6,
  },
  templateButtonText: {
    fontSize: 14,
    color: "#3b82f6",
    marginLeft: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    minHeight: 100,
  },
  personalizationContainer: {
    marginBottom: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
  },
  personalizationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  personalizationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  tokensContainer: {
    marginTop: 12,
  },
  tokensTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  tokenList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  token: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 12,
    color: "#374151",
  },
  schedulerContainer: {
    marginBottom: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
  },
  schedulerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  schedulerTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  scheduleOptions: {
    marginTop: 12,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  recurringLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  recurringOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 12,
  },
  recurringOption: {
    flex: 1,
    minWidth: "22%",
    margin: 4,
    padding: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    alignItems: "center",
  },
  recurringOptionSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#ebf5ff",
  },
  recurringOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  recurringOptionTextSelected: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  sendNowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  sendNowText: {
    fontSize: 14,
    color: "#374151",
  },
  audienceContainer: {
    marginBottom: 16,
  },
  audienceTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  audienceOptions: {
    marginHorizontal: -4,
  },
  audienceOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  audienceOptionSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#ebf5ff",
  },
  audienceOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  audienceOptionTextSelected: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  audienceCount: {
    fontSize: 14,
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  audienceCountSelected: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
  },
  previewContainer: {
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
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  notificationPreview: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  previewAppName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
  },
  previewTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  previewNotificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  previewNotificationMessage: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    maxHeight: "80%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  templateItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  sentBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sentText: {
    fontSize: 12,
    color: "#10b981",
  },
  templateMessage: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
  },
  templateDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyList: {
    padding: 16,
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default NotificationManager;
