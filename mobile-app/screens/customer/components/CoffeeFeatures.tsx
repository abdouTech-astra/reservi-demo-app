import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CoffeeFeaturesProps {
  businessId: string;
  onFeaturePress: (feature: string) => void;
}

const CoffeeFeatures: React.FC<CoffeeFeaturesProps> = ({
  businessId,
  onFeaturePress,
}) => {
  const features = [
    {
      id: "skip_the_line",
      title: "Skip the Line",
      subtitle: "Order ahead and pick up without waiting",
      icon: "walk-outline",
      color: "#10b981",
      customerBenefit: "Save 5-15 minutes every coffee run",
      businessBenefit: "Reduce queue congestion and serve more customers",
    },
    {
      id: "coffee_loyalty",
      title: "Smart Loyalty Program",
      subtitle: "Automatic points, free drinks, and surprise rewards",
      icon: "gift-outline",
      color: "#f59e0b",
      customerBenefit: "Earn rewards without carrying cards or remembering",
      businessBenefit: "Increase customer retention by 40%+",
    },
    {
      id: "custom_orders",
      title: "Custom Order Memory",
      subtitle: "Save your favorite orders with all modifications",
      icon: "heart-outline",
      color: "#ef4444",
      customerBenefit: "One-tap ordering of your perfect drink",
      businessBenefit: "Faster service and fewer order mistakes",
    },
    {
      id: "barista_recommendations",
      title: "Barista Recommendations",
      subtitle: "Get suggestions based on weather, time, and preferences",
      icon: "bulb-outline",
      color: "#8b5cf6",
      customerBenefit: "Discover new drinks you'll love",
      businessBenefit: "Upsell premium drinks and increase average order",
    },
    {
      id: "group_orders",
      title: "Office Group Orders",
      subtitle: "Collect orders from colleagues and pay together",
      icon: "people-outline",
      color: "#3b82f6",
      customerBenefit: "Be the office hero with organized coffee runs",
      businessBenefit: "Larger orders and consistent business customers",
    },
    {
      id: "morning_subscription",
      title: "Morning Coffee Subscription",
      subtitle: "Automatic daily coffee ready at your preferred time",
      icon: "calendar-outline",
      color: "#06b6d4",
      customerBenefit: "Never miss your morning coffee again",
      businessBenefit: "Predictable revenue and customer commitment",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coffee Shop Features</Text>
      <Text style={styles.subtitle}>Your perfect coffee experience</Text>

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

export default CoffeeFeatures;
