# Supabase Integration Setup Guide

This guide will help you set up Supabase for your Reservi booking app with full database integration and real-time features.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `reservi-booking-app`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users (e.g., `eu-central-1` for Europe)
5. Click "Create new project"

## 2. Get Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role key** (for admin operations, keep this secret!)

## 3. Update Configuration

Update the configuration in `utils/config.ts`:

```typescript
export const config = {
  supabase: {
    url: "https://your-project-ref.supabase.co", // Replace with your URL
    anonKey: "your-anon-key-here", // Replace with your anon key
    serviceRoleKey: "your-service-role-key-here", // Replace with service role key
  },
  // ... rest of config
};
```

## 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `database/schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to create all tables, functions, and policies

## 5. Add Sample Data (Optional)

To test the app with sample data:

1. In the **SQL Editor**, create a new query
2. Copy the contents of `database/sampleData.sql`
3. Paste and run to populate with test data

## 6. Configure Row Level Security (RLS)

The schema already includes basic RLS policies, but you may want to customize them:

### Key Security Policies:

- **Users**: Can only view/edit their own profile
- **Businesses**: Publicly viewable, only owners can modify
- **Bookings**: Private to customers and business owners
- **Reviews**: Public to read, only booking customers can create

### To modify policies:

1. Go to **Authentication** → **Policies**
2. Select the table you want to modify
3. Edit existing policies or create new ones

## 7. Set Up Authentication

### Email Authentication (Default)

Email auth is enabled by default. To customize:

1. Go to **Authentication** → **Settings**
2. Configure email templates under **Email Templates**
3. Set up custom SMTP (optional) under **SMTP Settings**

### Social Authentication (Optional)

To add Google, Facebook, etc.:

1. Go to **Authentication** → **Providers**
2. Enable desired providers
3. Add client IDs and secrets
4. Update redirect URLs

## 8. Configure Storage (For Images)

If you want to store business images, user avatars, etc.:

1. Go to **Storage**
2. Create buckets:

   - `avatars` (for user profile pictures)
   - `business-images` (for business photos)
   - `review-images` (for review photos)

3. Set up storage policies for each bucket

## 9. Set Up Real-time Features

Real-time is enabled by default. To configure:

1. Go to **Database** → **Replication**
2. Enable replication for tables you want real-time updates:
   - `bookings` (for live booking updates)
   - `notifications` (for instant notifications)

## 10. Environment Variables

For production, use environment variables instead of hardcoded values:

### React Native (Expo)

Create `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Update `utils/config.ts`:

```typescript
export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || "fallback-url",
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "fallback-key",
  },
  // ...
};
```

## 11. Testing the Integration

### Test Authentication:

```typescript
import { authService } from "./utils/databaseService";

// Test sign up
const result = await authService.signUp("test@example.com", "password123", {
  full_name: "Test User",
  role: "customer",
});
```

### Test Database Operations:

```typescript
import { businessService } from "./utils/databaseService";

// Test fetching businesses
const businesses = await businessService.getAll({
  city: "Tunis",
  businessType: "restaurant",
});
```

### Test Real-time:

```typescript
import { realtimeService } from "./utils/databaseService";

// Subscribe to booking updates
const subscription = realtimeService.subscribeToBookings(
  "business-id",
  (payload) => console.log("New booking:", payload)
);
```

## 12. Production Considerations

### Security:

- Never expose service role key in client code
- Use RLS policies for all sensitive data
- Enable MFA for admin accounts
- Regular security audits

### Performance:

- Add database indexes for frequently queried columns
- Use connection pooling for high traffic
- Monitor query performance in dashboard
- Set up database backups

### Monitoring:

- Set up alerts for errors and performance issues
- Monitor API usage and rate limits
- Track database performance metrics
- Set up logging for debugging

## 13. Troubleshooting

### Common Issues:

**Connection Errors:**

- Check if URL and keys are correct
- Verify network connectivity
- Check if project is paused (free tier)

**Authentication Issues:**

- Verify email confirmation settings
- Check RLS policies
- Ensure proper error handling

**Real-time Not Working:**

- Check if replication is enabled
- Verify subscription setup
- Check network connectivity

**Performance Issues:**

- Add missing database indexes
- Optimize queries
- Check for N+1 query problems

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 14. Next Steps

After setting up Supabase:

1. **Integrate with existing screens**: Update your React Native screens to use the database services
2. **Add error handling**: Implement proper error boundaries and user feedback
3. **Set up push notifications**: Use Supabase Edge Functions for notifications
4. **Add analytics**: Track user behavior and business metrics
5. **Implement caching**: Add offline support and data caching
6. **Set up CI/CD**: Automate database migrations and deployments

## 15. Database Migration Strategy

For future schema changes:

1. Create migration files in `database/migrations/`
2. Test migrations on staging environment
3. Use Supabase CLI for automated migrations
4. Always backup before major changes
5. Plan for zero-downtime deployments

---

**Important**: Keep your service role key secure and never commit it to version control. Use environment variables for all sensitive configuration.
