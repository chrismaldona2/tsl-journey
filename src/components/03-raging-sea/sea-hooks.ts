import { useMemo, useRef } from "react";
import {
  uniform,
  color,
  vec2,
  positionLocal,
  vec3,
  mix,
  smoothstep,
  texture,
  uv,
  min,
} from "three/tsl";
import { getWaveElevation } from "./sea-nodes";
import { useTexture } from "@react-three/drei";
import { useControls } from "leva";

export function useSeaMaterial() {
  const foamTexture = useTexture("/textures/foam.webp");

  return useMemo(() => {
    /* Uniforms */
    const surfaceColor = uniform(color("#01c4d2"));
    const depthColor = uniform(color("#2a7eb7"));
    const colorOffset = uniform(0.08);
    const colorMultiplier = uniform(5);
    const foamColor = uniform(color("#ffffff"));
    const foamThreshold = uniform(0.02);
    const foamSmoothness = uniform(0.05);
    const waveFrequency = uniform(vec2(4, 4));
    const waveAmplitude = uniform(0.06);
    const waveSpeed = uniform(0.4);
    const noiseIterations = uniform(4);
    const noiseFrequency = uniform(2);
    const noiseStrength = uniform(0.15);
    const edgeCut = uniform(0.2);

    /* Waves Generation */
    const waveElevation = getWaveElevation({
      position: positionLocal,
      waveFrequency,
      waveAmplitude,
      waveSpeed,
      noiseIterations,
      noiseFrequency,
      noiseStrength,
    });
    const positionNode = positionLocal.add(vec3(0, 0, waveElevation));

    /* Foam */
    const heightMask = smoothstep(
      foamThreshold,
      foamThreshold.add(foamSmoothness),
      waveElevation,
    );
    const foamMask = texture(foamTexture, uv()).r.mul(heightMask);

    /* Color */
    const colorMixFactor = waveElevation.add(colorOffset).mul(colorMultiplier);
    const waterColor = mix(depthColor, surfaceColor, colorMixFactor.saturate());

    const colorNode = mix(waterColor, foamColor, foamMask);

    /* Borders Fade */
    const coords = uv();
    const distToEdge = min(
      coords.x.min(coords.x.oneMinus()),
      coords.y.min(coords.y.oneMinus()),
    );
    const opacityNode = smoothstep(0, edgeCut, distToEdge);

    return {
      nodes: { colorNode, positionNode, opacityNode },
      uniforms: {
        surfaceColor,
        depthColor,
        colorOffset,
        colorMultiplier,
        foamColor,
        foamThreshold,
        foamSmoothness,
        waveFrequency,
        waveAmplitude,
        waveSpeed,
        noiseIterations,
        noiseFrequency,
        noiseStrength,
        edgeCut,
      },
    };
  }, [foamTexture]);
}

type SeaUniforms = ReturnType<typeof useSeaMaterial>["uniforms"];

export function useSeaControls(uniforms: SeaUniforms) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "🌊 3 — Raging Sea",
    {
      surfaceColor: {
        label: "Surface Color",
        value: "#01c4d2",
        onChange: (v) => {
          uniformsRef.current.surfaceColor.value.set(v);
        },
      },
      depthColor: {
        label: "Depth Color",
        value: "#2a7eb7",
        onChange: (v) => {
          uniformsRef.current.depthColor.value.set(v);
        },
      },
      colorOffset: {
        label: "Color Offset",
        value: 0.08,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => {
          uniformsRef.current.colorOffset.value = v;
        },
      },
      colorMultiplier: {
        label: "Color Multiplier",
        value: 5,
        min: 0,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.colorMultiplier.value = v;
        },
      },
      foamColor: {
        label: "Foam Color",
        value: "#ffffff",
        onChange: (v) => uniformsRef.current.foamColor.value.set(v),
      },
      foamThreshold: {
        label: "Foam Threshold",
        value: 0.02,
        min: -0.1,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.foamThreshold.value = v;
        },
      },
      foamSmoothness: {
        label: "Foam Smoothness",
        value: 0.05,
        min: 0.001,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.foamSmoothness.value = v;
        },
      },
      waveFrequency: {
        label: "Wave Frequency",
        value: { x: 4, y: 4 },
        onChange: (v) => uniformsRef.current.waveFrequency.value.set(v.x, v.y),
      },
      waveAmplitude: {
        label: "Wave Amplitude",
        value: 0.06,
        min: 0,
        max: 0.5,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.waveAmplitude.value = v;
        },
      },
      waveSpeed: {
        label: "Wave Speed",
        value: 0.4,
        min: 0,
        max: 2,
        onChange: (v) => {
          uniformsRef.current.waveSpeed.value = v;
        },
      },
      noiseIterations: {
        label: "Noise Iterations",
        value: 4,
        min: 1,
        max: 8,
        step: 1,
        onChange: (v) => {
          uniformsRef.current.noiseIterations.value = v;
        },
      },
      noiseFrequency: {
        label: "Noise Frequency",
        value: 2,
        min: 0,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.noiseFrequency.value = v;
        },
      },
      noiseStrength: {
        label: "Noise Strength",
        value: 0.15,
        min: 0,
        max: 1,
        onChange: (v) => {
          uniformsRef.current.noiseStrength.value = v;
        },
      },
      edgeCut: {
        label: "Edge Cut",
        value: 0.2,
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
