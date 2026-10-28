# Chrome-Prüfbericht – Version 1.2.0 – 28.10.2026

Automatisierte Bedienprüfungen mit Playwright und Chromium 154. Die originalen HTML-, CSS- und JavaScript-Dateien wurden über einen ausschließlich lokalen Testserver mit derselben Sicherheitsrichtlinie wie im Manifest geprüft. Der Testserver gehört nicht zur Erweiterung.

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
- Erfolgreich: Chrome anpassen bleibt erreichbar, schließt per ×/Escape/Außenklick und lässt sich wieder öffnen. Drei Hintergrundvorgaben und lokale Bilder werden gespeichert und zwischen Tabs abgeglichen.
- Erfolgreich: Eigene PNG-Datei bleibt nach Neuladen erhalten; zu große, nicht unterstützte oder beschädigte Bilddateien werden abgewiesen. Beschädigte Einstellungen und Speicherfehler werden abgefangen.
- Erfolgreich: Schmale Ansicht (390 px) ohne horizontalen Überlauf.
- Erfolgreich: Aufgaben lassen sich auch offline hinzufügen und speichern.
- Erfolgreich: Keine externen Netzwerkanfragen während der normalen Bedienung.
- Erfolgreich: Sicherheitsrichtlinie blockiert einen absichtlich getesteten externen Fetch.
- Erfolgreich: Keine Berechtigungen, Hostfreigaben oder Hintergrundprozesse im Manifest; keine JavaScript-Laufzeitfehler.
- Erfolgreich: „Ein Moment für dich.“ ist aus der Oberfläche entfernt.
- Erfolgreich: Anpassungsfeld bei 390 Pixeln Fensterbreite innerhalb des sichtbaren Bereichs; Fußleisten-Button bleibt erreichbar.
- Erfolgreich: JavaScript-Syntaxprüfung.
- Desktopansicht und schmale Ansicht zusätzlich visuell geprüft.

Das eigene Bild wird nur aus einer ausgewählten Datei gelesen, auf unterstütztes Format, Dateigröße, Dekodierbarkeit und Abmessungen geprüft und in einem separaten lokalen Speicherschlüssel abgelegt. Beim Wechsel zu einem Farbverlauf wird die gespeicherte Bildauswahl ersetzt. Die Sicherheitsrichtlinie erlaubt dafür lokale `data:image/`-Quellen, aber keine zusätzlichen Netzwerkziele.

Grenze: Wegen der Installationsrichtlinie der verwalteten Browserumgebung wurde das Laden als entpackte Chrome-Erweiterung und Ersetzen der neuen Tab-Seite hier nicht erneut bestätigt. Der Test deckt die Originaldateien, die Sicherheitsrichtlinie und die Bedienung im Browser ab. Die Anleitung enthält den Installationstest in deinem Chrome.
