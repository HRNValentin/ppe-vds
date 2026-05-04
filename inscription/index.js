import {appelAjax} from '/composant/fonction/ajax.js';
import {messageBox} from '/composant/fonction/afficher.js';

/*
  inscription/index.js
  - Utilise les composants partagés pour réduire le code (appelAjax, messageBox)
*/

document.addEventListener('DOMContentLoaded', () => {
    const liste = document.getElementById('liste-inscriptions');
    if (!liste) return;

    // Afficher les éléments renvoyés par l'API
    function renderItems(items) {
        if (!items || items.length === 0) {
            liste.innerHTML = '<p class="text-muted">Aucune inscription disponible pour le moment.</p>';
            return;
        }

        // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        liste.innerHTML = '';
        let hasOpen = false;
        let hasFuture = false;

        for (const item of items) {
            // Déterminer le statut de l'inscription
            const isOpen = item.dateOuverture <= today && item.dateCloture >= today;
            const isFuture = item.dateOuverture > today;

            if (!isOpen && !isFuture) continue; // Ignorer les passées

            const div = document.createElement('div');
            div.className = 'mb-4 p-3';
            div.style.borderLeft = isOpen ? '4px solid #28a745' : '4px solid #ffc107';
            div.style.backgroundColor = isOpen ? '#f0f8f0' : '#fff8f0';
            
            const dateEpreuveFr = formatDateFr(item.dateEpreuve);
            const dateClotureFr = formatDateFr(item.dateCloture);
            const dateOuvertureFr = formatDateFr(item.dateOuverture);
            
            let html = `
                <div style="margin-bottom: 8px;">
                    <strong style="font-size: 1.1rem;">${escapeHtml(dateEpreuveFr)}</strong>
                    ${isOpen ? '<span class="badge bg-success ms-2">Ouvert</span>' : '<span class="badge bg-warning ms-2">Prochainement</span>'}
                </div>
                <div style="margin-bottom: 8px; color: #666;">
                    ${escapeHtml(item.nom)}
                </div>`;

            if (isOpen) {
                html += `
                <div style="margin-bottom: 8px; font-size: 0.95rem; color: #666;">
                    Inscriptions fermées le : ${dateClotureFr}
                </div>
                <div style="margin-bottom: 12px;">`;
                
                if (item.lienInscription && item.lienInscription !== '0') {
                    html += `<a href="${escapeHtml(item.lienInscription)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-danger me-2">S'inscrire</a>`;
                }
                
                if (item.lienInscrit && item.lienInscrit !== '0') {
                    html += `<a href="${escapeHtml(item.lienInscrit)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">Voir les inscrits</a>`;
                }
                
                html += `</div>`;
            } else if (isFuture) {
                html += `
                <div style="margin-bottom: 8px; font-size: 0.95rem; color: #666;">
                    Ouverture des inscriptions : ${dateOuvertureFr}
                </div>
                <div style="margin-bottom: 12px; font-size: 0.9rem; color: #999; font-style: italic;">
                    Les inscriptions ne sont pas encore ouvertes.
                </div>`;
            }

            div.innerHTML = html;
            liste.appendChild(div);

            if (isOpen) hasOpen = true;
            if (isFuture) hasFuture = true;
        }

        if (!hasOpen && !hasFuture) {
            liste.innerHTML = '<p class="text-muted">Aucune inscription disponible pour le moment.</p>';
        }
    }

    // Fonction d'échappement HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Chargement des données
    function loadAndRender(sortField = null) {
        appelAjax({
            url: '/inscription/ajax/lister.php',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (!data) {
                    liste.innerHTML = '<p class="muted">Impossible de charger les inscriptions pour le moment.</p>';
                    return;
                }
                if (sortField) {
                    data.sort(function(a, b) {
                        return (a[sortField] || '').localeCompare(b[sortField] || '');
                    });
                }
                renderItems(data);
            },
            error: function() {
                liste.innerHTML = '<p class="muted">Impossible de charger les inscriptions pour le moment.</p>';
            }
        });
    }

    // simple: convertit YYYY-MM-DD en '16 novembre 2025'
    function formatDateFr(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
        const y = parts[0], m = parseInt(parts[1], 10), d = parseInt(parts[2], 10);
        if (isNaN(m) || isNaN(d)) return dateStr;
        return d + ' ' + months[m - 1] + ' ' + y;
    }

    // Chargement initial
    loadAndRender();
});
