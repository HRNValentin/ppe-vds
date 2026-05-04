<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../include/autoload.php';

try {
    // On attend les champs en POST
    $id = isset($_POST['id']) && $_POST['id'] !== '' ? (int)$_POST['id'] : null;
    $nom = trim($_POST['nom'] ?? '');
    $dateEpreuve = $_POST['dateEpreuve'] ?? null;
    $dateOuverture = $_POST['dateOuverture'] ?? null;
    $dateCloture = $_POST['dateCloture'] ?? null;
    $lienInscription = trim($_POST['lienInscription'] ?? '');
    $lienInscrit = trim($_POST['lienInscrit'] ?? '');

    // Validation minimale
    if ($nom === '' || !$dateEpreuve || !$dateOuverture || !$dateCloture) {
        http_response_code(400);
        echo json_encode(['error' => ['global' => 'Champs manquants']]);
        exit;
    }

    require_once __DIR__ . '/../../../classemetier/inscription.php';
    $data = [
        'id' => $id,
        'nom' => $nom,
        'dateEpreuve' => $dateEpreuve,
        'dateOuverture' => $dateOuverture,
        'dateCloture' => $dateCloture,
        'lienInscription' => $lienInscription,
        'lienInscrit' => $lienInscrit
    ];
    $result = Inscription::save($data);
    if ($result) {
        echo json_encode(['success' => true, 'id' => $result], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['error' => ['global' => 'Sauvegarde impossible']], JSON_UNESCAPED_UNICODE);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => ['system' => 'Erreur serveur']], JSON_UNESCAPED_UNICODE);
}
