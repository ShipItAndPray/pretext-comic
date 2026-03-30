import { useMemo } from 'react';
import type { BubbleConfig, FontConfig, ShapeTextLayoutResult } from '../types';
import { layoutTextInShape } from '../core/ShapeTextLayout';
import { findOptimalFontSize } from '../core/TextFitter';

const DEFAULT_FONT: FontConfig = {
  fontFamily: 'Comic Sans MS, cursive',
  fontSize: 14,
  lineHeight: 18,
};

/**
 * React hook that computes text layout for a bubble config.
 * Memoized on config properties for performance.
 */
export function useBubbleLayout(config: BubbleConfig): ShapeTextLayoutResult {
  return useMemo(() => {
    const font: FontConfig = { ...DEFAULT_FONT, ...config.font };

    if (config.autoFontSize) {
      const result = findOptimalFontSize(
        config.text,
        config.shape,
        config.width,
        config.height,
        font.fontFamily,
        config.minFontSize ?? 8,
        config.maxFontSize ?? 72,
      );
      return result.layout;
    }

    return layoutTextInShape(
      config.text,
      config.shape,
      config.width,
      config.height,
      font,
      { textAlign: config.textAlign, padding: config.padding },
    );
  }, [
    config.text,
    config.shape,
    config.width,
    config.height,
    config.font?.fontFamily,
    config.font?.fontSize,
    config.font?.lineHeight,
    config.autoFontSize,
    config.minFontSize,
    config.maxFontSize,
    config.textAlign,
    config.padding,
  ]);
}
