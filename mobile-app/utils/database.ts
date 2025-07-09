import { supabase } from "./supabase";
import { Database } from "./supabase";

// Type definitions for our database operations
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type BusinessInsert =
  Database["public"]["Tables"]["businesses"]["Insert"];
export type BusinessUpdate =
  Database["public"]["Tables"]["businesses"]["Update"];

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

// ================================
// USER OPERATIONS
// ================================

export const userService = {
  // Get current user profile
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create user profile after signup
  async createUserProfile(userData: UserInsert) {
    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: UserUpdate) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user by referral code
  async getUserByReferralCode(referralCode: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("referral_code", referralCode)
      .single();

    if (error) throw error;
    return data;
  },

  // Update loyalty points
  async updateLoyaltyPoints(
    userId: string,
    points: number,
    transactionType: string,
    description: string,
    referenceId?: string
  ) {
    // Start a transaction
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("loyalty_points")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    const newPoints = userData.loyalty_points + points;

    // Update user points
    const { error: updateError } = await supabase
      .from("users")
      .update({ loyalty_points: newPoints })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Record transaction
    const { error: transactionError } = await supabase
      .from("loyalty_transactions")
      .insert({
        user_id: userId,
        points,
        transaction_type: transactionType,
        description,
        reference_id: referenceId,
      });

    if (transactionError) throw transactionError;

    return newPoints;
  },
};

// ================================
// BUSINESS OPERATIONS
// ================================

