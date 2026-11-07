# Ruhe Tab 2 – für Firefox neu entwickelt

Eine kleine, lokale Neue-Tab-Erweiterung für Firefox Desktop ab Version 140. Dunkles Design, Uhrzeit, persönliche Begrüßung, Tagesziel, Aufgabenliste und eigene Webseiten-Verknüpfungen. Keine Konten, Abos, Werbung, Analysewerkzeuge oder extern geladenen Inhalte.

**[Firefox-XPI herunterladen](downloads/ruhe-tab-firefox-2.0.0.xpi?raw=true)** · [Anleitung](ruhe-tab-firefox/ANLEITUNG.md) · [Prüfbericht](ruhe-tab-firefox/PRUEFBERICHT.md)

Bei diesem privaten Repository musst du zum Herunterladen bei GitHub angemeldet sein. Falls GitHub die Dateiansicht statt des Downloads zeigt, klicke dort auf das Download-Symbol („Download raw file“). Alternativ **Code → Download ZIP** wählen: Die XPI liegt im entpackten Ordner unter `downloads`.

## Direkt unsigniert ausprobieren

1. In Firefox `about:debugging#/runtime/this-firefox` öffnen.
2. **Temporäres Add-on laden…** anklicken und die heruntergeladene **XPI-Datei** auswählen.
3. Einen neuen Tab öffnen und eine eventuelle Rückfrage zum Beibehalten der neuen Tab-Seite bestätigen.

Das funktioniert ohne Mozilla-Signatur und endet mit dem Firefox-Neustart. Alternativ kannst du im entpackten Projekt `ruhe-tab-firefox/manifest.json` auswählen.

## In der Firefox Developer Edition installieren

In Developer Edition, Nightly und den dafür vorgesehenen ESR-Versionen ist auch eine Installation unsignierter Dateien über den Add-on-Manager möglich:

1. In diesem Entwicklerprofil `about:config` öffnen.
2. `xpinstall.signatures.required` suchen und auf **false** setzen. Das schaltet die Signaturpflicht für alle Erweiterungen in diesem Profil aus; verwende dort eigene bzw. vertrauenswürdige Pakete.
3. `about:addons` öffnen, auf das Zahnrad klicken und **Add-on aus Datei installieren…** wählen.
4. `ruhe-tab-firefox-2.0.0.xpi` auswählen und die Installation bestätigen.
5. Einen neuen Tab öffnen.

Diese Installation ist im Gegensatz zum temporären Laden nicht auf die laufende Sitzung begrenzt. Eine feste Erweiterungs-ID ist enthalten. Für den normalen Firefox-Release ist für die dauerhafte Installation eine Mozilla-Signierung nötig. Es wurde nichts bei Mozilla veröffentlicht oder signiert.

Quelle: [Mozillas Anleitung zu unsignierten Erweiterungen](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/).

## Bedienung

- **Einstellungen** unten links öffnet ein kleines Namensfeld. Erneuter Klick, Außenklick oder Escape schließt es. Der Seiteninhalt wird dabei nicht verschoben.
- Tagesziel eingeben und mit Enter speichern. Das Kästchen markiert es als erledigt. Ein neuer lokaler Tag zeigt ein leeres Tagesziel.
- Aufgaben mit Enter oder + hinzufügen, abhaken und mit × löschen. Bis zu 50 Aufgaben.
- Über **+ Verknüpfung hinzufügen** Namen und HTTP(S)-Adresse einer Webseite speichern. Die Kachel öffnet sie im selben Tab. **Bearbeiten → ×** löscht sie. Bis zu zwölf Verknüpfungen.

## Firefox als Grundlage

Version 2 wurde neu geschrieben und verwendet direkt `browser.storage.local` und `browser.storage.onChanged`. Einzelne Aufgaben und Verknüpfungen haben eigene Speicherschlüssel. Eingaben in einem Feld bleiben erhalten, wenn ein anderer Tab eine andere Aufgabe ändert.

