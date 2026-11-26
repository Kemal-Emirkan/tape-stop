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

/** Width of a single scrolling stripe on floor and ceiling. */
export const STRIPE_WIDTH_PX = 20;

/** Corridor background between floor and ceiling. */
export const CORRIDOR_BACKGROUND_COLOR = '#1e1e2e';

/** Fill color of floor and ceiling. */
export const CORRIDOR_WALL_COLOR = '#45475a';

/** Color of the scrolling stripes that make movement visible. */
export const CORRIDOR_STRIPE_COLOR = '#585b70';

/** Duration of one fixed simulation step (60 updates per second). */
export const FIXED_STEP_SEC = 1 / 60;

/** Upper bound for elapsed time per frame, prevents a spiral of death after tab switches. */
export const MAX_FRAME_TIME_SEC = 0.25;

/** Fill color of the player cube. */
export const PLAYER_COLOR = '#f38ba8';

/** Downward acceleration while the player is in the air. */
export const GRAVITY_PX_PER_SEC2 = 2400;

/** Upward start speed of a jump. Peak height is v² / (2 * g) = 133 px. */
export const JUMP_VELOCITY_PX_PER_SEC = 800;

/** How long a slide lasts after pressing the key once. */
export const SLIDE_DURATION_SEC = 0.5;

/** Height of the flattened cube while sliding. */
export const SLIDE_HEIGHT_PX = 20;

/** How long the attack stays visible after pressing the key once. */
export const ATTACK_DURATION_SEC = 0.2;

/** Reach of the attack in front of the cube. */
export const ATTACK_RANGE_PX = 40;

/** Height of the attack area, centered on the cube. */
export const ATTACK_HEIGHT_PX = 16;

/** Fill color of the attack area. */
export const ATTACK_COLOR = '#f9e2af';

/** Width of every obstacle, same as the player. */
export const OBSTACLE_WIDTH_PX = 40;

/** Height of floor obstacles; well below the jump peak of ~133 px. */
export const FLOOR_OBSTACLE_HEIGHT_PX = 50;

/** Free space between a ceiling obstacle and the floor; fits a sliding but not a standing cube. */
export const CEILING_OBSTACLE_GAP_PX = 30;

/** Edge length of the square mid-height target. */
export const MIDDLE_OBSTACLE_SIZE_PX = 40;

/** Fill color of obstacles on the floor (jump). */
export const FLOOR_OBSTACLE_COLOR = '#89b4fa';

/** Fill color of obstacles hanging from the ceiling (slide). */
export const CEILING_OBSTACLE_COLOR = '#a6e3a1';

/** Fill color of destructible targets at mid height (attack). */
export const MIDDLE_OBSTACLE_COLOR = '#cba6f7';

/** Fill color of an obstacle after it hit the player. */
export const OBSTACLE_HIT_COLOR = '#d20f39';
