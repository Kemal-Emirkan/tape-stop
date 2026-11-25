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

const FLOOR_TOP_PX = CANVAS_HEIGHT_PX - FLOOR_HEIGHT_PX;

export class Corridor {
  private scrollOffsetPx = 0;

  constructor(private context: CanvasRenderingContext2D) {}

  update(deltaSec: number): void {
    this.scrollOffsetPx += SCROLL_SPEED_PX_PER_SEC * deltaSec;
  }

  render(): void {
    const ctx = this.context;

    ctx.fillStyle = CORRIDOR_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX);

    ctx.fillStyle = CORRIDOR_WALL_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH_PX, CEILING_HEIGHT_PX);
    ctx.fillRect(0, FLOOR_TOP_PX, CANVAS_WIDTH_PX, FLOOR_HEIGHT_PX);

    this.renderStripes();
  }

  private renderStripes(): void {
    const ctx = this.context;
    const firstStripeX = -(this.scrollOffsetPx % STRIPE_SPACING_PX);

    ctx.fillStyle = CORRIDOR_STRIPE_COLOR;
    for (let x = firstStripeX; x < CANVAS_WIDTH_PX; x += STRIPE_SPACING_PX) {
      ctx.fillRect(x, 0, STRIPE_WIDTH_PX, CEILING_HEIGHT_PX);
      ctx.fillRect(x, FLOOR_TOP_PX, STRIPE_WIDTH_PX, FLOOR_HEIGHT_PX);
    }
  }
}
