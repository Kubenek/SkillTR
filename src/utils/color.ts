import { PICKER_CENTER, RING_MIDDLE_RADIUS, TRIANGLE_RADIUS } from '../constants/colorPicker';
import type { HSV } from '../types/hsv';

type Point = { x: number; y: number };

const at = (deg: number): Point => { //? Takes degrees turn them into radians. What is the purpose of the math that follows? Turn the deg into x and y with Radius away from the center?
  const rad = deg * Math.PI / 180;
  return {
    x: PICKER_CENTER + TRIANGLE_RADIUS * Math.sin(rad),
    y: PICKER_CENTER - TRIANGLE_RADIUS * Math.cos(rad),
  };
};

// Fixed corners: W upper-left, H right, K lower-left
export const TRI = { W: at(-30), H: at(90), K: at(210) }; //? Does the TRI func set where the corners are supposed to be? 

export function barycentric(P: Point, A: Point, B: Point, C: Point) { //? Getting weights...math dont understand
  const den = (B.y - C.y) * (A.x - C.x) + (C.x - B.x) * (A.y - C.y);
  const a = ((B.y - C.y) * (P.x - C.x) + (C.x - B.x) * (P.y - C.y)) / den;
  const b = ((C.y - A.y) * (P.x - C.x) + (A.x - C.x) * (P.y - C.y)) / den;
  return { a, b, c: 1 - a - b };
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] { //? I dont understand the math here
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [f(5), f(3), f(1)].map(x => Math.round(x * 255)) as [number, number, number];
}

export function pointToHue(p: Point) { //? atan2 takes the angle and then.....????
  return (Math.atan2(p.x - PICKER_CENTER, -(p.y - PICKER_CENTER)) * 180 / Math.PI + 360) % 360;
}

export function pointToSV(p: Point) {
  let { a, b, c } = barycentric(p, TRI.H, TRI.W, TRI.K); //? We retrieve all 3 weights for the current point
  a = Math.max(0, a); b = Math.max(0, b); c = Math.max(0, c); //? Is this clamping? So its not < 0?
  const sum = a + b + c; //? How does the math going on further work?
  a /= sum; b /= sum;
  const v = a + b;
  return { s: v === 0  ? 0 : a / v, v: v}
}

export function hueToRingPoint(h: number): Point {
  const rad = h * Math.PI / 180;
  return {
    x: PICKER_CENTER + RING_MIDDLE_RADIUS * Math.sin(rad),
    y: PICKER_CENTER - RING_MIDDLE_RADIUS * Math.cos(rad)
  }
}

export function svToPoint(s: number, v: number): Point {
  const a = s*v, b = v * (1-s), c = 1-v;
  return {
    x: a * TRI.H.x + b * TRI.W.x + c * TRI.K.x,
    y: a * TRI.H.y + b * TRI.W.y + c * TRI.K.y 
  }
}

export function hsvToCss({ h, s, v }: HSV) {
  const l = v * (1 - s / 2);
  const sl = (l === 0 || l === 1) ? 0 : (v-1) / Math.min(l, 1 - l);
  return `hsl(${h}, ${sl * 100}%, ${l * 100}%)`
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHsv(r: number, g: number, b: number, fallbackH = 0): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let h = fallbackH;                       // grays have no hue, so keep the old one
  if (d !== 0) {
    if (max === r)      h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else                h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}