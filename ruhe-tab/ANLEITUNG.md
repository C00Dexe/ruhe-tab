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

- **Einstellungen öffnen:** Klicke auf das **Zahnrädchen unten links**. Es ersetzt den bisherigen Textbutton. Mit Tab und Enter lässt es sich auch per Tastatur öffnen. Das Feld schwebt über der Seite und lässt sich bei Bedarf scrollen. Kopf- und Fußzeile sind auf 32 bzw. 40 Pixel verkleinert.
- **Uhrzeit und Datum:** Verwenden automatisch die Uhr und Zeitzone deines Rechners. Die Anzeige verwendet das deutsche 24-Stunden-Format.
- **Name:** Klicke unten links auf „Einstellungen“, gib deinen Vornamen ein und klicke auf „Speichern“. Ein leerer Name entfernt die Personalisierung.
- **Einstellungen einklappen:** Klicke erneut auf „Einstellungen“, auf ×, außerhalb des Felds oder drücke Escape. Das Feld schwebt über der Seite, ohne die Inhalte zu verschieben.
- **Widgets ein-/ausschalten:** Öffne „Einstellungen → Widgets“. Jeder der sechs Typen ist einmal verfügbar. Ein Häkchen zeigt das Widget, Entfernen des Häkchens blendet es aus. Inhalte, Position und Fenstergröße bleiben erhalten. Auch das × in der Griffleiste blendet nur aus. Sind alle Widgets ausgeblendet, öffnet „Widgets hinzufügen“ die Auswahl erneut.
- **Widgets frei verschieben:** Öffne „Einstellungen → Anordnung → Layout bearbeiten“. Jedes der sechs Widgets erhält eine Griffleiste. Ziehe die gewünschte Leiste mit Maus, Touch oder Stift an eine freie Position. Beim Ablegen wird die Position lokal gespeichert. Überlappungen sind erlaubt. Ein Klick in ein Widget oder die Tastaturfokussierung holt es nach vorne. Mit **„Layout fertig“** unten in der Fußleiste beendest du die Bearbeitung; die freie Anordnung bleibt erhalten. Beim erneuten Öffnen oder Neuladen startet die Seite mit deinen Positionen, ohne den Bearbeitungsmodus einzuschalten.
- **Fenstergröße mit der Maus ändern:** Im Modus „Layout bearbeiten“ an einem beliebigen Rand oder einer Ecke ziehen. Breite und Höhe ändern sich unabhängig in Pixeln; die Schrift bleibt dabei gleich groß. Mindestgrößen halten die Bedienelemente nutzbar. Die größte mögliche Größe ergibt sich aus dem verfügbaren Fensterbereich. Längere Inhalte werden innerhalb des Widgets gescrollt. Erst beim Loslassen wird gespeichert. Escape bricht die Vorschau ab. **„Standardfenstergrößen wiederherstellen“** setzt nur Breite und Höhe zurück und erhält Positionen, Sichtbarkeit, Schrift und Inhalte.
- **Größe per Tastatur:** Im Bearbeitungsmodus mit Tab den rechten oder unteren Größenrand auswählen. Pfeil rechts/links ändert die Breite, Pfeil hoch/runter die Höhe. Schrittweite: 10 Pixel, mit Umschalt 1 Pixel.
- **Verschieben per Tastatur:** Im Bearbeitungsmodus eine Griffleiste per Tab auswählen. Pfeiltasten verschieben um 10 Pixel, mit Umschalt um 1 Pixel. Enter beendet die Bearbeitung. Escape bricht einen laufenden Zug ab; ohne laufenden Zug beendet Escape die Bearbeitung.
- **Anordnung zurücksetzen:** „Einstellungen → Standardanordnung wiederherstellen“ ordnet die Widgets neu. Selbst gezogene Fenstergrößen bleiben dabei bestehen. Ohne selbst gezogene Größen erscheint wieder die ursprüngliche, an die Fensterbreite angepasste Anordnung. Sichtbarkeit, Schrift, Aufgaben, Name, Webseiten und Hintergrund bleiben erhalten.
- **Fenstergröße:** In der freien Anordnung passen sich die angezeigten Positionen an das Fenster an und bleiben im verfügbaren Bereich zwischen Kopf- und Fußleiste. Das Verkleinern des Fensters überschreibt weder gespeicherte Positionen noch selbst gewählte Fenstergrößen. Wird das Browserfenster wieder größer, stehen die vorherigen Abmessungen wieder zur Verfügung. Zu große Inhalte lassen sich im Inneren scrollen.
- **Kalender und Termine:** Der Monatskalender beginnt montags. Wähle einen Tag oder wechsle mit ‹ und › den Monat; „Heute“ springt zurück zum aktuellen Tag. Kleine Punkte markieren Tage mit Terminen. Über „+ Termin“ speicherst du einen Titel (bis 120 Zeichen), ein Datum und optional eine Uhrzeit. Ohne Uhrzeit ist der Termin ganztägig. Klicke einen vorhandenen Termin an, um ihn zu bearbeiten oder über „Löschen“ zu entfernen. Die Liste „Nächste Termine“ zeigt die nächsten fünf anstehenden Termine; vergangene Termine bleiben beim jeweiligen Datum sichtbar. Bis zu 500 Termine können gespeichert werden.
- **Kalender-Tastaturbedienung:** Im Kalender lässt sich der ausgewählte Tag mit Pfeiltasten bewegen. Bild auf/ab wechselt den Monat, Pos1/Ende springt an Anfang/Ende der Woche. Enter bzw. Leertaste wählt den fokussierten Tag. Im Terminfenster schließt Escape ohne Speichern.
- **Schriftgröße:** Öffne „Einstellungen → Schriftgröße“. Für jeden der sechs Widget-Typen gibt es einen Regler von **75 bis 150 Prozent** in 5-Prozent-Schritten. Er ändert die Schrift unabhängig von der Fenstergröße. Eine bereits festgelegte Breite und Höhe bleibt gleich. Text bricht um; längere Inhalte werden scrollbar. Die Vorschau ist sofort sichtbar; gespeichert wird beim Loslassen oder per Pfeiltaste. **„Standardschriftgrößen wiederherstellen“** setzt nur die sechs Schriftregler auf 100 Prozent zurück. Die Prozentwerte aus älteren Versionen werden weiterverwendet.
- **Hintergrund:** Öffne unten links „Einstellungen“. Unter „Farbschema und Hintergrund“ wählst du zwischen **Wald, Nacht, Schiefer, Ozean, Lavendel, Abendrot, Sand, Rosenquarz und Graphit**. Jede Kachel zeigt eine lokale Vorschau. Die Auswahl ändert Hintergrund, Akzentfarben und die Farben des Einstellungsfelds und der Widget-Griffe. Alle Schemen bleiben dunkel. Alternativ wähle eine eigene JPG-, PNG- oder WebP-Datei bis 10 MB. Ein eigenes Bild wird einmalig proportional auf höchstens 2560 × 1440 Pixel verkleinert und als WebP-Datei in IndexedDB gespeichert. Kleinere Bilder werden nicht vergrößert. Die ausgewählte Originaldatei bleibt unverändert und wird nicht gespeichert. Die Verarbeitung passiert ausschließlich auf deinem Gerät. Unterstützt werden Quellen bis 64 Megapixel und höchstens 16384 Pixel pro Seite. Farbverläufe werden direkt gespeichert. Ein Farbverlauf ersetzt ein zuvor gespeichertes eigenes Bild. Der Button bleibt in der Fußleiste erreichbar, auch nachdem du das Feld geschlossen hast. Dies ist das Anpassungsfeld von Ruhe Tab; es öffnet nicht Chromes eingebautes Anpassungsfeld.
- **Webseiten:** Klicke auf „+ Verknüpfung hinzufügen“, gib einen Namen und die Webadresse ein und speichere. Ohne Schema ergänzen wir `https://`. Ein Klick auf die Kachel öffnet die Webseite im selben Tab. Mit „Bearbeiten“ erscheinen die ×-Schaltflächen zum Löschen; „Fertig“ blendet sie wieder aus. Maximal zwölf Verknüpfungen werden lokal gespeichert. Unterstützt werden HTTP und HTTPS ohne eingebettete Zugangsdaten.
- **Tagesziel:** Trage dein Ziel ein und drücke Enter oder klicke auf ↵. Das Kästchen markiert es als erledigt. Um es zu ändern, bearbeite den Text und speichere erneut. Ein leerer Text entfernt es.
- **Neuer Tag:** Das Tagesziel wird beim nächsten Anzeigen oder Aktualisieren nach dem lokalen Tageswechsel geleert. Aufgaben bleiben bestehen.
- **Aufgaben:** Gib einen Text ein und drücke Enter oder klicke auf +. Über das Kästchen hakst du eine Aufgabe ab; × löscht sie sofort. Die Liste erlaubt maximal 50 Aufgaben mit jeweils 160 Zeichen.
- **Speichern:** Name und Ziel werden nach dem ausdrücklichen Speichern übernommen; Aufgabenänderungen sofort. Es gibt keine Synchronisierung mit einem Konto. Bereits geöffnete Tabs gleichen gespeicherte Änderungen lokal ab.

