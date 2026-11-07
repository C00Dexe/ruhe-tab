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
- **Widgets frei verschieben:** Öffne „Chrome anpassen → Anordnung → Layout bearbeiten“. Jedes der fünf Widgets erhält eine Griffleiste. Ziehe die gewünschte Leiste mit Maus, Touch oder Stift an eine freie Position. Beim Ablegen wird die Position lokal gespeichert. Überlappungen sind erlaubt. Ein Klick in ein Widget oder die Tastaturfokussierung holt es nach vorne. Mit **„Layout fertig“** unten in der Fußleiste beendest du die Bearbeitung; die freie Anordnung bleibt erhalten. Beim erneuten Öffnen oder Neuladen startet die Seite mit deinen Positionen, ohne den Bearbeitungsmodus einzuschalten.
- **Verschieben per Tastatur:** Im Bearbeitungsmodus eine Griffleiste per Tab auswählen. Pfeiltasten verschieben um 10 Pixel, mit Umschalt um 1 Pixel. Enter beendet die Bearbeitung. Escape bricht einen laufenden Zug ab; ohne laufenden Zug beendet Escape die Bearbeitung.
- **Anordnung zurücksetzen:** „Chrome anpassen → Standardanordnung wiederherstellen“ bringt die Widgets zurück in die normale Anordnung. Eigene Größen, Aufgaben, Name, Webseiten und Hintergrund bleiben dabei bestehen.
- **Fenstergröße:** In der freien Anordnung passen sich die angezeigten Positionen an das Fenster an und bleiben im verfügbaren Bereich zwischen Kopf- und Fußleiste. Das Verkleinern des Fensters überschreibt keine gespeicherten Positionen. Zu hohe Widgets lassen sich im Inneren scrollen. Auch mit den Größenreglern bleiben die Widgets auf den verfügbaren Platz begrenzt.
- **Widgetgrößen:** Öffne unten links „Chrome anpassen“. Unter „Widgetgrößen“ gibt es eigene Regler für **Aufgabenliste**, **Begrüßung**, **Uhr und Datum**, **Tagesziel** und **Webseiten-Verknüpfungen**. Stelle jeweils **75 bis 150 Prozent** in 5-Prozent-Schritten ein. Schrift, Abstände und der Widgetbereich passen sich gemeinsam an. Die Vorschau ist sofort sichtbar; gespeichert wird beim Loslassen des Reglers oder per Pfeiltaste. Auf schmalen Fenstern ordnen sich die Bereiche untereinander an und bleiben auf die verfügbare Breite begrenzt. Das Anpassungsfeld kann bei Bedarf gescrollt werden. **„Standardgrößen wiederherstellen“** setzt nur diese fünf Regler auf 100 Prozent zurück.
- **Hintergrund:** Öffne unten links „Chrome anpassen“. Wähle „Wald“, „Nacht“ oder „Schiefer“ für einen lokalen Farbverlauf oder eine eigene JPG-, PNG- oder WebP-Datei bis 10 MB. Ein eigenes Bild wird einmalig proportional auf höchstens 2560 × 1440 Pixel verkleinert und als WebP-Datei in IndexedDB gespeichert. Kleinere Bilder werden nicht vergrößert. Die ausgewählte Originaldatei bleibt unverändert und wird nicht gespeichert. Die Verarbeitung passiert ausschließlich auf deinem Gerät. Unterstützt werden Quellen bis 64 Megapixel und höchstens 16384 Pixel pro Seite. Farbverläufe werden direkt gespeichert. Ein Farbverlauf ersetzt ein zuvor gespeichertes eigenes Bild. Der Button bleibt in der Fußleiste erreichbar, auch nachdem du das Feld geschlossen hast. Dies ist das Anpassungsfeld von Ruhe Tab; es öffnet nicht Chromes eingebautes Anpassungsfeld.
- **Webseiten:** Klicke auf „+ Verknüpfung hinzufügen“, gib einen Namen und die Webadresse ein und speichere. Ohne Schema ergänzen wir `https://`. Ein Klick auf die Kachel öffnet die Webseite im selben Tab. Mit „Bearbeiten“ erscheinen die ×-Schaltflächen zum Löschen; „Fertig“ blendet sie wieder aus. Maximal zwölf Verknüpfungen werden lokal gespeichert. Unterstützt werden HTTP und HTTPS ohne eingebettete Zugangsdaten.
- **Tagesziel:** Trage dein Ziel ein und drücke Enter oder klicke auf ↵. Das Kästchen markiert es als erledigt. Um es zu ändern, bearbeite den Text und speichere erneut. Ein leerer Text entfernt es.
- **Neuer Tag:** Das Tagesziel wird beim nächsten Anzeigen oder Aktualisieren nach dem lokalen Tageswechsel geleert. Aufgaben bleiben bestehen.
- **Aufgaben:** Gib einen Text ein und drücke Enter oder klicke auf +. Über das Kästchen hakst du eine Aufgabe ab; × löscht sie sofort. Die Liste erlaubt maximal 50 Aufgaben mit jeweils 160 Zeichen.
- **Speichern:** Name und Ziel werden nach dem ausdrücklichen Speichern übernommen; Aufgabenänderungen sofort. Es gibt keine Synchronisierung mit einem Konto. Bereits geöffnete Tabs gleichen gespeicherte Änderungen lokal ab.

