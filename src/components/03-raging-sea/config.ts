import type { Vector2Tuple } from "three";

export type SeaSettings = {
  surfaceColor: string;
  depthColor: string;
  colorOffset: number;
  colorMultiplier: number;
  foamColor: string;
  foamThreshold: number;
  foamSmoothness: number;
  waveFrequency: Vector2Tuple;
  waveAmplitude: number;
  waveSpeed: number;
  noiseIterations: number;
  noiseFrequency: number;
  noiseStrength: number;
  edgeCut: number;
};

export const SeaConfig: SeaSettings = {
  surfaceColor: "#01c4d2",
  depthColor: "#2a7eb7",
  colorOffset: 0.08,
  colorMultiplier: 5,
  foamColor: "#ffffff",
  foamThreshold: 0.02,
  foamSmoothness: 0.05,
  waveFrequency: [4, 4],
  waveAmplitude: 0.06,
  waveSpeed: 0.4,
  noiseIterations: 4,
  noiseFrequency: 2,
  noiseStrength: 0.15,
  edgeCut: 0.2,
};
