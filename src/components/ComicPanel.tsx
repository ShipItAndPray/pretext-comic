import React, { useRef, useCallback } from 'react';
import type { ComicPanelProps } from '../types';

/**
 * A comic panel container that holds SpeechBubble children
 * and supports exporting the entire panel as PNG.
 */
export const ComicPanel: React.FC<ComicPanelProps> = ({
  width,
  height,
  backgroundColor = '#FFFFFF',
  borderColor = '#000000',
  borderWidth = 2,
  children,
  onExport,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!onExport || !containerRef.current) return;

    // Use html2canvas approach: render all children to an offscreen canvas
    // For now, we capture via the container's child canvases
    const canvases = containerRef.current.querySelectorAll('canvas');
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

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
  }, [width, height, backgroundColor, onExport]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {children}
      {onExport && (
        <button
          onClick={handleExport}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            padding: '4px 12px',
            fontSize: 12,
            cursor: 'pointer',
            background: '#fff',
            border: '1px solid #999',
            borderRadius: 4,
          }}
        >
          Export PNG
        </button>
      )}
    </div>
  );
};
