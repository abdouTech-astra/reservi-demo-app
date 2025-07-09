// Database Types for Reservi App
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: "customer" | "business_owner" | "staff" | "admin";
  loyalty_points: number;
  total_bookings: number;
  total_spent: number;
  referral_code?: string;
  referred_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  business_type:
    | "restaurant"
    | "cafe"
    | "barbershop"
    | "salon"
    | "spa"
    | "clinic"
    | "other";
  phone?: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: any;
  images?: string[];
  amenities?: string[];
  pricing_info?: any;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  is_featured: boolean;
  is_active: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  business_id: string;
  service_id: string;
  staff_id?: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  total_price: number;
  special_requests?: string;
  notes?: string;
  confirmation_code?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  completed_at?: string;
  no_show_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  business_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  response?: string;
  response_at?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  business_id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  avatar_url?: string;
  working_hours?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type:
    | "booking_confirmation"
    | "booking_reminder"
    | "cancellation"
    | "promotion"
    | "system";
  title: string;
  message: string;
  data?: any;
  read_at?: string;
  sent_at?: string;
  scheduled_for?: string;
  created_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: string;
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface AvailabilitySlot {
  id: string;
  business_id: string;
  staff_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  current_bookings: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Insert types (for creating new records)
export type UserInsert = Omit<User, "id" | "created_at" | "updated_at">;
export type BusinessInsert = Omit<Business, "id" | "created_at" | "updated_at">;
export type ServiceInsert = Omit<Service, "id" | "created_at" | "updated_at">;
export type BookingInsert = Omit<
  Booking,
  "id" | "created_at" | "updated_at" | "confirmation_code"
>;
export type ReviewInsert = Omit<Review, "id" | "created_at" | "updated_at">;

// Update types (for updating existing records)
export type UserUpdate = Partial<
  Omit<User, "id" | "created_at" | "updated_at">
>;
export type BusinessUpdate = Partial<
  Omit<Business, "id" | "created_at" | "updated_at">
>;
export type ServiceUpdate = Partial<
  Omit<Service, "id" | "created_at" | "updated_at">
>;
export type BookingUpdate = Partial<
  Omit<Booking, "id" | "created_at" | "updated_at">
>;

// Extended types with relations
export interface BookingWithRelations extends Booking {
  business?: Business;
  service?: Service;
  customer?: User;
  staff?: Staff;
}

export interface BusinessWithRelations extends Business {
  services?: Service[];
  staff?: Staff[];
  reviews?: Review[];
}

export interface ReviewWithRelations extends Review {
  customer?: User;
  business?: Business;
}
