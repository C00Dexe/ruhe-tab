# Chrome-Prüfbericht – Version 1.4.0

## Widgetgrößen

Die Originaldateien wurden mit Playwright und Chromium 154 über einen ausschließlich lokalen Testserver mit der Sicherheitsrichtlinie aus dem Manifest geprüft. Der Testserver gehört nicht zur Erweiterung. Testskript: `tests/chrome-widget-sizes.cjs` (Playwright und Chromium; optional `CHROMIUM_PATH`).

Erfolgreich geprüft:

- Alle fünf Regler verändern unabhängig Schrift und gerenderte Widgetabmessungen. Vorschau bei `input`, Speicherung bei `change`.
- Speicherung nach Neuladen sowie Tastaturbedienung mit Pfeiltasten.
- Abgleich zwischen geöffneten Tabs; Änderungen an einer Größe übernehmen die zuletzt gespeicherten anderen Größen.
- 75 und 150 Prozent bei 320, 390, 800, 1000, 1100 und 1440 Pixeln Fensterbreite: keine horizontalen Überläufe oder Überschneidungen der Widgetbereiche.
- Anpassungsfeld bleibt unskaliert, scrollbar und bedienbar. Standardgrößen lassen sich wiederherstellen, auch in einem anderen geöffneten Tab.
- Fehlerhafte gespeicherte Werte, ungültiges JSON und simulierte Speicherfehler werden abgefangen. Ungültige Werte gelangen nicht als CSS in die Seite; bei fehlgeschlagener Speicherung wird die letzte gespeicherte Auswahl wieder angezeigt.
- Name, Tagesziel, Aufgaben und Verknüpfungen bleiben bei Größenänderung und Rücksetzen erhalten.
- Offline-Bedienung erfolgreich; keine externen Anfragen und keine unbehandelten JavaScript-Laufzeitfehler während des Tests.
- Eindeutige HTML-IDs, alle eingebundenen Skripte vorhanden, JavaScript-Syntaxprüfung erfolgreich. Keine neuen Berechtigungen oder Hintergrundprozesse.

Die Darstellung wurde zusätzlich in Standardgröße, großer Einstellung und auf einem schmalen Fenster visuell geprüft. Auf kleinen Fenstern wird die Uhr zusätzlich auf die verfügbare Breite begrenzt. Große Widgets können vertikales Scrollen erfordern. Die Hauptbereiche stehen bei schmalen Fenstern untereinander.

Die fünf Einstellungen werden getrennt von den Inhalten unter `ruhe-tab-widget-sizes-v1` in localStorage gespeichert. Es gibt keine Polling-Schleife oder neuen Timer. Die Live-Vorschau ändert nur CSS-Variablen während einer Benutzereingabe.

## Hintergrund-Prüfungen

Das bestehende Testskript `tests/chrome-backgrounds.cjs` wurde mit den neuen Dateien erneut erfolgreich ausgeführt. Es prüft echte IndexedDB-Transaktionen, Auswahl und Wiederherstellung von Farbverläufen, gültige Bilder über 1 MB, proportionale Verkleinerung auf höchstens 2560 × 1440 Pixel, kleine Bilder ohne Vergrößerung und Neuladen ohne erneute Bildverarbeitung.

Außerdem erfolgreich: Abweisen von Bildern über 10 MB, SVG und defekten Bilddateien; Erhalt des bisherigen Bildes bei abgebrochener Transaktion; Abgleich zwischen Tabs; Wechsel von Bild zu Farbverlauf; neuere Auswahl während laufender Bildverarbeitung; Offline-Bedienung; Übernahme eines alten Base64-Bildes ohne Verlust von Name oder Aufgaben; sichtbarer Fehler bei nicht verfügbarer IndexedDB.

Die Daten- und Hintergrundlogik in `newtab.js` und `appearance.js` blieb unverändert.

## Grenze der Prüfung

Die verwaltete Chromium-Installation blockiert eigene Erweiterungen über eine Installationsrichtlinie. Das tatsächliche Laden als entpackte Erweiterung und Ersetzen der neuen Tab-Seite wurde deshalb hier nicht erneut bestätigt. Die Tests decken die Originaldateien, Sicherheitsrichtlinie, browserseitige Speicher und Bedienung ab. Die Anleitung enthält den Installationstest in deinem Chrome.
