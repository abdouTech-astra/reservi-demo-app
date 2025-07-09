// Seed script for Reservi app - Run this in Node.js environment
// This script creates users through Supabase auth first, then adds profile data

import {
  createClient
} from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY'; // Use service role key for admin operations

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Sample users data
const sampleUsers = [{
    email: 'ahmed.ben.ali@email.com',
    password: 'Ahmed123!',
    profile: {
      full_name: 'Ahmed Ben Ali',
      phone: '+216 20 123 456',
      role: 'customer',
      loyalty_points: 150,
    }
  },
  {
    email: 'fatma.trabelsi@email.com',
    password: 'Fatma123!',
    profile: {
      full_name: 'Fatma Trabelsi',
      phone: '+216 22 234 567',
      role: 'customer',
      loyalty_points: 75,
    }
  },
  {
    email: 'mohamed.sassi@email.com',
    password: 'Mohamed123!',
    profile: {
      full_name: 'Mohamed Sassi',
      phone: '+216 24 345 678',
      role: 'customer',
      loyalty_points: 200,
    }
  },
  {
    email: 'leila.ben.salem@email.com',
    password: 'Leila123!',
    profile: {
      full_name: 'Leila Ben Salem',
      phone: '+216 26 456 789',
      role: 'business_owner',
      loyalty_points: 0,
    }
  },
  {
    email: 'karim.gharbi@email.com',
    password: 'Karim123!',
    profile: {
      full_name: 'Karim Gharbi',
      phone: '+216 28 567 890',
      role: 'business_owner',
      loyalty_points: 0,
    }
  },
  {
    email: 'nadia.ben.youssef@email.com',
    password: 'Nadia123!',
    profile: {
      full_name: 'Nadia Ben Youssef',
      phone: '+216 29 678 901',
      role: 'business_owner',
      loyalty_points: 0,
    }
  },
  {
    email: 'sami.ben.amor@email.com',
    password: 'Sami123!',
    profile: {
      full_name: 'Sami Ben Amor',
      phone: '+216 21 789 012',
      role: 'business_owner',
      loyalty_points: 0,
    }
  },
  {
    email: 'ines.ben.abdallah@email.com',
    password: 'Ines123!',
    profile: {
      full_name: 'Ines Ben Abdallah',
      phone: '+216 23 890 123',
      role: 'customer',
      loyalty_points: 50,
    }
  }
];

