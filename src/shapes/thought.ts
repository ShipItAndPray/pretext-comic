import type { ShapeDefinition } from '../types';
import { cloudShape } from './cloud';

/**
 * Thought bubble: same as cloud shape for the main body.
 * The tail is a trail of 3-4 decreasing circles (rendered by tailGenerator).
 */
export const thoughtShape: ShapeDefinition = {
  type: 'thought',

  getWidthAtY(y: number, height: number, maxWidth: number): number {
    return cloudShape.getWidthAtY(y, height, maxWidth);
  },

  getPath(width: number, height: number): Path2D {
    return cloudShape.getPath(width, height);
  },

  getInnerPadding() {
    return cloudShape.getInnerPadding();
  },
};
