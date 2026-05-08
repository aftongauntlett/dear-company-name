import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { initializeHeroTypewriter } from './heroTypewriter';

function createWindowLike(prefersReducedMotion: boolean): {
  matchMedia: (query: string) => { matches: boolean };
} {
  return {
    matchMedia: (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? prefersReducedMotion : false,
    }),
  };
}

describe('hero typewriter utility', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs the full placeholder -> erase -> final sequence and marks the hero done', () => {
    vi.useFakeTimers();

    const dom = new JSDOM(`<!doctype html><html><body>
      <section class="hero"></section>
      <span class="typewriter-target" data-placeholder="Company" data-target="Booz Allen"></span>
    </body></html>`);

    const section = dom.window.document.querySelector<HTMLElement>('.hero');
    const targetEl = dom.window.document.querySelector<HTMLElement>('.typewriter-target');

    expect(section).not.toBeNull();
    expect(targetEl).not.toBeNull();

    initializeHeroTypewriter({
      window: createWindowLike(false),
      section: section!,
      targetEl: targetEl!,
    });

    vi.runAllTimers();

    expect(targetEl?.textContent).toBe('Booz Allen');
    expect(section?.classList.contains('hero--done')).toBe(true);
  });

  it('does not start animation when reduced motion is enabled', () => {
    vi.useFakeTimers();

    const dom = new JSDOM(`<!doctype html><html><body>
      <section class="hero"></section>
      <span class="typewriter-target" data-placeholder="Company" data-target="Stripe"></span>
    </body></html>`);

    const section = dom.window.document.querySelector<HTMLElement>('.hero');
    const targetEl = dom.window.document.querySelector<HTMLElement>('.typewriter-target');

    expect(section).not.toBeNull();
    expect(targetEl).not.toBeNull();

    initializeHeroTypewriter({
      window: createWindowLike(true),
      section: section!,
      targetEl: targetEl!,
    });

    vi.runAllTimers();

    expect(targetEl?.textContent).toBe('');
    expect(section?.classList.contains('hero--done')).toBe(false);
  });
});