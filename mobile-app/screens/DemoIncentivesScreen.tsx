import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DemoIncentivesScreen = ({ navigation }: any) => {
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralCode, setReferralCode] = useState("COFFEE2024");

  const customerIncentives = [
    {
      id: "welcome_bonus",
      title: "Welcome Bonus",
      description: "50 TND credit for your first 3 bookings",
      icon: "gift",
      color: "#10b981",
      value: "50 TND",
      action: "Claim Now",
    },
    {
      id: "referral_program",
      title: "Refer & Earn",
      description: "Get 20 TND for each friend you refer",
      icon: "people",
      color: "#3b82f6",
      value: "20 TND each",
      action: "Share Code",
    },
    {
      id: "loyalty_multiplier",
      title: "2x Loyalty Points",
      description: "Earn double points for the first month",
      icon: "star",
      color: "#f59e0b",
      value: "2x Points",
      action: "Activate",
    },
    {
      id: "premium_trial",
      title: "Premium Features Free",
      description: "Advanced booking features for 30 days",
      icon: "diamond",
      color: "#8b5cf6",
      value: "30 Days",
      action: "Try Now",
    },
  ];

  const businessIncentives = [
    {
      id: "zero_commission",
      title: "0% Commission",
      description: "No booking fees for the first 3 months",
      icon: "trending-up",
      color: "#10b981",
      value: "3 Months",
      savings: "Save up to 500 TND",
    },
    {
      id: "free_advertising",
      title: "Free Premium Advertising",
      description: "200 TND advertising credit to boost visibility",
      icon: "megaphone",
      color: "#f59e0b",
      value: "200 TND",
      savings: "100% Free",
    },
    {
      id: "setup_assistance",
      title: "Free Setup & Training",
      description: "Personal onboarding and staff training",
      icon: "school",
      color: "#3b82f6",
      value: "Personal",
      savings: "Worth 300 TND",
    },
    {
      id: "analytics_premium",
      title: "Advanced Analytics",
      description: "Customer insights and performance tracking",
      icon: "analytics",
      color: "#8b5cf6",
      value: "Premium",
      savings: "Free for 6 months",
    },
  ];

  const handleReferralShare = async () => {
    try {
      await Share.share({
        message: `Join Reservili and get 50 TND credit! Use my code: ${referralCode}\n\nDownload: https://reservili.app`,
        title: "Join Reservili - Get 50 TND Credit!",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleIncentiveAction = (incentive: any) => {
    switch (incentive.id) {
      case "referral_program":
        setShowReferralModal(true);
        break;
      case "welcome_bonus":
        Alert.alert(
          "Welcome Bonus Activated!",
          "You'll receive 50 TND credit after your first booking. Valid for 30 days!",
          [{ text: "Great!" }]
        );
        break;
      default:
        Alert.alert(
          "Feature Coming Soon!",
          `${incentive.title} will be available when we launch. You're on the early access list!`,
          [{ text: "Thanks!" }]
        );
    }
  };

  const ReferralModal = () => (
    <Modal
      visible={showReferralModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowReferralModal(false)}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Refer Friends</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.modalContent}>
          <View style={styles.referralCard}>
            <View style={styles.referralIcon}>
              <Ionicons name="gift" size={32} color="#10b981" />
            </View>
            <Text style={styles.referralTitle}>Share & Earn Together</Text>
            <Text style={styles.referralDescription}>
              You get 20 TND, they get 50 TND. Win-win!
            </Text>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  Alert.alert("Copied!", "Referral code copied to clipboard");
                }}
              >
                <Ionicons name="copy" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleReferralShare}
          >
            <Ionicons name="share" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Share with Friends</Text>
          </TouchableOpacity>

          <View style={styles.howItWorks}>
            <Text style={styles.howItWorksTitle}>How it works:</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>
                  Share your code with friends
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>
                  They sign up and make first booking
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>You both earn credits!</Text>
              </View>
            </View>
          </View>
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
        <Text style={styles.headerTitle}>Early Access Rewards</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="rocket" size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>You're Early!</Text>
          <Text style={styles.heroSubtitle}>
            Get exclusive rewards for being one of our first users
          </Text>
        </View>

        {/* Customer Incentives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Rewards</Text>
          <Text style={styles.sectionSubtitle}>
            Special benefits for early customers
          </Text>

          {customerIncentives.map((incentive) => (
            <TouchableOpacity
              key={incentive.id}
              style={styles.incentiveCard}
              onPress={() => handleIncentiveAction(incentive)}
            >
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
              </View>

              <View style={styles.incentiveValue}>
                <Text style={styles.valueText}>{incentive.value}</Text>
                <Text style={styles.actionText}>{incentive.action}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Business Incentives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Partner Benefits</Text>
          <Text style={styles.sectionSubtitle}>
            Launch incentives for early business partners
          </Text>

          {businessIncentives.map((incentive) => (
            <View key={incentive.id} style={styles.businessCard}>
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

              <View style={styles.businessContent}>
                <Text style={styles.incentiveTitle}>{incentive.title}</Text>
                <Text style={styles.incentiveDescription}>
                  {incentive.description}
                </Text>
                <Text style={styles.savingsText}>{incentive.savings}</Text>
              </View>

              <View style={styles.businessValue}>
                <Text style={styles.valueText}>{incentive.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaSubtitle}>
            Join now and lock in these exclusive benefits
          </Text>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Join the Beta</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ReferralModal />
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
  heroSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#3b82f6",
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e0e7ff",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  incentiveCard: {
    flexDirection: "row",
    alignItems: "center",
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
  businessCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  incentiveIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  incentiveContent: {
    flex: 1,
  },
  businessContent: {
    flex: 1,
    marginRight: 12,
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
    lineHeight: 20,
  },
  savingsText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
    marginTop: 4,
  },
  incentiveValue: {
    alignItems: "flex-end",
  },
  businessValue: {
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#6b7280",
  },
  ctaSection: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
    marginTop: 16,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
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
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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
  referralCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    marginBottom: 24,
  },
  referralIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ecfdf5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  referralTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  referralDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  codeContainer: {
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    fontFamily: "monospace",
  },
  copyButton: {
    padding: 8,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  howItWorks: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  stepContainer: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
});

export default DemoIncentivesScreen;
