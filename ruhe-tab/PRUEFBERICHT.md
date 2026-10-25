# Prüfbericht – 25.10.2026

Automatisierte Bedienprüfungen mit Playwright und Chromium 154. Die unveränderten HTML-, CSS- und JavaScript-Dateien wurden über einen ausschließlich lokalen Testserver geladen. Dessen Sicherheitsrichtlinie entsprach der Richtlinie aus dem Manifest. Der Testserver gehört nicht zur Erweiterung und wird für die Verwendung nicht gebraucht.

- Erfolgreich: Originale HTML/CSS/JS-Dateien in Chromium mit der Manifest-Sicherheitsrichtlinie geprüft; Uhrzeit und Datum angezeigt.
- Erfolgreich: Name, Tagesziel und Aufgaben einschließlich Erledigt-Status überstehen Neuladen.
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
- Desktopansicht zusätzlich visuell geprüft.

Grenze: Die verwaltete Browserumgebung blockiert über eine Installationsrichtlinie alle eigenen Erweiterungen. Deshalb konnte das tatsächliche Laden als Chrome-Erweiterung und Ersetzen der neuen Tab-Seite hier nicht geprüft werden. Das Manifest wurde strukturell geprüft. Die Anleitung enthält den noch erforderlichen Installationstest in deinem Chrome. Eine vollständige Leistungsanalyse oder unabhängige Sicherheitsprüfung wurde nicht durchgeführt.
