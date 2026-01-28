export type ParticlesCursorParams = {
  particleCount: number;
  gridSize: number;
  gridSpacing: number;
  particleSize: number;
  colorPower: number;
  displacementIntensity: number;
};

export const particlesCursorConfig: ParticlesCursorParams = {
  particleCount: 128 * 128,
  gridSize: 128,
  gridSpacing: 0.015,
  particleSize: 0.01,
  colorPower: 2,
  displacementIntensity: 0.35,
};
