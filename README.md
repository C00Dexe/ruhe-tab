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

Im Ordner `ruhe-tab-firefox` liegt das eigenständige Firefox-Projekt. Die vorherige Firefox-Oberfläche wurde durch neue Module ersetzt. Der ältere Ordner `ruhe-tab` bleibt als frühere Chrome-Fassung erhalten.

- `model.mjs`: Datenprüfung, Datum und Übernahme alter Daten.
- `storage.mjs`: Firefox-Speicheradapter.
- `app.mjs`: Oberfläche und Bedienung.
- `index.html`, `style.css`, `manifest.json`: Seitenstruktur, Gestaltung und Firefox-Konfiguration.
- `tests/model.test.mjs`: sieben automatisierte Logik- und Speichertests, ausführen mit `node tests/model.test.mjs`.
- `tests/ui.cjs`: UI-Prüfung in Chromium mit ausdrücklich simuliertem Firefox-Speicher; benötigt Playwright und Chromium. Kein Ersatz für einen Firefox-Installationstest.
- `tools/package-firefox.py`: erzeugt die XPI mit Python 3 ohne zusätzliche Pakete. Ausführen mit `python3 tools/package-firefox.py`.

Die Logiktests, UI-Prüfung und Mozilla-Manifestprüfung waren erfolgreich. **Der native Firefox-Installationstest ist offen**, weil Firefox in der Ausführungsumgebung nicht vollständig startete. Alle Details stehen im Prüfbericht.

MIT-Lizenz: [LICENSE.txt](ruhe-tab-firefox/LICENSE.txt).
