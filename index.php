<?php
declare(strict_types=1);


require $_SERVER['DOCUMENT_ROOT'] . '/include/autoload.php';


// Chargement des données
$titre = "Site du VDS";
// Chargement des derniers classements présents dans le répertoire 'data/classement'
$lesClassements = json_encode(Classement::getAll());

// Prochaine édition des 4 saisons
$prochaineEdition = json_encode(Epreuve::getProchaineEpreuve());
// récupération du contenu de la page mentions légales et de la politique de confidentialité

//Inscriptions aux épreuves
$lesInscriptions = Inscription::getAll();
$lesInscriptions = json_encode($lesInscriptions);

// transmission des données à l'interface
$head = <<<HTML
    <script>
        const prochaineEdition = $prochaineEdition;
        const lesClassements = $lesClassements;
        const lesInscriptions = $lesInscriptions;
    </script>
HTML;

// chargement de l'interface
require RACINE . "/include/interface.php";


