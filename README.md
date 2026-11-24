# Tape Stop

Ein Rhythmus-Sidescroller im Browser, in dem deine Musik das Level erzeugt.

[English version below](#english)

## Kurzbeschreibung

Tape Stop ist ein 2D-Sidescroller, bei dem **Musik das Level erzeugt und steuert**. Du lädst einen Song oder ein Video hoch, das Spiel analysiert den Ton und platziert Hindernisse auf den Beats. Die Geschwindigkeit folgt der Intensität der Musik.

Jeder Treffer verzerrt und verlangsamt die Musik kurzzeitig, mit jedem Treffer stärker. Beim dritten Treffer kommt die Musik wie ein Tape zum Stillstand und der Spieler fällt aus dem Level. Daher der Name: Der Tape-Stop ist der Effekt, wenn eine Aufnahme abrupt ausläuft.

Alles läuft lokal im Browser. Es gibt keinen Server, hochgeladene Dateien verlassen deinen Rechner nicht.

Das Projekt entsteht im Kurs „Medientechnik und Klubkultur" (HTW).

## Status

**In Entwicklung.** Aktuell existiert nur das Projektgerüst (Vite, TypeScript, Canvas, Linter und Formatter). Die unten genannten Features sind geplant und noch nicht umgesetzt.

## Geplante Features

Alle Punkte dieser Liste sind **geplant** und noch nicht gebaut.

- Upload einer Audiodatei (`.mp3`, `.wav`, `.ogg`) oder Videodatei (`.mp4`, `.webm`). Analysiert und abgespielt wird immer nur der Ton.
- Offline-Analyse des Tons (Beats, Tempo, Energie pro Frequenzband, Intensität) in einem Web Worker.
- Automatische Level-Generierung: Hindernisse kommen exakt auf dem Beat an, der Typ hängt vom dominierenden Frequenzband ab.
- Scroll-Geschwindigkeit, die der Intensität der Musik folgt.
- Drei Aktionen: Springen, Sliden und Angreifen.
- Drei Leben pro Durchlauf. Jeder Treffer löst einen stärker werdenden, vorübergehenden Audio-Effekt aus, der dritte Treffer einen Tape-Stop mit Game Over.
- Menüs, Pause, Game-Over- und Win-Screen, Einstellungen für Master-, Music- und SFX-Lautstärke.
- Videodarstellung als Hintergrund oder auf Werbetafeln im Korridor.
- Theme-System, zuerst mit einem minimalistischen Base-Theme.
- Mitgelieferte, lizenzfreie Beispielsongs.

Später und optional: Perks, Schwierigkeitsgrade, Umbelegung der Tasten, Theme-Upload, englische Sprache im Spiel.

## Installation

Voraussetzungen: aktuelle **Node.js-LTS-Version** mit npm sowie ein aktueller Browser (Chrome, Edge oder Firefox).

```
git clone https://github.com/Kemal-Emirkan/tape-stop.git
cd tape-stop
npm install
npm run dev
```

Danach ist die Seite unter der Adresse erreichbar, die Vite im Terminal ausgibt (üblicherweise `http://localhost:5173`).

Weitere Skripte:

| Befehl           | Wirkung                          |
| ---------------- | -------------------------------- |
| `npm run build`  | Typprüfung und Produktions-Build |
| `npm run lint`   | Code-Prüfung mit ESLint          |
| `npm run format` | Formatierung mit Prettier        |

## Bedienung

Geplante Bedienung, sobald das Spiel spielbar ist:

1. Im Menü auf **Start** klicken (Browser geben Audio erst nach einer Nutzeraktion frei).
2. Einen Song oder ein Video auswählen oder hochladen.
3. Warten, bis die Analyse abgeschlossen ist, und spielen.

| Taste   | Aktion    | Hindernis                           |
| ------- | --------- | ----------------------------------- |
| **F**   | Springen  | Hindernis am Boden                  |
| **D**   | Sliden    | Hindernis hängt von der Decke       |
| **G**   | Angreifen | Zerstörbares Ziel in mittlerer Höhe |
| **Esc** | Pause     | Öffnet das Pausenmenü               |

## Technologien

- TypeScript (strict)
- Vite
- Canvas 2D mit eigener Game-Loop, kein Spiel-Framework
- Web Audio API
- Web Worker für die Analyse
- ESLint (typescript-eslint), Prettier, EditorConfig

## Projektstruktur

Aktuell existieren `docs/`, `src/main.ts`, `index.html` und die Konfigurationsdateien. Die übrigen Ordner sind geplant und entstehen mit ihrem ersten Inhalt (Meilensteine M1 bis M5 laut Briefing). Die Struktur ist ein Plan und kann sich ändern.

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

## Mitwirkende

- Kemal-Emirkan Akkaş
- Berkan Akcay

Beiträge folgen den Regeln in [CONTRIBUTING.md](CONTRIBUTING.md).

## Lizenz

Der Code steht unter der [MIT-Lizenz](LICENSE). Medien haben eigene Lizenzen, siehe [CREDITS.md](CREDITS.md).

## English

**Tape Stop** is a work-in-progress rhythm sidescroller for the browser, built for a university course (HTW). Everything below describes the planned game, not what is built yet. Currently only the project scaffold exists.

### Overview

Upload a song or a video. The game analyzes the audio and generates the level from the beats. Every hit warps the music for a moment, getting stronger each time, and the third hit stops the tape and ends the run. Everything runs locally in the browser, no files are uploaded to a server.

### Features (planned)

- Audio or video upload, only the audio track is used
- Offline beat, tempo and intensity analysis in a Web Worker
- Level generated from the beats, scroll speed follows the music
- Jump, slide and attack, three lives, escalating audio effects, tape stop on the last hit
- Menus, settings, video backgrounds, themes

### Tech stack

TypeScript (strict), Vite, Canvas 2D, Web Audio API, Web Worker, ESLint, Prettier.

### Getting started

Requires the current Node.js LTS and a current browser.

```
git clone https://github.com/Kemal-Emirkan/tape-stop.git
cd tape-stop
npm install
npm run dev
```

### Controls

| Key | Action |
| --- | ------ |
| F   | Jump   |
| D   | Slide  |
| G   | Attack |
| Esc | Pause  |

Licensed under MIT. Authors: Kemal-Emirkan Akkaş, Berkan Akcay.
