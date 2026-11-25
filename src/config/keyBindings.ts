/** Actions the player can trigger with the keyboard. */
export type PlayerAction = 'jump' | 'slide' | 'attack';

/**
 * Keyboard bindings per player action, as KeyboardEvent.code values.
 * 'code' is layout-independent, so D/F/G stay in the same physical place
 * on QWERTZ, QWERTY and AZERTY keyboards.
 */
export const KEY_BINDINGS: Readonly<Record<PlayerAction, string>> = {
  jump: 'KeyF',
  slide: 'KeyD',
  attack: 'KeyG',
};
