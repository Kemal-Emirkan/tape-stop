# Mitwirken an Tape Stop

Diese Regeln gelten für alle im Team. Formatierung und einfache Stilregeln erzwingen Prettier und ESLint automatisch.

## Commit-Messages

Wir nutzen **Conventional Commits**:

```
<typ>(<bereich>): <kurze beschreibung>

<optionaler text: was und warum, nicht wie>

<optionaler footer: Issue-Verweise, Breaking Changes>
```

### Typen

| Typ        | Wofür                                                     |
| ---------- | --------------------------------------------------------- |
| `feat`     | neue Funktion für den Nutzer                              |
| `fix`      | Fehler behoben                                            |
| `docs`     | nur Dokumentation (README, Briefing, Kommentare)          |
| `style`    | nur Formatierung, keine Logik (Leerzeichen, Semikolons)   |
| `refactor` | Umbau ohne Verhaltensänderung                             |
| `perf`     | Verbesserung der Performance                              |
| `test`     | Tests hinzugefügt oder geändert                           |
| `build`    | Build-System, Abhängigkeiten, Vite/npm-Konfiguration      |
| `ci`       | Automatisierung (z. B. GitHub Actions)                    |
| `chore`    | Sonstiges ohne Einfluss auf den Code (z. B. `.gitignore`) |
| `revert`   | Rücknahme eines früheren Commits                          |

### Bereiche (scope)

`audio`, `analysis`, `level`, `game`, `ui`, `theme`, `config`, `video`, `docs`, `deps`. Neue Bereiche sind erlaubt, wenn sie sinnvoll sind. Ohne passenden Bereich darf er weggelassen werden.

### Regeln für die erste Zeile

