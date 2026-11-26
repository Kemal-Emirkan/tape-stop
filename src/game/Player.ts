import {
  ATTACK_COLOR,
  ATTACK_DURATION_SEC,
  ATTACK_HEIGHT_PX,
  ATTACK_RANGE_PX,
  CANVAS_HEIGHT_PX,
  FLOOR_HEIGHT_PX,
  GRAVITY_PX_PER_SEC2,
  JUMP_VELOCITY_PX_PER_SEC,
  PLAYER_COLOR,
  PLAYER_SIZE_PX,
  PLAYER_X_PX,
  SLIDE_DURATION_SEC,
  SLIDE_HEIGHT_PX,
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

  /** Vertical speed; negative means moving up. */
  private velocityYPxPerSec = 0;

  /** Remaining slide time; 0 means not sliding. */
  private slideTimeLeftSec = 0;

  /** Remaining attack time; 0 means not attacking. */
  private attackTimeLeftSec = 0;

  constructor(private context: CanvasRenderingContext2D) {}

  /** Whether the cube currently stands on the floor. */
  private get isOnGround(): boolean {
    return this.yPx >= PLAYER_GROUND_Y_PX;
  }

  /** Starts a jump; ignored while already in the air (no double jump). */
  jump(): void {
    if (!this.isOnGround) return;
    this.slideTimeLeftSec = 0;
    this.velocityYPxPerSec = -JUMP_VELOCITY_PX_PER_SEC;
  }

  /** Whether the cube is currently flattened */
  private get isSliding(): boolean {
    return this.slideTimeLeftSec > 0;
  }

  /** Starts a slide; only possible on the floor. */
  slide(): void {
    if (!this.isOnGround) return;
    this.slideTimeLeftSec = SLIDE_DURATION_SEC;
  }

  /** Whether the attack is currently active. */
  private get isAttacking(): boolean {
    return this.attackTimeLeftSec > 0;
  }

  /** Starts an attack; works on the floor and in the air. */
  attack(): void {
    this.attackTimeLeftSec = ATTACK_DURATION_SEC;
  }

  /**
   * Applies gravity and moves the cube vertically.
   *
   * @param deltaSec - Duration of the step in seconds.
   */
  update(deltaSec: number): void {
    this.slideTimeLeftSec = Math.max(0, this.slideTimeLeftSec - deltaSec);
    this.attackTimeLeftSec = Math.max(0, this.attackTimeLeftSec - deltaSec);

    if (this.isOnGround && this.velocityYPxPerSec >= 0) return;

    this.velocityYPxPerSec += GRAVITY_PX_PER_SEC2 * deltaSec;
    this.yPx += this.velocityYPxPerSec * deltaSec;

    // Snap to the floor so the cube never sinks into it after landing.
    if (this.yPx >= PLAYER_GROUND_Y_PX) {
      this.yPx = PLAYER_GROUND_Y_PX;
      this.velocityYPxPerSec = 0;
    }
  }

  /** Draws the player at its current height, plus the attack if active. */
  render(): void {
    const heightPx = this.isSliding ? SLIDE_HEIGHT_PX : PLAYER_SIZE_PX;
    const topPx = this.yPx + PLAYER_SIZE_PX - heightPx;
    this.context.fillStyle = PLAYER_COLOR;
    this.context.fillRect(PLAYER_X_PX, topPx, PLAYER_SIZE_PX, heightPx);

    if (this.isAttacking) {
      const centerYPx = topPx + heightPx / 2;
      this.context.fillStyle = ATTACK_COLOR;
      this.context.fillRect(
        PLAYER_X_PX + PLAYER_SIZE_PX,
        centerYPx - ATTACK_HEIGHT_PX / 2,
        ATTACK_RANGE_PX,
        ATTACK_HEIGHT_PX,
      );
    }
  }
}
