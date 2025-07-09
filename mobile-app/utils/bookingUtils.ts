import {
  isWeekend,
  isBefore,
  addHours,
  differenceInHours,
  format,
} from "date-fns";

export interface BookingFee {
  amount: number;
  type: "reservation" | "deductible";
  isRefundable: boolean;
  description: string;
}

export interface SpecialDay {
  date: string; // YYYY-MM-DD format
  name: string;
  requiresPayment: boolean;
  feeAmount?: number;
}

export interface BusinessSettings {
  allowFreeWeekendBookings: boolean;
  acceptWalkInsOnly: boolean;
  refundBookingFeesOnCancellation: boolean;
  weekendFeeAmount: number;
  specialDayFeeAmount: number;
  cancellationPolicyHours: number;
  feeType: "reservation" | "deductible";
}

// Default special days (can be configured by business)
export const DEFAULT_SPECIAL_DAYS: SpecialDay[] = [
  {
    date: "2025-01-01",
    name: "New Year's Day",
    requiresPayment: true,
    feeAmount: 30,
  },
  {
    date: "2025-03-20",
    name: "Independence Day",
    requiresPayment: true,
    feeAmount: 30,
  },
  {
    date: "2025-04-09",
    name: "Martyrs' Day",
    requiresPayment: true,
    feeAmount: 30,
  },
  {
    date: "2025-05-01",
    name: "Labour Day",
    requiresPayment: true,
    feeAmount: 30,
  },
  {
    date: "2025-07-25",
    name: "Republic Day",
    requiresPayment: true,
    feeAmount: 30,
  },
  // Add more special days as needed
];

export const isSpecialDay = (
  date: Date,
  specialDays: SpecialDay[] = DEFAULT_SPECIAL_DAYS
): SpecialDay | null => {
  const dateString = format(date, "yyyy-MM-dd");
  return specialDays.find((day) => day.date === dateString) || null;
};

export const requiresPayment = (
  date: Date,
  businessSettings: BusinessSettings,
  specialDays: SpecialDay[] = DEFAULT_SPECIAL_DAYS
): { required: boolean; reason: string; amount: number } => {
  // Check if it's a special day
  const specialDay = isSpecialDay(date, specialDays);
  if (specialDay && specialDay.requiresPayment) {
    return {
      required: true,
      reason: `Special day: ${specialDay.name}`,
      amount: specialDay.feeAmount || businessSettings.specialDayFeeAmount,
    };
  }

  // Check if it's a weekend and business doesn't allow free weekend bookings
  if (isWeekend(date) && !businessSettings.allowFreeWeekendBookings) {
    return {
      required: true,
      reason: "Weekend booking",
      amount: businessSettings.weekendFeeAmount,
    };
  }

  return {
    required: false,
    reason: "",
    amount: 0,
  };
};

export const calculateBookingFee = (
  date: Date,
  businessSettings: BusinessSettings,
  specialDays: SpecialDay[] = DEFAULT_SPECIAL_DAYS
): BookingFee | null => {
  const paymentInfo = requiresPayment(date, businessSettings, specialDays);

  if (!paymentInfo.required) {
    return null;
  }

  return {
    amount: paymentInfo.amount,
    type: businessSettings.feeType,
    isRefundable: businessSettings.refundBookingFeesOnCancellation,
    description: paymentInfo.reason,
  };
};

export const canCancelWithoutPenalty = (
  bookingDateTime: Date,
  cancellationPolicyHours: number = 2
): boolean => {
  const now = new Date();
  const hoursUntilBooking = differenceInHours(bookingDateTime, now);
  return hoursUntilBooking >= cancellationPolicyHours;
};

export const getCancellationPolicy = (
  bookingDateTime: Date,
  bookingFee: BookingFee | null,
  cancellationPolicyHours: number = 2
): {
  canCancel: boolean;
  willLoseFee: boolean;
  message: string;
} => {
  const canCancelFree = canCancelWithoutPenalty(
    bookingDateTime,
    cancellationPolicyHours
  );

  if (!bookingFee) {
    return {
      canCancel: true,
      willLoseFee: false,
      message: canCancelFree
        ? "You can cancel this booking without any penalty."
        : `Cancellation less than ${cancellationPolicyHours} hours before the appointment may result in restrictions.`,
    };
  }

  if (canCancelFree) {
    return {
      canCancel: true,
      willLoseFee: false,
      message: bookingFee.isRefundable
        ? "You can cancel this booking and receive a full refund."
        : "You can cancel this booking, but the reservation fee is non-refundable.",
    };
  }

  return {
    canCancel: true,
    willLoseFee: true,
    message: `Cancelling less than ${cancellationPolicyHours} hours before your appointment will result in losing your ${bookingFee.amount} TND ${bookingFee.type} fee.`,
  };
};

export const formatBookingDateTime = (date: Date, time: string): Date => {
  const [timeStr, period] = time.split(" ");
  const [hours, minutes] = timeStr.split(":").map(Number);

  let hour24 = hours;
  if (period === "PM" && hours !== 12) {
    hour24 += 12;
  } else if (period === "AM" && hours === 12) {
    hour24 = 0;
  }

  const bookingDate = new Date(date);
  bookingDate.setHours(hour24, minutes, 0, 0);

  return bookingDate;
};

export const getCustomerReliabilityScore = (
  totalBookings: number,
  noShowCount: number,
  cancellationCount: number
): {
  score: number;
  rating: "Excellent" | "Good" | "Fair" | "Poor";
  description: string;
} => {
  if (totalBookings === 0) {
    return {
      score: 100,
      rating: "Excellent",
      description: "New customer",
    };
  }

  const noShowRate = (noShowCount / totalBookings) * 100;
  const cancellationRate = (cancellationCount / totalBookings) * 100;
  const reliabilityScore = Math.max(0, 100 - noShowRate * 2 - cancellationRate);

  let rating: "Excellent" | "Good" | "Fair" | "Poor";
  let description: string;

  if (reliabilityScore >= 90) {
    rating = "Excellent";
    description = "Highly reliable customer";
  } else if (reliabilityScore >= 75) {
    rating = "Good";
    description = "Reliable customer";
  } else if (reliabilityScore >= 60) {
    rating = "Fair";
    description = "Moderately reliable";
  } else {
    rating = "Poor";
    description = "Unreliable customer";
  }

  return {
    score: Math.round(reliabilityScore),
    rating,
    description,
  };
};
