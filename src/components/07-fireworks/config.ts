import { color, uniform } from "three/tsl";
import type { Color, UniformNode } from "three/webgpu";

export const fireworkTextures: string[] = [
  "/textures/fireworks-particles/1.png",
  "/textures/fireworks-particles/2.png",
  "/textures/fireworks-particles/3.png",
  "/textures/fireworks-particles/4.png",
  "/textures/fireworks-particles/5.png",
];

export type FireworkSettings = {
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

export type FireworkUnifoms = {
  progress: UniformNode<number>;
  insideColor: UniformNode<Color>;
  outsideColor: UniformNode<Color>;
  colorBias: UniformNode<number>;
  particleSize: UniformNode<number>;
  explosionRadius: UniformNode<number>;
  explosionEasing: UniformNode<number>;
  fallEasing: UniformNode<number>;
  twinkleFrequency: UniformNode<number>;
  twinkleAmplitude: UniformNode<number>;
};

export const FireworkDefaultSettings: FireworkSettings = {
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

export function getFireworkUniforms(
  overrides?: Partial<FireworkSettings>,
): FireworkUnifoms {
  const settings = { ...FireworkDefaultSettings, ...overrides };

  return {
    progress: uniform(0),
    insideColor: uniform(color(settings.insideColor)),
    outsideColor: uniform(color(settings.outsideColor)),
    colorBias: uniform(settings.colorBias),
    particleSize: uniform(settings.particleSize),
    explosionRadius: uniform(settings.explosionRadius),
    explosionEasing: uniform(settings.explosionEasing),
    fallEasing: uniform(settings.fallEasing),
    twinkleFrequency: uniform(settings.twinkleFrequency),
    twinkleAmplitude: uniform(settings.twinkleAmplitude),
  };
}
