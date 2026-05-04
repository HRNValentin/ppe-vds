use ppe;

set foreign_key_checks = 1;

-- =======================================================================================
-- DÉCLENCHEUR : Validation avant INSERTION dans la table inscription
-- =======================================================================================
-- Vérifie que les dates sont cohérentes et les URLs valides
-- =======================================================================================

DROP TRIGGER IF EXISTS avantAjoutInscription;

DELIMITER $$
CREATE TRIGGER avantAjoutInscription
BEFORE INSERT ON inscription
FOR EACH ROW
BEGIN
    DECLARE exit_handler CONDITION FOR SQLSTATE '45000';
    
    -- Validation 1 : La date de clôture ne peut pas être avant la date d'ouverture
    IF NEW.dateCloture < NEW.dateOuverture THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : la date de clôture ne peut pas être avant la date d\'ouverture';
    END IF;
    
    -- Validation 2 : La date d'épreuve ne peut pas être avant la date de clôture
    IF NEW.dateEpreuve < NEW.dateCloture THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : la date d\'épreuve ne peut pas être avant la date de clôture';
    END IF;
    
    -- Validation 3 : Les liens doivent être valides (commencer par http/https ou être '0')
    IF NEW.lienInscription != '0' AND NEW.lienInscription NOT LIKE 'http://%' AND NEW.lienInscription NOT LIKE 'https://%' THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : le lien d\'inscription doit commencer par http:// ou https://';
    END IF;
    
    IF NEW.lienInscrit != '0' AND NEW.lienInscrit NOT LIKE 'http://%' AND NEW.lienInscrit NOT LIKE 'https://%' THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : le lien inscrit doit commencer par http:// ou https://';
    END IF;
    
    -- Validation 4 : Le nom ne doit pas être vide
    IF TRIM(NEW.nom) = '' THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : le nom de l\'épreuve ne peut pas être vide';
    END IF;

END$$
DELIMITER ;

-- =======================================================================================
-- DÉCLENCHEUR : Validation avant MODIFICATION dans la table inscription
-- =======================================================================================
-- Même validation qu'à l'insertion pour garantir l'intégrité des données
-- =======================================================================================

DROP TRIGGER IF EXISTS avantModificationInscription;

DELIMITER $$
CREATE TRIGGER avantModificationInscription
BEFORE UPDATE ON inscription
FOR EACH ROW
BEGIN
    DECLARE exit_handler CONDITION FOR SQLSTATE '45000';
    
    -- Validation 1 : La date de clôture ne peut pas être avant la date d'ouverture
    IF NEW.dateCloture < NEW.dateOuverture THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : la date de clôture ne peut pas être avant la date d\'ouverture';
    END IF;
    
    -- Validation 2 : La date d'épreuve ne peut pas être avant la date de clôture
    IF NEW.dateEpreuve < NEW.dateCloture THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : la date d\'épreuve ne peut pas être avant la date de clôture';
    END IF;
    
    -- Validation 3 : Les liens doivent être valides (commencer par http/https ou être '0')
    IF NEW.lienInscription != '0' AND NEW.lienInscription NOT LIKE 'http://%' AND NEW.lienInscription NOT LIKE 'https://%' THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : le lien d\'inscription doit commencer par http:// ou https://';
    END IF;
    
    IF NEW.lienInscrit != '0' AND NEW.lienInscrit NOT LIKE 'http://%' AND NEW.lienInscrit NOT LIKE 'https://%' THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : le lien inscrit doit commencer par http:// ou https://';
    END IF;
    
    -- Validation 4 : Le nom ne doit pas être vide
    IF TRIM(NEW.nom) = '' THEN
        SIGNAL exit_handler
        SET MESSAGE_TEXT = 'Erreur : le nom de l\'épreuve ne peut pas être vide';
    END IF;

END$$
DELIMITER ;

-- Affichage des déclencheurs créés
SELECT TRIGGER_SCHEMA, TRIGGER_NAME, ACTION_STATEMENT
FROM INFORMATION_SCHEMA.TRIGGERS
WHERE TRIGGER_SCHEMA = 'ppe' AND TRIGGER_NAME LIKE '%Inscription';
