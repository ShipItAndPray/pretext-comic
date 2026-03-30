// Polyfill Path2D for jsdom which doesn't have it
if (typeof globalThis.Path2D === 'undefined') {
  (globalThis as any).Path2D = class Path2D {
    private _ops: string[] = [];
    constructor(path?: string | Path2D) {
      if (typeof path === 'string') this._ops.push(path);
    }
    moveTo(_x: number, _y: number) {}
    lineTo(_x: number, _y: number) {}
    closePath() {}
    arc(_x: number, _y: number, _r: number, _s: number, _e: number) {}
    ellipse(_x: number, _y: number, _rx: number, _ry: number, _rot: number, _s: number, _e: number) {}
    quadraticCurveTo(_cpx: number, _cpy: number, _x: number, _y: number) {}
    bezierCurveTo(_cp1x: number, _cp1y: number, _cp2x: number, _cp2y: number, _x: number, _y: number) {}
    roundRect(_x: number, _y: number, _w: number, _h: number, _r: number | number[]) {}
    rect(_x: number, _y: number, _w: number, _h: number) {}
    addPath(_path: Path2D) {}
  };
}
