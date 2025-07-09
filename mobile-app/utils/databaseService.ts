import { supabase } from "./supabase";
import {
  User,
  UserInsert,
  UserUpdate,
  Business,
  BusinessInsert,
  BusinessUpdate,
  BusinessWithRelations,
  Service,
  ServiceInsert,
  ServiceUpdate,
  Booking,
  BookingInsert,
  BookingUpdate,
  BookingWithRelations,
  Review,
  ReviewInsert,
  Notification,
  LoyaltyTransaction,
  AvailabilitySlot,
} from "./databaseTypes";

// ================================
// AUTH OPERATIONS
// ================================

export const authService = {
  async signUp(
    email: string,
    password: string,
    userData: Omit<UserInsert, "email">
  ) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email,
          ...userData,
        })
        .select()
        .single();

      if (profileError) throw profileError;
      return { user: authData.user, profile: userProfile };
    }

    return { user: authData.user, profile: null };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getCurrentUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data as User;
  },
};

// ================================
// USER OPERATIONS
// ================================

export const userService = {
  async updateProfile(userId: string, updates: UserUpdate) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async addLoyaltyPoints(
    userId: string,
    points: number,
    transactionType: string,
    description: string,
    referenceId?: string
  ) {
    // Get current points
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("loyalty_points")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    const newPoints = user.loyalty_points + points;

    // Update user points
    const { error: updateError } = await supabase
      .from("users")
      .update({ loyalty_points: newPoints })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Create transaction record
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

  async getLoyaltyTransactions(userId: string) {
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as LoyaltyTransaction[];
  },
};

// ================================
// BUSINESS OPERATIONS
// ================================

export const businessService = {
  async getAll(filters?: {
    city?: string;
    businessType?: string;
    searchQuery?: string;
    featured?: boolean;
  }) {
    let query = supabase
      .from("businesses")
      .select(
        `
        *,
        services(*),
        reviews(rating)
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

    const { data, error } = await query
      .order("rating", { ascending: false })
      .order("total_reviews", { ascending: false });

    if (error) throw error;
    return data as BusinessWithRelations[];
  },

  async getById(businessId: string) {
    const { data, error } = await supabase
      .from("businesses")
      .select(
        `
        *,
        services(*),
        staff(*),
        reviews(*, users(full_name, avatar_url))
      `
      )
      .eq("id", businessId)
      .single();

    if (error) throw error;
    return data as BusinessWithRelations;
  },

  async create(businessData: BusinessInsert) {
    const { data, error } = await supabase
      .from("businesses")
      .insert(businessData)
      .select()
      .single();

    if (error) throw error;
    return data as Business;
  },

  async update(businessId: string, updates: BusinessUpdate) {
    const { data, error } = await supabase
      .from("businesses")
      .update(updates)
      .eq("id", businessId)
      .select()
      .single();

    if (error) throw error;
    return data as Business;
  },

  async getByOwnerId(ownerId: string) {
    const { data, error } = await supabase
      .from("businesses")
      .select(
        `
        *,
        services(*),
        bookings(*)
      `
      )
      .eq("owner_id", ownerId);

    if (error) throw error;
    return data as BusinessWithRelations[];
  },
};

// ================================
// SERVICE OPERATIONS
// ================================

export const serviceService = {
  async getByBusinessId(businessId: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data as Service[];
  },

  async create(serviceData: ServiceInsert) {
    const { data, error } = await supabase
      .from("services")
      .insert(serviceData)
      .select()
      .single();

    if (error) throw error;
    return data as Service;
  },

  async update(serviceId: string, updates: ServiceUpdate) {
    const { data, error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", serviceId)
      .select()
      .single();

    if (error) throw error;
    return data as Service;
  },

  async delete(serviceId: string) {
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
  async create(bookingData: BookingInsert) {
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
        business:businesses(*),
        service:services(*),
        customer:users(full_name, phone),
        staff(name, avatar_url)
      `
      )
      .single();

    if (error) throw error;
    return data as BookingWithRelations;
  },

  async getByCustomerId(customerId: string, status?: string) {
    let query = supabase
      .from("bookings")
      .select(
        `
        *,
        business:businesses(name, address, phone, images),
        service:services(name, duration, price),
        staff(name, avatar_url)
      `
      )
      .eq("customer_id", customerId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false });

    if (error) throw error;
    return data as BookingWithRelations[];
  },

  async getByBusinessId(
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
        customer:users(full_name, phone, avatar_url),
        service:services(name, duration, price),
        staff(name)
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

    const { data, error } = await query
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    if (error) throw error;
    return data as BookingWithRelations[];
  },

  async updateStatus(
    bookingId: string,
    status: "confirmed" | "cancelled" | "completed" | "no_show",
    notes?: string
  ) {
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
    return data as Booking;
  },

  async cancel(bookingId: string, reason: string) {
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
    return data as Booking;
  },
};

// ================================
// REVIEW OPERATIONS
// ================================

export const reviewService = {
  async create(reviewData: ReviewInsert) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(reviewData)
      .select(
        `
        *,
        customer:users(full_name, avatar_url),
        business:businesses(name)
      `
      )
      .single();

    if (error) throw error;
    return data as Review;
  },

  async getByBusinessId(businessId: string, limit?: number) {
    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        customer:users(full_name, avatar_url)
      `
      )
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Review[];
  },

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
    return data as Review;
  },
};

// ================================
// NOTIFICATION OPERATIONS
// ================================

export const notificationService = {
  async create(
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
    return data as Notification;
  },

  async getByUserId(userId: string, unreadOnly?: boolean) {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId);

    if (unreadOnly) {
      query = query.is("read_at", null);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (error) throw error;
  },

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
// AVAILABILITY OPERATIONS
// ================================

export const availabilityService = {
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
        staff(name, specialties)
      `
      )
      .eq("business_id", businessId)
      .eq("date", date)
      .eq("is_available", true)
      .lt("current_bookings", supabase.sql`max_bookings`);

    const { data, error } = await query;
    if (error) throw error;
    return data as AvailabilitySlot[];
  },

  async createSlot(
    slotData: Omit<AvailabilitySlot, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase
      .from("availability_slots")
      .insert(slotData)
      .select()
      .single();

    if (error) throw error;
    return data as AvailabilitySlot;
  },
};

// ================================
// REAL-TIME SUBSCRIPTIONS
// ================================

export const realtimeService = {
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

  unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription);
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
