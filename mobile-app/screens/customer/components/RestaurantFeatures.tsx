import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RestaurantFeaturesProps {
  businessId: string;
  onFeaturePress: (feature: string) => void;
}

const RestaurantFeatures: React.FC<RestaurantFeaturesProps> = ({
  businessId,
  onFeaturePress,
}) => {
  const features = [
    {
      id: "live_wait_times",
      title: "Live Wait Times",
      subtitle: "See current wait times before you arrive",
      icon: "time-outline",
      color: "#3b82f6",
      customerBenefit:
        "Skip the uncertainty - know exactly how long you'll wait",
      businessBenefit: "Reduce crowding and improve customer experience",
    },
    {
      id: "table_preferences",
      title: "Table Preferences",
      subtitle: "Request specific seating (outdoor, window, quiet)",
      icon: "restaurant-outline",
      color: "#10b981",
      customerBenefit: "Get your preferred dining experience every time",
      businessBenefit: "Increase customer satisfaction and repeat visits",
    },
    {
      id: "pre_order_menu",
      title: "Pre-Order Menu",
      subtitle: "Order ahead and have food ready when you arrive",
      icon: "fast-food-outline",
      color: "#f59e0b",
      customerBenefit: "Skip the menu browsing - food ready on arrival",
      businessBenefit: "Improve kitchen efficiency and reduce wait times",
    },
    {
      id: "group_reservations",
      title: "Group Reservations",
      subtitle: "Easy booking for parties of 6+ with special arrangements",
      icon: "people-outline",
      color: "#8b5cf6",
      customerBenefit: "Seamless large group coordination",
      businessBenefit: "Better planning for large parties and higher revenue",
    },
    {
      id: "dietary_preferences",
      title: "Dietary Preferences",
      subtitle: "Filter menu by dietary restrictions automatically",
      icon: "nutrition-outline",
      color: "#ef4444",
      customerBenefit: "Always see options that match your dietary needs",
      businessBenefit: "Attract customers with specific dietary requirements",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Features</Text>
      <Text style={styles.subtitle}>Making dining out effortless</Text>

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

export default RestaurantFeatures;
