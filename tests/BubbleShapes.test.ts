import { describe, it, expect } from 'vitest';
import { registerShape, getShape, listShapes, resolveShape } from '../src/core/BubbleShapes';
import type { ShapeDefinition } from '../src/types';

describe('BubbleShapes registry', () => {
  it('lists all built-in shapes', () => {
    const shapes = listShapes();
    expect(shapes).toContain('ellipse');
    expect(shapes).toContain('rectangle');
    expect(shapes).toContain('cloud');
    expect(shapes).toContain('thought');
    expect(shapes).toContain('shout');
    expect(shapes).toContain('whisper');
  });

  it('retrieves a built-in shape by name', () => {
    const ellipse = getShape('ellipse');
    expect(ellipse.type).toBe('ellipse');
    expect(typeof ellipse.getWidthAtY).toBe('function');
  });

  it('throws for unknown shape name', () => {
    expect(() => getShape('nonexistent')).toThrow('Unknown shape');
  });

  it('registers and retrieves a custom shape', () => {
    const custom: ShapeDefinition = {
      type: 'custom',
      getWidthAtY: () => 100,
      getPath: (w, h) => new Path2D(),
      getInnerPadding: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    };
    registerShape('myShape', custom);
    expect(getShape('myShape')).toBe(custom);
    expect(listShapes()).toContain('myShape');
  });

  it('resolves a string to a ShapeDefinition', () => {
    const resolved = resolveShape('ellipse');
    expect(resolved.type).toBe('ellipse');
  });

  it('resolves a ShapeDefinition to itself', () => {
    const custom: ShapeDefinition = {
      type: 'custom',
      getWidthAtY: () => 50,
      getPath: () => new Path2D(),
      getInnerPadding: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    };
    expect(resolveShape(custom)).toBe(custom);
  });
});
