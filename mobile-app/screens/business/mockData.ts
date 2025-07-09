import {
  Booking,
  Customer,
  WorkingHours,
  BusinessPlan,
  Notification,
  Service,
  AnalyticsMetric,
  RevenueData,
  BookingsByServiceData,
  CustomerSegment,
  NotificationAudience,
} from "./types";

// Mock booking data
export const todayBookings: Booking[] = [
  {
    id: "B2025061",
    customerName: "Ahmed Ben Ali",
    service: "Tunisian Mint Tea",
    time: "10:30 AM",
    duration: "10 min",
    status: "confirmed",
    price: "5 TND",
    tableNumber: "T3",
    customerPhone: "+216 20 123 456",
  },
  {
    id: "B2025062",
    customerName: "Leila Mansour",
    service: "Breakfast Platter",
    time: "11:00 AM",
    duration: "30 min",
    status: "confirmed",
    price: "25 TND",
    tableNumber: "T5",
    customerPhone: "+216 21 234 567",
  },
  {
    id: "B2025060",
    customerName: "Mohamed Khelif",
    service: "Specialty Coffee",
    time: "9:30 AM",
    duration: "10 min",
    status: "completed",
    price: "7 TND",
    tableNumber: "T2",
    customerPhone: "+216 22 345 678",
  },
  {
    id: "B2025059",
    customerName: "Sarah Triki",
    service: "Fresh Orange Juice",
    time: "9:15 AM",
    duration: "5 min",
    status: "no-show",
    price: "6 TND",
    tableNumber: "T4",
    customerPhone: "+216 23 456 789",
    dispute: true,
    disputeReason: "Customer didn't show up for reservation",
  },
];

// Mock future bookings data for calendar
export const futureBookings: Booking[] = [
  {
    id: "B2025063",
    customerName: "Youssef Gharbi",
    service: "Specialty Coffee",
    time: "2:00 PM",
    duration: "10 min",
    status: "confirmed",
    price: "7 TND",
    tableNumber: "T1",
    customerPhone: "+216 24 567 890",
  },
  {
    id: "B2025064",
    customerName: "Amina Belkadi",
    service: "Breakfast Platter",
    time: "10:00 AM",
    duration: "30 min",
    status: "confirmed",
    price: "25 TND",
    tableNumber: "T6",
    customerPhone: "+216 25 678 901",
  },
  {
    id: "B2025065",
    customerName: "Tarek Majeri",
    service: "Tunisian Mint Tea",
    time: "3:30 PM",
    duration: "10 min",
    status: "confirmed",
    price: "5 TND",
    tableNumber: "T2",
    customerPhone: "+216 26 789 012",
  },
];

// Mock top customers data
export const recentCustomers: Customer[] = [
  {
    id: "C1001",
    name: "Ahmed Ben Ali",
    lastVisit: "Today",
    totalVisits: 12,
    rating: 4.8,
    noShowCount: 0,
    points: 240,
    totalSpent: 460,
    phone: "+216 20 123 456",
    email: "ahmed@example.com",
    preferredServices: ["Breakfast Platter", "Tunisian Mint Tea"],
  },
  {
    id: "C1002",
    name: "Leila Mansour",
    lastVisit: "Today",
    totalVisits: 8,
    rating: 4.5,
    noShowCount: 0,
    points: 160,
    totalSpent: 320,
    phone: "+216 21 234 567",
    email: "leila@example.com",
    preferredServices: ["Breakfast Platter"],
  },
  {
    id: "C1003",
    name: "Mohamed Khelif",
    lastVisit: "Today",
    totalVisits: 15,
    rating: 4.9,
    noShowCount: 1,
    points: 290,
    totalSpent: 580,
    phone: "+216 22 345 678",
    email: "mohamed@example.com",
    preferredServices: ["Specialty Coffee", "Pastry Selection"],
  },
  {
    id: "C1004",
    name: "Sarah Triki",
    lastVisit: "Today",
    totalVisits: 5,
    rating: 3.5,
    noShowCount: 2,
    points: 60,
    totalSpent: 120,
    phone: "+216 23 456 789",
    email: "sarah@example.com",
    preferredServices: ["Fresh Orange Juice"],
  },
];

