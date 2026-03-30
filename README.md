# @shipitandpray/pretext-comic

Fit text inside comic speech bubbles. Ellipse, cloud, thought, shout, custom shapes. Canvas + React. Export PNG.

## Install

```bash
npm install @shipitandpray/pretext-comic @pretext/core
```

## Quick Start

```tsx
import { SpeechBubble } from '@shipitandpray/pretext-comic';

<SpeechBubble
  shape="ellipse"
  text="Hello! I am a speech bubble with auto-fitting text!"
  width={200}
  height={150}
  autoFontSize
  tail={{ angle: 240, length: 30, width: 20, style: 'pointed' }}
/>
```

## How It Works

Standard text layout uses a fixed `maxWidth` for every line. **pretext-comic** uses shape-aware layout: each line's available width is calculated from the shape boundary at that Y position. This means text wraps naturally inside ellipses, clouds, starbursts -- any shape.

The core algorithm:
1. Start at the top of the shape (after padding)
2. For each line Y, call `shape.getWidthAtY(y)` to get available width
3. Lay out words into that width using Pretext's `layoutNextLine()`
4. Advance Y by `lineHeight` and repeat
5. Binary search finds the optimal font size (converges in ~8 iterations)

## Shape Gallery

### Ellipse
```tsx
<SpeechBubble shape="ellipse" text="Classic speech bubble!" width={200} height={150} autoFontSize />
```
Standard oval speech bubble. Width follows `2a * sqrt(1 - ((y-b)/b)^2)` with 15% padding.

### Rectangle
```tsx
<SpeechBubble shape="rectangle" text="Narration box" width={200} height={150} autoFontSize />
```
Rounded rectangle. Constant width except near rounded corners.

### Cloud
```tsx
<SpeechBubble shape="cloud" text="Fluffy thoughts!" width={200} height={150} autoFontSize />
```
Scalloped edge bubble. Overlapping circles along an ellipse perimeter.

### Thought
```tsx
<SpeechBubble
  shape="thought"
  text="Hmm, I wonder..."
  width={180} height={120}
  tail={{ angle: 200, length: 40, width: 15, style: 'thought' }}
  autoFontSize
/>
```
Cloud body + trail of decreasing circles as the tail.

### Shout
```tsx
<SpeechBubble shape="shout" text="BOOM!" width={200} height={150} autoFontSize />
```
Starburst shape. Width varies sinusoidally for a spiky effect.

### Whisper
```tsx
<SpeechBubble shape="whisper" text="psst..." width={180} height={120} autoFontSize />
```
Ellipse geometry with dashed border stroke.

## Custom Shapes

Define a shape by implementing `ShapeDefinition`:

```ts
import { registerShape } from '@shipitandpray/pretext-comic';

registerShape('diamond', {
  type: 'custom',
  getWidthAtY(y, height, maxWidth) {
    const mid = height / 2;
    const ratio = Math.abs(y - mid) / mid;
    return maxWidth * (1 - ratio) * 0.8;
  },
  getPath(width, height) {
    const path = new Path2D();
    path.moveTo(width / 2, 0);
    path.lineTo(width, height / 2);
    path.lineTo(width / 2, height);
    path.lineTo(0, height / 2);
    path.closePath();
    return path;
  },
  getInnerPadding() {
    return { top: 10, right: 10, bottom: 10, left: 10 };
  },
});
```

Or create a custom shape from an SVG path:

```ts
import { createCustomShape, registerShape } from '@shipitandpray/pretext-comic';

const heartShape = createCustomShape('M 100 30 Q 100 0 70 0 ...');
registerShape('heart', heartShape);
```

## Components

### SpeechBubble

Single bubble rendered on a canvas with high-DPI support.

```tsx
<SpeechBubble
  shape="ellipse"
  text="Hello!"
  width={200}
  height={150}
  autoFontSize
  color="#000"
  backgroundColor="#fff"
  borderColor="#000"
  tail={{ angle: 240, length: 30, width: 20, style: 'pointed' }}
  onClick={() => console.log('clicked')}
/>
```

### ComicPanel

Container for multiple bubbles with PNG export.

```tsx
<ComicPanel width={800} height={600} onExport={(blob) => saveAs(blob, 'panel.png')}>
  <SpeechBubble shape="ellipse" text="Look out!" style={{ position: 'absolute', left: 50, top: 30 }} />
  <SpeechBubble shape="shout" text="BOOM!" style={{ position: 'absolute', left: 400, top: 200 }} autoFontSize />
</ComicPanel>
```

### BubbleEditor

Drag-and-drop editor for placing, editing, and exporting bubbles.

```tsx
<BubbleEditor
  width={800}
  height={600}
  backgroundImage="/comic-panel.jpg"
  bubbles={bubbles}
  onBubblesChange={setBubbles}
  onExport={(blob) => downloadBlob(blob)}
/>
```

## Programmatic API

```ts
import { layoutTextInShape, findOptimalFontSize } from '@shipitandpray/pretext-comic';

// Layout text inside a shape
const layout = layoutTextInShape(
  'This text wraps inside an ellipse!',
  'ellipse', 200, 150,
  { fontFamily: 'Comic Sans MS', fontSize: 14, lineHeight: 18 }
);
console.log(layout.lines);  // Each line with x, y, width
console.log(layout.fits);   // true if all text fits

// Find optimal font size via binary search
const { fontSize, layout: optLayout } = findOptimalFontSize(
  'Auto-sized text!', 'cloud', 200, 150, 'Comic Sans MS', 8, 72
);
```

## Comparison

| Feature | pretext-comic | Photoshop | Canva Comics | Pixton |
|---------|-------------|-----------|-------------|--------|
| Shape-aware text wrap | Yes | Manual | No (rect only) | No |
| Open source | Yes | No | No | No |
| Programmatic API | Yes | Scripting | No | No |
| Web-based | Yes | No | Yes | Yes |
| Export PNG | Yes | Yes | Yes | Yes |
| React components | Yes | No | No | No |
| Free | Yes | $22/mo | $13/mo | $8/mo |

## Use Cases

- Webtoon/manga lettering
- Meme generators
- Educational comics
- Social media comic strips
- Automated comic pipelines

## Performance

| Operation | Target |
|-----------|--------|
| Layout single bubble | < 1ms |
| Font size binary search | < 10ms |
| Render single bubble | < 5ms |
| Render 20-bubble panel | < 50ms |
| Export 800x600 PNG | < 100ms |
| Bundle size | < 15KB gzipped |

## Development

```bash
npm install
npm run build       # ESM + CJS via tsup
npm test            # Vitest
npm run demo:dev    # Vite dev server for demo
```

## License

MIT
