export interface PaymentProvider {
  id: "paymee" | "flouci";
  name: string;
  logo: string;
  isAvailable: boolean;
}

export interface PaymentRequest {
  amount: number;
  currency: "TND";
  description: string;
  bookingId: string;
  customerEmail?: string;
  customerPhone?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  paymentMethod?: string;
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: "paymee",
    name: "Paymee",
    logo: "https://paymee.tn/assets/images/logo.png",
    isAvailable: true,
  },
  {
    id: "flouci",
    name: "Flouci",
    logo: "https://flouci.com/assets/images/logo.png",
    isAvailable: true,
  },
];

export const createPaymentUrl = (
  provider: PaymentProvider["id"],
  request: PaymentRequest
): string => {
  const baseUrls = {
    paymee: "https://sandbox.paymee.tn/gateway",
    flouci: "https://developers.flouci.com/api/generate_payment",
  };

  const params = new URLSearchParams({
    amount: request.amount.toString(),
    currency: request.currency,
    description: request.description,
    booking_id: request.bookingId,
    return_url: request.returnUrl,
    cancel_url: request.cancelUrl,
    ...(request.customerEmail && { customer_email: request.customerEmail }),
    ...(request.customerPhone && { customer_phone: request.customerPhone }),
  });

  return `${baseUrls[provider]}?${params.toString()}`;
};

export const validatePaymentResponse = (
  provider: PaymentProvider["id"],
  responseData: any
): PaymentResult => {
  try {
    switch (provider) {
      case "paymee":
        return {
          success: responseData.status === "success",
          transactionId: responseData.transaction_id,
          error: responseData.error_message,
          paymentMethod: "paymee",
        };
      case "flouci":
        return {
          success: responseData.result?.status === "SUCCESS",
          transactionId: responseData.result?.payment_id,
          error: responseData.result?.error_description,
          paymentMethod: "flouci",
        };
      default:
        return {
          success: false,
          error: "Unknown payment provider",
        };
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to validate payment response",
    };
  }
};

export const formatAmount = (
  amount: number,
  currency: string = "TND"
): string => {
  return `${amount.toFixed(2)} ${currency}`;
};
