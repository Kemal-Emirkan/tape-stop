# Tape Stop: Projekt-Briefing v2 (Audio-gesteuerter Rhythmus-Sidescroller im Browser)

Stand: 24.11.2026 · Team: Kemal-Emirkan Akkaş, Berkan Akcay · Kurs: Medientechnik und Klubkultur (HTW)

Projektname: **Tape Stop** (benannt nach dem Effekt, wenn die Musik wie ein Tape zum Stillstand kommt). Repo: `tape-stop`.

---

## 1. Überblick

Ein 2D-Sidescroller im Browser, bei dem **Musik das Level erzeugt und steuert**. Der Spieler lädt einen Song (oder ein Video) hoch, das Spiel analysiert den Ton und platziert Hindernisse auf den Beats. Die Geschwindigkeit folgt der Intensität der Musik. Jeder Treffer verzerrt und verlangsamt die Musik kurzzeitig, mit jedem Treffer stärker. Beim dritten Treffer bleibt die Musik wie ein Tape stehen und der Spieler fällt aus dem Level.

Das Spiel ist ein eigenständiges Rhythmusspiel. Visuelle Themes ändern nur die Optik. Zuerst entsteht ein **Base-Theme**.

### Rahmen durch die Kursvorgaben

- Umsetzung als **Web-Applikation mit Web-Audio-API und Canvas 2D/WebGL**.
- Quellcode in **Git**, mit agilen Techniken (Issues, Board, kleine Pull Requests).
- Abgabe: Repo, **README.md** (ca. 2 Seiten: Installation, Ausführung, Bedienung/Tastenbelegung, Technologien), Abschlusspräsentation (Gruppenleistung).
- Basisanforderungen des Kurses: gleichzeitiges Abspielen mehrerer Audio- und Videotracks, getrennte Kontrolle (Lautstärke, Pause, Geschwindigkeit), UI/UX.
- Bewertung: Idee 8 · Featureumfang/-qualität 60 · Codequalität 8 · UI/UX 8 · Doku 8 · Präsentation 8.

## 2. Technik-Entscheidungen

| Thema | Entscheidung |
|---|---|
| Sprache | **TypeScript** (strict) |
| Build | **Vite** |
| Rendering | **Canvas 2D** mit eigener Game-Loop, kein Spiel-Framework |
| Audio | **Web Audio API**, eigenes Audio-Modul |
| Analyse | Eigene Implementierung (FFT, Onset-Erkennung, Tempo), in einem **Web Worker**. Eine Bibliothek ist nur Fallback |
| Browser | Aktuelles Chrome/Edge und Firefox |
| Server | Keiner. Alles läuft lokal im Browser, hochgeladene Dateien verlassen den Rechner nicht |

Warum kein Unity: Die Kursvorgabe verlangt Web-Audio-API und Canvas, und Unity-WebGL bietet im Browser nur sehr eingeschränktes Audio (kein Threading, nur Lautstärke im AudioMixer).
Warum kein Phaser/Pixi: Das Spiel ist visuell einfach (feste Spielerposition, scrollende Hindernisse, Video-Draw). Ein eigenes, kleines Rendering ist leichter zu verstehen, zu bewerten und zu pflegen. Das kann bei Bedarf geändert werden.

### Ordnerstruktur (Zielbild)

Ordner entstehen mit ihrem ersten Inhalt, Git speichert keine leeren Ordner. Die Struktur ist ein Plan und darf sich ändern, vor der Abgabe wird sie noch einmal aufgeräumt.

```
tape-stop/
├── docs/               Briefing, Paper-Prototype
├── public/             Presets (lizenzfreie Songs und Videos), ab M5
├── src/
│   ├── config/         Konstanten und Tastenbelegung (ab M1)
│   ├── game/           Game-Loop, Spieler, Hindernisse, Leben (ab M1)
│   ├── audio/          Laden, Audio-Graph, Analyse, Level-Generator (ab M2)
│   ├── ui/             Menüs, HUD, Settings (ab M5)
│   ├── themes/         Base-Theme und weitere Themes (ab M5)
│   └── main.ts         Einstiegspunkt
├── README.md, CONTRIBUTING.md, CREDITS.md, LICENSE
└── Konfigurationsdateien (package.json, tsconfig.json, vite.config.ts, eslint.config.js, ...)
```

