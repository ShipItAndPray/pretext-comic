import type { CSSProperties, ReactNode } from 'react';

// --- Shape Types ---

export type BubbleShape =
  | 'ellipse'
  | 'rectangle'
  | 'cloud'
  | 'thought'
  | 'shout'
  | 'whisper'
  | 'custom';

export interface ShapeDefinition {
  type: BubbleShape;
  /** Returns available text width at a given Y position within the shape. */
  getWidthAtY(y: number, height: number, maxWidth: number): number;
  /** Returns a Path2D for rendering the shape outline/fill. */
  getPath(width: number, height: number): Path2D;
  /** Returns inner padding so text doesn't touch shape edges. */
  getInnerPadding(): { top: number; right: number; bottom: number; left: number };
}

// --- Font Config ---

export interface FontConfig {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
}

// --- Tail Config ---

export interface TailConfig {
  /** Angle in degrees. 0 = right, 90 = down, 180 = left, 270 = up. */
  angle: number;
  /** Length of the tail in pixels. */
  length: number;
  /** Base width of the tail where it meets the bubble. */
  width: number;
  /** Tail rendering style. */
  style: 'pointed' | 'curved' | 'thought';
}

// --- Bubble Config ---

export interface BubbleConfig {
  shape: BubbleShape | ShapeDefinition;
  width: number;
  height: number;
  text: string;
  font?: FontConfig;
  /** Auto-shrink text to fit inside the shape. */
  autoFontSize?: boolean;
  minFontSize?: number;
  maxFontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  tail?: TailConfig;
  /** Extra inner padding as fraction 0-1 of dimensions. */
  padding?: number;
}

// --- Layout Result ---

export interface LayoutLine {
  text: string;
  x: number;
  y: number;
  width: number;
  /** Available width at this Y position inside the shape. */
  maxWidth: number;
}

export interface ShapeTextLayoutResult {
  lines: LayoutLine[];
  fontSize: number;
  totalHeight: number;
  /** Whether all text fits inside the shape. */
  fits: boolean;
}

// --- React Component Props ---

export interface SpeechBubbleProps {
  shape?: BubbleShape;
  text: string;
  width?: number;
  height?: number;
  autoSize?: boolean;
  font?: Partial<FontConfig>;
  autoFontSize?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  tail?: TailConfig;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export interface ComicPanelProps {
  width: number;
  height: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  children: ReactNode;
  onExport?: (blob: Blob) => void;
}

export interface BubbleEditorProps {
  width: number;
  height: number;
  backgroundImage?: string;
  bubbles: BubbleConfig[];
  onBubblesChange: (bubbles: BubbleConfig[]) => void;
  onExport?: (blob: Blob) => void;
}