// Business data with owner email references
const sampleBusinesses = [{
    ownerEmail: 'leila.ben.salem@email.com',
    business: {
      name: 'Café des Délices',
      description: 'Un café traditionnel tunisien avec une ambiance chaleureuse et des pâtisseries maison.',
      business_type: 'cafe',
      phone: '+216 71 123 456',
      email: 'contact@cafedelices.tn',
      address: 'Avenue Habib Bourguiba, Tunis',
      city: 'Tunis',
      latitude: 36.8065,
      longitude: 10.1815,
      opening_hours: {
        monday: {
          open: "07:00",
          close: "22:00"
        },
        tuesday: {
          open: "07:00",
          close: "22:00"
        },
        wednesday: {
          open: "07:00",
          close: "22:00"
        },
        thursday: {
          open: "07:00",
          close: "22:00"
        },
        friday: {
          open: "07:00",
          close: "22:00"
        },
        saturday: {
          open: "08:00",
          close: "23:00"
        },
        sunday: {
          open: "08:00",
          close: "21:00"
        }
      },
      images: ['https://example.com/cafe1.jpg', 'https://example.com/cafe2.jpg'],
      amenities: ['WiFi', 'Terrasse', 'Climatisation', 'Parking'],
      rating: 4.5,
      total_reviews: 127,
      is_featured: true
    }
  },
  {
    ownerEmail: 'karim.gharbi@email.com',
    business: {
      name: 'Restaurant Le Jasmin',
      description: 'Restaurant gastronomique proposant une cuisine tunisienne moderne et raffinée.',
      business_type: 'restaurant',
      phone: '+216 71 234 567',
      email: 'reservation@lejasmin.tn',
      address: 'Rue de la Liberté, Sidi Bou Said',
      city: 'Sidi Bou Said',
      latitude: 36.8704,
      longitude: 10.3474,
      opening_hours: {
        monday: {
          closed: true
        },
        tuesday: {
          open: "12:00",
          close: "15:00",
          dinner_open: "19:00",
          dinner_close: "23:00"
        },
        wednesday: {
          open: "12:00",
          close: "15:00",
          dinner_open: "19:00",
          dinner_close: "23:00"
        },
        thursday: {
          open: "12:00",
          close: "15:00",
          dinner_open: "19:00",
          dinner_close: "23:00"
        },
        friday: {
          open: "12:00",
          close: "15:00",
          dinner_open: "19:00",
          dinner_close: "23:00"
        },
        saturday: {
          open: "12:00",
          close: "15:00",
          dinner_open: "19:00",
          dinner_close: "23:00"
        },
        sunday: {
          open: "12:00",
          close: "15:00",
          dinner_open: "19:00",
          dinner_close: "22:00"
        }
      },
      images: ['https://example.com/restaurant1.jpg', 'https://example.com/restaurant2.jpg'],
      amenities: ['Terrasse vue mer', 'Parking valet', 'Climatisation', 'Musique live'],
      rating: 4.8,
      total_reviews: 89,
      is_featured: true
    }
  },
  {
    ownerEmail: 'nadia.ben.youssef@email.com',
    business: {
      name: 'Salon de Beauté Nour',
      description: 'Salon de beauté moderne offrant tous les services de coiffure et d\'esthétique.',
      business_type: 'salon',
      phone: '+216 71 345 678',
      email: 'contact@salonnour.tn',
      address: 'Avenue Mohamed V, Tunis',
      city: 'Tunis',
      latitude: 36.8008,
      longitude: 10.1847,
      opening_hours: {
        monday: {
          open: "09:00",
          close: "18:00"
        },
        tuesday: {
          open: "09:00",
          close: "18:00"
        },
        wednesday: {
          open: "09:00",
          close: "18:00"
        },
        thursday: {
          open: "09:00",
          close: "18:00"
        },
        friday: {
          open: "09:00",
          close: "18:00"
        },
        saturday: {
          open: "09:00",
          close: "19:00"
        },
        sunday: {
          closed: true
        }
      },
      images: ['https://example.com/salon1.jpg', 'https://example.com/salon2.jpg'],
      amenities: ['Climatisation', 'Produits bio', 'Parking', 'WiFi'],
      rating: 4.3,
      total_reviews: 156,
      is_featured: false
    }
  },
  {
    ownerEmail: 'sami.ben.amor@email.com',
    business: {
      name: 'Barbershop Classic',
      description: 'Salon de coiffure pour hommes avec un style vintage et des services traditionnels.',
      business_type: 'barbershop',
      phone: '+216 71 456 789',
      email: 'info@classicbarber.tn',
      address: 'Rue Mongi Slim, La Marsa',
      city: 'La Marsa',
      latitude: 36.8781,
      longitude: 10.3247,
      opening_hours: {
        monday: {
          open: "08:00",
          close: "19:00"
        },
        tuesday: {
          open: "08:00",
          close: "19:00"
        },
        wednesday: {
          open: "08:00",
          close: "19:00"
        },
        thursday: {
          open: "08:00",
          close: "19:00"
        },
        friday: {
          open: "08:00",
          close: "19:00"
        },
        saturday: {
          open: "08:00",
          close: "20:00"
        },
        sunday: {
          open: "09:00",
          close: "17:00"
        }
      },
      images: ['https://example.com/barber1.jpg', 'https://example.com/barber2.jpg'],
      amenities: ['Style vintage', 'Rasage traditionnel', 'Climatisation', 'Parking'],
      rating: 4.6,
      total_reviews: 203,
      is_featured: true
    }
  }
];