## Datenschutz und Leistung

Die Erweiterung enthält nur HTML, CSS, JavaScript und die Chrome-Konfiguration im Manifest-V3-Format. Es gibt keine Bibliotheken, externen Schriftarten, Onlinebilder, Werbung, Telemetrie, Benutzerkonten, Serververbindungen oder kostenpflichtigen Funktionen. Die vorgegebenen Hintergründe und ihre Vorschauen entstehen aus lokalem CSS. Ein Wechsel des Farbschemas lädt keine Dateien und startet keine Timer oder Animationen. Ein eigenes Bild wird aus einer ausdrücklich ausgewählten lokalen Datei gelesen und ausschließlich im Browserprofil gespeichert; es wird nicht hochgeladen. Die Symbole der Verknüpfungen bestehen aus dem ersten Buchstaben des Namens; es werden keine Logos oder Vorschauen heruntergeladen. Erst ein Klick auf eine Verknüpfung öffnet die gewählte Webseite und führt zu den üblichen Verbindungen dieser Webseite.

Das Manifest fordert keine zusätzlichen Berechtigungen an. Es gibt keine Zugriffserlaubnis auf Webseiten, die Chrome-Lesezeichen, den Verlauf oder den Standort. Verknüpfungen legst du selbst an; es gibt keinen automatischen Import. Die Sicherheitsrichtlinie erlaubt nur mitgelieferte Skripte und Styles und blockiert Netzwerkverbindungen (`connect-src 'none'`). Es gibt keine Content-Skripte, Service Worker oder sonstigen Hintergrundprozesse.

