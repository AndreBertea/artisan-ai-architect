-- Requêtes SQL générées pour le frontend
-- Généré automatiquement depuis le CSV

-- get_all_interventions

-- Récupérer toutes les interventions avec pagination
SELECT 
    i.id,
    i.address as adresse,
    i.context as description,
    i.status as statut,
    i.created_date as cree,
    i.intervention_date as echeance,
    i.sst_cost as cout_sst,
    i.material_cost as cout_materiaux,
    i.intervention_cost as cout_interventions,
    i.tenant_name as client,
    i.tenant_phone as client_telephone,
    i.tenant_email as client_email,
    i.manager as utilisateur_assigne,
    a.name as artisan,
    ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at,
    i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
ORDER BY i.created_at DESC
LIMIT ? OFFSET ?;


-- get_intervention_by_id

-- Récupérer une intervention par ID
SELECT 
    i.id,
    i.address as adresse,
    i.context as description,
    i.status as statut,
    i.created_date as cree,
    i.intervention_date as echeance,
    i.sst_cost as cout_sst,
    i.material_cost as cout_materiaux,
    i.intervention_cost as cout_interventions,
    i.tenant_name as client,
    i.tenant_phone as client_telephone,
    i.tenant_email as client_email,
    i.manager as utilisateur_assigne,
    a.name as artisan,
    ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at,
    i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.id = ?;


-- get_interventions_by_status

-- Récupérer les interventions par statut
SELECT 
    i.id,
    i.address as adresse,
    i.context as description,
    i.status as statut,
    i.created_date as cree,
    i.intervention_date as echeance,
    i.sst_cost as cout_sst,
    i.material_cost as cout_materiaux,
    i.intervention_cost as cout_interventions,
    i.tenant_name as client,
    a.name as artisan,
    ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.status = ?
ORDER BY i.created_at DESC;


-- get_interventions_by_agency

-- Récupérer les interventions par agence
SELECT 
    i.id,
    i.address as adresse,
    i.context as description,
    i.status as statut,
    i.created_date as cree,
    i.intervention_date as echeance,
    i.tenant_name as client,
    a.name as artisan,
    ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE ag.name = ?
ORDER BY i.created_at DESC;


-- get_interventions_by_artisan

-- Récupérer les interventions par artisan
SELECT 
    i.id,
    i.address as adresse,
    i.context as description,
    i.status as statut,
    i.created_date as cree,
    i.intervention_date as echeance,
    i.tenant_name as client,
    a.name as artisan,
    ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE a.name = ?
ORDER BY i.created_at DESC;


-- get_overdue_interventions

-- Récupérer les interventions en retard
SELECT 
    i.id,
    i.address as adresse,
    i.context as description,
    i.status as statut,
    i.created_date as cree,
    i.intervention_date as echeance,
    i.tenant_name as client,
    a.name as artisan,
    ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    JULIANDAY('now') - JULIANDAY(i.intervention_date) as jours_retard
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.status = 'en_cours' 
  AND i.intervention_date < date('now')
ORDER BY i.intervention_date ASC;


-- get_intervention_stats

-- Statistiques des interventions
SELECT 
    COUNT(*) as total_interventions,
    COUNT(CASE WHEN status = 'demande' THEN 1 END) as demandes,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN status = 'termine' THEN 1 END) as terminees,
    COUNT(CASE WHEN status = 'sav' THEN 1 END) as sav,
    COUNT(CASE WHEN status = 'visite_technique' THEN 1 END) as visites_techniques,
    COUNT(CASE WHEN status = 'en_cours' AND intervention_date < date('now') THEN 1 END) as retards,
    SUM(sst_cost + material_cost + intervention_cost) as montant_total,
    AVG(sst_cost + material_cost + intervention_cost) as montant_moyen
FROM interventions;


-- get_stats_by_agency

-- Statistiques par agence
SELECT 
    ag.name as agence,
    COUNT(*) as total_interventions,
    COUNT(CASE WHEN i.status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN i.status = 'termine' THEN 1 END) as terminees,
    SUM(i.sst_cost + i.material_cost + i.intervention_cost) as montant_total
FROM interventions i
LEFT JOIN agencies ag ON i.agency_id = ag.id
GROUP BY ag.name
ORDER BY total_interventions DESC;


-- get_stats_by_artisan

-- Statistiques par artisan
SELECT 
    a.name as artisan,
    COUNT(*) as total_interventions,
    COUNT(CASE WHEN i.status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN i.status = 'termine' THEN 1 END) as terminees,
    SUM(i.sst_cost + i.material_cost + i.intervention_cost) as montant_total
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
GROUP BY a.name
ORDER BY total_interventions DESC;


-- get_intervention_comments

-- Récupérer les commentaires d'une intervention
SELECT 
    c.id,
    c.content as description,
    c.author as user_name,
    c.created_at as timestamp
FROM comments c
WHERE c.entity_type = 'intervention' 
  AND c.entity_id = ?
ORDER BY c.created_at DESC;


-- search_interventions

-- Recherche d'interventions
SELECT 
    i.id,
    i.address as adresse,
    i.context as description,
    i.status as statut,
    i.created_date as cree,
    i.intervention_date as echeance,
    i.tenant_name as client,
    a.name as artisan,
    ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.context LIKE ? 
   OR i.address LIKE ? 
   OR i.tenant_name LIKE ? 
   OR a.name LIKE ? 
   OR ag.name LIKE ?
ORDER BY i.created_at DESC;


