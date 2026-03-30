import type { ShapeDefinition } from '../types';
import { ellipseShape } from './ellipse';

/**
 * Whisper bubble: same geometry as ellipse, rendered with dashed border.
 * The dashed rendering is handled by BubbleRenderer.
 */
export const whisperShape: ShapeDefinition = {
  type: 'whisper',

  getWidthAtY(y: number, height: number, maxWidth: number): number {
    return ellipseShape.getWidthAtY(y, height, maxWidth);
  },

  getPath(width: number, height: number): Path2D {
    return ellipseShape.getPath(width, height);
  },

  getInnerPadding() {
    return ellipseShape.getInnerPadding();
  },
};