Die einzige API-Berechtigung heißt `storage`. Die Erweiterung liest weder Verlauf noch Firefox-Lesezeichen. Webseiten-Kacheln legst du selbst an. Die Symbole entstehen lokal aus Buchstaben; erst beim Öffnen einer Kachel kontaktiert Firefox die gewählte Webseite. Keine Synchronisierung mit Servern oder anderen Browsern.

Kein Framework, kein Build-Schritt zum Starten, kein Hintergrundskript oder Service Worker. Nur ein Timer bis zur nächsten Minute bei sichtbarer Seite. Die strenge Sicherheitsrichtlinie blockiert externe Verbindungen aus der Erweiterungsseite.

## Aktualisieren von der alten Firefox-Version

Schließe alte Ruhe-Tabs. Lade das neue Paket mit derselben Add-on-ID `ruhe-tab@c00dexe` im gleichen Firefox-Profil. Die Firefox-interne ID bleibt gleich. Noch vorhandene alte Seitendaten aus Version 1 werden einmalig in den Firefox-Erweiterungsspeicher übernommen und nicht gelöscht. Es gibt keinen automatischen Import aus Chrome. Bei einer temporären Installation kann das Entladen Daten löschen; eine verlässliche Sicherung wird dadurch nicht ersetzt.

## Quellcode und Prüfungen

Im Ordner `ruhe-tab-firefox` liegt das eigenständige Firefox-Projekt. Die vorherige Firefox-Oberfläche wurde durch neue Module ersetzt. Der Ordner `ruhe-tab` enthält die getrennt gepflegte Chrome-Version.

- `model.mjs`: Datenprüfung, Datum und Übernahme alter Daten.
- `storage.mjs`: Firefox-Speicheradapter.
- `app.mjs`: Oberfläche und Bedienung.
- `index.html`, `style.css`, `manifest.json`: Seitenstruktur, Gestaltung und Firefox-Konfiguration.
- `tests/model.test.mjs`: sieben automatisierte Logik- und Speichertests, ausführen mit `node tests/model.test.mjs`.
- `tests/ui.cjs`: UI-Prüfung in Chromium mit ausdrücklich simuliertem Firefox-Speicher; benötigt Playwright und Chromium. Kein Ersatz für einen Firefox-Installationstest.
- `tools/package-firefox.py`: erzeugt die XPI mit Python 3 ohne zusätzliche Pakete. Ausführen mit `python3 tools/package-firefox.py`.

Die Logiktests, UI-Prüfung und Mozilla-Manifestprüfung waren erfolgreich. **Der native Firefox-Installationstest ist offen**, weil Firefox in der Ausführungsumgebung nicht vollständig startete. Alle Details stehen im Prüfbericht.

MIT-Lizenz: [LICENSE.txt](ruhe-tab-firefox/LICENSE.txt).


## Google Chrome – anpassbare Widgets (Version 1.7.0)