- Auf **Englisch**, im **Imperativ Präsens** („add", nicht „added" oder „adds").
- Klein geschrieben, **kein Punkt** am Ende.
- Möglichst höchstens 50 Zeichen, **hart maximal 72**.
- Beschreibt, **was** sich ändert, nicht wie.

### Regeln für Text und Footer

- Leerzeile zwischen erster Zeile und Text, Zeilen im Text auf ca. 72 Zeichen umbrechen.
- Der Text erklärt **warum** etwas geändert wurde, wenn es nicht offensichtlich ist.
- Issues verknüpfen: `Closes #12` (schließt es) oder `Refs #12`.
- Breaking Changes: `!` hinter dem Bereich (`feat(config)!: rename key map`) und ein Footer `BREAKING CHANGE: …`.

### Gute Beispiele

```
feat(analysis): add spectral-flux onset detection
fix(audio): prevent clicking when tape stop ramp ends
refactor(level): extract obstacle spacing into config
docs(readme): add key bindings and installation steps
chore: add Node gitignore entries for Vite
```

### Schlechte Beispiele (nicht so)

```
update stuff
Fixed bug.
WIP
feat: Added the new Audio Thing and also changed some UI and fixed lint
```

### Atomare Commits

- Ein Commit = **eine** logische Änderung. Keine Mischung aus Funktion, Umbau und Formatierung.
- Nach jedem Commit **baut und startet** das Projekt (`npm run build`).
- Lieber öfter und klein committen als selten und riesig.
- Nicht ins Repo gehören: `node_modules`, Build-Ausgaben (`dist`), große oder geschützte Mediendateien, Passwörter und Schlüssel.

## Branches und Pull Requests

Es gibt zwei dauerhafte Branches:

- **`main`**: stabiler, getesteter Stand. Er ist immer lauffähig und wird bewertet.
- **`dev`**: Integrationsbranch. Hier kommen alle fertigen Features zusammen und werden gemeinsam getestet.

Beide sind per Regel geschützt: Änderungen nur per **Pull Request**, kein Force-Push, nicht löschbar.

### Ablauf

1. Ein Feature-Branch startet immer von `dev` (`git switch dev`, `git pull`, `git switch -c feature/12-onset-detection`).
2. Der **Pull Request geht nach `dev`** (im PR „base: dev" prüfen). Die andere Person schaut drüber, gemerged wird per **„Squash and merge"**, damit pro PR ein sauberer Commit auf `dev` steht.
3. Auf `dev` wird getestet (`npm run dev`, `npm run build`).
4. Läuft ein Stand (zum Beispiel ein Meilenstein), geht ein Pull Request **von `dev` nach `main`**. Hier wird per **„Create a merge commit"** gemerged (nicht Squash, sonst laufen die Branches auseinander). In die Beschreibung kommen `Closes #12, closes #13` für die enthaltenen Issues: GitHub schließt Issues nur beim Merge in den Standard-Branch `main`.
5. Nach jedem Meilenstein wird auf `main` ein Tag gesetzt (zum Beispiel `v0.1`).

### Regeln

- **Branch-Namen**: `feature/<kurzname>`, `fix/<kurzname>`, `docs/<kurzname>`, `refactor/<kurzname>`, klein geschrieben mit Bindestrichen, optional mit Issue-Nummer (`feature/12-onset-detection`).
- Branches sind **kurzlebig** und werden nach dem Merge gelöscht.
- **PR-Titel** folgt dem Commit-Schema (`feat(audio): add offline beat analysis`). Die Beschreibung nennt: was geändert wurde, warum, wie getestet, verknüpftes Issue.
- **Review**: Die jeweils andere Person schaut kurz drüber, bevor gemerged wird.
- Arbeit wird als **GitHub Issues** geplant (ein Issue pro Aufgabe, zugeordnet zu einem Meilenstein aus dem Briefing) und auf einem Board verfolgt (Todo, In Progress, Ready for review, Done).

## Code-Style

### Sprache und Formatierung

- **TypeScript im strict-Modus.** Kein `any` (stattdessen `unknown` oder echte Typen).
- **Code, Kommentare und Commit-Messages auf Englisch.** Dokumentation (README, Briefing) auf Deutsch.
- **Prettier** formatiert (2 Leerzeichen, einfache Anführungszeichen, Semikolons, Trailing Commas, Zeilenbreite 100). **ESLint** mit `typescript-eslint` prüft. Vor jedem Commit laufen `npm run format` und `npm run lint` ohne Fehler.
- Formatierung wird nie von Hand diskutiert: Was Prettier ausgibt, gilt.

### Namensgebung

| Was                               | Schreibweise                              | Beispiel                     |
| --------------------------------- | ----------------------------------------- | ---------------------------- |
| Variablen, Funktionen, Methoden   | `camelCase`                               | `computeIntensityCurve`      |
| Klassen, Typen, Interfaces, Enums | `PascalCase` (Interfaces ohne `I`-Präfix) | `LevelGenerator`, `Obstacle` |
| Konstanten                        | `UPPER_SNAKE_CASE`                        | `MIN_OBSTACLE_GAP_SEC`       |
| Dateien mit einer Klasse          | `PascalCase.ts`                           | `AudioEngine.ts`             |
| sonstige Dateien                  | `camelCase.ts`                            | `beatDetection.ts`           |
| Booleans                          | beginnen mit `is`, `has`, `should`, `can` | `isPlaying`, `hasVideo`      |

- **Einheiten im Namen**, vor allem bei Zeit und Strecke: `timeSec`, `delayMs`, `speedPxPerSec`. Zeitwerte im Spiel sind standardmäßig Sekunden als Zahl.
- Private Member mit dem Schlüsselwort `private`, kein Unterstrich-Präfix.

### Struktur

- Ein Modul hat **eine Aufgabe**. Dateien bleiben klein und übersichtlich.
- **Analyse und Level-Generierung** sind reine Logik ohne DOM-Zugriff und damit testbar. **Spiellogik** (`update`) und **Zeichnen** (`render`) sind getrennt.
- Abhängigkeiten laufen in eine Richtung (zum Beispiel `ui` → `game` → `audio`), keine Zirkel-Importe.
- Rechenintensive Arbeit (Analyse) läuft im **Web Worker**.
- **Keine Magic Numbers.** Werte zum Abstimmen (Abstände, Effektstärken, Zeiten, Tasten) stehen in `src/config`.
- Nur **benannte Exports**, keine Default-Exports. `const` bevorzugen, kein `var`, immer `===`.
- Imports geordnet: erst externe Pakete, dann eigene Module.
- Fehler werden nie still verschluckt. Nutzerfehler (z. B. nicht lesbare Datei) erscheinen als verständliche Meldung in der UI.

### Kommentare

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

## Tests

Tests sind empfohlen, nicht Pflicht. Reine Funktionen (Strecke D(t), Level-Generator, Beat-Auswahl) bekommen Unit-Tests mit Vitest, soweit die Zeit reicht.

## Lizenz und Medien

- **MIT** für den Code (Urheber: Kemal-Emirkan Akkaş, Berkan Akcay). Die `LICENSE` liegt im Repo.
- Medien (Songs, Videos) haben eigene Lizenzen und stehen mit Quelle und Lizenz in `CREDITS.md`. Es kommen nur lizenzfreie Medien ins Repo.

## Dokumentation

- **Wer das README ändert, aktualisiert die englische Zusammenfassung (Abschnitt „English") mit**, damit beide Teile inhaltlich übereinstimmen.
