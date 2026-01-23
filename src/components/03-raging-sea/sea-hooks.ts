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
import { SeaConfig as config } from "./config";

export function useSeaMaterial() {
  const foamTexture = useTexture("/textures/foam.webp");

  return useMemo(() => {
    const uniforms = {
      surfaceColor: uniform(color(config.surfaceColor)),
      depthColor: uniform(color(config.depthColor)),
      colorOffset: uniform(config.colorOffset),
      colorMultiplier: uniform(config.colorMultiplier),
      foamColor: uniform(color(config.foamColor)),
      foamThreshold: uniform(config.foamThreshold),
      foamSmoothness: uniform(config.foamSmoothness),
      waveFrequency: uniform(vec2(...config.waveFrequency)),
      waveAmplitude: uniform(config.waveAmplitude),
      waveSpeed: uniform(config.waveSpeed),
      noiseIterations: uniform(config.noiseIterations),
      noiseFrequency: uniform(config.noiseFrequency),
      noiseStrength: uniform(config.noiseStrength),
      edgeCut: uniform(config.edgeCut),
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
