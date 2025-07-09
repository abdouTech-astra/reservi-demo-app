-- ================================
-- Fixed Sample Data for Reservi App
-- This script handles the auth.users foreign key constraint properly
-- ================================

-- IMPORTANT: Run this AFTER setting up your Supabase project and schema

-- Step 1: First, you need to create auth users manually through Supabase Dashboard or via the seed script
-- Go to Authentication > Users in your Supabase dashboard and create these users:

-- Email: ahmed.ben.ali@email.com, Password: Ahmed123!
-- Email: fatma.trabelsi@email.com, Password: Fatma123!
-- Email: mohamed.sassi@email.com, Password: Mohamed123!
-- Email: leila.ben.salem@email.com, Password: Leila123!
-- Email: karim.gharbi@email.com, Password: Karim123!
-- Email: nadia.ben.youssef@email.com, Password: Nadia123!
-- Email: sami.ben.amor@email.com, Password: Sami123!
-- Email: ines.ben.abdallah@email.com, Password: Ines123!

-- Step 2: After creating the auth users, get their UUIDs and update the profile data
-- Replace the UUIDs below with the actual UUIDs from your auth.users table

-- You can get the UUIDs by running this query first:
-- SELECT id, email FROM auth.users ORDER BY created_at;

-- Then replace the UUIDs in the INSERT statements below with the actual ones from your auth.users table

-- ================================
-- UPDATE THESE UUIDs WITH YOUR ACTUAL AUTH USER IDs
-- ================================

-- Example: If your auth users have these IDs, update accordingly:
-- ahmed.ben.ali@email.com = '12345678-1234-1234-1234-123456789001'
-- fatma.trabelsi@email.com = '12345678-1234-1234-1234-123456789002'
-- etc.

-- INSERT USER PROFILES (Update UUIDs with your actual auth.users IDs)
INSERT INTO public.users (id, email, full_name, phone, role, loyalty_points, total_bookings, total_spent, is_active) VALUES
  ('12345678-1234-1234-1234-123456789001', 'ahmed.ben.ali@email.com', 'Ahmed Ben Ali', '+216 20 123 456', 'customer', 150, 0, 0, true),
  ('12345678-1234-1234-1234-123456789002', 'fatma.trabelsi@email.com', 'Fatma Trabelsi', '+216 22 234 567', 'customer', 75, 0, 0, true),
  ('12345678-1234-1234-1234-123456789003', 'mohamed.sassi@email.com', 'Mohamed Sassi', '+216 24 345 678', 'customer', 200, 0, 0, true),
  ('12345678-1234-1234-1234-123456789004', 'leila.ben.salem@email.com', 'Leila Ben Salem', '+216 26 456 789', 'business_owner', 0, 0, 0, true),
  ('12345678-1234-1234-1234-123456789005', 'karim.gharbi@email.com', 'Karim Gharbi', '+216 28 567 890', 'business_owner', 0, 0, 0, true),
  ('12345678-1234-1234-1234-123456789006', 'nadia.ben.youssef@email.com', 'Nadia Ben Youssef', '+216 29 678 901', 'business_owner', 0, 0, 0, true),
  ('12345678-1234-1234-1234-123456789007', 'sami.ben.amor@email.com', 'Sami Ben Amor', '+216 21 789 012', 'business_owner', 0, 0, 0, true),
  ('12345678-1234-1234-1234-123456789008', 'ines.ben.abdallah@email.com', 'Ines Ben Abdallah', '+216 23 890 123', 'customer', 50, 0, 0, true);

