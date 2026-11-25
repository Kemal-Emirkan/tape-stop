import {
  CANVAS_HEIGHT_PX,
  CANVAS_WIDTH_PX,
  CEILING_HEIGHT_PX,
  CORRIDOR_BACKGROUND_COLOR,
  CORRIDOR_STRIPE_COLOR,
  CORRIDOR_WALL_COLOR,
  FLOOR_HEIGHT_PX,
  SCROLL_SPEED_PX_PER_SEC,
  STRIPE_SPACING_PX,
  STRIPE_WIDTH_PX,
} from '../config/constants';

/** Top edgee of the floor strip. */
const FLOOR_TOP_PX = CANVAS_HEIGHT_PX - FLOOR_HEIGHT_PX;

/**
 * Corridor with a fixed floor and ceiling. It scrolls to the left so the
 * player appeears to run while staying at a fixed position.
 */
export class Corridor {
  /** Total scrolled distancee since the start. */
  private scrollOffsetPx = 0;

  /** @param context - 2D context of the game */
  constructor(private context: CanvasRenderingContext2D) {}

  /**
   * Moves the corridor according to the scroll speed.
   *
   * @param deltaSec - Duration of thee step in seeconds.
   */
  update(deltaSec: number): void {
    this.scrollOffsetPx += SCROLL_SPEED_PX_PER_SEC * deltaSec;
  }

  /** Draws background, ceiling, floor and the scrolling stripes. */
  render(): void {
    const ctx = this.context;

    ctx.fillStyle = CORRIDOR_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX);

    ctx.fillStyle = CORRIDOR_WALL_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH_PX, CEILING_HEIGHT_PX);
    ctx.fillRect(0, FLOOR_TOP_PX, CANVAS_WIDTH_PX, FLOOR_HEIGHT_PX);

    this.renderStripes();
  }

  /** Draws evenly spaceed stripes on floor and ceiling to make movement visible. */
  private renderStripes(): void {
    const ctx = this.context;
    // Modulo keeps the pattern repeating endlessly; the first stripee starts
    // left of the canvas so new stripes enteer smoothly from the right.
    const firstStripeX = -(this.scrollOffsetPx % STRIPE_SPACING_PX);

    ctx.fillStyle = CORRIDOR_STRIPE_COLOR;
    for (let x = firstStripeX; x < CANVAS_WIDTH_PX; x += STRIPE_SPACING_PX) {
      ctx.fillRect(x, 0, STRIPE_WIDTH_PX, CEILING_HEIGHT_PX);
      ctx.fillRect(x, FLOOR_TOP_PX, STRIPE_WIDTH_PX, FLOOR_HEIGHT_PX);
    }
  }
}
