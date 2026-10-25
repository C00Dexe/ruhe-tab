# Ruhe Tab – deine lokale Neue-Tab-Erweiterung

Eine kleine, eigenständige Erweiterung, inspiriert vom Prinzip einer ruhigen Startseite. Alle enthaltenen Funktionen sind ohne Konto oder Abo nutzbar.

## Installation in Google Chrome

1. Lade auf GitHub über **Code → Download ZIP** die Datei `ruhe-tab-main.zip` herunter und entpacke sie in einen dauerhaften Ordner auf deinem Rechner.
2. Öffne Chrome und gib `chrome://extensions` in die Adressleiste ein.
3. Schalte oben rechts den **Entwicklermodus** ein.
4. Klicke auf **Entpackte Erweiterung laden**.
5. Öffne den entpackten Ordner **ruhe-tab-main** und wähle darin den Unterordner **ruhe-tab**, in dem `manifest.json` liegt. Wähle nicht die ZIP-Datei oder den übergeordneten Ordner.
6. Öffne einen neuen Tab. Falls Chrome eine Rückfrage zur neuen Tab-Seite anzeigt, bestätige, dass du Ruhe Tab behalten möchtest.

Du brauchst keinen Server, kein Terminal, Node.js oder ein Entwicklerkonto. Der Ordner muss an seinem Speicherort bleiben. Falls Momentum oder eine andere Erweiterung ebenfalls die neue Tab-Seite ersetzt, deaktiviere sie zum Testen.

## Bedienung

- **Uhrzeit und Datum:** Verwenden automatisch die Uhr und Zeitzone deines Rechners. Die Anzeige verwendet das deutsche 24-Stunden-Format.
- **Name:** Klicke unten links auf „Dein Name“, gib deinen Vornamen ein und klicke auf „Speichern“. Ein leerer Name entfernt die Personalisierung.
- **Tagesziel:** Trage dein Ziel ein und drücke Enter oder klicke auf ↵. Das Kästchen markiert es als erledigt. Um es zu ändern, bearbeite den Text und speichere erneut. Ein leerer Text entfernt es.
- **Neuer Tag:** Das Tagesziel wird beim nächsten Anzeigen oder Aktualisieren nach dem lokalen Tageswechsel geleert. Aufgaben bleiben bestehen.
- **Aufgaben:** Gib einen Text ein und drücke Enter oder klicke auf +. Über das Kästchen hakst du eine Aufgabe ab; × löscht sie sofort. Die Liste erlaubt maximal 50 Aufgaben mit jeweils 160 Zeichen.
- **Speichern:** Name und Ziel werden nach dem ausdrücklichen Speichern übernommen; Aufgabenänderungen sofort. Es gibt keine Synchronisierung mit einem Konto. Bereits geöffnete Tabs gleichen gespeicherte Änderungen lokal ab.

## Datenschutz und Leistung

Die Erweiterung enthält nur HTML, CSS, JavaScript und die Chrome-Konfiguration im Manifest-V3-Format. Es gibt keine Bibliotheken, externen Schriftarten, Onlinebilder, Werbung, Telemetrie, Benutzerkonten, Serververbindungen oder kostenpflichtigen Funktionen. Auch der dezente Hintergrund entsteht vollständig aus lokalem CSS.

Das Manifest fordert keine zusätzlichen Berechtigungen an. Es gibt keine Zugriffserlaubnis auf Webseiten, den Verlauf oder den Standort. Die Sicherheitsrichtlinie erlaubt nur mitgelieferte Skripte und Styles und blockiert Netzwerkverbindungen (`connect-src 'none'`). Es gibt keine Content-Skripte, Service Worker oder sonstigen Hintergrundprozesse.

Die Uhr plant eine Aktualisierung zur nächsten vollen Minute. Bei verstecktem Tab wird dieser Timer beendet; beim erneuten Anzeigen wird die Uhr sofort aktualisiert. Es gibt keine Animationen und keine regelmäßigen Speicherzugriffe außer dem Datumstest bei einer Uhraktualisierung. Ganz ohne Ressourcenverbrauch funktioniert eine geöffnete Seite nicht; die Ausführung ist bewusst klein gehalten.

Name, Tagesziel und Aufgaben liegen als Klartext unter `ruhe-tab-v1` in `localStorage` des Erweiterungsprofils. Das ist lokaler Browserspeicher, kein Cloudspeicher. Es ist keine verschlüsselte Ablage für Geheimnisse. Ein Löschen des Browserprofils oder Entfernen der Erweiterung kann die Daten entfernen; es gibt keine automatische Sicherung.

## Dateien verstehen und ändern

- `manifest.json`: Name, Version, Ersatz für den neuen Tab und Sicherheitsrichtlinie.
- `newtab.html`: Inhalt und Eingabefelder der Seite.
- `styles.css`: Farben, Abstände und Darstellung auf schmalen Fenstern.
- `newtab.js`: Uhr, Begrüßung, lokale Speicherung, Tagesziel und Aufgabenliste.
- `PRUEFBERICHT.md`: Durchgeführte Prüfungen und deren Grenzen.
- `LICENSE.txt`: MIT-Lizenz für den Quellcode.

Nach Änderungen: Öffne `chrome://extensions`, klicke bei Ruhe Tab auf das Neuladen-Symbol und öffne einen neuen Tab. Für eigene Änderungen reicht ein einfacher Texteditor.

## Kurzer Test auf deinem Rechner

1. Prüfe, ob ein neuer Tab Ruhe Tab öffnet und die Uhrzeit stimmt.
2. Speichere einen Namen und ein Ziel, füge zwei Aufgaben hinzu und hake eine ab.
3. Öffne einen weiteren neuen Tab. Die Daten sollen noch vorhanden sein.
4. Lösche eine Aufgabe und prüfe, ob sie auch im anderen Tab verschwindet.
5. Trenne die Internetverbindung. Öffne einen neuen Tab und prüfe die Funktionen erneut.
6. Optional: Öffne in einem Ruhe-Tab die Entwicklerwerkzeuge (F12), wähle „Network“ und lade die Seite neu. Für die Erweiterungsseite sollten ausschließlich lokale `chrome-extension://`-Dateien erscheinen.

Falls Chrome die Installation verhindert, prüfe, ob dein Browser von einer Organisation verwaltet wird. Solche Richtlinien kann die Erweiterung nicht ändern.

Zum Deaktivieren oder Entfernen öffnest du `chrome://extensions`. Danach verwendet Chrome wieder die sonst eingestellte neue Tab-Seite.
