# Ruhe Tab

Eine dunkle, minimalistische Chrome-Erweiterung für neue Tabs: Uhrzeit, persönliche Begrüßung, Tagesziel und eine kleine Aufgabenliste. Alle enthaltenen Funktionen sind ohne Konto oder Abo nutzbar. Die Daten bleiben lokal im Browserprofil.

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

## Verwendung

- **Dein Name** unten links öffnet die persönliche Begrüßung.
- Tagesziel eingeben und mit Enter speichern; per Kästchen als erledigt markieren.
- Aufgaben mit Enter oder **+** hinzufügen, abhaken und mit **×** löschen.
- Das Tagesziel wird beim lokalen Tageswechsel zurückgesetzt; Aufgaben bleiben erhalten.

Die [ausführliche Anleitung](ruhe-tab/ANLEITUNG.md) beschreibt Installation, Bedienung und lokale Speicherung.

## Datenschutz und Technik

HTML, CSS und JavaScript ohne zusätzliche Bibliotheken. Keine externen Bilder oder Schriften, Analysewerkzeuge, Konten, Netzwerkverbindungen oder Hintergrundprozesse. Keine zusätzlichen Chrome-Berechtigungen. Name, Ziel und Aufgaben werden lokal in `localStorage` gespeichert. Die Uhr aktualisiert sich bei sichtbarer Seite zur nächsten vollen Minute.

## Geprüft und noch zu prüfen

Die Bedienung, Speicherung, der Tageswechsel und Offline-Bedienung wurden in Chromium getestet. Es wurden keine externen Anfragen bei normaler Bedienung beobachtet. Das tatsächliche Installieren als Erweiterung und Ersetzen der neuen Tab-Seite konnte in der verwalteten Testumgebung wegen ihrer Installationsrichtlinie nicht getestet werden.

Details stehen im [Prüfbericht](ruhe-tab/PRUEFBERICHT.md). Bitte führe nach der Installation den kurzen Test aus der Anleitung durch.

Der Quellcode steht unter der [MIT-Lizenz](ruhe-tab/LICENSE.txt).
