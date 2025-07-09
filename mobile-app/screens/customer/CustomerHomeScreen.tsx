import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import {
  getSponsoredBusinessesByCategory,
  trackSponsoredClick,
  trackSponsoredImpression,
} from "../../utils/advertisingData";
import RestaurantFeatures from "./components/RestaurantFeatures";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerHome">;

// Sample business data
const mockBusinesses = [
  {
    id: "1",
    name: "Le Petit Café",
    category: "Café",
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    ratingCount: 124,
    distance: "0.3 km",
    openNow: true,
  },
  {
    id: "2",
    name: "Modern Barber Shop",
    category: "Barber",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    ratingCount: 89,
    distance: "1.2 km",
    openNow: true,
  },
  {
    id: "3",
    name: "Bistro Tunis",
    category: "Restaurant",
    image:
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.3,
    ratingCount: 256,
    distance: "0.8 km",
    openNow: false,
  },
  {
    id: "4",
    name: "Salon de Beauté",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    ratingCount: 102,
    distance: "1.5 km",
    openNow: true,
  },
  {
    id: "5",
    name: "Al Madina Restaurant",
    category: "Restaurant",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.5,
    ratingCount: 178,
    distance: "2.1 km",
    openNow: true,
  },
];

// Sample category data
const categories = [
  { id: "all", name: "All" },
  { id: "restaurant", name: "Restaurants" },
  { id: "cafe", name: "Cafés" },
  { id: "barber", name: "Barbers" },
  { id: "beauty", name: "Beauty" },
  { id: "spa", name: "Spa" },
];

