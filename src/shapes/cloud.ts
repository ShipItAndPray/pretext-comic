import type { ShapeDefinition } from '../types';

/**
 * Cloud/fluffy bubble shape.
 * Based on an ellipse with scalloped edges (overlapping circles along perimeter).
 * Usable width = ellipse width * 0.85 (scallops eat into space).
 */
export const cloudShape: ShapeDefinition = {
  type: 'cloud',

  getWidthAtY(y: number, height: number, maxWidth: number): number {
    const a = maxWidth / 2;
    const b = height / 2;
    const dy = y - b;
    const ratio = dy / b;
    if (Math.abs(ratio) >= 1) return 0;
    const ellipseWidth = 2 * a * Math.sqrt(1 - ratio * ratio);
    // Scallops reduce usable area to ~60% (ellipse already tight)
    return ellipseWidth * 0.60;
  },

  getPath(width: number, height: number): Path2D {
    const path = new Path2D();
    const cx = width / 2;
    const cy = height / 2;
    const numBumps = 12;
    const rx = width / 2;
    const ry = height / 2;
    const bumpRadius = Math.min(rx, ry) * 0.3;

    for (let i = 0; i < numBumps; i++) {
      const angle = (i / numBumps) * Math.PI * 2;
      const bx = cx + rx * 0.85 * Math.cos(angle);
      const by = cy + ry * 0.85 * Math.sin(angle);
      path.moveTo(bx + bumpRadius, by);
      path.arc(bx, by, bumpRadius, 0, Math.PI * 2);
    }

    // Inner ellipse fill
    path.ellipse(cx, cy, rx * 0.75, ry * 0.75, 0, 0, Math.PI * 2);
    return path;
  },

  getInnerPadding() {
    return { top: 8, right: 8, bottom: 8, left: 8 };
  },
};
