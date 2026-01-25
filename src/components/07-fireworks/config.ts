export const fireworkTextures: string[] = [
  "/textures/fireworks-particles/1.png",
  "/textures/fireworks-particles/2.png",
  "/textures/fireworks-particles/3.png",
  "/textures/fireworks-particles/4.png",
  "/textures/fireworks-particles/5.png",
];

export type FireworkParams = {
  progress: number;
  fullGPU: boolean;
  particleCount: number;
  insideColor: string;
  outsideColor: string;
  colorBias: number;
  particleSize: number;
  explosionRadius: number;
  explosionEasing: number;
  fallEasing: number;
  twinkleFrequency: number;
  twinkleAmplitude: number;
};

export const fireworkConfig: FireworkParams = {
  progress: 0,
  fullGPU: true,
  particleCount: 1000,
  insideColor: "#fffffa",
  outsideColor: "#e48222",
  colorBias: 0.6,
  particleSize: 0.1,
  explosionRadius: 0.8,
  explosionEasing: 3,
  fallEasing: 2,
  twinkleFrequency: 50,
  twinkleAmplitude: 0.5,
};
