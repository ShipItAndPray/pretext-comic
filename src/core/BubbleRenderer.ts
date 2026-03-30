import type { BubbleConfig, FontConfig, ShapeTextLayoutResult } from '../types';
import { resolveShape } from './BubbleShapes';
import { layoutTextInShape } from './ShapeTextLayout';
import { findOptimalFontSize } from './TextFitter';
import { drawTail } from '../utils/tailGenerator';

const DEFAULT_FONT: FontConfig = {
  fontFamily: 'Comic Sans MS, cursive',
  fontSize: 14,
  lineHeight: 18,
};

/**
 * Canvas-based renderer for speech bubbles with text.
 */
export class BubbleRenderer {
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  private canvas: HTMLCanvasElement | OffscreenCanvas;

  constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2d context');
    this.ctx = ctx as CanvasRenderingContext2D;
  }

  /**
   * Render a single bubble at position (x, y) on the canvas.
   */
  renderBubble(config: BubbleConfig, x: number, y: number): void {
    const ctx = this.ctx;
    const shape = resolveShape(config.shape);
    const font: FontConfig = { ...DEFAULT_FONT, ...config.font };

    ctx.save();
    ctx.translate(x, y);

    // Draw bubble shape
    const path = shape.getPath(config.width, config.height);

    // Fill
    ctx.fillStyle = config.backgroundColor ?? '#FFFFFF';
    ctx.fill(path);

    // Stroke
    ctx.strokeStyle = config.borderColor ?? '#000000';
    ctx.lineWidth = config.borderWidth ?? 2;

    // Whisper shape uses dashed stroke
    if (shape.type === 'whisper') {
      ctx.setLineDash([6, 4]);
    }
    ctx.stroke(path);
    ctx.setLineDash([]);

    // Draw tail if configured
    if (config.tail) {
      ctx.fillStyle = config.backgroundColor ?? '#FFFFFF';
      ctx.strokeStyle = config.borderColor ?? '#000000';
      ctx.lineWidth = config.borderWidth ?? 2;
      drawTail(ctx, config.width, config.height, config.tail);
    }

    // Layout text
    let layout: ShapeTextLayoutResult;
    if (config.autoFontSize) {
      const result = findOptimalFontSize(
        config.text,
        shape,
        config.width,
        config.height,
        font.fontFamily,
        config.minFontSize ?? 8,
        config.maxFontSize ?? 72,
      );
      font.fontSize = result.fontSize;
      font.lineHeight = result.fontSize * 1.3;
      layout = result.layout;
    } else {
      layout = layoutTextInShape(
        config.text,
        shape,
        config.width,
        config.height,
        font,
        { textAlign: config.textAlign, padding: config.padding },
      );
    }

    // Draw text
    ctx.fillStyle = config.color ?? '#000000';
    ctx.font = `${font.fontStyle ?? 'normal'} ${font.fontWeight ?? 'normal'} ${font.fontSize}px ${font.fontFamily}`;
    ctx.textBaseline = 'middle';

    for (const line of layout.lines) {
      ctx.fillText(line.text, line.x, line.y);
    }

    ctx.restore();
  }

  /**
   * Render multiple bubbles, each at their own (x, y) position.
   */
  renderPanel(bubbles: Array<BubbleConfig & { x: number; y: number }>): void {
    for (const bubble of bubbles) {
      this.renderBubble(bubble, bubble.x, bubble.y);
    }
  }

  /**
   * Clear the canvas.
   */
  clear(): void {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
  }

  /**
   * Export the canvas as a PNG Blob.
   */
  async exportPNG(quality?: number): Promise<Blob> {
    if (this.canvas instanceof OffscreenCanvas) {
      return this.canvas.convertToBlob({ type: 'image/png', quality });
    }
    return new Promise<Blob>((resolve, reject) => {
      (this.canvas as HTMLCanvasElement).toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        'image/png',
        quality,
      );
    });
  }

  /**
   * Export the canvas as a data URL string.
   */
  exportDataURL(quality?: number): string {
    if (this.canvas instanceof HTMLCanvasElement) {
      return this.canvas.toDataURL('image/png', quality);
    }
    throw new Error('exportDataURL requires an HTMLCanvasElement');
  }
}
