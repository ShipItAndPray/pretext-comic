import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { SpeechBubble } from '../src/components/SpeechBubble';

// Mock canvas getContext for jsdom
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
  measureText: vi.fn().mockReturnValue({ width: 40 }),
  font: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  textBaseline: 'alphabetic' as CanvasTextBaseline,
};

// Patch HTMLCanvasElement.getContext before rendering
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (type: string, ...args: any[]) {
  if (type === '2d') return mockCtx as unknown as CanvasRenderingContext2D;
  return originalGetContext.call(this, type, ...args) as any;
} as any;

describe('SpeechBubble component', () => {
  it('renders a canvas element', () => {
    const { container } = render(
      <SpeechBubble text="Hello!" width={200} height={150} />,
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('sets canvas dimensions based on props', () => {
    const { container } = render(
      <SpeechBubble text="Test" width={300} height={200} />,
    );
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.style.width).toBe('300px');
    expect(canvas.style.height).toBe('200px');
  });

  it('applies className and style', () => {
    const { container } = render(
      <SpeechBubble
        text="Styled"
        width={200}
        height={150}
        className="my-bubble"
        style={{ opacity: 0.5 }}
      />,
    );
    const canvas = container.querySelector('canvas');
    expect(canvas?.className).toBe('my-bubble');
    expect(canvas?.style.opacity).toBe('0.5');
  });

  it('renders with different shapes without errors', () => {
    const shapes = ['ellipse', 'rectangle', 'cloud', 'thought', 'shout', 'whisper'] as const;
    for (const shape of shapes) {
      expect(() => {
        render(<SpeechBubble text={`Shape: ${shape}`} shape={shape} width={200} height={150} />);
      }).not.toThrow();
    }
  });
});
