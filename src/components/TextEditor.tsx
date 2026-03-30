import React, { useState, useCallback } from 'react';

interface TextEditorProps {
  text: string;
  onChange: (text: string) => void;
  width: number;
  height: number;
}

/**
 * Inline text editor overlay for editing bubble text.
 */
export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChange,
  width,
  height,
}) => {
  const [value, setValue] = useState(text);

  const handleBlur = useCallback(() => {
    onChange(value);
  }, [value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onChange(text); // revert
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onChange(value);
      }
    },
    [value, text, onChange],
  );

  return (
    <textarea
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        background: 'rgba(255, 255, 255, 0.92)',
        border: '2px solid #0066ff',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Comic Sans MS, cursive',
        resize: 'none',
        outline: 'none',
        textAlign: 'center',
      }}
    />
  );
};
