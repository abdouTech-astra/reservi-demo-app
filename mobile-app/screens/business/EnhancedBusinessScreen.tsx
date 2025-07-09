import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { AppState } from "./types";
import { EnhancedAnalyticsDashboard } from "./components/EnhancedAnalytics";
import { NotificationManager } from "./components/NotificationSystem";
import OnboardingFlow, {
  OnboardingController,
  ContextualHelp,
  QuickHelp,
} from "./components/OnboardingFlow";

type Props = NativeStackScreenProps<RootStackParamList, "EnhancedBusiness">;

const EnhancedBusinessScreen = ({ navigation }: Props) => {
  // Screen state
  const [activeTab, setActiveTab] = useState<
    "analytics" | "notifications" | "help"
  >("analytics");
  console.log("i am in enhanced business screen");
  // App state
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

  // Helper function to update state
  const updateState = (newState: Partial<AppState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // Header component
  const Header = () => (
    <View style={styles.header} id="dashboard-header">
      <View>
        <Text style={styles.businessName}>Le Petit Café</Text>
        <Text style={styles.subtitle}>Enhanced Dashboard</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => updateState({ showLanguageModal: true })}
        >
          <Text style={styles.languageButtonText}>
            {state.language === "English"
              ? "EN"
              : state.language === "French"
              ? "FR"
              : "AR"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("BusinessSettings")}
        >
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Tab navigation component
  const TabNavigation = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "analytics" && styles.activeTab]}
        onPress={() => setActiveTab("analytics")}
      >
        <Ionicons
          name="analytics"
          size={20}
          color={activeTab === "analytics" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "analytics" && styles.activeTabText,
          ]}
        >
          Analytics
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "notifications" && styles.activeTab]}
        onPress={() => setActiveTab("notifications")}
        id="notification-center"
      >
        <Ionicons
          name="notifications"
          size={20}
          color={activeTab === "notifications" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "notifications" && styles.activeTabText,
          ]}
        >
          Notifications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "help" && styles.activeTab]}
        onPress={() => setActiveTab("help")}
      >
        <Ionicons
          name="help-circle"
          size={20}
          color={activeTab === "help" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[styles.tabText, activeTab === "help" && styles.activeTabText]}
        >
          Help
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Navigation bar component
  const NavBar = () => (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("BusinessDashboard")}
      >
        <Ionicons name="home-outline" size={24} color="#6b7280" />
        <Text style={styles.navText}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("BusinessCalendar")}
        id="calendar-button"
      >
        <Ionicons name="calendar-outline" size={24} color="#6b7280" />
        <Text style={styles.navText}>Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("BusinessServices")}
        id="services-section"
      >
        <Ionicons name="list-outline" size={24} color="#6b7280" />
        <Text style={styles.navText}>Services</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
        <Ionicons name="bar-chart" size={24} color="#3b82f6" />
        <Text style={[styles.navText, styles.activeNavText]}>Enhanced</Text>
      </TouchableOpacity>
    </View>
  );

  // Help screen content
  const HelpContent = () => (
    <ScrollView style={styles.helpContent}>
      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>Getting Started</Text>
        <Text style={styles.helpText}>
          Welcome to Reservi! This guide will help you make the most of your
          business dashboard.
        </Text>

        <View style={styles.helpCard}>
          <View style={styles.helpCardHeader}>
            <Ionicons name="analytics" size={24} color="#3b82f6" />
            <Text style={styles.helpCardTitle}>Using Analytics</Text>
          </View>
          <Text style={styles.helpCardText}>
            The Analytics dashboard provides detailed insights about your
            business performance. You can view metrics for different time
            periods, see revenue forecasts, and get actionable insights.
          </Text>
          <TouchableOpacity
            style={styles.helpCardButton}
            onPress={() => setActiveTab("analytics")}
          >
            <Text style={styles.helpCardButtonText}>Go to Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpCardHeader}>
            <Ionicons name="notifications" size={24} color="#3b82f6" />
            <Text style={styles.helpCardTitle}>Managing Notifications</Text>
          </View>
          <Text style={styles.helpCardText}>
            The Notification Manager allows you to create and schedule
            personalized notifications for your customers. You can use
            templates, add custom tokens, and target specific customer segments.
          </Text>
          <TouchableOpacity
            style={styles.helpCardButton}
            onPress={() => setActiveTab("notifications")}
          >
            <Text style={styles.helpCardButtonText}>Go to Notifications</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpCardHeader}>
            <Ionicons name="calendar" size={24} color="#3b82f6" />
            <Text style={styles.helpCardTitle}>Calendar Management</Text>
          </View>
          <Text style={styles.helpCardText}>
            The Calendar screen allows you to view and manage all your bookings.
            You can see bookings by day, week, or month, and manage your
            availability.
          </Text>
          <TouchableOpacity
            style={styles.helpCardButton}
            onPress={() => navigation.navigate("BusinessCalendar")}
          >
            <Text style={styles.helpCardButtonText}>Go to Calendar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpCardHeader}>
            <Ionicons name="list" size={24} color="#3b82f6" />
            <Text style={styles.helpCardTitle}>Managing Services</Text>
          </View>
          <Text style={styles.helpCardText}>
            The Services screen allows you to create and manage the services you
            offer. You can set prices, durations, and descriptions for each
            service.
          </Text>
          <TouchableOpacity
            style={styles.helpCardButton}
            onPress={() => navigation.navigate("BusinessServices")}
          >
            <Text style={styles.helpCardButtonText}>Go to Services</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.restartTourButton}
          // In a real app, this would trigger the onboarding flow again
          onPress={() =>
            alert("This would restart the onboarding tour in a real app.")
          }
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.restartTourText}>Restart App Tour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Header />

      <TabNavigation />

      <View style={styles.contentContainer}>
        {activeTab === "analytics" && <EnhancedAnalyticsDashboard />}
        {activeTab === "notifications" && <NotificationManager />}
        {activeTab === "help" && <HelpContent />}
      </View>

      <NavBar />

      {/* Onboarding controller - in a real app this would persist across screens */}
      <OnboardingController />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
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
    marginRight: 16,
  },
  languageButtonText: {
    fontSize: 14,
    color: "#6b7280",
  },
  settingsButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
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
  // Help styles
  helpContent: {
    flex: 1,
    padding: 16,
  },
  helpSection: {
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 16,
    lineHeight: 24,
  },
  helpCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  helpCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  helpCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  helpCardText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 16,
    lineHeight: 20,
  },
  helpCardButton: {
    backgroundColor: "#ebf5ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  helpCardButtonText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  restartTourButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  restartTourText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
});

export default EnhancedBusinessScreen;