## Datenschutz und Leistung

Die Erweiterung enthält nur HTML, CSS, JavaScript und die Chrome-Konfiguration im Manifest-V3-Format. Es gibt keine Bibliotheken, externen Schriftarten, Onlinebilder, Werbung, Telemetrie, Benutzerkonten, Serververbindungen oder kostenpflichtigen Funktionen. Die vorgegebenen Hintergründe entstehen aus lokalem CSS. Ein eigenes Bild wird aus einer ausdrücklich ausgewählten lokalen Datei gelesen und ausschließlich im Browserprofil gespeichert; es wird nicht hochgeladen. Die Symbole der Verknüpfungen bestehen aus dem ersten Buchstaben des Namens; es werden keine Logos oder Vorschauen heruntergeladen. Erst ein Klick auf eine Verknüpfung öffnet die gewählte Webseite und führt zu den üblichen Verbindungen dieser Webseite.

Das Manifest fordert keine zusätzlichen Berechtigungen an. Es gibt keine Zugriffserlaubnis auf Webseiten, die Chrome-Lesezeichen, den Verlauf oder den Standort. Verknüpfungen legst du selbst an; es gibt keinen automatischen Import. Die Sicherheitsrichtlinie erlaubt nur mitgelieferte Skripte und Styles und blockiert Netzwerkverbindungen (`connect-src 'none'`). Es gibt keine Content-Skripte, Service Worker oder sonstigen Hintergrundprozesse.

Die Uhr plant eine Aktualisierung zur nächsten vollen Minute. Bei verstecktem Tab wird dieser Timer beendet; beim erneuten Anzeigen wird die Uhr sofort aktualisiert. Das einmalige Verkleinern eines ausgewählten Bildes benötigt kurzzeitig Rechenleistung und Speicher. Beim späteren Öffnen eines Tabs wird nur noch das vorbereitete Bild gelesen; es findet keine erneute Verkleinerung oder Kodierung statt. Nicht mehr benötigte Bild-URLs und Zeichenflächen werden freigegeben. Der Abgleich geöffneter Tabs erfolgt lokal über BroadcastChannel. Das freie Layout reagiert ausschließlich auf Eingaben, Fenster- und Inhaltsänderungen. Es gibt keine dauernde Animationsschleife und keine regelmäßigen Speicherzugriffe außer dem Datumstest bei einer Uhraktualisierung. Ganz ohne Ressourcenverbrauch funktioniert eine geöffnete Seite nicht; die Ausführung ist bewusst klein gehalten.

Name, Tagesziel, Aufgaben und Webseiten-Verknüpfungen liegen als Klartext unter `ruhe-tab-v1` in `localStorage` des Erweiterungsprofils. Die Hintergrundauswahl und gegebenenfalls das vorbereitete Bild liegen getrennt davon in der IndexedDB-Datenbank `ruhe-tab-backgrounds` (Store `appearance`, Eintrag `current`). Es wird nur die aktuelle Auswahl aufbewahrt. Ein Wechsel zum Farbverlauf ersetzt den gespeicherten Bild-Blob. Noch vorhandene Hintergrunddaten aus Version 1.2 unter `ruhe-tab-appearance-v1` werden einmalig übernommen und erst nach erfolgreicher Speicherung aus localStorage entfernt. Die fünf Widgetgrößen liegen separat unter `ruhe-tab-widget-sizes-v1` in localStorage. Die freie Anordnung liegt unter `ruhe-tab-widget-layout-v1`; gespeichert werden relative Positionen, damit die Darstellung auf veränderte Fenstergrößen reagieren kann. Zurücksetzen der Anordnung entfernt nur diesen Anordnungseintrag. Andere geöffnete Ruhe-Tabs übernehmen gespeicherte Änderungen. Aufgaben, Name, Webseiten und Hintergrund werden durch einen Größenwechsel oder das Zurücksetzen der Größen nicht gelöscht. Das ist lokaler Browserspeicher, kein Cloudspeicher. Es ist keine verschlüsselte Ablage für Geheimnisse. Ein Löschen des Browserprofils oder Entfernen der Erweiterung kann die Daten entfernen; es gibt keine automatische Sicherung.

