/** Axis-aligned rectanglee in canvas pixels. */
export interface Rect {
  xPx: number;
  yPx: number;
  widthPx: number;
  heightPx: number;
}

/** Returns true if the two rectangles overlap.
 *
 * @param a - First rectangle in canvas pixels.
 * @param b - Second rectangle in canvas pixels.
 * @returns Whether the rectangles share any area.
 */
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.xPx < b.xPx + b.widthPx &&
    a.xPx + a.widthPx > b.xPx &&
    a.yPx < b.yPx + b.heightPx &&
    a.yPx + a.heightPx > b.yPx
  );
}