## 3. Gameplay

### Aufbau

- Seitenansicht von links nach rechts in einem **Korridor** mit festem Boden und fester Decke.
- Der Spieler bleibt **immer an derselben x-Position**, die Welt bewegt sich ihm entgegen (wie bei Geometry Dash).
- Die Hindernisse kommen **auf dem Beat** an, der Spieler erkennt am Aussehen, welche Aktion nötig ist.

### Aktionen und Hindernisse

| Aktion | Hindernis | Taste |
|---|---|---|
| Springen | Hindernis am Boden | **F** |
| Sliden | Hindernis hängt von der Decke | **D** |
| Angreifen | Zerstörbares Ziel auf mittlerer Höhe | **G** |

- Feste Belegung D / F / G (drei Tasten nebeneinander, Finger bleiben liegen). Die Belegung steht zentral in einer Config-Datei. Umbelegbar durch den Nutzer ist ein optionales Extra.
- Begründung der Zuordnung (räumliche Intuition): Die **mittlere Taste F** steht für "nach vorne/oben" = Springen. **Links (D)** ist Sliden. **Rechts (G)** ist der Angriff, weil man nach rechts läuft und nach vorne schlägt.
- **Esc** pausiert und öffnet das Pausenmenü.
- Perks (Bonus-Items) sind **nicht Teil des MVP**.

### Leben, Game Over, Sieg

- **3 Leben pro Durchlauf.** Sie werden nicht aufgefüllt. Jeder Treffer kostet ein Leben und löst einen kurzzeitigen Audio-Effekt aus, der mit jedem Treffer stärker wird (siehe Abschnitt 4).
- Beim 3. Treffer: Tape-Stop der Musik, der Würfel fällt aus dem Level, **Game Over**.
- Game-Over-Screen: erreichter **Prozentwert des Songs**, Restart oder zurück ins Menü.
- Sieg: Der Song wird bis zum Ende überlebt (Win-Screen mit Ergebnis).
- Die verbleibenden Leben sind im HUD dauerhaft sichtbar, damit klar bleibt, dass sie nach dem Abklingen des Effekts nicht zurückkommen.

## 4. Audio-Pipeline und Level-Generierung

### Eingabe

- Quelle ist eine **Audiodatei** (`.mp3`, `.wav`, `.ogg`) oder eine **Videodatei** (`.mp4`, `.webm`).
- **Es wird immer nur der Ton analysiert und abgespielt.** Bei Videodateien wird die Tonspur extrahiert. Kein zusätzliches, separates Video.
- Mitgelieferte Presets: 2–3 lizenzfreie Songs und ein paar lizenzfreie Videos (Quellen in `CREDITS.md`).
- Risiko: Ob `decodeAudioData` den Ton jeder MP4 dekodiert, hängt von Browser und Codec ab. Früh testen, bei Fehlern klare Fehlermeldung.

### Vorab-Analyse (vor dem Start des Levels)

Nach dem Laden wird der gesamte Ton **offline** analysiert (Web Worker, damit die UI nicht hängt). Ergebnisse:

1. **Onsets/Beats** (Zeitpunkte) und ein geschätztes **Tempo (BPM)**.
2. **Energie pro Frequenzband** (Bass, Mitten, Höhen) pro Zeitfenster.
3. **Intensitätskurve** (0–1, geglättet) über die ganze Songlänge.

Daraus entsteht eine **Level-Map**: Liste von Hindernissen mit Zeitpunkt und Typ.

### Regeln der Level-Generierung

- Jeder ausgewählte Beat wird ein Hindernis. Der **Typ** hängt vom dominierenden Band am Beat ab: Bass → Sprung, Höhen → Slide, Mitten → Angriff.
- **Fairness**: Mindestabstand zwischen Hindernissen (Wert in Config), keine ewigen Wiederholungen des gleichen Typs, kurze leere Einleitung am Songanfang, in ruhigen Passagen weniger Hindernisse.
- **Schwierigkeit** (später): Beat-Dichte (jeder Beat, jeder zweite Beat).
- Alle Regeln sind Konstanten in einer Config, damit sie sich leicht abstimmen lassen.

