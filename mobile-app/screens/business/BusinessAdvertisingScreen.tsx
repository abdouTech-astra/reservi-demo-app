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
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessAdvertising">;

interface AdPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
  popular?: boolean;
}

interface ActiveCampaign {
  id: string;
  name: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "ended";
  impressions: number;
  clicks: number;
  bookings: number;
  spent: number;
}

// Mock data for advertising plans
const adPlans: AdPlan[] = [
  {
    id: "basic",
    name: "Basic Promotion",
    price: 50,
    duration: "7 days",
    features: [
      "Appear in sponsored section",
      "Basic promotion badge",
      "Category-specific targeting",
      "Email support",
    ],
  },
  {
    id: "featured",
    name: "Featured Business",
    price: 120,
    duration: "14 days",
    features: [
      "Premium sponsored placement",
      "Featured badge",
      "All categories visibility",
      "Priority support",
      "Performance analytics",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium Campaign",
    price: 200,
    duration: "30 days",
    features: [
      "Top sponsored placement",
      "Premium badge + offer highlight",
      "Cross-category visibility",
      "24/7 priority support",
      "Advanced analytics",
      "Custom promotional offers",
    ],
    popular: true,
  },
];

// Mock active campaigns
const activeCampaigns: ActiveCampaign[] = [
  {
    id: "camp1",
    name: "Holiday Special",
    plan: "Featured Business",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    status: "active",
    impressions: 2450,
    clicks: 187,
    bookings: 23,
    spent: 120,
  },
];

const BusinessAdvertisingScreen = ({ navigation }: Props) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AdPlan | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [promotionalOffer, setPromotionalOffer] = useState("");
  const [targetCategory, setTargetCategory] = useState("all");
  const [autoRenew, setAutoRenew] = useState(false);

  const handlePurchasePlan = (plan: AdPlan) => {
    setSelectedPlan(plan);
    setShowPurchaseModal(true);
  };

  const handleCampaignPause = (campaignId: string) => {
    Alert.alert(
      "Pause Campaign",
      "Are you sure you want to pause this campaign?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Pause", onPress: () => console.log("Campaign paused") },
      ]
    );
  };

  const handlePurchase = () => {
    if (!campaignName.trim()) {
      Alert.alert("Error", "Please enter a campaign name");
      return;
    }

    Alert.alert(
      "Confirm Purchase",
      `Purchase ${selectedPlan?.name} for ${selectedPlan?.price} TND?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Purchase",
          onPress: () => {
            setShowPurchaseModal(false);
            Alert.alert(
              "Success",
              "Your advertising campaign has been activated!"
            );
            // Reset form
            setCampaignName("");
            setPromotionalOffer("");
            setTargetCategory("all");
            setAutoRenew(false);
          },
        },
      ]
    );
  };

  const renderPlanCard = (plan: AdPlan) => (
    <View
      key={plan.id}
      style={[
        styles.planCard,
        plan.recommended && styles.recommendedCard,
        plan.popular && styles.popularCard,
      ]}
    >
      {plan.recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.badgeText}>Recommended</Text>
        </View>
      )}
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.badgeText}>Most Popular</Text>
        </View>
      )}

      <Text style={styles.planName}>{plan.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{plan.price} TND</Text>
        <Text style={styles.duration}>for {plan.duration}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.purchaseButton,
          plan.recommended && styles.recommendedButton,
          plan.popular && styles.popularButton,
        ]}
        onPress={() => handlePurchasePlan(plan)}
      >
        <Text
          style={[
            styles.purchaseButtonText,
            (plan.recommended || plan.popular) &&
              styles.whitePurchaseButtonText,
          ]}
        >
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCampaignCard = (campaign: ActiveCampaign) => (
    <View key={campaign.id} style={styles.campaignCard}>
      <View style={styles.campaignHeader}>
        <View>
          <Text style={styles.campaignName}>{campaign.name}</Text>
          <Text style={styles.campaignPlan}>{campaign.plan}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            campaign.status === "active" && styles.activeBadge,
            campaign.status === "paused" && styles.pausedBadge,
            campaign.status === "ended" && styles.endedBadge,
          ]}
        >
          <Text style={styles.statusText}>{campaign.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.campaignDates}>
        <Text style={styles.dateText}>
          {campaign.startDate} - {campaign.endDate}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {campaign.impressions.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Impressions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{campaign.clicks}</Text>
          <Text style={styles.statLabel}>Clicks</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{campaign.bookings}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{campaign.spent} TND</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
      </View>

      <View style={styles.campaignActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCampaignPause(campaign.id)}
        >
          <Ionicons
            name={campaign.status === "active" ? "pause" : "play"}
            size={16}
            color="#6b7280"
          />
          <Text style={styles.actionText}>
            {campaign.status === "active" ? "Pause" : "Resume"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bar-chart" size={16} color="#6b7280" />
          <Text style={styles.actionText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const PurchaseModal = () => (
    <Modal
      visible={showPurchaseModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowPurchaseModal(false)}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Setup Campaign</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.selectedPlanInfo}>
            <Text style={styles.selectedPlanName}>{selectedPlan?.name}</Text>
            <Text style={styles.selectedPlanPrice}>
              {selectedPlan?.price} TND for {selectedPlan?.duration}
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Campaign Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter campaign name"
              value={campaignName}
              onChangeText={setCampaignName}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Promotional Offer (Optional)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., 20% off first visit"
              value={promotionalOffer}
              onChangeText={setPromotionalOffer}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Target Category</Text>
            <View style={styles.categoryOptions}>
              {["all", "restaurant", "cafe", "barber", "beauty", "spa"].map(
                (category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      targetCategory === category && styles.selectedCategory,
                    ]}
                    onPress={() => setTargetCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        targetCategory === category &&
                          styles.selectedCategoryText,
                      ]}
                    >
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.switchRow}>
              <Text style={styles.formLabel}>Auto-renew campaign</Text>
              <Switch
                value={autoRenew}
                onValueChange={setAutoRenew}
                trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
                thumbColor={autoRenew ? "#3b82f6" : "#f3f4f6"}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.purchaseModalButton}
            onPress={handlePurchase}
          >
            <Text style={styles.purchaseModalButtonText}>
              Purchase for {selectedPlan?.price} TND
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advertising</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Active Campaigns Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Campaigns</Text>
          {activeCampaigns.length > 0 ? (
            activeCampaigns.map(renderCampaignCard)
          ) : (
            <View style={styles.emptyCampaigns}>
              <Ionicons name="megaphone-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No active campaigns</Text>
              <Text style={styles.emptySubtext}>
                Start promoting your business today!
              </Text>
            </View>
          )}
        </View>

        {/* Advertising Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advertising Plans</Text>
          <Text style={styles.sectionSubtitle}>
            Boost your visibility and attract more customers
          </Text>

          <View style={styles.plansContainer}>
            {adPlans.map(renderPlanCard)}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Advertise with Us?</Text>

          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name="eye" size={24} color="#3b82f6" />
              <Text style={styles.benefitTitle}>Increased Visibility</Text>
              <Text style={styles.benefitText}>
                Appear at the top of category searches
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="people" size={24} color="#10b981" />
              <Text style={styles.benefitTitle}>More Customers</Text>
              <Text style={styles.benefitText}>
                Reach customers actively looking for your services
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="trending-up" size={24} color="#f59e0b" />
              <Text style={styles.benefitTitle}>Track Performance</Text>
              <Text style={styles.benefitText}>
                Monitor clicks, impressions, and bookings
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <PurchaseModal />
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
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  emptyCampaigns: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  campaignCard: {
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
  campaignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  campaignPlan: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "#dcfce7",
  },
  pausedBadge: {
    backgroundColor: "#fef3c7",
  },
  endedBadge: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  campaignDates: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  campaignActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  recommendedCard: {
    borderColor: "#3b82f6",
  },
  popularCard: {
    borderColor: "#f59e0b",
  },
  recommendedBadge: {
    position: "absolute",
    top: -8,
    left: 20,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    left: 20,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    marginTop: 8,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  duration: {
    fontSize: 14,
    color: "#6b7280",
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
  },
  purchaseButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  recommendedButton: {
    backgroundColor: "#3b82f6",
  },
  popularButton: {
    backgroundColor: "#f59e0b",
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  whitePurchaseButtonText: {
    color: "#fff",
  },
  benefitsContainer: {
    gap: 16,
  },
  benefitItem: {
    alignItems: "center",
    paddingVertical: 16,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  selectedPlanInfo: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedPlanName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  selectedPlanPrice: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  selectedCategory: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryOptionText: {
    fontSize: 14,
    color: "#6b7280",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  purchaseModalButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  purchaseModalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default BusinessAdvertisingScreen;
