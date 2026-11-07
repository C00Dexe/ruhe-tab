# Chrome-Prüfbericht – Version 1.6.0

Die Originaldateien wurden mit Playwright und Chromium 154 über einen ausschließlich lokalen Testserver mit der Sicherheitsrichtlinie aus dem Manifest geprüft. Der Testserver gehört nicht zur Erweiterung. Die Kalenderprüfung verwendete die Zeitzone Europe/Berlin und kontrollierte Browserzeiten.

## Kalender- und Terminlogik

`node tests/calendar-model.test.mjs`: **6 Tests erfolgreich, 0 fehlgeschlagen**.

Geprüft: gültige Datumswerte, Schaltjahre einschließlich Jahrhundertregeln, Montag als Wochenanfang, Monatslängen, Navigation über Monats- und Jahresgrenzen, Datumsgrenzen, Titel und optionale Uhrzeiten, chronologische Reihenfolge und ganztägige Termine sowie die Bestimmung nächster Termine anhand der lokalen Uhrzeit. Bürgerliche Datumswerte werden bei der Darstellung nicht durch eine UTC-/Ortszeit-Umrechnung auf den Vortag verschoben.

## Kalender im Browser

`tests/chrome-calendar.cjs` erfolgreich:

- Monatsansicht, Tagesauswahl, Heute-Button, Monatswechsel, Schaltjahr und Tastaturnavigation.
- Ganztägige Termine und Termine mit Uhrzeit anlegen, bearbeiten und löschen; Wiederherstellung nach Neuladen.
- Die nächsten Termine werden chronologisch angezeigt; vergangene Termine verschwinden aus der Vorschau, bleiben aber am jeweiligen Datum erhalten.
- Ungültige Eingaben werden abgefangen. HTML-artige Titel werden als Text dargestellt.
- Fehlgeschlagene Schreib- und Löschzugriffe erhalten Daten und Formulareingaben und zeigen einen Fehler.
- Unabhängige Hinzufügungen in zwei Tabs überschreiben keine anderen Termine. Ein im anderen Tab gelöschter Termin wird beim Speichern nicht versehentlich wieder angelegt.
- Offline-Speicherung und Aktualisierung nach Minuten-/Tageswechsel über das Ereignis des bereits vorhandenen Uhr-Timers.
- Kalendergröße und freie Position bei 320, 390, 800 und 1440 Pixeln Fensterbreite; kein horizontaler Überlauf.
- Beschädigte einzelne Datensätze bleiben gespeichert und erzeugen einen Hinweis. Die übrigen Termine bleiben nutzbar.
- Grenze von 500 Terminen sowie Vorschau der nächsten fünf Termine; Löschen gibt Platz frei.
- Alte Größen- und Positionsdatensätze mit fünf Widgets bleiben erhalten. Der Kalender erhält einen eigenen Ausgangswert; das spätere Speichern seiner Position erhält die anderen fünf Positionen. Das Zurücksetzen der Anordnung erhält Termine.
- Keine externen Anfragen und keine unbehandelten JavaScript-Fehler während der Bedienprüfung.

Die Darstellung wurde zusätzlich visuell geprüft. Termine liegen einzeln unter `ruhe-tab-calendar-event.<ID>` in localStorage des Browserprofils. Es gibt keinen neuen Timer, keine externe API, keinen Hintergrundprozess und keine zusätzlichen Berechtigungen.

## Vorhandene Funktionen

Die Browserprüfungen wurden mit den neuen Dateien erneut erfolgreich ausgeführt:

- `tests/chrome-widget-sizes.cjs`: unabhängige Größenregler für sechs Widgets, Vorschau, Speicherung, Tastatur, Abgleich zwischen Tabs, Reset, Fehlerfälle und Standardanordnung bei 75/150 Prozent sowie 320–1440 Pixeln Fensterbreite.
- `tests/chrome-widget-layout.cjs`: freie Anordnung von sechs Widgets, Maus, Touch und Tastatur, Abbruch, Speicherung/Neuladen, Begrenzung auf den Arbeitsbereich, Fensterwechsel, bestehende Größen, Reset, Fehlerfälle und keine dauernde Animationsschleife. Die alte Fünf-Widget-Konfiguration wird als Kompatibilitätsfall weiter geprüft.
- `tests/chrome-backgrounds.cjs`: echte IndexedDB-Speicherung, proportionale Bildanpassung, Wiederherstellung, Übernahme alter Bilder, Abgleich zwischen Tabs, Offline-Bedienung und Fehlerfälle.

JavaScript-Syntax und HTML-Struktur wurden zusätzlich geprüft: eindeutige IDs, alle Skriptdateien vorhanden. Die Sicherheitsrichtlinie blockiert weiterhin externe Verbindungen. Der vorhandene Uhr-Timer meldet seine Aktualisierung zusätzlich an den Kalender; ein zweiter Timer wird nicht angelegt.

## Grenze der Prüfung

Die verwaltete Chromium-Installation blockiert eigene Erweiterungen über eine Installationsrichtlinie. Das tatsächliche Laden als entpackte Chrome-Erweiterung und Ersetzen der neuen Tab-Seite wurde deshalb hier nicht erneut bestätigt. Die Tests decken die Originaldateien, Sicherheitsrichtlinie, browserseitige Speicher und Bedienung ab. Die Anleitung enthält den Installationstest in deinem Chrome.
