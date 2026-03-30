import type { BubbleShape, ShapeDefinition } from '../types';
import { ellipseShape } from '../shapes/ellipse';
import { rectangleShape } from '../shapes/rectangle';
import { cloudShape } from '../shapes/cloud';
import { thoughtShape } from '../shapes/thought';
import { shoutShape } from '../shapes/shout';
import { whisperShape } from '../shapes/whisper';

const builtInShapes: Record<string, ShapeDefinition> = {
  ellipse: ellipseShape,
  rectangle: rectangleShape,
  cloud: cloudShape,
  thought: thoughtShape,
  shout: shoutShape,
  whisper: whisperShape,
};

const customShapes = new Map<string, ShapeDefinition>();

/**
 * Register a custom shape definition.
 */
export function registerShape(name: string, shape: ShapeDefinition): void {
  customShapes.set(name, shape);
}

/**
 * Retrieve a shape definition by name.
 */
export function getShape(name: string): ShapeDefinition {
  const shape = builtInShapes[name] ?? customShapes.get(name);
  if (!shape) {
    throw new Error(`Unknown shape: "${name}". Available: ${listShapes().join(', ')}`);
  }
  return shape;
}

/**
 * List all available shape names.
 */
export function listShapes(): string[] {
  return [...Object.keys(builtInShapes), ...customShapes.keys()];
}

/**
 * Resolve a BubbleShape string or ShapeDefinition to a ShapeDefinition.
 */
export function resolveShape(shape: BubbleShape | ShapeDefinition): ShapeDefinition {
  if (typeof shape === 'string') {
    return getShape(shape);
  }
  return shape;
}