### Geschwindigkeit: Zeit statt Tempo

Wichtigste Designregel: **Die Position der Hindernisse ist eine Funktion der Songzeit**, nicht der Scroll-Geschwindigkeit.

- Aus der Intensitätskurve wird eine Scroll-Geschwindigkeit `v(t)` abgeleitet (zwischen `minSpeed` und `maxSpeed`, stark geglättet, begrenzte Änderungsrate).
- Daraus wird vorab die zurückgelegte Strecke `D(t)` = Integral von `v` über die Zeit berechnet.
- Position eines Hindernisses mit Beat-Zeit `tBeat`: `x = spielerX + (D(tBeat) - D(tJetzt)) * pxProEinheit`.
- Damit kommt jedes Hindernis **exakt auf dem Beat** beim Spieler an, egal wie sich das Tempo davor ändert.

### Audio-Graph (Web Audio)

```
Song-Quelle (AudioBufferSourceNode)
   → Degradations-Kette (Lowpass-Biquad, WaveShaper) → Music-Gain ─┐
SFX (Sprung, Treffer, Angriff)                      → SFX-Gain  ─┴→ Master-Gain → Ausgang
```

- **Master-Clock** des Spiels ist `AudioContext.currentTime` (nicht `requestAnimationFrame`). Alles andere richtet sich danach.
- Das Video (falls vorhanden) ist **stumm** und wird an die Audiozeit gekoppelt (Drift-Korrektur).
- Drei Lautstärkeregler in den Settings: **Master, Music, SFX**.
- Nach Browser-Regeln startet Audio erst nach einer Nutzerinteraktion. Das Menü ("Start") dient als Auslöser.

### Audio-Degradation bei Treffern

Die Verzerrung ist **vorübergehend**: Nach einem Treffer wird die Musik sofort verzerrt und verlangsamt und läuft dann sanft zurück auf normal. Die Leben kommen dabei nicht zurück. Damit das für den Spieler klar bleibt, wird der Effekt **mit jedem Treffer stärker**.

Startwerte, im Playtest abzustimmen (alle in der Config):

| Treffer | Spitzenwerte des Effekts | Danach |
|---|---|---|
| 1. Treffer (2 Leben übrig) | `playbackRate` ca. 0,9, Lowpass ca. 5 kHz, leichte Verzerrung | Rückkehr auf normal in ca. 4 s |
| 2. Treffer (1 Leben übrig) | `playbackRate` ca. 0,75, Lowpass ca. 2 kHz, deutlich stärkere Verzerrung | Rückkehr auf normal in ca. 5 s |
| 3. Treffer (0 Leben) | **Tape-Stop**: `playbackRate` fährt in ca. 1,5 s auf 0, Fall aus dem Level | kein Zurück, Game Over |

- `playbackRate` ändert Tempo und Tonhöhe zusammen (Tape-Effekt). Die Level-Zeit folgt dem Audio. Das Spiel läuft also während des Effekts kurz langsamer und danach wieder normal.
- Übergänge per `setTargetAtTime`/`linearRampToValueAtTime`, nicht abrupt.
- Trifft ein weiteres Hindernis während der Erholung, startet der Effekt der nächsthöheren Stufe vom aktuellen Wert aus.

## 5. Video und Hintergrund

Gehört zu den Video/Anzeige-Einstellungen. Drei Modi:

1. **Hintergrund**: Das Video läuft im Hintergrund des Korridors.
2. **Werbetafeln**: Das Video wird auf den vorbeiziehenden Tafeln (Pfosten mit Bildschirm) gezeigt.
3. **Aus**: Kein Video. Dann erscheint der **Standard-Hintergrund des Themes**.

Ohne Video (reine Audiodatei) gilt immer der Theme-Hintergrund. Technisch ist alles ein `<video>`-Element, das per `drawImage` auf das Canvas gezeichnet wird. Nur die Zielposition unterscheidet sich.

## 6. Themes

