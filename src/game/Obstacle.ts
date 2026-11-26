import {
  CANVAS_HEIGHT_PX,
  CEILING_HEIGHT_PX,
  CEILING_OBSTACLE_COLOR,
  CEILING_OBSTACLE_GAP_PX,
  FLOOR_HEIGHT_PX,
  FLOOR_OBSTACLE_COLOR,
  FLOOR_OBSTACLE_HEIGHT_PX,
  MIDDLE_OBSTACLE_COLOR,
  MIDDLE_OBSTACLE_GAP_PX,
  MIDDLE_OBSTACLE_HEIGHT_PX,
  OBSTACLE_HIT_COLOR,
  OBSTACLE_WIDTH_PX,
  PLAYER_X_PX,
  SCROLL_SPEED_PX_PER_SEC,
} from '../config/constants';
import type { ObstacleType } from '../config/testLevel';
import type { Rect } from './collision';

/** Top edge of the floor strip. */
const FLOOR_TOP_PX = CANVAS_HEIGHT_PX - FLOOR_HEIGHT_PX;

/** Vertical placement and color per obstacle type. */
const SHAPES: Record<ObstacleType, { yPx: number; heightPx: number; color: string }> = {
  floor: {
    yPx: FLOOR_TOP_PX - FLOOR_OBSTACLE_HEIGHT_PX,
    heightPx: FLOOR_OBSTACLE_HEIGHT_PX,
    color: FLOOR_OBSTACLE_COLOR,
  },
  ceiling: {
    yPx: CEILING_HEIGHT_PX,
    heightPx: FLOOR_TOP_PX - CEILING_OBSTACLE_GAP_PX - CEILING_HEIGHT_PX,
    color: CEILING_OBSTACLE_COLOR,
  },
  middle: {
    yPx: FLOOR_TOP_PX - MIDDLE_OBSTACLE_GAP_PX - MIDDLE_OBSTACLE_HEIGHT_PX,
    heightPx: MIDDLE_OBSTACLE_HEIGHT_PX,
    color: MIDDLE_OBSTACLE_COLOR,
  },
};

/** A single obstacle whose position is derived from the game time. */
export class Obstacle {
  /** Destroyed by an attack; only possible for mid targets. */
  isDestroyed = false;

  /** Already hit the player once, so it never counts twice. */
  hasHit = false;

  /**
   * @param type - Which action the player needs.
   * @param timeSec - Game time at which the obstacle reaches the player.
   * @param context - 2D context of game canvas.
   */
  constructor(
    readonly type: ObstacleType,
    readonly timeSec: number,
    private context: CanvasRenderingContext2D,
  ) {}

  /**
   * Computes the obstacle's rectangle at a given game time.
   *
   * @param nowSec - Current game time in seconds.
   * @returns Rectangle in canvas pixels.
   */
  getRect(nowSec: number): Rect {
    const shape = SHAPES[this.type];
    return {
      // Position depends on time, not on accumulated scrolling: at timeSec it is exactly at the player.
      xPx: PLAYER_X_PX + (this.timeSec - nowSec) * SCROLL_SPEED_PX_PER_SEC,
      yPx: shape.yPx,
      widthPx: OBSTACLE_WIDTH_PX,
      heightPx: shape.heightPx,
    };
  }
  /**
   * Draws the obstacle; red once it has hit the player.
   *
   * @param nowSec - Current game time in seconds.
   */
  render(nowSec: number): void {
    const rect = this.getRect(nowSec);
    this.context.fillStyle = this.hasHit ? OBSTACLE_HIT_COLOR : SHAPES[this.type].color;
    this.context.fillRect(rect.xPx, rect.yPx, rect.widthPx, rect.heightPx);
  }
}
