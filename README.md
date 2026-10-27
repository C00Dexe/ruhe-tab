# Ruhe Tab

Eine dunkle, minimalistische Chrome-Erweiterung für neue Tabs: Uhrzeit, persönliche Begrüßung, Tagesziel eine kleine Aufgabenliste und eigene Webseiten-Verknüpfungen. Alle enthaltenen Funktionen sind ohne Konto oder Abo nutzbar. Die Daten bleiben lokal im Browserprofil.

## Herunterladen und installieren

1. Melde dich bei GitHub an und öffne dieses Repository.
2. Klicke oberhalb der Dateiliste auf die grüne Schaltfläche **Code**.
3. Wähle **Download ZIP** und entpacke die heruntergeladene Datei.
4. Öffne in Chrome die Adresse `chrome://extensions`.
5. Schalte oben rechts **Entwicklermodus** ein.
6. Klicke auf **Entpackte Erweiterung laden**.
7. Wähle im entpackten Ordner `ruhe-tab-main` den **Unterordner `ruhe-tab`** aus. Darin liegt die Datei `manifest.json`.
8. Öffne einen neuen Tab. Falls Chrome nachfragt, bestätige, dass du die neue Tab-Seite behalten möchtest.

Der ausgewählte Ordner muss anschließend an seinem Speicherort bleiben. Eine andere Erweiterung, die ebenfalls neue Tabs ersetzt, solltest du zum Testen deaktivieren. Du brauchst keinen Server und keine zusätzlichen Programme.

## Von einer älteren Version aktualisieren

1. Lade die aktuelle ZIP-Datei herunter und entpacke sie zunächst in einen separaten Ordner.
2. Schließe geöffnete Ruhe-Tab-Seiten, damit sie nicht mit dem alten Code weiterschreiben.
3. Kopiere den Inhalt des neuen Unterordners `ruhe-tab` in den **bisher in Chrome geladenen Ordner** und ersetze dort die Dateien. Den bisherigen Ordner weder umbenennen noch verschieben.
4. Öffne `chrome://extensions` und klicke bei Ruhe Tab auf das **Neuladen-Symbol ↻**.
5. Öffne einen neuen Tab. Version 1.1.0 verwendet denselben lokalen Speicher wie Version 1.0.0.

Die Erweiterung dafür nicht entfernen und neu installieren. Bei unverändertem Installationspfad bleiben Name und Aufgaben beim Aktualisieren erhalten.

## Verwendung

- **Einstellungen** unten links öffnet ein kleines, aufklappbares Feld für die persönliche Begrüßung. Es schließt per erneutem Klick, Außenklick oder Escape.
- Tagesziel eingeben und mit Enter speichern; per Kästchen als erledigt markieren.
- Aufgaben mit Enter oder **+** hinzufügen, abhaken und mit **×** löschen.
- Unter **Deine Webseiten → + Verknüpfung hinzufügen** speicherst du Name und Adresse einer Webseite. Ein Klick auf die Kachel öffnet sie im selben Tab. **Bearbeiten → ×** entfernt eine Verknüpfung. Maximal zwölf Einträge.
- Das Tagesziel wird beim lokalen Tageswechsel zurückgesetzt; Aufgaben bleiben erhalten.

Die [ausführliche Anleitung](ruhe-tab/ANLEITUNG.md) beschreibt Installation, Bedienung und lokale Speicherung.

## Datenschutz und Technik

HTML, CSS und JavaScript ohne zusätzliche Bibliotheken. Keine externen Bilder oder Schriften, Analysewerkzeuge, Konten, Netzwerkverbindungen oder Hintergrundprozesse. Keine zusätzlichen Chrome-Berechtigungen. Die Verknüpfungen werden manuell angelegt; die Chrome-Lesezeichen und der Verlauf werden nicht ausgelesen. Es werden keine Webseiten-Logos, Vorschaubilder oder Verbindungen vorab geladen. Erst wenn du eine Verknüpfung anklickst, öffnet Chrome die gewählte Webseite mit den üblichen Verbindungen dieser Webseite. Name, Ziel, Aufgaben und Verknüpfungen werden lokal in `localStorage` gespeichert. Die Uhr aktualisiert sich bei sichtbarer Seite zur nächsten vollen Minute.

## Geprüft und noch zu prüfen

Die Bedienung, Speicherung, der Tageswechsel und Offline-Bedienung wurden in Chromium getestet. Es wurden keine externen Anfragen bei normaler Bedienung beobachtet. Das tatsächliche Installieren als Erweiterung und Ersetzen der neuen Tab-Seite konnte in der verwalteten Testumgebung wegen ihrer Installationsrichtlinie nicht getestet werden.

Details stehen im [Prüfbericht](ruhe-tab/PRUEFBERICHT.md). Bitte führe nach der Installation den kurzen Test aus der Anleitung durch.

Der Quellcode steht unter der [MIT-Lizenz](ruhe-tab/LICENSE.txt).
