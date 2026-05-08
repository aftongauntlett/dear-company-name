interface HeroWindowLike {
  matchMedia: (query: string) => {
    matches: boolean;
  };
}

interface InitializeHeroPhotoEasterEggInput {
  window: HeroWindowLike;
  imgWrap: HTMLElement;
  imgContainer: HTMLElement;
  captionEl: HTMLElement;
}

const PRO_CAPTION =
  'This is my super professional headshot that AI glamourized. Click the image 3 times to get a glimpse of my personality.';
const LITTLE_CAPTION = 'Still silly, just more professional now!';
const TYPE_SPEED = 40;
const ERASE_SPEED = 18;
const CLICK_RESET_DELAY = 2000;
const RETURN_DELAY = 800;
const EASTER_EGG_DURATION = 20_000;

export function initializeHeroPhotoEasterEgg(input: InitializeHeroPhotoEasterEggInput): void {
  const { window, imgWrap, imgContainer, captionEl } = input;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  let isEasterEggActive = false;
  let isHovering = false;
  let clickCount = 0;
  let clickResetTimer: ReturnType<typeof setTimeout> | null = null;
  let fadeBackTimer: ReturnType<typeof setTimeout> | null = null;

  const stopTimer = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const typeText = (targetText: string, onDone?: () => void): void => {
    captionEl.classList.add('is-active');
    const tick = (): void => {
      const current = captionEl.textContent ?? '';
      if (current.length < targetText.length) {
        captionEl.textContent = targetText.slice(0, current.length + 1);
        timer = setTimeout(tick, TYPE_SPEED);
      } else {
        onDone?.();
      }
    };
    tick();
  };

  const eraseText = (onDone?: () => void): void => {
    captionEl.classList.add('is-active');
    const tick = (): void => {
      const current = captionEl.textContent ?? '';
      if (current.length > 0) {
        captionEl.textContent = current.slice(0, -1);
        timer = setTimeout(tick, ERASE_SPEED);
      } else {
        captionEl.classList.remove('is-active');
        onDone?.();
      }
    };
    tick();
  };

  const resetClickWindow = (): void => {
    if (clickResetTimer !== null) {
      clearTimeout(clickResetTimer);
    }
    clickResetTimer = setTimeout(() => {
      clickCount = 0;
    }, CLICK_RESET_DELAY);
  };

  const returnToPro = (): void => {
    if (fadeBackTimer !== null) {
      clearTimeout(fadeBackTimer);
      fadeBackTimer = null;
    }

    imgContainer.classList.remove('is-little-afton');
    setTimeout(() => {
      stopTimer();
      eraseText(() => {
        isEasterEggActive = false;
        if (isHovering) {
          typeText(PRO_CAPTION);
        }
      });
    }, RETURN_DELAY);
  };

  imgWrap.addEventListener('mouseenter', () => {
    isHovering = true;
    if (isEasterEggActive) {
      return;
    }

    stopTimer();

    const current = captionEl.textContent ?? '';
    if (current.length > 0 && !PRO_CAPTION.startsWith(current)) {
      captionEl.textContent = '';
    }

    typeText(PRO_CAPTION);
  });

  imgWrap.addEventListener('mouseleave', () => {
    isHovering = false;
    if (isEasterEggActive) {
      return;
    }

    stopTimer();
    eraseText();
  });

  imgWrap.addEventListener('click', () => {
    if (isEasterEggActive) {
      clickCount++;
      resetClickWindow();

      if (clickCount >= 3) {
        clickCount = 0;
        if (clickResetTimer !== null) {
          clearTimeout(clickResetTimer);
          clickResetTimer = null;
        }
        returnToPro();
      }
      return;
    }

    clickCount++;
    resetClickWindow();

    if (clickCount >= 3) {
      clickCount = 0;
      if (clickResetTimer !== null) {
        clearTimeout(clickResetTimer);
        clickResetTimer = null;
      }

      isEasterEggActive = true;
      stopTimer();
      imgContainer.classList.add('is-little-afton');

      captionEl.textContent = '';
      typeText(LITTLE_CAPTION);

      if (fadeBackTimer !== null) {
        clearTimeout(fadeBackTimer);
      }
      fadeBackTimer = setTimeout(returnToPro, EASTER_EGG_DURATION);
    }
  });
}