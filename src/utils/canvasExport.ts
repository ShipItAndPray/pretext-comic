import type { BubbleConfig } from '../types';
import { BubbleRenderer } from '../core/BubbleRenderer';

/**
 * Export a panel with multiple bubbles to a PNG Blob.
 */
export async function exportPanelToPNG(
  panelWidth: number,
  panelHeight: number,
  bubbles: Array<BubbleConfig & { x: number; y: number }>,
  options?: {
    backgroundColor?: string;
    backgroundImage?: HTMLImageElement | ImageBitmap;
    quality?: number;
  },
): Promise<Blob> {
  if (typeof OffscreenCanvas === 'undefined') {
    throw new Error('OffscreenCanvas not supported in this environment');
  }

  const canvas = new OffscreenCanvas(panelWidth, panelHeight);
  const renderer = new BubbleRenderer(canvas);

  // Draw background
  const ctx = canvas.getContext('2d')!;
  if (options?.backgroundColor) {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, panelWidth, panelHeight);
  }
  if (options?.backgroundImage) {
    ctx.drawImage(options.backgroundImage, 0, 0, panelWidth, panelHeight);
  }

  // Draw all bubbles
  renderer.renderPanel(bubbles);

  return canvas.convertToBlob({
    type: 'image/png',
    quality: options?.quality ?? 0.92,
  });
}

/**
 * Export a panel to a data URL string.
 */
export function exportPanelToDataURL(
  canvas: HTMLCanvasElement,
  quality?: number,
): string {
  return canvas.toDataURL('image/png', quality ?? 0.92);
}
