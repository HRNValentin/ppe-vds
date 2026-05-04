<?php
/**
 * Classe de gestion des inscriptions
 */
class Inscription extends table
{
    public function __construct()
    {
        parent::__construct('inscription');
    }

    /**
     * Supprime une inscription par id (méthode statique wrapper)
     * @param int $id
     * @return bool
     */
    public static function supprime(string|int $id): bool
    {
        $db = Database::getInstance();
        $sql = "DELETE FROM inscription WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Retourne toutes les inscriptions
     * @return array
     */
    public static function getAll(): array
    {
        $sql = "SELECT id, nom, dateEpreuve, dateOuverture, dateCloture, lienInscription, lienInscrit FROM inscription ORDER BY dateEpreuve";
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * Retourne les inscriptions dont la date d'ouverture <= today <= dateCloture
     * @return array
     */
    public static function getOpen(): array
    {
        $sql = <<<SQL
SELECT id, nom, dateEpreuve, dateOuverture, dateCloture, lienInscription, lienInscrit
FROM inscription
WHERE dateOuverture <= curdate() AND dateCloture >= curdate()
ORDER BY dateEpreuve;
SQL;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * Sauvegarde (insert ou update) une ligne d'inscription
     * @param array $data
     * @return int|false id inséré ou false
     */
    public static function save(array $data)
    {
        $db = Database::getInstance();

        if (!empty($data['id'])) {
            $sql = "UPDATE inscription SET nom = :nom, dateEpreuve = :dateEpreuve, dateOuverture = :dateOuverture, dateCloture = :dateCloture, lienInscription = :lienInscription, lienInscrit = :lienInscrit WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                'nom' => $data['nom'],
                'dateEpreuve' => $data['dateEpreuve'],
                'dateOuverture' => $data['dateOuverture'],
                'dateCloture' => $data['dateCloture'],
                'lienInscription' => $data['lienInscription'],
                'lienInscrit' => $data['lienInscrit'],
                'id' => $data['id']
            ]);
            return $stmt->rowCount();
        }

        $sql = "INSERT INTO inscription (nom, dateEpreuve, dateOuverture, dateCloture, lienInscription, lienInscrit) VALUES (:nom, :dateEpreuve, :dateOuverture, :dateCloture, :lienInscription, :lienInscrit)";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            'nom' => $data['nom'],
            'dateEpreuve' => $data['dateEpreuve'],
            'dateOuverture' => $data['dateOuverture'],
            'dateCloture' => $data['dateCloture'],
            'lienInscription' => $data['lienInscription'],
            'lienInscrit' => $data['lienInscrit']
        ]);
        return (int)$db->lastInsertId();
    }
}
