import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  Alert,
  TextInput,
  Switch,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import {
  UserProfile,
  Achievement,
  Gemstone,
  getUserLevel,
  getNextLevel,
  calculateLevelProgress,
  CUSTOMER_ACHIEVEMENTS,
  GEMSTONES,
  getRarityColor,
  getRarityGlow,
  updateAchievementProgress,
} from "../../utils/achievementSystem";
import {
  CustomerLoyalty,
  LoyaltyReward,
  DEFAULT_LOYALTY_TIERS,
  DEFAULT_REWARDS,
  getCurrentTier,
  getNextTier,
  getTierProgress,
  getLoyaltyInsights,
  canRedeemReward,
  redeemReward,
  formatPointsDisplay,
} from "../../utils/loyaltySystem";
import {
  CustomerSubscription,
  SubscriptionPlan,
  DEFAULT_SUBSCRIPTION_PLANS,
  getSubscriptionBenefits,
  formatSubscriptionStatus,
  isSubscriptionExpiringSoon,
} from "../../utils/subscriptionSystem";
import {
  CustomerWallet,
  WalletTransaction,
  getWalletSummary,
  formatWalletAmount,
  getTransactionIcon,
  getTransactionColor,
} from "../../utils/walletSystem";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

const { width } = Dimensions.get("window");

// Customer profile interface for editing
interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  profilePicture?: string;
  preferences: {
    notifications: boolean;
    emailMarketing: boolean;
    smsMarketing: boolean;
    language: string;
    currency: string;
  };
}

// Mock customer profile data
const mockCustomerProfile: CustomerProfile = {
  id: "customer_001",
  firstName: "Ahmed",
  lastName: "Ben Ali",
  email: "ahmed.benali@email.com",
  phone: "+216 20 123 456",
  dateOfBirth: "1990-05-15",
  address: "123 Avenue Habib Bourguiba",
  city: "Tunis",
  country: "Tunisia",
  preferences: {
    notifications: true,
    emailMarketing: false,
    smsMarketing: true,
    language: "English",
    currency: "TND",
  },
};

// Mock user profile data
const mockUserProfile: UserProfile = {
  id: "customer_001",
  type: "customer",
  level: 4,
  totalPoints: 750,
  currentLevelProgress: 50,
  achievements: CUSTOMER_ACHIEVEMENTS.map((achievement, index) => ({
    ...achievement,
    unlocked: index < 3, // First 3 achievements unlocked
    progress: index < 3 ? 100 : Math.random() * 80,
    unlockedAt: index < 3 ? new Date() : undefined,
  })),
  gemstones: [GEMSTONES.garnet, GEMSTONES.topaz, GEMSTONES.pearl],
  stats: {
    totalBookings: 15,
    completedBookings: 14,
    cancelledBookings: 1,
    noShows: 0,
    totalSpent: 420,
    averageRating: 4.8,
    streakDays: 7,
    referrals: 2,
    reviewsGiven: 8,
  },
};