Die Chrome-Version liegt im Ordner **ruhe-tab**. [Projekt als ZIP herunterladen](https://github.com/C00Dexe/ruhe-tab/archive/refs/heads/main.zip).

Unten links bleibt **Chrome anpassen** erreichbar. Dort kannst du unter **Widgets** Uhr, Begrüßung, Tagesziel, Aufgabenliste, Webseiten-Verknüpfungen und Kalender einzeln ein- oder ausschalten. Jeden Typ gibt es einmal. Ausblenden erhält Inhalte, Position und Fenstergröße. Sind alle ausgeblendet, führt **Widgets hinzufügen** wieder zur Auswahl.

Über **Anordnung → Layout bearbeiten** verschiebst du Widgets an ihrer Griffleiste und änderst ihre Breite und Höhe durch Ziehen an allen Rändern und Ecken. Das × blendet das jeweilige Widget aus. **Layout fertig** beendet die Bearbeitung. Die Fenster bleiben auf den verfügbaren Platz begrenzt; längere Inhalte lassen sich im Widget scrollen. Die Schrift bleibt beim Ziehen gleich groß. Unter **Schriftgröße** gibt es dafür sechs separate Regler von **75–150 %**. Alles bleibt lokal gespeichert und wird zwischen geöffneten Ruhe-Tabs abgeglichen.

**Standardanordnung wiederherstellen** ordnet neu und erhält selbst gezogene Fenstergrößen. **Standardfenstergrößen wiederherstellen** setzt nur Breite und Höhe zurück. **Standardschriftgrößen wiederherstellen** setzt nur die Prozentregler zurück. Inhalte, Hintergrund und Sichtbarkeit bleiben bei allen drei Aktionen erhalten. Die Fußleiste zeigt nur noch **Nur lokal.**

Unter **Chrome anpassen** stehen außerdem drei lokale Farbverläufe und eigene JPG-, PNG- oder WebP-Bilder bis 10 MB zur Auswahl. Eigene Bilder werden einmalig proportional auf höchstens 2560 × 1440 Pixel verkleinert und lokal in IndexedDB gespeichert. Kleine Bilder werden nicht vergrößert. Die Originaldatei bleibt unverändert. ×, Escape oder ein Außenklick schließen das Anpassungsfeld.

Zum Aktualisieren alte Ruhe-Tabs schließen, die Dateien aus dem neuen Unterordner `ruhe-tab` in den **bisherigen Chrome-Installationsordner** kopieren und unter `chrome://extensions` bei Ruhe Tab auf ↻ klicken. Den Ordnerpfad nicht ändern und die Erweiterung nicht entfernen. So wird der bisherige lokale Speicher weiterverwendet. Vorhandene Positionen werden übernommen; die bisherigen Prozentwerte bleiben als Schriftgrößen erhalten. Firefox wird mit diesem Update nicht geändert.

[Chrome-Anleitung](ruhe-tab/ANLEITUNG.md) · [Chrome-Prüfbericht](ruhe-tab/PRUEFBERICHT.md)

Automatisierte Browserprüfungen (Playwright und Chromium; optional `CHROMIUM_PATH` setzen):

- `node tests/chrome-windows.cjs`: Ein-/Ausblenden, Größenänderung an Rändern und Ecken, unveränderte Schrift beim Ziehen, Wiederherstellung, Grenzen, Abbruch, Abgleich zwischen Tabs und Fehlerfälle.
- `node tests/chrome-widget-sizes.cjs`: separate Schriftregler, Vorschau, Speicherung, Tastatur, Zurücksetzen und schmale Fenster.
- `node tests/chrome-widget-layout.cjs`: freies Verschieben mit Maus, Touch und Tastatur, alte Positionen, Speicherung, Fensterwechsel und keine dauernde Animationsschleife.
- `node tests/chrome-backgrounds.cjs`: echte IndexedDB-Speicherung, Bildanpassung, alte Bilddaten, Neuladen, Abgleich zwischen Tabs und Fehlerfälle.

### Lokaler Kalender und Termine in Chrome

Das Widget **Kalender & Termine** zeigt den Monat, Termine des ausgewählten Tages und die nächsten fünf anstehenden Termine. **+ Termin** öffnet ein Formular für Titel, Datum und optionale Uhrzeit. Ohne Uhrzeit ist der Termin ganztägig. Zum Bearbeiten oder Löschen einen vorhandenen Termin anklicken. Ein Punkt markiert Tage mit Terminen.

Bis zu 500 Termine bleiben ausschließlich im aktuellen Browserprofil gespeichert und werden zwischen geöffneten Ruhe-Tabs abgeglichen. Es gibt keine Konten, Serververbindungen oder Geräte-Synchronisierung. Der Kalender verwendet den vorhandenen Uhr-Takt; es gibt keinen zusätzlichen Hintergrundtimer. Größe und Position sind wie bei den anderen Widgets anpassbar. Vorhandene Positionen werden übernommen; bisherige Prozentwerte bleiben als Schriftgrößen erhalten.

Prüfungen: `node tests/calendar-model.test.mjs` für die Datums- und Terminlogik sowie `tests/chrome-calendar.cjs` für die Browserbedienung (Playwright und Chromium; optional `CHROMIUM_PATH`).
