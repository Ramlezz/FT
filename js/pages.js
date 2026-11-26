// Rendu des 12 vues FT CONNECT en JavaScript pur
window.FT_PAGES = (function () {
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeImg(src, alt, fallbackTitle, cls) {
    var safeSrc = esc(src || '');
    var safeAlt = esc(alt || '');
    var safeTitle = esc(fallbackTitle || alt || '');
    return (
      '<img src="' +
      safeSrc +
      '" alt="' +
      safeAlt +
      '" referrerpolicy="no-referrer" class="' +
      esc(cls || '') +
      '" onerror="this.outerHTML=\'<div style=&quot;height:100%;min-height:180px;display:flex;align-items:center;justify-content:center;background:#0b1f3a;color:#e2e8f0;padding:16px;text-align:center;font-size:12px;&quot;>' +
      safeTitle.replace(/'/g, '') +
      '</div>\'" />'
    );
  }

  function renderHome(ctx) {
    var I = window.FT_ICONS;
    var leadNews = ctx.news.find(function (n) { return n.aLaUne; }) || ctx.news[0];
    var secondaryNews = ctx.news.filter(function (n) { return n.id !== leadNews.id; }).slice(0, 3);
    var upcoming = ctx.calendarEvents.slice(1, 5);

    var deptCards = ctx.departments
      .map(function (d) {
        return (
          '<article class="card" style="display:flex;flex-direction:column;">' +
          '<div class="card-media-43">' +
          safeImg(d.image, 'Laboratoire du département ' + d.nom, d.nom) +
          '</div>' +
          '<div class="card-pad" style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">' +
          '<div>' +
          '<div class="meta-line" style="margin-bottom:8px;">' +
          '<span class="meta-code">' + esc(d.code) + '</span>' +
          '<span>·</span><span>' + esc(d.faculte || 'Faculté de Technologie') + '</span>' +
          '<span>·</span><span>' + esc(d.niveaux.join(' / ')) + '</span>' +
          '</div>' +
          '<h3 class="card-title">' + esc(d.nom) + '</h3>' +
          '<p class="card-desc">' + esc(d.description) + '</p>' +
          '</div>' +
          '<div class="card-footer-row">' +
          '<span style="font-size:0.76rem;color:var(--text-muted);">' + esc(d.responsable.nom) + '</span>' +
          '<button type="button" class="link-action" data-nav="/departements/' + esc(d.id) + '">Consulter ' + I.arrowRight + '</button>' +
          '</div>' +
          '</div></article>'
        );
      })
      .join('');

    var secondaryHtml = secondaryNews
      .map(function (n) {
        return (
          '<div style="padding:18px 20px;border-top:1px solid var(--border-color);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">' +
          '<div style="flex:1;min-width:220px;">' +
          '<div class="meta-line" style="margin-bottom:4px;"><span style="color:var(--sky);font-weight:600;">' + esc(n.categorie) + '</span><span>·</span><span class="font-mono tabular-nums">' + esc(n.date) + '</span></div>' +
          '<h3 style="font-size:0.98rem;font-weight:600;">' + esc(n.titre) + '</h3>' +
          '<p style="font-size:0.84rem;color:var(--text-secondary);margin-top:4px;">' + esc(n.resume) + '</p>' +
          '</div>' +
          '<button type="button" class="link-action" data-nav="/actualites">Détails</button>' +
          '</div>'
        );
      })
      .join('');

    var eventsHtml = upcoming
      .map(function (ev) {
        return (
          '<div style="padding:16px;border-bottom:1px solid var(--border-subtle);">' +
          '<div class="meta-line" style="justify-content:space-between;margin-bottom:4px;">' +
          '<span class="font-mono tabular-nums" style="font-weight:600;color:var(--sky);">' + esc(ev.dateDebut) + '</span>' +
          '<span>' + esc(ev.type) + '</span></div>' +
          '<h3 style="font-size:0.9rem;font-weight:600;">' + esc(ev.titre) + '</h3>' +
          '<p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">' + esc(ev.concerne) + '</p>' +
          '</div>'
        );
      })
      .join('');

    var deptSiteMapLinks = ctx.departments
      .slice(0, 4)
      .map(function (d) {
        return (
          '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/departements/' +
          esc(d.id) +
          '">' +
          esc(d.nom) +
          '</button></li>'
        );
      })
      .join('');

    return (
      '<section class="hero-banner">' +
      '<div class="hero-bg">' +
      safeImg('./assets/images/hero_campus_tech_1795627236147.jpg', 'Campus de l’Université M’Hamed Bougara de Boumerdès', 'UMBB Boumerdès') +
      '<div class="hero-scrim" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="container hero-content">' +
      '<div class="hero-grid">' +
      '<div>' +
      '<p class="hero-eyebrow">Université M’Hamed Bougara de Boumerdès (UMBB) · Faculté des Sciences · Faculté de Technologie</p>' +
      '<h1 class="hero-title">Portail centralisé pour les départements, emplois du temps et services étudiants.</h1>' +
      '<p class="hero-desc">Bienvenue sur <strong>FT CONNECT</strong>, l’espace numérique dédié aux étudiants de l’<strong>UMBB Boumerdès</strong> (Faculté de Technologie · Campus Ouest &amp; Faculté des Sciences · Campus Sud) : plannings, annuaire des enseignants, listes et réclamations.</p>' +
      '<div class="hero-actions">' +
      '<button type="button" class="btn-hero-cta" data-nav="/emplois-du-temps">' + I.clock + '<span>Consulter les emplois du temps</span></button>' +
      '<button type="button" class="btn-hero-ghost" data-nav="/departements"><span>Explorer les départements</span>' + I.arrowRight + '</button>' +
      '</div></div>' +
      '<div class="hero-emblem-card">' +
      '<img src="./assets/images/umbb_ft_logo.jpeg" alt="Emblème Université M’Hamed Bougara de Boumerdès" class="hero-crest-img" />' +
      '<div>' +
      '<p style="font-size:0.75rem;color:#fcd34d;font-weight:600;letter-spacing:0.04em;">UMBB · BOUMERDÈS 35000</p>' +
      '<h2 style="font-size:1.05rem;font-weight:700;color:#ffffff;margin-top:4px;">Université M’Hamed Bougara</h2>' +
      '<p style="font-size:0.8rem;color:#cbd5e1;margin-top:6px;line-height:1.5;">Faculté des Sciences (Campus Sud) · Faculté de Technologie (Campus Ouest · Cité Frantz Fanon)</p>' +
      '</div>' +
      '<a href="https://www.univ-boumerdes.dz" target="_blank" rel="noopener noreferrer" style="font-size:0.78rem;color:#7dd3fc;text-decoration:underline;font-weight:500;">www.univ-boumerdes.dz</a>' +
      '</div>' +
      '</div></div></section>' +

      '<section class="container shortcuts-strip">' +
      '<div class="grid-4">' +
      '<button type="button" class="card-interactive" data-nav="/emplois-du-temps">' +
      '<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;color:var(--sky);">' + I.clock + I.arrowRight + '</div>' +
      '<h2 class="card-title" style="font-size:1rem;">Emplois du temps</h2>' +
      '<p class="card-desc">Filtrez par spécialité et groupe, imprimez ou exportez en PDF.</p></div></button>' +

      '<button type="button" class="card-interactive" data-nav="/enseignants">' +
      '<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;color:var(--teal);">' + I.users + I.arrowRight + '</div>' +
      '<h2 class="card-title" style="font-size:1rem;">Annuaire enseignants</h2>' +
      '<p class="card-desc">' + ctx.teachers.length + ' fiches disponibles avec recherche et envoi d’email.</p></div></button>' +

      '<button type="button" class="card-interactive" data-nav="/etudiants">' +
      '<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;color:var(--gold);">' + I.spreadsheet + I.arrowRight + '</div>' +
      '<h2 class="card-title" style="font-size:1rem;">Listes des étudiants</h2>' +
      '<p class="card-desc">' + ctx.students.length + ' dossiers démo filtrables avec export PDF et Excel.</p></div></button>' +

      '<button type="button" class="card-interactive" data-nav="/reclamations">' +
      '<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;color:var(--sky);">' + I.message + I.arrowRight + '</div>' +
      '<h2 class="card-title" style="font-size:1rem;">Réclamations</h2>' +
      '<p class="card-desc">Signalez une erreur de groupe, de note ou de planning.</p></div></button>' +
      '</div></section>' +

      '<section class="container page-section" style="padding-bottom:12px;">' +
      '<div class="card card-pad">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:20px;padding-bottom:20px;border-bottom:1px solid var(--border-color);margin-bottom:22px;">' +
      '<img src="./assets/images/umbb_ft_logo.jpeg" alt="Logo UMBB Boumerdès" class="umbb-crest-md" />' +
      '<div style="flex:1;min-width:240px;">' +
      '<p class="kicker">Institution universitaire · Wilaya de Boumerdès (35000)</p>' +
      '<h2 class="card-title" style="font-size:1.45rem;">Université M’Hamed Bougara de Boumerdès (UMBB)</h2>' +
      '<p class="card-desc" style="margin-top:4px;">Créée en 1998 à partir des grands instituts nationaux d’ingénierie (ex-INHC, INELEC, INGM, INIL), l’UMBB rassemble notamment la Faculté de Technologie et la Faculté des Sciences.</p>' +
      '</div>' +
      '<a href="https://www.univ-boumerdes.dz" target="_blank" rel="noopener noreferrer" class="btn-secondary btn-sm">Portail officiel UMBB ' + I.arrowRight + '</a>' +
      '</div>' +
      '<div class="grid-2">' +
      '<div style="padding:18px;border:1px solid var(--border-color);border-radius:var(--radius-lg);background:var(--bg-surface-alt);">' +
      '<p class="meta-code" style="font-size:0.76rem;">CAMPUS OUEST · CITÉ FRANTZ FANON</p>' +
      '<h3 class="card-title" style="margin-top:6px;">Faculté de Technologie (FT)</h3>' +
      '<p class="card-desc" style="font-size:0.85rem;"><strong>Adresse :</strong> Cité Frantz Fanon, 35000 Boumerdès, Algérie.<br /><strong>Départements principaux :</strong> Génie des Systèmes Électriques (GSE), Génie Mécanique (GM), Génie Civil (GC), Génie des Procédés (GP), Génie des Matériaux &amp; Énergétique.</p>' +
      '<div style="margin-top:14px;"><button type="button" class="link-action" data-nav="/departements" data-quick-faculty="Faculté de Technologie">Voir les départements FT ' + I.arrowRight + '</button></div>' +
      '</div>' +
      '<div style="padding:18px;border:1px solid var(--border-color);border-radius:var(--radius-lg);background:var(--bg-surface-alt);">' +
      '<p class="meta-code" style="font-size:0.76rem;color:var(--teal);">CAMPUS SUD · ROUTE DE LA GARE FERROVIAIRE</p>' +
      '<h3 class="card-title" style="margin-top:6px;">Faculté des Sciences (FS)</h3>' +
      '<p class="card-desc" style="font-size:0.85rem;"><strong>Adresse :</strong> Route de la Gare Ferroviaire, 35000 Boumerdès, Algérie.<br /><strong>Départements principaux :</strong> Informatique, Mathématiques, Physique, Chimie, Biologie, Agronomie et STAPS.</p>' +
      '<div style="margin-top:14px;"><button type="button" class="link-action" style="color:var(--teal);" data-nav="/departements" data-quick-faculty="Faculté des Sciences">Voir les départements FS ' + I.arrowRight + '</button></div>' +
      '</div>' +
      '</div>' +
      '</div></section>' +

      '<section class="container page-section">' +
      '<div class="page-header split">' +
      '<div><p class="kicker">Organisation pédagogique UMBB · Données de démonstration</p>' +
      '<h2 class="page-title" style="font-size:1.85rem;">Départements · Faculté des Sciences &amp; Faculté de Technologie</h2>' +
      '<p class="page-subtitle">Chaque département dispose d’un espace dédié regroupant son équipe pédagogique, ses spécialités, ses emplois du temps et ses coordonnées de campus.</p></div>' +
      '<button type="button" class="link-action" data-nav="/departements">Voir tous les départements (' + ctx.departments.length + ') ' + I.arrowRight + '</button>' +
      '</div>' +
      '<div class="grid-3">' + deptCards + '</div>' +
      '</section>' +

      '<section class="container" style="padding-bottom:56px;">' +
      '<div class="grid-12">' +
      '<div class="col-span-8">' +
      '<div class="page-header split" style="margin-bottom:20px;padding-bottom:14px;">' +
      '<div><p class="kicker gold">Informations facultaires</p><h2 class="card-title" style="font-size:1.5rem;">Dernières actualités et annonces</h2></div>' +
      '<button type="button" class="link-action" data-nav="/actualites">Toutes les annonces</button>' +
      '</div>' +
      '<div class="card">' +
      (leadNews
        ? '<div class="grid-2" style="gap:0;">' +
          '<div style="min-height:220px;background:var(--bg-surface-alt);">' + safeImg(leadNews.image, leadNews.titre, leadNews.titre, 'w-full h-full') + '</div>' +
          '<div class="card-pad" style="display:flex;flex-direction:column;justify-content:space-between;">' +
          '<div><div class="meta-line" style="margin-bottom:8px;"><span style="color:var(--teal);font-weight:600;">' + esc(leadNews.categorie) + '</span><span>·</span><span class="font-mono tabular-nums">' + esc(leadNews.date) + '</span></div>' +
          '<h3 class="card-title" style="font-size:1.2rem;">' + esc(leadNews.titre) + '</h3>' +
          '<p class="card-desc">' + esc(leadNews.resume) + '</p></div>' +
          '<div class="card-footer-row"><span style="font-size:0.75rem;color:var(--text-muted);">' + esc(leadNews.auteur) + '</span>' +
          '<button type="button" class="link-action" data-nav="/actualites">Lire la suite ' + I.arrowRight + '</button></div>' +
          '</div></div>'
        : '') +
      secondaryHtml +
      '</div></div>' +

      '<aside class="col-span-4">' +
      '<div class="page-header split" style="margin-bottom:20px;padding-bottom:14px;">' +
      '<div><p class="kicker">Agenda 2026–2027</p><h2 class="card-title" style="font-size:1.5rem;">Événements à venir</h2></div>' +
      '<button type="button" class="link-action" data-nav="/calendrier">Calendrier</button>' +
      '</div>' +
      '<div class="card">' + eventsHtml +
      '<div style="padding:14px;"><button type="button" class="btn-secondary" style="width:100%;" data-nav="/calendrier">' + I.calendar + '<span>Ouvrir le calendrier complet</span></button></div>' +
      '</div></aside>' +
      '</div></section>' +

      '<section class="container" style="padding-bottom:56px;">' +
      '<div class="card card-pad">' +
      '<div class="page-header split" style="margin-bottom:20px;padding-bottom:16px;">' +
      '<div><h2 class="card-title" style="font-size:1.35rem;">Plan du site FT CONNECT</h2><p class="page-subtitle" style="margin-top:4px;font-size:0.875rem;">Accès direct à l’ensemble des rubriques, annuaires et outils du portail.</p></div>' +
      '<button type="button" class="btn-primary btn-sm" data-nav="/tableau-de-bord"><span>Statistiques &amp; Rapport PDF</span>' + I.arrowRight + '</button>' +
      '</div>' +
      '<div class="grid-3">' +
      '<div><h3 style="font-size:0.9rem;font-weight:600;margin-bottom:10px;">Pédagogie &amp; Départements</h3>' +
      '<ul class="footer-list"><li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/departements">Catalogue des départements</button></li>' + deptSiteMapLinks + '</ul></div>' +
      '<div><h3 style="font-size:0.9rem;font-weight:600;margin-bottom:10px;">Plannings &amp; Annuaires</h3>' +
      '<ul class="footer-list">' +
      '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/emplois-du-temps">Emplois du temps (PDF &amp; Impression)</button></li>' +
      '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/enseignants">Annuaire des enseignants</button></li>' +
      '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/etudiants">Listes des étudiants (PDF &amp; Excel)</button></li>' +
      '</ul></div>' +
      '<div><h3 style="font-size:0.9rem;font-weight:600;margin-bottom:10px;">Vie Universitaire &amp; Support</h3>' +
      '<ul class="footer-list">' +
      '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/actualites">Actualités et annonces</button></li>' +
      '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/calendrier">Calendrier universitaire 2026–2027</button></li>' +
      '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/reclamations">Formulaire de réclamations</button></li>' +
      '<li><button type="button" class="footer-link" style="color:var(--text-secondary);" data-nav="/faq">Foire aux questions (FAQ)</button></li>' +
      '</ul></div>' +
      '</div></div></section>'
    );
  }

  function renderDepartments(ctx, state) {
    var I = window.FT_ICONS;
    var q = (state.deptQuery || '').trim().toLowerCase();
    var lvl = state.deptLevel || 'Tous';
    var fac = state.deptFaculty || 'Toutes';
    var filtered = ctx.departments.filter(function (d) {
      var mq = !q || (d.nom + ' ' + d.code + ' ' + (d.faculte || '') + ' ' + d.description).toLowerCase().indexOf(q) !== -1;
      var ml = lvl === 'Tous' || d.niveaux.indexOf(lvl) !== -1;
      var mf = fac === 'Toutes' || (d.faculte || 'Faculté de Technologie') === fac;
      return mq && ml && mf;
    });

    var cards = filtered.length
      ? filtered
          .map(function (d) {
            var tc = ctx.teachers.filter(function (t) { return t.departementId === d.id; }).length;
            var sc = ctx.students.filter(function (s) { return s.departementId === d.id; }).length;
            return (
              '<article class="card" style="display:flex;flex-direction:column;">' +
              '<div class="card-media-43">' + safeImg(d.image, d.nom, d.nom) + '</div>' +
              '<div class="card-pad" style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">' +
              '<div>' +
              '<div class="meta-line" style="justify-content:space-between;margin-bottom:8px;">' +
              '<span class="meta-code">' + esc(d.code + ' · ' + (d.faculte || 'Faculté de Technologie')) + '</span>' +
              (d.estPersonnalise
                ? '<button type="button" class="link-action" style="color:var(--danger);font-size:0.76rem;" data-remove-dept="' + esc(d.id) + '">' + I.trash + ' Retirer</button>'
                : '') +
              '</div>' +
              '<h2 class="card-title">' + esc(d.nom) + '</h2>' +
              '<p class="card-desc">' + esc(d.description) + '</p>' +
              '<div class="meta-line tabular-nums" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-subtle);">' +
              '<span>' + esc(d.niveaux.join(' / ')) + '</span><span>·</span>' +
              '<span>' + d.specialites.length + ' spécialité(s)</span><span>·</span>' +
              '<span>' + tc + ' ens.</span><span>·</span>' +
              '<span>' + sc + ' étu.</span></div>' +
              '</div>' +
              '<button type="button" class="btn-secondary" style="width:100%;margin-top:16px;" data-nav="/departements/' + esc(d.id) + '">Ouvrir la fiche département ' + I.arrowRight + '</button>' +
              '</div></article>'
            );
          })
          .join('')
      : '<div class="card card-pad" style="text-align:center;color:var(--text-muted);">Aucun département ne correspond à votre recherche.</div>';

    var facTabs = ['Toutes', 'Faculté de Technologie', 'Faculté des Sciences']
      .map(function (f) {
        return (
          '<button type="button" class="filter-tab ' + (fac === f ? 'active' : '') + '" data-dept-faculty="' + esc(f) + '">' +
          (f === 'Toutes' ? 'Toutes les facultés' : f) +
          '</button>'
        );
      })
      .join('');

    var levelTabs = ['Tous', 'L3', 'M1', 'M2']
      .map(function (l) {
        return (
          '<button type="button" class="filter-tab ' + (lvl === l ? 'active' : '') + '" data-dept-level="' + l + '">' +
          (l === 'Tous' ? 'Tous les cycles' : l) +
          '</button>'
        );
      })
      .join('');

    return (
      '<section class="container page-section">' +
      '<div class="page-header split">' +
      '<div><p class="kicker">UMBB Boumerdès · Faculté des Sciences &amp; Faculté de Technologie</p>' +
      '<h1 class="page-title">Départements UMBB Boumerdès</h1>' +
      '<p class="page-subtitle">Explorez les départements de la Faculté de Technologie (Campus Ouest · Cité Frantz Fanon) et de la Faculté des Sciences (Campus Sud · Route de la Gare Ferroviaire).</p></div>' +
      '<button type="button" class="btn-primary" id="btn-open-add-dept">' + I.plus + '<span>Ajouter un département (Démo)</span></button>' +
      '</div>' +

      '<div class="toolbar">' +
      '<div class="search-input-wrap"><span class="search-input-icon">' + I.search + '</span>' +
      '<input type="search" id="dept-search-input" class="input-field with-icon" value="' + esc(state.deptQuery || '') + '" placeholder="Filtrer par nom ou code (ex. GSE, INFO, GM)..." aria-label="Rechercher un département" /></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">' +
      '<div class="segmented-group">' + facTabs + '</div>' +
      '<div class="segmented-group">' + levelTabs + '</div>' +
      '</div>' +
      '</div>' +

      '<div class="' + (filtered.length ? 'grid-3' : '') + '">' + cards + '</div>' +

      '<div id="modal-add-dept" class="modal-backdrop" role="dialog" aria-modal="true" aria-label="Ajouter un département">' +
      '<div class="modal-dialog">' +
      '<div class="modal-header"><h2 class="card-title">Ajouter un département UMBB (Démo locale)</h2>' +
      '<button type="button" class="mobile-menu-toggle" style="display:inline-flex;" id="btn-close-add-dept" aria-label="Fermer">' + I.close + '</button></div>' +
      '<form id="form-add-dept" class="modal-body" style="display:flex;flex-direction:column;gap:14px;">' +
      '<p id="add-dept-error" class="field-error" style="display:none;"></p>' +
      '<div><label class="field-label">Faculté de rattachement</label><select id="new-dept-fac" class="select-field">' +
      '<option value="Faculté de Technologie">Faculté de Technologie (Campus Ouest · Cité Frantz Fanon)</option>' +
      '<option value="Faculté des Sciences">Faculté des Sciences (Campus Sud · Route de la Gare)</option>' +
      '</select></div>' +
      '<div class="grid-2" style="gap:12px;">' +
      '<div><label class="field-label">Nom complet *</label><input type="text" id="new-dept-nom" class="input-field" placeholder="Ex. Génie des Matériaux" /></div>' +
      '<div><label class="field-label">Code *</label><input type="text" id="new-dept-code" class="input-field font-mono" placeholder="Ex. GMA" /></div>' +
      '</div>' +
      '<div><label class="field-label">Description courte *</label><textarea id="new-dept-desc" rows="2" class="textarea-field" placeholder="Présentation des spécialités..."></textarea></div>' +
      '<div class="grid-2" style="gap:12px;">' +
      '<div><label class="field-label">Responsable *</label><input type="text" id="new-dept-resp" class="input-field" placeholder="Ex. Dr. Mourad Ziani" /></div>' +
      '<div><label class="field-label">Email responsable</label><input type="email" id="new-dept-email" class="input-field" placeholder="responsable@umbb-demo.edu" /></div>' +
      '</div>' +
      '<div class="grid-2" style="gap:12px;">' +
      '<div><label class="field-label">Bâtiment / Campus</label><input type="text" id="new-dept-bat" class="input-field" placeholder="Ex. Campus Ouest · Cité Frantz Fanon" /></div>' +
      '<div><label class="field-label">Spécialité principale</label><input type="text" id="new-dept-spec" class="input-field" placeholder="Ex. Polymères & Céramiques" /></div>' +
      '</div>' +
      '<div style="display:flex;justify-content:flex-end;gap:10px;padding-top:8px;">' +
      '<button type="button" class="btn-secondary" id="btn-cancel-add-dept">Annuler</button>' +
      '<button type="submit" class="btn-primary">Enregistrer le département</button>' +
      '</div></form></div></div>' +
      '</section>'
    );
  }

  function renderDepartmentDetail(ctx, state, deptId) {
    var I = window.FT_ICONS;
    var dept = ctx.departments.find(function (d) { return d.id === deptId; });
    if (!dept) return renderNotFound();

    var dTeachers = ctx.teachers.filter(function (t) { return t.departementId === deptId; });
    var dStudents = ctx.students.filter(function (s) { return s.departementId === deptId; });
    var dSchedules = ctx.schedules.filter(function (s) { return s.departementId === deptId; });
    var dNews = ctx.news.filter(function (n) { return n.departementId === deptId || n.departementId === 'all'; }).slice(0, 3);

    var specId = state.deptDetailSpecId || (dept.specialites[0] && dept.specialites[0].id) || '';
    var activeSpec = dept.specialites.find(function (s) { return s.id === specId; }) || dept.specialites[0];
    var specSessions = dSchedules.filter(function (s) { return !activeSpec || s.specialiteId === activeSpec.id; });

    var teacherCards = dTeachers.length
      ? '<div class="grid-3">' +
        dTeachers
          .map(function (t) {
            return (
              '<div class="card card-pad">' +
              '<p style="font-size:0.75rem;color:var(--text-muted);">' + esc(t.grade) + '</p>' +
              '<h3 class="card-title" style="font-size:1rem;margin-top:4px;">' + esc(t.prenom + ' ' + t.nom) + '</h3>' +
              '<p style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">' + esc(t.specialite) + '</p>' +
              '<p style="font-size:0.76rem;color:var(--text-muted);margin-top:8px;">' + esc(t.bureau) + ' · ' + esc(t.permanence) + '</p>' +
              '<a href="mailto:' + esc(t.email) + '" class="link-action" style="margin-top:12px;font-size:0.78rem;">' + I.mail + '<span>' + esc(t.email) + '</span></a>' +
              '</div>'
            );
          })
          .join('') +
        '</div>'
      : '<div class="card card-pad" style="font-size:0.875rem;color:var(--text-muted);">Aucun enseignant rattaché à ce département de démonstration.</div>';

    var specTabs = dept.specialites
      .map(function (s) {
        return (
          '<button type="button" class="filter-tab ' + (activeSpec && activeSpec.id === s.id ? 'active' : '') + '" data-dept-spec="' + esc(s.id) + '">' +
          esc(s.niveau + ' — ' + s.nom) +
          '</button>'
        );
      })
      .join('');

    var schedRows = specSessions.length
      ? '<table class="data-table"><thead><tr><th>Jour</th><th>Horaire</th><th>Matière</th><th>Type · Groupe</th><th>Salle</th><th>Enseignant</th></tr></thead><tbody>' +
        specSessions
          .map(function (s) {
            return (
              '<tr><td><strong>' + esc(s.jour) + '</strong></td>' +
              '<td class="font-mono tabular-nums">' + esc(s.heureDebut + ' – ' + s.heureFin) + '</td>' +
              '<td><strong>' + esc(s.matiere) + '</strong></td>' +
              '<td>' + esc(s.type + ' · ' + s.groupe) + '</td>' +
              '<td class="font-mono">' + esc(s.salle) + '</td>' +
              '<td>' + esc(s.enseignantNom) + '</td></tr>'
            );
          })
          .join('') +
        '</tbody></table>'
      : '<div class="card-pad" style="font-size:0.875rem;color:var(--text-muted);">Aucune séance saisie pour cette spécialité de démonstration.</div>';

    var studRows = dStudents.length
      ? '<table class="data-table"><thead><tr><th>Matricule</th><th>Nom &amp; Prénom</th><th>Parcours</th><th>Grp</th></tr></thead><tbody>' +
        dStudents
          .slice(0, 6)
          .map(function (st) {
            return (
              '<tr><td class="font-mono tabular-nums">' + esc(st.matricule) + '</td>' +
              '<td><strong>' + esc(st.nom.toUpperCase() + ' ' + st.prenom) + '</strong></td>' +
              '<td>' + esc(st.niveau + ' · ' + st.specialiteNom) + '</td>' +
              '<td class="font-mono">' + esc(st.groupe) + '</td></tr>'
            );
          })
          .join('') +
        '</tbody></table>'
      : '<div class="card-pad" style="font-size:0.875rem;color:var(--text-muted);">Aucun étudiant fictif rattaché à ce département de démonstration.</div>';

    return (
      '<section class="container page-section" style="display:flex;flex-direction:column;gap:36px;">' +
      '<div>' +
      '<button type="button" class="link-action" style="color:var(--text-secondary);margin-bottom:16px;" data-nav="/departements">' + I.arrowLeft + '<span>Tous les départements</span></button>' +
      '<div class="card"><div class="grid-12" style="gap:0;">' +
      '<div class="col-span-5" style="min-height:240px;background:var(--bg-surface-alt);">' + safeImg(dept.image, dept.nom, dept.nom) + '</div>' +
      '<div class="col-span-7 card-pad" style="display:flex;flex-direction:column;justify-content:space-between;gap:20px;">' +
      '<div><div class="meta-line" style="margin-bottom:8px;"><span class="meta-code">Code ' + esc(dept.code) + '</span><span>·</span><span>' + esc(dept.faculte || 'Faculté de Technologie') + '</span><span>·</span><span>UMBB Boumerdès</span><span>·</span><span>Cycles : ' + esc(dept.niveaux.join(', ')) + '</span></div>' +
      '<h1 class="page-title" style="font-size:1.85rem;">' + esc(dept.nom) + '</h1>' +
      '<p class="card-desc" style="font-size:0.95rem;">' + esc(dept.presentationLongue) + '</p></div>' +
      '<div class="grid-2" style="padding-top:16px;border-top:1px solid var(--border-subtle);gap:16px;">' +
      '<div><p class="field-label">Laboratoires &amp; Plateformes</p>' + dept.laboratoires.map(function (l) { return '<p style="font-size:0.78rem;color:var(--text-secondary);">• ' + esc(l) + '</p>'; }).join('') + '</div>' +
      '<div><p class="field-label">Spécialités rattachées</p>' + dept.specialites.map(function (sp) { return '<p style="font-size:0.78rem;color:var(--text-secondary);">• <span class="font-mono">' + esc(sp.niveau) + '</span> — ' + esc(sp.nom) + '</p>'; }).join('') + '</div>' +
      '</div></div></div></div></div>' +

      '<div class="grid-2">' +
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:12px;">' +
      '<h2 class="card-title" style="font-size:1.05rem;">Responsable du département</h2>' +
      '<div><p style="font-size:1.1rem;font-weight:700;">' + esc(dept.responsable.nom) + '</p>' +
      '<p style="font-size:0.85rem;color:var(--text-secondary);">' + esc(dept.responsable.grade + ' · ' + dept.responsable.bureau) + '</p></div>' +
      '<div><a href="mailto:' + esc(dept.responsable.email) + '" class="btn-primary btn-sm">' + I.mail + '<span>Contacter (' + esc(dept.responsable.email) + ')</span></a></div>' +
      '</div>' +

      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">' +
      '<h2 class="card-title" style="font-size:1.05rem;">Coordonnées du secrétariat</h2>' +
      '<p style="font-size:0.875rem;display:flex;align-items:center;gap:8px;color:var(--text-secondary);">' + I.mapPin + '<span>' + esc(dept.coordonnees.batiment) + '</span></p>' +
      '<p class="tabular-nums" style="font-size:0.875rem;display:flex;align-items:center;gap:8px;color:var(--text-secondary);">' + I.phone + '<span>' + esc(dept.coordonnees.telephone) + '</span></p>' +
      '<p style="font-size:0.875rem;display:flex;align-items:center;gap:8px;color:var(--sky);">' + I.mail + '<a href="mailto:' + esc(dept.coordonnees.emailSecretariat) + '">' + esc(dept.coordonnees.emailSecretariat) + '</a></p>' +
      '<p style="font-size:0.875rem;display:flex;align-items:center;gap:8px;color:var(--text-secondary);">' + I.clock + '<span>' + esc(dept.coordonnees.horairesAccueil) + '</span></p>' +
      '</div></div>' +

      '<div><div class="page-header split" style="margin-bottom:16px;padding-bottom:12px;"><h2 class="card-title" style="font-size:1.3rem;">Enseignants rattachés (' + dTeachers.length + ')</h2><button type="button" class="link-action" data-nav="/enseignants">Voir tout l’annuaire</button></div>' + teacherCards + '</div>' +

      '<div><div class="page-header split" style="margin-bottom:16px;padding-bottom:12px;"><h2 class="card-title" style="font-size:1.3rem;">Aperçu des emplois du temps</h2>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      (specSessions.length && activeSpec ? '<button type="button" class="btn-secondary btn-sm" id="btn-dept-export-sched">' + I.download + '<span>Télécharger PDF</span></button>' : '') +
      '<button type="button" class="btn-primary btn-sm" data-nav="/emplois-du-temps">Filtrer par groupe ' + I.arrowRight + '</button>' +
      '</div></div>' +
      '<div class="segmented-group" style="margin-bottom:14px;">' + specTabs + '</div>' +
      '<div class="table-wrap">' + schedRows + '</div></div>' +

      '<div class="grid-12">' +
      '<div class="col-span-7"><div class="page-header split" style="margin-bottom:14px;padding-bottom:10px;"><h2 class="card-title" style="font-size:1.25rem;">Listes des étudiants (' + dStudents.length + ')</h2>' +
      '<div style="display:flex;gap:8px;">' +
      (dStudents.length ? '<button type="button" class="btn-secondary btn-sm" id="btn-dept-stu-pdf">' + I.download + ' PDF</button><button type="button" class="btn-secondary btn-sm" id="btn-dept-stu-xls">' + I.spreadsheet + ' Excel</button>' : '') +
      '</div></div><div class="table-wrap">' + studRows + '</div></div>' +
      '<div class="col-span-5"><div class="page-header split" style="margin-bottom:14px;padding-bottom:10px;"><h2 class="card-title" style="font-size:1.25rem;">Actualités liées</h2><button type="button" class="link-action" data-nav="/actualites">Tout voir</button></div>' +
      '<div class="card">' +
      dNews
        .map(function (n) {
          return (
            '<div style="padding:14px 18px;border-bottom:1px solid var(--border-subtle);">' +
            '<div class="meta-line" style="margin-bottom:4px;"><span style="color:var(--teal);font-weight:600;">' + esc(n.categorie) + '</span><span>·</span><span class="font-mono tabular-nums">' + esc(n.date) + '</span></div>' +
            '<h3 style="font-size:0.9rem;font-weight:600;">' + esc(n.titre) + '</h3>' +
            '<p style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">' + esc(n.resume) + '</p></div>'
          );
        })
        .join('') +
      '</div></div></div></section>'
    );
  }

  function renderTimetables(ctx, state) {
    var I = window.FT_ICONS;
    var dept = ctx.departments.find(function (d) { return d.id === state.ttDept; }) || ctx.departments[0];
    var levels = dept.niveaux || ['L3', 'M1', 'M2'];
    var niveau = levels.indexOf(state.ttLevel) !== -1 ? state.ttLevel : levels[0];
    var specs = dept.specialites.filter(function (s) { return s.niveau === niveau; });
    var spec = specs.find(function (s) { return s.id === state.ttSpec; }) || specs[0] || dept.specialites[0];
    var groups = (spec && spec.groupes) || ['G1'];
    var group = groups.indexOf(state.ttGroup) !== -1 ? state.ttGroup : groups[0];

    var sessions = ctx.schedules
      .filter(function (s) {
        return s.departementId === dept.id && s.niveau === niveau && (!spec || s.specialiteId === spec.id) && s.groupe === group;
      })
      .sort(function (a, b) { return a.heureDebut.localeCompare(b.heureDebut); });

    var days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    var viewMode = state.ttView || 'semaine';

    var bodyHtml = '';
    if (!sessions.length) {
      bodyHtml =
        '<div class="card card-pad" style="text-align:center;">' +
        '<p style="font-size:0.9rem;font-weight:600;">Aucun créneau renseigné pour cette combinaison dans les données de démonstration.</p>' +
        '<p style="font-size:0.8rem;color:var(--text-muted);margin-top:6px;">Essayez <strong>GSE · M2 · M2RT · G1</strong> ou <strong>INFO · L3 · Systèmes d’Information · G1</strong>.</p>' +
        '<button type="button" class="btn-primary btn-sm" style="margin-top:14px;" id="btn-tt-reset">Charger M2RT G1</button></div>';
    } else if (viewMode === 'semaine') {
      bodyHtml = days
        .map(function (day) {
          var daySessions = sessions.filter(function (s) { return s.jour === day; });
          var rows = daySessions.length
            ? daySessions
                .map(function (s) {
                  return (
                    '<div class="session-row">' +
                    '<div class="font-mono tabular-nums" style="font-weight:600;color:var(--sky);">' + esc(s.heureDebut + ' – ' + s.heureFin) + '</div>' +
                    '<div><div class="meta-line" style="margin-bottom:2px;"><span class="font-mono">' + esc(s.codeMatiere) + '</span><span>·</span><strong style="color:var(--teal);">' + esc(s.type) + '</strong></div>' +
                    '<p style="font-weight:600;font-size:0.92rem;">' + esc(s.matiere) + '</p></div>' +
                    '<div class="font-mono" style="font-size:0.8rem;color:var(--text-secondary);">Salle : ' + esc(s.salle) + '</div>' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:0.82rem;">' +
                    '<span>' + esc(s.enseignantNom) + '</span>' +
                    '<a href="mailto:' + esc(s.enseignantEmail) + '" class="no-print link-action" aria-label="Email ' + esc(s.enseignantNom) + '">' + I.mail + '</a>' +
                    '</div></div>'
                  );
                })
                .join('')
            : '<div style="padding:14px 20px;font-size:0.82rem;color:var(--text-muted);">Aucun cours programmé ce jour.</div>';
          return (
            '<div class="day-card">' +
            '<div class="day-card-header"><h2 class="card-title" style="font-size:1rem;">' + day + '</h2>' +
            '<span class="tabular-nums" style="font-size:0.78rem;color:var(--text-muted);">' + daySessions.length + ' séance(s)</span></div>' +
            rows +
            '</div>'
          );
        })
        .join('');
    } else {
      bodyHtml =
        '<div class="table-wrap"><table class="data-table"><thead class="navy"><tr><th>Jour</th><th>Horaire</th><th>Code</th><th>Matière</th><th>Type</th><th>Salle</th><th>Enseignant</th></tr></thead><tbody>' +
        sessions
          .map(function (s) {
            return (
              '<tr><td><strong>' + esc(s.jour) + '</strong></td>' +
              '<td class="font-mono tabular-nums">' + esc(s.heureDebut + ' – ' + s.heureFin) + '</td>' +
              '<td class="font-mono">' + esc(s.codeMatiere) + '</td>' +
              '<td><strong>' + esc(s.matiere) + '</strong></td>' +
              '<td>' + esc(s.type) + '</td>' +
              '<td class="font-mono">' + esc(s.salle) + '</td>' +
              '<td><a href="mailto:' + esc(s.enseignantEmail) + '" class="link-action">' + esc(s.enseignantNom) + '</a></td></tr>'
            );
          })
          .join('') +
        '</tbody></table></div>';
    }

    return (
      '<section class="container page-section">' +
      '<div class="page-header split no-print">' +
      '<div><p class="kicker">UMBB Boumerdès · Semestre Impair 2026–2027 (Démo)</p>' +
      '<h1 class="page-title">Consultation des emplois du temps</h1>' +
      '<p class="page-subtitle">Sélectionnez votre département (Faculté des Sciences ou Faculté de Technologie), niveau, spécialité et groupe pour afficher, imprimer ou télécharger en PDF.</p></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button type="button" class="btn-secondary" id="btn-tt-print"' + (!sessions.length ? ' disabled' : '') + '>' + I.printer + '<span>Imprimer</span></button>' +
      '<button type="button" class="btn-primary" id="btn-tt-pdf"' + (!sessions.length ? ' disabled' : '') + '>' + I.download + '<span>Télécharger en PDF</span></button>' +
      '</div></div>' +

      '<div class="card card-pad no-print" style="margin-bottom:24px;">' +
      '<div class="grid-4">' +
      '<div><label class="field-label" for="tt-dept">1. Département</label><select id="tt-dept" class="select-field">' +
      ctx.departments.map(function (d) { return '<option value="' + esc(d.id) + '"' + (d.id === dept.id ? ' selected' : '') + '>' + esc(d.code + ' — ' + d.nom) + '</option>'; }).join('') +
      '</select></div>' +
      '<div><label class="field-label" for="tt-level">2. Niveau</label><select id="tt-level" class="select-field">' +
      levels.map(function (l) { return '<option value="' + esc(l) + '"' + (l === niveau ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') +
      '</select></div>' +
      '<div><label class="field-label" for="tt-spec">3. Spécialité</label><select id="tt-spec" class="select-field">' +
      (specs.length ? specs.map(function (s) { return '<option value="' + esc(s.id) + '"' + (spec && s.id === spec.id ? ' selected' : '') + '>' + esc(s.nom) + '</option>'; }).join('') : '<option value="">Aucune spécialité</option>') +
      '</select></div>' +
      '<div><label class="field-label" for="tt-group">4. Groupe</label><select id="tt-group" class="select-field">' +
      groups.map(function (g) { return '<option value="' + esc(g) + '"' + (g === group ? ' selected' : '') + '>Groupe ' + esc(g) + '</option>'; }).join('') +
      '</select></div></div>' +

      '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border-subtle);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">' +
      '<p style="font-size:0.78rem;color:var(--text-secondary);">Affichage : <strong>' + esc(dept.nom + ' · ' + niveau + ' · ' + (spec ? spec.nom : '—') + ' · Groupe ' + group) + '</strong> <span class="tabular-nums">(' + sessions.length + ' séance(s))</span></p>' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
      '<div class="segmented-group">' +
      '<button type="button" class="filter-tab ' + (viewMode === 'semaine' ? 'active' : '') + '" data-tt-view="semaine">Par jour</button>' +
      '<button type="button" class="filter-tab ' + (viewMode === 'tableau' ? 'active' : '') + '" data-tt-view="tableau">Tableau complet</button>' +
      '</div>' +
      '<button type="button" class="link-action" style="color:var(--text-muted);font-size:0.78rem;" id="btn-tt-reset-link">' + I.rotateCcw + ' Réinitialiser</button>' +
      '</div></div></div>' +

      '<div class="print-only" style="margin-bottom:16px;border-bottom:1px solid #cbd5e1;padding-bottom:10px;">' +
      '<h2 style="font-size:18px;font-weight:700;">FT CONNECT · UMBB Boumerdès — Emploi du temps (Démo 2026–2027)</h2>' +
      '<p style="font-size:12px;margin-top:4px;">' + esc((dept.faculte || '') + ' | ' + dept.nom + ' | Niveau : ' + niveau + ' | Spécialité : ' + (spec ? spec.nom : '') + ' | Groupe : ' + group) + '</p></div>' +

      bodyHtml +
      '</section>'
    );
  }

  function renderTeachers(ctx, state) {
    var I = window.FT_ICONS;
    var q = (state.teacherQuery || '').trim().toLowerCase();
    var deptFilter = state.teacherDept || 'all';

    var filtered = ctx.teachers.filter(function (t) {
      var md = deptFilter === 'all' || t.departementId === deptFilter;
      var mq = !q || (t.nom + ' ' + t.prenom + ' ' + t.grade + ' ' + t.specialite + ' ' + t.email + ' ' + t.modules.join(' ')).toLowerCase().indexOf(q) !== -1;
      return md && mq;
    });

    function getDeptLabel(id) {
      var found = ctx.departments.find(function (d) { return d.id === id; });
      return found ? found.nomCourt : id.toUpperCase();
    }

    var deptTabs =
      '<button type="button" class="filter-tab ' + (deptFilter === 'all' ? 'active' : '') + '" data-teacher-dept="all">Tous (' + ctx.teachers.length + ')</button>' +
      ctx.departments
        .map(function (d) {
          return '<button type="button" class="filter-tab ' + (deptFilter === d.id ? 'active' : '') + '" data-teacher-dept="' + esc(d.id) + '">' + esc(d.code) + '</button>';
        })
        .join('');

    var cards = filtered.length
      ? '<div class="grid-3">' +
        filtered
          .map(function (t) {
            var initials = ((t.prenom[0] || '') + (t.nom[0] || '')).toUpperCase();
            return (
              '<article class="card card-pad" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;">' +
              '<div><div style="display:flex;align-items:flex-start;gap:12px;">' +
              '<div class="avatar-initials" aria-hidden="true">' + esc(initials) + '</div>' +
              '<div><p style="font-size:0.75rem;color:var(--text-muted);">' + esc(t.grade + ' · ' + getDeptLabel(t.departementId)) + '</p>' +
              '<h2 class="card-title" style="font-size:1.05rem;">' + esc(t.prenom + ' ' + t.nom) + '</h2></div></div>' +
              '<p style="font-size:0.86rem;color:var(--text-secondary);margin-top:12px;">' + esc(t.specialite) + '</p>' +
              '<p style="font-size:0.76rem;color:var(--text-muted);margin-top:8px;">Modules : ' + esc(t.modules.join(', ')) + '</p>' +
              '<p style="font-size:0.76rem;color:var(--text-muted);margin-top:4px;">' + esc(t.bureau + ' · Permanence : ' + t.permanence) + '</p>' +
              '</div>' +
              '<div class="card-footer-row">' +
              '<a href="mailto:' + esc(t.email) + '?subject=' + encodeURIComponent('[FT CONNECT] Message étudiant') + '" class="btn-primary btn-sm">' + I.mail + '<span>Envoyer un email</span></a>' +
              '<button type="button" class="btn-secondary btn-sm" data-copy-email="' + esc(t.email) + '">' + I.copy + '<span>Copier</span></button>' +
              '</div></article>'
            );
          })
          .join('') +
        '</div>'
      : '<div class="card card-pad" style="text-align:center;color:var(--text-muted);">Aucun enseignant ne correspond à ces critères de recherche.</div>';

    return (
      '<section class="container page-section">' +
      '<div class="page-header"><div><p class="kicker">UMBB Boumerdès · Corps enseignant (Démo)</p>' +
      '<h1 class="page-title">Annuaire des enseignants</h1>' +
      '<p class="page-subtitle">Recherchez instantanément un enseignant de la Faculté des Sciences ou de la Faculté de Technologie et contactez-le par email.</p></div></div>' +
      '<div class="toolbar">' +
      '<div class="search-input-wrap"><span class="search-input-icon">' + I.search + '</span>' +
      '<input type="search" id="teacher-search-input" class="input-field with-icon" value="' + esc(state.teacherQuery || '') + '" placeholder="Rechercher un nom, grade, module ou spécialité..." aria-label="Rechercher un enseignant" /></div>' +
      '<div class="segmented-group">' + deptTabs + '</div></div>' +
      '<p class="tabular-nums" style="font-size:0.78rem;color:var(--text-muted);margin-bottom:14px;">' + filtered.length + ' enseignant(s) affiché(s)</p>' +
      cards +
      '</section>'
    );
  }

  function renderStudents(ctx, state) {
    var I = window.FT_ICONS;
    var q = (state.stuQuery || '').trim().toLowerCase();
    var deptId = state.stuDept || 'all';
    var niv = state.stuLevel || 'all';
    var specId = state.stuSpec || 'all';
    var grp = state.stuGroup || 'all';

    var availableSpecs = [];
    ctx.departments.forEach(function (d) {
      if (deptId === 'all' || d.id === deptId) {
        d.specialites.forEach(function (s) {
          if (niv === 'all' || s.niveau === niv) availableSpecs.push(s);
        });
      }
    });

    var filtered = ctx.students.filter(function (st) {
      if (deptId !== 'all' && st.departementId !== deptId) return false;
      if (niv !== 'all' && st.niveau !== niv) return false;
      if (specId !== 'all' && st.specialiteId !== specId) return false;
      if (grp !== 'all' && st.groupe !== grp) return false;
      if (q) {
        var txt = (st.matricule + ' ' + st.nom + ' ' + st.prenom + ' ' + st.specialiteNom + ' ' + st.email).toLowerCase();
        if (txt.indexOf(q) === -1) return false;
      }
      return true;
    });

    var tableHtml = filtered.length
      ? '<table class="data-table"><thead><tr><th>Matricule</th><th>Nom &amp; Prénom</th><th>Dép.</th><th>Niveau · Spécialité</th><th>Groupe</th><th>Statut</th><th>Email académique (Démo)</th></tr></thead><tbody>' +
        filtered
          .map(function (st) {
            return (
              '<tr><td class="font-mono tabular-nums">' + esc(st.matricule) + '</td>' +
              '<td><strong>' + esc(st.nom.toUpperCase() + ' ' + st.prenom) + '</strong></td>' +
              '<td class="font-mono" style="color:var(--sky);">' + esc(st.departementId.toUpperCase()) + '</td>' +
              '<td><strong>' + esc(st.niveau) + '</strong> · ' + esc(st.specialiteNom) + '</td>' +
              '<td class="font-mono">' + esc(st.groupe) + '</td>' +
              '<td style="font-weight:600;color:' + (st.statut === 'Délégué' ? 'var(--teal)' : st.statut === 'Redoublant' ? 'var(--gold)' : 'var(--text-secondary)') + ';">' + esc(st.statut) + '</td>' +
              '<td class="font-mono" style="font-size:0.78rem;color:var(--text-muted);">' + esc(st.email) + '</td></tr>'
            );
          })
          .join('') +
        '</tbody></table>'
      : '<div class="card-pad" style="text-align:center;color:var(--text-muted);">Aucun étudiant fictif ne correspond à ces filtres.</div>';

    return (
      '<section class="container page-section">' +
      '<div class="page-header split">' +
      '<div><p class="kicker gold">Données fictives de démonstration · Modifiables dans data/etudiants.json</p>' +
      '<h1 class="page-title">Listes des étudiants</h1>' +
      '<p class="page-subtitle">Filtrez les effectifs par département, niveau, spécialité et groupe, puis exportez la liste filtrée en PDF ou Excel.</p></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button type="button" class="btn-secondary" id="btn-stu-pdf"' + (!filtered.length ? ' disabled' : '') + '>' + I.download + '<span>Télécharger PDF</span></button>' +
      '<button type="button" class="btn-primary" id="btn-stu-xls"' + (!filtered.length ? ' disabled' : '') + '>' + I.spreadsheet + '<span>Télécharger Excel (.xls)</span></button>' +
      '</div></div>' +

      '<div class="card card-pad" style="margin-bottom:24px;">' +
      '<div class="grid-4" style="grid-template-columns:repeat(auto-fit,minmax(175px,1fr));">' +
      '<div><label class="field-label" for="stu-search">Recherche</label><input type="search" id="stu-search" class="input-field" value="' + esc(state.stuQuery || '') + '" placeholder="Nom, matricule..." /></div>' +
      '<div><label class="field-label" for="stu-dept">Département</label><select id="stu-dept" class="select-field"><option value="all">Tous</option>' +
      ctx.departments.map(function (d) { return '<option value="' + esc(d.id) + '"' + (d.id === deptId ? ' selected' : '') + '>' + esc(d.code + ' — ' + d.nomCourt) + '</option>'; }).join('') +
      '</select></div>' +
      '<div><label class="field-label" for="stu-level">Niveau</label><select id="stu-level" class="select-field"><option value="all">Tous</option>' +
      ['L3', 'M1', 'M2'].map(function (l) { return '<option value="' + l + '"' + (l === niv ? ' selected' : '') + '>' + l + '</option>'; }).join('') +
      '</select></div>' +
      '<div><label class="field-label" for="stu-spec">Spécialité</label><select id="stu-spec" class="select-field"><option value="all">Toutes</option>' +
      availableSpecs.map(function (s) { return '<option value="' + esc(s.id) + '"' + (s.id === specId ? ' selected' : '') + '>' + esc(s.nom) + '</option>'; }).join('') +
      '</select></div>' +
      '<div><label class="field-label" for="stu-group">Groupe</label><select id="stu-group" class="select-field"><option value="all">Tous</option><option value="G1"' + (grp === 'G1' ? ' selected' : '') + '>G1</option><option value="G2"' + (grp === 'G2' ? ' selected' : '') + '>G2</option></select></div>' +
      '</div>' +
      '<div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);">' +
      '<span class="tabular-nums">' + filtered.length + ' étudiant(s) trouvé(s) sur ' + ctx.students.length + '</span>' +
      '<button type="button" class="link-action" style="color:var(--text-muted);font-size:0.78rem;" id="btn-stu-reset">' + I.rotateCcw + ' Réinitialiser</button>' +
      '</div></div>' +
      '<div class="table-wrap">' + tableHtml + '</div></section>'
    );
  }

  function renderComplaints(ctx, state) {
    var I = window.FT_ICONS;
    var historyHtml = ctx.complaints.length
      ? ctx.complaints
          .map(function (c) {
            return (
              '<div style="padding:14px 18px;border-bottom:1px solid var(--border-subtle);">' +
              '<div class="meta-line" style="justify-content:space-between;margin-bottom:4px;">' +
              '<span class="meta-code">' + esc(c.id + ' · ' + c.departementId.toUpperCase() + ' ' + c.niveau + ' ' + c.groupe) + '</span>' +
              '<button type="button" class="link-action" style="color:var(--danger);" data-delete-complaint="' + esc(c.id) + '" aria-label="Supprimer">' + I.trash + '</button></div>' +
              '<h3 style="font-size:0.9rem;font-weight:600;">' + esc(c.objet) + '</h3>' +
              '<p style="font-size:0.76rem;color:var(--text-secondary);margin-top:2px;">' + esc(c.typeReclamation + ' · Par ' + c.nomComplet) + '</p>' +
              '<p style="font-size:0.76rem;color:var(--text-muted);margin-top:4px;">' + esc(c.description) + '</p>' +
              '</div>'
            );
          })
          .join('')
      : '<p class="card-pad" style="font-size:0.82rem;color:var(--text-muted);">Aucune réclamation enregistrée pour l’instant. Soumettez le formulaire pour tester la sauvegarde locale.</p>';

    return (
      '<section class="container page-section">' +
      '<div class="page-header"><div><p class="kicker">UMBB Boumerdès · Guichet pédagogique numérique (Démo LocalStorage)</p>' +
      '<h1 class="page-title">Formulaire de réclamations</h1>' +
      '<p class="page-subtitle">Signalez une anomalie d’inscription, un conflit d’emploi du temps ou une erreur de groupe pour la Faculté des Sciences et la Faculté de Technologie.</p></div></div>' +

      '<div class="grid-12">' +
      '<div class="col-span-7 card card-pad">' +
      (state.complaintSuccessRef
        ? '<div role="status" style="margin-bottom:20px;padding:14px;border-radius:10px;background:rgba(13,148,136,0.12);border:1px solid var(--teal);display:flex;gap:10px;">' +
          '<span style="color:var(--teal);">' + I.checkCircle + '</span>' +
          '<div style="font-size:0.84rem;"><strong>Réclamation enregistrée (Réf. ' + esc(state.complaintSuccessRef) + ')</strong>' +
          '<p style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px;">Sauvegardée localement dans votre navigateur pour la démonstration.</p></div></div>'
        : '') +
      '<form id="form-complaint" novalidate style="display:flex;flex-direction:column;gap:16px;">' +
      '<div class="grid-2" style="gap:14px;">' +
      '<div><label class="field-label" for="rec-nom">Nom et prénom *</label><input type="text" id="rec-nom" class="input-field" placeholder="Ex. Riad Akli" /><p id="err-rec-nom" class="field-error"></p></div>' +
      '<div><label class="field-label" for="rec-email">Adresse email *</label><input type="email" id="rec-email" class="input-field" placeholder="etudiant@etu-demo.univ.edu" /><p id="err-rec-email" class="field-error"></p></div>' +
      '</div>' +
      '<div class="grid-3" style="gap:14px;">' +
      '<div><label class="field-label" for="rec-dept">Département</label><select id="rec-dept" class="select-field">' +
      ctx.departments.map(function (d) { return '<option value="' + esc(d.id) + '">' + esc(d.code + ' — ' + d.nomCourt) + '</option>'; }).join('') +
      '</select></div>' +
      '<div><label class="field-label" for="rec-niveau">Niveau</label><select id="rec-niveau" class="select-field"><option value="L3">L3</option><option value="M1">M1</option><option value="M2" selected>M2</option></select></div>' +
      '<div><label class="field-label" for="rec-groupe">Groupe</label><select id="rec-groupe" class="select-field"><option value="G1">Groupe G1</option><option value="G2">Groupe G2</option><option value="G3">Groupe G3</option></select></div>' +
      '</div>' +
      '<div><label class="field-label" for="rec-type">Type de réclamation</label><select id="rec-type" class="select-field">' +
      '<option>Erreur de note / évaluation</option><option>Changement ou erreur de groupe</option><option>Conflit d’emploi du temps</option><option>Absence sur liste officielle</option><option>Demande administrative / attestation</option>' +
      '</select></div>' +
      '<div><label class="field-label" for="rec-objet">Objet de la demande *</label><input type="text" id="rec-objet" class="input-field" placeholder="Ex. Correction d’affectation dans le groupe G1" /><p id="err-rec-objet" class="field-error"></p></div>' +
      '<div><label class="field-label" for="rec-desc">Description détaillée *</label><textarea id="rec-desc" rows="4" class="textarea-field" placeholder="Précisez les éléments utiles (module, matricule, date)..."></textarea><p id="err-rec-desc" class="field-error"></p></div>' +
      '<div><button type="submit" class="btn-primary">Soumettre la réclamation</button></div>' +
      '</form></div>' +

      '<aside class="col-span-5" style="display:flex;flex-direction:column;gap:20px;">' +
      '<div class="card card-pad" style="background:var(--sky-soft);border-color:var(--sky);">' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;font-weight:700;margin-bottom:8px;">' + I.info + '<span>Fonctionnement statique &amp; Backend requis</span></div>' +
      '<p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6;">Hébergé gratuitement sans serveur sur Netlify, GitHub Pages ou Cloudflare Pages. Pour la démonstration, les réclamations sont conservées dans le <strong>LocalStorage</strong>. En production réelle, l’envoi au secrétariat nécessite un backend (API Node/PHP) ou un service externe (Netlify Forms, Formspree, EmailJS).</p>' +
      '</div>' +
      '<div class="card"><div class="day-card-header"><h2 class="card-title" style="font-size:0.95rem;">Réclamations enregistrées (' + ctx.complaints.length + ')</h2><span style="font-size:0.75rem;color:var(--text-muted);">Local</span></div>' +
      '<div style="max-height:420px;overflow-y:auto;">' + historyHtml + '</div></div>' +
      '</aside></div></section>'
    );
  }

  function renderNews(ctx, state) {
    var I = window.FT_ICONS;
    var cat = state.newsCat || 'Toutes';
    var q = (state.newsQuery || '').trim().toLowerCase();
    var filtered = ctx.news.filter(function (n) {
      var mc = cat === 'Toutes' || n.categorie === cat;
      var mq = !q || (n.titre + ' ' + n.resume + ' ' + n.contenu).toLowerCase().indexOf(q) !== -1;
      return mc && mq;
    });

    var cats = ['Toutes', 'Pédagogie', 'Examens', 'Événement', 'Recherche', 'Administration'];
    var tabs = cats
      .map(function (c) {
        return '<button type="button" class="filter-tab ' + (cat === c ? 'active' : '') + '" data-news-cat="' + esc(c) + '">' + esc(c) + '</button>';
      })
      .join('');

    var cards = filtered.length
      ? '<div class="grid-3">' +
        filtered
          .map(function (n) {
            return (
              '<article class="card" style="display:flex;flex-direction:column;justify-content:space-between;">' +
              '<div>' +
              (n.image ? '<div class="card-media-1610">' + safeImg(n.image, n.titre, n.titre) + '</div>' : '') +
              '<div class="card-pad"><div class="meta-line" style="margin-bottom:8px;"><span style="color:var(--teal);font-weight:600;">' + esc(n.categorie) + '</span><span>·</span><span class="font-mono tabular-nums">' + esc(n.date) + '</span></div>' +
              '<h2 class="card-title">' + esc(n.titre) + '</h2>' +
              '<p class="card-desc">' + esc(n.resume) + '</p></div></div>' +
              '<div class="card-pad" style="padding-top:12px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">' +
              '<span style="font-size:0.75rem;color:var(--text-muted);">' + esc(n.auteur) + '</span>' +
              '<button type="button" class="link-action" data-read-news="' + esc(n.id) + '">Lire le communiqué</button>' +
              '</div></article>'
            );
          })
          .join('') +
        '</div>'
      : '<div class="card card-pad" style="text-align:center;color:var(--text-muted);">Aucune annonce ne correspond à votre recherche.</div>';

    return (
      '<section class="container page-section">' +
      '<div class="page-header"><div><p class="kicker">UMBB Boumerdès · Communication FS &amp; FT (Démo)</p>' +
      '<h1 class="page-title">Actualités et annonces</h1>' +
      '<p class="page-subtitle">Suivez les notes pédagogiques, les avis d’examens et les journées scientifiques des campus de Boumerdès.</p></div></div>' +
      '<div class="toolbar">' +
      '<div class="search-input-wrap"><span class="search-input-icon">' + I.search + '</span>' +
      '<input type="search" id="news-search-input" class="input-field with-icon" value="' + esc(state.newsQuery || '') + '" placeholder="Rechercher dans les annonces..." /></div>' +
      '<div class="segmented-group">' + tabs + '</div></div>' +
      cards +
      '<div id="modal-news-reader" class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal-dialog">' +
      '<div class="modal-header"><span id="news-modal-meta" class="meta-line"></span><button type="button" class="mobile-menu-toggle" style="display:inline-flex;" id="btn-close-news-modal" aria-label="Fermer">' + I.close + '</button></div>' +
      '<div id="news-modal-body" class="modal-body"></div></div></div>' +
      '</section>'
    );
  }

  function renderCalendar(ctx, state) {
    var I = window.FT_ICONS;
    var type = state.calType || 'Tous';
    var filtered = ctx.calendarEvents.filter(function (ev) { return type === 'Tous' || ev.type === type; });
    var types = ['Tous', 'Examens', 'Vacances', 'Événement', 'Soutenances', 'Rentrée'];

    return (
      '<section class="container page-section">' +
      '<div class="page-header split"><div><p class="kicker">UMBB Boumerdès · Année académique 2026–2027 (Démo)</p>' +
      '<h1 class="page-title">Calendrier universitaire</h1>' +
      '<p class="page-subtitle">Dates clés des examens, vacances universitaires et soutenances pour la Faculté des Sciences et la Faculté de Technologie.</p></div>' +
      '<button type="button" class="btn-primary" id="btn-cal-pdf">' + I.download + '<span>Télécharger le calendrier (PDF)</span></button></div>' +
      '<div class="segmented-group" style="margin-bottom:24px;">' +
      types.map(function (t) { return '<button type="button" class="filter-tab ' + (type === t ? 'active' : '') + '" data-cal-type="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') +
      '</div>' +
      '<div class="card">' +
      filtered
        .map(function (ev) {
          var per = ev.dateDebut === ev.dateFin ? ev.dateDebut : ev.dateDebut + ' → ' + ev.dateFin;
          return (
            '<div style="padding:20px;border-bottom:1px solid var(--border-subtle);display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;align-items:start;">' +
            '<div style="display:flex;align-items:center;gap:8px;color:var(--sky);" class="font-mono tabular-nums"><strong>' + I.calendar + ' ' + esc(per) + '</strong></div>' +
            '<div><p style="font-size:0.75rem;font-weight:600;color:var(--teal);">' + esc(ev.type) + '</p>' +
            '<h2 class="card-title" style="font-size:1.05rem;margin-top:2px;">' + esc(ev.titre) + '</h2>' +
            '<p class="card-desc">' + esc(ev.description) + '</p></div>' +
            '<div style="font-size:0.8rem;color:var(--text-muted);">' + esc(ev.concerne) + '</div></div>'
          );
        })
        .join('') +
      '</div></section>'
    );
  }

  function renderFaq(ctx, state) {
    var I = window.FT_ICONS;
    var cat = state.faqCat || 'Toutes';
    var q = (state.faqQuery || '').trim().toLowerCase();
    var openId = state.faqOpenId !== undefined ? state.faqOpenId : (ctx.faqItems[0] && ctx.faqItems[0].id);

    var filtered = ctx.faqItems.filter(function (f) {
      var mc = cat === 'Toutes' || f.categorie === cat;
      var mq = !q || (f.question + ' ' + f.reponse).toLowerCase().indexOf(q) !== -1;
      return mc && mq;
    });

    var cats = ['Toutes', 'Emplois du temps', 'Listes & Inscriptions', 'Réclamations', 'Général'];
    return (
      '<section class="container page-section" style="max-width:920px;">' +
      '<div class="page-header"><div><p class="kicker">Aide &amp; Accompagnement</p>' +
      '<h1 class="page-title">Foire aux questions (FAQ)</h1>' +
      '<p class="page-subtitle">Réponses aux questions les plus fréquentes concernant l’utilisation de FT CONNECT.</p></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px;">' +
      '<div class="search-input-wrap" style="max-width:100%;"><span class="search-input-icon">' + I.search + '</span>' +
      '<input type="search" id="faq-search-input" class="input-field with-icon" value="' + esc(state.faqQuery || '') + '" placeholder="Rechercher une question..." /></div>' +
      '<div class="segmented-group">' +
      cats.map(function (c) { return '<button type="button" class="filter-tab ' + (cat === c ? 'active' : '') + '" data-faq-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') +
      '</div></div>' +
      '<div style="display:flex;flex-direction:column;gap:12px;">' +
      filtered
        .map(function (item) {
          var isOpen = openId === item.id;
          return (
            '<div class="faq-item">' +
            '<button type="button" class="faq-trigger" aria-expanded="' + isOpen + '" data-faq-toggle="' + esc(item.id) + '">' +
            '<div><span style="display:block;font-size:0.75rem;font-weight:600;color:var(--sky);margin-bottom:2px;">' + esc(item.categorie) + '</span>' +
            '<span class="card-title" style="font-size:1rem;">' + esc(item.question) + '</span></div>' +
            '<span>' + I.chevronDown + '</span></button>' +
            (isOpen ? '<div class="faq-body">' + esc(item.reponse) + '</div>' : '') +
            '</div>'
          );
        })
        .join('') +
      '</div></section>'
    );
  }

  function renderDashboard(ctx) {
    var I = window.FT_ICONS;
    var totalSpecs = ctx.departments.reduce(function (a, d) { return a + d.specialites.length; }, 0);
    var breakdown = ctx.departments.map(function (d) {
      return {
        dept: d,
        tc: ctx.teachers.filter(function (t) { return t.departementId === d.id; }).length,
        sc: ctx.students.filter(function (s) { return s.departementId === d.id; }).length,
        cc: ctx.schedules.filter(function (c) { return c.departementId === d.id; }).length,
      };
    });
    var maxStu = Math.max.apply(null, [1].concat(breakdown.map(function (b) { return b.sc; })));

    return (
      '<section class="container page-section">' +
      '<div class="page-header split">' +
      '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">' +
      '<img src="./assets/images/umbb_ft_logo.jpeg" alt="Logo UMBB Boumerdès" class="umbb-crest-md" />' +
      '<div><p class="kicker">UMBB Boumerdès · Synthèse quantitative (Démo)</p>' +
      '<h1 class="page-title">Tableau de bord · FS &amp; FT</h1>' +
      '<p class="page-subtitle">Vue consolidée des indicateurs de démonstration (Faculté des Sciences &amp; Faculté de Technologie) et téléchargement du rapport de projet M2RT.</p></div>' +
      '</div>' +
      '<button type="button" class="btn-primary" id="btn-dash-report">' + I.download + '<span>Télécharger le rapport de projet (PDF)</span></button>' +
      '</div>' +

      '<div class="grid-4" style="margin-bottom:28px;">' +
      '<button type="button" class="card-interactive" data-nav="/departements"><div class="meta-line" style="justify-content:space-between;margin-bottom:10px;"><span>Départements actifs</span>' + I.building + '</div><p class="font-display tabular-nums" style="font-size:2rem;font-weight:700;">' + ctx.departments.length + '</p><p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">' + totalSpecs + ' spécialités</p></button>' +
      '<button type="button" class="card-interactive" data-nav="/enseignants"><div class="meta-line" style="justify-content:space-between;margin-bottom:10px;"><span>Enseignants répertoriés</span>' + I.users + '</div><p class="font-display tabular-nums" style="font-size:2rem;font-weight:700;">' + ctx.teachers.length + '</p><p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">Professeur à MAA</p></button>' +
      '<button type="button" class="card-interactive" data-nav="/etudiants"><div class="meta-line" style="justify-content:space-between;margin-bottom:10px;"><span>Étudiants (fiches démo)</span>' + I.spreadsheet + '</div><p class="font-display tabular-nums" style="font-size:2rem;font-weight:700;">' + ctx.students.length + '</p><p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">Export PDF &amp; Excel</p></button>' +
      '<button type="button" class="card-interactive" data-nav="/actualites"><div class="meta-line" style="justify-content:space-between;margin-bottom:10px;"><span>Annonces / Réclamations</span>' + I.bell + '</div><p class="font-display tabular-nums" style="font-size:2rem;font-weight:700;">' + ctx.news.length + ' / ' + ctx.complaints.length + '</p><p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">' + ctx.schedules.length + ' séances planifiées</p></button>' +
      '</div>' +

      '<div class="grid-12">' +
      '<div class="col-span-7 card card-pad" style="display:flex;flex-direction:column;gap:16px;">' +
      '<h2 class="card-title">Répartition des effectifs fictifs par département</h2>' +
      breakdown
        .map(function (b) {
          var pct = Math.max(8, Math.round((b.sc / maxStu) * 100));
          return (
            '<div><div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:6px;">' +
            '<button type="button" class="link-action" style="color:var(--text-primary);" data-nav="/departements/' + esc(b.dept.id) + '">' + esc(b.dept.code + ' — ' + b.dept.nom) + '</button>' +
            '<span class="font-mono tabular-nums" style="color:var(--text-muted);">' + b.sc + ' étu. · ' + b.tc + ' ens.</span></div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%;"></div></div></div>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="col-span-5 table-wrap">' +
      '<div class="day-card-header"><h2 class="card-title" style="font-size:1rem;">Synthèse tabulaire</h2></div>' +
      '<table class="data-table"><thead><tr><th>Dép.</th><th style="text-align:right;">Spéc.</th><th style="text-align:right;">Ens.</th><th style="text-align:right;">Séances</th></tr></thead><tbody>' +
      breakdown
        .map(function (b) {
          return (
            '<tr><td class="font-mono" style="font-weight:700;color:var(--sky);">' + esc(b.dept.code) + '</td>' +
            '<td class="font-mono tabular-nums" style="text-align:right;">' + b.dept.specialites.length + '</td>' +
            '<td class="font-mono tabular-nums" style="text-align:right;">' + b.tc + '</td>' +
            '<td class="font-mono tabular-nums" style="text-align:right;">' + b.cc + '</td></tr>'
          );
        })
        .join('') +
      '</tbody></table></div></div></section>'
    );
  }

  function renderNotFound() {
    var I = window.FT_ICONS;
    return (
      '<section class="container page-section" style="max-width:680px;text-align:center;padding-top:72px;padding-bottom:72px;">' +
      '<p class="font-mono" style="color:var(--sky);font-weight:600;margin-bottom:10px;">Erreur 404 · Page introuvable</p>' +
      '<h1 class="page-title">La ressource demandée n’existe pas sur FT CONNECT.</h1>' +
      '<p class="page-subtitle" style="margin:14px auto 24px;">L’adresse saisie est peut-être incorrecte ou la rubrique a été déplacée.</p>' +
      '<div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">' +
      '<button type="button" class="btn-primary" data-nav="/">' + I.arrowLeft + '<span>Retour à l’accueil</span></button>' +
      '<button type="button" class="btn-secondary" id="btn-404-search">' + I.search + '<span>Recherche globale</span></button>' +
      '</div></section>'
    );
  }

  return {
    esc: esc,
    safeImg: safeImg,
    renderHome: renderHome,
    renderDepartments: renderDepartments,
    renderDepartmentDetail: renderDepartmentDetail,
    renderTimetables: renderTimetables,
    renderTeachers: renderTeachers,
    renderStudents: renderStudents,
    renderComplaints: renderComplaints,
    renderNews: renderNews,
    renderCalendar: renderCalendar,
    renderFaq: renderFaq,
    renderDashboard: renderDashboard,
    renderNotFound: renderNotFound,
  };
})();
