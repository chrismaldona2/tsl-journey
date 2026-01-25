import { useControls } from "leva";
import { useRef } from "react";
import type { useHologramMaterial } from "./use-hologram-material";
import { HologramConfig as config } from "../config";

type HologramUniforms = ReturnType<typeof useHologramMaterial>["uniforms"];

export function useHologramControls(uniforms: HologramUniforms) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "🔮 6 — Hologram",
    {
      baseColor: {
        label: "Color",
        value: config.color,
        onChange: (v) => uniformsRef.current.color.value.set(v),
      },
      scanlineSpeed: {
        label: "Scan Speed",
        value: config.scanlineSpeed,
        min: -0.1,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.scanlineSpeed.value = v;
        },
      },
      scanlineDensity: {
        label: "Scan Density",
        value: config.scanlineDensity,
        min: 1,
        max: 150,
        onChange: (v) => {
          uniformsRef.current.scanlineDensity.value = v;
        },
      },
      scanlineSharpness: {
        label: "Scan Sharpness",
        value: config.scanlineSharpness,
        min: 1,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.scanlineSharpness.value = v;
        },
      },
      fresnelIntensity: {
        label: "Fresnel Intensity",
        value: config.fresnelIntensity,
        min: 0,
        max: 5,
        onChange: (v) => {
          uniformsRef.current.fresnelIntensity.value = v;
        },
      },
      fresnellFalloff: {
        label: "Fresnel Falloff",
        value: config.fresnelFalloff,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => {
          uniformsRef.current.fresnelFalloff.value = v;
        },
      },
      fresnelPower: {
        label: "Fresnel Power",
        value: config.fresnelPower,
        min: 0,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.fresnelPower.value = v;
        },
      },

      glitchAmplitude: {
        label: "Glitch Amplitude",
        value: config.glitchAmplitude,
        min: 0,
        max: 5,
        onChange: (v) => {
          uniformsRef.current.glitchAmplitude.value = v;
        },
      },
      glitchThreshold: {
        label: "Glitch Threshold",
        value: config.glitchThreshold,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => {
          uniformsRef.current.glitchThreshold.value = v;
        },
      },
    },
    { collapsed: true },
  );
}
