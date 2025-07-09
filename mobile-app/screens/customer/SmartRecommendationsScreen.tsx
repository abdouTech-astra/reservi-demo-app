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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SmartRecommendationsScreen = ({ navigation }: any) => {
  const [currentWeather, setCurrentWeather] = useState({
    temp: 24,
    condition: "sunny",
    description: "Sunny and warm",
  });

  const [userProfile] = useState({
    name: "Ahmed Ben Ali",
    preferences: ["Mediterranean", "Italian", "Coffee", "Quick Service"],
    favoriteTimeSlots: ["12:00-14:00", "19:00-21:00"],
    dietaryRestrictions: ["Halal"],
    lastVisits: ["Bistro Tunis", "Café Central", "La Villa"],
    spendingRange: "moderate", // budget, moderate, premium
    frequentLocations: ["Downtown Tunis", "Lac District"],
  });

  // Mock data for recommendations
  const smartRecommendations = {
    weatherBased: [
      {
        id: "weather_1",
        title: "Perfect Weather for Outdoor Dining",
        subtitle: "Beautiful day for terrace dining",
        business: {
          name: "Terrace Café Marina",
          type: "Restaurant",
          cuisine: "Mediterranean",
          rating: 4.7,
          priceRange: "$$",
          waitTime: "15 min",
          distance: "1.2 km",
          image:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
          specialFeature: "Outdoor Seating",
          currentDiscount: "20% off outdoor tables",
        },
        reason:
          "With today's sunny weather (24°C), their outdoor terrace is perfect!",
        confidence: 95,
        icon: "sunny",
        color: "#f59e0b",
      },
    ],
    timeBased: [
      {
        id: "time_1",
        title: "Lunch Rush Special",
        subtitle: "Quick service for busy schedules",
        business: {
          name: "Express Bistro",
          type: "Restaurant",
          cuisine: "International",
          rating: 4.5,
          priceRange: "$",
          waitTime: "5 min",
          distance: "0.8 km",
          image:
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
          specialFeature: "Express Menu",
          avgServiceTime: "15 minutes",
        },
        reason:
          "Perfect for your usual lunch time (12:30 PM) with express service",
        confidence: 88,
        icon: "time",
        color: "#10b981",
      },
    ],
    personalizedPicks: [
      {
        id: "personal_1",
        title: "Based on Your Mediterranean Love",
        subtitle: "New restaurant matching your taste",
        business: {
          name: "Sidi Bou Said Kitchen",
          type: "Restaurant",
          cuisine: "Tunisian Mediterranean",
          rating: 4.8,
          priceRange: "$$",
          waitTime: "20 min",
          distance: "2.1 km",
          image:
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=300",
          specialFeature: "Authentic Tunisian",
          newBadge: true,
        },
        reason:
          "Combines Mediterranean cuisine you love with authentic Tunisian flavors",
        confidence: 92,
        icon: "heart",
        color: "#ef4444",
      },
      {
        id: "personal_2",
        title: "Your Coffee Shop Alternative",
        subtitle: "Try something new near your favorites",
        business: {
          name: "Rooftop Coffee Lab",
          type: "Coffee Shop",
          cuisine: "Specialty Coffee",
          rating: 4.6,
          priceRange: "$",
          waitTime: "10 min",
          distance: "0.5 km",
          image:
            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300",
          specialFeature: "Artisan Coffee",
          similarTo: "Café Central",
        },
        reason:
          "Similar vibe to Café Central but with specialty coffee roasting",
        confidence: 85,
        icon: "cafe",
        color: "#8b5cf6",
      },
    ],
    trending: [
      {
        id: "trend_1",
        title: "Trending in Your Area",
        subtitle: "Hot spot gaining popularity",
        business: {
          name: "The Garden Lounge",
          type: "Restaurant & Bar",
          cuisine: "Fusion",
          rating: 4.9,
          priceRange: "$$$",
          waitTime: "25 min",
          distance: "1.8 km",
          image:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
          specialFeature: "Garden Setting",
          trendingBadge: true,
          bookingIncrease: "+150% this week",
        },
        reason:
          "Bookings up 150% this week - discover what everyone's talking about",
        confidence: 78,
        icon: "trending-up",
        color: "#06b6d4",
      },
    ],
    groupRecommendations: [
      {
        id: "group_1",
        title: "Perfect for Group Dining",
        subtitle: "Great for your upcoming gathering",
        business: {
          name: "Family Table Restaurant",
          type: "Restaurant",
          cuisine: "Traditional",
          rating: 4.6,
          priceRange: "$$",
          waitTime: "30 min",
          distance: "1.5 km",
          image:
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300",
          specialFeature: "Large Tables",
          groupDiscount: "15% off for 6+ people",
        },
        reason:
          "Specializes in family dining with large tables and group discounts",
        confidence: 90,
        icon: "people",
        color: "#10b981",
      },
    ],
  };

  const getWeatherIcon = () => {
    switch (currentWeather.condition) {
      case "sunny":
        return "sunny";
      case "cloudy":
        return "cloudy";
      case "rainy":
        return "rainy";
      default:
        return "partly-sunny";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "#10b981";
    if (confidence >= 80) return "#f59e0b";
    return "#6b7280";
  };

  const RecommendationCard = ({ recommendation, onPress }: any) => (
    <TouchableOpacity style={styles.recommendationCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.recommendationIcon,
            { backgroundColor: `${recommendation.color}20` },
          ]}
        >
          <Ionicons
            name={recommendation.icon}
            size={20}
            color={recommendation.color}
          />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
          <Text style={styles.recommendationSubtitle}>
            {recommendation.subtitle}
          </Text>
        </View>
        <View style={styles.confidenceContainer}>
          <View
            style={[
              styles.confidenceDot,
              {
                backgroundColor: getConfidenceColor(recommendation.confidence),
              },
            ]}
          />
          <Text style={styles.confidenceText}>
            {recommendation.confidence}%
          </Text>
        </View>
      </View>

      <View style={styles.businessCard}>
        <Image
          source={{ uri: recommendation.business.image }}
          style={styles.businessImage}
        />
        <View style={styles.businessInfo}>
          <View style={styles.businessHeader}>
            <Text style={styles.businessName}>
              {recommendation.business.name}
            </Text>
            <View style={styles.businessBadges}>
              {recommendation.business.newBadge && (
                <View style={styles.newBadge}>
                  <Text style={styles.badgeText}>NEW</Text>
                </View>
              )}
              {recommendation.business.trendingBadge && (
                <View style={styles.trendingBadge}>
                  <Text style={styles.badgeText}>TRENDING</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.businessDetails}>
            <Text style={styles.businessType}>
              {recommendation.business.type} • {recommendation.business.cuisine}
            </Text>
            <View style={styles.businessMeta}>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.ratingText}>
                  {recommendation.business.rating}
                </Text>
              </View>
              <Text style={styles.priceRange}>
                {recommendation.business.priceRange}
              </Text>
              <Text style={styles.distance}>
                {recommendation.business.distance}
              </Text>
            </View>
          </View>

          <View style={styles.businessFeatures}>
            <View style={styles.feature}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.featureText}>
                {recommendation.business.waitTime} wait
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text style={styles.featureText}>
                {recommendation.business.specialFeature}
              </Text>
            </View>
          </View>

          {recommendation.business.currentDiscount && (
            <View style={styles.discountBanner}>
              <Ionicons name="gift" size={14} color="#ef4444" />
              <Text style={styles.discountText}>
                {recommendation.business.currentDiscount}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.reasonContainer}>
        <Ionicons name="bulb-outline" size={16} color="#8b5cf6" />
        <Text style={styles.reasonText}>{recommendation.reason}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleRecommendationPress = (recommendation: any) => {
    Alert.alert(
      "Smart Recommendation",
      `This recommendation has a ${recommendation.confidence}% confidence match based on your preferences, current weather, and booking history.`,
      [
        { text: "Not Interested", style: "cancel" },
        {
          text: "Book Now",
          onPress: () =>
            Alert.alert("Booking", "Redirecting to booking flow..."),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Recommendations</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weather Context */}
        <View style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <Ionicons name={getWeatherIcon()} size={24} color="#f59e0b" />
            <View style={styles.contextInfo}>
              <Text style={styles.contextTitle}>Current Conditions</Text>
              <Text style={styles.contextDescription}>
                {currentWeather.temp}°C • {currentWeather.description}
              </Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeText}>
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Weather-Based Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfect for Today's Weather</Text>
          {smartRecommendations.weatherBased.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onPress={() => handleRecommendationPress(rec)}
            />
          ))}
        </View>

        {/* Time-Based Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Right for Right Now</Text>
          {smartRecommendations.timeBased.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onPress={() => handleRecommendationPress(rec)}
            />
          ))}
        </View>

        {/* Personalized Picks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Picked Just for You</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your dining history and preferences
          </Text>
          {smartRecommendations.personalizedPicks.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onPress={() => handleRecommendationPress(rec)}
            />
          ))}
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          {smartRecommendations.trending.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onPress={() => handleRecommendationPress(rec)}
            />
          ))}
        </View>

        {/* Group Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Great for Groups</Text>
          {smartRecommendations.groupRecommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onPress={() => handleRecommendationPress(rec)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Recommendations update based on weather, time, and your preferences
          </Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  contextCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contextHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  contextInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  contextDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  timeInfo: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
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
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  businessCard: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  businessImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  businessInfo: {
    flex: 1,
  },
  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  businessBadges: {
    flexDirection: "row",
    gap: 4,
  },
  newBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendingBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  businessDetails: {
    marginBottom: 8,
  },
  businessType: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  businessMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  priceRange: {
    fontSize: 14,
    color: "#6b7280",
  },
  distance: {
    fontSize: 14,
    color: "#6b7280",
  },
  businessFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: "#6b7280",
  },
  discountBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    gap: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ef4444",
  },
  reasonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  reasonText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  bookNowButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bookNowText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export default SmartRecommendationsScreen;
