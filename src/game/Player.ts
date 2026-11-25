import {
  CANVAS_HEIGHT_PX,
  FLOOR_HEIGHT_PX,
  PLAYER_COLOR,
  PLAYER_SIZE_PX,
  PLAYER_X_PX,
} from '../config/constants';

/** Top edge of the player while standing on the floor. */
const PLAYER_GROUND_Y_PX = CANVAS_HEIGHT_PX - FLOOR_HEIGHT_PX - PLAYER_SIZE_PX;

/**
 * Player cube. It always stays at the same x position; the world
 * moves towards it instead.
 */
export class Player {
  constructor(private context: CanvasRenderingContext2D) {}

  /** Draws thhe player standing on the floor. */
  render(): void {
    this.context.fillStyle = PLAYER_COLOR;
    this.context.fillRect(PLAYER_X_PX, PLAYER_GROUND_Y_PX, PLAYER_SIZE_PX, PLAYER_SIZE_PX);
  }
}
