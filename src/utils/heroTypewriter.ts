interface HeroWindowLike {
  matchMedia: (query: string) => {
    matches: boolean;
  };
}

interface InitializeHeroTypewriterInput {
  window: HeroWindowLike;
  section: HTMLElement;
  targetEl: HTMLElement;
}

const TYPE_SPEED = 70;
const ERASE_SPEED = 45;
const INITIAL_DELAY = 500;
const PAUSE_ON_JOKE = 1400;
const RETYPE_DELAY = 200;

export function initializeHeroTypewriter(input: InitializeHeroTypewriterInput): void {
  const { window, section, targetEl } = input;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const placeholder = targetEl.dataset.placeholder ?? 'Company';
  const finalTarget = targetEl.dataset.target ?? '';

  const markDone = (): void => {
    section.classList.add('hero--done');
  };

  const typeChars = (text: string, onDone: () => void): void => {
    let index = 0;
    const tick = (): void => {
      if (index < text.length) {
        targetEl.textContent = text.slice(0, ++index);
        setTimeout(tick, TYPE_SPEED);
      } else {
        onDone();
      }
    };
    tick();
  };

  const eraseChars = (onDone: () => void): void => {
    const tick = (): void => {
      const current = targetEl.textContent ?? '';
      if (current.length > 0) {
        targetEl.textContent = current.slice(0, -1);
        setTimeout(tick, ERASE_SPEED);
      } else {
        onDone();
      }
    };
    tick();
  };

  // Sequence: wait -> type joke -> pause -> erase -> type real name -> done.
  setTimeout(() => {
    typeChars(placeholder, () => {
      setTimeout(() => {
        eraseChars(() => {
          setTimeout(() => {
            typeChars(finalTarget, markDone);
          }, RETYPE_DELAY);
        });
      }, PAUSE_ON_JOKE);
    });
  }, INITIAL_DELAY);
}