async function createUsers() {
  console.log('Creating users...');
  const createdUsers = {};

  for (const userData of sampleUsers) {
    try {
      // Create auth user
      const {
        data: authData,
        error: authError
      } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`Error creating auth user ${userData.email}:`, authError);
        continue;
      }

      console.log(`✅ Created auth user: ${userData.email}`);

      // Create profile
      const {
        data: profileData,
        error: profileError
      } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          ...userData.profile
        })
        .select()
        .single();

      if (profileError) {
        console.error(`Error creating profile for ${userData.email}:`, profileError);
        continue;
      }

      createdUsers[userData.email] = authData.user.id;
      console.log(`✅ Created profile: ${userData.profile.full_name}`);

    } catch (error) {
      console.error(`Error with user ${userData.email}:`, error);
    }
  }

  return createdUsers;
}

async function createBusinesses(createdUsers) {
  console.log('Creating businesses...');
  const createdBusinesses = {};

  for (const businessData of sampleBusinesses) {
    try {
      const ownerId = createdUsers[businessData.ownerEmail];
      if (!ownerId) {
        console.error(`Owner not found for ${businessData.business.name}`);
        continue;
      }

      const {
        data,
        error
      } = await supabase
        .from('businesses')
        .insert({
          owner_id: ownerId,
          ...businessData.business
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating business ${businessData.business.name}:`, error);
        continue;
      }

      createdBusinesses[businessData.business.name] = data.id;
      console.log(`✅ Created business: ${businessData.business.name}`);

    } catch (error) {
      console.error(`Error with business ${businessData.business.name}:`, error);
    }
  }

  return createdBusinesses;
}

async function createServices(createdBusinesses) {
  console.log('Creating services...');

  // Services for each business
  const servicesData = [
    // Café des Délices services
    {
      businessName: 'Café des Délices',
      services: [{
          name: 'Table pour 2 personnes',
          description: 'Réservation d\'une table pour 2 personnes',
          duration: 120,
          price: 0.00,
          category: 'Réservation'
        },
        {
          name: 'Table pour 4 personnes',
          description: 'Réservation d\'une table pour 4 personnes',
          duration: 120,
          price: 0.00,
          category: 'Réservation'
        },
        {
          name: 'Table VIP Terrasse',
          description: 'Table premium avec vue sur l\'avenue',
          duration: 120,
          price: 10.00,
          category: 'Réservation Premium'
        }
      ]
    },
    // Restaurant Le Jasmin services
    {
      businessName: 'Restaurant Le Jasmin',
      services: [{
          name: 'Déjeuner - Table 2 pers',
          description: 'Réservation déjeuner pour 2 personnes',
          duration: 90,
          price: 0.00,
          category: 'Déjeuner'
        },
        {
          name: 'Déjeuner - Table 4 pers',
          description: 'Réservation déjeuner pour 4 personnes',
          duration: 90,
          price: 0.00,
          category: 'Déjeuner'
        },
        {
          name: 'Dîner - Table 2 pers',
          description: 'Réservation dîner pour 2 personnes',
          duration: 120,
          price: 0.00,
          category: 'Dîner'
        },
        {
          name: 'Menu Dégustation',
          description: 'Menu dégustation 7 services',
          duration: 180,
          price: 25.00,
          category: 'Menu Spécial'
        }
      ]
    },
    // Salon de Beauté Nour services
    {
      businessName: 'Salon de Beauté Nour',
      services: [{
          name: 'Coupe Femme',
          description: 'Coupe et brushing pour femme',
          duration: 60,
          price: 35.00,
          category: 'Coiffure'
        },
        {
          name: 'Coloration',
          description: 'Coloration complète avec soin',
          duration: 120,
          price: 80.00,
          category: 'Coiffure'
        },
        {
          name: 'Manucure',
          description: 'Soin complet des ongles',
          duration: 45,
          price: 25.00,
          category: 'Esthétique'
        },
        {
          name: 'Soin du visage',
          description: 'Nettoyage et hydratation du visage',
          duration: 75,
          price: 45.00,
          category: 'Esthétique'
        }
      ]
    },
    // Barbershop Classic services
    {
      businessName: 'Barbershop Classic',
      services: [{
          name: 'Coupe Classique',
          description: 'Coupe de cheveux traditionnelle',
          duration: 30,
          price: 20.00,
          category: 'Coiffure'
        },
        {
          name: 'Coupe + Barbe',
          description: 'Coupe et taille de barbe',
          duration: 45,
          price: 30.00,
          category: 'Coiffure'
        },
        {
          name: 'Rasage Traditionnel',
          description: 'Rasage au rasoir avec serviettes chaudes',
          duration: 30,
          price: 25.00,
          category: 'Rasage'
        },
        {
          name: 'Service Complet',
          description: 'Coupe, barbe et rasage',
          duration: 60,
          price: 45.00,
          category: 'Service Premium'
        }
      ]
    }
  ];

  for (const businessServices of servicesData) {
    const businessId = createdBusinesses[businessServices.businessName];
    if (!businessId) {
      console.error(`Business not found: ${businessServices.businessName}`);
      continue;
    }

    for (const service of businessServices.services) {
      try {
        const {
          error
        } = await supabase
          .from('services')
          .insert({
            business_id: businessId,
            ...service
          });

        if (error) {
          console.error(`Error creating service ${service.name}:`, error);
        } else {
          console.log(`✅ Created service: ${service.name}`);
        }
      } catch (error) {
        console.error(`Error with service ${service.name}:`, error);
      }
    }
  }
}

async function addLoyaltyTransactions(createdUsers) {
  console.log('Adding loyalty transactions...');

  const transactions = [{
      email: 'ahmed.ben.ali@email.com',
      points: 50,
      type: 'welcome',
      description: 'Bonus de bienvenue'
    },
    {
      email: 'ahmed.ben.ali@email.com',
      points: 10,
      type: 'booking',
      description: 'Points pour réservation'
    },
    {
      email: 'ahmed.ben.ali@email.com',
      points: 50,
      type: 'referral',
      description: 'Bonus de parrainage'
    },
    {
      email: 'fatma.trabelsi@email.com',
      points: 50,
      type: 'welcome',
      description: 'Bonus de bienvenue'
    },
    {
      email: 'fatma.trabelsi@email.com',
      points: 10,
      type: 'booking',
      description: 'Points pour réservation'
    },
    {
      email: 'mohamed.sassi@email.com',
      points: 50,
      type: 'welcome',
      description: 'Bonus de bienvenue'
    },
    {
      email: 'ines.ben.abdallah@email.com',
      points: 50,
      type: 'welcome',
      description: 'Bonus de bienvenue'
    }
  ];

  for (const transaction of transactions) {
    try {
      const userId = createdUsers[transaction.email];
      if (!userId) continue;

      const {
        error
      } = await supabase
        .from('loyalty_transactions')
        .insert({
          user_id: userId,
          points: transaction.points,
          transaction_type: transaction.type,
          description: transaction.description
        });

      if (error) {
        console.error(`Error creating transaction:`, error);
      } else {
        console.log(`✅ Created transaction: ${transaction.description}`);
      }
    } catch (error) {
      console.error('Error with transaction:', error);
    }
  }
}

// Main execution function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    const createdUsers = await createUsers();
    console.log(`Created ${Object.keys(createdUsers).length} users`);

    const createdBusinesses = await createBusinesses(createdUsers);
    console.log(`Created ${Object.keys(createdBusinesses).length} businesses`);

    await createServices(createdBusinesses);
    console.log('Created services');

    await addLoyaltyTransactions(createdUsers);
    console.log('Added loyalty transactions');

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding
seedDatabase();