Die Uhr plant eine Aktualisierung zur nächsten vollen Minute. Dieser vorhandene Takt aktualisiert auch Tagesdatum und Terminübersicht; für den Kalender kommt kein weiterer Timer hinzu. Bei verstecktem Tab wird dieser Timer beendet; beim erneuten Anzeigen wird die Uhr sofort aktualisiert. Das einmalige Verkleinern eines ausgewählten Bildes benötigt kurzzeitig Rechenleistung und Speicher. Beim späteren Öffnen eines Tabs wird nur noch das vorbereitete Bild gelesen; es findet keine erneute Verkleinerung oder Kodierung statt. Nicht mehr benötigte Bild-URLs und Zeichenflächen werden freigegeben. Der Abgleich geöffneter Tabs erfolgt lokal über BroadcastChannel. Das freie Layout reagiert ausschließlich auf Eingaben, Fenster- und Inhaltsänderungen. Es gibt keine dauernde Animationsschleife und keine regelmäßigen Speicherzugriffe außer dem Datumstest bei einer Uhraktualisierung. Ganz ohne Ressourcenverbrauch funktioniert eine geöffnete Seite nicht; die Ausführung ist bewusst klein gehalten.

Name, Tagesziel, Aufgaben und Webseiten-Verknüpfungen liegen als Klartext unter `ruhe-tab-v1` in `localStorage` des Erweiterungsprofils. Die Hintergrundauswahl und gegebenenfalls das vorbereitete Bild liegen getrennt davon in der IndexedDB-Datenbank `ruhe-tab-backgrounds` (Store `appearance`, Eintrag `current`). Es wird nur die aktuelle Auswahl aufbewahrt. Ein Wechsel zum Farbverlauf ersetzt den gespeicherten Bild-Blob. Noch vorhandene Hintergrunddaten aus Version 1.2 unter `ruhe-tab-appearance-v1` werden einmalig übernommen und erst nach erfolgreicher Speicherung aus localStorage entfernt. Die sechs Schriftgrößen liegen unter dem bisherigen Schlüssel `ruhe-tab-widget-sizes-v1` in localStorage. Sichtbarkeit, relative Positionen und Fenstergrößen werden gemeinsam unter `ruhe-tab-widget-windows-v1` gespeichert. Der alte Eintrag `ruhe-tab-widget-layout-v1` wird beim ersten Laden übernommen und bleibt unangetastet. Das Ausblenden eines Widgets löscht keine Inhalte. Die Rücksetzfunktionen verändern jeweils nur Anordnung, Fenstergrößen oder Schriftgrößen. Andere geöffnete Ruhe-Tabs übernehmen gespeicherte Änderungen. Aufgaben, Name, Webseiten und Hintergrund werden durch einen Größenwechsel oder das Zurücksetzen der Größen nicht gelöscht. Jeder Kalendereintrag liegt separat unter `ruhe-tab-calendar-event.<ID>` in localStorage. Gleichzeitiges Hinzufügen in verschiedenen Tabs überschreibt dadurch keine anderen Termine. Die Termine gelten für die lokale Uhrzeit im aktuellen Browserprofil; es gibt keine Geräte- oder Kontosynchronisierung. Beim Neuladen bleiben sie erhalten. Das ist lokaler Browserspeicher, kein Cloudspeicher. Es ist keine verschlüsselte Ablage für Geheimnisse. Ein Löschen des Browserprofils oder Entfernen der Erweiterung kann die Daten entfernen; es gibt keine automatische Sicherung.

