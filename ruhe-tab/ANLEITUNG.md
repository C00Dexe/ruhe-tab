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

## Bestehende Installation aktualisieren

Lade die neue ZIP herunter und entpacke sie separat. Schließe bestehende Ruhe-Tabs und ersetze die Dateien im **bisherigen Installationsordner** durch den Inhalt des neuen Unterordners `ruhe-tab`. Ändere den bisherigen Ordnerpfad nicht. Öffne dann `chrome://extensions`, klicke bei Ruhe Tab auf ↻ und öffne einen neuen Tab. Entferne die Erweiterung dafür nicht. So wird derselbe lokale Speicher für deine bisherigen Daten verwendet.

## Bedienung

- **Uhrzeit und Datum:** Verwenden automatisch die Uhr und Zeitzone deines Rechners. Die Anzeige verwendet das deutsche 24-Stunden-Format.
- **Name:** Klicke unten links auf „Chrome anpassen“, gib deinen Vornamen ein und klicke auf „Speichern“. Ein leerer Name entfernt die Personalisierung.
- **Einstellungen einklappen:** Klicke erneut auf „Chrome anpassen“, auf ×, außerhalb des Felds oder drücke Escape. Das Feld schwebt über der Seite, ohne die Inhalte zu verschieben.
- **Hintergrund:** Öffne unten links „Chrome anpassen“. Wähle „Wald“, „Nacht“ oder „Schiefer“ für einen lokalen Farbverlauf oder eine eigene JPG-, PNG- oder WebP-Datei bis 1 MB (maximal 8192 Pixel pro Seite). Die Auswahl wird sofort lokal gespeichert. Ein Farbverlauf ersetzt ein zuvor gespeichertes eigenes Bild. Der Button bleibt in der Fußleiste erreichbar, auch nachdem du das Feld geschlossen hast. Dies ist das Anpassungsfeld von Ruhe Tab; es öffnet nicht Chromes eingebautes Anpassungsfeld.
- **Webseiten:** Klicke auf „+ Verknüpfung hinzufügen“, gib einen Namen und die Webadresse ein und speichere. Ohne Schema ergänzen wir `https://`. Ein Klick auf die Kachel öffnet die Webseite im selben Tab. Mit „Bearbeiten“ erscheinen die ×-Schaltflächen zum Löschen; „Fertig“ blendet sie wieder aus. Maximal zwölf Verknüpfungen werden lokal gespeichert. Unterstützt werden HTTP und HTTPS ohne eingebettete Zugangsdaten.
- **Tagesziel:** Trage dein Ziel ein und drücke Enter oder klicke auf ↵. Das Kästchen markiert es als erledigt. Um es zu ändern, bearbeite den Text und speichere erneut. Ein leerer Text entfernt es.
- **Neuer Tag:** Das Tagesziel wird beim nächsten Anzeigen oder Aktualisieren nach dem lokalen Tageswechsel geleert. Aufgaben bleiben bestehen.
- **Aufgaben:** Gib einen Text ein und drücke Enter oder klicke auf +. Über das Kästchen hakst du eine Aufgabe ab; × löscht sie sofort. Die Liste erlaubt maximal 50 Aufgaben mit jeweils 160 Zeichen.
- **Speichern:** Name und Ziel werden nach dem ausdrücklichen Speichern übernommen; Aufgabenänderungen sofort. Es gibt keine Synchronisierung mit einem Konto. Bereits geöffnete Tabs gleichen gespeicherte Änderungen lokal ab.

## Datenschutz und Leistung

Die Erweiterung enthält nur HTML, CSS, JavaScript und die Chrome-Konfiguration im Manifest-V3-Format. Es gibt keine Bibliotheken, externen Schriftarten, Onlinebilder, Werbung, Telemetrie, Benutzerkonten, Serververbindungen oder kostenpflichtigen Funktionen. Die vorgegebenen Hintergründe entstehen aus lokalem CSS. Ein eigenes Bild wird aus einer ausdrücklich ausgewählten lokalen Datei gelesen und ausschließlich im Browserprofil gespeichert; es wird nicht hochgeladen. Die Symbole der Verknüpfungen bestehen aus dem ersten Buchstaben des Namens; es werden keine Logos oder Vorschauen heruntergeladen. Erst ein Klick auf eine Verknüpfung öffnet die gewählte Webseite und führt zu den üblichen Verbindungen dieser Webseite.

