"use strict";

import {appelAjax} from "/composant/fonction/ajax.js";
import {messageBox, confirmer} from "/composant/fonction/afficher.js";

// Simple admin CRUD pour la table `inscription`
// HTML: index.html (form + table)
// JS:  liste, save et delete via les endpoints ajax/save.php et ajax/delete.php

const lesLignes = document.getElementById('lesLignes');
const nb = document.getElementById('nb');

const form = document.getElementById('form-inscription');
const inputId = document.getElementById('insc-id');
const inputNom = document.getElementById('insc-nom');
const inputDateEpreuve = document.getElementById('insc-dateEpreuve');
const inputDateOuverture = document.getElementById('insc-dateOuverture');
const inputDateCloture = document.getElementById('insc-dateCloture');
const inputLienInscription = document.getElementById('insc-lienInscription');
const inputLienInscrit = document.getElementById('insc-lienInscrit');
const btnReset = document.getElementById('btn-reset');

// Efface le formulaire
function resetForm() {
    inputId.value = '';
    form.reset();
}

// Remplit le formulaire (pour édition)
function fillForm(item) {
    inputId.value = item.id;
    inputNom.value = item.nom;
    inputDateEpreuve.value = item.dateEpreuve;
    inputDateOuverture.value = item.dateOuverture;
    inputDateCloture.value = item.dateCloture;
    inputLienInscription.value = item.lienInscription || '';
    inputLienInscrit.value = item.lienInscrit || '';
    
    // Afficher les dates au format français
    updateDateDisplays();
}

// Rendu simple de la liste
function renderList(items) {
    lesLignes.innerHTML = '';
    nb.innerText = items.length;
    for (const it of items) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(it.nom)}</strong></td>
            <td>${escapeHtml(formatDateFr(it.dateEpreuve))}</td>
            <td>${escapeHtml(formatDateFr(it.dateOuverture))}</td>
            <td>${escapeHtml(formatDateFr(it.dateCloture))}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-edit me-2" data-id="${it.id}" title="Éditer">
                    ✎ Éditer
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${it.id}" title="Supprimer">
                    ✕ Supprimer
                </button>
            </td>`;
        lesLignes.appendChild(tr);
    }

    // délégation d'événement pour éditer / supprimer
    lesLignes.querySelectorAll('.btn-edit').forEach(b => b.onclick = (e) => {
        const id = e.currentTarget.dataset.id;
        appelAjax({url: '/administration/inscription/ajax/lister.php', method: 'GET', dataType: 'json', success: (data) => {
            const item = data.find(x => String(x.id) === String(id));
            if (item) fillForm(item);
        }});
    });

    lesLignes.querySelectorAll('.btn-delete').forEach(b => b.onclick = (e) => {
        const id = e.currentTarget.dataset.id;
        confirmer('Êtes-vous sûr de vouloir supprimer cette inscription ?', () => {
            appelAjax({
                url: 'ajax/delete.php',
                method: 'POST',
                data: {id},
                success: () => {
                    messageBox('Inscription supprimée avec succès');
                    loadList();
                },
                error: (err) => {
                    messageBox('Erreur lors de la suppression', 'error');
                }
            });
        });
    });
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function(ch) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
}

// Met à jour l'affichage des dates au format français (JJ/MM/AAAA)
function updateDateDisplays() {
    const displayEpreuve = document.getElementById('display-dateEpreuve');
    const displayOuverture = document.getElementById('display-dateOuverture');
    const displayCloture = document.getElementById('display-dateCloture');
    
    if (displayEpreuve) displayEpreuve.textContent = formatDateFrNumeric(inputDateEpreuve.value);
    if (displayOuverture) displayOuverture.textContent = formatDateFrNumeric(inputDateOuverture.value);
    if (displayCloture) displayCloture.textContent = formatDateFrNumeric(inputDateCloture.value);
}

// Ajout des event listeners pour mise à jour en temps réel
inputDateEpreuve.addEventListener('change', updateDateDisplays);
inputDateOuverture.addEventListener('change', updateDateDisplays);
inputDateCloture.addEventListener('change', updateDateDisplays);

// formatte une date `YYYY-MM-DD` en français : "16 novembre 2025"
function formatDateFr(dateStr) {
    if (!dateStr) return '';
    // dateStr attendu au format YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    const y = parts[0], m = parseInt(parts[1], 10), d = parseInt(parts[2], 10);
    if (isNaN(m) || isNaN(d)) return dateStr;
    return d + ' ' + months[m - 1] + ' ' + y;
}

// Formate une date `YYYY-MM-DD` en format numérique français : "06/05/2026" (JJ/MM/AAAA)
function formatDateFrNumeric(dateStr) {
    if (!dateStr) return '';
    
    // Parser la date de manière robuste
    const date = new Date(dateStr + 'T00:00:00Z');
    
    // Extraire jour, mois, année
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return day + '/' + month + '/' + year;
}

// Charge la liste depuis le serveur
function loadList() {
    appelAjax({
        url: 'ajax/lister.php',
        method: 'GET',
        dataType: 'json',
        success: (data) => renderList(data),
        error: () => lesLignes.innerHTML = '<tr><td colspan="5">Impossible de charger</td></tr>'
    });
}

// Enregistrement via save.php
form.onsubmit = function (e) {
    e.preventDefault();
    // Récupération des valeurs de date
    const dateOuverture = inputDateOuverture.value;
    const dateCloture = inputDateCloture.value;
    const dateEpreuve = inputDateEpreuve.value;

    // Vérification des dates (format YYYY-MM-DD)
    if (dateCloture < dateOuverture) {
        messageBox('Erreur : la date de clôture ne doit pas être avant la date d\'ouverture.', 'error');
        return;
    }
    if (dateEpreuve < dateCloture) {
        messageBox('Erreur : la date d\'épreuve ne doit pas être avant la date de clôture.', 'error');
        return;
    }

    const formData = new FormData(form);
    appelAjax({
        url: 'ajax/save.php',
        method: 'POST',
        data: formData,
        success: (res) => {
            messageBox('Enregistré');
            resetForm();
            loadList();
        },
        error: (error) => {
            messageBox('Erreur lors de l\'enregistrement : ' + (error?.responseText || 'Erreur serveur'), 'error');
        }
    });
};

btnReset.onclick = resetForm;

// initial
loadList();