## Dateien verstehen und ändern

- `manifest.json`: Name, Version, Ersatz für den neuen Tab und Sicherheitsrichtlinie.
- `newtab.html`: Inhalt und Eingabefelder der Seite.
- `styles.css`: Farben, Abstände und Darstellung auf schmalen Fenstern.
- `newtab.js`: Uhr, Begrüßung, lokale Speicherung, Tagesziel und Aufgabenliste.
- `appearance.js`: Hintergrundauswahl und lokale Bildspeicherung.
- `widget-sizes.js`: Schriftregler, Live-Vorschau und lokale Schriftgrößen.
- `widget-layout.js`: Ein-/Ausblenden, Verschieben, Fenstergröße und gemeinsame lokale Speicherung der Fenstereinstellungen.
- `calendar.mjs`, `calendar-model.mjs`: lokaler Kalender, Datumsauswertung und Termine.
- `PRUEFBERICHT.md`: Durchgeführte Prüfungen und deren Grenzen.
- `LICENSE.txt`: MIT-Lizenz für den Quellcode.

Nach Änderungen: Öffne `chrome://extensions`, klicke bei Ruhe Tab auf das Neuladen-Symbol und öffne einen neuen Tab. Für eigene Änderungen reicht ein einfacher Texteditor.

## Kurzer Test auf deinem Rechner

1. Öffne einen neuen Tab. Speichere einen Namen, ein Tagesziel, zwei Aufgaben und eine Webseiten-Verknüpfung.
2. Lege einen ganztägigen und einen Termin mit Uhrzeit an. Prüfe Neuladen, Bearbeiten und Löschen.
3. Blende unter „Einstellungen → Widgets“ einzelne Widgets aus und wieder ein. Prüfe auch alle auf einmal und anschließend „Widgets hinzufügen“. Deine Inhalte sollen noch vorhanden sein.
4. Aktiviere „Layout bearbeiten“. Verschiebe ein Widget und ziehe es an einer Ecke größer, dann an einem Rand schmaler. Die Schrift soll gleich groß bleiben. Escape während des Ziehens soll die letzte gespeicherte Größe wiederherstellen.
5. Klicke „Layout fertig“, lade neu und prüfe Positionen und Größen. Verkleinere das Browserfenster und vergrößere es wieder. Die gespeicherten Abmessungen sollen zurückkehren.
6. Ändere unter „Schriftgröße“ einen Prozentregler. Die Schrift soll sich ändern, ein bereits angepasstes Fenster seine Breite und Höhe behalten. Teste die drei getrennten Rücksetzfunktionen; Inhalte sollen erhalten bleiben.
7. Öffne das Zahnrädchen unten links und probiere die neun Farbschemen aus. Schließe mit Escape und öffne erneut; lade auch den Tab neu. Die Auswahl soll bestehen bleiben. Teste danach ein eigenes Bild und wieder ein Farbschema. Prüfe das Einstellungsfeld auch in einem schmalen Browserfenster. Unten steht „Nur lokal.“.
8. Öffne zwei Ruhe-Tabs und prüfe den lokalen Abgleich von Aufgaben, Terminen und Fenstereinstellungen. Trenne dann die Internetverbindung und prüfe die Funktionen erneut.
9. Optional: Öffne die Entwicklerwerkzeuge (F12), wähle „Network“ und lade neu. Für die Erweiterungsseite sollten ausschließlich lokale `chrome-extension://`-Dateien und beim eigenen Hintergrund die lokale `blob:`-Quelle erscheinen.

Falls Chrome die Installation verhindert, prüfe, ob dein Browser von einer Organisation verwaltet wird. Solche Richtlinien kann die Erweiterung nicht ändern.

Zum Deaktivieren oder Entfernen öffnest du `chrome://extensions`. Danach verwendet Chrome wieder die sonst eingestellte neue Tab-Seite.
