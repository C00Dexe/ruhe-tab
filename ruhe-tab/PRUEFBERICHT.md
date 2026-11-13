# Chrome-Prüfbericht – Version 1.8.0

## Änderungen und aktuelle Prüfungen

Die Kopfzeile ist auf 32 Pixel, die Fußzeile auf 40 Pixel reduziert. Ein 32 × 32 Pixel großes Zahnrad unten links öffnet das vorhandene Einstellungsfeld. Das native Details-Element erhält eine zugängliche Beschriftung; Schließen und Fokus-Rückgabe verwenden die vorhandene Bedienung.

Zu Wald, Nacht und Schiefer kommen Ozean, Lavendel, Abendrot, Sand, Rosenquarz und Graphit. Alle neun Schemen verwenden lokale CSS-Verläufe und passende Akzent-, Flächen- und Griff-Farben. Die vorhandene IndexedDB-Speicherung und der Abgleich zwischen Tabs werden weiterverwendet.

In dieser Sitzung erfolgreich ausgeführt:

- JavaScript-Syntaxprüfung mit V8 für die geänderte Hintergrundlogik und die bestehenden Skripte für Hauptseite und Fensterverwaltung.
- Statische Prüfung: eindeutige HTML-IDs, lokale Skriptquellen, neun übereinstimmende Auswahlkacheln, Speicherkennungen und CSS-Schemen sowie ausgeglichene CSS-Regelklammern.
- Isolierte Ausführung der vollständigen `appearance.js` mit simuliertem DOM, IndexedDB und BroadcastChannel: alle neun Auswahlen, genau eine aktive Kachel, Wiederherstellung aus gespeichertem Zustand und Übernahme in einer zweiten Instanz.
- Simulierter Schreibfehler: vorherige Auswahl bleibt erhalten und eine Fehlermeldung erscheint. Andere Benutzereinstellungen bleiben unverändert. Schließen gibt den Fokus an den Auslöser zurück.
- Manifest: Version 1.8.0, unveränderte Berechtigungen und weiterhin `connect-src 'none'`. Keine zusätzlichen Skripte, Server, Timer oder Bibliotheken.

## Noch nicht im Browser bestätigt

Die Ausführungsumgebung konnte in dieser Sitzung nicht starten. Deshalb wurden für Version 1.8.0 weder Chromium/Playwright noch eine native Chrome-Installation ausgeführt. Die isolierten Prüfungen ersetzen keine echte IndexedDB-, CSS-, Tastatur- oder Darstellungsprüfung.

`tests/chrome-backgrounds.cjs` wurde um native Tastaturbedienung des Zahnrads, die schmalen Leisten bei 320/390/1360 Pixeln, Erreichbarkeit des Einstellungsfelds und Auswahl/Wiederherstellung aller neun Farbschemen erweitert. Dieser erweiterte Browsertest ist noch auszuführen. Auch die bestehenden Fenster-, Schrift- und Kalenderprüfungen wurden für 1.8.0 nicht erneut gestartet.

Die Schritte für eine Prüfung im eigenen Chrome stehen in der Anleitung unter „Kurzer Test auf deinem Rechner“.

## Bisheriger Prüfstand – Version 1.7.0

Die folgenden Ergebnisse stammen aus der vorherigen Version. Sie sind historische Prüfungen und keine Bestätigung der neuen Darstellung in Version 1.8.0.

Die Originaldateien wurden mit Playwright und Chromium 154 über einen ausschließlich lokalen Testserver mit der Sicherheitsrichtlinie aus dem Manifest geprüft. Der Testserver gehört nicht zur Erweiterung. Die Kalenderprüfung verwendete die Zeitzone Europe/Berlin und kontrollierte Browserzeiten.

### Sichtbarkeit und Fenstergrößen

`tests/chrome-windows.cjs` erfolgreich:

