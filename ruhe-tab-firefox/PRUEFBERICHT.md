# Ruhe Tab 2 – Prüfbericht vom 28.10.2026

## Quellcode und Paket

- Drei neue JavaScript-Module mit `node --check` erfolgreich geprüft.
- Mozilla `web-ext lint` 10.8.0: **0 Fehler, 0 Warnungen, 0 Hinweise**.
- XPI als ZIP geprüft: Manifest direkt an der Archivwurzel, alle sieben benötigten Dateien vorhanden, keine defekten Archiveinträge.
- Alle sieben Archivdateien byteweise mit den aktuellen Quelldateien verglichen.
- Die XPI ist unsigniert. Sie ist für temporäres Laden und Entwickler-Installationen vorbereitet; es wurde keine Signierung oder Veröffentlichung bei Mozilla durchgeführt.

## Sieben automatisierte Logik- und Speichertests

Ausgeführt mit `node tests/model.test.mjs`: **7 erfolgreich, 0 fehlgeschlagen**.

Geprüft wurden lokales Datum/Tageswechsel, gültige und ungültige Webseiten-Adressen, einmalige Übernahme der alten Daten, Schutz beschädigter Altdaten, unabhängige Aufgabenänderungen aus zwei Tabs, Weitergabe von Speicherfehlern sowie Validierung von Schlüsseln und Dateneinträgen. Die Speicheroperationen verwenden dabei einen injizierten Testadapter mit derselben Methodenoberfläche wie `browser.storage.local`.

## Integration der Oberfläche

Ausgeführt mit Playwright und Chromium 154. Die Originaldateien liefen auf einem lokalen Testserver mit der Sicherheitsrichtlinie aus dem Manifest. Ausschließlich im Test wurde `browser.storage.local` durch einen Testadapter ersetzt; die ausgelieferte Erweiterung enthält diesen Adapter nicht.

Geprüft: Uhranzeige, Namensspeicherung, Tagesziel und Erledigt-Status, Aufgaben hinzufügen/abhaken/löschen, Webseiten-Verknüpfungen hinzufügen/löschen, URL-Validierung im Dialog, Speicherung über Neuladen, Änderungen in zwei Tabs, Erhalt eines ungespeicherten Zielentwurfs bei einer Änderung aus einem anderen Tab, Offline-Bedienung und Darstellung bei 390 Pixeln Fensterbreite. Während der normalen Bedienung wurden keine externen Anfragen und keine unbehandelten JavaScript-Fehler beobachtet. Desktopansicht und schmale Ansicht zusätzlich visuell geprüft.

Zusätzlich getestet: Grenzen von 50 Aufgaben und zwölf Verknüpfungen; Löschen gibt Platz frei. Escape schließt die Einstellungen. Ein simulierter fehlgeschlagener Speichervorgang wird sichtbar gemeldet und behält die nicht gespeicherte Eingabe bei.

## Offener nativer Firefox-Test

Der erneute Versuch mit Firefox ESR 140.16.0 und geckodriver 0.36.0 erreichte in dieser eingeschränkten Umgebung keine vollständig gestartete Browsersitzung. Dieser Versuch hat das Add-on noch nicht geladen. Die erfolgreiche Prüfung des Manifests und die Integrationstests ersetzen daher **keinen bestätigten nativen Firefox-Installationstest**.

Noch am eigenen Rechner zu prüfen: tatsächliches Laden der XPI, Firefox-Speicherberechtigung, Ersetzen der neuen Tab-Seite, Firefox-Speicherung und Verhalten über einen Neustart bei einer dauerhaften Entwickler-Installation. Die Anleitung enthält dafür einen kurzen Ablauf.

## Prüfsumme der bereitgestellten XPI

SHA-256: `a6f911d33da3433fb93f384bb0198d18cb04162e2e7cc95b607d1984967c244d`
