import { STRINGS } from '../config/strings';

const MENU_ID = 'pause-menu';
const TITLE_ID = 'pause-title';
const RESUME_BUTTON_ID = 'pause-resume';

/** Overlay shown on top of the canvas while the game is paused. */
export class PauseMenu {
  private menu: HTMLElement;
  private resumeButton: HTMLButtonElement;

  /**
   * Looks up the menu elements, fills in their texts and wires the buttons.
   *
   * @param onResume - Called when player clicks the resume button.
   */
  constructor(onResume: () => void) {
    const menu = document.getElementById(MENU_ID);
    const title = document.getElementById(TITLE_ID);
    const resumeButton = document.getElementById(RESUME_BUTTON_ID);

    if (menu === null || title === null || !(resumeButton instanceof HTMLButtonElement)) {
      throw new Error('Pause menu elements not found');
    }

    this.menu = menu;
    this.resumeButton = resumeButton;

    title.textContent = STRINGS.pauseTitle;
    this.resumeButton.textContent = STRINGS.pauseResume;
    this.resumeButton.addEventListener('click', onResume);
  }

  /** Makes the menu visible. */
  show(): void {
    this.menu.hidden = false;
  }

  /** Hides the menu and drops focus, so Space/Enter can't trigger the hidden button. */
  hide(): void {
    this.menu.hidden = true;
    this.resumeButton.blur();
  }
}
