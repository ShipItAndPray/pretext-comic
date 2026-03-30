// Types
export type {
  BubbleShape,
  ShapeDefinition,
  BubbleConfig,
  TailConfig,
  FontConfig,
  ShapeTextLayoutResult,
  LayoutLine,
  SpeechBubbleProps,
  ComicPanelProps,
  BubbleEditorProps,
} from './types';

// Core
export { layoutTextInShape } from './core/ShapeTextLayout';
export { findOptimalFontSize } from './core/TextFitter';
export { BubbleRenderer } from './core/BubbleRenderer';
export { registerShape, getShape, listShapes, resolveShape } from './core/BubbleShapes';

// Shapes
export { ellipseShape } from './shapes/ellipse';
export { rectangleShape } from './shapes/rectangle';
export { cloudShape } from './shapes/cloud';
export { thoughtShape } from './shapes/thought';
export { shoutShape } from './shapes/shout';
export { whisperShape } from './shapes/whisper';
export { createCustomShape } from './shapes/custom';

// Components
export { SpeechBubble } from './components/SpeechBubble';
export { ComicPanel } from './components/ComicPanel';
export { BubbleEditor } from './components/BubbleEditor';
export { TextEditor } from './components/TextEditor';

// Hooks
export { useBubbleLayout } from './hooks/useBubbleLayout';
export { useDraggable } from './hooks/useDraggable';

// Utils
export { exportPanelToPNG, exportPanelToDataURL } from './utils/canvasExport';
export { loadFont, COMIC_FONTS } from './utils/fontLoader';
export { drawTail } from './utils/tailGenerator';
export { COMIC_COLORS, BORDER_COLORS } from './utils/colorPalette';
