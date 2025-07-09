-- ================================
-- Sample Data for Reservi App
-- ================================

-- Insert sample users (customers and business owners)
INSERT INTO public.users (id, email, full_name, phone, role, loyalty_points, referral_code) VALUES
  ('e8754d71-5d9e-4367-9c4f-1b5346cb4780', 'ahmed.ben.ali@email.com', 'Ahmed Ben Ali', '+216 20 123 456', 'customer', 150, 'AHMED123'),
  ('4f5dc7a7-ddaa-4f08-9a38-3b895dc460f4', 'fatma.trabelsi@email.com', 'Fatma Trabelsi', '+216 22 234 567', 'customer', 75, 'FATMA456'),
  ('ae8d8933-487a-43f9-abb7-8ed469ee4df0', 'mohamed.sassi@email.com', 'Mohamed Sassi', '+216 24 345 678', 'customer', 200, 'MOHAMED789'),
  ('550e8400-e29b-41d4-a716-446655440004', 'leila.ben.salem@email.com', 'Leila Ben Salem', '+216 26 456 789', 'business_owner', 0, 'LEILA001'),
  ('550e8400-e29b-41d4-a716-446655440005', 'karim.gharbi@email.com', 'Karim Gharbi', '+216 28 567 890', 'business_owner', 0, 'KARIM002'),
  ('550e8400-e29b-41d4-a716-446655440006', 'nadia.ben.youssef@email.com', 'Nadia Ben Youssef', '+216 29 678 901', 'business_owner', 0, 'NADIA003'),
  ('550e8400-e29b-41d4-a716-446655440007', 'sami.ben.amor@email.com', 'Sami Ben Amor', '+216 21 789 012', 'business_owner', 0, 'SAMI004'),
  ('550e8400-e29b-41d4-a716-446655440008', 'ines.ben.abdallah@email.com', 'Ines Ben Abdallah', '+216 23 890 123', 'customer', 50, 'INES567');

-- Insert sample businesses
INSERT INTO public.businesses (id, owner_id, name, description, business_type, phone, email, address, city, latitude, longitude, opening_hours, images, amenities, rating, total_reviews, is_featured) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004',
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
    '550e8400-e29b-41d4-a716-446655440005',
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
    '550e8400-e29b-41d4-a716-446655440006',
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
    '550e8400-e29b-41d4-a716-446655440007',
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

-- Insert sample services
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

-- Insert sample staff
INSERT INTO public.staff (id, business_id, name, email, phone, specialties, working_hours) VALUES
  -- Café des Délices staff
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Amira Bouaziz', 'amira@cafedelices.tn', '+216 20 111 222', ARRAY['Service client', 'Pâtisserie'], '{"monday": {"start": "07:00", "end": "15:00"}, "tuesday": {"start": "07:00", "end": "15:00"}, "wednesday": {"start": "07:00", "end": "15:00"}, "thursday": {"start": "07:00", "end": "15:00"}, "friday": {"start": "07:00", "end": "15:00"}}'),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Youssef Karray', 'youssef@cafedelices.tn', '+216 20 222 333', ARRAY['Barista', 'Service'], '{"tuesday": {"start": "15:00", "end": "22:00"}, "wednesday": {"start": "15:00", "end": "22:00"}, "thursday": {"start": "15:00", "end": "22:00"}, "friday": {"start": "15:00", "end": "22:00"}, "saturday": {"start": "08:00", "end": "23:00"}, "sunday": {"start": "08:00", "end": "21:00"}}'),
  
  -- Restaurant Le Jasmin staff
  ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Chef Mahmoud Zouari', 'chef@lejasmin.tn', '+216 20 333 444', ARRAY['Cuisine gastronomique', 'Menu dégustation'], '{"tuesday": {"start": "11:00", "end": "23:00"}, "wednesday": {"start": "11:00", "end": "23:00"}, "thursday": {"start": "11:00", "end": "23:00"}, "friday": {"start": "11:00", "end": "23:00"}, "saturday": {"start": "11:00", "end": "23:00"}}'),
  ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Salma Ben Hassen', 'salma@lejasmin.tn', '+216 20 444 555', ARRAY['Service en salle', 'Sommellerie'], '{"tuesday": {"start": "11:30", "end": "23:30"}, "wednesday": {"start": "11:30", "end": "23:30"}, "thursday": {"start": "11:30", "end": "23:30"}, "friday": {"start": "11:30", "end": "23:30"}, "saturday": {"start": "11:30", "end": "23:30"}, "sunday": {"start": "11:30", "end": "22:30"}}'),
  
  -- Salon de Beauté Nour staff
  ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'Nour Ben Youssef', 'nour@salonnour.tn', '+216 20 555 666', ARRAY['Coiffure femme', 'Coloration', 'Coupe'], '{"monday": {"start": "09:00", "end": "18:00"}, "tuesday": {"start": "09:00", "end": "18:00"}, "wednesday": {"start": "09:00", "end": "18:00"}, "thursday": {"start": "09:00", "end": "18:00"}, "friday": {"start": "09:00", "end": "18:00"}}'),
  ('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Rim Chaabane', 'rim@salonnour.tn', '+216 20 666 777', ARRAY['Esthétique', 'Manucure', 'Soins du visage'], '{"tuesday": {"start": "09:00", "end": "18:00"}, "wednesday": {"start": "09:00", "end": "18:00"}, "thursday": {"start": "09:00", "end": "18:00"}, "friday": {"start": "09:00", "end": "18:00"}, "saturday": {"start": "09:00", "end": "19:00"}}'),
  
  -- Barbershop Classic staff
  ('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', 'Sami Ben Amor', 'sami@classicbarber.tn', '+216 20 777 888', ARRAY['Coupe classique', 'Rasage traditionnel', 'Barbe'], '{"monday": {"start": "08:00", "end": "19:00"}, "tuesday": {"start": "08:00", "end": "19:00"}, "wednesday": {"start": "08:00", "end": "19:00"}, "thursday": {"start": "08:00", "end": "19:00"}, "friday": {"start": "08:00", "end": "19:00"}}'),
  ('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', 'Karim Jebali', 'karim@classicbarber.tn', '+216 20 888 999', ARRAY['Coupe moderne', 'Style', 'Conseil'], '{"thursday": {"start": "08:00", "end": "19:00"}, "friday": {"start": "08:00", "end": "19:00"}, "saturday": {"start": "08:00", "end": "20:00"}, "sunday": {"start": "09:00", "end": "17:00"}}');

