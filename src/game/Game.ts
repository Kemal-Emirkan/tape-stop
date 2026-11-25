import { Corridor } from './Corridor';
import { Player } from './Player';

// TODO(#2): Move key bindings to src/config and match the briefing (F jump, D slide, G attack, ESC pause)
const KEY_ACTIONS = new Map<string, () => void>([
  ['KeyD', () => console.log('jump')],
  ['KeyF', () => console.log('duck')],
  ['KeyG', () => console.log('dash')],
]);

export class Game {
  private corridor: Corridor;
  private player: Player;

  constructor(private context: CanvasRenderingContext2D) {
    this.corridor = new Corridor(context);
    this.player = new Player(context);
    this.listenForInput();
  }

  update(deltaSec: number): void {
    this.corridor.update(deltaSec);
  }

  render(): void {
    const { width, height } = this.context.canvas;
    this.context.clearRect(0, 0, width, height);
    this.corridor.render();
    this.player.render();
  }

  private listenForInput(): void {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const action = KEY_ACTIONS.get(e.code);
      if (action) action();
    });
  }
}
