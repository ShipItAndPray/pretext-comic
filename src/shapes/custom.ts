import type { ShapeDefinition } from '../types';

/**
 * Custom shape from an SVG path string.
 * Rasterizes the path to determine width at each Y position.
 */
export function createCustomShape(svgPathData: string): ShapeDefinition {
  // Cache the rasterized bitmap per (width, height) pair
  const widthCache = new Map<string, Float32Array>();

  function rasterizeWidths(width: number, height: number): Float32Array {
    const key = `${width}x${height}`;
    const cached = widthCache.get(key);
    if (cached) return cached;

    const widths = new Float32Array(height);

    // Use OffscreenCanvas if available, otherwise return zero widths
    if (typeof OffscreenCanvas === 'undefined') {
      widthCache.set(key, widths);
      return widths;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      widthCache.set(key, widths);
      return widths;
    }

    const path = new Path2D(svgPathData);
    ctx.fillStyle = '#000';
    ctx.fill(path);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let row = 0; row < height; row++) {
      let leftmost = width;
      let rightmost = -1;
      for (let col = 0; col < width; col++) {
        const idx = (row * width + col) * 4;
        if (data[idx + 3] > 0) {
          if (col < leftmost) leftmost = col;
          if (col > rightmost) rightmost = col;
        }
      }
      widths[row] = rightmost >= leftmost ? rightmost - leftmost : 0;
    }

    widthCache.set(key, widths);
    return widths;
  }

  return {
    type: 'custom',

    getWidthAtY(y: number, height: number, maxWidth: number): number {
      const widths = rasterizeWidths(maxWidth, height);
      const row = Math.round(y);
      if (row < 0 || row >= height) return 0;
      return widths[row] * 0.9; // 5% padding each side
    },

    getPath(width: number, height: number): Path2D {
      // Scale the SVG path to fit the target dimensions
      // The caller should provide a path already sized, or we return as-is
      return new Path2D(svgPathData);
    },

    getInnerPadding() {
      return { top: 4, right: 4, bottom: 4, left: 4 };
    },
  };
}
