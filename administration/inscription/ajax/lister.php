<?php
declare(strict_types=1);
// Endpoint AJAX : retourne la liste des inscriptions au format JSON
header('Content-Type: application/json; charset=utf-8');
// Indique que c'est une réponse AJAX
if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest') {
    // on ne bloque pas l'accès mais on conserve l'information
}

require_once __DIR__ . '/../../../include/autoload.php';

try {
    require_once __DIR__ . '/../../../classemetier/inscription.php';
    $result = Inscription::getAll();
    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => ['system' => 'Erreur serveur']], JSON_UNESCAPED_UNICODE);
}
