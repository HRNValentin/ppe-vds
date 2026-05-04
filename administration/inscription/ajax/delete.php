<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../include/autoload.php';

try {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => ['global' => 'Identifiant manquant']]);
        exit;
    }
    require_once __DIR__ . '/../../../classemetier/inscription.php';
    $result = Inscription::supprime($id);
    if ($result) {
        echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['error' => ['global' => 'Suppression impossible']], JSON_UNESCAPED_UNICODE);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => ['system' => 'Erreur serveur']], JSON_UNESCAPED_UNICODE);
}
