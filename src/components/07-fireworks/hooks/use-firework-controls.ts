import { useControls } from "leva";
import { FireworkDefaultSettings, type FireworkSettings } from "../config";

export default function useFireworkControls(): FireworkSettings {
  return useControls(
    "💥 7 — Fireworks",
    {
      fullGPU: {
        label: "Data Generation Strategy",
        value: FireworkDefaultSettings.fullGPU,
        options: {
          GPU: true,
          CPU: false,
        },
      },
      particleCount: {
        label: "Particle Count",
        value: FireworkDefaultSettings.particleCount,
        min: 1,
        max: 10000,
        step: 10,
      },
      insideColor: {
        label: "Inside Color",
        value: FireworkDefaultSettings.insideColor,
      },
      outsideColor: {
        label: "Outside Color",
        value: FireworkDefaultSettings.outsideColor,
      },
      colorBias: {
        label: "Color Bias",
        value: FireworkDefaultSettings.colorBias,
        min: 0,
        max: 1,
        step: 0.0001,
      },
      particleSize: {
        label: "Particle Size",
        value: FireworkDefaultSettings.particleSize,
        min: 0,
        max: 2,
        step: 0.0001,
      },
      explosionRadius: {
        label: "Explosion Radius",
        value: FireworkDefaultSettings.explosionRadius,
        min: 0.0001,
        max: 4,
        step: 0.0001,
      },
      explosionEasing: {
        label: "Explosion Easing",
        value: FireworkDefaultSettings.explosionEasing,
        min: 1,
        max: 10,
        step: 1,
      },
      fallEasing: {
        label: "Fall Easing",
        value: FireworkDefaultSettings.fallEasing,
        min: 1,
        max: 10,
        step: 1,
      },
      twinkleFrequency: {
        label: "Twinkle Frequency",
        value: FireworkDefaultSettings.twinkleFrequency,
        min: 0,
        max: 300,
        step: 0.01,
      },
      twinkleAmplitude: {
        label: "Twinkle Amplitude",
        value: FireworkDefaultSettings.twinkleAmplitude,
        min: 0,
        max: 3,
        step: 0.0001,
      },
    },
    { collapsed: true },
  );
}
