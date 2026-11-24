import { PICKER_CENTER, TRIANGLE_RADIUS } from '../constants/colorPicker';

type Point = { x: number; y: number };

const at = (deg: number): Point => {
  const rad = deg * Math.PI / 180;
  return {
    x: PICKER_CENTER + TRIANGLE_RADIUS * Math.sin(rad),
    y: PICKER_CENTER - TRIANGLE_RADIUS * Math.cos(rad),
  };
};

// Fixed corners: W upper-left, H right, K lower-left
export const TRI = { W: at(-30), H: at(90), K: at(210) };

export function barycentric(P: Point, A: Point, B: Point, C: Point) {
  const den = (B.y - C.y) * (A.x - C.x) + (C.x - B.x) * (A.y - C.y);
  const a = ((B.y - C.y) * (P.x - C.x) + (C.x - B.x) * (P.y - C.y)) / den;
  const b = ((C.y - A.y) * (P.x - C.x) + (A.x - C.x) * (P.y - C.y)) / den;
  return { a, b, c: 1 - a - b };
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [f(5), f(3), f(1)].map(x => Math.round(x * 255)) as [number, number, number];
}