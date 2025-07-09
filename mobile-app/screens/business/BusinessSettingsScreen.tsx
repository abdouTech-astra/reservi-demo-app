import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { AppState } from "./types";
import { subscriptionPlans } from "./mockData";
import BusinessModals from "./components/BusinessModals";
import {
  BusinessHeader,
  BusinessNavBar,
  SectionHeader,
} from "./components/BusinessUIComponents";
import WelcomeScreen from "../WelcomeScreen";
type Props = NativeStackScreenProps<RootStackParamList, "BusinessSettings">;

const BusinessSettingsScreen = ({ navigation }: Props) => {
  // Set up state
  const [state, setState] = useState<AppState>({
    language: "English",
    currency: "TND",
    autoCancel: true,
    autoCancelTime: 15,
    bookingStatusFilter: "all",
    dateFilter: "today",
    showStatusModal: false,
    showDisputeModal: false,
    showNotificationModal: false,
    showCapacityModal: false,
    showLanguageModal: false,
    selectedBooking: null,
    disputeNote: "",
    disputeProof: "",
    notificationTitle: "",
    notificationMessage: "",
    isLoading: false,
  });

  // Business profile state
  const [businessProfile, setBusinessProfile] = useState({
    name: "Le Petit Café",
    address: "123 Habib Bourguiba Avenue, Tunis",
    phone: "+216 71 123 456",
    email: "contact@lepetitcafe.tn",
    description:
      "A cozy café with a variety of beverages and Tunisian pastries.",
    openingHours: "8:00 AM - 8:00 PM",
    closedDays: "None",
    image: "https://example.com/cafe.jpg",
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    defaultCancelPolicy: "24 hours notice required for cancellation.",
    website: "www.lepetitcafe.tn",
    socialMedia: {
      facebook: "lepetitcafe.tunisia",
      instagram: "lepetitcafe_tunisia",
      twitter: "",
    },
    // New booking policy settings
    allowFreeWeekendBookings: false,
    acceptWalkInsOnly: false,
    refundBookingFeesOnCancellation: true,
    weekendFeeAmount: 30,
    specialDayFeeAmount: 30,
    cancellationPolicyHours: 2,
    feeType: "reservation" as "reservation" | "deductible",
  });

  // Helper function to update state
  const updateState = (newState: Partial<AppState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // Update business profile
  const updateBusinessProfile = (update: Partial<typeof businessProfile>) => {
    setBusinessProfile((prev) => ({ ...prev, ...update }));
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.navigate("Welcome"),
      },
    ]);
  };

  // Handle subscription upgrade
  const handleUpgradeSubscription = () => {
    Alert.alert(
      "Subscription Upgrade",
      "Would you like to upgrade to the Premium plan for 20 TND/month?",
      [
        { text: "Not Now", style: "cancel" },
        {
          text: "Upgrade",
          onPress: () =>
            Alert.alert(
              "Success",
              "Your subscription has been upgraded to Premium!"
            ),
        },
      ]
    );
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deleted",
              "Your account has been deleted successfully."
            );
            navigation.navigate("Welcome");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <BusinessHeader
        title="Le Petit Café"
        subtitle="Settings"
        language={state.language}
        onLanguagePress={() => updateState({ showLanguageModal: true })}
        onSettingsPress={() => {}}
      />

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <View style={styles.section}>
          <SectionHeader title="Account" />

          <View style={styles.profileSection}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>LC</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.businessName}>{businessProfile.name}</Text>
              <Text style={styles.businessMeta}>{businessProfile.email}</Text>
              <Text style={styles.businessMeta}>{businessProfile.phone}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert(
                "Feature Coming Soon",
                "Edit profile feature will be available in the next update."
              )
            }
          >
            <Ionicons name="person-outline" size={20} color="#111827" />
            <Text style={styles.settingItemText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert(
                "Feature Coming Soon",
                "Change password feature will be available in the next update."
              )
            }
          >
            <Ionicons name="key-outline" size={20} color="#111827" />
            <Text style={styles.settingItemText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <SectionHeader title="Subscription" />

          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionInfo}>
              <View style={styles.subscriptionBadge}>
                <Text style={styles.subscriptionBadgeText}>
                  {subscriptionPlans.find((plan) => plan.currentPlan)?.name}
                </Text>
              </View>
              <Text style={styles.subscriptionPrice}>
                {subscriptionPlans.find((plan) => plan.currentPlan)?.price}
              </Text>
            </View>

            <View style={styles.subscriptionFeatures}>
              {subscriptionPlans
                .find((plan) => plan.currentPlan)
                ?.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10b981"
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
            </View>

            {subscriptionPlans.find((plan) => plan.currentPlan)?.name !==
              "Premium" && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgradeSubscription}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Business Settings Section */}
        <View style={styles.section}>
          <SectionHeader title="Business Settings" />

          <View style={styles.settingGroup}>
            <Text style={styles.settingGroupTitle}>Business Information</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Business Name</Text>
              <TextInput
                style={styles.textInput}
                value={businessProfile.name}
                onChangeText={(text) => updateBusinessProfile({ name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={styles.textInput}
                value={businessProfile.address}
                onChangeText={(text) =>
                  updateBusinessProfile({ address: text })
                }
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={businessProfile.phone}
                  onChangeText={(text) =>
                    updateBusinessProfile({ phone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={businessProfile.email}
                  onChangeText={(text) =>
                    updateBusinessProfile({ email: text })
                  }
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Business Description</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                value={businessProfile.description}
                onChangeText={(text) =>
                  updateBusinessProfile({ description: text })
                }
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.settingGroup}>
            <Text style={styles.settingGroupTitle}>Notifications</Text>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>
                  Enable Notifications
                </Text>
                <Text style={styles.switchSettingDescription}>
                  Receive notifications for new bookings and updates
                </Text>
              </View>
              <Switch
                value={businessProfile.notificationsEnabled}
                onValueChange={(value) =>
                  updateBusinessProfile({ notificationsEnabled: value })
                }
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={
                  businessProfile.notificationsEnabled ? "#3b82f6" : "#f4f4f5"
                }
              />
            </View>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>
                  Email Notifications
                </Text>
                <Text style={styles.switchSettingDescription}>
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={businessProfile.emailNotifications}
                onValueChange={(value) =>
                  updateBusinessProfile({ emailNotifications: value })
                }
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={
                  businessProfile.emailNotifications ? "#3b82f6" : "#f4f4f5"
                }
                disabled={!businessProfile.notificationsEnabled}
              />
            </View>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>
                  Push Notifications
                </Text>
                <Text style={styles.switchSettingDescription}>
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={businessProfile.pushNotifications}
                onValueChange={(value) =>
                  updateBusinessProfile({ pushNotifications: value })
                }
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={
                  businessProfile.pushNotifications ? "#3b82f6" : "#f4f4f5"
                }
                disabled={!businessProfile.notificationsEnabled}
              />
            </View>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>SMS Notifications</Text>
                <Text style={styles.switchSettingDescription}>
                  Receive notifications via SMS
                </Text>
              </View>
              <Switch
                value={businessProfile.smsNotifications}
                onValueChange={(value) =>
                  updateBusinessProfile({ smsNotifications: value })
                }
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={
                  businessProfile.smsNotifications ? "#3b82f6" : "#f4f4f5"
                }
                disabled={!businessProfile.notificationsEnabled}
              />
            </View>
          </View>

          <View style={styles.settingGroup}>
            <Text style={styles.settingGroupTitle}>Booking Settings</Text>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>
                  Auto Cancel No-Shows
                </Text>
                <Text style={styles.switchSettingDescription}>
                  Automatically mark bookings as no-show after{" "}
                  {state.autoCancelTime} minutes
                </Text>
              </View>
              <Switch
                value={state.autoCancel}
                onValueChange={(value) => updateState({ autoCancel: value })}
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={state.autoCancel ? "#3b82f6" : "#f4f4f5"}
              />
            </View>

            {state.autoCancel && (
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Auto-cancel after (minutes)
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={state.autoCancelTime.toString()}
                  onChangeText={(text) =>
                    updateState({ autoCancelTime: parseInt(text) || 15 })
                  }
                  keyboardType="number-pad"
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Default Cancellation Policy</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                value={businessProfile.defaultCancelPolicy}
                onChangeText={(text) =>
                  updateBusinessProfile({ defaultCancelPolicy: text })
                }
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.settingGroup}>
            <Text style={styles.settingGroupTitle}>
              Payment & Booking Policies
            </Text>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>
                  Allow Free Weekend Bookings
                </Text>
                <Text style={styles.switchSettingDescription}>
                  Allow customers to book on weekends without payment
                </Text>
              </View>
              <Switch
                value={businessProfile.allowFreeWeekendBookings}
                onValueChange={(value) =>
                  updateBusinessProfile({ allowFreeWeekendBookings: value })
                }
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={
                  businessProfile.allowFreeWeekendBookings
                    ? "#3b82f6"
                    : "#f4f4f5"
                }
              />
            </View>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>
                  Accept Walk-ins Only
                </Text>
                <Text style={styles.switchSettingDescription}>
                  Only accept walk-in customers, no advance bookings
                </Text>
              </View>
              <Switch
                value={businessProfile.acceptWalkInsOnly}
                onValueChange={(value) =>
                  updateBusinessProfile({ acceptWalkInsOnly: value })
                }
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={
                  businessProfile.acceptWalkInsOnly ? "#3b82f6" : "#f4f4f5"
                }
              />
            </View>

            <View style={styles.switchSetting}>
              <View>
                <Text style={styles.switchSettingTitle}>
                  Refund Booking Fees on Cancellation
                </Text>
                <Text style={styles.switchSettingDescription}>
                  Refund reservation fees when customers cancel in time
                </Text>
              </View>
              <Switch
                value={businessProfile.refundBookingFeesOnCancellation}
                onValueChange={(value) =>
                  updateBusinessProfile({
                    refundBookingFeesOnCancellation: value,
                  })
                }
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={
                  businessProfile.refundBookingFeesOnCancellation
                    ? "#3b82f6"
                    : "#f4f4f5"
                }
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Weekend Fee (TND)</Text>
                <TextInput
                  style={styles.textInput}
                  value={businessProfile.weekendFeeAmount.toString()}
                  onChangeText={(text) =>
                    updateBusinessProfile({
                      weekendFeeAmount: parseInt(text) || 30,
                    })
                  }
                  keyboardType="number-pad"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Special Day Fee (TND)</Text>
                <TextInput
                  style={styles.textInput}
                  value={businessProfile.specialDayFeeAmount.toString()}
                  onChangeText={(text) =>
                    updateBusinessProfile({
                      specialDayFeeAmount: parseInt(text) || 30,
                    })
                  }
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Cancellation Policy (Hours)</Text>
              <TextInput
                style={styles.textInput}
                value={businessProfile.cancellationPolicyHours.toString()}
                onChangeText={(text) =>
                  updateBusinessProfile({
                    cancellationPolicyHours: parseInt(text) || 2,
                  })
                }
                keyboardType="number-pad"
                placeholder="Hours before booking to cancel without penalty"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Fee Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    businessProfile.feeType === "reservation" &&
                      styles.radioOptionSelected,
                  ]}
                  onPress={() =>
                    updateBusinessProfile({ feeType: "reservation" })
                  }
                >
                  <View
                    style={[
                      styles.radioCircle,
                      businessProfile.feeType === "reservation" &&
                        styles.radioCircleSelected,
                    ]}
                  >
                    {businessProfile.feeType === "reservation" && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={styles.radioTitle}>Reservation Fee</Text>
                    <Text style={styles.radioDescription}>
                      Non-refundable fee to secure the booking
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    businessProfile.feeType === "deductible" &&
                      styles.radioOptionSelected,
                  ]}
                  onPress={() =>
                    updateBusinessProfile({ feeType: "deductible" })
                  }
                >
                  <View
                    style={[
                      styles.radioCircle,
                      businessProfile.feeType === "deductible" &&
                        styles.radioCircleSelected,
                    ]}
                  >
                    {businessProfile.feeType === "deductible" && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={styles.radioTitle}>Deductible</Text>
                    <Text style={styles.radioDescription}>
                      Amount deducted from final bill
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <SectionHeader title="App Settings" />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => updateState({ showLanguageModal: true })}
          >
            <Ionicons name="language-outline" size={20} color="#111827" />
            <Text style={styles.settingItemText}>Language</Text>
            <View style={styles.settingItemRight}>
              <Text style={styles.settingItemValue}>{state.language}</Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert(
                "Feature Coming Soon",
                "Currency selection will be available in the next update."
              )
            }
          >
            <Ionicons name="cash-outline" size={20} color="#111827" />
            <Text style={styles.settingItemText}>Currency</Text>
            <View style={styles.settingItemRight}>
              <Text style={styles.settingItemValue}>{state.currency}</Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert(
                "Feature Coming Soon",
                "Help & Support will be available in the next update."
              )
            }
          >
            <Ionicons name="help-circle-outline" size={20} color="#111827" />
            <Text style={styles.settingItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert(
                "Feature Coming Soon",
                "About will be available in the next update."
              )
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#111827"
            />
            <Text style={styles.settingItemText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BusinessNavBar
        active="settings"
        onNavigate={(screen) =>
          navigation.navigate(screen as keyof RootStackParamList)
        }
      />

      <BusinessModals.LanguageModal state={state} updateState={updateState} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
    paddingVertical: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  profileImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileImageText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  businessMeta: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingItemText: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemValue: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 4,
  },
  subscriptionCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  subscriptionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subscriptionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#ebf5ff",
    borderRadius: 20,
  },
  subscriptionBadgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b82f6",
  },
  subscriptionPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subscriptionFeatures: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  upgradeButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  settingGroup: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  textAreaInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  switchSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchSettingTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  switchSettingDescription: {
    fontSize: 12,
    color: "#6b7280",
    maxWidth: "80%",
  },
  footerActions: {
    padding: 16,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "500",
    marginLeft: 8,
  },
  deleteAccountButton: {
    paddingVertical: 8,
  },
  deleteAccountButtonText: {
    fontSize: 14,
    color: "#6b7280",
    textDecorationLine: "underline",
  },
  radioGroup: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  radioOptionSelected: {
    backgroundColor: "#ebf5ff",
    borderColor: "#3b82f6",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: "#3b82f6",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  radioContent: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  radioDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default BusinessSettingsScreen;
