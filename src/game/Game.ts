import { KEY_BINDINGS, type PlayerAction } from '../config/keyBindings';
import { TEST_LEVEL } from '../config/testLevel';
import { Corridor } from './Corridor';
import { Obstacle } from './Obstacle';
import { Player } from './Player';

/** Reverse lookup of KEY_BINDINGS: key code -> action. */
const ACTION_BY_KEY = new Map<string, PlayerAction>(
  Object.entries(KEY_BINDINGS).map(([action, code]) => [code, action as PlayerAction]),
);

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
    this.obstacles = TEST_LEVEL.map((spawn) => new Obstacle(spawn.type, spawn.timeSec, context));
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

  /**
   * Advances the game state by one fixed simulation step
   * Does nothing while the game is paused.
   *
   * @param deltaSec - Duration of the step in seeconds.
   */
  update(deltaSec: number): void {
    if (this.isPaused) return;
    this.elapsedSec += deltaSec;
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
