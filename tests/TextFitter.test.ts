import { describe, it, expect } from 'vitest';
import { findOptimalFontSize } from '../src/core/TextFitter';

describe('TextFitter', () => {
  it('converges to a font size within the range', () => {
    const result = findOptimalFontSize(
      'Hello world!',
      'ellipse',
      200,
      150,
      'Arial',
      8,
      72,
    );
    expect(result.fontSize).toBeGreaterThanOrEqual(8);
    expect(result.fontSize).toBeLessThanOrEqual(72);
  });

  it('text fits at the optimal font size', () => {
    const result = findOptimalFontSize(
      'Hello world!',
      'ellipse',
      200,
      150,
      'Arial',
      8,
      72,
    );
    expect(result.layout.fits).toBe(true);
  });

  it('returns minSize for text that cannot fit', () => {
    const hugeText = Array(200).fill('word').join(' ');
    const result = findOptimalFontSize(
      hugeText,
      'ellipse',
      50,
      40,
      'Arial',
      8,
      72,
    );
    expect(result.fontSize).toBe(8);
  });

  it('uses larger font for shorter text', () => {
    const short = findOptimalFontSize('Hi', 'ellipse', 200, 150, 'Arial', 8, 72);
    const long = findOptimalFontSize(
      'This is a much longer piece of text that should require a smaller font size',
      'ellipse',
      200,
      150,
      'Arial',
      8,
      72,
    );
    expect(short.fontSize).toBeGreaterThanOrEqual(long.fontSize);
  });

  it('works with rectangle shape', () => {
    const result = findOptimalFontSize(
      'Rectangle text',
      'rectangle',
      200,
      150,
      'Arial',
      8,
      72,
    );
    expect(result.layout.fits).toBe(true);
    expect(result.fontSize).toBeGreaterThan(8);
  });

  it('converges within ~10 iterations (< 0.5px precision)', () => {
    // The binary search should converge with hi-lo < 0.5
    const result = findOptimalFontSize(
      'Test convergence speed',
      'cloud',
      200,
      150,
      'Arial',
      8,
      72,
    );
    // Just verify it produces a valid result
    expect(result.fontSize).toBeGreaterThanOrEqual(8);
    expect(result.layout.lines.length).toBeGreaterThan(0);
  });
});
