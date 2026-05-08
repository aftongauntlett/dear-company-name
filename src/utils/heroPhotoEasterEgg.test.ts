import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { initializeHeroPhotoEasterEgg } from './heroPhotoEasterEgg';

function createWindowLike(prefersReducedMotion: boolean): {
  matchMedia: (query: string) => { matches: boolean };
} {
  return {
    matchMedia: (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? prefersReducedMotion : false,
    }),
  };
}

function clickThreeTimes(element: HTMLElement): void {
  const MouseEventCtor = element.ownerDocument.defaultView?.MouseEvent;
  if (!MouseEventCtor) {
    throw new Error('MouseEvent constructor unavailable');
  }

  element.dispatchEvent(new MouseEventCtor('click', { bubbles: true }));
  element.dispatchEvent(new MouseEventCtor('click', { bubbles: true }));
  element.dispatchEvent(new MouseEventCtor('click', { bubbles: true }));
}

describe('hero photo easter egg utility', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('activates little-afon mode on triple click and types the easter-egg caption', () => {
    vi.useFakeTimers();

    const dom = new JSDOM(`<!doctype html><html><body>
      <div id="hero-img-wrap"></div>
      <div id="hero-img-container"></div>
      <span id="hero-caption-text"></span>
    </body></html>`);

    const imgWrap = dom.window.document.getElementById('hero-img-wrap');
    const imgContainer = dom.window.document.getElementById('hero-img-container');
    const captionEl = dom.window.document.getElementById('hero-caption-text');

    expect(imgWrap).not.toBeNull();
    expect(imgContainer).not.toBeNull();
    expect(captionEl).not.toBeNull();

    initializeHeroPhotoEasterEgg({
      window: createWindowLike(false),
      imgWrap: imgWrap!,
      imgContainer: imgContainer!,
      captionEl: captionEl!,
    });

    clickThreeTimes(imgWrap!);

    expect(imgContainer?.classList.contains('is-little-afton')).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(captionEl?.textContent).toBe('Still silly, just more professional now!');
  });

  it('returns to pro mode after the easter-egg duration expires', () => {
    vi.useFakeTimers();

    const dom = new JSDOM(`<!doctype html><html><body>
      <div id="hero-img-wrap"></div>
      <div id="hero-img-container"></div>
      <span id="hero-caption-text"></span>
    </body></html>`);

    const imgWrap = dom.window.document.getElementById('hero-img-wrap');
    const imgContainer = dom.window.document.getElementById('hero-img-container');
    const captionEl = dom.window.document.getElementById('hero-caption-text');

    expect(imgWrap).not.toBeNull();
    expect(imgContainer).not.toBeNull();
    expect(captionEl).not.toBeNull();

    initializeHeroPhotoEasterEgg({
      window: createWindowLike(false),
      imgWrap: imgWrap!,
      imgContainer: imgContainer!,
      captionEl: captionEl!,
    });

    clickThreeTimes(imgWrap!);

    vi.advanceTimersByTime(30_000);

    expect(imgContainer?.classList.contains('is-little-afton')).toBe(false);
    expect(captionEl?.textContent).toBe('');
  });

  it('does not bind interactions when reduced motion is enabled', () => {
    vi.useFakeTimers();

    const dom = new JSDOM(`<!doctype html><html><body>
      <div id="hero-img-wrap"></div>
      <div id="hero-img-container"></div>
      <span id="hero-caption-text"></span>
    </body></html>`);

    const imgWrap = dom.window.document.getElementById('hero-img-wrap');
    const imgContainer = dom.window.document.getElementById('hero-img-container');
    const captionEl = dom.window.document.getElementById('hero-caption-text');

    expect(imgWrap).not.toBeNull();
    expect(imgContainer).not.toBeNull();
    expect(captionEl).not.toBeNull();

    initializeHeroPhotoEasterEgg({
      window: createWindowLike(true),
      imgWrap: imgWrap!,
      imgContainer: imgContainer!,
      captionEl: captionEl!,
    });

    clickThreeTimes(imgWrap!);

    vi.runAllTimers();

    expect(imgContainer?.classList.contains('is-little-afton')).toBe(false);
    expect(captionEl?.textContent).toBe('');
  });
});