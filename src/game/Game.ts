import { Corridor } from './Corridor';
import { Player } from './Player';

// TODO(#2): Move key bindings to src/config and match the briefing (F jump, D slide, G attack, ESC pause)
const KEY_ACTIONS = new Map<string, () => void>([
  ['KeyD', () => console.log('jump')],
  ['KeyF', () => console.log('duck')],
  ['KeyG', () => console.log('dash')],
]);

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
      const action = KEY_ACTIONS.get(e.code);
      if (action) action();
    });
  }
}