// Mock working hours data
export const mockWorkingHours: WorkingHours[] = [
  {
    day: "Monday",
    open: true,
    openTime: "8:00 AM",
    closeTime: "8:00 PM",
    slots: [
      { id: "1", time: "8:00 AM", capacity: 10, booked: 3, isAvailable: true },
      { id: "2", time: "10:00 AM", capacity: 10, booked: 6, isAvailable: true },
      {
        id: "3",
        time: "12:00 PM",
        capacity: 10,
        booked: 10,
        isAvailable: false,
      },
      { id: "4", time: "2:00 PM", capacity: 10, booked: 5, isAvailable: true },
      { id: "5", time: "4:00 PM", capacity: 10, booked: 8, isAvailable: true },
      { id: "6", time: "6:00 PM", capacity: 10, booked: 4, isAvailable: true },
    ],
  },
  {
    day: "Tuesday",
    open: true,
    openTime: "8:00 AM",
    closeTime: "8:00 PM",
    slots: [
      { id: "1", time: "8:00 AM", capacity: 10, booked: 2, isAvailable: true },
      { id: "2", time: "10:00 AM", capacity: 10, booked: 4, isAvailable: true },
      { id: "3", time: "12:00 PM", capacity: 10, booked: 7, isAvailable: true },
      { id: "4", time: "2:00 PM", capacity: 10, booked: 9, isAvailable: true },
      { id: "5", time: "4:00 PM", capacity: 10, booked: 3, isAvailable: true },
      { id: "6", time: "6:00 PM", capacity: 10, booked: 5, isAvailable: true },
    ],
  },
  {
    day: "Wednesday",
    open: true,
    openTime: "8:00 AM",
    closeTime: "8:00 PM",
    slots: [
      { id: "1", time: "8:00 AM", capacity: 10, booked: 1, isAvailable: true },
      { id: "2", time: "10:00 AM", capacity: 10, booked: 5, isAvailable: true },
      { id: "3", time: "12:00 PM", capacity: 10, booked: 8, isAvailable: true },
      { id: "4", time: "2:00 PM", capacity: 10, booked: 4, isAvailable: true },
      { id: "5", time: "4:00 PM", capacity: 10, booked: 7, isAvailable: true },
      { id: "6", time: "6:00 PM", capacity: 10, booked: 3, isAvailable: true },
    ],
  },
  {
    day: "Thursday",
    open: true,
    openTime: "8:00 AM",
    closeTime: "8:00 PM",
    slots: [
      { id: "1", time: "8:00 AM", capacity: 10, booked: 2, isAvailable: true },
      { id: "2", time: "10:00 AM", capacity: 10, booked: 6, isAvailable: true },
      { id: "3", time: "12:00 PM", capacity: 10, booked: 9, isAvailable: true },
      { id: "4", time: "2:00 PM", capacity: 10, booked: 5, isAvailable: true },
      { id: "5", time: "4:00 PM", capacity: 10, booked: 4, isAvailable: true },
      { id: "6", time: "6:00 PM", capacity: 10, booked: 2, isAvailable: true },
    ],
  },
  {
    day: "Friday",
    open: true,
    openTime: "8:00 AM",
    closeTime: "8:00 PM",
    slots: [
      { id: "1", time: "8:00 AM", capacity: 10, booked: 4, isAvailable: true },
      { id: "2", time: "10:00 AM", capacity: 10, booked: 7, isAvailable: true },
      { id: "3", time: "12:00 PM", capacity: 10, booked: 9, isAvailable: true },
      { id: "4", time: "2:00 PM", capacity: 10, booked: 8, isAvailable: true },
      { id: "5", time: "4:00 PM", capacity: 10, booked: 5, isAvailable: true },
      { id: "6", time: "6:00 PM", capacity: 10, booked: 6, isAvailable: true },
    ],
  },
  {
    day: "Saturday",
    open: true,
    openTime: "10:00 AM",
    closeTime: "10:00 PM",
    slots: [
      { id: "1", time: "10:00 AM", capacity: 10, booked: 8, isAvailable: true },
      {
        id: "2",
        time: "12:00 PM",
        capacity: 10,
        booked: 10,
        isAvailable: false,
      },
      { id: "3", time: "2:00 PM", capacity: 10, booked: 7, isAvailable: true },
      { id: "4", time: "4:00 PM", capacity: 10, booked: 9, isAvailable: true },
      {
        id: "5",
        time: "6:00 PM",
        capacity: 10,
        booked: 10,
        isAvailable: false,
      },
      { id: "6", time: "8:00 PM", capacity: 10, booked: 5, isAvailable: true },
    ],
  },
  {
    day: "Sunday",
    open: true,
    openTime: "10:00 AM",
    closeTime: "8:00 PM",
    slots: [
      { id: "1", time: "10:00 AM", capacity: 10, booked: 6, isAvailable: true },
      { id: "2", time: "12:00 PM", capacity: 10, booked: 9, isAvailable: true },
      { id: "3", time: "2:00 PM", capacity: 10, booked: 8, isAvailable: true },
      { id: "4", time: "4:00 PM", capacity: 10, booked: 5, isAvailable: true },
      { id: "5", time: "6:00 PM", capacity: 10, booked: 3, isAvailable: true },
    ],
  },
];

