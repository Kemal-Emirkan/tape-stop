import { CANVAS_HEIGHT_PX, CANVAS_WIDTH_PX } from './config/constants';
import { Game } from './game/Game';

const canvas = document.getElementById('game');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas element #game not found');
}
canvas.height = CANVAS_HEIGHT_PX;
canvas.width = CANVAS_WIDTH_PX;

const context = canvas.getContext('2d');

if (context === null) {
  throw new Error('Canvas 2D context is not available');
}

const game = new Game(context);

// TODO: Use fixed timestep (accumulator) instead of raw requestAnimationFrame
function gameLoop() {
  game.update();
  game.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