// Mock loyalty data
const mockCustomerLoyalty: CustomerLoyalty = {
  customerId: "customer_001",
  businessId: "business_001",
  totalPoints: 1250,
  availablePoints: 950,
  currentTier: "gold",
  pointsHistory: [
    {
      id: "p1",
      customerId: "customer_001",
      businessId: "business_001",
      points: 50,
      earnedFrom: "booking",
      earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      description: "Booking completed at Le Petit Café",
      bookingId: "booking_123",
    },
    {
      id: "p2",
      customerId: "customer_001",
      businessId: "business_001",
      points: 100,
      earnedFrom: "review",
      earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: "Review submitted for excellent service",
    },
  ],
  redeemedRewards: [
    {
      rewardId: "discount_10_50",
      redeemedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      pointsSpent: 50,
      used: true,
      usedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
  ],
  joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  lastActivity: new Date(),
};

// Mock subscription data
const mockCustomerSubscription: CustomerSubscription = {
  id: "sub_001",
  customerId: "customer_001",
  businessId: "business_001",
  planId: "premium",
  status: "active",
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  autoRenew: true,
  paymentMethod: "Credit Card",
  totalPaid: 105, // 3 months * 35 TND
  bookingsUsed: 5,
  createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
};

// Mock wallet data
const mockCustomerWallet: CustomerWallet = {
  id: "wallet_001",
  customerId: "customer_001",
  totalBalance: 85.5,
  availableBalance: 85.5,
  loyaltyCredits: 25.0,
  refundableBalance: 60.5,
  currency: "TND",
  transactions: [
    {
      id: "txn_001",
      walletId: "wallet_001",
      type: "credit",
      amount: 30.0,
      currency: "TND",
      source: "refund",
      description: "Refund for cancelled booking",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      bookingId: "booking_456",
    },
    {
      id: "txn_002",
      walletId: "wallet_001",
      type: "credit",
      amount: 25.0,
      currency: "TND",
      source: "loyalty",
      description: "Loyalty reward redemption",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "txn_003",
      walletId: "wallet_001",
      type: "debit",
      amount: 15.0,
      currency: "TND",
      source: "payment",
      description: "Payment for booking at Salon Elite",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      bookingId: "booking_789",
    },
  ],
  lastUpdated: new Date(),
  createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
  isActive: true,
};

const ProfileScreen = ({ navigation }: Props) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [customerLoyalty, setCustomerLoyalty] =
    useState<CustomerLoyalty>(mockCustomerLoyalty);
  const [customerSubscription, setCustomerSubscription] =
    useState<CustomerSubscription>(mockCustomerSubscription);
  const [customerWallet, setCustomerWallet] =
    useState<CustomerWallet>(mockCustomerWallet);
  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile>(mockCustomerProfile);
  const [selectedTab, setSelectedTab] = useState<
    | "overview"
    | "achievements"
    | "gemstones"
    | "loyalty"
    | "subscription"
    | "wallet"
    | "settings"
  >("overview");
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [selectedGemstone, setSelectedGemstone] = useState<Gemstone | null>(
    null
  );
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(
    null
  );
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] =
    useState<CustomerProfile>(mockCustomerProfile);
  const [animatedValues] = useState({
    levelProgress: new Animated.Value(0),
    gemstoneGlow: new Animated.Value(0),
  });

  useEffect(() => {
    // Animate level progress bar
    Animated.timing(animatedValues.levelProgress, {
      toValue: userProfile.currentLevelProgress,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Animate gemstone glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.gemstoneGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.gemstoneGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [userProfile]);

  const currentLevel = getUserLevel(userProfile.totalPoints);
  const nextLevel = getNextLevel(currentLevel.level);

  const renderLevelCard = () => (
    <View style={[styles.levelCard, { borderColor: currentLevel.color }]}>
      <View style={styles.levelHeader}>
        <View
          style={[styles.levelIcon, { backgroundColor: currentLevel.color }]}
        >
          <Ionicons name={currentLevel.icon as any} size={24} color="#fff" />
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>Level {currentLevel.level}</Text>
          <Text style={[styles.levelName, { color: currentLevel.color }]}>
            {currentLevel.title}
          </Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{userProfile.totalPoints}</Text>
          <Text style={styles.pointsLabel}>Points</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: animatedValues.levelProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: currentLevel.color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {nextLevel
            ? `${userProfile.totalPoints}/${nextLevel.minPoints} to ${nextLevel.title}`
            : "Max Level Reached!"}
        </Text>
      </View>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Current Benefits:</Text>
        {currentLevel.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={currentLevel.color}
            />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Your Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {userProfile.stats.totalBookings}
          </Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {userProfile.stats.averageRating.toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {userProfile.stats.totalSpent} TND
          </Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userProfile.stats.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievementCard = (achievement: Achievement) => (
    <TouchableOpacity
      key={achievement.id}
      style={[
        styles.achievementCard,
        achievement.unlocked && styles.achievementUnlocked,
        { borderColor: getRarityColor(achievement.rarity) },
      ]}
      onPress={() => setSelectedAchievement(achievement)}
    >
      <View style={styles.achievementHeader}>
        <View
          style={[
            styles.achievementIcon,
            {
              backgroundColor: achievement.unlocked
                ? getRarityColor(achievement.rarity)
                : "#e5e7eb",
            },
          ]}
        >
          <Ionicons
            name={achievement.icon as any}
            size={20}
            color={achievement.unlocked ? "#fff" : "#9ca3af"}
          />
        </View>
        <View style={styles.achievementInfo}>
          <Text
            style={[
              styles.achievementTitle,
              !achievement.unlocked && styles.achievementLocked,
            ]}
          >
            {achievement.title}
          </Text>
          <Text style={styles.achievementCategory}>
            {achievement.category.toUpperCase()}
          </Text>
        </View>
        <View style={styles.achievementReward}>
          <Text style={styles.achievementPoints}>+{achievement.points}</Text>
          <Ionicons
            name="diamond-outline"
            size={16}
            color={getRarityColor(achievement.rarity)}
          />
        </View>
      </View>

      {!achievement.unlocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${achievement.progress}%`,
                  backgroundColor: getRarityColor(achievement.rarity),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(achievement.progress)}% Complete
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderGemstoneCard = (gemstone: Gemstone, index: number) => (
    <TouchableOpacity
      key={gemstone.id}
      style={[styles.gemstoneCard, { borderColor: gemstone.color }]}
      onPress={() => setSelectedGemstone(gemstone)}
    >
      <Animated.View
        style={[
          styles.gemstoneIcon,
          {
            backgroundColor: gemstone.color,
            shadowColor: gemstone.glowColor,
            shadowOpacity: animatedValues.gemstoneGlow,
            shadowRadius: 10,
            elevation: animatedValues.gemstoneGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 8],
            }),
          },
        ]}
      >
        <Ionicons name={gemstone.icon as any} size={24} color="#fff" />
      </Animated.View>
      <Text style={styles.gemstoneName}>{gemstone.name}</Text>
      <Text
        style={[
          styles.gemstoneRarity,
          { color: getRarityColor(gemstone.rarity) },
        ]}
      >
        {gemstone.rarity.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const renderLoyaltyCard = () => {
    const loyaltyInsights = getLoyaltyInsights(customerLoyalty);
    const currentTier = getCurrentTier(customerLoyalty.totalPoints);

    return (
      <View style={[styles.loyaltyCard, { borderColor: currentTier.color }]}>
        <View style={styles.loyaltyHeader}>
          <View
            style={[styles.tierIcon, { backgroundColor: currentTier.color }]}
          >
            <Ionicons name={currentTier.icon as any} size={24} color="#fff" />
          </View>
          <View style={styles.loyaltyInfo}>
            <Text style={styles.tierName}>{currentTier.name} Tier</Text>
            <Text style={styles.loyaltyPoints}>
              {formatPointsDisplay(customerLoyalty.availablePoints)} points
              available
            </Text>
          </View>
        </View>

        <View style={styles.tierProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${loyaltyInsights.tierProgress}%`,
                  backgroundColor: currentTier.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {loyaltyInsights.nextTier
              ? `${loyaltyInsights.pointsToNext} points to ${loyaltyInsights.nextTier.name}`
              : "Max tier reached!"}
          </Text>
        </View>

        <View style={styles.tierBenefits}>
          <Text style={styles.benefitsTitle}>Current Benefits:</Text>
          {currentTier.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={currentTier.color}
              />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRewardsSection = () => (
    <View style={styles.rewardsSection}>
      <Text style={styles.sectionTitle}>Available Rewards</Text>
      {DEFAULT_REWARDS.filter((reward) => reward.isActive).map((reward) => (
        <TouchableOpacity
          key={reward.id}
          style={[
            styles.rewardCard,
            !canRedeemReward(customerLoyalty.availablePoints, reward) &&
              styles.rewardDisabled,
          ]}
          onPress={() => setSelectedReward(reward)}
          disabled={!canRedeemReward(customerLoyalty.availablePoints, reward)}
        >
          <View style={styles.rewardIcon}>
            <Ionicons name={reward.icon as any} size={24} color="#3b82f6" />
          </View>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            <Text style={styles.rewardCost}>{reward.pointsCost} points</Text>
          </View>
          <Ionicons
            name={
              canRedeemReward(customerLoyalty.availablePoints, reward)
                ? "chevron-forward"
                : "lock-closed"
            }
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSubscriptionCard = () => {
    const subscriptionBenefits = getSubscriptionBenefits(
      customerSubscription,
      DEFAULT_SUBSCRIPTION_PLANS
    );
    const subscriptionStatus = formatSubscriptionStatus(customerSubscription);
    const currentPlan = DEFAULT_SUBSCRIPTION_PLANS.find(
      (p) => p.id === customerSubscription.planId
    );

    return (
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <View
            style={[
              styles.planIcon,
              { backgroundColor: currentPlan?.color || "#3b82f6" },
            ]}
          >
            <Ionicons
              name={(currentPlan?.icon as any) || "card"}
              size={24}
              color="#fff"
            />
          </View>
          <View style={styles.subscriptionInfo}>
            <Text style={styles.planName}>{currentPlan?.name} Plan</Text>
            <Text
              style={[
                styles.subscriptionStatus,
                { color: subscriptionStatus.statusColor },
              ]}
            >
              {subscriptionStatus.statusText}
            </Text>
          </View>
          <Text style={styles.planPrice}>{currentPlan?.price} TND/month</Text>
        </View>

        <View style={styles.subscriptionStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {customerSubscription.bookingsUsed}
            </Text>
            <Text style={styles.statLabel}>Bookings Used</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {subscriptionBenefits.discountPercentage}%
            </Text>
            <Text style={styles.statLabel}>Discount</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {customerSubscription.totalPaid} TND
            </Text>
            <Text style={styles.statLabel}>Total Paid</Text>
          </View>
        </View>

        <View style={styles.planBenefits}>
          <Text style={styles.benefitsTitle}>Your Benefits:</Text>
          {subscriptionBenefits.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.manageButton}>
          <Text style={styles.manageButtonText}>Manage Subscription</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWalletCard = () => {
    const walletSummary = getWalletSummary(customerWallet);

    return (
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <View style={styles.walletIcon}>
            <Ionicons name="wallet" size={24} color="#fff" />
          </View>
          <View style={styles.walletInfo}>
            <Text style={styles.walletTitle}>My Wallet</Text>
            <Text style={styles.walletBalance}>
              {formatWalletAmount(walletSummary.availableBalance)}
            </Text>
          </View>
        </View>

        <View style={styles.balanceBreakdown}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Loyalty Credits</Text>
            <Text style={styles.balanceValue}>
              {formatWalletAmount(walletSummary.loyaltyCredits)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Refundable Balance</Text>
            <Text style={styles.balanceValue}>
              {formatWalletAmount(walletSummary.refundableBalance)}
            </Text>
          </View>
        </View>

        {walletSummary.expiringAmount > 0 && (
          <View style={styles.expiringAlert}>
            <Ionicons name="warning" size={16} color="#f59e0b" />
            <Text style={styles.expiringText}>
              {formatWalletAmount(walletSummary.expiringAmount)} expires on{" "}
              {walletSummary.expiringDate?.toLocaleDateString()}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.topUpButton}>
          <Text style={styles.topUpButtonText}>Add Funds</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransactionHistory = () => (
    <View style={styles.transactionSection}>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {getWalletSummary(customerWallet).recentTransactions.map(
        (transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View
              style={[
                styles.transactionIcon,
                { backgroundColor: getTransactionColor(transaction) + "20" },
              ]}
            >
              <Ionicons
                name={getTransactionIcon(transaction) as any}
                size={16}
                color={getTransactionColor(transaction)}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>
                {transaction.description}
              </Text>
              <Text style={styles.transactionDate}>
                {transaction.createdAt.toLocaleDateString()}
              </Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: getTransactionColor(transaction) },
              ]}
            >
              {transaction.type === "credit" ? "+" : "-"}
              {formatWalletAmount(transaction.amount)}
            </Text>
          </View>
        )
      )}
    </View>
  );

  const handleRewardRedeem = (reward: LoyaltyReward) => {
    if (!canRedeemReward(customerLoyalty.availablePoints, reward)) {
      Alert.alert(
        "Insufficient Points",
        "You don't have enough points to redeem this reward."
      );
      return;
    }

    Alert.alert(
      "Redeem Reward",
      `Are you sure you want to redeem "${reward.title}" for ${reward.pointsCost} points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: () => {
            const updatedLoyalty = redeemReward(customerLoyalty, reward.id);
            if (updatedLoyalty) {
              setCustomerLoyalty(updatedLoyalty);
              setSelectedReward(null);
              Alert.alert("Success", "Reward redeemed successfully!");
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditingProfile({ ...customerProfile });
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    setCustomerProfile({ ...editingProfile });
    setShowEditProfileModal(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditingProfile({ ...customerProfile });
    setShowEditProfileModal(false);
  };

  const renderSettingsTab = () => (
    <View style={styles.settingsContainer}>
      {/* Profile Information Card */}
      <View style={styles.settingsCard}>
        <View style={styles.settingsCardHeader}>
          <Text style={styles.settingsCardTitle}>Profile Information</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="pencil" size={16} color="#3b82f6" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfoGrid}>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Full Name</Text>
            <Text style={styles.profileInfoValue}>
              {customerProfile.firstName} {customerProfile.lastName}
            </Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Email</Text>
            <Text style={styles.profileInfoValue}>{customerProfile.email}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Phone</Text>
            <Text style={styles.profileInfoValue}>{customerProfile.phone}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Date of Birth</Text>
            <Text style={styles.profileInfoValue}>
              {new Date(customerProfile.dateOfBirth).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Address</Text>
            <Text style={styles.profileInfoValue}>
              {customerProfile.address}, {customerProfile.city},{" "}
              {customerProfile.country}
            </Text>
          </View>
        </View>
      </View>

      {/* Preferences Card */}
      <View style={styles.settingsCard}>
        <Text style={styles.settingsCardTitle}>Preferences</Text>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Push Notifications</Text>
            <Text style={styles.preferenceDescription}>
              Receive booking reminders and updates
            </Text>
          </View>
          <Switch
            value={customerProfile.preferences.notifications}
            onValueChange={(value) =>
              setCustomerProfile({
                ...customerProfile,
                preferences: {
                  ...customerProfile.preferences,
                  notifications: value,
                },
              })
            }
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={
              customerProfile.preferences.notifications ? "#3b82f6" : "#f4f4f5"
            }
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Email Marketing</Text>
            <Text style={styles.preferenceDescription}>
              Receive promotional emails and offers
            </Text>
          </View>
          <Switch
            value={customerProfile.preferences.emailMarketing}
            onValueChange={(value) =>
              setCustomerProfile({
                ...customerProfile,
                preferences: {
                  ...customerProfile.preferences,
                  emailMarketing: value,
                },
              })
            }
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={
              customerProfile.preferences.emailMarketing ? "#3b82f6" : "#f4f4f5"
            }
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>SMS Marketing</Text>
            <Text style={styles.preferenceDescription}>
              Receive promotional SMS messages
            </Text>
          </View>
          <Switch
            value={customerProfile.preferences.smsMarketing}
            onValueChange={(value) =>
              setCustomerProfile({
                ...customerProfile,
                preferences: {
                  ...customerProfile.preferences,
                  smsMarketing: value,
                },
              })
            }
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={
              customerProfile.preferences.smsMarketing ? "#3b82f6" : "#f4f4f5"
            }
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Language</Text>
            <Text style={styles.preferenceDescription}>
              App display language
            </Text>
          </View>
          <Text style={styles.preferenceValue}>
            {customerProfile.preferences.language}
          </Text>
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Currency</Text>
            <Text style={styles.preferenceDescription}>
              Preferred currency for payments
            </Text>
          </View>
          <Text style={styles.preferenceValue}>
            {customerProfile.preferences.currency}
          </Text>
        </View>
      </View>

      {/* Account Actions Card */}
      <View style={styles.settingsCard}>
        <Text style={styles.settingsCardTitle}>Account</Text>

        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Ionicons name="key-outline" size={20} color="#3b82f6" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Change Password</Text>
            <Text style={styles.actionDescription}>
              Update your account password
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Ionicons name="shield-outline" size={20} color="#3b82f6" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Privacy Settings</Text>
            <Text style={styles.actionDescription}>
              Manage your privacy preferences
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Ionicons name="help-circle-outline" size={20} color="#3b82f6" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Help & Support</Text>
            <Text style={styles.actionDescription}>
              Get help or contact support
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionItem, styles.dangerAction]}>
          <View style={[styles.actionIcon, styles.dangerActionIcon]}>
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, styles.dangerActionText]}>
              Sign Out
            </Text>
            <Text style={styles.actionDescription}>
              Sign out of your account
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <>
            {renderLevelCard()}
            {renderStatsCard()}
          </>
        );
      case "achievements":
        return (
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>
              Achievements (
              {userProfile.achievements.filter((a) => a.unlocked).length}/
              {userProfile.achievements.length})
            </Text>
            {userProfile.achievements.map(renderAchievementCard)}
          </View>
        );
      case "gemstones":
        return (
          <View style={styles.gemstonesContainer}>
            <Text style={styles.sectionTitle}>
              Gemstone Collection ({userProfile.gemstones.length})
            </Text>
            <View style={styles.gemstonesGrid}>
              {userProfile.gemstones.map(renderGemstoneCard)}
            </View>
          </View>
        );
      case "loyalty":
        return (
          <>
            {renderLoyaltyCard()}
            {renderRewardsSection()}
          </>
        );
      case "subscription":
        return renderSubscriptionCard();
      case "wallet":
        return (
          <>
            {renderWalletCard()}
            {renderTransactionHistory()}
          </>
        );
      case "settings":
        return renderSettingsTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContentContainer}
      >
        {(
          [
            "overview",
            "loyalty",
            "subscription",
            "wallet",
            "achievements",
            "gemstones",
            "settings",
          ] as const
        ).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Achievement Detail Modal */}
      <Modal
        visible={!!selectedAchievement}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAchievement(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedAchievement && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalIcon,
                      {
                        backgroundColor: selectedAchievement.unlocked
                          ? getRarityColor(selectedAchievement.rarity)
                          : "#e5e7eb",
                      },
                    ]}
                  >
                    <Ionicons
                      name={selectedAchievement.icon as any}
                      size={32}
                      color={selectedAchievement.unlocked ? "#fff" : "#9ca3af"}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedAchievement(null)}
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>
                  {selectedAchievement.title}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedAchievement.description}
                </Text>

                <View style={styles.modalRewards}>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardLabel}>Points</Text>
                    <Text style={styles.rewardValue}>
                      +{selectedAchievement.points}
                    </Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardLabel}>Gemstone</Text>
                    <Text style={styles.rewardValue}>
                      {GEMSTONES[selectedAchievement.gemstone].name}
                    </Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardLabel}>Rarity</Text>
                    <Text
                      style={[
                        styles.rewardValue,
                        { color: getRarityColor(selectedAchievement.rarity) },
                      ]}
                    >
                      {selectedAchievement.rarity.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {selectedAchievement.unlocked &&
                  selectedAchievement.unlockedAt && (
                    <Text style={styles.unlockedDate}>
                      Unlocked on{" "}
                      {selectedAchievement.unlockedAt.toLocaleDateString()}
                    </Text>
                  )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Gemstone Detail Modal */}
      <Modal
        visible={!!selectedGemstone}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedGemstone(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedGemstone && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalIcon,
                      { backgroundColor: selectedGemstone.color },
                    ]}
                  >
                    <Ionicons
                      name={selectedGemstone.icon as any}
                      size={32}
                      color="#fff"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedGemstone(null)}
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>{selectedGemstone.name}</Text>
                <Text style={styles.modalDescription}>
                  {selectedGemstone.description}
                </Text>

                <View style={styles.modalRewards}>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardLabel}>Value</Text>
                    <Text style={styles.rewardValue}>
                      +{selectedGemstone.points} Points
                    </Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardLabel}>Rarity</Text>
                    <Text
                      style={[
                        styles.rewardValue,
                        { color: getRarityColor(selectedGemstone.rarity) },
                      ]}
                    >
                      {selectedGemstone.rarity.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Reward Redemption Modal */}
      <Modal
        visible={!!selectedReward}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReward(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedReward && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[styles.modalIcon, { backgroundColor: "#3b82f6" }]}
                  >
                    <Ionicons
                      name={selectedReward.icon as any}
                      size={32}
                      color="#fff"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedReward(null)}
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>{selectedReward.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedReward.description}
                </Text>

                <View style={styles.modalRewards}>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardLabel}>Cost</Text>
                    <Text style={styles.rewardValue}>
                      {selectedReward.pointsCost} points
                    </Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardLabel}>Value</Text>
                    <Text style={styles.rewardValue}>
                      {selectedReward.type === "discount"
                        ? `${selectedReward.value}% off`
                        : selectedReward.type === "free_booking"
                        ? `Up to ${selectedReward.value} TND`
                        : "Premium upgrade"}
                    </Text>
                  </View>
                </View>

                <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>Terms & Conditions:</Text>
                  {selectedReward.termsAndConditions.map((term, index) => (
                    <Text key={index} style={styles.termText}>
                      • {term}
                    </Text>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setSelectedReward(null)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      !canRedeemReward(
                        customerLoyalty.availablePoints,
                        selectedReward
                      ) && styles.redeemButtonDisabled,
                    ]}
                    onPress={() => handleRewardRedeem(selectedReward)}
                    disabled={
                      !canRedeemReward(
                        customerLoyalty.availablePoints,
                        selectedReward
                      )
                    }
                  >
                    <Text style={styles.redeemButtonText}>
                      {canRedeemReward(
                        customerLoyalty.availablePoints,
                        selectedReward
                      )
                        ? "Redeem Reward"
                        : "Insufficient Points"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfileModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.editModalContainer]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancelEdit}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.editFormContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.editFormSection}>
                <Text style={styles.editSectionTitle}>
                  Personal Information
                </Text>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>First Name</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.firstName}
                    onChangeText={(text) =>
                      setEditingProfile({ ...editingProfile, firstName: text })
                    }
                    placeholder="Enter first name"
                  />
                </View>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.lastName}
                    onChangeText={(text) =>
                      setEditingProfile({ ...editingProfile, lastName: text })
                    }
                    placeholder="Enter last name"
                  />
                </View>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>Email</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.email}
                    onChangeText={(text) =>
                      setEditingProfile({ ...editingProfile, email: text })
                    }
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>Phone</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.phone}
                    onChangeText={(text) =>
                      setEditingProfile({ ...editingProfile, phone: text })
                    }
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>Date of Birth</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.dateOfBirth}
                    onChangeText={(text) =>
                      setEditingProfile({
                        ...editingProfile,
                        dateOfBirth: text,
                      })
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>

              <View style={styles.editFormSection}>
                <Text style={styles.editSectionTitle}>Address Information</Text>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>Address</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.address}
                    onChangeText={(text) =>
                      setEditingProfile({ ...editingProfile, address: text })
                    }
                    placeholder="Enter street address"
                  />
                </View>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>City</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.city}
                    onChangeText={(text) =>
                      setEditingProfile({ ...editingProfile, city: text })
                    }
                    placeholder="Enter city"
                  />
                </View>

                <View style={styles.editInputGroup}>
                  <Text style={styles.editInputLabel}>Country</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingProfile.country}
                    onChangeText={(text) =>
                      setEditingProfile({ ...editingProfile, country: text })
                    }
                    placeholder="Enter country"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  settingsButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 80,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    height: 50,
  },
  activeTab: {
    backgroundColor: "#3b82f6",
    borderWidth: 4,
    borderColor: "green",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  levelCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  levelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  levelName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
  pointsContainer: {
    alignItems: "center",
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  pointsLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  benefitsContainer: {},
  benefitsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  achievementsContainer: {},
  achievementCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementUnlocked: {
    borderWidth: 2,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  achievementLocked: {
    color: "#9ca3af",
  },
  achievementCategory: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  achievementReward: {
    alignItems: "center",
  },
  achievementPoints: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  gemstonesContainer: {},
  gemstonesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gemstoneCard: {
    width: (width - 48) / 3,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gemstoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gemstoneName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  gemstoneRarity: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  modalRewards: {
    marginBottom: 16,
  },
  rewardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rewardLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  rewardValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  unlockedDate: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
  },
  // Tab container styles
  tabContentContainer: {
    paddingHorizontal: 8,
  },
  // Loyalty system styles
  loyaltyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loyaltyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tierIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  loyaltyInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  loyaltyPoints: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  tierProgress: {
    marginBottom: 16,
  },
  tierBenefits: {},
  rewardsSection: {
    marginTop: 16,
  },
  rewardCard: {
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
  rewardDisabled: {
    opacity: 0.5,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ebf5ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  rewardDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  rewardCost: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
    marginTop: 4,
  },
  // Subscription system styles
  subscriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  subscriptionInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  subscriptionStatus: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  subscriptionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  planBenefits: {
    marginBottom: 16,
  },
  manageButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  manageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Wallet system styles
  walletCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 2,
  },
  balanceBreakdown: {
    marginBottom: 16,
  },
  balanceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  expiringAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  expiringText: {
    fontSize: 12,
    color: "#92400e",
    marginLeft: 8,
    flex: 1,
  },
  topUpButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  topUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionSection: {
    marginTop: 16,
  },
  transactionItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  transactionDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  // Modal styles for rewards
  termsContainer: {
    marginBottom: 16,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  termText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
  redeemButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Settings tab styles
  settingsContainer: {
    flex: 1,
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  settingsCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebf5ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  profileInfoGrid: {
    gap: 12,
  },
  profileInfoItem: {
    marginBottom: 12,
  },
  profileInfoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  profileInfoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  preferenceValue: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "500",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ebf5ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  dangerAction: {
    borderBottomWidth: 0,
  },
  dangerActionIcon: {
    backgroundColor: "#fef2f2",
  },
  dangerActionText: {
    color: "#dc2626",
  },
  // Edit profile modal styles
  editModalContainer: {
    maxHeight: "90%",
    width: "90%",
  },
  editFormContainer: {
    maxHeight: 400,
  },
  editFormSection: {
    marginBottom: 24,
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  editInputGroup: {
    marginBottom: 16,
  },
  editInputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },
  editModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
