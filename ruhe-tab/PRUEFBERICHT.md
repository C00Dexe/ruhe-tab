# Prüfbericht – Version 1.1.0 – 27.10.2026

Automatisierte Bedienprüfungen mit Playwright und Chromium 154. Die originalen HTML-, CSS- und JavaScript-Dateien wurden über einen ausschließlich lokalen Testserver mit der Sicherheitsrichtlinie aus dem Manifest geprüft. Der Testserver gehört nicht zur Erweiterung.

- Erfolgreich: Originale HTML/CSS/JS-Dateien in Chromium mit der Manifest-Sicherheitsrichtlinie geprüft; Uhrzeit und Datum angezeigt.
- Erfolgreich: Name, Tagesziel und Aufgaben einschließlich Erledigt-Status überstehen Neuladen.
- Erfolgreich: Bestehende Daten aus Version 1.0 bleiben erhalten; Einstellungen öffnen ohne Layoutverschiebung und schließen per Escape oder Außenklick.
- Erfolgreich: Webseiten hinzufügen, öffnen (abgefangenes Testziel), löschen, offline speichern, nach Neuladen und in anderem Tab anzeigen; maximal zwölf Einträge.
- Erfolgreich: Unsichere URL-Schemata, Zugangsdaten und Leerzeichen abgewiesen; fehlendes HTTPS ergänzt; HTML-Namen als Text angezeigt. Keine Logos oder Vorschauen geladen.
- Erfolgreich: Änderungen werden zwischen geöffneten Tabs abgeglichen.
- Erfolgreich: Aufgaben hinzufügen, abhaken und löschen; HTML-Eingaben bleiben harmloser Text.
- Erfolgreich: Tageswechsel: Ziel wird zurückgesetzt; Aufgaben bleiben erhalten.
- Erfolgreich: Beschädigte gespeicherte Daten werden abgefangen; erneutes Speichern funktioniert.
- Erfolgreich: Grenze von 50 Aufgaben wird eingehalten; Löschen gibt wieder Platz frei.
- Erfolgreich: Schmale Ansicht (390 px) ohne horizontalen Überlauf.
- Erfolgreich: Aufgaben lassen sich auch offline hinzufügen und speichern.
- Erfolgreich: Keine externen Netzwerkanfragen während der normalen Bedienung.
- Erfolgreich: Sicherheitsrichtlinie blockiert einen absichtlich getesteten externen Fetch.
- Erfolgreich: Keine Berechtigungen, Hostfreigaben oder Hintergrundprozesse im Manifest; keine JavaScript-Laufzeitfehler.
- Erfolgreich: JavaScript-Syntaxprüfung mit `node --check`.
- Desktopansicht und schmale Ansicht zusätzlich visuell geprüft.

Das Öffnen einer Webseiten-Verknüpfung wurde mit einer abgefangenen Browsernavigation getestet. Die Testantwort wurde lokal erzeugt; kein echter Webseitenserver wurde kontaktiert. Während Anzeigen, Hinzufügen, Bearbeiten und Speichern der Verknüpfungen gab es keine externen Netzwerkanfragen.

Grenze: Die verwaltete Browserumgebung blockiert über eine Installationsrichtlinie eigene Erweiterungen. Deshalb konnte das tatsächliche Laden als Chrome-Erweiterung und Ersetzen der neuen Tab-Seite hier nicht geprüft werden. Das Manifest wurde strukturell geprüft. Die Anleitung enthält den Installationstest in deinem Chrome. Eine vollständige Leistungsanalyse oder unabhängige Sicherheitsprüfung wurde nicht durchgeführt.
