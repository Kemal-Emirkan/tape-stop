import {
  CANVAS_HEIGHT_PX,
  CANVAS_WIDTH_PX,
  FIXED_STEP_SEC,
  MAX_FRAME_TIME_SEC,
} from './config/constants';
import { Game } from './game/Game';

const MS_PER_SEC = 1000;

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

let lastTimeSec = performance.now() / MS_PER_SEC;
let accumulatorSec = 0;

function frame(nowMs: number): void {
  const nowSec = nowMs / MS_PER_SEC;
  accumulatorSec += Math.min(nowSec - lastTimeSec, MAX_FRAME_TIME_SEC);
  lastTimeSec = nowSec;

  while (accumulatorSec >= FIXED_STEP_SEC) {
    game.update(FIXED_STEP_SEC);
    accumulatorSec -= FIXED_STEP_SEC;
  }
  game.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
