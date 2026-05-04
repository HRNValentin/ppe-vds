<?php
declare(strict_types=1);
/**
 * Endpoint AJAX public pour lister TOUTES les inscriptions (y compris futures)
 * Endpoint accessible sans authentification
 * Le filtrage par statut (ouvert/futur/passé) se fait en JavaScript
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../include/autoload.php';

try {
    require_once __DIR__ . '/../../classemetier/inscription.php';
    // Retourne TOUTES les inscriptions, ordonnées par date
    $result = Inscription::getAll();
    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => ['system' => 'Erreur serveur']], JSON_UNESCAPED_UNICODE);
}
