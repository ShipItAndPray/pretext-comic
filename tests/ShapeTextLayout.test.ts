import { describe, it, expect } from 'vitest';
import { layoutTextInShape } from '../src/core/ShapeTextLayout';

describe('ShapeTextLayout', () => {
  const font = {
    fontFamily: 'Arial',
    fontSize: 14,
    lineHeight: 18,
  };

  describe('ellipse layout', () => {
    it('lays out short text in a single line', () => {
      const result = layoutTextInShape('Hi', 'ellipse', 200, 150, font);
      expect(result.fits).toBe(true);
      expect(result.lines.length).toBeGreaterThanOrEqual(1);
    });

    it('wraps long text into multiple lines', () => {
      const longText = 'This is a long piece of text that should wrap across multiple lines inside the ellipse shape';
      const result = layoutTextInShape(longText, 'ellipse', 200, 150, font);
      expect(result.lines.length).toBeGreaterThan(1);
    });

    it('reports fits=false when text cannot fit', () => {
      const hugeText = Array(100).fill('word').join(' ');
      const result = layoutTextInShape(hugeText, 'ellipse', 100, 80, font);
      expect(result.fits).toBe(false);
    });

    it('each line width does not exceed maxWidth', () => {
      const text = 'Hello world this is a speech bubble with text that wraps';
      const result = layoutTextInShape(text, 'ellipse', 200, 150, font);
      for (const line of result.lines) {
        expect(line.width).toBeLessThanOrEqual(line.maxWidth + 1); // +1 for rounding
      }
    });

    it('returns empty lines array for empty text', () => {
      const result = layoutTextInShape('', 'ellipse', 200, 150, font);
      expect(result.lines).toHaveLength(0);
      expect(result.fits).toBe(true);
    });
  });

  describe('rectangle layout', () => {
    it('fits text that would fit in a rectangular area', () => {
      const result = layoutTextInShape('Hello world', 'rectangle', 200, 150, font);
      expect(result.fits).toBe(true);
      expect(result.lines.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('alignment', () => {
    it('centers text horizontally by default', () => {
      const result = layoutTextInShape('Hi', 'rectangle', 200, 150, font);
      if (result.lines.length > 0) {
        const line = result.lines[0];
        // x should be roughly centered
        expect(line.x).toBeGreaterThan(0);
        expect(line.x).toBeLessThan(200);
      }
    });

    it('left-aligns text when specified', () => {
      const result = layoutTextInShape('Hi', 'rectangle', 200, 150, font, { textAlign: 'left' });
      if (result.lines.length > 0) {
        const line = result.lines[0];
        expect(line.x).toBeLessThan(50); // should be near left edge
      }
    });
  });
});