// Mock subscription plans
export const subscriptionPlans: BusinessPlan[] = [
  {
    name: "Free",
    price: "0 TND",
    currentPlan: true,
    features: [
      "Basic booking management",
      "Up to 50 bookings per month",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Premium",
    price: "20 TND/month",
    currentPlan: false,
    features: [
      "Unlimited bookings",
      "Advanced analytics",
      "Priority in search results",
      "Custom promotions",
      "Priority customer support",
      "Capacity management",
      "Customer loyalty tools",
    ],
  },
];

// Mock notification templates
export const notificationTemplates: Notification[] = [
  {
    id: "N1001",
    title: "Booking Reminder",
    message: "Don't forget your appointment at {{businessName}} tomorrow!",
    sent: true,
    recipients: 24,
    date: "May 25, 2025",
  },
  {
    id: "N1002",
    title: "Special Discount",
    message:
      "Enjoy 15% off on all menu items this weekend at {{businessName}}!",
    sent: true,
    recipients: 120,
    date: "May 20, 2025",
  },
  {
    id: "N1003",
    title: "New Menu Items",
    message:
      "Hi {{customerName}}, try our new specialty coffees and desserts at {{businessName}}!",
    sent: false,
    recipients: 0,
    date: "Draft",
  },
  {
    id: "N1004",
    title: "Thank You",
    message:
      "Thank you {{customerName}} for visiting {{businessName}}. We hope to see you again soon!",
    sent: true,
    recipients: 85,
    date: "May 15, 2025",
  },
  {
    id: "N1005",
    title: "Booking Confirmation",
    message:
      "Your booking at {{businessName}} for {{serviceName}} on {{bookingDate}} at {{bookingTime}} is confirmed.",
    sent: true,
    recipients: 45,
    date: "May 10, 2025",
    scheduled: true,
    recurring: "daily",
  },
];

// Mock services for the business
export const cafeServices: Service[] = [
  {
    id: "S001",
    name: "Tunisian Mint Tea",
    description: "Traditional mint tea served with pine nuts",
    price: 5,
    duration: 10,
    isActive: true,
    category: "Beverages",
  },
  {
    id: "S002",
    name: "Specialty Coffee",
    description: "Single-origin coffee prepared with your choice of method",
    price: 7,
    duration: 10,
    isActive: true,
    category: "Beverages",
  },
  {
    id: "S003",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 6,
    duration: 5,
    isActive: true,
    category: "Beverages",
  },
  {
    id: "S004",
    name: "Breakfast Platter",
    description: "Eggs, cheese, olives, bread and spreads",
    price: 25,
    duration: 30,
    isActive: true,
    category: "Food",
  },
  {
    id: "S005",
    name: "Pastry Selection",
    description: "Assortment of local and French pastries",
    price: 15,
    duration: 15,
    isActive: true,
    category: "Food",
  },
  {
    id: "S006",
    name: "Sandwich Tunisien",
    description: "Traditional Tunisian sandwich with tuna, olives, and harissa",
    price: 12,
    duration: 10,
    isActive: true,
    category: "Food",
  },
  {
    id: "S007",
    name: "VIP Table Reservation",
    description: "Reserve our special corner table with sea view",
    price: 50,
    duration: 120,
    isActive: false,
    category: "Special",
  },
];

// Mock analytics metrics
export const summaryMetrics: AnalyticsMetric[] = [
  {
    label: "Revenue",
    value: "4,250 TND",
    change: 12.5,
    changeType: "positive",
  },
  {
    label: "Bookings",
    value: 187,
    change: 8.2,
    changeType: "positive",
  },
  {
    label: "New Customers",
    value: 42,
    change: 15.3,
    changeType: "positive",
  },
  {
    label: "Avg. Booking Value",
    value: "22.7 TND",
    change: 4.1,
    changeType: "positive",
  },
];

// Mock revenue data
export const revenueData: RevenueData[] = [
  { date: "Mon", value: 520 },
  { date: "Tue", value: 450 },
  { date: "Wed", value: 700 },
  { date: "Thu", value: 600 },
  { date: "Fri", value: 750 },
  { date: "Sat", value: 820 },
  { date: "Sun", value: 580 },
];

// Mock bookings by service
export const bookingsByService: BookingsByServiceData[] = [
  { serviceName: "Breakfast Platter", count: 45, percentage: 35 },
  { serviceName: "Specialty Coffee", count: 32, percentage: 25 },
  { serviceName: "Tunisian Mint Tea", count: 24, percentage: 18 },
  { serviceName: "Fresh Orange Juice", count: 15, percentage: 12 },
  { serviceName: "Pastry Selection", count: 12, percentage: 10 },
];

// Mock customer segments
export const customerSegments: CustomerSegment[] = [
  { name: "Loyal", percentage: 45, count: 54, color: "#3b82f6" },
  { name: "Regular", percentage: 30, count: 36, color: "#10b981" },
  { name: "Occasional", percentage: 15, count: 18, color: "#f59e0b" },
  { name: "New", percentage: 10, count: 12, color: "#8b5cf6" },
];

// Mock notification audience segments
export const notificationAudiences: NotificationAudience[] = [
  {
    id: "all",
    name: "All Customers",
    count: 120,
    description: "All registered customers",
  },
  {
    id: "active",
    name: "Active Customers",
    count: 85,
    description: "Customers who visited in the last 30 days",
  },
  {
    id: "inactive",
    name: "Inactive Customers",
    count: 35,
    description: "Customers who haven't visited in 30+ days",
  },
  {
    id: "new",
    name: "New Customers",
    count: 22,
    description: "Customers who registered in the last 30 days",
  },
  {
    id: "loyal",
    name: "Loyal Customers",
    count: 54,
    description: "Customers with 5+ visits",
  },
];