Das Manifest fordert keine zusätzlichen Berechtigungen an. Es gibt keine Zugriffserlaubnis auf Webseiten, die Chrome-Lesezeichen, den Verlauf oder den Standort. Verknüpfungen legst du selbst an; es gibt keinen automatischen Import. Die Sicherheitsrichtlinie erlaubt nur mitgelieferte Skripte und Styles und blockiert Netzwerkverbindungen (`connect-src 'none'`). Es gibt keine Content-Skripte, Service Worker oder sonstigen Hintergrundprozesse.

Die Uhr plant eine Aktualisierung zur nächsten vollen Minute. Bei verstecktem Tab wird dieser Timer beendet; beim erneuten Anzeigen wird die Uhr sofort aktualisiert. Es gibt keine Animationen und keine regelmäßigen Speicherzugriffe außer dem Datumstest bei einer Uhraktualisierung. Ganz ohne Ressourcenverbrauch funktioniert eine geöffnete Seite nicht; die Ausführung ist bewusst klein gehalten.

Name, Tagesziel, Aufgaben und Webseiten-Verknüpfungen liegen als Klartext unter `ruhe-tab-v1` in `localStorage` des Erweiterungsprofils. Hintergrund und gegebenenfalls eigenes Bild werden separat unter `ruhe-tab-appearance-v1` gespeichert. Das ist lokaler Browserspeicher, kein Cloudspeicher. Es ist keine verschlüsselte Ablage für Geheimnisse. Ein Löschen des Browserprofils oder Entfernen der Erweiterung kann die Daten entfernen; es gibt keine automatische Sicherung.

## Dateien verstehen und ändern

- `manifest.json`: Name, Version, Ersatz für den neuen Tab und Sicherheitsrichtlinie.
- `newtab.html`: Inhalt und Eingabefelder der Seite.
- `styles.css`: Farben, Abstände und Darstellung auf schmalen Fenstern.
- `newtab.js`: Uhr, Begrüßung, lokale Speicherung, Tagesziel und Aufgabenliste.
- `appearance.js`: Hintergrundauswahl und lokale Bildspeicherung.
- `PRUEFBERICHT.md`: Durchgeführte Prüfungen und deren Grenzen.
- `LICENSE.txt`: MIT-Lizenz für den Quellcode.

Nach Änderungen: Öffne `chrome://extensions`, klicke bei Ruhe Tab auf das Neuladen-Symbol und öffne einen neuen Tab. Für eigene Änderungen reicht ein einfacher Texteditor.

## Kurzer Test auf deinem Rechner

Prüfe zusätzlich „Chrome anpassen“: Farbverlauf wählen, Feld schließen, wieder öffnen und Seite neu laden. Teste ein eigenes Bild und danach erneut einen Farbverlauf. Die Auswahl soll erhalten bleiben. „Ein Moment für dich.“ wird nicht mehr angezeigt.


1. Prüfe, ob ein neuer Tab Ruhe Tab öffnet und die Uhrzeit stimmt.
2. Speichere einen Namen und ein Ziel, füge zwei Aufgaben hinzu und hake eine ab.
3. Öffne einen weiteren neuen Tab. Die Daten sollen noch vorhanden sein.
4. Lösche eine Aufgabe und prüfe, ob sie auch im anderen Tab verschwindet.
5. Trenne die Internetverbindung. Öffne einen neuen Tab und prüfe die Funktionen erneut.
6. Optional: Öffne in einem Ruhe-Tab die Entwicklerwerkzeuge (F12), wähle „Network“ und lade die Seite neu. Für die Erweiterungsseite sollten ausschließlich lokale `chrome-extension://`-Dateien und beim eigenen Hintergrund die lokale `data:image/`-Quelle erscheinen.

Falls Chrome die Installation verhindert, prüfe, ob dein Browser von einer Organisation verwaltet wird. Solche Richtlinien kann die Erweiterung nicht ändern.

Zum Deaktivieren oder Entfernen öffnest du `chrome://extensions`. Danach verwendet Chrome wieder die sonst eingestellte neue Tab-Seite.
