export interface WalletTransaction {
  id: string;
  walletId: string;
  type: "credit" | "debit";
  amount: number;
  currency: "TND";
  source: "refund" | "loyalty" | "bonus" | "payment" | "cashback" | "referral";
  description: string;
  bookingId?: string;
  paymentId?: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface CustomerWallet {
  id: string;
  customerId: string;
  totalBalance: number;
  availableBalance: number; // Total minus pending/expired
  loyaltyCredits: number;
  refundableBalance: number;
  currency: "TND";
  transactions: WalletTransaction[];
  lastUpdated: Date;
  createdAt: Date;
  isActive: boolean;
}

export interface WalletPayment {
  walletAmount: number;
  remainingAmount: number;
  paymentMethods: {
    wallet: number;
    card?: number;
    cash?: number;
  };
}

export interface WalletSettings {
  maxBalance: number;
  minTransactionAmount: number;
  loyaltyCreditExpireDays: number;
  refundExpireDays: number;
  allowNegativeBalance: boolean;
  autoTopUpEnabled: boolean;
  autoTopUpThreshold: number;
  autoTopUpAmount: number;
}

// Default wallet settings
export const DEFAULT_WALLET_SETTINGS: WalletSettings = {
  maxBalance: 1000, // 1000 TND max balance
  minTransactionAmount: 1, // 1 TND minimum
  loyaltyCreditExpireDays: 365, // 1 year expiry
  refundExpireDays: 90, // 3 months for refunds
  allowNegativeBalance: false,
  autoTopUpEnabled: false,
  autoTopUpThreshold: 10,
  autoTopUpAmount: 50,
};

export const createWallet = (customerId: string): CustomerWallet => {
  return {
    id: `wallet_${customerId}_${Date.now()}`,
    customerId,
    totalBalance: 0,
    availableBalance: 0,
    loyaltyCredits: 0,
    refundableBalance: 0,
    currency: "TND",
    transactions: [],
    lastUpdated: new Date(),
    createdAt: new Date(),
    isActive: true,
  };
};

export const addFunds = (
  wallet: CustomerWallet,
  amount: number,
  source: WalletTransaction["source"],
  description: string,
  bookingId?: string,
  expiresAt?: Date
): CustomerWallet => {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  const transaction: WalletTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    walletId: wallet.id,
    type: "credit",
    amount,
    currency: "TND",
    source,
    description,
    bookingId,
    createdAt: new Date(),
    expiresAt,
  };

  const updatedWallet = {
    ...wallet,
    totalBalance: wallet.totalBalance + amount,
    availableBalance: wallet.availableBalance + amount,
    transactions: [...wallet.transactions, transaction],
    lastUpdated: new Date(),
  };

  // Update specific balance types
  if (source === "loyalty" || source === "referral") {
    updatedWallet.loyaltyCredits += amount;
  } else if (source === "refund") {
    updatedWallet.refundableBalance += amount;
  }

  return updatedWallet;
};

export const deductFunds = (
  wallet: CustomerWallet,
  amount: number,
  description: string,
  bookingId?: string,
  paymentId?: string
): CustomerWallet => {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  if (
    wallet.availableBalance < amount &&
    !DEFAULT_WALLET_SETTINGS.allowNegativeBalance
  ) {
    throw new Error("Insufficient wallet balance");
  }

  const transaction: WalletTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    walletId: wallet.id,
    type: "debit",
    amount,
    currency: "TND",
    source: "payment",
    description,
    bookingId,
    paymentId,
    createdAt: new Date(),
  };

  // Deduct from different balance types in priority order
  let remainingAmount = amount;
  let newLoyaltyCredits = wallet.loyaltyCredits;
  let newRefundableBalance = wallet.refundableBalance;

  // First use loyalty credits
  if (remainingAmount > 0 && newLoyaltyCredits > 0) {
    const loyaltyUsed = Math.min(remainingAmount, newLoyaltyCredits);
    newLoyaltyCredits -= loyaltyUsed;
    remainingAmount -= loyaltyUsed;
  }

  // Then use refundable balance
  if (remainingAmount > 0 && newRefundableBalance > 0) {
    const refundableUsed = Math.min(remainingAmount, newRefundableBalance);
    newRefundableBalance -= refundableUsed;
    remainingAmount -= refundableUsed;
  }

  return {
    ...wallet,
    totalBalance: wallet.totalBalance - amount,
    availableBalance: wallet.availableBalance - amount,
    loyaltyCredits: newLoyaltyCredits,
    refundableBalance: newRefundableBalance,
    transactions: [...wallet.transactions, transaction],
    lastUpdated: new Date(),
  };
};

export const calculateWalletPayment = (
  totalAmount: number,
  wallet: CustomerWallet
): WalletPayment => {
  const walletAmount = Math.min(totalAmount, wallet.availableBalance);
  const remainingAmount = Math.max(0, totalAmount - walletAmount);

  return {
    walletAmount,
    remainingAmount,
    paymentMethods: {
      wallet: walletAmount,
      ...(remainingAmount > 0 && { card: remainingAmount }),
    },
  };
};

