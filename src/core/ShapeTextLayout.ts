import type {
  BubbleShape,
  FontConfig,
  LayoutLine,
  ShapeDefinition,
  ShapeTextLayoutResult,
} from '../types';
import { resolveShape } from './BubbleShapes';

const DEFAULT_FONT: FontConfig = {
  fontFamily: 'Comic Sans MS, cursive',
  fontSize: 14,
  lineHeight: 18,
};

/**
 * Measure text width using a canvas 2d context.
 * Uses a shared offscreen canvas for performance.
 */
let measureCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;
let measureCtxResolved = false;

function getMeasureContext(): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
  if (measureCtxResolved) return measureCtx;
  measureCtxResolved = true;
  try {
    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(1, 1);
      const ctx = canvas.getContext('2d');
      if (ctx) { measureCtx = ctx; return measureCtx; }
    }
  } catch { /* ignore */ }
  try {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) { measureCtx = ctx; return measureCtx; }
    }
  } catch { /* ignore */ }
  return null;
}

function measureTextWidth(text: string, font: FontConfig): number {
  const ctx = getMeasureContext();
  if (!ctx) {
    // Fallback heuristic for non-browser environments
    return text.length * font.fontSize * 0.55;
  }
  ctx.font = `${font.fontStyle ?? 'normal'} ${font.fontWeight ?? 'normal'} ${font.fontSize}px ${font.fontFamily}`;
  return ctx.measureText(text).width;
}

/**
 * Break text into words and lay them out line by line,
 * where each line's max width is determined by the shape boundary at that Y.
 *
 * This is the core innovation: shape-aware text wrapping using dynamic
 * widths per line, similar to what @pretext/core's layoutNextLine() does.
 */
export function layoutTextInShape(
  text: string,
  shape: BubbleShape | ShapeDefinition,
  width: number,
  height: number,
  font?: FontConfig,
  options?: { textAlign?: 'left' | 'center' | 'right'; padding?: number },
): ShapeTextLayoutResult {
  const resolved = resolveShape(shape);
  const f = { ...DEFAULT_FONT, ...font };
  const align = options?.textAlign ?? 'center';
  const paddingFrac = options?.padding ?? 0;
  const innerPad = resolved.getInnerPadding();

  const effectiveWidth = width * (1 - paddingFrac);
  const effectiveHeight = height * (1 - paddingFrac);
  const offsetX = (width - effectiveWidth) / 2 + innerPad.left;
  const offsetY = (height - effectiveHeight) / 2 + innerPad.top;

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { lines: [], fontSize: f.fontSize, totalHeight: 0, fits: true };
  }

  const lines: LayoutLine[] = [];
  let wordIdx = 0;
  let currentY = offsetY + f.lineHeight * 0.5; // start half a line height in

  while (wordIdx < words.length && currentY + f.lineHeight * 0.5 <= height - offsetY) {
    const availableWidth = resolved.getWidthAtY(currentY, height, effectiveWidth);

    if (availableWidth <= 0) {
      currentY += f.lineHeight * 0.3;
      continue;
    }

    let lineText = '';
    let lineWidth = 0;

    while (wordIdx < words.length) {
      const word = words[wordIdx];
      const testText = lineText ? `${lineText} ${word}` : word;
      const testWidth = measureTextWidth(testText, f);

      if (testWidth > availableWidth && lineText !== '') {
        break;
      }

      lineText = testText;
      lineWidth = testWidth;
      wordIdx++;

      // Single word wider than available width - accept it and move on
      if (testWidth > availableWidth) break;
    }

    if (lineText) {
      let x: number;
      if (align === 'center') {
        x = (width - lineWidth) / 2;
      } else if (align === 'right') {
        x = width - offsetX - innerPad.right - lineWidth;
      } else {
        x = offsetX;
      }

      lines.push({
        text: lineText,
        x,
        y: currentY,
        width: lineWidth,
        maxWidth: availableWidth,
      });
    }

    currentY += f.lineHeight;
  }

  const fits = wordIdx >= words.length;
  const totalHeight = lines.length > 0
    ? lines[lines.length - 1].y - lines[0].y + f.lineHeight
    : 0;

  return { lines, fontSize: f.fontSize, totalHeight, fits };
}
