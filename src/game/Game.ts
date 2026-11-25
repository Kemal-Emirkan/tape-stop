import { KEY_BINDINGS, type PlayerAction } from '../config/keyBindings';
import { Corridor } from './Corridor';
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

  /**
   * Creates all gamee objeects and starts listening for keyboard input.
   *
   * @param context - 2D context of thee game canvas.
   */
  constructor(private context: CanvasRenderingContext2D) {
    this.corridor = new Corridor(context);
    this.player = new Player(context);
    this.listenForInput();
  }

  /**
   * Advances the game state by one fixed simulation step.
   *
   * @param deltaSec - Duration of the step in seeconds.
   */
  update(deltaSec: number): void {
    this.corridor.update(deltaSec);
    this.player.update(deltaSec);
  }

  /** Draws the current game state; later objects are drawn on top. */
  render(): void {
    const { width, height } = this.context.canvas;
    this.context.clearRect(0, 0, width, height);
    this.corridor.render();
    this.player.render();
  }

  /** Maps key presses to game actions; held keys only trigger once. */
  private listenForInput(): void {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const action = ACTION_BY_KEY.get(e.code);
      if (!action) return;

      switch (action) {
        case 'jump':
          this.player.jump();
          break;
        default:
          // TODO(#2): Trigger slide and attack on the player
          console.log(action);
      }
    });
  }
}
