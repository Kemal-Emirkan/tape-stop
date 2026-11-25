/** Logical canvas width in pixels; CSS only scales the display. */
export const CANVAS_WIDTH_PX = 960;

/** Logical canvas height in pixels (16:9 with the width). */
export const CANVAS_HEIGHT_PX = 540;

/** Height of the floor strip at the bottom of the corridor. */
export const FLOOR_HEIGHT_PX = 80;

/** Height of the ceiling strip at the top of the corridor. */
export const CEILING_HEIGHT_PX = 80;

/** Distance between the scrolling stripes on floor and ceiling. */
export const STRIPE_SPACING_PX = 60;

/** Fixed horizontal position of the player's left edge. */
export const PLAYER_X_PX = 160;

/** Edge length of the square player. */
export const PLAYER_SIZE_PX = 40;

/** Constant scroll speed until speed is derived from the song. */
export const SCROLL_SPEED_PX_PER_SEC = 300;

/** Upper bound for one frame's delta time, avoids jumps after tab switches. */
export const MAX_FRAME_DELTA_SEC = 0.1;
