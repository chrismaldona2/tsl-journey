/* eslint-disable react-hooks/refs */
import { useControls, folder } from "leva";
import { useRef } from "react";
import type { useSeaShadingMaterial } from "./use-sea-shading-material";
import { seaShadingConfig as config } from "../config";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

type SeaShadingUniforms = ReturnType<typeof useSeaShadingMaterial>["uniforms"];

export function useSeaShadingControls(uniforms: SeaShadingUniforms) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "🌅 9 — Raging Sea Shading",
    {
      Water: folder(
        {
          surfaceColor: {
            label: "Surface Color",
            value: config.water.surfaceColor,
            onChange: (v) => {
              uniformsRef.current.water.surfaceColor.value.set(v);
            },
          },
          depthColor: {
            label: "Depth Color",
            value: config.water.depthColor,
            onChange: (v) => {
              uniformsRef.current.water.depthColor.value.set(v);
            },
          },
          colorOffset: {
            label: "Color Offset",
            value: config.water.colorOffset,
            min: 0,
            max: 1,
            step: 0.01,
            onChange: (v) => {
              uniformsRef.current.water.colorOffset.value = v;
            },
          },
          colorMultiplier: {
            label: "Color Multiplier",
            value: config.water.colorMultiplier,
            min: 0,
            max: 10,
            onChange: (v) => {
              uniformsRef.current.water.colorMultiplier.value = v;
            },
          },
          foamColor: {
            label: "Foam Color",
            value: config.water.foamColor,
            onChange: (v) => uniformsRef.current.water.foamColor.value.set(v),
          },
          foamThreshold: {
            label: "Foam Threshold",
            value: config.water.foamThreshold,
            min: -0.1,
            max: 0.2,
            step: 0.001,
            onChange: (v) => {
              uniformsRef.current.water.foamThreshold.value = v;
            },
          },
          foamSmoothness: {
            label: "Foam Smoothness",
            value: config.water.foamSmoothness,
            min: 0.001,
            max: 0.2,
            step: 0.001,
            onChange: (v) => {
              uniformsRef.current.water.foamSmoothness.value = v;
            },
          },
          waveFrequency: {
            label: "Wave Frequency",
            value: config.water.waveFrequency,
            onChange: (v: typeof config.water.waveFrequency) =>
              uniformsRef.current.water.waveFrequency.value.set(...v),
          },
          waveAmplitude: {
            label: "Wave Amplitude",
            value: config.water.waveAmplitude,
            min: 0,
            max: 0.5,
            step: 0.001,
            onChange: (v) => {
              uniformsRef.current.water.waveAmplitude.value = v;
            },
          },
          waveSpeed: {
            label: "Wave Speed",
            value: config.water.waveSpeed,
            min: 0,
            max: 2,
            onChange: (v) => {
              uniformsRef.current.water.waveSpeed.value = v;
            },
          },
          noiseIterations: {
            label: "Noise Iterations",
            value: config.water.noiseIterations,
            min: 1,
            max: 8,
            step: 1,
            onChange: (v) => {
              uniformsRef.current.water.noiseIterations.value = v;
            },
          },
          noiseFrequency: {
            label: "Noise Frequency",
            value: config.water.noiseFrequency,
            min: 0,
            max: 10,
            onChange: (v) => {
              uniformsRef.current.water.noiseFrequency.value = v;
            },
          },
          noiseStrength: {
            label: "Noise Strength",
            value: config.water.noiseStrength,
            min: 0,
            max: 1,
            onChange: (v) => {
              uniformsRef.current.water.noiseStrength.value = v;
            },
          },
          edgeCut: {
            label: "Edge Cut",
            value: config.water.edgeCut,
            min: 0,
            max: 1,
            onChange: (v) => {
              uniformsRef.current.water.edgeCut.value = v;
            },
          },
          neighborShift: {
            label: "Neighbor Shift",
            value: config.water.neighborShift,
            min: 0,
            max: 0.5,
            step: 0.0001,
            onChange: (v) => {
              uniformsRef.current.water.neighborShift.value = v;
            },
          },
        },
        { collapsed: true },
      ),

      "Point Light": folder(
        {
          pointLightColor: {
            label: "Color",
            value: config.pointLight.color,
            onChange: (v) => {
              uniformsRef.current.pointLight.color.value.set(v);
            },
          },
          pointLightIntensity: {
            label: "Intensity",
            value: config.pointLight.intensity,
            min: 0,
            max: 5,
            onChange: (v) => {
              uniformsRef.current.pointLight.intensity.value = v;
            },
          },
          pointLightPos: {
            label: "Position",
            value: config.pointLight.position,
            onChange: (v: typeof config.pointLight.position) => {
              uniformsRef.current.pointLight.position.value.set(...v);
            },
          },

          pointLightDecay: {
            label: "Decay",
            value: config.pointLight.decay,
            min: 0,
            max: 2,
            onChange: (v) => {
              uniformsRef.current.pointLight.decay.value = v;
            },
          },
          pointLightSpecular: {
            label: "Specular Power",
            value: config.pointLight.specularPower,
            min: 1,
            max: 100,
            onChange: (v) => {
              uniformsRef.current.pointLight.specularPower.value = v;
            },
          },
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  );

  const pointLgtHelperRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!pointLgtHelperRef.current) return;

    pointLgtHelperRef.current.position.copy(
      uniformsRef.current.pointLight.position.value,
    );
  });

  return { pointLgtHelperRef };
}
