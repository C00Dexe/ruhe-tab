# Firefox-Prüfbericht – 28.10.2026

## Firefox-Konfiguration

Geprüft mit Mozillas `web-ext lint` 10.8.0: **0 Fehler, 0 Hinweise, 1 Warnung**.

Die Warnung `KEY_FIREFOX_ANDROID_UNSUPPORTED_BY_MIN_VERSION` betrifft die Datenschutzangabe auf älteren Firefox-Android-Versionen. Diese Variante ist für Firefox Desktop ab Version 140 vorgesehen; ein Android-Neue-Tab-Ersatz wird nicht unterstützt oder versprochen.

Das Manifest verwendet Manifest V3, die feste ID `ruhe-tab@c00dexe`, `chrome_url_overrides.newtab` und `data_collection_permissions.required: ["none"]`. Keine zusätzlichen API- oder Hostberechtigungen, keine Hintergrundprozesse. JavaScript-Syntaxprüfung mit `node --check` erfolgreich.

HTML, CSS und JavaScript sind bytegleich mit der Chrome-Version 1.1.0. Es wurden ausschließlich die Firefox-Konfiguration sowie eigene Dokumentation ergänzt.

## Bedienprüfungen der Firefox-Dateien in Chromium

Die mitgelieferten Dateien wurden mit Playwright in Chromium 154 über einen lokalen Testserver geprüft. Dieser verwendete die Sicherheitsrichtlinie aus dem Firefox-Manifest. Der Testserver wird für die Benutzung der Erweiterung nicht benötigt.

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

## Noch offener Firefox-Installationstest

Ein Test mit Firefox ESR 140.16.0 und geckodriver 0.36.0 wurde versucht. Firefox startete in der eingeschränkten Ausführungsumgebung nicht vollständig: Grafik-/Framebuffer- und Sandbox-Initialisierung schlugen fehl; die Automatisierung erreichte keine Browsersitzung. Das Add-on wurde in diesem Versuch daher noch nicht geladen.

**Das tatsächliche Laden in Firefox, die Firefox-Speicherung und das Ersetzen der neuen Tab-Seite sind hier nicht als erfolgreich getestet bestätigt.** Bitte führe die Installation und den kurzen Funktionstest aus der Firefox-Anleitung auf deinem Rechner durch. Eine Mozilla-Signierung oder Veröffentlichung fand nicht statt.
