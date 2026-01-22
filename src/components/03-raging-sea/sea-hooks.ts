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
    const uniforms = {
      surfaceColor: uniform(color("#01c4d2")),
      depthColor: uniform(color("#2a7eb7")),
      colorOffset: uniform(0.08),
      colorMultiplier: uniform(5),
      foamColor: uniform(color("#ffffff")),
      foamThreshold: uniform(0.02),
      foamSmoothness: uniform(0.05),
      waveFrequency: uniform(vec2(4, 4)),
      waveAmplitude: uniform(0.06),
      waveSpeed: uniform(0.4),
      noiseIterations: uniform(4),
      noiseFrequency: uniform(2),
      noiseStrength: uniform(0.15),
      edgeCut: uniform(0.2),
    };

    /* Waves Generation */
    const waveElevation = getWaveElevation({
      position: positionLocal,
      waveFrequency: uniforms.waveFrequency,
      waveAmplitude: uniforms.waveAmplitude,
      waveSpeed: uniforms.waveSpeed,
      noiseIterations: uniforms.noiseIterations,
      noiseFrequency: uniforms.noiseFrequency,
      noiseStrength: uniforms.noiseStrength,
    });
    const positionNode = positionLocal.add(vec3(0, 0, waveElevation));

    /* Water Color */
    const colorMixFactor = waveElevation
      .add(uniforms.colorOffset)
      .mul(uniforms.colorMultiplier);
    const waterColor = mix(
      uniforms.depthColor,
      uniforms.surfaceColor,
      colorMixFactor.smoothstep(0, 1),
    );
    /* Foam */
    const heightMask = smoothstep(
      uniforms.foamThreshold,
      uniforms.foamThreshold.add(uniforms.foamSmoothness),
      waveElevation,
    );
    const foamMask = texture(foamTexture, uv()).r.mul(heightMask);
    const colorNode = mix(waterColor, uniforms.foamColor, foamMask);

    /* Borders Fade */
    const coords = uv();
    const distToEdge = min(
      coords.x.min(coords.x.oneMinus()),
      coords.y.min(coords.y.oneMinus()),
    );
    const opacityNode = smoothstep(0, uniforms.edgeCut, distToEdge);

    return {
      nodes: { colorNode, positionNode, opacityNode },
      uniforms,
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
