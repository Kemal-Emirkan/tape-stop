import { CANVAS_WIDTH_PX, OBSTACLE_WIDTH_PX, SCROLL_SPEED_PX_PER_SEC } from '../config/constants';
import { KEY_BINDINGS, type PlayerAction } from '../config/keyBindings';
import { TEST_LEVEL, TEST_LEVEL_DURATION_SEC } from '../config/testLevel';
import { Corridor } from './Corridor';
import { Obstacle } from './Obstacle';
import { Player } from './Player';

/** Reverse lookup of KEY_BINDINGS: key code -> action. */
const ACTION_BY_KEY = new Map<string, PlayerAction>(
  Object.entries(KEY_BINDINGS).map(([action, code]) => [code, action as PlayerAction]),
);

/** How long an obstacle needs to cross the canvas; the next loop is spawned this early. */
const SPAWN_LOOKAHEAD_SEC = CANVAS_WIDTH_PX / SCROLL_SPEED_PX_PER_SEC;

/**
 * Central game object: owns all game objects, handles input and
 * runs their update and renderer steps oncee per loop iteration.
 */
export class Game {
  private corridor: Corridor;
  private player: Player;
  private isPaused: boolean;
  private obstacles: Obstacle[];

  /** Game time; only advances while not paused. */
  private elapsedSec = 0;

  /** Game time at which the next repetition of the test level starts. */
  private nextLoopStartSec = 0;

  /**
   * Creates all game objects and starts listening for keyboard input.
   *
   * @param context - 2D context of the game canvas.
   * @param onPauseChange - Called whenever the game is paused or resumed.
   */
  constructor(
    private context: CanvasRenderingContext2D,
    private onPauseChange: (isPaused: boolean) => void,
  ) {
    this.corridor = new Corridor(context);
    this.player = new Player(context);
    this.obstacles = [];
    this.spawnTestLoop();
    this.isPaused = false;
    this.listenForInput();
  }

  /**
   * Pauses or resumes the game and notifies the listener.
   *
   * @param isPaused - True to pause, false to resume.
   */
  setPaused(isPaused: boolean): void {
    this.isPaused = isPaused;
    this.onPauseChange(isPaused);
  }

  /** Toggles between paused and running. */
  private togglePause(): void {
    this.setPaused(!this.isPaused);
  }

  /** Appends one more pass of the test level, shifted to start where the last one ended. */
  private spawnTestLoop(): void {
    for (const spawn of TEST_LEVEL) {
      this.obstacles.push(
        new Obstacle(spawn.type, this.nextLoopStartSec + spawn.timeSec, this.context),
      );
    }
    this.nextLoopStartSec += TEST_LEVEL_DURATION_SEC;
  }

  /**
   * Advances the game state by one fixed simulation step
   * Does nothing while the game is paused.
   *
   * @param deltaSec - Duration of the step in seeconds.
   */
  update(deltaSec: number): void {
    if (this.isPaused) return;
    this.elapsedSec += deltaSec;

    if (this.elapsedSec + SPAWN_LOOKAHEAD_SEC >= this.nextLoopStartSec) this.spawnTestLoop();
    // Drop obstacles that have left the canvas on the left.
    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.getRect(this.elapsedSec).xPx + OBSTACLE_WIDTH_PX >= 0,
    );

    this.corridor.update(deltaSec);
    this.player.update(deltaSec);
  }

  /** Draws the current game state; later objects are drawn on top. */
  render(): void {
    const { width, height } = this.context.canvas;
    this.context.clearRect(0, 0, width, height);
    this.corridor.render();
    for (const obstacle of this.obstacles) {
      if (!obstacle.isDestroyed) obstacle.render(this.elapsedSec);
    }
    this.player.render();
  }

  /** Maps key presses to game actions; held keys only trigger once. */
  private listenForInput(): void {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const action = ACTION_BY_KEY.get(e.code);
      if (!action) return;
      if (this.isPaused && action !== 'pause') return;

      switch (action) {
        case 'jump':
          this.player.jump();
          break;
        case 'slide':
          this.player.slide();
          break;
        case 'attack':
          this.player.attack();
          break;
        case 'pause':
          this.togglePause();
          break;
        default: {
          // Fails to compile if a new PlayerAction has no case above.
          const unhandled: never = action;
          throw new Error(`Unhandled player action: ${unhandled}`);
        }
      }
    });
  }
}
