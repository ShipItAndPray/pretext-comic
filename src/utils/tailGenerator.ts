import type { TailConfig } from '../types';

/**
 * Generate tail drawing commands on a canvas context.
 */
export function drawTail(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  bubbleWidth: number,
  bubbleHeight: number,
  tail: TailConfig,
): void {
  const angleRad = (tail.angle * Math.PI) / 180;
  const cx = bubbleWidth / 2;
  const cy = bubbleHeight / 2;

  // Point on the bubble edge where tail starts
  const startX = cx + (bubbleWidth / 2) * 0.8 * Math.cos(angleRad);
  const startY = cy + (bubbleHeight / 2) * 0.8 * Math.sin(angleRad);

  // Tip of the tail
  const tipX = cx + ((bubbleWidth / 2) + tail.length) * Math.cos(angleRad);
  const tipY = cy + ((bubbleHeight / 2) + tail.length) * Math.sin(angleRad);

  if (tail.style === 'thought') {
    // Trail of decreasing circles
    const numCircles = 3;
    for (let i = 0; i < numCircles; i++) {
      const t = (i + 1) / (numCircles + 1);
      const x = startX + (tipX - startX) * t;
      const y = startY + (tipY - startY) * t;
      const radius = (tail.width / 2) * (1 - t * 0.6);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    return;
  }

  // Perpendicular offset for tail base width
  const perpAngle = angleRad + Math.PI / 2;
  const halfWidth = tail.width / 2;
  const baseX1 = startX + halfWidth * Math.cos(perpAngle);
  const baseY1 = startY + halfWidth * Math.sin(perpAngle);
  const baseX2 = startX - halfWidth * Math.cos(perpAngle);
  const baseY2 = startY - halfWidth * Math.sin(perpAngle);

  ctx.beginPath();
  ctx.moveTo(baseX1, baseY1);

  if (tail.style === 'curved') {
    // Curved tail using quadratic bezier
    const cpOffset = tail.length * 0.4;
    const cpAngle = angleRad + 0.3;
    const cpX = startX + cpOffset * Math.cos(cpAngle);
    const cpY = startY + cpOffset * Math.sin(cpAngle);
    ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
    const cpX2 = startX + cpOffset * Math.cos(cpAngle - 0.6);
    const cpY2 = startY + cpOffset * Math.sin(cpAngle - 0.6);
    ctx.quadraticCurveTo(cpX2, cpY2, baseX2, baseY2);
  } else {
    // Pointed tail: simple triangle
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(baseX2, baseY2);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
