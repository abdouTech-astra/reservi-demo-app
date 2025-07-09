import { useState, useEffect } from "react";
import { bookingService, realtimeService } from "../utils/databaseService";
import { BookingWithRelations, BookingInsert } from "../utils/databaseTypes";
import { useAuth } from "./useAuth";

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's bookings
  const fetchUserBookings = async (status?: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userBookings = await bookingService.getByCustomerId(
        user.id,
        status
      );
      setBookings(userBookings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async (bookingData: BookingInsert) => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      const newBooking = await bookingService.create({
        ...bookingData,
        customer_id: user.id,
      });

      // Add to local state
      setBookings((prev) => [newBooking, ...prev]);

      return newBooking;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string, reason: string) => {
    setLoading(true);
    setError(null);

    try {
      const updatedBooking = await bookingService.updateStatus(
        bookingId,
        "cancelled",
        reason
      );

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
        )
      );

      return updatedBooking;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get upcoming bookings
  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter(
      (booking) =>
        booking.booking_date >= today &&
        ["pending", "confirmed"].includes(booking.status)
    );
  };

  // Get past bookings
  const getPastBookings = () => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter(
      (booking) =>
        booking.booking_date < today ||
        ["completed", "cancelled", "no_show"].includes(booking.status)
    );
  };

  // Load bookings when user changes
  useEffect(() => {
    if (user) {
      fetchUserBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    fetchUserBookings,
    getUpcomingBookings,
    getPastBookings,
  };
}

// Hook for business owners to manage their bookings
export function useBusinessBookings(businessId?: string) {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch business bookings
  const fetchBusinessBookings = async (filters?: {
    status?: string;
    date?: string;
    staffId?: string;
  }) => {
    if (!businessId) return;

    setLoading(true);
    setError(null);

    try {
      const businessBookings = await bookingService.getByBusinessId(
        businessId,
        filters
      );
      setBookings(businessBookings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (
    bookingId: string,
    status: "confirmed" | "cancelled" | "completed" | "no_show",
    notes?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updatedBooking = await bookingService.updateStatus(
        bookingId,
        status,
        notes
      );

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
        )
      );

      return updatedBooking;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time booking updates
  useEffect(() => {
    if (!businessId) return;

    const subscription = realtimeService.subscribeToBookings(
      businessId,
      (payload) => {
        console.log("Booking update received:", payload);

        if (payload.eventType === "INSERT") {
          setBookings((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setBookings((prev) =>
            prev.map((booking) =>
              booking.id === payload.new.id
                ? { ...booking, ...payload.new }
                : booking
            )
          );
        } else if (payload.eventType === "DELETE") {
          setBookings((prev) =>
            prev.filter((booking) => booking.id !== payload.old.id)
          );
        }
      }
    );

    // Cleanup subscription
    return () => {
      realtimeService.unsubscribe(subscription);
    };
  }, [businessId]);

  // Load bookings when businessId changes
  useEffect(() => {
    if (businessId) {
      fetchBusinessBookings();
    } else {
      setBookings([]);
    }
  }, [businessId]);

  return {
    bookings,
    loading,
    error,
    fetchBusinessBookings,
    updateBookingStatus,
  };
}
