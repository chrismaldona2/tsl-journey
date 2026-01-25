export type HologramParams = {
  color: string;
  scanlineDensity: number;
  scanlineSharpness: number;
  scanlineSpeed: number;
  fresnelIntensity: number;
  fresnelFalloff: number;
  fresnelPower: number;
  glitchAmplitude: number;
  glitchThreshold: number;
};

export const HologramConfig: HologramParams = {
  color: "#70c1ff",
  scanlineDensity: 50,
  scanlineSharpness: 2,
  scanlineSpeed: 0.02,
  fresnelIntensity: 1.25,
  fresnelFalloff: 0.8,
  fresnelPower: 2,
  glitchAmplitude: 0.5,
  glitchThreshold: 0.3,
};
