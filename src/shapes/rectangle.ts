import type { ShapeDefinition } from '../types';

const CORNER_RADIUS = 12;
const PADDING_FRACTION = 0.08;

/**
 * Rectangle with rounded corners.
 * Width is constant except near top/bottom where corners reduce usable space.
 */
export const rectangleShape: ShapeDefinition = {
  type: 'rectangle',

  getWidthAtY(y: number, height: number, maxWidth: number): number {
    const pad = maxWidth * PADDING_FRACTION;
    const baseWidth = maxWidth - 2 * pad;
    const r = Math.min(CORNER_RADIUS, maxWidth / 4, height / 4);

    // Near top edge
    if (y < r) {
      const dy = r - y;
      const inset = r - Math.sqrt(r * r - dy * dy);
      return Math.max(0, baseWidth - 2 * inset);
    }
    // Near bottom edge
    if (y > height - r) {
      const dy = y - (height - r);
      const inset = r - Math.sqrt(r * r - dy * dy);
      return Math.max(0, baseWidth - 2 * inset);
    }

    return baseWidth;
  },

  getPath(width: number, height: number): Path2D {
    const r = Math.min(CORNER_RADIUS, width / 4, height / 4);
    const path = new Path2D();
    path.roundRect(0, 0, width, height, r);
    return path;
  },

  getInnerPadding() {
    return { top: 6, right: 8, bottom: 6, left: 8 };
  },
};