const CustomerHomeScreen = ({ navigation }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Add user stats for early adopter benefits
  const [userStats] = useState({
    totalPoints: 2450,
    level: "Gold Member",
    upcomingBookings: 3,
    availableOffers: 4,
    earlyAdopterBadge: true,
  });

  const handleBusinessPress = (businessId: string) => {
    navigation.navigate("BusinessProfile", { id: businessId });
  };

  // Get sponsored businesses for the selected category
  const getSponsoredBusinesses = () => {
    return getSponsoredBusinessesByCategory(selectedCategory);
  };

  // Filter regular businesses based on category
  const getFilteredBusinesses = () => {
    if (selectedCategory === "all") {
      return mockBusinesses;
    }
    return mockBusinesses.filter((business) =>
      business.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  };

  const renderBusinessCard = ({ item }: { item: Business }) => {
    return (
      <TouchableOpacity
        style={styles.businessCard}
        onPress={() =>
          navigation.navigate("BusinessProfile", { businessId: item.id })
        }
      >
        <Image source={{ uri: item.image }} style={styles.businessImage} />
        <View style={styles.businessInfo}>
          <View style={styles.businessHeader}>
            <Text style={styles.businessName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.businessCategory}>{item.category}</Text>
          <Text style={styles.businessLocation}>{item.location}</Text>

          {/* Restaurant-specific features indicator */}
          {item.category === "Restaurant" && (
            <View style={styles.restaurantFeatures}>
              <View style={styles.featureTag}>
                <Ionicons name="time" size={12} color="#3b82f6" />
                <Text style={styles.featureText}>Live Wait Times</Text>
              </View>
              <View style={styles.featureTag}>
                <Ionicons name="restaurant" size={12} color="#10b981" />
                <Text style={styles.featureText}>Table Preference</Text>
              </View>
            </View>
          )}

          <View style={styles.businessFooter}>
            <Text style={styles.priceRange}>{item.priceRange}</Text>
            <Text style={styles.availability}>{item.availability}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSponsoredBusinessCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.sponsoredCard}
      onPress={() => {
        trackSponsoredClick(item.id);
        handleBusinessPress(item.id);
      }}
    >
      <View style={styles.sponsoredBadge}>
        <Ionicons name="star" size={12} color="#fff" />
        <Text style={styles.sponsoredText}>Sponsored</Text>
      </View>

      <Image source={{ uri: item.image }} style={styles.sponsoredImage} />

      <View style={styles.sponsoredContent}>
        <Text style={styles.sponsoredName}>{item.name}</Text>
        <Text style={styles.sponsoredCategory}>{item.category}</Text>

        <View style={styles.sponsoredMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.ratingCount}>({item.ratingCount})</Text>
          </View>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>

        {item.promotionalOffer && (
          <View style={styles.offerContainer}>
            <Ionicons name="gift-outline" size={14} color="#10b981" />
            <Text style={styles.offerText}>{item.promotionalOffer}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.sponsoredBookButton}
          onPress={() => {
            trackSponsoredClick(item.id, "booking_button");
            navigation.navigate("Booking", { businessId: item.id });
          }}
        >
          <Text style={styles.sponsoredBookText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const currentSponsoredBusinesses = getSponsoredBusinesses();
  const filteredBusinesses = getFilteredBusinesses();

  useEffect(() => {
    currentSponsoredBusinesses.forEach((business) => {
      trackSponsoredImpression(business.id);
    });
  }, [currentSponsoredBusinesses]);

  // Handle restaurant feature press
  const handleRestaurantFeaturePress = (feature: string) => {
    switch (feature) {
      case "live_wait_times":
        Alert.alert(
          "Live Wait Times",
          "See current wait times at restaurants before you arrive. Never wait longer than expected!",
          [{ text: "Got it!" }]
        );
        break;
      case "table_preferences":
        Alert.alert(
          "Table Preferences",
          "Choose your preferred seating: outdoor terrace, window view, quiet corner, or near the bar.",
          [{ text: "Nice!" }]
        );
        break;
      case "pre_order_menu":
        Alert.alert(
          "Pre-Order Menu",
          "Order your food ahead of time and have it ready when you arrive. Perfect for lunch breaks!",
          [{ text: "Awesome!" }]
        );
        break;
      case "group_reservations":
        Alert.alert(
          "Group Reservations",
          "Easily book for large groups with special arrangements and menu planning.",
          [{ text: "Perfect!" }]
        );
        break;
      case "dietary_preferences":
        Alert.alert(
          "Dietary Preferences",
          "Filter menu items by your dietary restrictions: vegan, gluten-free, halal, and more.",
          [{ text: "Love it!" }]
        );
        break;
      default:
        Alert.alert("Feature", "This feature will be available soon!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header with User Info */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Good afternoon!</Text>
          <View style={styles.userLevelContainer}>
            <Text style={styles.userLevel}>{userStats.level}</Text>
            {userStats.earlyAdopterBadge && (
              <View style={styles.earlyAdopterBadge}>
                <Ionicons name="star" size={12} color="#fff" />
                <Text style={styles.badgeText}>Early Adopter</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.pointsContainer}
          onPress={() => navigation.navigate("CustomerRewards")}
        >
          <Ionicons name="diamond" size={20} color="#8b5cf6" />
          <Text style={styles.pointsText}>{userStats.totalPoints}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Row */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate("SmartRecommendations")}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="bulb" size={20} color="#f59e0b" />
          </View>
          <Text style={styles.quickActionTitle}>Smart Picks</Text>
          <Text style={styles.quickActionSubtitle}>AI recommendations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate("CustomerRewards")}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="gift" size={20} color="#ef4444" />
          </View>
          <Text style={styles.quickActionTitle}>Rewards</Text>
          <Text style={styles.quickActionSubtitle}>
            {userStats.availableOffers} offers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() =>
            Alert.alert("Coming Soon", "Group booking feature coming soon!")
          }
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="people" size={20} color="#10b981" />
          </View>
          <Text style={styles.quickActionTitle}>Group</Text>
          <Text style={styles.quickActionSubtitle}>Book together</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() =>
            Alert.alert("Coming Soon", "Live wait times coming soon!")
          }
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="time" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.quickActionTitle}>Live Wait</Text>
          <Text style={styles.quickActionSubtitle}>Real-time info</Text>
        </TouchableOpacity>
      </View>

      {/* Early Adopter Perks Banner */}
      <TouchableOpacity
        style={styles.perksContainer}
        onPress={() =>
          Alert.alert(
            "Early Adopter Perks",
            "Enjoy exclusive benefits as an early adopter:\n\n• 50 TND welcome credit\n• Double points on first 5 bookings\n• Priority customer support\n• Exclusive restaurant access"
          )
        }
      >
        <View style={styles.perksIcon}>
          <Ionicons name="trophy" size={20} color="#f59e0b" />
        </View>
        <View style={styles.perksContent}>
          <Text style={styles.perksTitle}>Early Adopter Benefits Active</Text>
          <Text style={styles.perksSubtitle}>
            Tap to see your exclusive perks
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#6b7280" />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6b7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cafés, barbers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Features - Only show when Restaurant category is selected */}
        {selectedCategory === "restaurant" && (
          <RestaurantFeatures
            businessId="demo_restaurant"
            onFeaturePress={handleRestaurantFeaturePress}
          />
        )}

        {/* Sponsored Section */}
        {currentSponsoredBusinesses.length > 0 && (
          <View style={styles.sponsoredSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={18} color="#f59e0b" />
              <Text style={styles.sectionTitle}>Featured Businesses</Text>
              <View style={styles.sponsoredLabel}>
                <Text style={styles.sponsoredLabelText}>AD</Text>
              </View>
            </View>

            <FlatList
              data={currentSponsoredBusinesses}
              renderItem={renderSponsoredBusinessCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sponsoredList}
            />
          </View>
        )}

        {/* Regular Business Section */}
        <View style={styles.businessSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "all"
              ? "All Businesses"
              : `${
                  categories.find((c) => c.id === selectedCategory)?.name
                } Near You`}
          </Text>

          <FlatList
            data={filteredBusinesses}
            renderItem={renderBusinessCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.businessList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  userLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userLevel: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  earlyAdopterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    gap: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  quickActionCard: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  quickActionSubtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  perksContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 8,
  },
  perksIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  perksContent: {
    flex: 1,
  },
  perksTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  perksSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#111827",
  },
  filterButton: {
    padding: 8,
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
  },
  categoryItemActive: {
    backgroundColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
  },
  businessList: {
    padding: 16,
  },
  businessCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  businessImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  businessInfo: {
    padding: 16,
  },
  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: "#6b7280",
  },
  businessLocation: {
    fontSize: 14,
    color: "#6b7280",
  },
  businessFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRange: {
    fontSize: 14,
    color: "#6b7280",
  },
  availability: {
    fontSize: 14,
    color: "#6b7280",
  },
  restaurantFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 4,
    gap: 6,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  featureText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
  },
  sponsoredSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  sponsoredLabel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#f59e0b",
    marginLeft: 8,
  },
  sponsoredLabelText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  sponsoredList: {
    paddingVertical: 8,
  },
  sponsoredCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: 240,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f59e0b",
  },
  sponsoredText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  sponsoredImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  sponsoredContent: {
    padding: 12,
  },
  sponsoredName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  sponsoredCategory: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  sponsoredMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  distance: {
    fontSize: 12,
    color: "#6b7280",
  },
  offerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  offerText: {
    fontSize: 12,
    color: "#065f46",
    fontWeight: "500",
    marginLeft: 4,
    flex: 1,
  },
  sponsoredBookButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sponsoredBookText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },
  businessSection: {
    padding: 16,
    paddingTop: 0,
  },
});

export default CustomerHomeScreen;