- Alle sechs Widget-Typen einzeln aus- und wieder eingeblendet; Wiederherstellung aus dem Zustand mit ausschließlich ausgeblendeten Widgets.
- Echte Mauszüge an Ecken und Rändern ändern Breite und Höhe unabhängig. Obere/linke Kante hält die gegenüberliegende Kante fest. Die berechnete Schriftgröße bleibt beim Ziehen unverändert.
- Die Vorschau schreibt noch keine Daten. Escape stellt die gespeicherte Größe wieder her. Größenränder erscheinen nur im Bearbeitungsmodus und unterstützen Pfeiltasten.
- Ausblenden erhält Abmessungen, Position und Inhalt. Neuladen stellt Fenster wieder her. Schriftregler ändern ein festgelegtes Fenster nicht.
- Bei 320–1440 Pixeln bleibt die Darstellung im Arbeitsbereich. Kleinere Browserfenster überschreiben die gespeicherten Abmessungen nicht; Mindest- und Höchstgrößen werden eingehalten.
- Fenstergrößen und Sichtbarkeit werden zwischen Tabs abgeglichen. Die drei Rücksetzfunktionen erhalten Inhalte und die jeweils unabhängigen Einstellungen.
- Fehlgeschlagene Schreibzugriffe stellen den gespeicherten Zustand wieder her und zeigen einen Fehler. Beschädigte Fenstereinstellungen werden mit Hinweis durch angezeigte Standardwerte ersetzt; gespeicherte Inhalte bleiben erhalten.
- Name, Tagesziel, Aufgaben, Links und Termine bleiben bei den Fensteraktionen unverändert. Offline-Bedienung, keine externen Anfragen und keine unbehandelten JavaScript-Fehler.

Sichtbarkeit, Positionen und Abmessungen liegen gemeinsam unter `ruhe-tab-widget-windows-v1`. Alte Positionen werden übernommen; der alte Positionsdatensatz bleibt unverändert. Die bisherigen Prozentwerte werden als Schriftgrößen weiterverwendet. Die Fußleiste zeigt „Nur lokal.“.

### Kalender- und Terminlogik

`node tests/calendar-model.test.mjs`: **6 Tests erfolgreich, 0 fehlgeschlagen**.

Geprüft: gültige Datumswerte, Schaltjahre einschließlich Jahrhundertregeln, Montag als Wochenanfang, Monatslängen, Navigation über Monats- und Jahresgrenzen, Datumsgrenzen, Titel und optionale Uhrzeiten, chronologische Reihenfolge und ganztägige Termine sowie die Bestimmung nächster Termine anhand der lokalen Uhrzeit. Bürgerliche Datumswerte werden bei der Darstellung nicht durch eine UTC-/Ortszeit-Umrechnung auf den Vortag verschoben.

### Kalender im Browser

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

### Vorhandene Funktionen

Die Browserprüfungen wurden mit den neuen Dateien erneut erfolgreich ausgeführt:

- `tests/chrome-widget-sizes.cjs`: unabhängige Schriftregler für sechs Widgets, Vorschau, Speicherung, Tastatur, Abgleich zwischen Tabs, Reset, Fehlerfälle und Standardanordnung bei 75/150 Prozent sowie 320–1440 Pixeln Fensterbreite.
- `tests/chrome-widget-layout.cjs`: freie Anordnung von sechs Widgets, Maus, Touch und Tastatur, Größenänderung per Touch, Abbruch, Speicherung/Neuladen, Begrenzung auf den Arbeitsbereich, Fensterwechsel, separate Schriftgrößen, Reset, Fehlerfälle und keine dauernde Animationsschleife. Die alte Fünf-Widget-Konfiguration wird als Kompatibilitätsfall weiter geprüft.
- `tests/chrome-backgrounds.cjs`: echte IndexedDB-Speicherung, proportionale Bildanpassung, Wiederherstellung, Übernahme alter Bilder, Abgleich zwischen Tabs, Offline-Bedienung und Fehlerfälle.

JavaScript-Syntax und HTML-Struktur wurden zusätzlich geprüft: eindeutige IDs, alle Skriptdateien vorhanden. Die Sicherheitsrichtlinie blockiert weiterhin externe Verbindungen. Der vorhandene Uhr-Timer meldet seine Aktualisierung zusätzlich an den Kalender; ein zweiter Timer wird nicht angelegt.

### Grenze der Prüfung

Die verwaltete Chromium-Installation blockiert eigene Erweiterungen über eine Installationsrichtlinie. Das tatsächliche Laden als entpackte Chrome-Erweiterung und Ersetzen der neuen Tab-Seite wurde deshalb hier nicht erneut bestätigt. Die Tests decken die Originaldateien, Sicherheitsrichtlinie, browserseitige Speicher und Bedienung ab. Die Anleitung enthält den Installationstest in deinem Chrome.
