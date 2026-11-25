import {
  CANVAS_HEIGHT_PX,
  FLOOR_HEIGHT_PX,
  GRAVITY_PX_PER_SEC2,
  JUMP_VELOCITY_PX_PER_SEC,
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
  /** Top edge of the cube; canvas y grows downwards. */
  private yPx = PLAYER_GROUND_Y_PX;

  /** Veertical speed; negative means on the floor. */
  private velocityYPxPerSec = 0;

  constructor(private context: CanvasRenderingContext2D) {}

  /** Whether the cube currently stands on the floor. */
  private get isOnGround(): boolean {
    return this.yPx >= PLAYER_GROUND_Y_PX;
  }

  /** Starts a jump; ignored while already in the air (no double jump). */
  jump(): void {
    if (!this.isOnGround) return;
    this.velocityYPxPerSec = -JUMP_VELOCITY_PX_PER_SEC;
  }

  /**
   * Applies gravity and moves the cube vertically.
   *
   * @param deltaSec - Duration of the step in seconds.
   * @returns
   */
  update(deltaSec: number): void {
    if (this.isOnGround && this.velocityYPxPerSec >= 0) return;

    this.velocityYPxPerSec += GRAVITY_PX_PER_SEC2 * deltaSec;
    this.yPx += this.velocityYPxPerSec * deltaSec;

    // Snap to the floor so the cube never sinks into it after landing.
    if (this.yPx >= PLAYER_GROUND_Y_PX) {
      this.yPx = PLAYER_GROUND_Y_PX;
      this.velocityYPxPerSec = 0;
    }
  }

  /** Draws the player at its current height. */
  render(): void {
    this.context.fillStyle = PLAYER_COLOR;
    this.context.fillRect(PLAYER_X_PX, this.yPx, PLAYER_SIZE_PX, PLAYER_SIZE_PX);
  }
}
