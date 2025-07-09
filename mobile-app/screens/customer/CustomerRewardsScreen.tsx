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
  ProgressBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomerRewardsScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "achievements" | "offers"
  >("overview");

  // Mock user data - in real app this would come from API
  const userData = {
    name: "Ahmed Ben Ali",
    totalPoints: 2450,
    level: "Gold Member",
    nextLevel: "Platinum",
    pointsToNext: 550,
    totalBookings: 23,
    favoriteBusinesses: 8,
    reviewsWritten: 12,
    photoShares: 6,
    referrals: 3,
  };

  const achievements = [
    {
      id: "first_booking",
      title: "First Reservation",
      description: "Made your first booking through Reservili",
      points: 100,
      completed: true,
      icon: "calendar",
      color: "#10b981",
      unlockedDate: "2024-01-15",
    },
    {
      id: "early_adopter",
      title: "Early Adopter",
      description: "One of the first 100 users in Tunisia",
      points: 500,
      completed: true,
      icon: "star",
      color: "#f59e0b",
      badge: "Exclusive",
      unlockedDate: "2024-01-10",
    },
    {
      id: "restaurant_explorer",
      title: "Restaurant Explorer",
      description: "Visited 5 different restaurants",
      points: 200,
      completed: true,
      icon: "restaurant",
      color: "#ef4444",
      progress: 5,
      total: 5,
      unlockedDate: "2024-02-20",
    },
    {
      id: "review_master",
      title: "Review Master",
      description: "Write 10 helpful reviews",
      points: 300,
      completed: false,
      icon: "chatbubbles",
      color: "#8b5cf6",
      progress: 7,
      total: 10,
    },
    {
      id: "social_butterfly",
      title: "Social Butterfly",
      description: "Share 15 photos from your visits",
      points: 250,
      completed: false,
      icon: "camera",
      color: "#06b6d4",
      progress: 6,
      total: 15,
    },
    {
      id: "referral_champion",
      title: "Referral Champion",
      description: "Refer 5 friends to Reservili",
      points: 1000,
      completed: false,
      icon: "people",
      color: "#10b981",
      progress: 3,
      total: 5,
    },
  ];

  const availableOffers = [
    {
      id: "welcome_bonus",
      title: "50% Off Your Next Meal",
      description: "Valid at any restaurant for first-time bookings",
      validUntil: "2024-03-31",
      code: "WELCOME50",
      businessType: "Restaurant",
      icon: "restaurant",
      color: "#ef4444",
      discount: "50% OFF",
      terms: "Maximum discount 25 TND. Valid for new restaurant bookings only.",
    },
    {
      id: "coffee_loyalty",
      title: "Free Coffee After 5 Visits",
      description: "Collect stamps at participating coffee shops",
      progress: 3,
      total: 5,
      businessType: "Coffee",
      icon: "cafe",
      color: "#8b5cf6",
      discount: "FREE DRINK",
    },
    {
      id: "barber_premium",
      title: "Premium Cut for Regular Price",
      description: "Upgrade to premium services at select barber shops",
      validUntil: "2024-04-15",
      code: "PREMIUM24",
      businessType: "Barber",
      icon: "cut",
      color: "#10b981",
      discount: "FREE UPGRADE",
    },
    {
      id: "group_discount",
      title: "Group Booking Discount",
      description: "20% off when booking for 4+ people",
      code: "GROUP20",
      businessType: "All",
      icon: "people",
      color: "#f59e0b",
      discount: "20% OFF",
      terms: "Minimum 4 people. Valid at participating venues.",
    },
  ];

  const levelBenefits = {
    Bronze: ["Basic booking", "Standard support"],
    Silver: ["Priority booking", "Exclusive offers", "5% bonus points"],
    Gold: [
      "Skip waitlists",
      "Premium support",
      "10% bonus points",
      "Early access to new features",
    ],
    Platinum: [
      "VIP treatment",
      "Personal concierge",
      "15% bonus points",
      "Exclusive events",
      "Custom experiences",
    ],
  };

  const OverviewTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* User Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.levelText}>{userData.level}</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userLevel}>{userData.level}</Text>
            <View style={styles.pointsContainer}>
              <Ionicons name="diamond" size={16} color="#8b5cf6" />
              <Text style={styles.pointsText}>
                {userData.totalPoints} points
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              Progress to {userData.nextLevel}
            </Text>
            <Text style={styles.progressSubtitle}>
              {userData.pointsToNext} points needed
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((3000 - userData.pointsToNext) / 3000) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={20} color="#3b82f6" />
            <Text style={styles.statValue}>{userData.totalBookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={20} color="#ef4444" />
            <Text style={styles.statValue}>{userData.favoriteBusinesses}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubbles" size={20} color="#10b981" />
            <Text style={styles.statValue}>{userData.reviewsWritten}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={20} color="#f59e0b" />
            <Text style={styles.statValue}>{userData.referrals}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
        </View>
      </View>

      {/* Level Benefits */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>Your {userData.level} Benefits</Text>
        <View style={styles.benefitsList}>
          {levelBenefits[userData.level as keyof typeof levelBenefits]?.map(
            (benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            )
          )}
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        {achievements
          .filter((a) => a.completed)
          .slice(-2)
          .map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: `${achievement.color}20` },
                ]}
              >
                <Ionicons
                  name={achievement.icon as any}
                  size={20}
                  color={achievement.color}
                />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <Text style={styles.achievementPoints}>
                  +{achievement.points} points
                </Text>
              </View>
              {achievement.badge && (
                <View style={styles.exclusiveBadge}>
                  <Text style={styles.exclusiveText}>{achievement.badge}</Text>
                </View>
              )}
            </View>
          ))}
      </View>
    </ScrollView>
  );

  const AchievementsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>All Achievements</Text>
      <Text style={styles.sectionSubtitle}>
        Complete challenges to earn points and unlock exclusive rewards
      </Text>

      {achievements.map((achievement) => (
        <View
          key={achievement.id}
          style={[
            styles.achievementCard,
            !achievement.completed && styles.incompleteAchievement,
          ]}
        >
          <View
            style={[
              styles.achievementIcon,
              { backgroundColor: `${achievement.color}20` },
              !achievement.completed && styles.incompleteIcon,
            ]}
          >
            <Ionicons
              name={achievement.icon as any}
              size={20}
              color={achievement.completed ? achievement.color : "#9ca3af"}
            />
          </View>

          <View style={styles.achievementContent}>
            <View style={styles.achievementHeader}>
              <Text
                style={[
                  styles.achievementTitle,
                  !achievement.completed && styles.incompleteTitle,
                ]}
              >
                {achievement.title}
              </Text>
              {achievement.badge && (
                <View style={styles.exclusiveBadge}>
                  <Text style={styles.exclusiveText}>{achievement.badge}</Text>
                </View>
              )}
            </View>

            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>

            {achievement.progress !== undefined && achievement.total && (
              <View style={styles.achievementProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          (achievement.progress / achievement.total) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {achievement.progress}/{achievement.total}
                </Text>
              </View>
            )}

            <View style={styles.achievementFooter}>
              <Text style={styles.achievementPoints}>
                +{achievement.points} points
              </Text>
              {achievement.completed && achievement.unlockedDate && (
                <Text style={styles.unlockedDate}>
                  Unlocked {achievement.unlockedDate}
                </Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const OffersTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Available Offers</Text>
      <Text style={styles.sectionSubtitle}>
        Exclusive deals and discounts for Reservili members
      </Text>

      {availableOffers.map((offer) => (
        <View key={offer.id} style={styles.offerCard}>
          <View style={styles.offerHeader}>
            <View
              style={[
                styles.offerIcon,
                { backgroundColor: `${offer.color}20` },
              ]}
            >
              <Ionicons
                name={offer.icon as any}
                size={20}
                color={offer.color}
              />
            </View>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{offer.discount}</Text>
            </View>
          </View>

          {offer.progress !== undefined && offer.total && (
            <View style={styles.offerProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(offer.progress / offer.total) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {offer.progress}/{offer.total} visits
              </Text>
            </View>
          )}

          <View style={styles.offerFooter}>
            <View style={styles.offerDetails}>
              {offer.code && (
                <Text style={styles.offerCode}>Code: {offer.code}</Text>
              )}
              {offer.validUntil && (
                <Text style={styles.offerExpiry}>
                  Valid until {offer.validUntil}
                </Text>
              )}
              <Text style={styles.offerType}>{offer.businessType}</Text>
            </View>

            <TouchableOpacity
              style={styles.useOfferButton}
              onPress={() =>
                Alert.alert(
                  "Offer Activated",
                  "This offer is now active in your booking flow!"
                )
              }
            >
              <Text style={styles.useOfferText}>Use Offer</Text>
            </TouchableOpacity>
          </View>

          {offer.terms && <Text style={styles.offerTerms}>{offer.terms}</Text>}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards & Achievements</Text>
        <TouchableOpacity>
          <Ionicons name="gift-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
          onPress={() => setSelectedTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "achievements" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("achievements")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "achievements" && styles.activeTabText,
            ]}
          >
            Achievements
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "offers" && styles.activeTab]}
          onPress={() => setSelectedTab("offers")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "offers" && styles.activeTabText,
            ]}
          >
            Offers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {selectedTab === "overview" && <OverviewTab />}
        {selectedTab === "achievements" && <AchievementsTab />}
        {selectedTab === "offers" && <OffersTab />}
      </View>
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  content: {
    flex: 1,
    padding: 16,
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
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  levelBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  progressSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: "#374151",
  },
  recentContainer: {
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  incompleteAchievement: {
    opacity: 0.7,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  incompleteIcon: {
    backgroundColor: "#f3f4f6",
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  incompleteTitle: {
    color: "#6b7280",
  },
  achievementDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  achievementProgress: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  achievementFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  achievementPoints: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8b5cf6",
  },
  unlockedDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  exclusiveBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  exclusiveText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  offerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  discountBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  offerProgress: {
    marginBottom: 12,
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  offerDetails: {
    flex: 1,
  },
  offerCode: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 2,
  },
  offerExpiry: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  offerType: {
    fontSize: 12,
    color: "#6b7280",
  },
  useOfferButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  useOfferText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  offerTerms: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default CustomerRewardsScreen;
