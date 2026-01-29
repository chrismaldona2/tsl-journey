import type { UniformSet } from "@/types/uniforms";

export type ParticlesCursorParams = {
  canvasSize: number;
  particleCount: number;
  particleSize: number;
  displacementIntensity: number;
  displacementEdgeStart: number;
  displacementEdgeEnd: number;
  gridSize: number;
  gridSpacing: number;
  colorPower: number;
  cursorRadius: number;
  cursorFollowSpeed: number;
};

export const particlesCursorConfig: ParticlesCursorParams = {
  canvasSize: 128,
  particleCount: 128 * 128,
  gridSize: 128,
  particleSize: 0.01,
  displacementIntensity: 0.35,
  displacementEdgeStart: 0.1,
  displacementEdgeEnd: 0.4,
  colorPower: 2,
  gridSpacing: 0.015,
  cursorRadius: 0.25,
  cursorFollowSpeed: 6,
};

export type ParticlesCursorUniforms = UniformSet<
  Omit<
    ParticlesCursorParams,
    "canvasSize" | "particleCount" | "cursorRadius" | "cursorFollowSpeed"
  >
>;