-- Insert sample bookings
INSERT INTO public.bookings (id, customer_id, business_id, service_id, staff_id, booking_date, booking_time, duration, status, total_price, confirmation_code) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2024-01-15', '10:00', 120, 'completed', 0.00, 'CAFE001'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440004', '2024-01-16', '19:30', 120, 'confirmed', 0.00, 'REST001'),
  ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440005', '2024-01-17', '14:00', 60, 'pending', 35.00, 'SALON001'),
  ('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440013', '880e8400-e29b-41d4-a716-446655440007', '2024-01-18', '11:00', 45, 'confirmed', 30.00, 'BARBER001'),
  ('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440003', '2024-01-20', '20:00', 180, 'pending', 25.00, 'MENU001');

-- Insert sample reviews
INSERT INTO public.reviews (id, booking_id, customer_id, business_id, rating, comment, is_verified) VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 5, 'Excellent café avec une ambiance très agréable. Le service était parfait et les pâtisseries délicieuses!', true),
  ('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 5, 'Une expérience culinaire exceptionnelle! Le cadre est magnifique et la cuisine raffinée. Je recommande vivement.', true);

-- Insert sample availability slots for the next few days
INSERT INTO public.availability_slots (business_id, staff_id, date, start_time, end_time, max_bookings, current_bookings) VALUES
  -- Café des Délices - next 3 days
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '08:00', '09:00', 3, 0),
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '09:00', '10:00', 3, 0),
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', '10:00', '11:00', 3, 1),
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '1 day', '16:00', '17:00', 2, 0),
  ('660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '1 day', '17:00', '18:00', 2, 0),
  
  -- Restaurant Le Jasmin - next 3 days
  ('660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '12:00', '13:00', 4, 0),
  ('660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '13:00', '14:00', 4, 1),
  ('660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '19:30', '20:30', 3, 0),
  ('660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '1 day', '20:30', '21:30', 3, 0),
  
  -- Salon de Beauté Nour - next 3 days
  ('660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440005', CURRENT_DATE + INTERVAL '1 day', '09:00', '10:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440005', CURRENT_DATE + INTERVAL '1 day', '10:00', '11:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440006', CURRENT_DATE + INTERVAL '1 day', '14:00', '15:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440006', CURRENT_DATE + INTERVAL '1 day', '15:00', '16:00', 1, 0),
  
  -- Barbershop Classic - next 3 days
  ('660e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440007', CURRENT_DATE + INTERVAL '1 day', '09:00', '09:30', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440007', CURRENT_DATE + INTERVAL '1 day', '09:30', '10:00', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440008', CURRENT_DATE + INTERVAL '1 day', '14:00', '14:30', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440008', CURRENT_DATE + INTERVAL '1 day', '14:30', '15:00', 1, 0);

-- Insert sample loyalty transactions
INSERT INTO public.loyalty_transactions (user_id, points, transaction_type, description, reference_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 50, 'welcome', 'Bonus de bienvenue', NULL),
  ('550e8400-e29b-41d4-a716-446655440001', 10, 'booking', 'Points pour réservation', '990e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440001', 50, 'referral', 'Bonus de parrainage', '550e8400-e29b-41d4-a716-446655440008'),
  ('550e8400-e29b-41d4-a716-446655440002', 50, 'welcome', 'Bonus de bienvenue', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', 10, 'booking', 'Points pour réservation', '990e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440003', 50, 'welcome', 'Bonus de bienvenue', NULL),
  ('550e8400-e29b-41d4-a716-446655440008', 50, 'welcome', 'Bonus de bienvenue', NULL);

-- Insert sample notifications
INSERT INTO public.notifications (user_id, type, title, message, data) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'booking_confirmation', 'Réservation confirmée', 'Votre réservation au Café des Délices est confirmée pour le 15/01/2024 à 10h00.', '{"booking_id": "990e8400-e29b-41d4-a716-446655440001"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'booking_confirmation', 'Réservation confirmée', 'Votre réservation au Restaurant Le Jasmin est confirmée pour le 16/01/2024 à 19h30.', '{"booking_id": "990e8400-e29b-41d4-a716-446655440002"}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'booking_reminder', 'Rappel de réservation', 'N''oubliez pas votre rendez-vous au Salon de Beauté Nour demain à 14h00.', '{"booking_id": "990e8400-e29b-41d4-a716-446655440003"}'),
  ('550e8400-e29b-41d4-a716-446655440001', 'promotion', 'Offre spéciale', 'Profitez de 20% de réduction sur votre prochaine visite au Barbershop Classic!', '{"discount": 20, "business_id": "660e8400-e29b-41d4-a716-446655440004"}');

-- Update business statistics based on sample data
UPDATE public.businesses SET 
  total_bookings = (SELECT COUNT(*) FROM public.bookings WHERE business_id = businesses.id),
  rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM public.reviews WHERE business_id = businesses.id),
  total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE business_id = businesses.id)
WHERE id IN (
  '660e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440004'
); 