- Ein Theme = **Konfigurationsdatei + Sprites/Farben** (Spieler, Hindernisse, Korridor, Tafeln, Hintergrund, Effekt-Farben).
- **Base-Theme** zuerst (minimalistisch). Weitere Themes liefern wir selbst, wenn Zeit bleibt.
- Das Theme-Format wird von Anfang an sauber getrennt, damit ein neues Theme nur ein neuer Ordner ist.
- Upload eigener Themes durch Nutzer: **optionales Extra**, nicht geplant.
- Beat-/Checkpoint-Effekte im Hintergrund (visuelle Reaktion auf Audio) gehören zum Theme-System und zur "Visualisierung des Audiosignals".

## 7. UI und Screens

Vorlage: Paper-Prototype (`docs/paper-prototype/`). Es kommen noch Screens dazu, die als **Prototype v2** ergänzt werden.

- **Hauptmenü**: Start, Song/Theme wählen, Settings, Quit.
- **Songs**: Liste der Presets, "+ Add Song" (Datei auswählen).
- **Themes**: Liste mit Vorschau und Beschreibung.
- **Settings**:
  - Audio: Master, Music, SFX.
  - Video/Sprache: Animationen an/aus, Sprache (DE, später EN), Video-Anzeige (Hintergrund, Werbetafeln, Aus).
- **Neu (v2)**: HUD (Leben, Songfortschritt), Pause (Esc), Game Over (Prozent, Restart, Menü), Win-Screen.
- Alle Texte kommen aus einem Sprach-Dictionary (damit DE/EN später ohne Umbau geht).

## 8. MVP und Meilensteine

1. **Setup**: Repo, Vite+TS, Linter/Formatter, Game-Loop, Würfel im Korridor, 3 Aktionen mit D/F/G, handplatzierte Test-Hindernisse.
2. **Audio-Engine**: Datei laden (Audio und Video), Wiedergabe über den Audio-Graph, Busse, Pause.
3. **Analyse und Level**: Beats, Intensität, Bänder, Level-Generator, Zeit-statt-Tempo-Positionierung.
4. **Leben und Degradation**: Treffer, vorübergehende Audio-Effekte mit steigender Stärke, Tape-Stop, Game Over und Win.
5. **Menüs und Settings**: Navigation, Presets, Video-Modi, Theme-System mit Base-Theme.
6. **Polish**: Hintergrundeffekte, zweites Theme, README, Prototype v2, Präsentation.

**Später/optional**: Perks, Checkpoint-Effekte, Schwierigkeitsgrade, Umbelegung der Tasten, Gamepad/MIDI, Theme-Upload, englische Sprache.

## 9. Risiken

- **Audio-Latenz**: Anzeige und Ausgabe sind leicht versetzt. Eine Latenz-Korrektur (Offset) einplanen.
- **Beat-Erkennung** ist nie perfekt. Bei schwierigen Songs fällt die Qualität. Deshalb gute Presets und das Playtesting früh beginnen.
- **Dekodierung von MP4** (siehe Abschnitt 4).
- **Browser-Autoplay**: Audio nur nach Nutzeraktion.
- **Große Dateien**: Dekodiertes Audio belegt viel Speicher. Dateigröße begrenzen oder warnen.

## 10. Konventionen

Diese Regeln gelten für beide im Team. Sie stehen auch in `CONTRIBUTING.md`. Formatierung und einfache Stilregeln erzwingen Prettier und ESLint automatisch.

### 10.1 Commit-Messages

Wir nutzen **Conventional Commits**:

```
<typ>(<bereich>): <kurze beschreibung>

<optionaler text: was und warum, nicht wie>

<optionaler footer: Issue-Verweise, Breaking Changes>
```

**Typen**

| Typ | Wofür |
|---|---|
| `feat` | neue Funktion für den Nutzer |
| `fix` | Fehler behoben |
| `docs` | nur Dokumentation (README, Briefing, Kommentare) |
| `style` | nur Formatierung, keine Logik (Leerzeichen, Semikolons) |
| `refactor` | Umbau ohne Verhaltensänderung |
| `perf` | Verbesserung der Performance |
| `test` | Tests hinzugefügt oder geändert |
| `build` | Build-System, Abhängigkeiten, Vite/npm-Konfiguration |
| `ci` | Automatisierung (z. B. GitHub Actions) |
| `chore` | Sonstiges ohne Einfluss auf den Code (z. B. `.gitignore`) |
| `revert` | Rücknahme eines früheren Commits |

