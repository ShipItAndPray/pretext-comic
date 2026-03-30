import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BubbleRenderer } from '../src/core/BubbleRenderer';

// jsdom doesn't have real canvas; mock getContext
function createMockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;

  const mockCtx = {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    ellipse: vi.fn(),
    quadraticCurveTo: vi.fn(),
    setLineDash: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 50 }),
    getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
  };

  // Override getContext to return our mock
  vi.spyOn(canvas, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);

  return canvas;
}

describe('BubbleRenderer', () => {
  let canvas: HTMLCanvasElement;
  let renderer: BubbleRenderer;

  beforeEach(() => {
    canvas = createMockCanvas();
    renderer = new BubbleRenderer(canvas);
  });

  it('creates a renderer from a canvas', () => {
    expect(renderer).toBeDefined();
  });

  it('clears the canvas', () => {
    renderer.clear();
    const ctx = canvas.getContext('2d')!;
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 400, 300);
  });

  it('renders a bubble without throwing', () => {
    expect(() => {
      renderer.renderBubble(
        {
          shape: 'ellipse',
          width: 200,
          height: 150,
          text: 'Hello!',
          backgroundColor: '#FFFFFF',
          borderColor: '#000000',
        },
        50,
        50,
      );
    }).not.toThrow();
  });

  it('renders multiple bubbles via renderPanel', () => {
    expect(() => {
      renderer.renderPanel([
        { shape: 'ellipse', width: 150, height: 100, text: 'One', x: 10, y: 10 },
        { shape: 'rectangle', width: 150, height: 100, text: 'Two', x: 200, y: 10 },
        { shape: 'cloud', width: 150, height: 100, text: 'Three', x: 10, y: 150 },
      ]);
    }).not.toThrow();
  });

  it('renders with autoFontSize', () => {
    expect(() => {
      renderer.renderBubble(
        {
          shape: 'shout',
          width: 200,
          height: 150,
          text: 'BOOM!',
          autoFontSize: true,
        },
        0,
        0,
      );
    }).not.toThrow();
  });

  it('renders whisper shape', () => {
    expect(() => {
      renderer.renderBubble(
        {
          shape: 'whisper',
          width: 180,
          height: 120,
          text: 'psst...',
        },
        0,
        0,
      );
    }).not.toThrow();
  });

  it('renders with tail', () => {
    expect(() => {
      renderer.renderBubble(
        {
          shape: 'ellipse',
          width: 200,
          height: 150,
          text: 'With tail',
          tail: { angle: 240, length: 30, width: 20, style: 'pointed' },
        },
        0,
        0,
      );
    }).not.toThrow();
  });

  it('renders with thought tail', () => {
    expect(() => {
      renderer.renderBubble(
        {
          shape: 'thought',
          width: 200,
          height: 150,
          text: 'Thinking...',
          tail: { angle: 200, length: 40, width: 15, style: 'thought' },
        },
        0,
        0,
      );
    }).not.toThrow();
  });
});
