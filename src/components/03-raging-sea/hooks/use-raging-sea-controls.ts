import { useControls } from "leva";
import { useRef } from "react";
import type { useRagingSeaMaterial } from "./use-raging-sea-material";
import { RagingSeaConfig as config } from "../config";

type SeaUniforms = ReturnType<typeof useRagingSeaMaterial>["uniforms"];

export function useRagingSeaControls(uniforms: SeaUniforms) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "🌊 3 — Raging Sea",
    {
      surfaceColor: {
        label: "Surface Color",
        value: config.surfaceColor,
        onChange: (v) => {
          uniformsRef.current.surfaceColor.value.set(v);
        },
      },
      depthColor: {
        label: "Depth Color",
        value: config.depthColor,
        onChange: (v) => {
          uniformsRef.current.depthColor.value.set(v);
        },
      },
      colorOffset: {
        label: "Color Offset",
        value: config.colorOffset,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => {
          uniformsRef.current.colorOffset.value = v;
        },
      },
      colorMultiplier: {
        label: "Color Multiplier",
        value: config.colorMultiplier,
        min: 0,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.colorMultiplier.value = v;
        },
      },
      foamColor: {
        label: "Foam Color",
        value: config.foamColor,
        onChange: (v) => uniformsRef.current.foamColor.value.set(v),
      },
      foamThreshold: {
        label: "Foam Threshold",
        value: config.foamThreshold,
        min: -0.1,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.foamThreshold.value = v;
        },
      },
      foamSmoothness: {
        label: "Foam Smoothness",
        value: config.foamSmoothness,
        min: 0.001,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.foamSmoothness.value = v;
        },
      },
      waveFrequency: {
        label: "Wave Frequency",
        value: config.waveFrequency,
        onChange: (v: typeof config.waveFrequency) => {
          uniformsRef.current.waveFrequency.value.set(...v);
        },
      },
      waveAmplitude: {
        label: "Wave Amplitude",
        value: config.waveAmplitude,
        min: 0,
        max: 0.5,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.waveAmplitude.value = v;
        },
      },
      waveSpeed: {
        label: "Wave Speed",
        value: config.waveSpeed,
        min: 0,
        max: 2,
        onChange: (v) => {
          uniformsRef.current.waveSpeed.value = v;
        },
      },
      noiseIterations: {
        label: "Noise Iterations",
        value: config.noiseIterations,
        min: 1,
        max: 8,
        step: 1,
        onChange: (v) => {
          uniformsRef.current.noiseIterations.value = v;
        },
      },
      noiseFrequency: {
        label: "Noise Frequency",
        value: config.noiseFrequency,
        min: 0,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.noiseFrequency.value = v;
        },
      },
      noiseStrength: {
        label: "Noise Strength",
        value: config.noiseStrength,
        min: 0,
        max: 1,
        onChange: (v) => {
          uniformsRef.current.noiseStrength.value = v;
        },
      },
      edgeCut: {
        label: "Edge Cut",
        value: config.edgeCut,
        min: 0,
        max: 1,
        onChange: (v) => {
          uniformsRef.current.edgeCut.value = v;
        },
      },
    },
    { collapsed: true },
  );
}