**Bereiche (scope)**: `audio`, `analysis`, `level`, `game`, `ui`, `theme`, `config`, `video`, `docs`, `deps`. Neue Bereiche sind erlaubt, wenn sie sinnvoll sind. Ohne passenden Bereich darf er weggelassen werden.

**Regeln für die erste Zeile**
- Auf **Englisch**, im **Imperativ Präsens** ("add", nicht "added" oder "adds").
- Klein geschrieben, **kein Punkt** am Ende.
- Möglichst höchstens 50 Zeichen, **hart maximal 72**.
- Beschreibt, **was** sich ändert, nicht wie.

**Regeln für Text und Footer**
- Leerzeile zwischen erster Zeile und Text, Zeilen im Text auf ca. 72 Zeichen umbrechen.
- Der Text erklärt **warum** etwas geändert wurde, wenn es nicht offensichtlich ist.
- Issues verknüpfen: `Closes #12` (schließt es) oder `Refs #12`.
- Breaking Changes: `!` hinter dem Bereich (`feat(config)!: rename key map`) und ein Footer `BREAKING CHANGE: …`.

**Gute Beispiele**

```
feat(analysis): add spectral-flux onset detection
fix(audio): prevent clicking when tape stop ramp ends
refactor(level): extract obstacle spacing into config
docs(readme): add key bindings and installation steps
chore: add Node gitignore entries for Vite
```

**Schlechte Beispiele** (nicht so)

```
update stuff
Fixed bug.
WIP
feat: Added the new Audio Thing and also changed some UI and fixed lint
```

**Atomare Commits**
- Ein Commit = **eine** logische Änderung. Keine Mischung aus Funktion, Umbau und Formatierung.
- Nach jedem Commit **baut und startet** das Projekt (`npm run build`).
- Lieber öfter und klein committen als selten und riesig.
- Nicht ins Repo gehören: `node_modules`, Build-Ausgaben (`dist`), große oder geschützte Mediendateien, Passwörter und Schlüssel.

### 10.2 Branches und Pull Requests

Es gibt zwei dauerhafte Branches:

- **`main`**: stabiler, getesteter Stand. Er ist immer lauffähig und wird bewertet.
- **`dev`**: Integrationsbranch. Hier kommen alle fertigen Features zusammen und werden gemeinsam getestet.

Beide sind per Regel geschützt: Änderungen nur per **Pull Request**, kein Force-Push, nicht löschbar.

**Ablauf**

1. Ein Feature-Branch startet immer von `dev` (`git switch dev`, `git pull`, `git switch -c feature/12-onset-detection`).
2. Der **Pull Request geht nach `dev`** (im PR "base: dev" prüfen). Die andere Person schaut drüber, gemerged wird per **"Squash and merge"**, damit pro PR ein sauberer Commit auf `dev` steht.
3. Auf `dev` wird getestet (`npm run dev`, `npm run build`).
4. Läuft ein Stand (zum Beispiel ein Meilenstein), geht ein Pull Request **von `dev` nach `main`**. Hier wird per **"Create a merge commit"** gemerged (nicht Squash, sonst laufen die Branches auseinander). In die Beschreibung kommen `Closes #12, closes #13` für die enthaltenen Issues: GitHub schließt Issues nur beim Merge in den Standard-Branch `main`.
5. Nach jedem Meilenstein wird auf `main` ein Tag gesetzt (zum Beispiel `v0.1`).

**Regeln**

- **Branch-Namen**: `feature/<kurzname>`, `fix/<kurzname>`, `docs/<kurzname>`, `refactor/<kurzname>`, klein geschrieben mit Bindestrichen, optional mit Issue-Nummer (`feature/12-onset-detection`).
- Branches sind **kurzlebig** und werden nach dem Merge gelöscht.
- **PR-Titel** folgt dem Commit-Schema (`feat(audio): add offline beat analysis`). Die Beschreibung nennt: was geändert wurde, warum, wie getestet, verknüpftes Issue.
- **Review**: Die jeweils andere Person schaut kurz drüber, bevor gemerged wird.
- Arbeit wird als **GitHub Issues** geplant (ein Issue pro Aufgabe, zugeordnet zu einem Meilenstein aus Abschnitt 8) und auf einem Board verfolgt (Todo, In Progress, Ready for review, Done).

