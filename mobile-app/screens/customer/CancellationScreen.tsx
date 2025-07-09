import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import {
  getCancellationPolicy,
  formatBookingDateTime,
  BookingFee,
} from "../../utils/bookingUtils";
import { formatAmount } from "../../utils/paymentUtils";

type Props = NativeStackScreenProps<RootStackParamList, "Cancellation">;

const CancellationScreen = ({ navigation, route }: Props) => {
  const { bookingId, businessName, service, date, time, bookingFee } =
    route.params;
  const [isProcessing, setIsProcessing] = useState(false);

  // Create a proper Date object from the date and time strings
  const bookingDateTime = new Date(`${date} ${time}`);

  const cancellationPolicy = getCancellationPolicy(bookingDateTime, bookingFee);

  const handleCancelBooking = () => {
    if (cancellationPolicy.willLoseFee) {
      Alert.alert(
        "Confirm Cancellation",
        `Are you sure you want to cancel this booking?\n\n${cancellationPolicy.message}`,
        [
          {
            text: "Keep Booking",
            style: "cancel",
          },
          {
            text: "Cancel Booking",
            style: "destructive",
            onPress: () => processCancellation(),
          },
        ]
      );
    } else {
      Alert.alert(
        "Confirm Cancellation",
        "Are you sure you want to cancel this booking?",
        [
          {
            text: "Keep Booking",
            style: "cancel",
          },
          {
            text: "Cancel Booking",
            style: "destructive",
            onPress: () => processCancellation(),
          },
        ]
      );
    }
  };

  const processCancellation = () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, you would call an API to cancel the booking

      Alert.alert(
        "Booking Cancelled",
        cancellationPolicy.willLoseFee
          ? `Your booking has been cancelled. The ${formatAmount(
              bookingFee!.amount
            )} ${bookingFee!.type} fee has been forfeited.`
          : "Your booking has been cancelled successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  const formatTimeUntilBooking = () => {
    try {
      const now = new Date();
      const diffMs = bookingDateTime.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes}m`;
      } else {
        return "Now";
      }
    } catch (error) {
      return "Unknown";
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
        <Text style={styles.headerTitle}>Cancel Booking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.bookingInfo}>
          <View style={styles.bookingHeader}>
            <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
            <Text style={styles.bookingTitle}>Booking Details</Text>
          </View>

          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{bookingId}</Text>
          </View>

          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Business</Text>
            <Text style={styles.detailValue}>{businessName}</Text>
          </View>

          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{service}</Text>
          </View>

          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {date} at {time}
            </Text>
          </View>

          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Time Until Booking</Text>
            <Text style={styles.detailValue}>{formatTimeUntilBooking()}</Text>
          </View>
        </View>

        {bookingFee && (
          <View style={styles.feeInfo}>
            <View style={styles.feeHeader}>
              <Ionicons name="card-outline" size={24} color="#dc2626" />
              <Text style={styles.feeTitle}>Payment Information</Text>
            </View>

            <View style={styles.feeDetail}>
              <Text style={styles.detailLabel}>Booking Fee</Text>
              <Text style={styles.feeAmount}>
                {formatAmount(bookingFee.amount)} ({bookingFee.type})
              </Text>
            </View>

            <View style={styles.feeDetail}>
              <Text style={styles.detailLabel}>Fee Type</Text>
              <Text style={styles.detailValue}>{bookingFee.description}</Text>
            </View>
          </View>
        )}

        <View
          style={[
            styles.policyInfo,
            cancellationPolicy.willLoseFee
              ? styles.warningPolicy
              : styles.successPolicy,
          ]}
        >
          <View style={styles.policyHeader}>
            <Ionicons
              name={
                cancellationPolicy.willLoseFee
                  ? "warning-outline"
                  : "checkmark-circle-outline"
              }
              size={24}
              color={cancellationPolicy.willLoseFee ? "#dc2626" : "#059669"}
            />
            <Text
              style={[
                styles.policyTitle,
                cancellationPolicy.willLoseFee
                  ? styles.warningText
                  : styles.successText,
              ]}
            >
              Cancellation Policy
            </Text>
          </View>

          <Text
            style={[
              styles.policyMessage,
              cancellationPolicy.willLoseFee
                ? styles.warningText
                : styles.successText,
            ]}
          >
            {cancellationPolicy.message}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.keepButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.keepButtonText}>Keep Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, isProcessing && styles.disabledButton]}
          onPress={handleCancelBooking}
          disabled={isProcessing}
        >
          <Text style={styles.cancelButtonText}>
            {isProcessing ? "Processing..." : "Cancel Booking"}
          </Text>
        </TouchableOpacity>
      </View>
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
  bookingInfo: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  bookingDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    flex: 2,
    textAlign: "right",
  },
  feeInfo: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  feeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#dc2626",
    marginLeft: 8,
  },
  feeDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  feeAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
    flex: 2,
    textAlign: "right",
  },
  policyInfo: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningPolicy: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  successPolicy: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  policyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  policyMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  warningText: {
    color: "#dc2626",
  },
  successText: {
    color: "#059669",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  keepButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  keepButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default CancellationScreen;
