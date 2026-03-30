import React, { useState, useCallback, useRef } from 'react';
import type { BubbleEditorProps, BubbleConfig, BubbleShape } from '../types';
import { SpeechBubble } from './SpeechBubble';
import { useDraggable } from '../hooks/useDraggable';

const SHAPES: BubbleShape[] = ['ellipse', 'rectangle', 'cloud', 'thought', 'shout', 'whisper'];

interface DraggableBubbleProps {
  config: BubbleConfig & { x: number; y: number };
  index: number;
  onMove: (index: number, x: number, y: number) => void;
  onTextChange: (index: number, text: string) => void;
  onShapeChange: (index: number, shape: BubbleShape) => void;
  selected: boolean;
  onSelect: () => void;
}

const DraggableBubble: React.FC<DraggableBubbleProps> = ({
  config,
  index,
  onMove,
  onTextChange,
  onShapeChange,
  selected,
  onSelect,
}) => {
  const [editing, setEditing] = useState(false);
  const { position, isDragging, dragHandlers } = useDraggable({
    initialPosition: { x: config.x, y: config.y },
    onDragEnd: (pos) => onMove(index, pos.x, pos.y),
  });

  const handleDoubleClick = useCallback(() => {
    setEditing(true);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        outline: selected ? '2px dashed #0066ff' : 'none',
        zIndex: selected ? 10 : 1,
      }}
      {...dragHandlers}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      <SpeechBubble
        shape={config.shape as BubbleShape}
        text={config.text}
        width={config.width}
        height={config.height}
        autoFontSize={config.autoFontSize}
        color={config.color}
        backgroundColor={config.backgroundColor}
        borderColor={config.borderColor}
        tail={config.tail}
      />
      {selected && (
        <div style={{ position: 'absolute', top: -28, left: 0, display: 'flex', gap: 4 }}>
          <select
            value={typeof config.shape === 'string' ? config.shape : 'custom'}
            onChange={(e) => onShapeChange(index, e.target.value as BubbleShape)}
            style={{ fontSize: 11, padding: '1px 4px' }}
          >
            {SHAPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      {editing && (
        <textarea
          autoFocus
          defaultValue={config.text}
          onBlur={(e) => {
            setEditing(false);
            onTextChange(index, e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || (e.key === 'Enter' && !e.shiftKey)) {
              setEditing(false);
              onTextChange(index, e.currentTarget.value);
            }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: config.width,
            height: config.height,
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid #999',
            borderRadius: 4,
            padding: 8,
            fontSize: 13,
            resize: 'none',
          }}
        />
      )}
    </div>
  );
};

/**
 * Drag-and-drop bubble editor for placing and editing speech bubbles
 * on a background image or blank canvas.
 */
export const BubbleEditor: React.FC<BubbleEditorProps> = ({
  width,
  height,
  backgroundImage,
  bubbles,
  onBubblesChange,
  onExport,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (idx: number, x: number, y: number) => {
      const updated = bubbles.map((b, i) =>
        i === idx ? { ...b, x, y } : b,
      ) as Array<BubbleConfig & { x: number; y: number }>;
      onBubblesChange(updated);
    },
    [bubbles, onBubblesChange],
  );

  const handleTextChange = useCallback(
    (idx: number, text: string) => {
      const updated = bubbles.map((b, i) =>
        i === idx ? { ...b, text } : b,
      );
      onBubblesChange(updated);
    },
    [bubbles, onBubblesChange],
  );

  const handleShapeChange = useCallback(
    (idx: number, shape: BubbleShape) => {
      const updated = bubbles.map((b, i) =>
        i === idx ? { ...b, shape } : b,
      );
      onBubblesChange(updated);
    },
    [bubbles, onBubblesChange],
  );

  const handleExport = useCallback(async () => {
    if (!onExport || !containerRef.current) return;
    const canvases = containerRef.current.querySelectorAll('canvas');
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          resolve();
        };
        img.src = backgroundImage;
      });
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    canvases.forEach((child) => {
      const rect = child.getBoundingClientRect();
      const parentRect = containerRef.current!.getBoundingClientRect();
      const x = rect.left - parentRect.left;
      const y = rect.top - parentRect.top;
      ctx.drawImage(child, x, y, rect.width, rect.height);
    });

    exportCanvas.toBlob((blob) => {
      if (blob) onExport(blob);
    }, 'image/png');
  }, [width, height, backgroundImage, onExport]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height,
        border: '2px solid #333',
        overflow: 'hidden',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundColor: backgroundImage ? undefined : '#f5f5f5',
      }}
      onClick={() => setSelectedIdx(null)}
    >
      {(bubbles as Array<BubbleConfig & { x: number; y: number }>).map((bubble, i) => (
        <DraggableBubble
          key={i}
          config={bubble}
          index={i}
          onMove={handleMove}
          onTextChange={handleTextChange}
          onShapeChange={handleShapeChange}
          selected={selectedIdx === i}
          onSelect={() => setSelectedIdx(i)}
        />
      ))}
      {onExport && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleExport();
          }}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            background: '#0066ff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
          }}
        >
          Export PNG
        </button>
      )}
    </div>
  );
};
