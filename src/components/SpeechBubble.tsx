import React, { useEffect, useRef } from 'react';
import type { SpeechBubbleProps, FontConfig } from '../types';
import { BubbleRenderer } from '../core/BubbleRenderer';

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

/**
 * React component that renders a single speech bubble on a canvas element.
 * Supports all built-in shapes, auto font sizing, and high-DPI rendering.
 */
export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  shape = 'ellipse',
  text,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  font,
  autoFontSize = false,
  color,
  backgroundColor,
  borderColor,
  tail,
  onClick,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // High-DPI: set canvas buffer size to 2x, CSS scales down
    canvas.width = width * DPR;
    canvas.height = height * DPR;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, width, height);

    const renderer = new BubbleRenderer(canvas);

    const fontConfig: FontConfig = {
      fontFamily: font?.fontFamily ?? 'Comic Sans MS, cursive',
      fontSize: font?.fontSize ?? 14,
      lineHeight: font?.lineHeight ?? (font?.fontSize ?? 14) * 1.3,
      fontWeight: font?.fontWeight,
      fontStyle: font?.fontStyle,
    };

    renderer.renderBubble(
      {
        shape,
        width,
        height,
        text,
        font: fontConfig,
        autoFontSize,
        color,
        backgroundColor,
        borderColor,
        tail,
      },
      0,
      0,
    );
  }, [shape, text, width, height, font, autoFontSize, color, backgroundColor, borderColor, tail]);

  return (
    <canvas
      ref={canvasRef}
      width={width * DPR}
      height={height * DPR}
      onClick={onClick}
      className={className}
      style={{
        width,
        height,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    />
  );
};
