import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "./config";

// Use configuration from config file
const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types (we'll generate these later)
export interface Database {
  public: {
    Tables: {
      // We'll define these after creating the schema
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show";
      business_type:
        | "restaurant"
        | "cafe"
        | "barbershop"
        | "salon"
        | "spa"
        | "clinic"
        | "other";
      notification_type:
        | "booking_confirmation"
        | "booking_reminder"
        | "cancellation"
        | "promotion"
        | "system";
      payment_status: "pending" | "completed" | "failed" | "refunded";
      advertising_plan: "basic" | "featured" | "premium";
    };
  };
}