-- INSERT BUSINESSES (Update owner_id with your actual user UUIDs)
INSERT INTO public.businesses (id, owner_id, name, description, business_type, phone, email, address, city, latitude, longitude, opening_hours, images, amenities, rating, total_reviews, is_featured) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '12345678-1234-1234-1234-123456789004', -- Leila Ben Salem
    'Café des Délices',
    'Un café traditionnel tunisien avec une ambiance chaleureuse et des pâtisseries maison.',
    'cafe',
    '+216 71 123 456',
    'contact@cafedelices.tn',
    'Avenue Habib Bourguiba, Tunis',
    'Tunis',
    36.8065,
    10.1815,
    '{"monday": {"open": "07:00", "close": "22:00"}, "tuesday": {"open": "07:00", "close": "22:00"}, "wednesday": {"open": "07:00", "close": "22:00"}, "thursday": {"open": "07:00", "close": "22:00"}, "friday": {"open": "07:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "23:00"}, "sunday": {"open": "08:00", "close": "21:00"}}',
    ARRAY['https://example.com/cafe1.jpg', 'https://example.com/cafe2.jpg'],
    ARRAY['WiFi', 'Terrasse', 'Climatisation', 'Parking'],
    4.5,
    127,
    true
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '12345678-1234-1234-1234-123456789005', -- Karim Gharbi
    'Restaurant Le Jasmin',
    'Restaurant gastronomique proposant une cuisine tunisienne moderne et raffinée.',
    'restaurant',
    '+216 71 234 567',
    'reservation@lejasmin.tn',
    'Rue de la Liberté, Sidi Bou Said',
    'Sidi Bou Said',
    36.8704,
    10.3474,
    '{"monday": {"closed": true}, "tuesday": {"open": "12:00", "close": "15:00", "dinner_open": "19:00", "dinner_close": "23:00"}, "wednesday": {"open": "12:00", "close": "15:00", "dinner_open": "19:00", "dinner_close": "23:00"}, "thursday": {"open": "12:00", "close": "15:00", "dinner_open": "19:00", "dinner_close": "23:00"}, "friday": {"open": "12:00", "close": "15:00", "dinner_open": "19:00", "dinner_close": "23:00"}, "saturday": {"open": "12:00", "close": "15:00", "dinner_open": "19:00", "dinner_close": "23:00"}, "sunday": {"open": "12:00", "close": "15:00", "dinner_open": "19:00", "dinner_close": "22:00"}}',
    ARRAY['https://example.com/restaurant1.jpg', 'https://example.com/restaurant2.jpg'],
    ARRAY['Terrasse vue mer', 'Parking valet', 'Climatisation', 'Musique live'],
    4.8,
    89,
    true
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    '12345678-1234-1234-1234-123456789006', -- Nadia Ben Youssef
    'Salon de Beauté Nour',
    'Salon de beauté moderne offrant tous les services de coiffure et d''esthétique.',
    'salon',
    '+216 71 345 678',
    'contact@salonnour.tn',
    'Avenue Mohamed V, Tunis',
    'Tunis',
    36.8008,
    10.1847,
    '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "19:00"}, "sunday": {"closed": true}}',
    ARRAY['https://example.com/salon1.jpg', 'https://example.com/salon2.jpg'],
    ARRAY['Climatisation', 'Produits bio', 'Parking', 'WiFi'],
    4.3,
    156,
    false
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    '12345678-1234-1234-1234-123456789007', -- Sami Ben Amor
    'Barbershop Classic',
    'Salon de coiffure pour hommes avec un style vintage et des services traditionnels.',
    'barbershop',
    '+216 71 456 789',
    'info@classicbarber.tn',
    'Rue Mongi Slim, La Marsa',
    'La Marsa',
    36.8781,
    10.3247,
    '{"monday": {"open": "08:00", "close": "19:00"}, "tuesday": {"open": "08:00", "close": "19:00"}, "wednesday": {"open": "08:00", "close": "19:00"}, "thursday": {"open": "08:00", "close": "19:00"}, "friday": {"open": "08:00", "close": "19:00"}, "saturday": {"open": "08:00", "close": "20:00"}, "sunday": {"open": "09:00", "close": "17:00"}}',
    ARRAY['https://example.com/barber1.jpg', 'https://example.com/barber2.jpg'],
    ARRAY['Style vintage', 'Rasage traditionnel', 'Climatisation', 'Parking'],
    4.6,
    203,
    true
  );

