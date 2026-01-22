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
  cameraPosition,
  modelWorldMatrix,
  normalWorld,
} from "three/tsl";
import { useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { getWaveElevation } from "../03-raging-sea/sea-nodes";
import { directionalLight } from "../08-lights-shading/nodes";

export function useSeaMaterial() {
  const foamTexture = useTexture("/textures/foam.webp");

  return useMemo(() => {
    const uniforms = {
      water: {
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
      },
      directionalLight: {
        color: uniform(color("white")),
        intensity: uniform(1),
        position: uniform(vec3(-1, 1, 0)),
        specularPower: uniform(30),
      },
    };

    /* Waves Generation */
    const waveElevation = getWaveElevation({
      position: positionLocal,
      waveFrequency: uniforms.water.waveFrequency,
      waveAmplitude: uniforms.water.waveAmplitude,
      waveSpeed: uniforms.water.waveSpeed,
      noiseIterations: uniforms.water.noiseIterations,
      noiseFrequency: uniforms.water.noiseFrequency,
      noiseStrength: uniforms.water.noiseStrength,
    });
    const positionNode = positionLocal.add(vec3(0, 0, waveElevation));

    /* Foam */
    const heightMask = smoothstep(
      uniforms.water.foamThreshold,
      uniforms.water.foamThreshold.add(uniforms.water.foamSmoothness),
      waveElevation,
    );
    const foamMask = texture(foamTexture, uv()).r.mul(heightMask);

    /* Color */
    const colorMixFactor = waveElevation
      .add(uniforms.water.colorOffset)
      .mul(uniforms.water.colorMultiplier);
    const waterColor = mix(
      uniforms.water.depthColor,
      uniforms.water.surfaceColor,
      colorMixFactor.smoothstep(0, 1),
    );

    /* Shading */
    const positionWorld = modelWorldMatrix.mul(positionNode).xyz;
    const viewDirection = cameraPosition.sub(positionWorld).normalize();
    const waterNormals = normalWorld;
    const directionalLgt = directionalLight({
      lightColor: uniforms.directionalLight.color,
      lightIntensity: uniforms.directionalLight.intensity,
      specularPower: uniforms.directionalLight.specularPower,
      lightPosition: uniforms.directionalLight.position,
      viewDirection: viewDirection,
      normal: waterNormals,
    });
    const lights = vec3(0).add(directionalLgt);

    const colorNode = mix(waterColor, uniforms.water.foamColor, foamMask).mul(
      lights,
    );

    /* Borders Fade */
    const coords = uv();
    const distToEdge = min(
      coords.x.min(coords.x.oneMinus()),
      coords.y.min(coords.y.oneMinus()),
    );
    const opacityNode = smoothstep(0, uniforms.water.edgeCut, distToEdge);

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
    "🌅 9 — Raging Sea Shading",
    {
      surfaceColor: {
        label: "Surface Color",
        value: "#01c4d2",
        onChange: (v) => {
          uniformsRef.current.water.surfaceColor.value.set(v);
        },
      },
      depthColor: {
        label: "Depth Color",
        value: "#2a7eb7",
        onChange: (v) => {
          uniformsRef.current.water.depthColor.value.set(v);
        },
      },
      colorOffset: {
        label: "Color Offset",
        value: 0.08,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => {
          uniformsRef.current.water.colorOffset.value = v;
        },
      },
      colorMultiplier: {
        label: "Color Multiplier",
        value: 5,
        min: 0,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.water.colorMultiplier.value = v;
        },
      },
      foamColor: {
        label: "Foam Color",
        value: "#ffffff",
        onChange: (v) => uniformsRef.current.water.foamColor.value.set(v),
      },
      foamThreshold: {
        label: "Foam Threshold",
        value: 0.02,
        min: -0.1,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.water.foamThreshold.value = v;
        },
      },
      foamSmoothness: {
        label: "Foam Smoothness",
        value: 0.05,
        min: 0.001,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.water.foamSmoothness.value = v;
        },
      },
      waveFrequency: {
        label: "Wave Frequency",
        value: { x: 4, y: 4 },
        onChange: (v) =>
          uniformsRef.current.water.waveFrequency.value.set(v.x, v.y),
      },
      waveAmplitude: {
        label: "Wave Amplitude",
        value: 0.06,
        min: 0,
        max: 0.5,
        step: 0.001,
        onChange: (v) => {
          uniformsRef.current.water.waveAmplitude.value = v;
        },
      },
      waveSpeed: {
        label: "Wave Speed",
        value: 0.4,
        min: 0,
        max: 2,
        onChange: (v) => {
          uniformsRef.current.water.waveSpeed.value = v;
        },
      },
      noiseIterations: {
        label: "Noise Iterations",
        value: 4,
        min: 1,
        max: 8,
        step: 1,
        onChange: (v) => {
          uniformsRef.current.water.noiseIterations.value = v;
        },
      },
      noiseFrequency: {
        label: "Noise Frequency",
        value: 2,
        min: 0,
        max: 10,
        onChange: (v) => {
          uniformsRef.current.water.noiseFrequency.value = v;
        },
      },
      noiseStrength: {
        label: "Noise Strength",
        value: 0.15,
        min: 0,
        max: 1,
        onChange: (v) => {
          uniformsRef.current.water.noiseStrength.value = v;
        },
      },
      edgeCut: {
        label: "Edge Cut",
        value: 0.2,
        min: 0,
        max: 1,
        onChange: (v) => {
          uniformsRef.current.water.edgeCut.value = v;
        },
      },
    },
    { collapsed: true },
  );
}
