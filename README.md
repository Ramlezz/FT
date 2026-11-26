# FT CONNECT — UMBB Boumerdès (Faculté des Sciences · Faculté de Technologie)

Portail numérique conçu pour l'**Université M'Hamed Bougara de Boumerdès (UMBB)** :
- **Faculté de Technologie (FT)** : Cité Frantz Fanon (Campus Ouest), 35000 Boumerdès
- **Faculté des Sciences (FS)** : Route de la Gare Ferroviaire (Campus Sud), 35000 Boumerdès
- Site officiel de l'université : [www.univ-boumerdes.dz](https://www.univ-boumerdes.dz)

Projet universitaire **M2RT 2026–2027** réalisé par **Riad Akli, Lounis, Bourai et Sofiane Hammoum**.

Ce site web est développé **exclusivement en HTML5, CSS3 et JavaScript pur** (sans framework, sans serveur backend obligatoire, sans MySQL ni PHP).

---

## 1. Structure du projet

```text
├── index.html                  # Point d'entrée HTML5 sémantique
├── css/
│   └── styles.css              # Feuille de style CSS3 (Thème clair/sombre, responsive, print)
├── js/
│   ├── data.js                 # Données de démonstration chargées par le navigateur
│   ├── icons.js                # Icônes SVG inline sans dépendance externe
│   ├── storage.js              # Persistance LocalStorage (thème, réclamations, départements ajoutés)
│   ├── export.js               # Générateur PDF 1.4 & Excel (.xls) 100 % JavaScript pur
│   ├── pages.js                # Vues de toutes les pages du portail
│   └── app.js                  # Routeur par hash (#/), recherche globale, notifications, modales
├── data/                       # Fichiers JSON sources facilement modifiables
│   ├── actualites.json
│   ├── calendrier.json
│   ├── departements.json
│   ├── emploisDuTemps.json
│   ├── enseignants.json
│   ├── etudiants.json
│   └── faq.json
├── assets/images/              # Photographies du campus et des laboratoires
└── rapport_ft_connect_m2rt.pdf # Rapport du projet prêt à télécharger
```

---

## 2. Lancer le site localement

Aucune installation n'est obligatoire :
- Ouvrez directement **`index.html`** dans votre navigateur (Chrome, Firefox, Edge, Safari) — ou utilisez *Live Server* dans VS Code.

---

## 3. Héberger gratuitement en 1 minute (sans compilation)

Comme il s'agit uniquement de fichiers **HTML, CSS et JavaScript**, vous pouvez publier directement le dossier du projet :

### Option A : Netlify Drop (la plus rapide)
1. Rendez-vous sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Glissez-déposez directement le dossier décompressé contenant `index.html`, `css/`, `js/` et `assets/`.
3. Votre lien public est immédiatement en ligne !

### Option B : GitHub Pages
1. Créez un dépôt sur GitHub et envoyez `index.html`, `css/`, `js/`, `assets/`, `data/` et `rapport_ft_connect_m2rt.pdf`.
2. Allez dans **Settings → Pages**, choisissez la branche `main` (`/ (root)`) et enregistrez.
3. Le site fonctionne immédiatement sans étape de build ni erreur 404.

---

## 4. Fonctionnalités nécessitant un backend en production réelle

1. **Envoi réel des réclamations** : sauvegardées dans `LocalStorage` pour la démonstration ; en production, relier le formulaire à une API ou à un service externe (*Netlify Forms*, *Formspree*).
2. **Espace d'administration sécurisé** : mise à jour centralisée des emplois du temps et des listes d'étudiants par la scolarité.
