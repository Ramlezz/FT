// Persistance locale via LocalStorage (préférences, réclamations démo, départements ajoutés)
window.FT_STORAGE = (function () {
  var KEYS = {
    THEME: 'ft_connect_theme',
    COMPLAINTS: 'ft_connect_reclamations',
    CUSTOM_DEPTS: 'ft_connect_custom_departments',
    READ_NOTIFS: 'ft_connect_read_notifications',
  };

  function safeParse(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  return {
    getTheme: function () {
      try {
        var saved = localStorage.getItem(KEYS.THEME);
        if (saved === 'dark' || saved === 'light') return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch (e) {}
      return 'light';
    },
    saveTheme: function (theme) {
      try {
        localStorage.setItem(KEYS.THEME, theme);
      } catch (e) {}
    },
    getComplaints: function () {
      return safeParse(KEYS.COMPLAINTS, []);
    },
    saveComplaints: function (list) {
      try {
        localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(list));
      } catch (e) {}
    },
    getCustomDepartments: function () {
      return safeParse(KEYS.CUSTOM_DEPTS, []);
    },
    saveCustomDepartments: function (list) {
      try {
        localStorage.setItem(KEYS.CUSTOM_DEPTS, JSON.stringify(list));
      } catch (e) {}
    },
    getReadNotifIds: function () {
      return safeParse(KEYS.READ_NOTIFS, []);
    },
    saveReadNotifIds: function (ids) {
      try {
        localStorage.setItem(KEYS.READ_NOTIFS, JSON.stringify(ids));
      } catch (e) {}
    },
  };
})();
