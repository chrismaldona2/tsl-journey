import { dot, fract, sin, vec2, Fn } from "three/tsl";
import { Node } from "three/webgpu";

export const random2D = Fn(([value]: [value: Node]) => {
  return fract(sin(dot(value, vec2(12.9898, 78.233))).mul(43758.5453123));
});
