import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const DemoShowcaseScreen = ({ navigation }: any) => {
  const [selectedBusiness, setSelectedBusiness] = useState<
    "restaurant" | "cafe" | "barber"
  >("restaurant");

  const businessTypes = [
    {
      id: "restaurant" as const,
      name: "Restaurant",
      icon: "restaurant",
      color: "#ef4444",
      gradient: ["#fef2f2", "#fee2e2"],
      description: "Transform your dining experience",
    },
    {
      id: "cafe" as const,
      name: "Coffee Shop",
      icon: "cafe",
      color: "#8b5cf6",
      gradient: ["#f5f3ff", "#e5e7eb"],
      description: "Streamline your coffee service",
    },
    {
      id: "barber" as const,
      name: "Barber Shop",
      icon: "cut",
      color: "#10b981",
      gradient: ["#ecfdf5", "#d1fae5"],
      description: "Modernize your grooming business",
    },
  ];

  const features = {
    restaurant: [
      {
        title: "Live Wait Times",
        description: "Let customers see real-time wait times before arriving",
        icon: "time",
        benefit: "Reduce crowding by 40%",
        customerValue:
          "No more uncertainty - customers know exactly when to arrive",
      },
      {
        title: "Table Preferences",
        description: "Allow customers to request specific seating preferences",
        icon: "restaurant",
        benefit: "Increase satisfaction by 35%",
        customerValue:
          "Outdoor, window, quiet sections - perfect dining every time",
      },
      {
        title: "Pre-Order Menu",
        description: "Food ready when customers arrive",
        icon: "fast-food",
        benefit: "Boost efficiency by 50%",
        customerValue: "Skip menu browsing - perfect for lunch breaks",
      },
      {
        title: "Group Reservations",
        description: "Seamless booking for large parties",
        icon: "people",
        benefit: "Higher revenue per booking",
        customerValue: "Easy coordination for celebrations and events",
      },
    ],
    cafe: [
      {
        title: "Skip the Line",
        description: "Order ahead and pickup without waiting",
        icon: "walk",
        benefit: "Serve 60% more customers",
        customerValue: "Save 10-15 minutes every coffee run",
      },
      {
        title: "Smart Loyalty",
        description: "Automatic points and rewards",
        icon: "gift",
        benefit: "Increase retention by 45%",
        customerValue: "Earn rewards without carrying cards",
      },
      {
        title: "Custom Orders",
        description: "Remember favorite drinks with modifications",
        icon: "heart",
        benefit: "Reduce order mistakes",
        customerValue: "One-tap ordering of perfect drink",
      },
      {
        title: "Office Orders",
        description: "Group orders for workplace teams",
        icon: "business",
        benefit: "Larger average orders",
        customerValue: "Be the office coffee hero",
      },
    ],
    barber: [
      {
        title: "Stylist Portfolio",
        description: "Showcase before/after photos",
        icon: "images",
        benefit: "Justify premium pricing",
        customerValue: "See stylist work before booking",
      },
      {
        title: "Style Consultation",
        description: "Virtual recommendations with photos",
        icon: "camera",
        benefit: "Reduce consultation time",
        customerValue: "Get expert advice before visiting",
      },
      {
        title: "Cut History",
        description: "Track haircuts with photos and notes",
        icon: "document-text",
        benefit: "Consistent service quality",
        customerValue: "Never forget your perfect haircut",
      },
      {
        title: "Smart Reminders",
        description: "Automated rebooking notifications",
        icon: "notifications",
        benefit: "Increase repeat bookings",
        customerValue: "Always look your best",
      },
    ],
  };

  const incentives = [
    {
      title: "3 Months Free",
      description: "No commission fees for your first quarter",
      value: "Save up to 500 TND",
      icon: "trending-up",
      color: "#10b981",
    },
    {
      title: "Free Marketing",
      description: "200 TND advertising credit included",
      value: "100% Free Promotion",
      icon: "megaphone",
      color: "#f59e0b",
    },
    {
      title: "Personal Setup",
      description: "Dedicated onboarding and training",
      value: "Worth 300 TND",
      icon: "school",
      color: "#3b82f6",
    },
  ];

  const currentFeatures = features[selectedBusiness];
  const currentBusiness = businessTypes.find((b) => b.id === selectedBusiness)!;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Why Choose Reservili?</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Built for Tunisia's Top Businesses
          </Text>
          <Text style={styles.heroSubtitle}>
            Join restaurants, cafes, and barber shops already growing with
            Reservili
          </Text>
        </View>

        {/* Business Type Selector */}
        <View style={styles.businessSelector}>
          <Text style={styles.selectorTitle}>Choose your business type:</Text>
          <View style={styles.businessOptions}>
            {businessTypes.map((business) => (
              <TouchableOpacity
                key={business.id}
                style={[
                  styles.businessOption,
                  selectedBusiness === business.id &&
                    styles.selectedBusinessOption,
                  { borderColor: business.color },
                ]}
                onPress={() => setSelectedBusiness(business.id)}
              >
                <View
                  style={[
                    styles.businessIcon,
                    selectedBusiness === business.id && {
                      backgroundColor: business.color,
                    },
                  ]}
                >
                  <Ionicons
                    name={business.icon as any}
                    size={20}
                    color={
                      selectedBusiness === business.id ? "#fff" : business.color
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.businessName,
                    selectedBusiness === business.id && {
                      color: business.color,
                    },
                  ]}
                >
                  {business.name}
                </Text>
                <Text style={styles.businessDesc}>{business.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features for Selected Business */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>
            Features for {currentBusiness.name}s
          </Text>
          <Text style={styles.featuresSubtitle}>
            Everything you need to grow your business
          </Text>

          {currentFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: `${currentBusiness.color}20` },
                  ]}
                >
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color={currentBusiness.color}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>

              <View style={styles.featureBenefits}>
                <View style={styles.benefitRow}>
                  <Ionicons name="business" size={16} color="#10b981" />
                  <Text style={styles.benefitText}>
                    For you: {feature.benefit}
                  </Text>
                </View>
                <View style={styles.benefitRow}>
                  <Ionicons name="people" size={16} color="#3b82f6" />
                  <Text style={styles.benefitText}>
                    For customers: {feature.customerValue}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Launch Incentives */}
        <View style={styles.incentivesSection}>
          <Text style={styles.incentivesTitle}>Early Adopter Benefits</Text>
          <Text style={styles.incentivesSubtitle}>
            Exclusive offers for our founding business partners
          </Text>

          {incentives.map((incentive, index) => (
            <View key={index} style={styles.incentiveCard}>
              <View
                style={[
                  styles.incentiveIcon,
                  { backgroundColor: `${incentive.color}20` },
                ]}
              >
                <Ionicons
                  name={incentive.icon as any}
                  size={24}
                  color={incentive.color}
                />
              </View>
              <View style={styles.incentiveContent}>
                <Text style={styles.incentiveTitle}>{incentive.title}</Text>
                <Text style={styles.incentiveDescription}>
                  {incentive.description}
                </Text>
                <Text
                  style={[styles.incentiveValue, { color: incentive.color }]}
                >
                  {incentive.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Success Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.metricsTitle}>Early Results</Text>
          <Text style={styles.metricsSubtitle}>
            Data from our pilot businesses in Tunis
          </Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>40%</Text>
              <Text style={styles.metricLabel}>Increase in Bookings</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>60%</Text>
              <Text style={styles.metricLabel}>Less No-Shows</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>4.8★</Text>
              <Text style={styles.metricLabel}>Customer Rating</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>35%</Text>
              <Text style={styles.metricLabel}>Time Saved Daily</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Transform Your Business?</Text>
          <Text style={styles.ctaSubtitle}>
            Join the waitlist and be among the first to launch in Tunisia
          </Text>

          <TouchableOpacity
            style={[
              styles.ctaButton,
              { backgroundColor: currentBusiness.color },
            ]}
            onPress={() => navigation.navigate("DemoIncentives")}
          >
            <Text style={styles.ctaButtonText}>Join Early Access Program</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Schedule a Demo</Text>
          </TouchableOpacity>
        </View>
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
  heroSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  businessSelector: {
    padding: 16,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  businessOptions: {
    gap: 12,
  },
  businessOption: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  selectedBusinessOption: {
    borderWidth: 2,
  },
  businessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  businessDesc: {
    fontSize: 14,
    color: "#6b7280",
  },
  featuresSection: {
    padding: 16,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  featuresSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  featureBenefits: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  incentivesSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  incentivesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  incentivesSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  incentiveCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  incentiveIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  incentiveContent: {
    flex: 1,
  },
  incentiveTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  incentiveDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  incentiveValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  metricsSection: {
    padding: 16,
    marginTop: 8,
  },
  metricsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  metricsSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  ctaSection: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b7280",
  },
});

export default DemoShowcaseScreen;