export const processRefund = (
  wallet: CustomerWallet,
  refundAmount: number,
  bookingId: string,
  description: string = "Booking refund"
): CustomerWallet => {
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + DEFAULT_WALLET_SETTINGS.refundExpireDays
  );

  return addFunds(
    wallet,
    refundAmount,
    "refund",
    description,
    bookingId,
    expiresAt
  );
};

export const awardLoyaltyCredits = (
  wallet: CustomerWallet,
  creditAmount: number,
  description: string,
  bookingId?: string
): CustomerWallet => {
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + DEFAULT_WALLET_SETTINGS.loyaltyCreditExpireDays
  );

  return addFunds(
    wallet,
    creditAmount,
    "loyalty",
    description,
    bookingId,
    expiresAt
  );
};

export const getExpiredTransactions = (
  wallet: CustomerWallet
): WalletTransaction[] => {
  const now = new Date();
  return wallet.transactions.filter(
    (txn) => txn.expiresAt && txn.expiresAt < now && txn.type === "credit"
  );
};

export const removeExpiredFunds = (wallet: CustomerWallet): CustomerWallet => {
  const expiredTransactions = getExpiredTransactions(wallet);
  if (expiredTransactions.length === 0) {
    return wallet;
  }

  const expiredAmount = expiredTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  // Create expiry transaction
  const expiryTransaction: WalletTransaction = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    walletId: wallet.id,
    type: "debit",
    amount: expiredAmount,
    currency: "TND",
    source: "payment",
    description: "Expired credits removed",
    createdAt: new Date(),
  };

  // Calculate expired amounts by type
  const expiredLoyalty = expiredTransactions
    .filter((txn) => txn.source === "loyalty" || txn.source === "referral")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const expiredRefundable = expiredTransactions
    .filter((txn) => txn.source === "refund")
    .reduce((sum, txn) => sum + txn.amount, 0);

  return {
    ...wallet,
    totalBalance: wallet.totalBalance - expiredAmount,
    availableBalance: wallet.availableBalance - expiredAmount,
    loyaltyCredits: wallet.loyaltyCredits - expiredLoyalty,
    refundableBalance: wallet.refundableBalance - expiredRefundable,
    transactions: [...wallet.transactions, expiryTransaction],
    lastUpdated: new Date(),
  };
};

export const getWalletSummary = (
  wallet: CustomerWallet
): {
  totalBalance: number;
  availableBalance: number;
  loyaltyCredits: number;
  refundableBalance: number;
  expiringAmount: number;
  expiringDate: Date | null;
  recentTransactions: WalletTransaction[];
} => {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // Find credits expiring in next 30 days
  const expiringTransactions = wallet.transactions.filter(
    (txn) =>
      txn.type === "credit" &&
      txn.expiresAt &&
      txn.expiresAt > now &&
      txn.expiresAt <= thirtyDaysFromNow
  );

  const expiringAmount = expiringTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  const earliestExpiry = expiringTransactions.reduce(
    (earliest, txn) =>
      !earliest || (txn.expiresAt && txn.expiresAt < earliest)
        ? txn.expiresAt!
        : earliest,
    null as Date | null
  );

  // Get recent transactions (last 10)
  const recentTransactions = wallet.transactions
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return {
    totalBalance: wallet.totalBalance,
    availableBalance: wallet.availableBalance,
    loyaltyCredits: wallet.loyaltyCredits,
    refundableBalance: wallet.refundableBalance,
    expiringAmount,
    expiringDate: earliestExpiry,
    recentTransactions,
  };
};

export const formatWalletAmount = (
  amount: number,
  currency: string = "TND"
): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

export const getTransactionIcon = (transaction: WalletTransaction): string => {
  if (transaction.type === "credit") {
    switch (transaction.source) {
      case "refund":
        return "arrow-undo-outline";
      case "loyalty":
        return "star-outline";
      case "bonus":
        return "gift-outline";
      case "cashback":
        return "cash-outline";
      case "referral":
        return "people-outline";
      default:
        return "add-circle-outline";
    }
  } else {
    return "remove-circle-outline";
  }
};

export const getTransactionColor = (transaction: WalletTransaction): string => {
  return transaction.type === "credit" ? "#10B981" : "#EF4444";
};

export const canAffordWithWallet = (
  amount: number,
  wallet: CustomerWallet
): boolean => {
  return wallet.availableBalance >= amount;
};

export const suggestTopUp = (
  wallet: CustomerWallet,
  targetAmount: number
): {
  shouldTopUp: boolean;
  suggestedAmount: number;
  reason: string;
} => {
  const shortfall = targetAmount - wallet.availableBalance;

  if (shortfall <= 0) {
    return {
      shouldTopUp: false,
      suggestedAmount: 0,
      reason: "Sufficient wallet balance",
    };
  }

  // Round up to nearest 10 TND for convenience
  const suggestedAmount = Math.ceil(shortfall / 10) * 10;

  return {
    shouldTopUp: true,
    suggestedAmount,
    reason: `Add ${formatWalletAmount(
      suggestedAmount
    )} to complete this payment`,
  };
};
