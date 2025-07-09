import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BarberFeaturesProps {
  businessId: string;
  onFeaturePress: (feature: string) => void;
}

const BarberFeatures: React.FC<BarberFeaturesProps> = ({
  businessId,
  onFeaturePress,
}) => {
  const features = [
    {
      id: "stylist_portfolio",
      title: "Stylist Portfolio",
      subtitle: "View before/after photos and choose your preferred stylist",
      icon: "images-outline",
      color: "#8b5cf6",
      customerBenefit: "See the stylist's work before booking",
      businessBenefit: "Showcase talent and justify premium pricing",
    },
    {
      id: "style_consultation",
      title: "Virtual Style Consultation",
      subtitle: "Upload your photo and get style recommendations",
      icon: "camera-outline",
      color: "#06b6d4",
      customerBenefit: "Get expert advice before visiting",
      businessBenefit:
        "Increase customer satisfaction and reduce consultations",
    },
    {
      id: "haircut_history",
      title: "Haircut History & Notes",
      subtitle: "Track your haircut history with photos and stylist notes",
      icon: "document-text-outline",
      color: "#10b981",
      customerBenefit: "Never forget how you liked your hair cut",
      businessBenefit: "Provide consistent service across visits",
    },
    {
      id: "queue_management",
      title: "Smart Queue System",
      subtitle: "Get real-time updates and estimated wait times",
      icon: "time-outline",
      color: "#f59e0b",
      customerBenefit: "No waiting around - arrive at the perfect time",
      businessBenefit: "Optimize scheduling and reduce no-shows",
    },
    {
      id: "grooming_reminders",
      title: "Grooming Reminders",
      subtitle: "Smart notifications when it's time for your next cut",
      icon: "notifications-outline",
      color: "#ef4444",
      customerBenefit: "Always look your best with timely reminders",
      businessBenefit: "Increase rebooking rate and customer lifetime value",
    },
    {
      id: "special_occasions",
      title: "Special Occasion Booking",
      subtitle: "Priority booking for weddings, events, and important dates",
      icon: "calendar-outline",
      color: "#3b82f6",
      customerBenefit: "Look perfect for important moments",
      businessBenefit: "Higher-value services and advance bookings",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barber Shop Features</Text>
      <Text style={styles.subtitle}>Your personal grooming experience</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            onPress={() => onFeaturePress(feature.id)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${feature.color}20` },
              ]}
            >
              <Ionicons
                name={feature.icon as any}
                size={24}
                color={feature.color}
              />
            </View>

            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>

            <View style={styles.benefitContainer}>
              <View style={styles.benefitRow}>
                <Ionicons name="person" size={12} color="#6b7280" />
                <Text style={styles.benefitText}>
                  {feature.customerBenefit}
                </Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="business" size={12} color="#6b7280" />
                <Text style={styles.benefitText}>
                  {feature.businessBenefit}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  benefitContainer: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  benefitText: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
    lineHeight: 16,
  },
});

export default BarberFeatures;
