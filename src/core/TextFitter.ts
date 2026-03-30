import type { BubbleShape, ShapeDefinition, ShapeTextLayoutResult } from '../types';
import { layoutTextInShape } from './ShapeTextLayout';

/**
 * Binary search for the optimal font size that fills the shape.
 * Converges within 0.5px of the optimal size (~8-10 iterations).
 */
export function findOptimalFontSize(
  text: string,
  shape: BubbleShape | ShapeDefinition,
  width: number,
  height: number,
  fontFamily: string,
  minSize: number = 8,
  maxSize: number = 72,
): { fontSize: number; layout: ShapeTextLayoutResult } {
  let lo = minSize;
  let hi = maxSize;
  let bestLayout: ShapeTextLayoutResult | null = null;
  let bestSize = minSize;

  // Binary search: find largest font size where text fits
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    const lineHeight = mid * 1.3;

    const layout = layoutTextInShape(text, shape, width, height, {
      fontFamily,
      fontSize: mid,
      lineHeight,
    });

    if (layout.fits) {
      bestLayout = layout;
      bestSize = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // If nothing fit, use minSize
  if (!bestLayout) {
    const lineHeight = minSize * 1.3;
    bestLayout = layoutTextInShape(text, shape, width, height, {
      fontFamily,
      fontSize: minSize,
      lineHeight,
    });
    bestSize = minSize;
  }

  return { fontSize: bestSize, layout: bestLayout };
}
