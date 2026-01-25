import { useControls } from "leva";
import { fireworkConfig as config, type FireworkParams } from "../config";

export default function useFireworkControls(): Omit<
  FireworkParams,
  "progress"
> {
  return useControls(
    "💥 7 — Fireworks",
    {
      fullGPU: {
        label: "Data Generation Strategy",
        value: config.fullGPU,
        options: {
          GPU: true,
          CPU: false,
        },
      },
      particleCount: {
        label: "Particle Count",
        value: config.particleCount,
        min: 1,
        max: 10000,
        step: 10,
      },
      insideColor: {
        label: "Inside Color",
        value: config.insideColor,
      },
      outsideColor: {
        label: "Outside Color",
        value: config.outsideColor,
      },
      colorBias: {
        label: "Color Bias",
        value: config.colorBias,
        min: 0,
        max: 1,
        step: 0.0001,
      },
      particleSize: {
        label: "Particle Size",
        value: config.particleSize,
        min: 0,
        max: 2,
        step: 0.0001,
      },
      explosionRadius: {
        label: "Explosion Radius",
        value: config.explosionRadius,
        min: 0.0001,
        max: 4,
        step: 0.0001,
      },
      explosionEasing: {
        label: "Explosion Easing",
        value: config.explosionEasing,
        min: 1,
        max: 10,
        step: 1,
      },
      fallEasing: {
        label: "Fall Easing",
        value: config.fallEasing,
        min: 1,
        max: 10,
        step: 1,
      },
      twinkleFrequency: {
        label: "Twinkle Frequency",
        value: config.twinkleFrequency,
        min: 0,
        max: 300,
        step: 0.01,
      },
      twinkleAmplitude: {
        label: "Twinkle Amplitude",
        value: config.twinkleAmplitude,
        min: 0,
        max: 3,
        step: 0.0001,
      },
    },
    { collapsed: true },
  );
}
