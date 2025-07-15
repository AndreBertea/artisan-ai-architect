import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un tenant par défaut
  const defaultTenant = await prisma.tenant.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Artisan AI Architect',
      slug: 'artisan-ai',
      domain: 'artisan-ai.local',
      settings: {
        theme: 'light',
        language: 'fr',
        timezone: 'Europe/Paris'
      }
    },
  });

  console.log('✅ Tenant créé:', defaultTenant.name);

  // Créer un utilisateur admin
  const adminUser = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: defaultTenant.id,
        email: 'admin@artisan-ai.local'
      }
    },
    update: {},
    create: {
      email: 'admin@artisan-ai.local',
      passwordHash: '$2b$10$rQZ8N3YqG8K9L2M1N0O9P8Q7R6S5T4U3V2W1X0Y9Z8A7B6C5D4E3F2G1H0I', // password: admin123
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin',
      permissions: ['*'],
      tenantId: defaultTenant.id,
      isActive: true
    },
  });

  console.log('✅ Utilisateur admin créé:', adminUser.email);

  // Créer quelques artisans de test
  const artisans = await Promise.all([
    prisma.artisan.create({
      data: {
        nom: 'Jean Dupont',
        specialite: 'Plomberie',
        statut: 'expert',
        zone: 'Paris',
        activiteBadge: 'élevé',
        caMois: 5000.0,
        noteMoyenne: 4.8,
        disponible: true,
        contactInfo: {
          email: 'jean.dupont@artisan-ai.local',
          phone: '+33123456789',
          address: '123 Rue de la Plomberie, 75001 Paris'
        },
        tenantId: defaultTenant.id
      },
    }),
    prisma.artisan.create({
      data: {
        nom: 'Marie Martin',
        specialite: 'Électricité',
        statut: 'expert',
        zone: 'Paris',
        activiteBadge: 'élevé',
        caMois: 5500.0,
        noteMoyenne: 4.9,
        disponible: true,
        contactInfo: {
          email: 'marie.martin@artisan-ai.local',
          phone: '+33987654321',
          address: '456 Avenue de l\'Électricité, 75008 Paris'
        },
        tenantId: defaultTenant.id
      },
    })
  ]);

  console.log('✅ Artisans créés:', artisans.length);

  // Créer quelques clients de test
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        nom: 'Pierre Durand',
        type: 'particulier',
        adresse: '123 Rue de la Paix, 75001 Paris',
        contact: '+33111111111',
        lat: 48.8566,
        lng: 2.3522,
        evaluation: 4.5,
        interventionsCount: 0,
        settings: {
          email: 'client1@example.com',
          preferences: {
            contactMethod: 'phone',
            language: 'fr'
          }
        },
        tenantId: defaultTenant.id
      },
    }),
    prisma.client.create({
      data: {
        nom: 'Sophie Leroy',
        type: 'particulier',
        adresse: '456 Avenue des Champs, 75008 Paris',
        contact: '+33222222222',
        lat: 48.8698,
        lng: 2.3077,
        evaluation: 4.7,
        interventionsCount: 0,
        settings: {
          email: 'client2@example.com',
          preferences: {
            contactMethod: 'email',
            language: 'fr'
          }
        },
        tenantId: defaultTenant.id
      },
    })
  ]);

  console.log('✅ Clients créés:', clients.length);

  // Créer quelques interventions de test
  const interventions = await Promise.all([
    prisma.intervention.create({
      data: {
        statut: 'demande',
        description: 'Fuite d\'eau dans la salle de bain',
        adresse: '123 Rue de la Paix, 75001 Paris',
        montant: 150.0,
        echeance: new Date('2024-07-20T10:00:00Z'),
        notes: 'Urgent - fuite importante',
        documents: [],
        clientId: clients[0].id,
        artisanId: artisans[0].id,
        tenantId: defaultTenant.id
      },
    }),
    prisma.intervention.create({
      data: {
        statut: 'en_cours',
        description: 'Installation de nouveaux spots LED',
        adresse: '456 Avenue des Champs, 75008 Paris',
        montant: 300.0,
        echeance: new Date('2024-07-18T14:00:00Z'),
        dateDebut: new Date('2024-07-18T14:00:00Z'),
        notes: 'Installation en cours',
        documents: [],
        clientId: clients[1].id,
        artisanId: artisans[1].id,
        tenantId: defaultTenant.id
      },
    })
  ]);

  console.log('✅ Interventions créées:', interventions.length);

  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 