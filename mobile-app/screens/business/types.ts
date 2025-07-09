import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

export type BusinessScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BusinessDashboard"
>;

export interface Booking {
  id: string;
  customerName: string;
  service: string;
  time: string;
  duration: string;
  status: "confirmed" | "checked-in" | "completed" | "no-show" | "cancelled";
  price: string;
  tableNumber?: string;
  chairNumber?: string;
  customerPhone?: string;
  note?: string;
  dispute?: boolean;
  disputeReason?: string;
  disputeProof?: string;
}

export interface Customer {
  id: string;
  name: string;
  lastVisit: string;
  totalVisits: number;
  rating: number;
  noShowCount: number;
  points: number;
  totalSpent: number;
  phone?: string;
  email?: string;
  preferredServices?: string[];
}

export interface TimeSlot {
  id: string;
  time: string;
  capacity: number;
  booked: number;
  isAvailable: boolean;
}

export interface WorkingHours {
  day: string;
  open: boolean;
  openTime: string;
  closeTime: string;
  slots: TimeSlot[];
}

export interface BusinessPlan {
  name: string;
  price: string;
  currentPlan: boolean;
  features: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  sent: boolean;
  recipients: number;
  date: string;
  scheduled?: boolean;
  recurring?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  category: string;
  image?: string;
}

export interface AppState {
  language: "English" | "Arabic" | "French";
  currency: "TND";
  autoCancel: boolean;
  autoCancelTime: number;
  bookingStatusFilter: string;
  dateFilter: "today" | "thisWeek" | "thisMonth";
  showStatusModal: boolean;
  showDisputeModal: boolean;
  showNotificationModal: boolean;
  showCapacityModal: boolean;
  showLanguageModal: boolean;
  selectedBooking: Booking | null;
  disputeNote: string;
  disputeProof: string;
  notificationTitle: string;
  notificationMessage: string;
  isLoading: boolean;
}

export interface AnalyticsMetric {
  label: string;
  value: number | string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
}

export interface RevenueData {
  date: string;
  value: number;
}

export interface BookingsByServiceData {
  serviceName: string;
  count: number;
  percentage: number;
}

export interface CustomerSegment {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

export interface NotificationSchedule {
  isScheduled: boolean;
  date: Date | null;
  recurring: "none" | "daily" | "weekly" | "monthly";
  sendNow: boolean;
}

export interface NotificationAudience {
  id: string;
  name: string;
  count: number;
  description?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetId: string;
  position: "top" | "bottom" | "left" | "right";
  icon?: string;
  image?: any;
}

export interface OnboardingState {
  hasSeenOnboarding: boolean;
  currentStep: number;
  showWelcome: boolean;
  showTour: boolean;
}
