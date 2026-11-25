import {
  CANVAS_HEIGHT_PX,
  FLOOR_HEIGHT_PX,
  PLAYER_COLOR,
  PLAYER_SIZE_PX,
  PLAYER_X_PX,
} from '../config/constants';

const PLAYER_GROUND_Y_PX = CANVAS_HEIGHT_PX - FLOOR_HEIGHT_PX - PLAYER_SIZE_PX;

export class Player {
  constructor(private context: CanvasRenderingContext2D) {}

  render(): void {
    this.context.fillStyle = PLAYER_COLOR;
    this.context.fillRect(PLAYER_X_PX, PLAYER_GROUND_Y_PX, PLAYER_SIZE_PX, PLAYER_SIZE_PX);
  }
}