## Dateien verstehen und ändern

- `manifest.json`: Name, Version, Ersatz für den neuen Tab und Sicherheitsrichtlinie.
- `newtab.html`: Inhalt und Eingabefelder der Seite.
- `styles.css`: Farben, Abstände und Darstellung auf schmalen Fenstern.
- `newtab.js`: Uhr, Begrüßung, lokale Speicherung, Tagesziel und Aufgabenliste.
- `appearance.js`: Hintergrundauswahl und lokale Bildspeicherung.
- `widget-sizes.js`: Größenregler, Live-Vorschau und lokale Größeneinstellungen.
- `widget-layout.js`: freies Verschieben, Begrenzung auf den Fensterbereich und lokale Positionen.
- `PRUEFBERICHT.md`: Durchgeführte Prüfungen und deren Grenzen.
- `LICENSE.txt`: MIT-Lizenz für den Quellcode.

Nach Änderungen: Öffne `chrome://extensions`, klicke bei Ruhe Tab auf das Neuladen-Symbol und öffne einen neuen Tab. Für eigene Änderungen reicht ein einfacher Texteditor.

## Kurzer Test auf deinem Rechner

Aktiviere „Layout bearbeiten“, verschiebe jedes Widget und klicke „Layout fertig“. Lade neu und prüfe die Positionen. Verkleinere das Fenster, ändere eine Widgetgröße und stelle das Fenster wieder größer: Alle Widgets sollen erreichbar bleiben. Teste auch Escape während eines Zugs und „Standardanordnung wiederherstellen“. Deine Größen, Aufgaben und Hintergründe sollen durch das Zurücksetzen der Anordnung erhalten bleiben.


Prüfe unter „Chrome anpassen → Widgetgrößen“ jeden Regler. Klappe das Feld zu, öffne es erneut und lade den Tab neu: Die Größen sollen erhalten bleiben. Probiere auch die Pfeiltasten und „Standardgrößen wiederherstellen“. Deine Aufgaben, Webseiten und Hintergrundauswahl sollen dabei bestehen bleiben.


Prüfe zusätzlich „Chrome anpassen“: Farbverlauf wählen, Feld schließen, wieder öffnen und Seite neu laden. Teste ein eigenes Bild und danach erneut einen Farbverlauf. Die Auswahl soll erhalten bleiben. „Ein Moment für dich.“ wird nicht mehr angezeigt.


1. Prüfe, ob ein neuer Tab Ruhe Tab öffnet und die Uhrzeit stimmt.
2. Speichere einen Namen und ein Ziel, füge zwei Aufgaben hinzu und hake eine ab.
3. Öffne einen weiteren neuen Tab. Die Daten sollen noch vorhanden sein.
4. Lösche eine Aufgabe und prüfe, ob sie auch im anderen Tab verschwindet.
5. Trenne die Internetverbindung. Öffne einen neuen Tab und prüfe die Funktionen erneut.
6. Optional: Öffne in einem Ruhe-Tab die Entwicklerwerkzeuge (F12), wähle „Network“ und lade die Seite neu. Für die Erweiterungsseite sollten ausschließlich lokale `chrome-extension://`-Dateien und beim eigenen Hintergrund die lokale `blob:`-Quelle erscheinen.

Falls Chrome die Installation verhindert, prüfe, ob dein Browser von einer Organisation verwaltet wird. Solche Richtlinien kann die Erweiterung nicht ändern.

Zum Deaktivieren oder Entfernen öffnest du `chrome://extensions`. Danach verwendet Chrome wieder die sonst eingestellte neue Tab-Seite.
