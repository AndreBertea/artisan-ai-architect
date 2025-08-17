-- Requêtes SQL générées pour le frontend
-- Générées automatiquement après import CSV

-- get_all_interventions

-- 1. Récupérer toutes les interventions avec pagination
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
ORDER BY i.created_at DESC
LIMIT ? OFFSET ?;

-- get_intervention_by_id

-- 2. Récupérer une intervention par ID
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.id = ?;

-- get_interventions_by_status

-- 3. Filtrer par statut
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.status = ?
ORDER BY i.created_at DESC;

-- get_interventions_by_agency

-- 4. Filtrer par agence
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE ag.name = ?
ORDER BY i.created_at DESC;

-- get_interventions_by_artisan

-- 5. Filtrer par artisan
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE a.name = ?
ORDER BY i.created_at DESC;

-- get_overdue_interventions

-- 6. Interventions en retard
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.intervention_date < DATE('now') AND i.status IN ('demande', 'en_cours')
ORDER BY i.intervention_date ASC;

-- get_intervention_stats

-- 7. Statistiques globales
SELECT
    COUNT(*) as total_interventions,
    COUNT(CASE WHEN status = 'demande' THEN 1 END) as demandes,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN status = 'terminee' THEN 1 END) as terminees,
    COUNT(CASE WHEN status = 'annulee' THEN 1 END) as annulees,
    SUM(sst_cost + material_cost + intervention_cost) as montant_total,
    AVG(sst_cost + material_cost + intervention_cost) as montant_moyen
FROM interventions;

-- get_agency_stats

-- 8. Statistiques par agence
SELECT
    ag.name as agence,
    COUNT(i.id) as nombre_interventions,
    SUM(i.sst_cost + i.material_cost + i.intervention_cost) as montant_total
FROM agencies ag
LEFT JOIN interventions i ON ag.id = i.agency_id
GROUP BY ag.id, ag.name
ORDER BY nombre_interventions DESC;

-- get_artisan_stats

-- 9. Statistiques par artisan
SELECT
    a.name as artisan,
    COUNT(i.id) as nombre_interventions,
    SUM(i.sst_cost + i.material_cost + i.intervention_cost) as montant_total
FROM artisans a
LEFT JOIN interventions i ON a.id = i.artisan_id
GROUP BY a.id, a.name
ORDER BY nombre_interventions DESC;

-- search_interventions

-- 10. Recherche textuelle
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE 
    i.address LIKE ? OR 
    i.context LIKE ? OR 
    i.tenant_name LIKE ? OR
    a.name LIKE ? OR
    ag.name LIKE ?
ORDER BY i.created_at DESC;

-- get_recent_interventions

-- 11. Interventions récentes (7 derniers jours)
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.created_at >= DATE('now', '-7 days')
ORDER BY i.created_at DESC;

-- get_high_priority_interventions

-- 12. Interventions prioritaires
SELECT
    i.id, i.address as adresse, i.context as description, i.status as statut,
    i.created_date as cree, i.intervention_date as echeance,
    i.sst_cost as cout_sst, i.material_cost as cout_materiaux, i.intervention_cost as cout_interventions,
    i.tenant_name as client, i.tenant_phone as client_telephone, i.tenant_email as client_email,
    i.manager as utilisateur_assigne, a.name as artisan, ag.name as agence,
    CONCAT('INT-', LPAD(i.id, 6, '0')) as reference,
    i.created_at, i.updated_at
FROM interventions i
LEFT JOIN artisans a ON i.artisan_id = a.id
LEFT JOIN agencies ag ON i.agency_id = ag.id
WHERE i.priority IN ('haute', 'urgente')
ORDER BY i.created_at DESC;

