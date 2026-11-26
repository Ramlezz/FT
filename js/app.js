// Contrôleur principal FT CONNECT : routeur hash, état global, modales, notifications et événements
(function () {
  var DATA = window.FT_DATA;
  var STORAGE = window.FT_STORAGE;
  var EXPORT = window.FT_EXPORT;
  var PAGES = window.FT_PAGES;
  var I = window.FT_ICONS;

  var state = {
    theme: STORAGE.getTheme(),
    customDepartments: STORAGE.getCustomDepartments(),
    complaints: STORAGE.getComplaints(),
    readNotifIds: STORAGE.getReadNotifIds(),
    openMenu: null,
    notifOpen: false,
    mobileOpen: false,
    searchOpen: false,
    searchQuery: '',
    deptQuery: '',
    deptLevel: 'Tous',
    deptFaculty: 'Toutes',
    deptDetailSpecId: '',
    ttDept: 'get',
    ttLevel: 'M2',
    ttSpec: 'm2rt',
    ttGroup: 'G1',
    ttView: 'semaine',
    teacherQuery: '',
    teacherDept: 'all',
    stuQuery: '',
    stuDept: 'all',
    stuLevel: 'all',
    stuSpec: 'all',
    stuGroup: 'all',
    complaintSuccessRef: null,
    newsCat: 'Toutes',
    newsQuery: '',
    calType: 'Tous',
    faqCat: 'Toutes',
    faqQuery: '',
    faqOpenId: DATA.faq[0] ? DATA.faq[0].id : null,
  };

  function getContext() {
    return {
      departments: DATA.departements.concat(state.customDepartments),
      teachers: DATA.enseignants,
      schedules: DATA.emploisDuTemps,
      students: DATA.etudiants,
      news: DATA.actualites,
      calendarEvents: DATA.calendrier,
      faqItems: DATA.faq,
      complaints: state.complaints,
    };
  }

  function parseHash() {
    var h = window.location.hash;
    if (!h || h === '#' || h === '#/') return '/';
    return h.charAt(0) === '#' ? h.slice(1) : h;
  }

  function applyTheme() {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    STORAGE.saveTheme(state.theme);
    var btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.innerHTML =
        state.theme === 'dark'
          ? I.sun + '<span>Mode clair</span>'
          : I.moon + '<span>Mode sombre</span>';
      btn.setAttribute(
        'aria-label',
        state.theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'
      );
    }
  }

  function showToast(title, desc, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast-card';
    var iconHtml =
      type === 'error'
        ? '<span style="color:var(--danger);">' + I.info + '</span>'
        : type === 'info'
          ? '<span style="color:var(--sky);">' + I.info + '</span>'
          : '<span style="color:var(--teal);">' + I.checkCircle + '</span>';
    el.innerHTML =
      iconHtml +
      '<div style="flex:1;min-width:0;"><p style="font-size:0.85rem;font-weight:600;">' +
      PAGES.esc(title) +
      '</p>' +
      (desc
        ? '<p style="font-size:0.76rem;color:var(--text-secondary);margin-top:2px;">' +
          PAGES.esc(desc) +
          '</p>'
        : '') +
      '</div><button type="button" class="mobile-menu-toggle" style="display:inline-flex;padding:4px;border:none;" aria-label="Fermer">' +
      I.close +
      '</button>';
    el.querySelector('button').addEventListener('click', function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    container.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 4200);
  }

  function navigate(path) {
    var normalized = path.charAt(0) === '/' ? path : '/' + path;
    window.location.hash = '#' + normalized;
    state.openMenu = null;
    state.mobileOpen = false;
    state.notifOpen = false;
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getNotifications(ctx) {
    var list = ctx.news.slice(0, 4).map(function (n) {
      var nid = 'notif-' + n.id;
      return {
        id: nid,
        titre: n.titre,
        message: n.resume,
        date: n.date,
        lien: '/actualites',
        lue: state.readNotifIds.indexOf(nid) !== -1,
      };
    });
    if (ctx.complaints.length) {
      var c = ctx.complaints[0];
      var cid = 'notif-' + c.id;
      list.unshift({
        id: cid,
        titre: 'Réclamation ' + c.id + ' enregistrée',
        message: c.objet + ' · Sauvegarde locale démo.',
        date: c.dateCreation.slice(0, 10),
        lien: '/reclamations',
        lue: state.readNotifIds.indexOf(cid) !== -1,
      });
    }
    return list;
  }

  function renderChrome(ctx, path) {
    // Liens actifs navbar
    document.querySelectorAll('[data-nav-prefix]').forEach(function (el) {
      var prefix = el.getAttribute('data-nav-prefix');
      var active = prefix === '/' ? path === '/' || path === '/accueil' : path.indexOf(prefix) === 0;
      if (prefix === '/annuaires') {
        active = path.indexOf('/enseignants') === 0 || path.indexOf('/etudiants') === 0;
      }
      if (prefix === '/services') {
        active =
          path.indexOf('/reclamations') === 0 ||
          path.indexOf('/actualites') === 0 ||
          path.indexOf('/calendrier') === 0 ||
          path.indexOf('/faq') === 0 ||
          path.indexOf('/tableau-de-bord') === 0;
      }
      el.classList.toggle('active', active);
    });

    // Menu déroulant Départements
    var deptMenu = document.getElementById('dropdown-depts-list');
    if (deptMenu) {
      deptMenu.innerHTML =
        '<button type="button" class="dropdown-btn header-item" data-nav="/departements">Tous les départements (' +
        ctx.departments.length +
        ')</button>' +
        ctx.departments
          .map(function (d) {
            return (
              '<button type="button" class="dropdown-btn" data-nav="/departements/' +
              PAGES.esc(d.id) +
              '"><span>' +
              PAGES.esc(d.nom) +
              '</span><span class="font-mono" style="font-size:0.75rem;color:var(--text-muted);">' +
              PAGES.esc(d.code) +
              '</span></button>'
            );
          })
          .join('');
    }

    // Footer départements
    var footerDepts = document.getElementById('footer-depts-list');
    if (footerDepts) {
      footerDepts.innerHTML = ctx.departments
        .slice(0, 5)
        .map(function (d) {
          return (
            '<li><button type="button" class="footer-link" data-nav="/departements/' +
            PAGES.esc(d.id) +
            '">' +
            PAGES.esc(d.nomCourt + ' (' + d.code + ')') +
            '</button></li>'
          );
        })
        .join('');
    }

    // Fil d'Ariane
    var bcEl = document.getElementById('breadcrumbs');
    if (bcEl) {
      var crumbs = [{ label: 'Accueil', path: '/' }];
      if (path !== '/' && path !== '/accueil') {
        var segs = path.split('/').filter(Boolean);
        var map = {
          departements: 'Départements',
          'emplois-du-temps': 'Emplois du temps',
          enseignants: 'Annuaire des enseignants',
          etudiants: 'Listes des étudiants',
          reclamations: 'Réclamations',
          actualites: 'Actualités et annonces',
          calendrier: 'Calendrier universitaire',
          faq: 'Foire aux questions',
          'tableau-de-bord': 'Tableau de bord',
        };
        if (map[segs[0]]) {
          crumbs.push({ label: map[segs[0]], path: '/' + segs[0] });
          if (segs[0] === 'departements' && segs[1]) {
            var dp = ctx.departments.find(function (d) { return d.id === segs[1]; });
            crumbs.push({ label: dp ? dp.nomCourt : 'Introuvable', path: path });
          }
        } else {
          crumbs.push({ label: 'Page introuvable (404)', path: path });
        }
      }

      bcEl.innerHTML =
        I.home +
        crumbs
          .map(function (c, idx) {
            var last = idx === crumbs.length - 1;
            var sep = idx > 0 ? I.chevronRight : '';
            return (
              sep +
              (last
                ? '<span class="crumb-current">' + PAGES.esc(c.label) + '</span>'
                : '<button type="button" class="crumb-btn" data-nav="' + PAGES.esc(c.path) + '">' + PAGES.esc(c.label) + '</button>')
            );
          })
          .join('');
    }

    // Notifications
    var notifs = getNotifications(ctx);
    var unread = notifs.filter(function (n) { return !n.lue; }).length;
    var notifBtn = document.getElementById('btn-notif-toggle');
    if (notifBtn) {
      notifBtn.innerHTML =
        I.bell +
        '<span>Notifications</span>' +
        (unread > 0
          ? '<span class="font-mono tabular-nums" style="color:var(--teal);font-weight:700;">(' + unread + ')</span>'
          : '');
    }
    var notifListEl = document.getElementById('notif-list-body');
    if (notifListEl) {
      notifListEl.innerHTML = notifs
        .map(function (n) {
          return (
            '<button type="button" class="notif-item ' +
            (n.lue ? '' : 'unread') +
            '" data-notif-id="' +
            PAGES.esc(n.id) +
            '" data-notif-link="' +
            PAGES.esc(n.lien) +
            '">' +
            '<div class="meta-line" style="justify-content:space-between;margin-bottom:4px;"><span class="font-mono tabular-nums">' +
            PAGES.esc(n.date) +
            '</span><span>' +
            (n.lue ? 'Lu' : 'Nouveau') +
            '</span></div>' +
            '<p style="font-size:0.85rem;font-weight:600;">' +
            PAGES.esc(n.titre) +
            '</p>' +
            '<p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px;">' +
            PAGES.esc(n.message) +
            '</p></button>'
          );
        })
        .join('');
    }

    // Dropdowns & drawers visibility
    ['depts', 'annuaire', 'portail'].forEach(function (m) {
      var panel = document.getElementById('dropdown-' + m);
      if (panel) panel.classList.toggle('open', state.openMenu === m);
    });
    var mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileDrawer) mobileDrawer.classList.toggle('open', state.mobileOpen);
    var notifPop = document.getElementById('notif-popover');
    if (notifPop) notifPop.classList.toggle('open', state.notifOpen);
  }

  function renderMain(ctx, path) {
    var mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    if (path === '/' || path === '/accueil') {
      mainEl.innerHTML = PAGES.renderHome(ctx);
    } else if (path === '/departements') {
      mainEl.innerHTML = PAGES.renderDepartments(ctx, state);
      bindDepartmentsEvents(ctx);
    } else if (path.indexOf('/departements/') === 0) {
      var id = path.replace('/departements/', '').split('/')[0];
      mainEl.innerHTML = PAGES.renderDepartmentDetail(ctx, state, id);
      bindDepartmentDetailEvents(ctx, id);
    } else if (path === '/emplois-du-temps') {
      mainEl.innerHTML = PAGES.renderTimetables(ctx, state);
      bindTimetablesEvents(ctx);
    } else if (path === '/enseignants') {
      mainEl.innerHTML = PAGES.renderTeachers(ctx, state);
      bindTeachersEvents(ctx);
    } else if (path === '/etudiants') {
      mainEl.innerHTML = PAGES.renderStudents(ctx, state);
      bindStudentsEvents(ctx);
    } else if (path === '/reclamations') {
      mainEl.innerHTML = PAGES.renderComplaints(ctx, state);
      bindComplaintsEvents(ctx);
    } else if (path === '/actualites') {
      mainEl.innerHTML = PAGES.renderNews(ctx, state);
      bindNewsEvents(ctx);
    } else if (path === '/calendrier') {
      mainEl.innerHTML = PAGES.renderCalendar(ctx, state);
      bindCalendarEvents(ctx);
    } else if (path === '/faq') {
      mainEl.innerHTML = PAGES.renderFaq(ctx, state);
      bindFaqEvents(ctx);
    } else if (path === '/tableau-de-bord') {
      mainEl.innerHTML = PAGES.renderDashboard(ctx);
      bindDashboardEvents(ctx);
    } else {
      mainEl.innerHTML = PAGES.renderNotFound();
      var b404 = document.getElementById('btn-404-search');
      if (b404) b404.addEventListener('click', openSearchModal);
    }
  }

  function bindDepartmentsEvents(ctx) {
    var search = document.getElementById('dept-search-input');
    if (search) {
      search.addEventListener('input', function (e) {
        state.deptQuery = e.target.value;
        renderMain(getContext(), parseHash());
        var refocused = document.getElementById('dept-search-input');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(refocused.value.length, refocused.value.length);
        }
      });
    }
    document.querySelectorAll('[data-dept-faculty]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.deptFaculty = btn.getAttribute('data-dept-faculty');
        renderMain(getContext(), parseHash());
      });
    });
    document.querySelectorAll('[data-dept-level]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.deptLevel = btn.getAttribute('data-dept-level');
        renderMain(getContext(), parseHash());
      });
    });
    document.querySelectorAll('[data-remove-dept]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-remove-dept');
        state.customDepartments = state.customDepartments.filter(function (d) { return d.id !== id; });
        STORAGE.saveCustomDepartments(state.customDepartments);
        showToast('Département retiré', 'Le département démo a été supprimé.', 'info');
        renderAll();
      });
    });

    var modal = document.getElementById('modal-add-dept');
    var openBtn = document.getElementById('btn-open-add-dept');
    var closeBtn = document.getElementById('btn-close-add-dept');
    var cancelBtn = document.getElementById('btn-cancel-add-dept');
    if (openBtn && modal) {
      openBtn.addEventListener('click', function () { modal.classList.add('open'); });
    }
    [closeBtn, cancelBtn].forEach(function (b) {
      if (b && modal) b.addEventListener('click', function () { modal.classList.remove('open'); });
    });
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    var form = document.getElementById('form-add-dept');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var facEl = document.getElementById('new-dept-fac');
        var fac = facEl ? facEl.value : 'Faculté de Technologie';
        var nom = document.getElementById('new-dept-nom').value.trim();
        var code = document.getElementById('new-dept-code').value.trim().toUpperCase().slice(0, 8);
        var desc = document.getElementById('new-dept-desc').value.trim();
        var resp = document.getElementById('new-dept-resp').value.trim();
        var email = document.getElementById('new-dept-email').value.trim();
        var bat = document.getElementById('new-dept-bat').value.trim();
        var spec = document.getElementById('new-dept-spec').value.trim();
        var errEl = document.getElementById('add-dept-error');

        if (!nom || !code || !desc || !resp) {
          errEl.textContent = 'Veuillez renseigner le nom, le code, la description et le responsable.';
          errEl.style.display = 'block';
          return;
        }
        var idSlug = code.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Date.now().toString().slice(-4);
        state.customDepartments.push({
          id: idSlug,
          code: code,
          faculte: fac,
          nom: nom,
          nomCourt: nom.slice(0, 28),
          description: desc,
          presentationLongue: desc + ' (' + fac + ' · UMBB Boumerdès · Ajouté en mode démonstration locale.)',
          responsable: {
            nom: resp,
            grade: 'Maître de Conférences A',
            email: email || code.toLowerCase() + '@ft-demo.univ.edu',
            bureau: 'Bureau Direction · Démo',
          },
          coordonnees: {
            batiment: bat || 'Nouveau Pôle Technologique (Démo)',
            telephone: '+213 (0)21 00 49 00',
            emailSecretariat: 'secretariat.' + code.toLowerCase() + '@ft-demo.univ.edu',
            horairesAccueil: 'Lundi au Jeudi · 08h30 – 15h30',
          },
          image: './assets/images/dept_computing_lab_1795627237136.jpg',
          laboratoires: ['Laboratoire pédagogique de démonstration'],
          niveaux: ['L3', 'M1', 'M2'],
          specialites: [{ id: idSlug + '-spec', nom: spec || 'Spécialité ' + code, niveau: 'M2', groupes: ['G1'] }],
          estPersonnalise: true,
        });
        STORAGE.saveCustomDepartments(state.customDepartments);
        modal.classList.remove('open');
        showToast('Département ajouté', nom + ' est maintenant visible dans le portail.');
        renderAll();
      });
    }
  }

  function bindDepartmentDetailEvents(ctx, deptId) {
    var dept = ctx.departments.find(function (d) { return d.id === deptId; });
    if (!dept) return;

    document.querySelectorAll('[data-dept-spec]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.deptDetailSpecId = btn.getAttribute('data-dept-spec');
        renderMain(getContext(), parseHash());
      });
    });

    var exportSchedBtn = document.getElementById('btn-dept-export-sched');
    if (exportSchedBtn) {
      exportSchedBtn.addEventListener('click', function () {
        var specId = state.deptDetailSpecId || (dept.specialites[0] && dept.specialites[0].id);
        var activeSpec = dept.specialites.find(function (s) { return s.id === specId; }) || dept.specialites[0];
        var sess = ctx.schedules.filter(function (s) {
          return s.departementId === deptId && (!activeSpec || s.specialiteId === activeSpec.id);
        });
        EXPORT.exportScheduleToPDF(sess, {
          departementNom: dept.nom,
          niveau: activeSpec ? activeSpec.niveau : 'M2',
          specialiteNom: activeSpec ? activeSpec.nom : dept.nom,
          groupe: 'Tous groupes',
        });
        showToast('PDF généré', 'Emploi du temps du département téléchargé.');
      });
    }

    var stuPdf = document.getElementById('btn-dept-stu-pdf');
    if (stuPdf) {
      stuPdf.addEventListener('click', function () {
        var list = ctx.students.filter(function (s) { return s.departementId === deptId; });
        EXPORT.exportStudentsToPDF(list, dept.nom);
        showToast('Liste exportée en PDF');
      });
    }
    var stuXls = document.getElementById('btn-dept-stu-xls');
    if (stuXls) {
      stuXls.addEventListener('click', function () {
        var list = ctx.students.filter(function (s) { return s.departementId === deptId; });
        EXPORT.exportStudentsToExcel(list);
        showToast('Liste exportée en Excel (.xls)');
      });
    }
  }

  function bindTimetablesEvents(ctx) {
    var deptSel = document.getElementById('tt-dept');
    var lvlSel = document.getElementById('tt-level');
    var specSel = document.getElementById('tt-spec');
    var grpSel = document.getElementById('tt-group');

    if (deptSel) {
      deptSel.addEventListener('change', function (e) {
        state.ttDept = e.target.value;
        var d = ctx.departments.find(function (x) { return x.id === state.ttDept; }) || ctx.departments[0];
        if (d.niveaux.indexOf(state.ttLevel) === -1) state.ttLevel = d.niveaux[0];
        var specs = d.specialites.filter(function (s) { return s.niveau === state.ttLevel; });
        state.ttSpec = specs[0] ? specs[0].id : '';
        state.ttGroup = specs[0] && specs[0].groupes[0] ? specs[0].groupes[0] : 'G1';
        renderMain(getContext(), parseHash());
      });
    }
    if (lvlSel) {
      lvlSel.addEventListener('change', function (e) {
        state.ttLevel = e.target.value;
        var d = ctx.departments.find(function (x) { return x.id === state.ttDept; }) || ctx.departments[0];
        var specs = d.specialites.filter(function (s) { return s.niveau === state.ttLevel; });
        state.ttSpec = specs[0] ? specs[0].id : '';
        state.ttGroup = specs[0] && specs[0].groupes[0] ? specs[0].groupes[0] : 'G1';
        renderMain(getContext(), parseHash());
      });
    }
    if (specSel) {
      specSel.addEventListener('change', function (e) {
        state.ttSpec = e.target.value;
        renderMain(getContext(), parseHash());
      });
    }
    if (grpSel) {
      grpSel.addEventListener('change', function (e) {
        state.ttGroup = e.target.value;
        renderMain(getContext(), parseHash());
      });
    }

    document.querySelectorAll('[data-tt-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.ttView = btn.getAttribute('data-tt-view');
        renderMain(getContext(), parseHash());
      });
    });

    ['btn-tt-reset', 'btn-tt-reset-link'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function () {
          state.ttDept = 'get';
          state.ttLevel = 'M2';
          state.ttSpec = 'm2rt';
          state.ttGroup = 'G1';
          renderMain(getContext(), parseHash());
        });
      }
    });

    var printBtn = document.getElementById('btn-tt-print');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

    var pdfBtn = document.getElementById('btn-tt-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function () {
        var d = ctx.departments.find(function (x) { return x.id === state.ttDept; }) || ctx.departments[0];
        var sp = d.specialites.find(function (s) { return s.id === state.ttSpec; }) || d.specialites[0];
        var sess = ctx.schedules.filter(function (s) {
          return s.departementId === d.id && s.niveau === state.ttLevel && (!sp || s.specialiteId === sp.id) && s.groupe === state.ttGroup;
        });
        EXPORT.exportScheduleToPDF(sess, {
          departementNom: d.nom,
          niveau: state.ttLevel,
          specialiteNom: sp ? sp.nom : state.ttSpec,
          groupe: state.ttGroup,
        });
        showToast('PDF généré', 'L’emploi du temps a été téléchargé au format PDF.');
      });
    }
  }

  function bindTeachersEvents() {
    var search = document.getElementById('teacher-search-input');
    if (search) {
      search.addEventListener('input', function (e) {
        state.teacherQuery = e.target.value;
        renderMain(getContext(), parseHash());
        var rf = document.getElementById('teacher-search-input');
        if (rf) {
          rf.focus();
          rf.setSelectionRange(rf.value.length, rf.value.length);
        }
      });
    }
    document.querySelectorAll('[data-teacher-dept]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.teacherDept = btn.getAttribute('data-teacher-dept');
        renderMain(getContext(), parseHash());
      });
    });
    document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var email = btn.getAttribute('data-copy-email');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(
            function () { showToast('Adresse copiée', email + ' copiée dans le presse-papiers.', 'info'); },
            function () { showToast('Email', email, 'info'); }
          );
        } else {
          showToast('Email', email, 'info');
        }
      });
    });
  }

  function bindStudentsEvents(ctx) {
    var search = document.getElementById('stu-search');
    if (search) {
      search.addEventListener('input', function (e) {
        state.stuQuery = e.target.value;
        renderMain(getContext(), parseHash());
        var rf = document.getElementById('stu-search');
        if (rf) {
          rf.focus();
          rf.setSelectionRange(rf.value.length, rf.value.length);
        }
      });
    }
    var dept = document.getElementById('stu-dept');
    if (dept) {
      dept.addEventListener('change', function (e) {
        state.stuDept = e.target.value;
        state.stuSpec = 'all';
        renderMain(getContext(), parseHash());
      });
    }
    var lvl = document.getElementById('stu-level');
    if (lvl) {
      lvl.addEventListener('change', function (e) {
        state.stuLevel = e.target.value;
        state.stuSpec = 'all';
        renderMain(getContext(), parseHash());
      });
    }
    var spec = document.getElementById('stu-spec');
    if (spec) {
      spec.addEventListener('change', function (e) {
        state.stuSpec = e.target.value;
        renderMain(getContext(), parseHash());
      });
    }
    var grp = document.getElementById('stu-group');
    if (grp) {
      grp.addEventListener('change', function (e) {
        state.stuGroup = e.target.value;
        renderMain(getContext(), parseHash());
      });
    }
    var reset = document.getElementById('btn-stu-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        state.stuDept = 'all';
        state.stuLevel = 'all';
        state.stuSpec = 'all';
        state.stuGroup = 'all';
        state.stuQuery = '';
        renderMain(getContext(), parseHash());
      });
    }

    function getFilteredStudents() {
      var q = (state.stuQuery || '').trim().toLowerCase();
      return ctx.students.filter(function (st) {
        if (state.stuDept !== 'all' && st.departementId !== state.stuDept) return false;
        if (state.stuLevel !== 'all' && st.niveau !== state.stuLevel) return false;
        if (state.stuSpec !== 'all' && st.specialiteId !== state.stuSpec) return false;
        if (state.stuGroup !== 'all' && st.groupe !== state.stuGroup) return false;
        if (q && (st.matricule + ' ' + st.nom + ' ' + st.prenom + ' ' + st.specialiteNom + ' ' + st.email).toLowerCase().indexOf(q) === -1) return false;
        return true;
      });
    }

    var pdfBtn = document.getElementById('btn-stu-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function () {
        var list = getFilteredStudents();
        EXPORT.exportStudentsToPDF(list, state.stuDept.toUpperCase() + ' · ' + state.stuLevel + ' · ' + state.stuGroup);
        showToast('Export PDF réussi', list.length + ' étudiant(s) exporté(s).');
      });
    }
    var xlsBtn = document.getElementById('btn-stu-xls');
    if (xlsBtn) {
      xlsBtn.addEventListener('click', function () {
        var list = getFilteredStudents();
        EXPORT.exportStudentsToExcel(list);
        showToast('Export Excel réussi', list.length + ' ligne(s) exportée(s).');
      });
    }
  }

  function bindComplaintsEvents(ctx) {
    var form = document.getElementById('form-complaint');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nom = document.getElementById('rec-nom').value.trim();
        var email = document.getElementById('rec-email').value.trim();
        var deptId = document.getElementById('rec-dept').value;
        var niv = document.getElementById('rec-niveau').value;
        var grp = document.getElementById('rec-groupe').value;
        var type = document.getElementById('rec-type').value;
        var objet = document.getElementById('rec-objet').value.trim();
        var desc = document.getElementById('rec-desc').value.trim();

        var ok = true;
        document.getElementById('err-rec-nom').textContent = '';
        document.getElementById('err-rec-email').textContent = '';
        document.getElementById('err-rec-objet').textContent = '';
        document.getElementById('err-rec-desc').textContent = '';

        if (nom.length < 3) {
          document.getElementById('err-rec-nom').textContent = 'Nom et prénom requis (min. 3 caractères).';
          ok = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          document.getElementById('err-rec-email').textContent = 'Adresse email invalide.';
          ok = false;
        }
        if (objet.length < 5) {
          document.getElementById('err-rec-objet').textContent = 'Objet requis (min. 5 caractères).';
          ok = false;
        }
        if (desc.length < 15) {
          document.getElementById('err-rec-desc').textContent = 'Description requise (min. 15 caractères).';
          ok = false;
        }
        if (!ok) return;

        var deptObj = ctx.departments.find(function (d) { return d.id === deptId; });
        var rec = {
          id: 'REC-' + Date.now().toString().slice(-6),
          nomComplet: nom,
          email: email,
          departementId: deptId,
          departementNom: deptObj ? deptObj.nom : deptId.toUpperCase(),
          niveau: niv,
          groupe: grp,
          typeReclamation: type,
          objet: objet,
          description: desc,
          dateCreation: new Date().toISOString(),
          statut: 'Enregistrée (Démo locale)',
        };
        state.complaints.unshift(rec);
        STORAGE.saveComplaints(state.complaints);
        state.complaintSuccessRef = rec.id;
        showToast('Réclamation enregistrée', 'Référence ' + rec.id + ' sauvegardée localement.');
        renderAll();
      });
    }

    document.querySelectorAll('[data-delete-complaint]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-delete-complaint');
        state.complaints = state.complaints.filter(function (c) { return c.id !== id; });
        STORAGE.saveComplaints(state.complaints);
        showToast('Entrée supprimée', 'La réclamation locale a été retirée.', 'info');
        renderAll();
      });
    });
  }

  function bindNewsEvents(ctx) {
    var search = document.getElementById('news-search-input');
    if (search) {
      search.addEventListener('input', function (e) {
        state.newsQuery = e.target.value;
        renderMain(getContext(), parseHash());
        var rf = document.getElementById('news-search-input');
        if (rf) {
          rf.focus();
          rf.setSelectionRange(rf.value.length, rf.value.length);
        }
      });
    }
    document.querySelectorAll('[data-news-cat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.newsCat = btn.getAttribute('data-news-cat');
        renderMain(getContext(), parseHash());
      });
    });

    var modal = document.getElementById('modal-news-reader');
    var closeBtn = document.getElementById('btn-close-news-modal');
    if (closeBtn && modal) closeBtn.addEventListener('click', function () { modal.classList.remove('open'); });
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    document.querySelectorAll('[data-read-news]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-read-news');
        var item = ctx.news.find(function (n) { return n.id === id; });
        if (!item || !modal) return;
        document.getElementById('news-modal-meta').innerHTML =
          '<span style="color:var(--teal);font-weight:600;">' + PAGES.esc(item.categorie) + '</span> · <span class="font-mono">' + PAGES.esc(item.date) + '</span>';
        document.getElementById('news-modal-body').innerHTML =
          (item.image ? '<div class="card-media-1610" style="border-radius:10px;margin-bottom:14px;">' + PAGES.safeImg(item.image, item.titre, item.titre) + '</div>' : '') +
          '<h2 class="card-title" style="font-size:1.35rem;margin-bottom:8px;">' + PAGES.esc(item.titre) + '</h2>' +
          '<p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:14px;">Publié par : ' + PAGES.esc(item.auteur) + '</p>' +
          '<p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.65;">' + PAGES.esc(item.contenu) + '</p>';
        modal.classList.add('open');
      });
    });
  }

  function bindCalendarEvents(ctx) {
    document.querySelectorAll('[data-cal-type]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.calType = btn.getAttribute('data-cal-type');
        renderMain(getContext(), parseHash());
      });
    });
    var pdfBtn = document.getElementById('btn-cal-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function () {
        var list = ctx.calendarEvents.filter(function (ev) { return state.calType === 'Tous' || ev.type === state.calType; });
        EXPORT.exportCalendarToPDF(list);
        showToast('Calendrier exporté', 'Le calendrier PDF a été téléchargé.');
      });
    }
  }

  function bindFaqEvents() {
    var search = document.getElementById('faq-search-input');
    if (search) {
      search.addEventListener('input', function (e) {
        state.faqQuery = e.target.value;
        renderMain(getContext(), parseHash());
        var rf = document.getElementById('faq-search-input');
        if (rf) {
          rf.focus();
          rf.setSelectionRange(rf.value.length, rf.value.length);
        }
      });
    }
    document.querySelectorAll('[data-faq-cat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.faqCat = btn.getAttribute('data-faq-cat');
        renderMain(getContext(), parseHash());
      });
    });
    document.querySelectorAll('[data-faq-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-faq-toggle');
        state.faqOpenId = state.faqOpenId === id ? null : id;
        renderMain(getContext(), parseHash());
      });
    });
  }

  function bindDashboardEvents(ctx) {
    var btn = document.getElementById('btn-dash-report');
    if (btn) {
      btn.addEventListener('click', function () {
        EXPORT.exportProjectReportToPDF({
          departements: ctx.departments.length,
          enseignants: ctx.teachers.length,
          etudiants: ctx.students.length,
          actualites: ctx.news.length,
        });
        showToast('Rapport PDF téléchargé', 'Rapport M2RT (Riad Akli, Lounis, Bourai, Sofiane Hammoum) généré.');
      });
    }
  }

  function openSearchModal() {
    state.searchOpen = true;
    state.searchQuery = '';
    var modal = document.getElementById('modal-global-search');
    var input = document.getElementById('global-search-input');
    if (modal) modal.classList.add('open');
    renderSearchResults();
    if (input) {
      input.value = '';
      setTimeout(function () { input.focus(); }, 30);
    }
  }

  function closeSearchModal() {
    state.searchOpen = false;
    var modal = document.getElementById('modal-global-search');
    if (modal) modal.classList.remove('open');
  }

  function renderSearchResults() {
    var ctx = getContext();
    var q = state.searchQuery.trim().toLowerCase();
    var results = [];

    ctx.departments.forEach(function (d) {
      if (!q || (d.nom + ' ' + d.code + ' ' + d.description).toLowerCase().indexOf(q) !== -1) {
        results.push({ type: 'Département', titre: d.nom + ' (' + d.code + ')', sub: 'Responsable : ' + d.responsable.nom, path: '/departements/' + d.id });
      }
    });
    ctx.teachers.forEach(function (t) {
      if (!q || (t.prenom + ' ' + t.nom + ' ' + t.specialite + ' ' + t.email).toLowerCase().indexOf(q) !== -1) {
        results.push({ type: 'Enseignant', titre: t.grade + ' ' + t.prenom + ' ' + t.nom, sub: t.specialite + ' · ' + t.email, path: '/enseignants' });
      }
    });
    ctx.news.forEach(function (n) {
      if (!q || (n.titre + ' ' + n.resume + ' ' + n.categorie).toLowerCase().indexOf(q) !== -1) {
        results.push({ type: 'Actualité', titre: n.titre, sub: n.categorie + ' · ' + n.date, path: '/actualites' });
      }
    });
    [
      { type: 'Document', titre: 'Emplois du temps téléchargeables (PDF)', sub: 'Sélection par spécialité et groupe', path: '/emplois-du-temps' },
      { type: 'Document', titre: 'Listes des étudiants (PDF / Excel)', sub: ctx.students.length + ' fiches démo', path: '/etudiants' },
      { type: 'Document', titre: 'Rapport de projet M2RT (PDF)', sub: 'Riad Akli, Lounis, Bourai, Sofiane Hammoum', path: '/tableau-de-bord' },
    ].forEach(function (doc) {
      if (!q || (doc.titre + ' ' + doc.sub).toLowerCase().indexOf(q) !== -1) results.push(doc);
    });
    ctx.calendarEvents.forEach(function (ev) {
      if (!q || (ev.titre + ' ' + ev.type + ' ' + ev.concerne).toLowerCase().indexOf(q) !== -1) {
        results.push({ type: 'Calendrier', titre: ev.titre, sub: ev.dateDebut + ' · ' + ev.concerne, path: '/calendrier' });
      }
    });

    results = results.slice(0, 12);
    var box = document.getElementById('global-search-results');
    var countEl = document.getElementById('global-search-count');
    if (countEl) countEl.textContent = results.length + ' résultat(s) affiché(s)';
    if (!box) return;
    if (!results.length) {
      box.innerHTML = '<div style="padding:28px;text-align:center;font-size:0.86rem;color:var(--text-muted);">Aucun résultat trouvé pour « ' + PAGES.esc(state.searchQuery) + ' ».</div>';
      return;
    }
    box.innerHTML = results
      .map(function (r) {
        return (
          '<button type="button" class="dropdown-btn" style="padding:12px 16px;border-bottom:1px solid var(--border-subtle);" data-search-nav="' +
          PAGES.esc(r.path) +
          '">' +
          '<div style="min-width:0;"><div style="font-size:0.72rem;color:var(--sky);font-weight:600;">' +
          PAGES.esc(r.type) +
          '</div><p style="font-size:0.88rem;font-weight:600;color:var(--text-primary);">' +
          PAGES.esc(r.titre) +
          '</p><p style="font-size:0.75rem;color:var(--text-muted);">' +
          PAGES.esc(r.sub) +
          '</p></div>' +
          I.arrowRight +
          '</button>'
        );
      })
      .join('');

    box.querySelectorAll('[data-search-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeSearchModal();
        navigate(btn.getAttribute('data-search-nav'));
      });
    });
  }

  function renderAll() {
    var ctx = getContext();
    var path = parseHash();
    renderChrome(ctx, path);
    renderMain(ctx, path);
  }

  // Délégation globale pour [data-nav] et notifications
  document.addEventListener('click', function (e) {
    var quickFac = e.target.closest('[data-quick-faculty]');
    if (quickFac) {
      state.deptFaculty = quickFac.getAttribute('data-quick-faculty');
    }
    var navTarget = e.target.closest('[data-nav]');
    if (navTarget) {
      e.preventDefault();
      navigate(navTarget.getAttribute('data-nav'));
      return;
    }

    var notifItem = e.target.closest('[data-notif-id]');
    if (notifItem) {
      var nid = notifItem.getAttribute('data-notif-id');
      if (state.readNotifIds.indexOf(nid) === -1) {
        state.readNotifIds.push(nid);
        STORAGE.saveReadNotifIds(state.readNotifIds);
      }
      navigate(notifItem.getAttribute('data-notif-link'));
      return;
    }

    var menuTrigger = e.target.closest('[data-menu-toggle]');
    if (menuTrigger) {
      var m = menuTrigger.getAttribute('data-menu-toggle');
      state.openMenu = state.openMenu === m ? null : m;
      state.notifOpen = false;
      renderChrome(getContext(), parseHash());
      return;
    }

    if (!e.target.closest('.nav-item') && !e.target.closest('#notif-wrap')) {
      if (state.openMenu || state.notifOpen) {
        state.openMenu = null;
        state.notifOpen = false;
        renderChrome(getContext(), parseHash());
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme();
    renderAll();

    var themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        showToast(
          state.theme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé',
          'Votre préférence d’affichage a été sauvegardée.',
          'info'
        );
      });
    }

    var mobileBtn = document.getElementById('btn-mobile-toggle');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function () {
        state.mobileOpen = !state.mobileOpen;
        renderChrome(getContext(), parseHash());
      });
    }

    var notifBtn = document.getElementById('btn-notif-toggle');
    if (notifBtn) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.notifOpen = !state.notifOpen;
        state.openMenu = null;
        renderChrome(getContext(), parseHash());
      });
    }

    var markAllBtn = document.getElementById('btn-notif-read-all');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', function () {
        var allIds = getNotifications(getContext()).map(function (n) { return n.id; });
        state.readNotifIds = allIds;
        STORAGE.saveReadNotifIds(allIds);
        showToast('Notifications marquées comme lues', undefined, 'info');
        renderChrome(getContext(), parseHash());
      });
    }

    var searchOpenBtn = document.getElementById('btn-open-search');
    if (searchOpenBtn) searchOpenBtn.addEventListener('click', openSearchModal);

    var searchCloseBtn = document.getElementById('btn-close-search');
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchModal);

    var searchModal = document.getElementById('modal-global-search');
    if (searchModal) {
      searchModal.addEventListener('click', function (e) {
        if (e.target === searchModal) closeSearchModal();
      });
    }

    var searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        state.searchQuery = e.target.value;
        renderSearchResults();
      });
    }

    window.addEventListener('hashchange', function () {
      renderAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (state.searchOpen) closeSearchModal();
        else openSearchModal();
      } else if (e.key === 'Escape' && state.searchOpen) {
        closeSearchModal();
      }
    });
  });
})();
