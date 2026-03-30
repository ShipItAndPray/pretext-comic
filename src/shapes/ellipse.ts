import type { ShapeDefinition } from '../types';

/**
 * Ellipse shape: width at Y = 2a * sqrt(1 - ((y-b)/b)^2)
 * where a = width/2, b = height/2.
 */
export const ellipseShape: ShapeDefinition = {
  type: 'ellipse',

  getWidthAtY(y: number, height: number, maxWidth: number): number {
    const a = maxWidth / 2;
    const b = height / 2;
    const dy = y - b;
    const ratio = dy / b;
    if (Math.abs(ratio) >= 1) return 0;
    // Subtract 15% padding on each side
    const rawWidth = 2 * a * Math.sqrt(1 - ratio * ratio);
    return rawWidth * 0.7; // 15% padding each side = 70% usable
  },

  getPath(width: number, height: number): Path2D {
    const path = new Path2D();
    path.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    return path;
  },

  getInnerPadding() {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  },
};