export const businessService = {
  // Get all businesses with filters
  async getBusinesses(filters?: {
    city?: string;
    businessType?: string;
    featured?: boolean;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from("businesses")
      .select(
        `
        *,
        services (*),
        reviews (rating, comment)
      `
      )
      .eq("is_active", true);

    if (filters?.city) {
      query = query.eq("city", filters.city);
    }

    if (filters?.businessType) {
      query = query.eq("business_type", filters.businessType);
    }

    if (filters?.featured) {
      query = query.eq("is_featured", true);
    }

    if (filters?.searchQuery) {
      query = query.or(
        `name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
      );
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    query = query.order("rating", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get business by ID
  async getBusinessById(businessId: string) {
    const { data, error } = await supabase
      .from("businesses")
      .select(
        `
        *,
        services (*),
        staff (*),
        reviews (*, users (full_name, avatar_url))
      `
      )
      .eq("id", businessId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create business
  async createBusiness(businessData: BusinessInsert) {
    const { data, error } = await supabase
      .from("businesses")
      .insert(businessData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update business
  async updateBusiness(businessId: string, updates: BusinessUpdate) {
    const { data, error } = await supabase
      .from("businesses")
      .update(updates)
      .eq("id", businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get businesses owned by user
  async getUserBusinesses(userId: string) {
    const { data, error } = await supabase
      .from("businesses")
      .select(
        `
        *,
        services (*),
        bookings (*)
      `
      )
      .eq("owner_id", userId);

    if (error) throw error;
    return data;
  },
};

// ================================
// SERVICE OPERATIONS
// ================================

export const serviceService = {
  // Get services by business
  async getServicesByBusiness(businessId: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data;
  },

  // Create service
  async createService(serviceData: ServiceInsert) {
    const { data, error } = await supabase
      .from("services")
      .insert(serviceData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update service
  async updateService(serviceId: string, updates: Partial<Service>) {
    const { data, error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete service
  async deleteService(serviceId: string) {
    const { error } = await supabase
      .from("services")
      .update({ is_active: false })
      .eq("id", serviceId);

    if (error) throw error;
  },
};

// ================================
// BOOKING OPERATIONS
// ================================

export const bookingService = {
  // Create booking
  async createBooking(bookingData: BookingInsert) {
    // Generate confirmation code
    const confirmationCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        ...bookingData,
        confirmation_code: confirmationCode,
      })
      .select(
        `
        *,
        business:businesses (*),
        service:services (*),
        customer:users (full_name, phone)
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Get user bookings
  async getUserBookings(userId: string, status?: string) {
    let query = supabase
      .from("bookings")
      .select(
        `
        *,
        business:businesses (name, address, phone),
        service:services (name, duration, price),
        staff (name, avatar_url)
      `
      )
      .eq("customer_id", userId);

    if (status) {
      query = query.eq("status", status);
    }

    query = query.order("booking_date", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get business bookings
  async getBusinessBookings(
    businessId: string,
    filters?: {
      status?: string;
      date?: string;
      staffId?: string;
    }
  ) {
    let query = supabase
      .from("bookings")
      .select(
        `
        *,
        customer:users (full_name, phone, avatar_url),
        service:services (name, duration, price),
        staff (name)
      `
      )
      .eq("business_id", businessId);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.date) {
      query = query.eq("booking_date", filters.date);
    }

    if (filters?.staffId) {
      query = query.eq("staff_id", filters.staffId);
    }

    query = query
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string, notes?: string) {
    const updates: any = { status };

    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    } else if (status === "cancelled") {
      updates.cancelled_at = new Date().toISOString();
    } else if (status === "no_show") {
      updates.no_show_at = new Date().toISOString();
    }

    if (notes) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Cancel booking
  async cancelBooking(bookingId: string, reason: string) {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get available slots
  async getAvailableSlots(
    businessId: string,
    date: string,
    serviceId?: string
  ) {
    let query = supabase
      .from("availability_slots")
      .select(
        `
        *,
        staff (name, specialties)
      `
      )
      .eq("business_id", businessId)
      .eq("date", date)
      .eq("is_available", true)
      .lt("current_bookings", supabase.sql`max_bookings`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

// ================================
// REVIEW OPERATIONS
// ================================

export const reviewService = {
  // Create review
  async createReview(reviewData: ReviewInsert) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(reviewData)
      .select(
        `
        *,
        customer:users (full_name, avatar_url),
        business:businesses (name)
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Get business reviews
  async getBusinessReviews(businessId: string, limit?: number) {
    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        customer:users (full_name, avatar_url)
      `
      )
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Respond to review
  async respondToReview(reviewId: string, response: string) {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        response,
        response_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ================================
// NOTIFICATION OPERATIONS
// ================================

export const notificationService = {
  // Create notification
  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
  ) {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user notifications
  async getUserNotifications(userId: string, unreadOnly?: boolean) {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId);

    if (unreadOnly) {
      query = query.is("read_at", null);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (error) throw error;
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);

    if (error) throw error;
  },
};

// ================================
// REAL-TIME SUBSCRIPTIONS
// ================================

export const realtimeService = {
  // Subscribe to booking updates
  subscribeToBookings(businessId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`bookings:business_id=eq.${businessId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `business_id=eq.${businessId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to user notifications
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications:user_id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription);
  },
};

// ================================
// ANALYTICS OPERATIONS
// ================================

export const analyticsService = {
  // Get business analytics
  async getBusinessAnalytics(
    businessId: string,
    startDate: string,
    endDate: string
  ) {
    const { data, error } = await supabase
      .from("business_analytics")
      .select("*")
      .eq("business_id", businessId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date");

    if (error) throw error;
    return data;
  },

  // Get customer analytics
  async getCustomerAnalytics(
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const { data, error } = await supabase
      .from("customer_analytics")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date");

    if (error) throw error;
    return data;
  },
};

// ================================
// ERROR HANDLING
// ================================

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Helper function to handle database errors
export function handleDatabaseError(error: any): never {
  console.error("Database Error:", error);

  if (error.code === "PGRST116") {
    throw new DatabaseError("No data found");
  } else if (error.code === "23505") {
    throw new DatabaseError("Data already exists");
  } else if (error.code === "23503") {
    throw new DatabaseError("Related data not found");
  } else {
    throw new DatabaseError(
      error.message || "Database operation failed",
      error
    );
  }
}
