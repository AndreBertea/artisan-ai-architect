interface AiQueryRequest {
  query: string;
}

interface AiQueryResponse {
  answer: string;
}

export const aiApi = {
  async query(request: AiQueryRequest): Promise<AiQueryResponse> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Réponses basées sur les données cohérentes
    const query = request.query.toLowerCase();
    
    if (query.includes('artisan') || query.includes('artisans')) {
      return {
        answer: `Voici les informations sur les artisans :

• Jean Dupont (Électricien) - Expert - Disponible
  Zone : Paris 15e - CA mensuel : 8 500€ - Note : 4.8/5
  Dernière intervention : 17/01/2024

• Marie Martin (Plombier) - Confirmé - En intervention
  Zone : Boulogne - CA mensuel : 6 200€ - Note : 4.3/5
  Dernière intervention : 16/01/2024

• Pierre Durand (Menuisier) - Novice - Disponible
  Zone : Issy-les-Moulineaux - CA mensuel : 3 800€ - Note : 4.1/5
  Dernière intervention : 10/01/2024

• Sophie Bernard (Peintre) - Potentiel - En congé
  Zone : Vanves - CA mensuel : 1 200€ - Note : 3.9/5
  Dernière intervention : 28/12/2023

Pour assigner un artisan à une intervention, utilisez le menu Interventions > Nouvelle intervention.`
      };
    }
    
    if (query.includes('intervention') || query.includes('interventions')) {
      return {
        answer: `État des interventions en cours :

🟡 En cours (2) :
- INT-2024-001 : Réparation tableau électrique - Rue de la Paix
  Client : Entreprise ABC - Artisan : Jean Dupont
  Échéance : 20/01/2024 - Montant : 1 200€

- INT-2024-003 : Installation cuisine - Boulevard Central
  Client : Restaurant Le Gourmet - Artisan : Pierre Durand
  Échéance : 18/01/2024 - Montant : 2 100€

✅ Terminées (1) :
- INT-2024-002 : Fuite d'eau - Avenue Victor Hugo
  Client : Résidence Les Jardins - Artisan : Marie Martin
  Terminée le : 16/01/2024 - Montant : 850€

⏳ En attente (1) :
- INT-2024-004 : Peinture salon - Place du Marché
  Client : Boutique Mode & Co - Artisan : Sophie Bernard
  Échéance : 19/01/2024 - Montant : 650€

Pour voir tous les détails, consultez la page Interventions.`
      };
    }
    
    if (query.includes('client') || query.includes('clients')) {
      return {
        answer: `Aperçu des clients :

🏢 Entreprise ABC (Client premium)
- 15 interventions réalisées
- Note moyenne : 4.5/5
- Contact : contact@abc.fr
- Adresse : 15 Rue de la République, 75011 Paris
- Interventions en cours : INT-2024-001

🏘️ Résidence Les Jardins (Syndic)
- 8 interventions cette année
- Note moyenne : 4.2/5
- Contact : syndic@jardins.fr
- Adresse : 28 Boulevard Saint-Germain, 75005 Paris
- Dernière intervention : INT-2024-002 (terminée)

🍽️ Restaurant Le Gourmet (Client régulier)
- 12 interventions
- Note moyenne : 4.7/5
- Contact : chef@gourmet.fr
- Adresse : 42 Avenue des Champs-Élysées, 75008 Paris
- Intervention en cours : INT-2024-003

👕 Boutique Mode & Co (Nouveau client)
- 2 interventions
- Note moyenne : 3.9/5
- Contact : info@modeco.fr
- Adresse : 8 Rue Montmartre, 75001 Paris
- Intervention en attente : INT-2024-004`
      };
    }
    
    if (query.includes('statistique') || query.includes('stats')) {
      return {
        answer: `Statistiques du mois :

📊 Interventions :
- Total : 4 interventions
- En cours : 2 (50%)
- Terminées : 1 (25%)
- En attente : 1 (25%)

👷 Artisans :
- Disponibles : 2 (Jean Dupont, Pierre Durand)
- En intervention : 1 (Marie Martin)
- En congé : 1 (Sophie Bernard)

💰 Chiffre d'affaires : 4 800€
- INT-2024-001 : 1 200€ (en cours)
- INT-2024-002 : 850€ (terminée)
- INT-2024-003 : 2 100€ (en cours)
- INT-2024-004 : 650€ (en attente)

📈 Satisfaction clients : 4.3/5
📋 Alertes actives : 3 (1 retard, 1 devis manquant, 1 artisan indisponible)

Pour des détails complets, consultez le Dashboard.`
      };
    }
    
    if (query.includes('alerte') || query.includes('alertes') || query.includes('notification')) {
      return {
        answer: `Alertes et notifications actives :

🚨 Alertes urgentes (3) :
- Intervention INT-2024-001 en retard de 3 jours
- Devis manquant pour INT-2024-004
- Sophie Bernard en congé jusqu'au 15/12

📢 Notifications internes (10) :
- Nouveau client Boutique Mode & Co
- Intervention INT-2024-002 terminée
- Maintenance préventive programmée

⏰ Rappels (5) :
- Facturation mensuelle à effectuer (20/01)
- Révision contrat Entreprise ABC (25/01)
- Formation sécurité artisans (30/01)

Actions recommandées :
1. Contacter Jean Dupont pour INT-2024-001
2. Demander le devis pour INT-2024-004
3. Planifier la facturation mensuelle`
      };
    }
    
    // Réponse par défaut
    return {
      answer: `Je suis l'assistant IA de votre CRM. Je peux vous aider avec :

• Les informations sur les artisans et leurs disponibilités
• L'état des interventions en cours
• Les détails sur vos clients
• Les statistiques du mois
• Les alertes et notifications
• La planification des interventions

Posez-moi une question spécifique pour obtenir une réponse détaillée !

Exemples :
- "/artisans" - Voir les artisans disponibles
- "/interventions" - État des interventions
- "/clients" - Informations clients
- "/statistiques" - Statistiques du mois
- "/alertes" - Alertes actives`
    };
  }
}; 