import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import {
  PAYMENT_PROVIDERS,
  createPaymentUrl,
  validatePaymentResponse,
  formatAmount,
  PaymentProvider,
  PaymentRequest,
  PaymentResult,
} from "../../utils/paymentUtils";
import {
  CustomerWallet,
  calculateWalletPayment,
  formatWalletAmount,
  canAffordWithWallet,
  suggestTopUp,
} from "../../utils/walletSystem";

type Props = NativeStackScreenProps<RootStackParamList, "Payment">;

interface PaymentScreenProps {
  bookingId: string;
  amount: number;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess: (result: PaymentResult) => void;
  onPaymentCancel: () => void;
}

// Mock wallet data
const mockWallet: CustomerWallet = {
  id: "wallet_001",
  customerId: "customer_001",
  totalBalance: 45.5,
  availableBalance: 45.5,
  loyaltyCredits: 15.0,
  refundableBalance: 30.5,
  currency: "TND",
  transactions: [],
  lastUpdated: new Date(),
  createdAt: new Date(),
  isActive: true,
};

const PaymentScreen = ({ navigation, route }: Props) => {
  const { bookingId, amount, description, customerEmail, customerPhone } =
    route.params as PaymentScreenProps;
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider | null>(null);
  const [showWebView, setShowWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  const [customerWallet] = useState<CustomerWallet>(mockWallet);
  const webViewRef = useRef<WebView>(null);

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    initiatePayment(provider);
  };

  const handleWalletPayment = () => {
    const walletPayment = calculateWalletPayment(amount, customerWallet);

    if (walletPayment.remainingAmount > 0) {
      // Partial wallet payment - need additional payment method
      Alert.alert(
        "Partial Payment",
        `Your wallet will cover ${formatWalletAmount(
          walletPayment.walletAmount
        )} of the total. You'll need to pay the remaining ${formatWalletAmount(
          walletPayment.remainingAmount
        )} with another method.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              setUseWallet(true);
              // Show payment providers for remaining amount
            },
          },
        ]
      );
    } else {
      // Full wallet payment
      Alert.alert(
        "Confirm Payment",
        `Pay ${formatWalletAmount(amount)} from your wallet?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Pay Now",
            onPress: () => {
              setIsLoading(true);
              // Simulate wallet payment processing
              setTimeout(() => {
                setIsLoading(false);
                const result: PaymentResult = {
                  success: true,
                  transactionId: `wallet_${Date.now()}`,
                  paymentMethod: "wallet",
                };
                route.params.onPaymentSuccess(result);
                navigation.goBack();
              }, 1500);
            },
          },
        ]
      );
    }
  };

  const initiatePayment = (provider: PaymentProvider) => {
    setIsLoading(true);

    const paymentRequest: PaymentRequest = {
      amount,
      currency: "TND",
      description,
      bookingId,
      customerEmail,
      customerPhone,
      returnUrl: `reservili://payment/success?provider=${provider.id}`,
      cancelUrl: `reservili://payment/cancel?provider=${provider.id}`,
    };

    try {
      const url = createPaymentUrl(provider.id, paymentRequest);
      setPaymentUrl(url);
      setShowWebView(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
    }
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    const { url } = navState;

    if (url.includes("payment/success")) {
      handlePaymentSuccess(url);
    } else if (url.includes("payment/cancel")) {
      handlePaymentCancel();
    }
  };

  const handlePaymentSuccess = (url: string) => {
    setShowWebView(false);
    setIsLoading(true);

    // Extract payment data from URL parameters
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const responseData = Object.fromEntries(urlParams.entries());

    const result = validatePaymentResponse(selectedProvider!.id, responseData);

    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        "Payment Successful",
        `Your payment of ${formatAmount(
          amount
        )} has been processed successfully.`,
        [
          {
            text: "Continue",
            onPress: () => {
              route.params.onPaymentSuccess(result);
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Payment Failed",
        result.error || "Payment could not be processed. Please try again.",
        [
          {
            text: "Try Again",
            onPress: () => setSelectedProvider(null),
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const handlePaymentCancel = () => {
    setShowWebView(false);
    Alert.alert(
      "Payment Cancelled",
      "Your payment was cancelled. You can try again or choose a different payment method.",
      [
        {
          text: "Try Again",
          onPress: () => setSelectedProvider(null),
        },
        {
          text: "Cancel Booking",
          style: "cancel",
          onPress: () => {
            route.params.onPaymentCancel();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderProviderSelection = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>Complete Your Payment</Text>
          <Text style={styles.paymentDescription}>{description}</Text>
          <Text style={styles.paymentAmount}>{formatAmount(amount)}</Text>
        </View>

        <View style={styles.providersSection}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>

          {/* Wallet Payment Option */}
          {customerWallet.availableBalance > 0 && (
            <TouchableOpacity
              style={[
                styles.providerCard,
                styles.walletCard,
                !canAffordWithWallet(amount, customerWallet) &&
                  styles.partialWalletCard,
              ]}
              onPress={handleWalletPayment}
              disabled={isLoading}
            >
              <View style={styles.providerInfo}>
                <View style={[styles.providerIcon, styles.walletIcon]}>
                  <Ionicons name="wallet" size={24} color="#fff" />
                </View>
                <View style={styles.providerDetails}>
                  <Text style={styles.providerName}>My Wallet</Text>
                  <Text style={styles.walletBalance}>
                    Balance:{" "}
                    {formatWalletAmount(customerWallet.availableBalance)}
                  </Text>
                  {!canAffordWithWallet(amount, customerWallet) && (
                    <Text style={styles.partialPaymentText}>
                      Covers{" "}
                      {formatWalletAmount(
                        calculateWalletPayment(amount, customerWallet)
                          .walletAmount
                      )}{" "}
                      of {formatWalletAmount(amount)}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.walletPaymentInfo}>
                {canAffordWithWallet(amount, customerWallet) ? (
                  <View style={styles.fullPaymentBadge}>
                    <Text style={styles.fullPaymentText}>Full Payment</Text>
                  </View>
                ) : (
                  <View style={styles.partialPaymentBadge}>
                    <Text style={styles.partialPaymentBadgeText}>Partial</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Traditional Payment Providers */}
          {PAYMENT_PROVIDERS.filter((p) => p.isAvailable).map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={styles.providerCard}
              onPress={() => handleProviderSelect(provider)}
              disabled={isLoading}
            >
              <View style={styles.providerInfo}>
                <View style={styles.providerIcon}>
                  <Text style={styles.providerIconText}>
                    {provider.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.providerDetails}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerDescription}>
                    Secure payment gateway
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.securityInfo}>
          <View style={styles.securityIcon}>
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
          </View>
          <Text style={styles.securityText}>
            Your payment is secured with industry-standard encryption
          </Text>
        </View>
      </View>
    </View>
  );

  const renderWebView = () => (
    <Modal
      visible={showWebView}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.webViewContainer}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowWebView(false)}
          >
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>
            {selectedProvider?.name} Payment
          </Text>
          <View style={styles.placeholder} />
        </View>

        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading payment page...</Text>
            </View>
          )}
          onError={() => {
            Alert.alert(
              "Error",
              "Failed to load payment page. Please check your internet connection and try again."
            );
            setShowWebView(false);
          }}
        />
      </SafeAreaView>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Processing payment...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderProviderSelection()}
      {renderWebView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  placeholder: {
    width: 28,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  paymentInfo: {
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  paymentDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 12,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  providersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  providerIconText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  providerDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    marginTop: "auto",
  },
  securityIcon: {
    marginRight: 8,
  },
  securityText: {
    fontSize: 14,
    color: "#059669",
    textAlign: "center",
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webViewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  closeButton: {
    padding: 4,
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  // Wallet payment styles
  walletCard: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  partialWalletCard: {
    borderColor: "#f59e0b",
    backgroundColor: "#fffbeb",
  },
  walletIcon: {
    backgroundColor: "#10b981",
  },
  walletBalance: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "600",
  },
  partialPaymentText: {
    fontSize: 12,
    color: "#92400e",
    marginTop: 2,
  },
  walletPaymentInfo: {
    alignItems: "center",
  },
  fullPaymentBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullPaymentText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  partialPaymentBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partialPaymentBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default PaymentScreen;
