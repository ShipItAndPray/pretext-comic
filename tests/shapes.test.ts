import { describe, it, expect } from 'vitest';
import { ellipseShape } from '../src/shapes/ellipse';
import { rectangleShape } from '../src/shapes/rectangle';
import { cloudShape } from '../src/shapes/cloud';
import { thoughtShape } from '../src/shapes/thought';
import { shoutShape } from '../src/shapes/shout';
import { whisperShape } from '../src/shapes/whisper';

describe('Ellipse shape', () => {
  const w = 200;
  const h = 150;

  it('returns 0 width at top edge (y=0)', () => {
    expect(ellipseShape.getWidthAtY(0, h, w)).toBe(0);
  });

  it('returns 0 width at bottom edge (y=height)', () => {
    expect(ellipseShape.getWidthAtY(h, h, w)).toBe(0);
  });

  it('returns maximum width at center (y=height/2)', () => {
    const widthAtCenter = ellipseShape.getWidthAtY(h / 2, h, w);
    expect(widthAtCenter).toBeGreaterThan(0);
    // Center should be the widest point
    expect(widthAtCenter).toBeCloseTo(w * 0.7, 0);
  });

  it('is symmetric around center', () => {
    const quarter = ellipseShape.getWidthAtY(h * 0.25, h, w);
    const threeQuarter = ellipseShape.getWidthAtY(h * 0.75, h, w);
    expect(quarter).toBeCloseTo(threeQuarter, 5);
  });

  it('width increases from top to center', () => {
    const w1 = ellipseShape.getWidthAtY(h * 0.1, h, w);
    const w2 = ellipseShape.getWidthAtY(h * 0.3, h, w);
    const w3 = ellipseShape.getWidthAtY(h * 0.5, h, w);
    expect(w2).toBeGreaterThan(w1);
    expect(w3).toBeGreaterThan(w2);
  });

  it('generates a valid Path2D', () => {
    const path = ellipseShape.getPath(w, h);
    expect(path).toBeInstanceOf(Path2D);
  });
});

describe('Rectangle shape', () => {
  const w = 200;
  const h = 150;

  it('returns constant width in the middle area', () => {
    const w1 = rectangleShape.getWidthAtY(h * 0.3, h, w);
    const w2 = rectangleShape.getWidthAtY(h * 0.5, h, w);
    const w3 = rectangleShape.getWidthAtY(h * 0.7, h, w);
    expect(w1).toBe(w2);
    expect(w2).toBe(w3);
  });

  it('returns positive width everywhere inside', () => {
    for (let y = 1; y < h - 1; y++) {
      expect(rectangleShape.getWidthAtY(y, h, w)).toBeGreaterThan(0);
    }
  });

  it('width near corners is less than or equal to center width', () => {
    const centerW = rectangleShape.getWidthAtY(h / 2, h, w);
    const topW = rectangleShape.getWidthAtY(2, h, w);
    expect(topW).toBeLessThanOrEqual(centerW);
  });
});

describe('Cloud shape', () => {
  const w = 200;
  const h = 150;

  it('returns 0 at edges', () => {
    expect(cloudShape.getWidthAtY(0, h, w)).toBe(0);
    expect(cloudShape.getWidthAtY(h, h, w)).toBe(0);
  });

  it('returns max width at center, narrower than ellipse', () => {
    const cloudW = cloudShape.getWidthAtY(h / 2, h, w);
    const ellipseW = ellipseShape.getWidthAtY(h / 2, h, w);
    expect(cloudW).toBeGreaterThan(0);
    expect(cloudW).toBeLessThan(ellipseW);
  });
});

describe('Thought shape', () => {
  it('delegates to cloud shape', () => {
    const w = 200;
    const h = 150;
    expect(thoughtShape.getWidthAtY(h / 2, h, w)).toBe(cloudShape.getWidthAtY(h / 2, h, w));
  });
});

describe('Shout shape', () => {
  const w = 200;
  const h = 150;

  it('returns 0 at edges', () => {
    expect(shoutShape.getWidthAtY(0, h, w)).toBe(0);
    expect(shoutShape.getWidthAtY(h, h, w)).toBe(0);
  });

  it('has positive width at center', () => {
    expect(shoutShape.getWidthAtY(h / 2, h, w)).toBeGreaterThan(0);
  });

  it('has sinusoidal variation (width varies along Y)', () => {
    const widths = [];
    for (let y = h * 0.3; y < h * 0.7; y += 1) {
      widths.push(shoutShape.getWidthAtY(y, h, w));
    }
    // Not all widths should be equal (sinusoidal variation)
    const unique = new Set(widths.map((w) => w.toFixed(2)));
    expect(unique.size).toBeGreaterThan(1);
  });
});

describe('Whisper shape', () => {
  it('has same geometry as ellipse', () => {
    const w = 200;
    const h = 150;
    for (let y = 0; y <= h; y += 10) {
      expect(whisperShape.getWidthAtY(y, h, w)).toBe(ellipseShape.getWidthAtY(y, h, w));
    }
  });
});
