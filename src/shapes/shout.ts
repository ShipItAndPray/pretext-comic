import type { ShapeDefinition } from '../types';

const SPIKE_FREQUENCY = 8;

/**
 * Shout/starburst bubble.
 * Width varies sinusoidally along Y, creating a spiky effect.
 */
export const shoutShape: ShapeDefinition = {
  type: 'shout',

  getWidthAtY(y: number, height: number, maxWidth: number): number {
    const a = maxWidth / 2;
    const b = height / 2;
    const dy = y - b;
    const ratio = dy / b;
    if (Math.abs(ratio) >= 1) return 0;
    const baseWidth = 2 * a * Math.sqrt(1 - ratio * ratio);
    // Sinusoidal variation: spikes reduce usable width
    const spikeFactor = 0.7 + 0.15 * Math.sin(y * SPIKE_FREQUENCY * Math.PI / height);
    return baseWidth * spikeFactor * 0.65;
  },

  getPath(width: number, height: number): Path2D {
    const path = new Path2D();
    const cx = width / 2;
    const cy = height / 2;
    const numSpikes = 16;
    const outerRx = width / 2;
    const outerRy = height / 2;
    const innerRx = outerRx * 0.7;
    const innerRy = outerRy * 0.7;

    for (let i = 0; i < numSpikes; i++) {
      const outerAngle = (i / numSpikes) * Math.PI * 2;
      const innerAngle = ((i + 0.5) / numSpikes) * Math.PI * 2;

      const ox = cx + outerRx * Math.cos(outerAngle);
      const oy = cy + outerRy * Math.sin(outerAngle);
      const ix = cx + innerRx * Math.cos(innerAngle);
      const iy = cy + innerRy * Math.sin(innerAngle);

      if (i === 0) {
        path.moveTo(ox, oy);
      } else {
        path.lineTo(ox, oy);
      }
      path.lineTo(ix, iy);
    }
    path.closePath();
    return path;
  },

  getInnerPadding() {
    return { top: 10, right: 10, bottom: 10, left: 10 };
  },
};
