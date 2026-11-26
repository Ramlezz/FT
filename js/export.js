// Moteur d'exportation 100% JavaScript pur : PDF 1.4 (WinAnsi français) et Excel (.xls)
window.FT_EXPORT = (function () {
  // Encodage WinAnsi (Windows-1252) vers séquence échappée PDF
  var WIN_ANSI_MAP = {
    0x20ac: 0x80,
    0x201a: 0x82,
    0x0192: 0x83,
    0x201e: 0x84,
    0x2026: 0x85,
    0x2020: 0x86,
    0x2021: 0x87,
    0x02c6: 0x88,
    0x2030: 0x89,
    0x0160: 0x8a,
    0x2039: 0x8b,
    0x0152: 0x8c,
    0x017d: 0x8e,
    0x2018: 0x91,
    0x2019: 0x92,
    0x201c: 0x93,
    0x201d: 0x94,
    0x2022: 0x95,
    0x2013: 0x96,
    0x2014: 0x97,
    0x02dc: 0x98,
    0x2122: 0x99,
    0x0161: 0x9a,
    0x203a: 0x9b,
    0x0153: 0x9c,
    0x017e: 0x9e,
    0x0178: 0x9f,
  };

  function encodePdfText(str) {
    var text = String(str || '').replace(/\u2192/g, '->');
    var out = '';
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      var byteVal = 0x3f; // '?'
      if (code >= 0x20 && code <= 0x7e) {
        if (code === 0x28 || code === 0x29 || code === 0x5c) {
          out += '\\' + text[i];
        } else {
          out += text[i];
        }
        continue;
      } else if (code >= 0xa0 && code <= 0xff) {
        byteVal = code;
      } else if (WIN_ANSI_MAP[code]) {
        byteVal = WIN_ANSI_MAP[code];
      }
      var oct = byteVal.toString(8);
      while (oct.length < 3) oct = '0' + oct;
      out += '\\' + oct;
    }
    return '(' + out + ')';
  }

  function wrapLines(text, maxChars) {
    var words = String(text || '').split(/\s+/);
    var lines = [];
    var current = '';
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (!w) continue;
      if (!current) {
        current = w;
      } else if (current.length + 1 + w.length <= maxChars) {
        current += ' ' + w;
      } else {
        lines.push(current);
        current = w;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [''];
  }

  function createPdfDoc(landscape) {
    var width = landscape ? 842 : 595;
    var height = landscape ? 595 : 842;
    var pages = [[]];

    function page() {
      return pages[pages.length - 1];
    }

    return {
      width: width,
      height: height,
      addPage: function () {
        pages.push([]);
      },
      rect: function (x, yTop, w, h, r, g, b) {
        var y = height - yTop - h;
        page().push(
          r.toFixed(3) +
            ' ' +
            g.toFixed(3) +
            ' ' +
            b.toFixed(3) +
            ' rg ' +
            x.toFixed(1) +
            ' ' +
            y.toFixed(1) +
            ' ' +
            w.toFixed(1) +
            ' ' +
            h.toFixed(1) +
            ' re f'
        );
      },
      line: function (x1, yTop, x2, r, g, b) {
        var y = height - yTop;
        page().push(
          r.toFixed(3) +
            ' ' +
            g.toFixed(3) +
            ' ' +
            b.toFixed(3) +
            ' RG 0.7 w ' +
            x1.toFixed(1) +
            ' ' +
            y.toFixed(1) +
            ' m ' +
            x2.toFixed(1) +
            ' ' +
            y.toFixed(1) +
            ' l S'
        );
      },
      text: function (str, x, yTop, size, bold, r, g, b) {
        var y = height - yTop;
        var font = bold ? '/F2' : '/F1';
        page().push(
          'BT ' +
            font +
            ' ' +
            size +
            ' Tf ' +
            (r || 0).toFixed(3) +
            ' ' +
            (g || 0).toFixed(3) +
            ' ' +
            (b || 0).toFixed(3) +
            ' rg ' +
            x.toFixed(1) +
            ' ' +
            y.toFixed(1) +
            ' Td ' +
            encodePdfText(str) +
            ' Tj ET'
        );
      },
      drawTable: function (startY, headers, rows, colWidths, leftMargin) {
        var xStart = leftMargin || 36;
        var totalW = colWidths.reduce(function (a, b) {
          return a + b;
        }, 0);
        var y = startY;
        var rowH = 22;

        function drawHeader(yPos) {
          this.rect(xStart, yPos, totalW, 24, 0.043, 0.122, 0.227);
          var cx = xStart;
          for (var c = 0; c < headers.length; c++) {
            this.text(headers[c], cx + 6, yPos + 15, 8.5, true, 1, 1, 1);
            cx += colWidths[c];
          }
        }

        drawHeader.call(this, y);
        y += 24;

        for (var rIdx = 0; rIdx < rows.length; rIdx++) {
          if (y + rowH > height - 42) {
            this.addPage();
            y = 42;
            drawHeader.call(this, y);
            y += 24;
          }
          if (rIdx % 2 === 1) {
            this.rect(xStart, y, totalW, rowH, 0.973, 0.98, 0.988);
          }
          this.line(xStart, y + rowH, xStart + totalW, 0.886, 0.91, 0.941);
          var cx2 = xStart;
          for (var c2 = 0; c2 < rows[rIdx].length; c2++) {
            var maxChars = Math.max(6, Math.floor((colWidths[c2] - 10) / 4.6));
            var cellText = String(rows[rIdx][c2] || '');
            if (cellText.length > maxChars) {
              cellText = cellText.slice(0, maxChars - 2) + '..';
            }
            this.text(cellText, cx2 + 6, y + 14, 8.2, false, 0.06, 0.09, 0.16);
            cx2 += colWidths[c2];
          }
          y += rowH;
        }
        return y;
      },
      save: function (filename) {
        var objects = [];
        function addObj(body) {
          objects.push(body);
          return objects.length;
        }

        var fontRegular = addObj(
          '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
        );
        var fontBold = addObj(
          '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
        );
        var pagesId = addObj(''); // placeholder
        var pageIds = [];

        for (var p = 0; p < pages.length; p++) {
          var stream = pages[p].join('\n');
          var contentId = addObj(
            '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream'
          );
          var pageId = addObj(
            '<< /Type /Page /Parent ' +
              pagesId +
              ' 0 R /MediaBox [0 0 ' +
              width +
              ' ' +
              height +
              '] /Resources << /Font << /F1 ' +
              fontRegular +
              ' 0 R /F2 ' +
              fontBold +
              ' 0 R >> >> /Contents ' +
              contentId +
              ' 0 R >>'
          );
          pageIds.push(pageId);
        }

        objects[pagesId - 1] =
          '<< /Type /Pages /Kids [' +
          pageIds
            .map(function (id) {
              return id + ' 0 R';
            })
            .join(' ') +
          '] /Count ' +
          pageIds.length +
          ' >>';

        var catalogId = addObj('<< /Type /Catalog /Pages ' + pagesId + ' 0 R >>');

        var pdf = '%PDF-1.4\n';
        var offsets = [0];
        for (var i = 0; i < objects.length; i++) {
          offsets.push(pdf.length);
          pdf += i + 1 + ' 0 obj\n' + objects[i] + '\nendobj\n';
        }
        var xrefOffset = pdf.length;
        pdf += 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
        for (var j = 1; j < offsets.length; j++) {
          var off = String(offsets[j]);
          while (off.length < 10) off = '0' + off;
          pdf += off + ' 00000 n \n';
        }
        pdf +=
          'trailer\n<< /Size ' +
          (objects.length + 1) +
          ' /Root ' +
          catalogId +
          ' 0 R >>\nstartxref\n' +
          xrefOffset +
          '\n%%EOF';

        var bytes = new Uint8Array(pdf.length);
        for (var k = 0; k < pdf.length; k++) {
          bytes[k] = pdf.charCodeAt(k) & 0xff;
        }
        var blob = new Blob([bytes], { type: 'application/pdf' });
        triggerDownload(blob, filename);
      },
    };
  }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function xmlEscape(val) {
    return String(val || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    exportScheduleToPDF: function (sessions, meta) {
      var doc = createPdfDoc(true);
      doc.rect(0, 0, doc.width, 64, 0.043, 0.122, 0.227);
      doc.rect(0, 64, doc.width, 3, 0.776, 0.573, 0.078);
      doc.text('FT CONNECT - UMBB Boumerdès (FS · FT)', 36, 26, 15, true, 1, 1, 1);
      doc.text(
        'Emploi du temps · Faculté des Sciences & Faculté de Technologie (Démo M2RT)',
        36,
        46,
        10,
        false,
        0.85,
        0.92,
        0.98
      );

      doc.text('Département : ' + meta.departementNom, 36, 90, 11, true, 0.043, 0.122, 0.227);
      doc.text(
        'Niveau : ' +
          meta.niveau +
          '   |   Spécialité : ' +
          meta.specialiteNom +
          '   |   Groupe : ' +
          meta.groupe,
        36,
        108,
        10,
        false,
        0.2,
        0.25,
        0.33
      );

      var dayOrder = { Lundi: 1, Mardi: 2, Mercredi: 3, Jeudi: 4, Vendredi: 5 };
      var sorted = sessions.slice().sort(function (a, b) {
        var d = (dayOrder[a.jour] || 99) - (dayOrder[b.jour] || 99);
        return d !== 0 ? d : a.heureDebut.localeCompare(b.heureDebut);
      });

      var rows = sorted.map(function (s) {
        return [
          s.jour,
          s.heureDebut + ' - ' + s.heureFin,
          s.codeMatiere,
          s.matiere,
          s.type,
          s.salle,
          s.enseignantNom,
        ];
      });

      doc.drawTable(
        126,
        ['Jour', 'Horaire', 'Code', 'Module / Matière', 'Type', 'Salle', 'Enseignant'],
        rows,
        [68, 86, 72, 240, 48, 112, 144],
        36
      );

      doc.text(
        'Généré via FT CONNECT · Riad Akli, Lounis, Bourai, Sofiane Hammoum',
        36,
        doc.height - 18,
        8,
        false,
        0.4,
        0.45,
        0.55
      );

      var slug = (meta.niveau + '_' + meta.groupe + '_' + meta.specialiteNom)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_');
      doc.save('emploi_du_temps_' + slug + '.pdf');
    },

    exportStudentsToPDF: function (students, filterSummary) {
      var doc = createPdfDoc(false);
      doc.rect(0, 0, doc.width, 60, 0.043, 0.122, 0.227);
      doc.rect(0, 60, doc.width, 3, 0.776, 0.573, 0.078);
      doc.text('FT CONNECT - Liste des étudiants (UMBB Boumerdès)', 36, 26, 14, true, 1, 1, 1);
      doc.text(
        'Faculté des Sciences · Faculté de Technologie (Données de démonstration)',
        36,
        44,
        9.5,
        false,
        0.85,
        0.92,
        0.98
      );

      doc.text('Filtre appliqué : ' + filterSummary, 36, 84, 9.5, false, 0.15, 0.2, 0.3);
      doc.text('Effectif affiché : ' + students.length + ' étudiant(s)', 36, 100, 9.5, true, 0.043, 0.122, 0.227);

      var rows = students.map(function (e) {
        return [
          e.matricule,
          e.nom.toUpperCase(),
          e.prenom,
          e.niveau,
          e.specialiteNom,
          e.groupe,
          e.statut,
        ];
      });

      doc.drawTable(
        118,
        ['Matricule', 'Nom', 'Prénom', 'Niv.', 'Spécialité', 'Grp', 'Statut'],
        rows,
        [82, 82, 72, 34, 152, 36, 65],
        36
      );

      doc.save('liste_etudiants_ft_connect.pdf');
    },

    exportStudentsToExcel: function (students) {
      var headers = [
        'Matricule',
        'Nom',
        'Prénom',
        'Département',
        'Niveau',
        'Spécialité',
        'Groupe',
        'Email',
        'Statut',
      ];
      var xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<?mso-application progid="Excel.Sheet"?>\n' +
        '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
        'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
        '<Styles><Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/>' +
        '<Interior ss:Color="#0B1F3A" ss:Pattern="Solid"/></Style></Styles>\n' +
        '<Worksheet ss:Name="Etudiants_Demo"><Table>\n<Row>';

      for (var h = 0; h < headers.length; h++) {
        xml += '<Cell ss:StyleID="Header"><Data ss:Type="String">' + xmlEscape(headers[h]) + '</Data></Cell>';
      }
      xml += '</Row>\n';

      for (var i = 0; i < students.length; i++) {
        var e = students[i];
        var cols = [
          e.matricule,
          e.nom.toUpperCase(),
          e.prenom,
          e.departementId.toUpperCase(),
          e.niveau,
          e.specialiteNom,
          e.groupe,
          e.email,
          e.statut,
        ];
        xml += '<Row>';
        for (var c = 0; c < cols.length; c++) {
          xml += '<Cell><Data ss:Type="String">' + xmlEscape(cols[c]) + '</Data></Cell>';
        }
        xml += '</Row>\n';
      }
      xml += '</Table></Worksheet></Workbook>';

      var blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
      triggerDownload(blob, 'liste_etudiants_ft_connect.xls');
    },

    exportCalendarToPDF: function (events) {
      var doc = createPdfDoc(false);
      doc.rect(0, 0, doc.width, 60, 0.043, 0.122, 0.227);
      doc.rect(0, 60, doc.width, 3, 0.776, 0.573, 0.078);
      doc.text('FT CONNECT - Calendrier UMBB Boumerdès 2026-2027', 36, 26, 14, true, 1, 1, 1);
      doc.text(
        'Faculté des Sciences & Faculté de Technologie · Planning de démonstration',
        36,
        44,
        9.5,
        false,
        0.85,
        0.92,
        0.98
      );

      var rows = events.map(function (ev) {
        var per = ev.dateDebut === ev.dateFin ? ev.dateDebut : ev.dateDebut + ' -> ' + ev.dateFin;
        return [per, ev.type, ev.titre, ev.concerne];
      });

      doc.drawTable(
        82,
        ['Période', 'Type', 'Événement', 'Public concerné'],
        rows,
        [124, 72, 200, 127],
        36
      );
      doc.save('calendrier_universitaire_2026_2027.pdf');
    },

    exportProjectReportToPDF: function (stats) {
      var doc = createPdfDoc(false);
      doc.rect(0, 0, doc.width, 118, 0.043, 0.122, 0.227);
      doc.rect(0, 118, doc.width, 3.5, 0.776, 0.573, 0.078);
      doc.text(
        'UMBB BOUMERDÈS · FACULTÉ DES SCIENCES · FACULTÉ DE TECHNOLOGIE',
        40,
        36,
        9.5,
        true,
        0.49,
        0.83,
        0.99
      );
      doc.text('RAPPORT DE PROJET : FT CONNECT (M2RT)', 40, 66, 20, true, 1, 1, 1);
      doc.text(
        'Université M\'Hamed Bougara de Boumerdès · Campus Ouest & Campus Sud',
        40,
        92,
        10.5,
        false,
        0.9,
        0.94,
        0.98
      );

      // Encadré Équipe
      doc.rect(40, 138, 515, 86, 0.973, 0.98, 0.988);
      doc.text('Équipe de réalisation (UMBB · M2RT 2026-2027)', 54, 158, 11, true, 0.043, 0.122, 0.227);
      doc.text('• Riad Akli', 60, 180, 10.5, false, 0.12, 0.16, 0.23);
      doc.text('• Lounis', 300, 180, 10.5, false, 0.12, 0.16, 0.23);
      doc.text('• Bourai', 60, 202, 10.5, false, 0.12, 0.16, 0.23);
      doc.text('• Sofiane Hammoum', 300, 202, 10.5, false, 0.12, 0.16, 0.23);

      var y = 250;
      doc.text('1. Présentation générale et ancrage UMBB Boumerdès', 40, y, 12.5, true, 0.043, 0.122, 0.227);
      y += 18;
      var p1 = wrapLines(
        "FT CONNECT est un portail web centralisé destiné aux étudiants et enseignants de l'Université M'Hamed Bougara de Boumerdès (UMBB) : Faculté de Technologie (Campus Ouest, Cité Frantz Fanon) et Faculté des Sciences (Campus Sud, Route de la Gare Ferroviaire). Il regroupe départements, emplois du temps, annuaire, listes et réclamations.",
        86
      );
      for (var i = 0; i < p1.length; i++) {
        doc.text(p1[i], 40, y, 10, false, 0.2, 0.25, 0.33);
        y += 14;
      }

      y += 12;
      doc.text(
        '2. Architecture technique (100% HTML5, CSS3, JavaScript)',
        40,
        y,
        12.5,
        true,
        0.043,
        0.122,
        0.227
      );
      y += 18;
      var p2 = wrapLines(
        "Le portail repose exclusivement sur HTML5, CSS3 et JavaScript natif, sans serveur backend obligatoire, sans MySQL ni PHP. Les données de démonstration sont structurées en JSON et la persistance locale (mode sombre/clair, réclamations, départements ajoutés) s'appuie sur LocalStorage.",
        86
      );
      for (var j = 0; j < p2.length; j++) {
        doc.text(p2[j], 40, y, 10, false, 0.2, 0.25, 0.33);
        y += 14;
      }

      y += 14;
      doc.text('3. Modules réalisés dans le portail', 40, y, 12.5, true, 0.043, 0.122, 0.227);
      var rows = [
        ['Accueil & Plan du site', 'Bannière, raccourcis, départements, actualités, agenda, plan du site'],
        ['Départements (' + (stats ? stats.departements : 5) + ')', 'Fiches complètes + ajout dynamique démo via LocalStorage'],
        ['Emplois du temps', 'Filtres en cascade, vue par jour/tableau, impression et PDF'],
        ['Annuaire Enseignants (' + (stats ? stats.enseignants : 14) + ')', 'Recherche instantanée, filtre département, mailto et copie'],
        ['Listes Étudiants (' + (stats ? stats.etudiants : 20) + ')', 'Filtres complets, recherche, export PDF et Excel (.xls)'],
        ['Réclamations', 'Validation complète, confirmation et sauvegarde LocalStorage'],
        ['Services additionnels', 'Recherche globale, mode sombre, calendrier, FAQ, tableau de bord, 404'],
      ];
      doc.drawTable(y + 12, ['Module', 'Fonctionnalités clés'], rows, [155, 360], 40);

      doc.text(
        'FT CONNECT · UMBB Boumerdès · M2RT 2026-2027 · Riad Akli, Lounis, Bourai, Sofiane Hammoum',
        40,
        doc.height - 20,
        8.5,
        false,
        0.4,
        0.45,
        0.55
      );
      doc.save('rapport_ft_connect_m2rt_2026_2027.pdf');
    },
  };
})();