-- INSERT SERVICES
INSERT INTO public.services (id, business_id, name, description, duration, price, category) VALUES
  -- Café des Délices services
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Table pour 2 personnes', 'Réservation d''une table pour 2 personnes', 120, 0.00, 'Réservation'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Table pour 4 personnes', 'Réservation d''une table pour 4 personnes', 120, 0.00, 'Réservation'),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Table VIP Terrasse', 'Table premium avec vue sur l''avenue', 120, 10.00, 'Réservation Premium'),
  
  -- Restaurant Le Jasmin services
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Déjeuner - Table 2 pers', 'Réservation déjeuner pour 2 personnes', 90, 0.00, 'Déjeuner'),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Déjeuner - Table 4 pers', 'Réservation déjeuner pour 4 personnes', 90, 0.00, 'Déjeuner'),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Dîner - Table 2 pers', 'Réservation dîner pour 2 personnes', 120, 0.00, 'Dîner'),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'Menu Dégustation', 'Menu dégustation 7 services', 180, 25.00, 'Menu Spécial'),
  
  -- Salon de Beauté Nour services
  ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'Coupe Femme', 'Coupe et brushing pour femme', 60, 35.00, 'Coiffure'),
  ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Coloration', 'Coloration complète avec soin', 120, 80.00, 'Coiffure'),
  ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440003', 'Manucure', 'Soin complet des ongles', 45, 25.00, 'Esthétique'),
  ('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440003', 'Soin du visage', 'Nettoyage et hydratation du visage', 75, 45.00, 'Esthétique'),
  
  -- Barbershop Classic services
  ('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440004', 'Coupe Classique', 'Coupe de cheveux traditionnelle', 30, 20.00, 'Coiffure'),
  ('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440004', 'Coupe + Barbe', 'Coupe et taille de barbe', 45, 30.00, 'Coiffure'),
  ('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440004', 'Rasage Traditionnel', 'Rasage au rasoir avec serviettes chaudes', 30, 25.00, 'Rasage'),
  ('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440004', 'Service Complet', 'Coupe, barbe et rasage', 60, 45.00, 'Service Premium');

-- INSERT LOYALTY TRANSACTIONS (Update user_id with your actual UUIDs)
INSERT INTO public.loyalty_transactions (user_id, points, transaction_type, description) VALUES
  ('12345678-1234-1234-1234-123456789001', 50, 'welcome', 'Bonus de bienvenue'),
  ('12345678-1234-1234-1234-123456789001', 10, 'booking', 'Points pour réservation'),
  ('12345678-1234-1234-1234-123456789001', 50, 'referral', 'Bonus de parrainage'),
  ('12345678-1234-1234-1234-123456789002', 50, 'welcome', 'Bonus de bienvenue'),
  ('12345678-1234-1234-1234-123456789002', 10, 'booking', 'Points pour réservation'),
  ('12345678-1234-1234-1234-123456789003', 50, 'welcome', 'Bonus de bienvenue'),
  ('12345678-1234-1234-1234-123456789008', 50, 'welcome', 'Bonus de bienvenue');

-- INSERT SAMPLE AVAILABILITY SLOTS
INSERT INTO public.availability_slots (business_id, date, start_time, end_time, max_bookings, current_bookings) VALUES
  -- Café des Délices - next 3 days
  ('660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '08:00', '09:00', 3, 0),
  ('660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '09:00', '10:00', 3, 0),
  ('660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '10:00', '11:00', 3, 1),
  ('660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '16:00', '17:00', 2, 0),
  ('660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '17:00', '18:00', 2, 0),
  
  -- Restaurant Le Jasmin - next 3 days
  ('660e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '1 day', '12:00', '13:00', 4, 0),
  ('660e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '1 day', '13:00', '14:00', 4, 1),
  ('660e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '1 day', '19:30', '20:30', 3, 0),
  ('660e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '1 day', '20:30', '21:30', 3, 0),
  
  -- Salon de Beauté Nour - next 3 days
  ('660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '1 day', '09:00', '10:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '1 day', '10:00', '11:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '1 day', '14:00', '15:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '1 day', '15:00', '16:00', 1, 0),
  
  -- Barbershop Classic - next 3 days
  ('660e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '09:00', '09:30', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '09:30', '10:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '14:00', '14:30', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '14:30', '15:00', 1, 0);

-- IMPORTANT: After running this script, create some sample bookings, reviews, and notifications
-- by using the app interface or by manually inserting with the correct user/business IDs

-- ================================
-- INSTRUCTIONS FOR USE:
-- ================================

-- 1. First, create auth users in Supabase Dashboard:
--    - Go to Authentication > Users
--    - Create users with the emails and passwords listed at the top
--    
-- 2. Get the auth user UUIDs:
--    - Run: SELECT id, email FROM auth.users ORDER BY created_at;
--    
-- 3. Replace all the UUIDs in this file:
--    - Replace '12345678-1234-1234-1234-123456789001' with ahmed.ben.ali@email.com's UUID
--    - Replace '12345678-1234-1234-1234-123456789002' with fatma.trabelsi@email.com's UUID
--    - And so on for all 8 users
--    
-- 4. Run this modified SQL script in Supabase SQL Editor
--
-- 5. Your database will now have sample data that works with the foreign key constraints! 