### 10.3 Code-Style

**Sprache und Formatierung**
- **TypeScript im strict-Modus.** Kein `any` (stattdessen `unknown` oder echte Typen).
- **Code, Kommentare und Commit-Messages auf Englisch.** Dokumentation (README, Briefing) auf Deutsch.
- **Prettier** formatiert (2 Leerzeichen, einfache Anführungszeichen, Semikolons, Trailing Commas, Zeilenbreite 100). **ESLint** mit `typescript-eslint` prüft. Vor jedem Commit laufen `npm run format` und `npm run lint` ohne Fehler.
- Formatierung wird nie von Hand diskutiert: Was Prettier ausgibt, gilt.

**Namensgebung**

| Was | Schreibweise | Beispiel |
|---|---|---|
| Variablen, Funktionen, Methoden | `camelCase` | `computeIntensityCurve` |
| Klassen, Typen, Interfaces, Enums | `PascalCase` (Interfaces ohne `I`-Präfix) | `LevelGenerator`, `Obstacle` |
| Konstanten | `UPPER_SNAKE_CASE` | `MIN_OBSTACLE_GAP_SEC` |
| Dateien mit einer Klasse | `PascalCase.ts` | `AudioEngine.ts` |
| sonstige Dateien | `camelCase.ts` | `beatDetection.ts` |
| Booleans | beginnen mit `is`, `has`, `should`, `can` | `isPlaying`, `hasVideo` |

- **Einheiten im Namen**, vor allem bei Zeit und Strecke: `timeSec`, `delayMs`, `speedPxPerSec`. Zeitwerte im Spiel sind standardmäßig Sekunden als Zahl.
- Private Member mit dem Schlüsselwort `private`, kein Unterstrich-Präfix.

**Struktur**
- Ein Modul hat **eine Aufgabe**. Dateien bleiben klein und übersichtlich.
- **Analyse und Level-Generierung** sind reine Logik ohne DOM-Zugriff und damit testbar. **Spiellogik** (`update`) und **Zeichnen** (`render`) sind getrennt.
- Abhängigkeiten laufen in eine Richtung (zum Beispiel `ui` → `game` → `audio`), keine Zirkel-Importe.
- Rechenintensive Arbeit (Analyse) läuft im **Web Worker**.
- **Keine Magic Numbers.** Werte zum Abstimmen (Abstände, Effektstärken, Zeiten, Tasten) stehen in `src/config`.
- Nur **benannte Exports**, keine Default-Exports. `const` bevorzugen, kein `var`, immer `===`.
- Imports geordnet: erst externe Pakete, dann eigene Module.
- Fehler werden nie still verschluckt. Nutzerfehler (z. B. nicht lesbare Datei) erscheinen als verständliche Meldung in der UI.

**Kommentare**
- Jede **exportierte** Funktion, Klasse und jeder Typ bekommt einen **JSDoc-Kommentar** (`/** … */`) mit Kurzbeschreibung, `@param` für jeden Parameter (mit Einheit) und `@returns`.
- Kommentare erklären das **Warum**, nicht das Offensichtliche.
- Kein auskommentierter Code. Offene Punkte als `// TODO(#12): …` mit Issue-Nummer.

Beispiel:

```ts
/**
 * Computes the distance travelled at a given song time.
 *
 * @param timeSec - Song time in seconds.
 * @param speedCurve - Smoothed scroll speed per sample in px/s.
 * @returns Accumulated distance in pixels.
 */
export function distanceAt(timeSec: number, speedCurve: readonly number[]): number {
  // ...
}
```

**Tests (empfohlen)**: Reine Funktionen (Strecke D(t), Level-Generator, Beat-Auswahl) bekommen Unit-Tests mit Vitest, soweit die Zeit reicht.

### 10.4 Lizenz und Medien

- **MIT** für den Code (Urheber: Kemal-Emirkan Akkaş, Berkan Akcay). Die `LICENSE` existiert bereits im Repo.
- Medien (Songs, Videos) haben eigene Lizenzen und stehen mit Quelle und Lizenz in `CREDITS.md`. Es kommen nur lizenzfreie Medien ins Repo.
