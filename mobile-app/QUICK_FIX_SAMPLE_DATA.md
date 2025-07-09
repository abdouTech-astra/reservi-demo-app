# Quick Fix for Sample Data Foreign Key Error

## Problem

You're getting this error because the `users` table references `auth.users(id)`, but you're trying to insert users with UUIDs that don't exist in the `auth.users` table.

## Solution: 3 Easy Steps

### Step 1: Create Auth Users in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** and create these users:

```
Email: ahmed.ben.ali@email.com
Password: Ahmed123!
☑️ Auto Confirm User

Email: fatma.trabelsi@email.com
Password: Fatma123!
☑️ Auto Confirm User

Email: mohamed.sassi@email.com
Password: Mohamed123!
☑️ Auto Confirm User

Email: leila.ben.salem@email.com
Password: Leila123!
☑️ Auto Confirm User

Email: karim.gharbi@email.com
Password: Karim123!
☑️ Auto Confirm User

Email: nadia.ben.youssef@email.com
Password: Nadia123!
☑️ Auto Confirm User

Email: sami.ben.amor@email.com
Password: Sami123!
☑️ Auto Confirm User

Email: ines.ben.abdallah@email.com
Password: Ines123!
☑️ Auto Confirm User
```

### Step 2: Get the User IDs

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this query to see the created user IDs:

```sql
SELECT id, email FROM auth.users ORDER BY created_at;
```

3. Copy the UUIDs for each user

### Step 3: Use the Fixed Sample Data

1. Open the file `database/fixedSampleData.sql`
2. Replace all the placeholder UUIDs with your actual auth user IDs:
   - Replace `'12345678-1234-1234-1234-123456789001'` with Ahmed's actual UUID
   - Replace `'12345678-1234-1234-1234-123456789002'` with Fatma's actual UUID
   - And so on for all 8 users
3. Run the modified SQL in Supabase SQL Editor

## Alternative: Quick Test with Minimal Data

If you just want to test the system quickly, here's a minimal approach:

### Step A: Create One Test User

1. In Supabase Dashboard → Authentication → Users, create:
   - Email: `test@example.com`
   - Password: `Test123!`
   - ☑️ Auto Confirm User

### Step B: Add Profile Data

1. Get the user's UUID from the auth.users table
2. Run this SQL (replace `YOUR_USER_UUID` with the actual UUID):

```sql
-- Insert user profile
INSERT INTO public.users (id, email, full_name, phone, role, loyalty_points) VALUES
  ('YOUR_USER_UUID', 'test@example.com', 'Test User', '+216 20 123 456', 'customer', 100);

-- Insert a test business
INSERT INTO public.businesses (owner_id, name, description, business_type, phone, address, city, rating, total_reviews, is_featured) VALUES
  ('YOUR_USER_UUID', 'Test Café', 'A test café for development', 'cafe', '+216 71 123 456', 'Test Address, Tunis', 'Tunis', 4.5, 10, true);

-- Get the business ID and add a service
-- (Run this query to get the business ID first: SELECT id FROM businesses WHERE name = 'Test Café';)
-- Then insert a service using that business ID:

INSERT INTO public.services (business_id, name, description, duration, price, category) VALUES
  ('YOUR_BUSINESS_ID', 'Table Reservation', 'Reserve a table', 120, 0.00, 'Reservation');
```

## Why This Happened

The `users` table in our schema extends Supabase's built-in authentication:

```sql
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    -- other fields...
);
```

This means every entry in `public.users` must have a corresponding entry in `auth.users`. You can't just insert random UUIDs.

## Prevention for Future

When creating users programmatically, always use the authentication service first:

```typescript
// ✅ Correct way
const { data: authUser } = await supabase.auth.admin.createUser({
  email: "user@example.com",
  password: "password123",
  email_confirm: true,
});

// Then create the profile
await supabase.from("users").insert({
  id: authUser.user.id, // Use the auth user's ID
  email: "user@example.com",
  full_name: "User Name",
  // other profile data...
});
```

## Test Your Fix

After adding the sample data:

1. Try logging in with one of the created users
2. Test the authentication hooks in your app
3. Verify you can fetch businesses and create bookings

The error should be resolved and you'll have working sample data! 🎉
